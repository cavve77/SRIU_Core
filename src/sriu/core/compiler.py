# 文件路径: src/sriu/core/compiler.py
import json
import os
from typing import List, Optional

from google import genai
from google.genai import types
from pydantic import ValidationError

from .state import TaskState, TaskStatus, Action, ActionType

# [Phase 8.5] Prompt Patch: I/O Lockdown (No open() in Python)
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
- **AUTO-SYNC ENABLED**: The system AUTOMATICALLY runs `registry_scanner.py` after you modify files.
- **DO NOT** generate code to write/update `global_registry.json`.
- **READ ONLY**: You may read it to look up symbols, but NEVER write to it.

[Rule 3: Roadmap Sync]
- Use `write_file` to update `project_roadmap.md` after feature completion.

### 2. THE SAFETY CONSTITUTION (AXIOMS)
[Axiom 1 - Filesystem Integrity]
- NEVER modify/delete system directories.
[Axiom 2 - Execution Bounds]
- NEVER create infinite loops.

### 3. TOOLSET (STRICT PRIORITY & RESTRICTIONS)
You have access to specific tools. You MUST use them correctly to ensure System Safety (Backups & Sync).

1. `read_file` (Native) -> Args: path
   - **MANDATORY**: Use this to read ANY file content.
   
2. `write_file` (Native) -> Args: path, content
   - **MANDATORY**: Use this to save ANY file changes.
   - **Mechanism**: This tool triggers "Time Machine" (Backup) and "Auto-Sync" (Registry).
   
3. `run_python` (Logic) -> Args: code
   - **RESTRICTION**: You are **FORBIDDEN** from using `open()`, `file.write()`, or modifying files inside this script.
   - Use this ONLY for calculation, logic processing, or data transformation.
   - If you need to edit a file:
     1. `read_file` (get content)
     2. `run_python` (process string in memory)
     3. `write_file` (save result)

4. `run_shell` (System) -> Args: command
   - ONLY for: git, netstat, ping, systeminfo.

### 4. LOGIC LOCK PROTOCOL (Z3 SOLVER)
If user intent violates Safety Axioms, generate a `verification_script` using `z3-solver`.

### 5. OUTPUT FORMAT
Return a SINGLE valid JSON object matching the `TaskState` Pydantic schema.
"""

class SemanticCompiler:
    def __init__(self, model_id: str):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("(x_x) GEMINI_API_KEY not found in environment.")
        
        self.client = genai.Client(api_key=self.api_key)
        self.model_id = model_id

    @staticmethod
    def get_available_models() -> List[str]:
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key: return []
        try:
            client = genai.Client(api_key=api_key)
            valid_models = []
            for m in client.models.list():
                name = m.name.lower()
                if "gemini" in name and "embedding" not in name:
                    clean_id = name.replace("models/", "")
                    valid_models.append(clean_id)
            return sorted(valid_models, reverse=True)
        except Exception:
            return ["gemini-2.0-flash", "gemini-1.5-pro"]

    def compile(self, user_instruction: str, project_context: str = "") -> TaskState:
        print(f">> (o_O) Thinking... [Logic Lock: ACTIVE] [Keeper: ACTIVE]")
        
        augmented_instruction = f"""
[PROJECT CONTEXT]
{project_context}

[USER INSTRUCTION]
{user_instruction}
"""
        
        try:
            config = types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                response_mime_type="application/json",
                response_schema=TaskState, 
                temperature=0.1,
                max_output_tokens=16384,
            )

            response = self.client.models.generate_content(
                model=self.model_id,
                contents=augmented_instruction,
                config=config
            )
            
            if not response.text:
                raise ValueError("Empty response from Gemini API")

            task_plan = TaskState.model_validate_json(response.text)
            
            if hasattr(response, 'usage_metadata') and response.usage_metadata:
                object.__setattr__(task_plan, 'usage_metadata', response.usage_metadata)
            
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