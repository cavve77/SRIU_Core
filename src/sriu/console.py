# 文件路径: src/sriu/console.py
import os
import sys
import json
import subprocess
from collections import deque
from typing import List, Optional, Dict
from google import genai
from google.genai import types
from dotenv import load_dotenv

from sriu.core.compiler import SemanticCompiler
from sriu.core.runtime import Runtime
from sriu.core.state import TaskStatus, ActionType

# Load environment variables
load_dotenv()

# --- [Phase 9] Memory Bank Implementation ---
class MemoryBank:
    """
    Short-term memory storage (The Hippocampus).
    Stores up to 5 interactions (A1..A5).
    """
    def __init__(self, capacity: int = 5):
        self.capacity = capacity
        self.memory = deque(maxlen=capacity)
        self.counter = 1

    def add(self, user_req: str, task):
        """Register a completed interaction (A-Unit)"""
        steps_summary = []
        if task.plan:
            for idx, action in enumerate(task.plan):
                # Format: a1: write_file(path='...')
                args_copy = action.args.model_dump(exclude_none=True)
                if 'content' in args_copy: 
                    args_copy['content'] = "<CONTENT_UPDATED>"
                
                step_str = f"a{idx+1}: {action.tool_name.value} {args_copy}"
                steps_summary.append(step_str)
        
        entry = {
            "id": f"A{self.counter}",
            "requirement": user_req,
            "steps": steps_summary,
            "status": task.current_status.value
        }
        
        self.memory.append(entry)
        self.counter += 1
        return entry["id"]

    def to_context_string(self) -> str:
        """Serialize memory for the Compiler's prompt"""
        if not self.memory:
            return "(No previous history)"
        
        buffer = []
        for item in self.memory:
            buffer.append(f"[{item['id']}] User Request: \"{item['requirement']}\"")
            buffer.append(f"      Status: {item['status']}")
            if item['steps']:
                buffer.append(f"      Actions: {'; '.join(item['steps'])}")
            else:
                buffer.append(f"      Actions: (No actions taken)")
            buffer.append("") 
        return "\n".join(buffer)

# --------------------------------------------

