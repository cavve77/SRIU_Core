# 文件路径: src/sriu/core/compiler.py
import os
import json
import re
from typing import Optional
from dotenv import load_dotenv
from google import genai
from pydantic import ValidationError

# 引入状态定义
from .state import TaskState, Action, TaskStatus

# 加载环境变量
load_dotenv()

class SemanticCompiler:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("FATAL: GEMINI_API_KEY not found in .env or environment!")
        
        # 初始化 Gemini 客户端
        self.client = genai.Client(api_key=api_key)
        self.model_name = "gemini-2.0-flash" 

    def _clean_json_response(self, text: str) -> str:
        """清洗 Gemini 返回的 Markdown 代码块"""
        text = re.sub(r"^```json\s*", "", text, flags=re.MULTILINE)
        text = re.sub(r"^```\s*", "", text, flags=re.MULTILINE)
        text = re.sub(r"```$", "", text, flags=re.MULTILINE)
        return text.strip()

    def compile_intent(self, user_intent: str) -> TaskState:
        """
        核心方法：将自然语言编译为结构化任务状态
        """
        print(f"[*] Compiling Intent: '{user_intent}' ...")
        
        # 1. 构建系统提示词 (包含 write_file 协议修复)
        prompt = f"""
        You are the SRIU (Self-Regulating Intelligence Unit) Semantic Compiler.
        Your goal is to translate a User Intent into a deterministic execution plan.

        TARGET SCHEMA (JSON):
        {{
            "original_intent": "{user_intent}",
            "plan": [
                {{
                    "tool_name": "One of [run_shell, python_repl, write_file]",
                    "code": "The exact code or parameters",
                    "rationale": "Why this step is necessary"
                }}
            ]
        }}

        RULES:
        1. You must output VALID JSON only. No chatting.
        2. Break complex tasks into multiple atomic actions in the 'plan' list.
        3. Tool usage:
           - 'run_shell': for PowerShell commands (dir, git, pip, mkdir).
           - 'python_repl': for pure logic, math, or data processing.
           - 'write_file': MUST use the format "filename|||content" in the 'code' field. 
             Example: "test.txt|||Hello World". Use '\\n' for newlines.
        4. If the intent is unclear, generate a plan with a single action to 'echo' a clarification question.

        USER INTENT:
        "{user_intent}"
        """

        # 2. 调用 Gemini
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            raw_text = response.text
        except Exception as e:
            print(f"[!] API Call Failed: {e}")
            return TaskState(original_intent=user_intent, current_status=TaskStatus.FAILED)

        # 3. 解析与验证
        try:
            cleaned_json = self._clean_json_response(raw_text)
            data = json.loads(cleaned_json)
            
            if "original_intent" not in data:
                data["original_intent"] = user_intent
                
            task = TaskState(**data)
            task.current_status = TaskStatus.THINKING
            print(f"[+] Compilation Success. Generated {len(task.plan)} steps.")
            return task

        except (json.JSONDecodeError, ValidationError) as e:
            print(f"[!] Compilation Error (Invalid JSON/Schema): {e}")
            print(f"[DEBUG] Raw Output: {raw_text}")
            return TaskState(original_intent=user_intent, current_status=TaskStatus.FAILED)

    def compile_fix(self, original_task: TaskState, error_log: str) -> TaskState:
        """
        修复模式：当执行失败时，基于错误日志生成新的修复计划
        """
        print(f"[*] Analyzing Error & Generating Fix...")
        
        prompt = f"""
        SYSTEM ALERT: The previous execution plan FAILED.
        You are the SRIU Debugger. Your goal is to fix the error and complete the original intent.

        ORIGINAL INTENT:
        "{original_task.original_intent}"

        FAILED PLAN HISTORY:
        {json.dumps([a.dict() for a in original_task.plan], indent=2)}

        ERROR LOG (STDERR):
        "{error_log}"

        INSTRUCTIONS:
        1. Analyze the error log carefully.
        2. Generate a NEW plan that fixes the issue or tries an alternative approach.
        3. Output valid JSON matching the standard TaskState schema.
        4. If the error implies the task is impossible, use a 'python_repl' tool to print a detailed explanation.
        5. For 'write_file', REMEMBER the format: "filename|||content".

        TARGET SCHEMA (JSON):
        {{
            "original_intent": "{original_task.original_intent}",
            "plan": [ ... corrected steps ... ]
        }}
        """

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            
            cleaned_json = self._clean_json_response(response.text)
            data = json.loads(cleaned_json)
            
            if "original_intent" not in data:
                data["original_intent"] = original_task.original_intent
                
            new_task = TaskState(**data)
            new_task.current_status = TaskStatus.THINKING
            print(f"[+] Fix Plan Generated. New Steps: {len(new_task.plan)}")
            return new_task

        except Exception as e:
            print(f"[!] Fix Generation Failed: {e}")
            # 如果修复也失败了，就真的失败了
            return TaskState(original_intent=original_task.original_intent, current_status=TaskStatus.FAILED)