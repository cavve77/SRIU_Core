# 文件名: boot.ps1
# 作用: SRIU 系统启动引导 - 加载密钥并注册工具别名

Write-Host ">>> SRIU (Self-Regulating Intelligence Unit) Boot Sequence Initiated..." -ForegroundColor Cyan

# 1. 加载 .env 环境变量 (兼容注释和空行)
if (Test-Path ".env") {
    Get-Content .env | ForEach-Object {
        if ($_ -match "^\s*#") { return } # 跳过注释
        if ($_ -match "^\s*$") { return } # 跳过空行
        $parts = $_ -split '=', 2
        if ($parts.Count -eq 2) {
            [Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), "Process")
        }
    }
    Write-Host "[OK] Environment Secrets Loaded." -ForegroundColor Green
} else {
    Write-Host "[ERR] .env file not found!" -ForegroundColor Red
}

# 2. 注册 Aider 快捷指令 (代码构建者)
# 使用 function 而不是 alias，以便传入参数
function sriu-code {
    Write-Host ">>> Launching Aider (Semantic Compiler)..." -ForegroundColor Yellow
    # 允许透传参数，例如 sriu-code --message "Fix bug"
    uvx --from aider-chat aider --model gemini/gemini-2.0-flash --no-git $args
}

# 3. 注册 Open Interpreter 快捷指令 (系统操作者)
function sriu-op {
    Write-Host ">>> Launching Open Interpreter (System Actuator)..." -ForegroundColor Magenta
    # 包含 setuptools<80 修复补丁
    uvx --from open-interpreter --with "setuptools<80" interpreter --model gemini/gemini-2.0-flash --api_key $env:GEMINI_API_KEY $args
}

Write-Host "----------------------------------------------------------------"
Write-Host "System Ready. Available Commands:" -ForegroundColor White
Write-Host "  1. sriu-code  : Start Aider (Coding Mode)" -ForegroundColor Green
Write-Host "  2. sriu-op    : Start Open Interpreter (OS Mode)" -ForegroundColor Magenta
Write-Host "----------------------------------------------------------------"