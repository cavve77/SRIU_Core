# 文件路径: src/sriu/core/runtime.py
import subprocess
import sys
import os
from pathlib import Path
from typing import Optional

from .state import TaskState, TaskStatus, ActionType
from .logic import LogicEngine

class Runtime:
    """
    SRIU 执行器 - Phase 6: Native File Tools & Strict Schema (Kaomoji Edition)
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
            # 打印非空的参数
            args_preview = action.args.model_dump(exclude_none=True)
            print(f"( >_<)૭ {step_id}: {action.tool_name.value} | Args: {args_preview}")
            
            try:
                result = ""
                
                # [Phase 6 Update] 使用对象属性访问 args.field，而不是字典 get()
                if action.tool_name == ActionType.RUN_SHELL:
                    if not action.args.command: raise ValueError("Missing 'command'")
                    result = self._run_shell(action.args.command)
                    
                elif action.tool_name == ActionType.RUN_PYTHON:
                    if not action.args.code: raise ValueError("Missing 'code'")
                    result = self._run_python(action.args.code)

                elif action.tool_name == ActionType.WRITE_FILE:
                    if not action.args.path or action.args.content is None: 
                        raise ValueError("Missing 'path' or 'content'")
                    result = self._write_file(action.args.path, action.args.content)

                elif action.tool_name == ActionType.READ_FILE:
                    if not action.args.path: raise ValueError("Missing 'path'")
                    result = self._read_file(action.args.path)
                    
                else:
                    result = f"Error: Unknown tool type '{action.tool_name}'"
                
                action.result = result
                # 日志截断
                display_res = result.replace('\n', ' ')
                if len(display_res) > 100:
                    display_res = display_res[:100] + "..."
                print(f"   -> Result: {display_res}")
                
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

    # --- Implementations ---

    def _run_shell(self, command: str) -> str:
        try:
            process = subprocess.run(
                ["powershell", "-Command", command],
                capture_output=True,
                text=True,
                check=True,
                encoding='utf-8',
                errors='replace'
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
                check=True,
                encoding='utf-8',
                errors='replace'
            )
            return process.stdout.strip()
        except subprocess.CalledProcessError as e:
            return f"Python Execution Error: {e.stderr.strip()}"

    def _write_file(self, path: str, content: str) -> str:
        try:
            p = Path(path)
            p.parent.mkdir(parents=True, exist_ok=True)
            with open(p, "w", encoding="utf-8") as f:
                f.write(content)
            return f"(b^_^)b File written: {p.absolute()}"
        except Exception as e:
            return f"(x_x) Write failed: {str(e)}"

    def _read_file(self, path: str) -> str:
        try:
            p = Path(path)
            if not p.exists():
                return f"(?_?) File not found: {path}"
            with open(p, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            return f"(x_x) Read failed: {str(e)}"