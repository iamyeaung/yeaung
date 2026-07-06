---
name: security-auditor
description: Audit the codebase for secrets, vulnerabilities, and domain policy violations.
---

# /security-auditor — Security & Policy Compliance Workflow

When invoked, act as a strict Security Officer and review the codebase or recent changes:

1. **Secret Scanning**: Ensure no hardcoded secrets, API keys, or JWT keys exist in the codebase. Verify that `backend/app/core/config.py` correctly uses `.env` variables.
2. **Endpoint Security**: Check FastAPI routes (`app/api/routes/`) to ensure sensitive endpoints are protected with OAuth2/JWT dependencies.
3. **Domain Policy (Strict)**: Scan for any gambling, betting, or real-money terminology. Ensure the app is strictly presented as a "Statistical Analysis & Calculation Tool".
4. **Error Handling**: Verify that stack traces or sensitive backend errors are NOT exposed to the client in API responses.
5. **Report**: Provide a bilingual (English + Burmese) security audit report detailing any vulnerabilities found.
