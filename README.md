# SRIU Core

SRIU Core is a Windows-first experimental semantic compiler and guarded runtime that turns natural-language engineering requests into structured execution plans. It combines a Gemini-backed planner, a small runtime for shell and file actions, and optional Z3-based verification before execution.

## What is included

- A CLI workflow with short-term memory and a lightweight gatekeeper model.
- A Tkinter GUI for interactive local use.
- A runtime that can read files, write files, execute shell commands, and run constrained Python snippets.
- A registry scanner that indexes project symbols into a local cache file.
- Basic CI, issue templates, and repository hygiene for public release.

## Status

This project is experimental and currently optimized for Windows + PowerShell workflows. Expect sharp edges, evolving prompts, and breaking changes between versions.

## Requirements

- Python 3.12+
- A valid Gemini API key exposed as `GEMINI_API_KEY`
- Windows PowerShell for the current runtime shell path

## Quick start

1. Clone the repository.
2. Create and activate a virtual environment.
3. Install the project.
4. Copy `.env.example` to `.env` and fill in your own key.

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install .
Copy-Item .env.example .env
```

## Running the project

CLI:

```powershell
python -m sriu
```

GUI:

```powershell
python -m sriu.gui.app
```

Optional PowerShell helper bootstrap:

```powershell
. .\boot.ps1
```

## Environment variables

Create a local `.env` file from `.env.example` and keep it out of version control.

| Variable | Required | Description |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes | API key used by the compiler and gatekeeper models. |

## Project layout

```text
src/sriu/
  console.py            Interactive CLI entry point
  gui/app.py            Tkinter GUI entry point
  core/compiler.py      Gemini-backed planning layer
  core/runtime.py       Action executor and backups
  core/logic.py         Z3 verification helper
  tools/registry_scanner.py
```

## Security notes

- Never commit `.env`, `.env.*`, logs, or local cache files.
- Rotate the API key immediately if it is ever committed or shared.
- The GUI no longer mirrors the full environment key back into the input field to reduce accidental exposure in screenshots or recordings.

## Development

Run the built-in test suite:

```powershell
python -m unittest discover -s tests -p "test_*.py"
```

Repository guidance lives in:

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [SECURITY.md](SECURITY.md)
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Before making the repository public

- Add a `LICENSE` file with the license you want to use.
- Review repository settings on GitHub and enable branch protection, dependency alerts, and secret scanning.
- Re-check that no real credentials exist in tracked files or commit history.
