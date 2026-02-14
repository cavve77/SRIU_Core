# 文件路径: src/sriu/core/state.py
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

# 1. 动作类型枚举
class ActionType(str, Enum):
    RUN_SHELL = "run_shell"
    RUN_PYTHON = "run_python"
    READ_FILE = "read_file"
    WRITE_FILE = "write_file"

# 2. 任务状态枚举
class TaskStatus(str, Enum):
    PENDING = "pending"
    THINKING = "thinking"
    VERIFYING_LOGIC = "verifying_logic"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"

# 3. [FIX] 严格参数定义 (Strict Args Schema)
# 解决 Gemini API "additionalProperties not supported" 报错的核心
class ActionArgs(BaseModel):
    command: Optional[str] = Field(None, description="Shell command string (for run_shell)")
    code: Optional[str] = Field(None, description="Python source code (for run_python)")
    path: Optional[str] = Field(None, description="File path (for read/write_file)")
    content: Optional[str] = Field(None, description="File content to write (for write_file)")

# 4. 原子行动定义
class Action(BaseModel):
    tool_name: ActionType = Field(..., description="The tool to execute")
    
    # [IMPORTANT] 这里不再是 Dict，而是具体的 ActionArgs 对象
    args: ActionArgs = Field(..., description="Arguments for the tool")
    
    rationale: str = Field(..., description="Why this step is necessary")
    result: Optional[str] = Field(None, description="Execution result (Output)")

# 5. 任务状态机
class TaskState(BaseModel):
    original_intent: str = Field(..., description="User's original instruction")
    current_status: TaskStatus = TaskStatus.PENDING
    
    plan: List[Action] = Field(default_factory=list, description="List of actions")
    
    verification_script: Optional[str] = Field(
        None, 
        description="Z3 Solver script for safety verification. MUST print 'SAFE' if safe."
    )
    
    history: List[str] = Field(default_factory=list, description="Execution logs")
    
    # [Removed] memory 字段被暂时移除，以简化 JSON Schema，避免 API 报错
    
    def log(self, message: str):
        self.history.append(message)
        print(f"[SRIU-LOG] {message}")

    def update_status(self, new_status: TaskStatus):
        print(f"\n>>> [State Change] {self.current_status.value.upper()} -> {new_status.value.upper()}")
        self.current_status = new_status