# 文件路径: src/sriu/core/compiler.py
import json
import os
from typing import List, Optional

# [Best Practice] 使用官方推荐的导入路径
from google import genai
from google.genai import types
from pydantic import ValidationError

# [Phase 6] 引入 ActionType 以支持原生工具定义
from .state import TaskState, TaskStatus, Action, ActionType

# [Phase 6] Prompt 升级：原生文件工具 + 逻辑锁
SYSTEM_PROMPT = """
You are the SRIU (Self-Regulating Intelligence Unit) Semantic Compiler.
Target OS: Windows 11 (PowerShell Environment).
Your goal: Convert Natural Language into a Deterministic Execution Plan (TaskState).

### 1. THE SAFETY CONSTITUTION (AXIOMS)
You are BOUND by these absolute rules. You cannot override them.
[Axiom 1 - Filesystem Integrity]
- NEVER modify/delete files in system directories: `C:\\Windows`, `C:\\Program Files`, `C:\\$Recycle.Bin`.
- NEVER delete files without explicit user intent.
[Axiom 2 - Execution Bounds]
- NEVER create infinite loops. All loops must have a mathematically provable upper bound.
- NEVER execute obscure/encoded Shell commands (Base64, etc.).

### 2. LOGIC LOCK PROTOCOL (Z3 SOLVER)
IF the user intent violates or approaches the boundaries of the SAFETY AXIOMS (e.g., "Delete folder X", "Loop forever"):
1. You MUST generate a `verification_script` using the `z3-solver` library.
2. The script must MODEL the action and the constraint mathematically.
3. The script must strictly print "SAFE" ONLY if the constraint is satisfied (UNSAT means no violation found).
   - Example Pattern:
     `s = Solver(); s.add(violation_condition); if s.check() == unsat: print("SAFE")`

### 3. EXPLICIT OUTPUT PROTOCOL
- If the user asks a question (QA), you MUST use `run_python` to `print()` the final answer.
- Do NOT output the answer in the JSON `rationale`. The Runtime must see it in STDOUT.

### 4. TOOLSET (STRICT PRIORITY)
Use `ActionType` strictly. PREFER Native tools over Shell.

1. `read_file` (Native) -> Args: path
   - Use for reading text/config. Safer than `cat`.
2. `write_file` (Native) -> Args: path, content
   - Use for creating/overwriting files. Safer than `echo >`.
3. `run_python` (Logic) -> Args: code
   - Use for math, logic, complex data processing.
4. `run_shell` (System) -> Args: command
   - ONLY for: git, netstat, ping, systeminfo.
   - AVOID file manipulation via shell if possible.

### 5. OUTPUT FORMAT
Return a SINGLE valid JSON object matching the `TaskState` Pydantic schema.
"""

class SemanticCompiler:
    def __init__(self, model_id: str):
        """
        初始化编译器 - 使用 Google GenAI SDK (Modern)
        """
        # 获取 API KEY，不再依赖 os.getenv 的默认值，强制检查
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("(x_x) GEMINI_API_KEY not found in environment.")
        
        # [Best Practice] Client 初始化
        self.client = genai.Client(api_key=self.api_key)
        self.model_id = model_id
        # [Kaomoji] 替换 Emoji
        print(f"   (o_O) Compiler attached to logic core: [{self.model_id}]")

    @staticmethod
    def get_available_models() -> List[str]:
        """
        动态获取可用模型列表 (保持原有逻辑以支持 Console 启动)
        """
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return []
        
        try:
            # 临时 Client 用于发现模型
            client = genai.Client(api_key=api_key)
            valid_models = []
            
            # 获取模型列表 (SDK v1)
            # 注意：pager 可能会返回大量数据，这里做简单的过滤
            for m in client.models.list():
                name = m.name.lower()
                # 过滤策略：只保留 gemini 系列，且排除 embedding 模型
                if "gemini" in name and "embedding" not in name:
                    # 移除 'models/' 前缀
                    clean_id = name.replace("models/", "")
                    valid_models.append(clean_id)
            
            # 按名称排序，通常较新的模型版本号较大
            return sorted(valid_models, reverse=True)
            
        except Exception as e:
            # [Kaomoji] Error Log
            print(f"(>_<) Failed to fetch models: {e}")
            # 降级返回默认列表
            return ["gemini-2.0-flash", "gemini-1.5-pro"]

    def compile(self, user_instruction: str) -> TaskState:
        print(f">> (o_O) Thinking... [Logic Lock: ACTIVE]")
        
        try:
            # [Phase 6 Upgrade] 使用 response_schema 进行结构化输出
            # 这会强制 LLM 输出完全符合 TaskState (包括 ActionType 枚举) 的 JSON
            config = types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema=TaskState, 
                temperature=0.1, # 保持冷静
                max_output_tokens=4000,
            )

            response = self.client.models.generate_content(
                model=self.model_id,
                contents=user_instruction,
                config=config
            )
            
            if not response.text:
                raise ValueError("Empty response from Gemini API")

            # [Phase 6 Upgrade] 直接使用 Pydantic 解析 JSON
            # response.text 已经是完美的 JSON 格式
            task_plan = TaskState.model_validate_json(response.text)
            
            # 补充原始意图 (如果是空的话)
            if not task_plan.original_intent:
                task_plan.original_intent = user_instruction

            return task_plan

        except ValidationError as ve:
            print(f"(x_x) JSON Schema Validation Failed: {ve}")
            # 返回失败状态
            return TaskState(
                original_intent=user_instruction, 
                current_status=TaskStatus.FAILED,
                history=[f"Schema Error: {str(ve)}"]
            )
        except Exception as e:
            print(f"(×_×#) Compiler Fatal Error: {str(e)}")
            return TaskState(
                original_intent=user_instruction,
                current_status=TaskStatus.FAILED,
                history=[f"Compilation Failed: {str(e)}"]
            )