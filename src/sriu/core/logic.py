import sys
import io
from typing import Tuple
from z3 import * 

class LogicEngine:
    """
    Phase 5 Component: Logic Lock
    封装 Microsoft Z3 Solver，用于在运行时执行前的数学逻辑验证。
    """

    @staticmethod
    def verify_proof(z3_script: str) -> Tuple[bool, str]:
        """
        执行 LLM 生成的 Z3 验证脚本。
        """
        old_stdout = sys.stdout
        redirected_output = io.StringIO()
        sys.stdout = redirected_output

        local_scope = globals().copy()

        try:
            exec(z3_script, {}, local_scope)
            
            # 去除首尾空白字符
            output = redirected_output.getvalue().strip()
            
            # [Fix] 严格匹配：只有输出完全等于 "SAFE" 才通过
            # 防止 "UNSAFE" 这种包含 "SAFE" 子串的情况蒙混过关
            if output == "SAFE":
                return True, f"✅ Logic Verified: {output}"
            else:
                return False, f"❌ Logic Verification Failed. Expected 'SAFE', got: '{output}'"
                
        except Exception as e:
            return False, f"⚠️ Logic Script Execution Error: {str(e)}"
        finally:
            sys.stdout = old_stdout

if __name__ == "__main__":
    print("Testing LogicEngine (Fixed)...")
    
    # Pass
    good_script = """
print("SAFE")
"""
    # Fail (Logic Violation)
    bad_script = """
print("UNSAFE")
"""
    # Fail (Syntax Error)
    error_script = """
print(1/0)
"""

    engine = LogicEngine()
    print(f"Test 1 (Should Pass): {engine.verify_proof(good_script)}")
    print(f"Test 2 (Should Fail): {engine.verify_proof(bad_script)}")
    print(f"Test 3 (Should Error): {engine.verify_proof(error_script)}")