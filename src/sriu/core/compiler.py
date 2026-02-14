# 文件路径: src/sriu/core/compiler.py
import json
import os
from typing import List, Optional

from google import genai
from google.genai import types
from pydantic import ValidationError

from .state import TaskState, TaskStatus, Action, ActionType

# [Phase 9] Prompt Upgrade: Context Awareness
SYSTEM_PROMPT = """
You are the SRIU (Self-Regulating Intelligence Unit) Semantic Compiler.
Target OS: Windows 11 (PowerShell Environment).
Your goal: Convert Natural Language into a Deterministic Execution Plan (TaskState).

### 1. MEMORY PROTOCOL (THE HIPPOCAMPUS)
You have access to `[MEMORY STREAM]`. This contains the last 5 interactions (A1..A5).
- **Contextual Awareness**: If the user says "continue", "fix the error", or "run it", REFER to the previous Memory Unit (e.g., A1) to understand the context.
- **Continuity**: If the previous task (A1) failed or was just a "read" operation, your new plan should logically follow up (e.g., "write" or "execute").

### 2. PROJECT KEEPER PROTOCOL
[Rule 1: Architecture First]
- Review `[PROJECT CONTEXT]` (project_structure.tree) first.
[Rule 2: Asset Registry]
- **AUTO-SYNC ENABLED**: Do NOT write to `global_registry.json`.
[Rule 3: Roadmap Sync]
- Update `project_roadmap.md` via `write_file` when milestones are met.

### 3. THE SAFETY CONSTITUTION
[Axiom 1] NEVER modify system directories.
[Axiom 2] NEVER create infinite loops.

### 4. TOOLSET (STRICT PRIORITY)
1. `read_file` (Native): Read content.
2. `write_file` (Native): Write/Overwrite content. Triggers Backup & Sync.
3. `run_python` (Logic): 
   - **FORBIDDEN**: `open()`, `file.write()`.
   - Use for pure logic/math.
4. `run_shell` (System): `git`, `netstat`, `python -m pip`, `python -m PyInstaller`.

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

    def compile(self, user_instruction: str, project_context: str = "", memory_context: str = "") -> TaskState:
        """
        [Phase 9 Update] Receives memory_context (A1..A5 logs)
        """
        print(f">> (o_O) Thinking... [Logic Lock: ACTIVE] [Memory: ONLINE]")
        
        augmented_instruction = f"""
[PROJECT CONTEXT]
{project_context}

[MEMORY STREAM (Recent History)]
{memory_context}

[CURRENT USER INSTRUCTION]
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