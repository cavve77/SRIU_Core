import tkinter as tk
from tkinter import scrolledtext
import threading
import sys
from sriu.core.compiler import SemanticCompiler
from sriu.core.runtime import Runtime
from sriu.gui.theme import Theme

class SRIUNexus(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("SRIU NEXUS [v0.7.0]")
        self.geometry("800x600")
        Theme.apply(self)
        
        self.compiler = SemanticCompiler()
        self.runtime = Runtime()
        
        self._init_ui()
        self._log("SRIU SYSTEM ONLINE. WAITING FOR INPUT...")

    def _init_ui(self):
        # Output Area
        self.output_area = scrolledtext.ScrolledText(self, wrap=tk.WORD, font=Theme.TEXT_FONT, bg="#000000", fg=Theme.FOREGROUND, insertbackground=Theme.FOREGROUND)
        self.output_area.pack(expand=True, fill='both', padx=10, pady=10)
        self.output_area.config(state='disabled')
        
        # Input Area
        input_frame = tk.Frame(self)
        input_frame.pack(fill='x', padx=10, pady=(0, 10))
        
        self.input_field = tk.Entry(input_frame, font=Theme.TEXT_FONT, insertbackground=Theme.FOREGROUND)
        self.input_field.pack(side='left', expand=True, fill='x')
        self.input_field.bind("<Return>", self.process_command)
        
        send_btn = tk.Button(input_frame, text="EXECUTE", command=self.process_command, font=Theme.HEADER_FONT)
        send_btn.pack(side='right', padx=(5, 0))

    def _log(self, message):
        self.output_area.config(state='normal')
        self.output_area.insert(tk.END, f"> {message}\n")
        self.output_area.see(tk.END)
        self.output_area.config(state='disabled')

    def process_command(self, event=None):
        user_input = self.input_field.get()
        if not user_input: return
        
        self._log(f"USER: {user_input}")
        self.input_field.delete(0, tk.END)
        
        # Run in separate thread to keep UI responsive
        threading.Thread(target=self._execute_logic, args=(user_input,), daemon=True).start()

    def _execute_logic(self, text):
        try:
            self.output_area.after(0, self._log, "Thinking...")
            task = self.compiler.compile(text)
            self.output_area.after(0, self._log, f"Plan Generated: {len(task.plan)} steps.")
            
            # Execute
            self.runtime.execute(task)
            self.output_area.after(0, self._log, "Execution Complete.")
            
            # Show results
            for step in task.plan:
                if step.result:
                    self.output_area.after(0, self._log, f"[{step.tool_name}] Result: {step.result}")
        except Exception as e:
            self.output_area.after(0, self._log, f"ERROR: {str(e)}")

if __name__ == "__main__":
    app = SRIUNexus()
    app.mainloop()