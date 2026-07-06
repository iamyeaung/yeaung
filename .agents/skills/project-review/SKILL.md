---
name: project-review
description: Evaluates the entire project macro-structure against strict token-efficiency, architecture, and maintenance rules.
---

# /project-review — Project Architecture & Token Optimization Review

When invoked, perform a comprehensive macro-level review of the project. Do NOT fix anything immediately. Follow these checks:

## Review Categories

1. **Context Window Management (Modular Structure):**
   - Are there docs or code files violating the responsibility-based modularity rule (soft thresholds: <300 healthy, 300–500 review if multi-responsibility, >500 flag to human)? Never auto-split — record and propose.
2. **Architecture & Tech Stack (Performance):**
   - Does the codebase strictly follow the defined tech stack (e.g., no banned packages)? 
3. **AI Memory & System Rules (Consistency):**
   - Are the `.agents/` rules being respected across the project? Are any rules conflicting?
4. **Task Decomposition & Micro-tasking:**
   - Are features correctly broken down into vertical slices, or are they monoliths?
5. **Verification & CI/CD (QA):**
   - Are CI/CD configurations (e.g., GitHub Actions) present and aligned with project needs?
6. **Orphaned File / Dead Code Detection:**
   - Scan for UI components, logic files, or old docs that are no longer referenced.
7. **Dependency Drift:**
   - Check `frontend/package.json` and `frontend/package.json`. Are there unnecessary heavy packages when native solutions (built-in React hooks, stdlib/numpy) exist?

## Execution Steps

1. **Analyze**: Audit the project against the 7 categories above.
2. **Record**: If an element is missing, add it to the report as an update requirement. If an element exists but is outdated/drifting, add it to the report.
3. **Save**: Write the categorized findings directly into [`../../reports/project_review_records.md`](../../reports/project_review_records.md) as High Priority (ဦးစားပေး) or Normal Priority (ပုံမှန်).
4. **Report**: Provide a bilingual (English + Burmese) summary of the findings and ask the user which High Priority items to act on (fixes follow the Proposal-First rule).

---

*Myanmar — အနှစ်ချုပ်:*
*ဒီ skill က Project တစ်ခုလုံးရဲ့ ဖွဲ့စည်းပုံ၊ Token သုံးစွဲမှု၊ Architecture နဲ့ မလိုအပ်တဲ့ Package တွေကို အသေးစိတ် စစ်ဆေးပေးပါတယ်။ စစ်ဆေးတွေ့ရှိချက်တွေကို ချက်ချင်းမပြင်ဘဲ **High Priority** နဲ့ **Normal Priority** ခွဲခြားပြီး `.agents/reports/project_review_records.md` ဖိုင်ထဲမှာ မှတ်တမ်းတင်ပေးပါတယ်။ ပြီးရင် user ကို အစီရင်ခံစာတင်ပြပြီး ဘယ် High Priority အချက်တွေကို ပြင်မလဲ မေးရပါမယ် (Proposal-First rule အတိုင်း)။*
