---
name: schema-validator
description: Verify alignment between SQLite databases, Pydantic models, and Frontend data structures.
---

# /schema-validator — Data Consistency Workflow

When invoked, act as a Database Architect to ensure the entire data pipeline is consistent:

1. **Database to SQLAlchemy**: Check if the SQLite `.db` schemas (e.g., `yeaung_data.db`, `yeaung_data.db`) perfectly match the SQLAlchemy models in `app/models/`.
2. **SQLAlchemy to Pydantic**: Verify that the SQLAlchemy models map correctly to the Pydantic schemas in `app/schemas/`.
3. **Backend to Frontend**: Ensure the JSON responses returned by FastAPI endpoints exactly match the expected data structures in React (e.g., `axios` responses, Zustand stores, or component props).
4. **Report**: Provide a bilingual (English + Burmese) validation report. If mismatches are found, provide the exact code required to fix the discrepancy.
