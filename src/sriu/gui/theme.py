class Theme:
    BACKGROUND = "#0f0f0f"
    FOREGROUND = "#00ff41"
    ACCENT = "#003b00"
    TEXT_FONT = ("Consolas", 10)
    HEADER_FONT = ("Segoe UI", 12, "bold")
    
    @staticmethod
    def apply(root):
        root.configure(bg=Theme.BACKGROUND)
        root.option_add("*Background", Theme.BACKGROUND)
        root.option_add("*Foreground", Theme.FOREGROUND)
        root.option_add("*Entry.Background", "#1a1a1a")
        root.option_add("*Button.Background", Theme.ACCENT)
        root.option_add("*Button.Foreground", Theme.FOREGROUND)
        root.option_add("*Button.activeBackground", Theme.FOREGROUND)
        root.option_add("*Button.activeForeground", Theme.BACKGROUND)