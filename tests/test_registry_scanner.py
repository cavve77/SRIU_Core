import tempfile
import unittest
from pathlib import Path

from sriu.tools.registry_scanner import Scanner


class ScannerTests(unittest.TestCase):
    def test_scan_collects_definitions_and_import_usage(self):
        with tempfile.TemporaryDirectory() as tmp_dir:
            project_root = Path(tmp_dir)
            src_root = project_root / "src" / "sriu"
            core_root = src_root / "core"
            core_root.mkdir(parents=True)

            (src_root / "__init__.py").write_text("", encoding="utf-8")
            (core_root / "__init__.py").write_text("", encoding="utf-8")
            (core_root / "alpha.py").write_text(
                "def helper():\n    return 'ok'\n",
                encoding="utf-8",
            )
            (core_root / "beta.py").write_text(
                "from .alpha import helper\n\n\ndef use():\n    return helper()\n",
                encoding="utf-8",
            )

            scanner = Scanner(src_root, project_root)
            scanner.scan()

            self.assertIn("sriu.core.alpha.helper", scanner.symbols)
            self.assertIn("src/sriu/core/alpha.py", scanner.files)
            self.assertIn(
                "src/sriu/core/beta.py",
                scanner.symbols["sriu.core.alpha.helper"]["used_by"],
            )


if __name__ == "__main__":
    unittest.main()
