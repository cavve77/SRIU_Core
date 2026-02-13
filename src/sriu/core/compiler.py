# 文件路径: src/sriu/core/compiler.py
import json
import os
from typing import List, Optional

# [Best Practice] 使用官方推荐的导入路径
from google import genai
from google.genai import types

from .state import TaskState, TaskStatus

# [Phase 5.2] Prompt 升级：强制显式输出
SYSTEM_PROMPT = """
You are the SRIU (Self-Regulating Intelligence Unit) Semantic Compiler.
Your goal is to convert Natural Language Instructions into a Deterministic Execution Plan (JSON).

### PROTOCOL V0.5 (LOGIC LOCK)
1. **Safety First**: 
   - If the user asks for high-risk operations (e.g., deleting files), generate a Z3 Proof in `verification_script`.
2. **Explicit Output**:
   - If the user asks a question (e.g., "What is 1+1?"), you MUST use `run_python` to `print()` the answer. Do not just output an empty plan.

### TOOLSET
1. `run_shell`
   - args: { "command": "string" }
   - description: Execute PowerShell commands.
2. `run_python`
   - args: { "code": "string" }
   - description: Execute Python scripts. Use this to PRINT answers to the user.

### OUTPUT FORMAT (STRICT JSON)
{
  "original_intent": "User instruction here",
  "plan": [
    { 
      "tool_name": "run_python", 
      "args": { "code": "print('The answer is 42')" }, 
      "rationale": "Using Python to output the answer explicitly." 
    }
  ],
  "verification_script": "from z3 import *\\nprint('SAFE')"  // Optional
}
"""


class SemanticCompiler:
    def __init__(self, model_id: str):
        """
        初始化编译器 - 使用 Google GenAI SDK (Modern)
        """
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found.")
        
        # [Best Practice] Client 初始化
        self.client = genai.Client(api_key=api_key)
        self.model_id = model_id
        # [Kaomoji] 替换 Emoji
        print(f"   (o_O) Compiler attached to logic core: [{self.model_id}]")

    @staticmethod
    def get_available_models() -> List[str]:
        """
        动态获取可用模型列表 (修复版)
        """
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return []
        
        try:
            client = genai.Client(api_key=api_key)
            valid_models = []
            
            # 获取模型列表
            for m in client.models.list():
                name = m.name.lower()
                if "gemini" in name and "embedding" not in name:
                    clean_id = name.replace("models/", "")
                    valid_models.append(clean_id)
            
            return sorted(valid_models, reverse=True)
            
        except Exception as e:
            # [Kaomoji] 替换 Emoji (Warning)
            print(f"(>_<) Failed to fetch models: {e}")
            return ["gemini-1.5-flash", "gemini-1.5-pro"]

    def compile(self, user_instruction: str) -> TaskState:
        # 构建 Prompt
        full_prompt = f"{SYSTEM_PROMPT}\n\nUSER INSTRUCTION: {user_instruction}\n\nJSON PLAN:"
        
        try:
            # [Best Practice] 使用 types.GenerateContentConfig 进行类型安全的配置
            config = types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1,
                max_output_tokens=2000,
            )

            response = self.client.models.generate_content(
                model=self.model_id,
                contents=full_prompt,
                config=config
            )
            
            if not response.text:
                raise ValueError("Empty response from Gemini API")

            # 解析 JSON
            data = json.loads(response.text)
            
            # 数据清洗
            if "original_intent" not in data:
                data["original_intent"] = user_instruction

            # 返回任务状态
            return TaskState(**data)
            
        except Exception as e:
            # [Kaomoji] 替换 Emoji (Error)
            print(f"(×_×#) Compiler Error: {e}")
            return TaskState(
                original_intent=user_instruction,
                current_status=TaskStatus.FAILED,
                history=[f"Compilation Failed: {str(e)}"]
            )