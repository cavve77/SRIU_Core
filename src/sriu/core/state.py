# 文件路径: src/sriu/core/state.py
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# 1. 任务状态枚举 (State Enum)
class TaskStatus(str, Enum):
    PENDING = "pending"       # 初始状态
    THINKING = "thinking"     # 正在规划 (调用 Gemini)
    VERIFYING_LOGIC = "verifying_logic" # [Phase 5 New] 正在进行 Z3 逻辑校验
    EXECUTING = "executing"   # 正在干活 (运行 Python/Shell)
    COMPLETED = "completed"   # 任务成功
    FAILED = "failed"         # 任务失败 (触发回滚或报错)

# 2. 原子行动定义 (Atomic Action)
# SRIU 的每一步思考，最终必须坍缩为这个结构
class Action(BaseModel):
    tool_name: str = Field(..., description="要使用的工具名称，例如 'run_shell', 'run_python'")
    
    # [Refactor] 从纯字符串 code 升级为结构化 args，方便编译器生成 JSON
    args: Dict[str, Any] = Field(..., description="工具参数字典，例如 {'command': 'ls -la'}")
    
    rationale: str = Field(..., description="思考链(CoT): 为什么执行这一步的确定性理由")
    result: Optional[str] = Field(None, description="执行后的输出结果 (Stdout/Stderr)")

# 3. 任务状态机 (The Machine)
class TaskState(BaseModel):
    original_intent: str = Field(..., description="用户的原始自然语言指令")
    current_status: TaskStatus = TaskStatus.PENDING
    
    # 计划队列：Gemini 生成的一系列步骤
    plan: List[Action] = Field(default_factory=list, description="待执行的动作序列")
    
    # [Phase 5: Logic Lock] 
    # 核心安全组件：Z3 验证脚本
    # 如果字段非空，Runtime 必须在执行 plan 前先运行此脚本
    verification_script: Optional[str] = Field(
        None, 
        description="基于 Z3 Solver 的 Python 验证代码。必须输出 'SAFE' 才能放行。"
    )
    
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
    # 模拟 Phase 5 的数据结构
    task = TaskState(
        original_intent="删除临时文件",
        verification_script="print('SAFE') # Z3 Logic Placeholder"
    )
    
    # 模拟添加一个动作
    action = Action(
        tool_name="run_shell", 
        args={"command": "rm -rf /tmp/test"}, 
        rationale="清理垃圾"
    )
    task.plan.append(action)

    print(f"SRIU State Machine Initialized (Phase 5).")
    print(f"Target Intent: {task.original_intent}")
    print(f"Verification Script Present: {bool(task.verification_script)}")
    print(f"Action Args: {task.plan[0].args}")