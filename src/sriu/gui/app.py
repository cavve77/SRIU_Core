import os
import queue
import subprocess
import sys
import threading
import tkinter as tk
from tkinter import messagebox, scrolledtext, ttk

from dotenv import load_dotenv

from sriu.core.compiler import SemanticCompiler
from sriu.core.runtime import Runtime
from sriu.core.state import ActionType, TaskStatus
from sriu.gui.theme import Theme


class SRIUNexus(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("SRIU NEXUS [v0.9.2] - The Eye of Providence")
        self.geometry("900x700")
        Theme.apply(self)

        load_dotenv()
        self.env_api_key = os.getenv("GEMINI_API_KEY", "").strip()

        self.log_queue = queue.Queue()
        self.compiler = None
        self.runtime = Runtime()

        self._init_ui()
        self._check_queue()

        # Delayed init prevents startup errors from blocking window creation.
        self.after(500, self._auto_connect)

    def _init_ui(self):
        control_frame = tk.Frame(self, bg=Theme.BACKGROUND)
        control_frame.pack(fill="x", padx=10, pady=5)

        tk.Label(
            control_frame,
            text="Model:",
            bg=Theme.BACKGROUND,
            fg=Theme.FOREGROUND,
        ).pack(side="left")

        self.model_var = tk.StringVar(value="gemini-2.0-flash")
        self.model_combo = ttk.Combobox(control_frame, textvariable=self.model_var)
        self.model_combo["values"] = (
            "gemini-2.0-flash",
            "gemini-1.5-pro",
            "gemini-1.5-flash",
        )
        self.model_combo.pack(side="left", padx=5)

        tk.Label(
            control_frame,
            text="API Key:",
            bg=Theme.BACKGROUND,
            fg=Theme.FOREGROUND,
        ).pack(side="left", padx=(10, 0))
        self.api_key_entry = tk.Entry(control_frame, show="*", width=20)
        self.api_key_entry.pack(side="left", padx=5)

        tk.Button(
            control_frame,
            text="CONNECT",
            command=self._connect_core,
            bg="#004400",
            fg="#00ff00",
        ).pack(side="left", padx=10)

        self.output_area = scrolledtext.ScrolledText(
            self,
            wrap=tk.WORD,
            font=Theme.TEXT_FONT,
            bg="#000000",
            fg=Theme.FOREGROUND,
            insertbackground=Theme.FOREGROUND,
        )
        self.output_area.pack(expand=True, fill="both", padx=10, pady=5)
        self.output_area.config(state="disabled")

        input_frame = tk.Frame(self, bg=Theme.BACKGROUND)
        input_frame.pack(fill="x", padx=10, pady=(0, 10))

        self.input_field = tk.Entry(
            input_frame,
            font=("Consolas", 11),
            insertbackground=Theme.FOREGROUND,
            bg="#1a1a1a",
            fg="white",
        )
        self.input_field.pack(side="left", expand=True, fill="x", ipady=5)
        self.input_field.bind("<Return>", self.process_command)

        tk.Button(
            input_frame,
            text=" EXECUTE ",
            command=self.process_command,
            font=Theme.HEADER_FONT,
            bg=Theme.ACCENT,
            fg=Theme.FOREGROUND,
        ).pack(side="right", padx=(5, 0))

    def _log(self, message):
        self.log_queue.put(message)

    def _check_queue(self):
        while not self.log_queue.empty():
            msg = self.log_queue.get()
            self.output_area.config(state="normal")
            self.output_area.insert(tk.END, f"> {msg}\n")
            self.output_area.see(tk.END)
            self.output_area.config(state="disabled")
        self.after(100, self._check_queue)

    def _auto_connect(self):
        if self.api_key_entry.get().strip() or self.env_api_key:
            self._connect_core()
        else:
            self._log("WARNING: API Key missing. Please enter Key and click CONNECT.")

    def _connect_core(self):
        key = self.api_key_entry.get().strip() or self.env_api_key
        if not key:
            messagebox.showerror("Error", "API Key is required!")
            return

        self.env_api_key = key
        os.environ["GEMINI_API_KEY"] = key
        model = self.model_var.get()

        try:
            self.compiler = SemanticCompiler(model_id=model)
            self._log(f"SYSTEM ONLINE. CORE: [{model}]")
            self._log("Ready for instructions...")
        except Exception as exc:
            self._log(f"CONNECTION FAILED: {exc}")

    def process_command(self, event=None):
        user_input = self.input_field.get()
        if not user_input:
            return

        self.input_field.delete(0, tk.END)
        self._log(f"USER: {user_input}")

        if not self.compiler:
            self._log("ERROR: Core offline. Please Connect first.")
            return

        threading.Thread(target=self._execute_logic, args=(user_input,), daemon=True).start()

    def _execute_logic(self, text):
        try:
            self._log("Thinking...")
            task = self.compiler.compile(text)
            self._log(f"Plan Generated: {len(task.plan)} steps.")

            self.runtime.execute(task)
            self._log("Execution Complete.")

            file_modified = False
            for step in task.plan:
                if step.result:
                    display_result = (
                        step.result[:200] + "..."
                        if len(step.result) > 200
                        else step.result
                    )
                    self._log(f"[{step.tool_name}] {display_result}")

                if step.tool_name == ActionType.WRITE_FILE:
                    file_modified = True

            if file_modified and task.current_status == TaskStatus.COMPLETED:
                self._log("[Auto-Sync] Refreshing Registry...")
                if getattr(sys, "frozen", False):
                    self._log("[Auto-Sync] Skipped in EXE mode (feature pending).")
                else:
                    subprocess.run(
                        [sys.executable, "src/sriu/tools/registry_scanner.py"],
                        check=True,
                    )
                    self._log("[Auto-Sync] Registry Updated.")

        except Exception as exc:
            self._log(f"RUNTIME ERROR: {exc}")


def main():
    app = SRIUNexus()
    app.mainloop()


if __name__ == "__main__":
    main()
