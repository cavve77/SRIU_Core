# 文件路径: src/sriu/core/runtime.py
import subprocess
import sys
import io
import contextlib
from typing import Optional

# 引入我们定义的结构
from .state import TaskState, Action, TaskStatus

class Runtime:
    def __init__(self):
        self.working_dir = "." # 默认工作目录

    def _run_shell(self, command: str) -> str:
        """执行 PowerShell 指令"""
        print(f"   [SHELL] Executing: {command}")
        try:
            # 使用 powershell.exe 执行，确保环境一致性
            result = subprocess.run(
                ["powershell", "-Command", command],
                capture_output=True,
                text=True,
                cwd=self.working_dir
            )
            output = result.stdout.strip()
            error = result.stderr.strip()
            
            if result.returncode != 0:
                raise Exception(f"Exit Code {result.returncode}\nStderr: {error}")
            
            return output if output else "(No Output)"
            
        except Exception as e:
            raise Exception(f"Shell Execution Failed: {str(e)}")

    def _run_python(self, code: str) -> str:
        """执行纯 Python 逻辑 (REPL模式)"""
        print(f"   [PYTHON] Executing Logic...")
        
        # 捕获 stdout，这样 print() 的内容才能被 SRIU 读取
        output_capture = io.StringIO()
        try:
            with contextlib.redirect_stdout(output_capture):
                # 警告: exec() 极其危险，生产环境需要沙箱隔离
                # 这里为了原型开发，我们直接在当前进程运行
                exec(code, {"__name__": "__main__"})
            return output_capture.getvalue().strip()
        except Exception as e:
            raise Exception(f"Python Runtime Error: {str(e)}")

    def execute_task(self, task: TaskState):
        """核心循环：遍历计划并执行"""
        print(f"\n[*] Starting Execution Phase (Steps: {len(task.plan)})")
        task.update_status(TaskStatus.EXECUTING)

        for i, action in enumerate(task.plan):
            step_num = i + 1
            print(f"\n>>> Step {step_num}/{len(task.plan)}: {action.rationale}")
            
            try:
                result = ""
                # 根据工具类型分发
                if action.tool_name == "run_shell":
                    result = self._run_shell(action.code)
                elif action.tool_name == "python_repl":
                    result = self._run_python(action.code)
                elif action.tool_name == "write_file":
                    # 作为一个简单的内置功能处理
                    # 也可以让 LLM 用 python_repl 写文件，但这更稳定
                    filename, content = action.code.split("|||", 1) # 简易协议
                    with open(filename.strip(), "w", encoding="utf-8") as f:
                        f.write(content)
                    result = f"File '{filename}' written successfully."
                else:
                    raise ValueError(f"Unknown tool: {action.tool_name}")

                # 记录成功结果
                action.result = result
                print(f"   [OK] Result: {result[:100]}..." if len(result) > 100 else f"   [OK] Result: {result}")
                task.history.append(f"Step {step_num} Success: {result}")

            except Exception as e:
                # 捕捉到任何错误 -> 任务失败
                error_msg = str(e)
                print(f"   [!!!] Execution Failed: {error_msg}")
                action.result = f"ERROR: {error_msg}"
                task.history.append(f"Step {step_num} FAILED: {error_msg}")
                task.update_status(TaskStatus.FAILED)
                return # 立即停止，不执行后续步骤 (自律原则)

        # 如果循环走完没有报错
        task.update_status(TaskStatus.COMPLETED)
        print(f"\n[*] Task Completed Successfully.")