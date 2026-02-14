# 文件路径: src/sriu/console.py
import os
import sys
from pathlib import Path

# 确保能找到 sriu 模块 (如果直接运行脚本)
sys.path.append(os.path.join(os.path.dirname(__file__), "../../"))

from sriu.core.compiler import SemanticCompiler
from sriu.core.runtime import Runtime
from sriu.core.state import TaskState, TaskStatus

# --- [Phase 6.2] Project Keeper Helper Functions ---

def get_tree_structure(path=".") -> str:
    """[Keeper] 生成当前目录树结构 (限制深度以节省 Token)"""
    tree_str = "root/\n"
    try:
        # 只显示 5 层深度 (原 16 层太深，容易消耗过多 Token)
        for root, dirs, files in os.walk(path):
            level = root.replace(path, '').count(os.sep)
            if level > 5: continue
            
            indent = ' ' * 4 * (level)
            folder_name = os.path.basename(root)
            if folder_name.startswith(".") or folder_name == "__pycache__": continue
            
            tree_str += f"{indent}{folder_name}/\n"
            subindent = ' ' * 4 * (level + 1)
            
            for f in files:
                if f.startswith(".") or f.endswith(".pyc"): continue
                tree_str += f"{subindent}{f}\n"
    except Exception:
        tree_str = "(Tree generation failed)"
    return tree_str

def load_keeper_context() -> str:
    """[Keeper] 读取项目管理文件，构建上下文"""
    context = ""
    
    # 1. 架构 (动态生成)
    context += f"--- [project_structure.tree] ---\n{get_tree_structure()}\n\n"
    
    # 2. 注册表
    if os.path.exists("global_registry.json"):
        try:
            with open("global_registry.json", "r", encoding="utf-8") as f:
                context += f"--- [global_registry.json] ---\n{f.read()}\n\n"
        except: pass
        
    # 3. 路线图
    if os.path.exists("project_roadmap.md"):
        try:
            with open("project_roadmap.md", "r", encoding="utf-8") as f:
                content = f.read()
                # 截取前 20000 字符 (100k 有点多，保守一点)
                context += f"--- [project_roadmap.md (Snippet)] ---\n{content[:20000]}...\n\n"
        except: pass
        
    return context

def init_project_files():
    """[Keeper] 初始化标准文件"""
    print(">> (o_O) Initializing Project Keeper Files...")
    
    # 1. Registry
    if not os.path.exists("global_registry.json"):
        with open("global_registry.json", "w", encoding="utf-8") as f:
            f.write('{\n  "project_name": "SRIU_Project",\n  "assets": {}\n}')
        print("   -> Created global_registry.json")
    else:
        print("   -> global_registry.json already exists.")
        
    # 2. Roadmap
    if not os.path.exists("project_roadmap.md"):
        with open("project_roadmap.md", "w", encoding="utf-8") as f:
            f.write('# Project Roadmap\n\n## Goals\n- [ ] Initialize Project\n\n## Implemented\n\n## Todo\n')
        print("   -> Created project_roadmap.md")
    else:
        print("   -> project_roadmap.md already exists.")
        
    print("   (b^_^)b Project Keeper Initialized.")

# --- End Helper Functions ---

def select_model_interactive():
    print(">> (o_O) Connecting to Google Neural Network...")
    models = SemanticCompiler.get_available_models()
    
    if not models:
        print("(×_×#) Could not fetch models. Using default fallback.")
        return "gemini-1.5-flash"

    print("\n------------------------------------------")
    print("   AVAILABLE LOGIC CORES (Google GenAI)")
    print("------------------------------------------")
    for idx, model_name in enumerate(models):
        print(f"   [{idx + 1}] {model_name}")
    print("------------------------------------------")

    while True:
        choice = input(f"Select Model ID (1-{len(models)}): ").strip()
        if choice.isdigit():
            idx = int(choice) - 1
            if 0 <= idx < len(models):
                selected = models[idx]
                print(f"(b^_^)b Selected: {selected}")
                return selected
        print("Invalid selection.")

def main():
    print("==========================================")
    print("   SRIU v0.6.2 CONSOLE (Project Keeper)")
    print("==========================================")

    if not os.environ.get("GEMINI_API_KEY"):
        print("(×_×) [FATAL] API Key missing. Please run '. .\\boot.ps1'")
        return

    try:
        model_id = select_model_interactive()
    except Exception as e:
        print(f"(×_×) [FATAL] Network Error: {e}")
        return

    try:
        print("\n>> Initializing Semantic Compiler...", end=" ")
        compiler = SemanticCompiler(model_id=model_id)
        
        print(">> Initializing Deterministic Runtime...", end=" ")
        runtime = Runtime()
        print("[OK]")
    except Exception as e:
        print(f"\n(×_×) [FATAL] Startup failed: {e}")
        return

    print(f"\nSRIU is online. Logic Core: {model_id}")
    print("Commands: 'exit' to quit, 'init' to setup Project Keeper files.")

    while True:
        try:
            print("\n------------------------------------------")
            user_input = input("SRIU> ").strip()
            
            if not user_input: continue
            if user_input.lower() in ["exit", "quit"]: break
            
            # [Keeper] 初始化指令
            if user_input.lower() == "init":
                init_project_files()
                continue

            # [Keeper] 自动加载上下文 (Auto-Context Injection)
            print(f"( ⚙_⚙ ) Reading Context...", end="\r")
            project_context = load_keeper_context()

            # A. Compile (Thinking with Context)
            print(f"( ⚙_⚙ ) Thinking with Context...", end="\r")
            
            # [Phase 6.2] 传入上下文
            task = compiler.compile(user_input, project_context)
            
            # [Phase 7.2] Token Usage Display (Safe Dictionary Access)
            # 注意: usage 是我们在 compiler.py 中动态注入的 dict，不是 Schema 的一部分
            if hasattr(task, "usage") and task.usage:
                # 使用 .get() 确保安全访问，键名与 compiler.py 中定义的一致
                print(f"\n(o_O) [Token Usage] In: {task.usage.get('prompt_tokens', 0)} | Out: {task.usage.get('completion_tokens', 0)} | Total: {task.usage.get('total_tokens', 0)}")
            
            if task.current_status == "failed":
                print(f"(×_×#) Compilation Failed: {task.history}")
                continue

            # B. Logic Lock
            if task.verification_script:
                print(f"[¬º-°]¬ [High Risk] Logic Verification Required.")
            else:
                print(f"(o_O) [Standard] No Logic Lock triggered.")

            # C. Execute
            final_state = runtime.execute(task)

            # D. Result
            if final_state.current_status == "completed": # 兼容 TaskStatus 枚举
                print(f"(★^O^★) Mission Accomplished.")
            elif final_state.current_status == "failed":
                print(f"(T_T) Mission Failed.")

        except KeyboardInterrupt:
            print("\nInterrupted.")
            break
        except Exception as e:
            print(f"\n(×_×) System Error: {e}")

if __name__ == "__main__":
    main()