def get_tree_structure(path: str = ".", max_depth: int = 2) -> str:
    tree_str = []
    for root, dirs, files in os.walk(path):
        if any(x in root for x in [".git", ".sriu", "__pycache__", ".venv", "dist"]):
            continue
        level = root.replace(path, '').count(os.sep)
        if level > max_depth: continue
        indent = ' ' * 4 * level
        tree_str.append(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 4 * (level + 1)
        for f in files[:5]:
            tree_str.append(f"{subindent}{f}")
        if len(files) > 5:
            tree_str.append(f"{subindent}...")
    return "\n".join(tree_str)

def load_keeper_context() -> str:
    context = []
    context.append("--- [project_structure.tree] ---")
    context.append(get_tree_structure())
    
    if os.path.exists("global_registry.json"):
        context.append("\n--- [global_registry.json] ---")
        with open("global_registry.json", "r", encoding="utf-8") as f:
            data = json.load(f)
            context.append(json.dumps(data, indent=2))
            
    if os.path.exists("project_roadmap.md"):
        context.append("\n--- [project_roadmap.md (Snippet)] ---")
        with open("project_roadmap.md", "r", encoding="utf-8") as f:
            lines = f.readlines()
            context.append("".join(lines[:50]))
            
    return "\n".join(context)

def init_project_files():
    if not os.path.exists("global_registry.json"):
        default_registry = {"meta": {"project": "SRIU"}, "files": {}, "symbols": {}}
        with open("global_registry.json", "w", encoding="utf-8") as f:
            json.dump(default_registry, f, indent=2)

# [Fixed] Restored Model Selection Logic
def select_model(prompt_text: str, default_model: str) -> str:
    try:
        models = SemanticCompiler.get_available_models()
    except Exception:
        models = [default_model]

    print(f"\n{prompt_text}")
    for i, m in enumerate(models):
        print(f"[{i}] {m}")
    
    choice = input(f"Select model (default: {default_model}): ").strip()
    if not choice:
        return default_model
    
    try:
        idx = int(choice)
        if 0 <= idx < len(models):
            return models[idx]
    except ValueError:
        pass
    
    print(f"Invalid selection. Using default: {default_model}")
    return default_model

class Gatekeeper:
    def __init__(self, model_id: str):
        self.client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        self.model_id = model_id
        
    def check(self, user_input: str) -> str:
        prompt = f"""
        SRIU Gatekeeper.
        Classify input: "{user_input}"
        Categories:
        1. ENGINEERING: Code, Files, Commands, Debugging, "Run it", "Fix it", "Continue".
        2. CHAT: General knowledge unrelated to the project.
        
        Return ONLY: ENGINEERING or CHAT.
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.0)
            )
            return response.text.strip().upper()
        except:
            return "ENGINEERING"

def main():
    print("SRIU Semantic Compiler (v0.9.1) - Memory Core + Selector Restored")
    init_project_files()
    
    # 1. Select Logic Core Model
    # Default to a high-reasoning model for Logic Core
    logic_model = select_model("Select Logic Core Model (Compiler):", "gemini-2.0-flash")
    
    # 2. Select Gatekeeper Model
    # Default to a fast/cheap model for Intent Check
    gatekeeper_model = select_model("Select Gatekeeper Model (Intent):", "gemini-1.5-flash")
    
    print("\n" + "="*40)
    print(f"[Configuration]")
    print(f"Logic Core: {logic_model}")
    print(f"Gatekeeper: {gatekeeper_model}")
    print("="*40 + "\n")

    compiler = SemanticCompiler(model_id=logic_model)
    runtime = Runtime()
    gatekeeper = Gatekeeper(model_id=gatekeeper_model)
    
    # [Phase 9] Initialize Memory Bank
    memory_bank = MemoryBank(capacity=5)
    
    print(f"System Ready. (Memory: 5 Slots Active)")
    print("Type 'exit' to quit.")
    
    while True:
        try:
            user_input = input("\nSRIU> ").strip()
            if user_input.lower() in ['exit', 'quit']: break
            if not user_input: continue
            
            # Gatekeeper
            intent = gatekeeper.check(user_input)
            
            if intent == "CHAT":
                print(f"[Gatekeeper] CHAT (Lite Mode)")
                response = gatekeeper.client.models.generate_content(
                    model=gatekeeper_model,
                    contents=user_input
                )
                print(f"\nAI: {response.text}\n")
                if response.usage_metadata:
                    u = response.usage_metadata
                    print(f"[Usage] In: {u.prompt_token_count} | Out: {u.candidates_token_count}")
                continue
            
            # Engineering Flow
            print(f"[Gatekeeper] ENGINEERING (Loading Context...)")
            
            # Load Contexts
            project_context = load_keeper_context()
            memory_context = memory_bank.to_context_string() # Dump A1..A5
            
            # Compile with Memory
            task = compiler.compile(user_input, project_context, memory_context)
            
            # Execute
            if task.current_status != TaskStatus.FAILED:
                runtime.execute(task)
                
                # [Phase 8.3] Auto-Sync
                file_modified = False
                if task.plan:
                    for action in task.plan:
                        if action.tool_name == ActionType.WRITE_FILE:
                            file_modified = True
                            break
                if file_modified and task.current_status == TaskStatus.COMPLETED:
                    print("\n>>> (O_O) [Auto-Sync] Refreshing Registry...")
                    try:
                        # Use subprocess to run scanner
                        subprocess.run([sys.executable, "src/sriu/tools/registry_scanner.py"], 
                                     capture_output=True, text=True, check=True)
                        print(">>> (^_^) [Auto-Sync] Done.")
                    except Exception as e:
                        print(f">>> (x_x) [Auto-Sync] Error: {e}")

            # [Phase 9] Update Memory Bank
            new_id = memory_bank.add(user_input, task)
            print(f"[Memory] Interaction stored as [{new_id}]")
                
            # Usage
            if hasattr(task, 'usage_metadata') and task.usage_metadata:
                u = task.usage_metadata
                print(f"\n[Token] Total: {u.total_token_count}")
                
        except KeyboardInterrupt:
            print("\nCancelled.")
        except Exception as e:
            print(f"\n[Error] {str(e)}")

if __name__ == "__main__":
    main()