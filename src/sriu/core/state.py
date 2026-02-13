# 文件路径: src/sriu/core/state.py
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# 1. 任务状态枚举 (State Enum)
# 这是状态机的核心流转标志
class TaskStatus(str, Enum):
    PENDING = "pending"       # 初始状态
    THINKING = "thinking"     # 正在规划 (调用 Gemini)
    EXECUTING = "executing"   # 正在干活 (运行 Python/Shell)
    VERIFYING = "verifying"   # 正在检查结果 (自律机制)
    COMPLETED = "completed"   # 任务成功
    FAILED = "failed"         # 任务失败 (触发回滚或报错)

# 2. 原子行动定义 (Atomic Action)
# SRIU 的每一步思考，最终必须坍缩为这个结构
class Action(BaseModel):
    tool_name: str = Field(..., description="要使用的工具名称，例如 'run_shell', 'python_repl'")
    code: str = Field(..., description="要执行的具体代码或指令")
    rationale: str = Field(..., description="思考链(CoT): 为什么执行这一步的确定性理由")
    result: Optional[str] = Field(None, description="执行后的输出结果 (Stdout/Stderr)")

# 3. 任务状态机 (The Machine)
# 这是 SRIU 的大脑切片，包含了当前任务的所有上下文
class TaskState(BaseModel):
    original_intent: str = Field(..., description="用户的原始自然语言指令")
    current_status: TaskStatus = TaskStatus.PENDING
    
    # 计划队列：Gemini 生成的一系列步骤
    plan: List[Action] = Field(default_factory=list, description="待执行的动作序列")
    
    # 执行历史：已经发生过的事情 (用于上下文回溯)
    history: List[str] = Field(default_factory=list, description="执行日志")
    
    # 记忆存储：用于在该任务生命周期内保存变量 (如 file_paths, ip_addresses)
    memory: Dict[str, Any] = Field(default_factory=dict, description="临时变量存储")

    def log(self, message: str):
        """记录系统日志"""
        self.history.append(message)
        print(f"[SRIU-LOG] {message}")

    def update_status(self, new_status: TaskStatus):
        """状态流转"""
        print(f"\n>>> [State Change] {self.current_status.value.upper()} -> {new_status.value.upper()}")
        self.current_status = new_status

# --- 自测代码 (Self-Test) ---
if __name__ == "__main__":
    # 模拟初始化一个任务
    task = TaskState(original_intent="扫描当前目录并将所有 .py 文件备份到 backup 文件夹")
    
    print(f"SRIU State Machine Initialized.")
    print(f"Target Intent: {task.original_intent}")
    print(f"Current Status: {task.current_status.value}")
    
    # 模拟状态变更
    task.update_status(TaskStatus.THINKING)