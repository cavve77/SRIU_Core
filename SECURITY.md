# Security Policy

## Reporting a vulnerability

Do not open a public issue for credential leaks, remote-code-execution paths, or other sensitive vulnerabilities.

Use GitHub's private vulnerability reporting flow if it is enabled for the repository. If private reporting is not enabled, contact the repository owner directly through GitHub before sharing details publicly.

## Secret handling

- Never commit `.env`, `.env.*`, logs, or machine-local cache files.
- Treat exposed API keys as compromised and rotate them immediately.
- Avoid passing secrets in screenshots, videos, shell history, or issue bodies.

## Supported branch

Security fixes are expected to land on `main`.
