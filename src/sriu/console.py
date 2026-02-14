import os
import sys
import json
from typing import List, Optional
from google import genai
from google.genai import types
from dotenv import load_dotenv

from sriu.core.compiler import SemanticCompiler
from sriu.core.runtime import Runtime
from sriu.core.state import TaskStatus

# Load environment variables
load_dotenv()

def get_tree_structure(path: str = ".", max_depth: int = 2) -> str:
    """Generate directory tree structure for context."""
    tree_str = []
    for root, dirs, files in os.walk(path):
        level = root.replace(path, '').count(os.sep)
        if level > max_depth:
            continue
        indent = ' ' * 4 * level
        tree_str.append(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 4 * (level + 1)
        for f in files[:5]:  # Limit files per dir to save tokens
            tree_str.append(f"{subindent}{f}")
        if len(files) > 5:
            tree_str.append(f"{subindent}...")
    return "\n".join(tree_str)

def load_keeper_context() -> str:
    """Load project management files for context."""
    context = []
    
    # 1. Project Structure
    context.append("--- [project_structure.tree] ---")
    context.append(get_tree_structure())
    
    # 2. Global Registry
    if os.path.exists("global_registry.json"):
        context.append("\n--- [global_registry.json] ---")
        with open("global_registry.json", "r", encoding="utf-8") as f:
            # Load and dump to minify JSON slightly
            data = json.load(f)
            context.append(json.dumps(data, indent=2))
            
    # 3. Roadmap
    if os.path.exists("project_roadmap.md"):
        context.append("\n--- [project_roadmap.md (Snippet)] ---")
        with open("project_roadmap.md", "r", encoding="utf-8") as f:
            lines = f.readlines()
            context.append("".join(lines[:50])) # First 50 lines
            
    return "\n".join(context)

def init_project_files():
    """Initialize standard files if missing."""
    if not os.path.exists("global_registry.json"):
        default_registry = {
            "meta": {"project": "SRIU_Project", "version": "0.1.0"},
            "files": {},
            "symbols": {}
        }
        with open("global_registry.json", "w", encoding="utf-8") as f:
            json.dump(default_registry, f, indent=2)
            
    if not os.path.exists("project_roadmap.md"):
        with open("project_roadmap.md", "w", encoding="utf-8") as f:
            f.write("# Project Roadmap\n\n## Goals\n- [ ] Initialize Project\n\n## Implemented\n\n## Todo\n")

def select_model(prompt_text: str, default_model: str) -> str:
    """Generic model selection function."""
    models = SemanticCompiler.get_available_models()
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
    """AI Gatekeeper to classify user intent (Engineering vs Chat)."""
    def __init__(self, model_id: str):
        self.client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        self.model_id = model_id
        
    def check(self, user_input: str) -> str:
        """Returns 'ENGINEERING' or 'CHAT'."""
        prompt = f"""
        You are the Gatekeeper of the SRIU System.
        Classify the following user input into one of two categories:
        1. ENGINEERING: Requests to write code, modify files, run commands, debug, or query project structure.
        2. CHAT: General questions, greetings, philosophical discussions, or requests unrelated to the project files.
        
        Input: "{user_input}"
        
        Return ONLY the category name (ENGINEERING or CHAT).
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt,
                config=types.GenerateContentConfig(temperature=0.0)
            )
            return response.text.strip().upper()
        except Exception as e:
            print(f"[Gatekeeper Error] {e}")
            return "ENGINEERING" # Fail-safe default

def main():
    print("SRIU Semantic Compiler (v0.7.0) - Initializing...")
    init_project_files()
    
    # 1. Select Logic Core Model
    logic_model = select_model("Select Logic Core Model (Compiler):", "gemini-2.0-flash")
    
    # 2. Select Gatekeeper Model
    gatekeeper_model = select_model("Select Gatekeeper Model (Intent):", "gemini-1.5-flash")
    
    print("\n" + "="*40)
    print(f"[Configuration]")
    print(f"Logic Core: {logic_model}")
    print(f"Gatekeeper: {gatekeeper_model}")
    print("="*40 + "\n")

    # Initialize Components
    compiler = SemanticCompiler(model_id=logic_model)
    runtime = Runtime()
    gatekeeper = Gatekeeper(model_id=gatekeeper_model)
    
    print(f"System Ready. (Logic: {logic_model} | Gatekeeper: {gatekeeper_model})")
    print("Type 'exit' to quit.")
    
    while True:
        try:
            user_input = input("\nSRIU> ").strip()
            if user_input.lower() in ['exit', 'quit']:
                break
            if not user_input:
                continue
                
            # Phase 8: Gatekeeper Check
            intent = gatekeeper.check(user_input)
            
            if intent == "CHAT":
                print(f"[Gatekeeper] Classified as CHAT. (Bypassing Compiler)")
                # Simple chat response using the lighter Gatekeeper model
                response = gatekeeper.client.models.generate_content(
                    model=gatekeeper_model,
                    contents=user_input
                )
                print(f"\nAI: {response.text}\n")
                if response.usage_metadata:
                    u = response.usage_metadata
                    print(f"[Gatekeeper Usage] In: {u.prompt_token_count} | Out: {u.candidates_token_count} | Total: {u.total_token_count}")
                continue
            
            # Engineering Flow
            print(f"[Gatekeeper] Classified as ENGINEERING. (Engaging Compiler)")
            
            # Load Context
            project_context = load_keeper_context()
            
            # Compile
            task = compiler.compile(user_input, project_context)
            
            # Execute
            if task.current_status != TaskStatus.FAILED:
                runtime.execute(task)
                
            # Token Usage Report
            if hasattr(task, 'usage_metadata') and task.usage_metadata:
                u = task.usage_metadata
                print(f"\n[Token Usage] In: {u.prompt_token_count} | Out: {u.candidates_token_count} | Total: {u.total_token_count}")
                
        except KeyboardInterrupt:
            print("\nOperation cancelled.")
        except Exception as e:
            print(f"\n[Error] {str(e)}")

if __name__ == "__main__":
    main()