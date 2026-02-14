# 文件路径: verify_tm.py
import time
from pathlib import Path
from src.sriu.core.runtime import Runtime

def test_time_machine():
    print(">>> ( >_<)૭ STARTING TIME MACHINE TEST...\n")

    # 1. 初始化 Runtime (会自动生成 session_id)
    rt = Runtime()
    print(f"[Info] Session ID: {rt.session_id}")
    print(f"[Info] Backup Root: {rt.backup_root}")

    # 定义测试文件路径
    test_file = "tm_test_artifact.txt"
    p = Path(test_file)

    # 清理旧环境（如果存在）
    if p.exists():
        p.unlink()
        print(f"[Setup] Cleaned up old {test_file}")

    # 2. 第一次写入 (创建文件) - 不应触发备份
    print("\n--- Step 1: Create File (Version 1) ---")
    res1 = rt._write_file(test_file, "This is Version 1 Content.")
    print(res1)

    # 验证文件是否存在
    if not p.exists():
        print("(×_×) Failed: File was not created.")
        return

    # 3. 模拟时间流逝（确保备份文件名的时间戳可能不同，尽管我们主要依赖序列）
    time.sleep(1.5)

    # 4. 第二次写入 (覆盖文件) - 应触发备份
    print("\n--- Step 2: Overwrite File (Version 2) ---")
    res2 = rt._write_file(test_file, "This is Version 2 Content (Overwritten).")
    print(res2)

    # 5. 验证备份结果
    print("\n--- Step 3: Verification ---")
    if not rt.backup_root.exists():
        print("(×_×) FAILED: Backup directory was not created.")
    else:
        # 列出备份目录下的文件
        backups = list(rt.backup_root.iterdir())
        if len(backups) > 0:
            print(f"(b^_^)b SUCCESS! Found {len(backups)} backup(s):")
            for b in backups:
                print(f"   -> {b.name}")
                # 验证备份内容是否是 Version 1
                content = b.read_text(encoding="utf-8")
                if "Version 1" in content:
                    print("      [Check] Content matches Original (Version 1).")
                else:
                    print("      [Check] (o_O) Content mismatch!")
        else:
            print("(×_×) FAILED: Backup directory exists but is empty.")

    # 6. 清理测试产生的垃圾文件 (保留备份以便你手动检查)
    if p.exists():
        p.unlink()
        print(f"\n[Cleanup] Removed working file {test_file}")
        print(f"[Note] Backups are kept in .sriu/backups/{rt.session_id}/ for your inspection.")

if __name__ == "__main__":
    test_time_machine()