# Contributing

## Scope

SRIU Core is experimental. Keep changes small, well-explained, and easy to validate.

## Local setup

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install .
Copy-Item .env.example .env
```

## Before opening a pull request

- Run `python -m unittest discover -s tests -p "test_*.py"`.
- Keep secrets in local `.env` files only.
- Do not commit generated cache files, logs, or virtual environments.
- Update README or docs if you change setup, entry points, or workflow assumptions.

## Pull request guidance

- Describe the user-visible change.
- Call out any runtime, prompt, or model-behavior tradeoffs.
- Mention whether the change is Windows-only or expected to work cross-platform.
