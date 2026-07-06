---
name: deploy-assistant
description: Prepare the project for deployment (Docker, Google Cloud Run) and verify environment configurations.
---

# /deploy-assistant — Deployment Readiness Workflow

When invoked, act as a DevOps Engineer to prepare the application for a production release:

1. **Environment Check**: Ensure `.env.example` files are up-to-date in both frontend and backend. Warn if any required production variables are missing.
2. **Build Verification**: 
   - Check if the React frontend builds successfully (`npm run build`).
   - Check if the `docker-compose.yml` and `Dockerfile` are correctly configured for production (e.g., using Gunicorn/Uvicorn appropriately).
3. **Cloud Run / Infra Config**: Verify that `cloudbuild.yaml` or any Google Cloud Run configurations align with the current project structure.
4. **Report**: Provide a bilingual (English + Burmese) deployment readiness checklist and flag any issues blocking a successful deployment.
