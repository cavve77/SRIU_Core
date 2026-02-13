# 文件路径: src/sriu/main.py
import sys
import os
import time

# 路径修正
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from sriu.core.compiler import SemanticCompiler
from sriu.core.runtime import Runtime
from sriu.core.state import TaskStatus

def main():
    print("==================================================")
    print("   SRIU (Self-Regulating Intelligence Unit) v0.2")
    print("   Mode: Autonomous Self-Healing")
    print("==================================================")

    try:
        compiler = SemanticCompiler()
        runtime = Runtime()
    except Exception as e:
        print(f"[FATAL] Init Failed: {e}")
        return

    # 获取指令
    if len(sys.argv) > 1:
        user_intent = " ".join(sys.argv[1:])
    else:
        user_intent = input("\n[SRIU] Enter Command: ").strip()

    if not user_intent: return

    # --- 自律循环 (The Loop) ---
    current_task = compiler.compile_intent(user_intent)
    max_retries = 3
    attempt = 0

    while attempt < max_retries:
        if current_task.current_status == TaskStatus.FAILED:
            print("[X] Initial Compilation Failed.")
            break

        # 尝试执行
        runtime.execute_task(current_task)

        # 检查结果
        if current_task.current_status == TaskStatus.COMPLETED:
            print("\n[SUCCESS] Mission Accomplished.")
            break
        
        elif current_task.current_status == TaskStatus.FAILED:
            attempt += 1
            print(f"\n[!] Failure Detected. Entering Self-Regulation Mode (Attempt {attempt}/{max_retries})")
            
            # 获取最后的一条错误日志
            # 注意：我们在 runtime.py 里把错误写入了 history，这里简单提取一下
            error_context = "\n".join(current_task.history[-3:]) 
            
            # 调用大脑进行修复
            current_task = compiler.compile_fix(current_task, error_context)
            
            time.sleep(1) # 冷静一下
        else:
            break
    
    if attempt >= max_retries:
        print("\n[FAILURE] Maximum retries exceeded. Manual intervention required.")

if __name__ == "__main__":
    main()