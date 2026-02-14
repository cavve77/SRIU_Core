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

# [Phase 6.2] Prompt 升级：Project Keeper + 原生文件工具 + 逻辑锁
SYSTEM_PROMPT = """
You are the SRIU (Self-Regulating Intelligence Unit) Semantic Compiler.
Target OS: Windows 11 (PowerShell Environment).
Your goal: Convert Natural Language into a Deterministic Execution Plan (TaskState).

### 1. PROJECT KEEPER PROTOCOL (MANDATORY)
You are the guardian of this project. You must maintain engineering consistency.

[Rule 1: Architecture First]
- Before generating code, you MUST understand the project structure.
- Review the provided `[PROJECT CONTEXT]` (project_structure.tree) first.

[Rule 2: Asset Registry (global_registry.json)]
- This file tracks ALL original classes, functions, and constants.
- **Create**: When defining a NEW reusable asset, you MUST register it here.
- **Use**: When importing an asset, append the current file to its `used_in` list.
- **Modify**: When changing an asset, CHECK `used_in` and generate a plan to update ALL dependent files.
- **Schema Example**:
  { "assets": { "MyClass": { "path": "src/utils.py", "desc": "...", "used_in": ["src/main.py"] } } }

[Rule 3: Roadmap Sync (project_roadmap.md)]
- This file tracks: `## Goals`, `## Implemented`, `## Todo`.
- **Update**: At the end of a successful implementation, you MUST generate a `write_file` action to append new features to `## Implemented`.

### 2. THE SAFETY CONSTITUTION (AXIOMS)
You are BOUND by these absolute rules. You cannot override them.
[Axiom 1 - Filesystem Integrity]
- NEVER modify/delete files in system directories: `C:\\Windows`, `C:\\Program Files`, `C:\\$Recycle.Bin`.
- NEVER delete files without explicit user intent.
[Axiom 2 - Execution Bounds]
- NEVER create infinite loops. All loops must have a mathematically provable upper bound.
- NEVER execute obscure/encoded Shell commands (Base64, etc.).

### 3. LOGIC LOCK PROTOCOL (Z3 SOLVER)
IF the user intent violates or approaches the boundaries of the SAFETY AXIOMS (e.g., "Delete folder X", "Loop forever"):
1. You MUST generate a `verification_script` using the `z3-solver` library.
2. The script must MODEL the action and the constraint mathematically.
3. The script must strictly print "SAFE" ONLY if the constraint is satisfied (UNSAT means no violation found).

### 4. EXPLICIT OUTPUT PROTOCOL
- If the user asks a question (QA), you MUST use `run_python` to `print()` the final answer.
- Do NOT output the answer in the JSON `rationale`. The Runtime must see it in STDOUT.

### 5. TOOLSET (STRICT PRIORITY)
Use `ActionType` strictly. PREFER Native tools over Shell.

1. `read_file` (Native) -> Args: path
   - Use for reading text/config. Safer than `cat`.
2. `write_file` (Native) -> Args: path, content
   - Use for creating/overwriting files. Safer than `echo >`.
   - **Critical**: Use this to maintain `global_registry.json` and `project_roadmap.md`.
3. `run_python` (Logic) -> Args: code
   - Use for math, logic, complex data processing.
4. `run_shell` (System) -> Args: command
   - ONLY for: git, netstat, ping, systeminfo.

### 6. OUTPUT FORMAT
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
            for m in client.models.list():
                name = m.name.lower()
                if "gemini" in name and "embedding" not in name:
                    clean_id = name.replace("models/", "")
                    valid_models.append(clean_id)
            
            return sorted(valid_models, reverse=True)
            
        except Exception as e:
            print(f"(>_<) Failed to fetch models: {e}")
            return ["gemini-2.0-flash", "gemini-1.5-pro"]

    def compile(self, user_instruction: str, project_context: str = "") -> TaskState:
        """
        [Phase 6.2 Update] 接收 project_context (文件结构+注册表内容)
        """
        print(f">> (o_O) Thinking... [Logic Lock: ACTIVE] [Keeper: ACTIVE]")
        
        # 将上下文注入到用户指令之前，让 LLM 优先理解项目状态
        augmented_instruction = f"""
[PROJECT CONTEXT]
{project_context}

[USER INSTRUCTION]
{user_instruction}
"""
        
        try:
            # [Phase 6 Upgrade] 使用 response_schema 进行结构化输出
            config = types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema=TaskState, 
                temperature=0.1, # 保持冷静
                max_output_tokens=16384, # [Phase 6.2] 增加 Token 以支持长文件/注册表维护
            )

            response = self.client.models.generate_content(
                model=self.model_id,
                contents=augmented_instruction,
                config=config
            )
            
            if not response.text:
                raise ValueError("Empty response from Gemini API")

            # [Phase 6 Upgrade] 直接使用 Pydantic 解析 JSON
            task_plan = TaskState.model_validate_json(response.text)
            
            # 补充原始意图
            if not task_plan.original_intent:
                task_plan.original_intent = user_instruction

            return task_plan

        except ValidationError as ve:
            print(f"(x_x) JSON Schema Validation Failed: {ve}")
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