import os
import sys
from sriu.core.compiler import SemanticCompiler
from sriu.core.runtime import Runtime
from sriu.core.state import TaskState

def select_model_interactive():
    """
    交互式模型选择器
    """
    print(">> Connecting to Google Neural Network to fetch available models...")
    models = SemanticCompiler.get_available_models()
    
    if not models:
        print("❌ Could not fetch models. Using default fallback.")
        return "gemini-1.5-flash"

    print("\n------------------------------------------")
    print("   AVAILABLE LOGIC CORES (Google GenAI)")
    print("------------------------------------------")
    for idx, model_name in enumerate(models):
        print(f"   [{idx + 1}] {model_name}")
    print("------------------------------------------")

    while True:
        choice = input(f"Select Model ID (1-{len(models)}): ").strip()
        if not choice.isdigit():
            continue
        
        idx = int(choice) - 1
        if 0 <= idx < len(models):
            selected = models[idx]
            print(f"✅ Selected: {selected}")
            return selected
        else:
            print("Invalid selection.")

def main():
    print("==========================================")
    print("   SRIU v0.5.1 CONSOLE (Phase 5)")
    print("==========================================")

    # 0. 检查环境
    if not os.getenv("GEMINI_API_KEY"):
        print("[FATAL] API Key missing. Please run '. .\\boot.ps1'")
        return

    # 1. 选择模型
    try:
        model_id = select_model_interactive()
    except Exception as e:
        print(f"[FATAL] Network Error: {e}")
        return

    # 2. 初始化系统
    try:
        print("\n>> Initializing Semantic Compiler...", end=" ")
        compiler = SemanticCompiler(model_id=model_id)
        
        print(">> Initializing Deterministic Runtime...", end=" ")
        runtime = Runtime()
        print("[OK]")
    except Exception as e:
        print(f"\n[FATAL] Startup failed: {e}")
        return

    print(f"\nSRIU is online. Using Logic Core: {model_id}")
    print("Type 'exit' to quit.")

    # 3. 交互循环
    while True:
        try:
            print("\n------------------------------------------")
            user_input = input("SRIU> ").strip()
            
            if not user_input: continue
            if user_input.lower() in ["exit", "quit"]: break

            # A. Compile
            print(f"🧠 Thinking...", end="\r")
            task = compiler.compile(user_input)
            
            if task.current_status == "failed":
                print(f"❌ Compilation Failed: {task.history}")
                continue

            # B. Logic Lock
            if task.verification_script:
                print(f"🔒 [High Risk] Logic Verification Required.")
            else:
                print(f"ℹ️ [Standard] No Logic Lock triggered.")

            # C. Execute
            final_state = runtime.execute(task)

            # D. Result
            if final_state.current_status == "completed":
                print(f"✅ Mission Accomplished.")
            elif final_state.current_status == "failed":
                print(f"❌ Mission Failed.")

        except KeyboardInterrupt:
            print("\nInterrupted.")
            break
        except Exception as e:
            print(f"\n❌ System Error: {e}")

if __name__ == "__main__":
    main()