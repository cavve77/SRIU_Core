import subprocess
import sys
import traceback
from typing import Optional

# 引入我们刚定义好的 State 和 Logic 组件
from .state import TaskState, TaskStatus, Action
from .logic import LogicEngine

class Runtime:
    """
    SRIU 执行器 - Phase 5 Logic Lock Enabled
    职责：
    1. 接收 TaskState
    2. [NEW] 运行 LogicEngine 检查 verification_script
    3. 如果安全 -> 顺序执行 Plan 中的 Actions
    4. 返回更新后的 TaskState
    """

    def execute(self, task: TaskState) -> TaskState:
        """
        执行整个计划。
        """
        print("\n" + "="*50)
        print(">>> RUNTIME ENGAGED")
        
        # ---------------------------------------------------------
        # 1. PHASE 5: LOGIC LOCK CHECK
        # ---------------------------------------------------------
        if task.verification_script:
            print(f"🔒 [Logic Lock] Detected verification script. Validating...")
            task.update_status(TaskStatus.VERIFYING_LOGIC)
            
            # 调用逻辑引擎
            is_safe, proof_log = LogicEngine.verify_proof(task.verification_script)
            task.log(proof_log)
            
            if not is_safe:
                print(f"⛔ [Logic Lock] BLOCKED. Proof failed. Aborting execution.")
                task.update_status(TaskStatus.FAILED)
                # 逻辑验证失败，直接返回，不执行任何 Action
                return task
            
            print(f"🔓 [Logic Lock] PROOF ACCEPTED. System is SAFE. Proceeding to execution.")
        else:
            print(f"ℹ️ [Logic Lock] No verification script provided. Proceeding (Standard Mode).")

        # ---------------------------------------------------------
        # 2. EXECUTION LOOP
        # ---------------------------------------------------------
        task.update_status(TaskStatus.EXECUTING)
        
        for i, action in enumerate(task.plan):
            step_id = f"Step {i+1}/{len(task.plan)}"
            print(f"⚡ {step_id}: {action.tool_name} | Args: {action.args}")
            
            try:
                result = ""
                # Dispatcher (工具分发)
                if action.tool_name == "run_shell":
                    cmd = action.args.get("command", "")
                    if not cmd: raise ValueError("Missing 'command' in args")
                    result = self._run_shell(cmd)
                    
                elif action.tool_name == "run_python":
                    code = action.args.get("code", "")
                    if not code: raise ValueError("Missing 'code' in args")
                    result = self._run_python(code)
                    
                else:
                    result = f"Error: Unknown tool '{action.tool_name}'"
                
                # 记录结果
                action.result = result
                print(f"   -> Result: {result[:100]}..." if len(result) > 100 else f"   -> Result: {result}")
                
            except Exception as e:
                err_msg = f"Runtime Error at {step_id}: {str(e)}"
                print(f"❌ {err_msg}")
                action.result = err_msg
                task.log(err_msg)
                task.update_status(TaskStatus.FAILED)
                return task
                
        # 全部执行成功
        task.update_status(TaskStatus.COMPLETED)
        print(">>> RUNTIME FINISHED: SUCCESS")
        print("="*50 + "\n")
        return task

    def _run_shell(self, command: str) -> str:
        """在 Windows PowerShell 中执行命令"""
        try:
            # 使用 powershell /c 来确保兼容性
            process = subprocess.run(
                ["powershell", "-Command", command],
                capture_output=True,
                text=True,
                check=True # 如果命令返回非0，抛出异常
            )
            return process.stdout.strip()
        except subprocess.CalledProcessError as e:
            # 捕获标准错误输出
            return f"Shell Error (Exit Code {e.returncode}): {e.stderr.strip()}"

    def _run_python(self, code: str) -> str:
        """在子进程中执行 Python 代码 (隔离环境)"""
        try:
            process = subprocess.run(
                [sys.executable, "-c", code],
                capture_output=True,
                text=True,
                check=True
            )
            return process.stdout.strip()
        except subprocess.CalledProcessError as e:
            return f"Python Execution Error: {e.stderr.strip()}"