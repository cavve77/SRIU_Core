import subprocess
import sys
from typing import Optional

from .state import TaskState, TaskStatus, Action
from .logic import LogicEngine

class Runtime:
    """
    SRIU 执行器 - Phase 5 Logic Lock Enabled (Kaomoji Edition)
    """

    def execute(self, task: TaskState) -> TaskState:
        print("\n" + "="*50)
        print(">>> ( >_<)૭ RUNTIME ENGAGED")
        
        # 1. LOGIC LOCK CHECK
        if task.verification_script:
            print(f"[¬º-°]¬ [Logic Lock] Detected verification script. Validating...")
            task.update_status(TaskStatus.VERIFYING_LOGIC)
            
            is_safe, proof_log = LogicEngine.verify_proof(task.verification_script)
            task.log(proof_log)
            
            if not is_safe:
                print(f"(Cc_cC) [Logic Lock] BLOCKED. Proof failed. Aborting execution.")
                task.update_status(TaskStatus.FAILED)
                return task
            
            print(f"(b^_^)b [Logic Lock] PROOF ACCEPTED. System is SAFE. Proceeding.")
        else:
            print(f"(o_O) [Logic Lock] No verification script provided. Proceeding.")

        # 2. EXECUTION LOOP
        task.update_status(TaskStatus.EXECUTING)
        
        for i, action in enumerate(task.plan):
            step_id = f"Step {i+1}/{len(task.plan)}"
            print(f"( >_<)૭ {step_id}: {action.tool_name} | Args: {action.args}")
            
            try:
                result = ""
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
                
                action.result = result
                print(f"   -> Result: {result[:100]}..." if len(result) > 100 else f"   -> Result: {result}")
                
            except Exception as e:
                err_msg = f"Runtime Error at {step_id}: {str(e)}"
                print(f"(×_×) {err_msg}")
                action.result = err_msg
                task.log(err_msg)
                task.update_status(TaskStatus.FAILED)
                return task
                
        task.update_status(TaskStatus.COMPLETED)
        print(">>> ( ^_^) RUNTIME FINISHED: SUCCESS")
        print("="*50 + "\n")
        return task

    def _run_shell(self, command: str) -> str:
        try:
            process = subprocess.run(
                ["powershell", "-Command", command],
                capture_output=True,
                text=True,
                check=True
            )
            return process.stdout.strip()
        except subprocess.CalledProcessError as e:
            return f"Shell Error (Exit Code {e.returncode}): {e.stderr.strip()}"

    def _run_python(self, code: str) -> str:
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