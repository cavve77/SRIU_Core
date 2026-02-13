import sys
import io
from typing import Tuple
from z3 import * 

class LogicEngine:
    """
    Phase 5 Component: Logic Lock (Kaomoji Edition)
    """

    @staticmethod
    def verify_proof(z3_script: str) -> Tuple[bool, str]:
        old_stdout = sys.stdout
        redirected_output = io.StringIO()
        sys.stdout = redirected_output

        local_scope = globals().copy()

        try:
            exec(z3_script, {}, local_scope)
            output = redirected_output.getvalue().strip()
            
            if output == "SAFE":
                return True, f"(^_<) Logic Verified: {output}"
            else:
                return False, f"(>_<) Logic Verification Failed. Expected 'SAFE', got: '{output}'"
                
        except Exception as e:
            return False, f"(×_×) Logic Script Execution Error: {str(e)}"
        finally:
            sys.stdout = old_stdout