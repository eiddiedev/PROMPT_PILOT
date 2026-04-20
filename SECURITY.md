# Security Policy

## Supported Versions

Only the latest state of the `main` branch is actively supported.

## Reporting A Vulnerability

Please do not open public issues for suspected vulnerabilities.

Report security issues privately to the project maintainer and include:

- A clear description of the issue
- Reproduction steps or proof of concept
- Impact assessment
- Any suggested mitigation, if available

The maintainer will acknowledge valid reports as quickly as possible and coordinate a fix before public disclosure when appropriate.

## Scope Notes

This app can call third-party model APIs when `DEEPSEEK_API_KEY` is configured. If you are reporting an issue related to secrets handling, request validation, or prompt injection risk, please mention the exact route and input shape involved.
