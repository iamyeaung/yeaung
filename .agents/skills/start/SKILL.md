---
name: start
description: Session bootstrap. Run at the START of EVERY new chat to restore project memory before writing any code.
---

# /start — Restore context before coding

You are (likely) starting a fresh session with no memory of previous chats. Do the
following **in order**, then STOP and wait for the user's actual task. Do NOT write
production code during /start.

1. Read **[AGENTS.md](../../../AGENTS.md)** (source of truth) and **[.agents/agents.md](../../agents.md)** (full constitution).
   If you don't already know the codebase, also skim **[docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md)**
   and **[docs/PROJECT_MAP.md](../../../docs/PROJECT_MAP.md)**.
2. Read **[.agents/memory/MEMORY.md](../../memory/MEMORY.md)** — current focus + recent log entries.
3. Skim **[.agents/memory/decisions/](../../memory/decisions/)** — the latest 2–3 ADRs.
4. Run `git status` and `git log --oneline -15` to see the branch and recent work.
5. Identify which **domain doc(s) in `.agents/`** are relevant to the user's task (search,
   yeaung, editor/canvas, db-migration, drag-drop…) and read those before touching related code.

Then report back a short **bilingual** summary (≤6 bullets):
- Current branch & what it's for
- Most recent 1–2 changes (from MEMORY.md / git)
- Any open threads or gotchas
- Which `.agents/` domain doc(s) apply to the task
- Then ask the user to confirm the task before you propose changes (proposal-first rule).

*(Chat အသစ်တိုင်း ကုဒ်မရေးခင် အထက်ပါအတိုင်း context ပြန်ဆွဲ၊ bilingual summary ပြ၊ ပြီးမှ user ရဲ့ task ကို စောင့်ပါ။)*
