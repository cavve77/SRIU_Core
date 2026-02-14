import ast
import os
import json
import datetime
from pathlib import Path

class Scanner:
    def __init__(self, src_root, project_root):
        self.src_root = Path(src_root).resolve()
        self.project_root = Path(project_root).resolve()
        self.symbols = {}
        self.files = {}

    def _get_module_name(self, file_path):
        try:
            rel_path = file_path.relative_to(self.project_root / "src")
            return ".".join(rel_path.with_suffix("").parts)
        except ValueError:
            return None

    def _resolve_import(self, current_file, module, level):
        if level == 0:
            return module
        
        current_pkg = self._get_module_name(current_file).split('.')
        if current_file.name != "__init__.py":
            current_pkg = current_pkg[:-1]
            
        if level > len(current_pkg) + 1:
             return None
             
        base_pkg = current_pkg[:-(level-1)] if level > 1 else current_pkg
        
        if module:
            return ".".join(base_pkg + [module])
        return ".".join(base_pkg)

    def scan(self):
        # Pass 1: Definitions
        for root, _, files in os.walk(self.src_root):
            for file in files:
                if file.endswith(".py"):
                    self._pass1(Path(root) / file)
        
        # Pass 2: References
        for root, _, files in os.walk(self.src_root):
            for file in files:
                if file.endswith(".py"):
                    self._pass2(Path(root) / file)

    def _pass1(self, path):
        module_name = self._get_module_name(path)
        if not module_name: return
        
        str_path = str(path.relative_to(self.project_root).as_posix())
        self.files[str_path] = {"defines": [], "imports": []}
        
        try:
            with open(path, "r", encoding="utf-8") as f:
                tree = ast.parse(f.read(), filename=str_path)
        except Exception:
            return

        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.ClassDef)):
                full_name = f"{module_name}.{node.name}"
                doc = ast.get_docstring(node)
                self.symbols[full_name] = {
                    "type": "class" if isinstance(node, ast.ClassDef) else "function",
                    "path": str_path,
                    "line": node.lineno,
                    "desc": doc.strip() if doc else "No description provided.",
                    "used_by": []
                }
                self.files[str_path]["defines"].append(full_name)

    def _pass2(self, path):
        module_name = self._get_module_name(path)
        if not module_name: return
        str_path = str(path.relative_to(self.project_root).as_posix())
        
        try:
            with open(path, "r", encoding="utf-8") as f:
                tree = ast.parse(f.read(), filename=str_path)
        except Exception:
            return

        for node in ast.walk(tree):
            target_module = None
            if isinstance(node, ast.ImportFrom):
                target_module = self._resolve_import(path, node.module, node.level)
                if target_module:
                    for alias in node.names:
                        potential_symbol = f"{target_module}.{alias.name}"
                        if potential_symbol in self.symbols:
                            if str_path not in self.symbols[potential_symbol]["used_by"]:
                                self.symbols[potential_symbol]["used_by"].append(str_path)

    def save(self, out_path):
        registry = {
            "meta": {
                "project": "SRIU_Project",
                "updated_at": datetime.datetime.now().isoformat(),
                "version": "0.7.0"
            },
            "files": self.files,
            "symbols": self.symbols
        }
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(registry, f, indent=2)

if __name__ == "__main__":
    script_path = Path(__file__).resolve()
    project_root = script_path.parents[3]
    src_root = project_root / "src" / "sriu"
    
    print(f"Scanning {src_root}...")
    scanner = Scanner(src_root, project_root)
    scanner.scan()
    scanner.save(project_root / "global_registry.json")
    print("Registry updated.")