---
name: planning-and-task-breakdown
description: Breaks work into ordered tasks. Use when you have a spec or clear requirements.
---

# /planning-and-task-breakdown

Decompose work into small, verifiable tasks. Every task should be small enough to implement, test, and verify in a single focused session.

## The Process
1. **Enter Plan Mode**: Do not write code. Read the spec and codebase.
2. **Dependency Graph**: Map what depends on what. Build foundations first.
3. **Slice Vertically**: Build one complete feature path at a time (e.g., UI + API + DB for one action).
4. **Write Tasks**: Ensure each task respects **responsibility-based modularity** (soft thresholds: 300/500 lines, single-responsibility per file). Plan file splits only when multiple responsibilities exist.

---

*Myanmar — အနှစ်ချုပ်:*
*ကြီးမားတဲ့ feature တွေကို သေးငယ်တဲ့ task လေးတွေအဖြစ် ခွဲထုတ်ပေးတဲ့ skill ပါ။ Responsibility-based modularity rule (soft thresholds: 300/500 lines) ကို လိုက်နာဖို့အတွက် file တွေကို ဘယ်လိုခွဲထုတ်မလဲဆိုတာ ကြိုတင် Plan ချပေးပါတယ်။*
