import unittest

from sriu.core.logic import LogicEngine


class LogicEngineTests(unittest.TestCase):
    def test_safe_script_is_accepted(self):
        is_safe, message = LogicEngine.verify_proof("print('SAFE')")

        self.assertTrue(is_safe)
        self.assertIn("SAFE", message)

    def test_unexpected_output_is_rejected(self):
        is_safe, message = LogicEngine.verify_proof("print('UNSAFE')")

        self.assertFalse(is_safe)
        self.assertIn("UNSAFE", message)


if __name__ == "__main__":
    unittest.main()
