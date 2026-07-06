---
name: save-memory
description: End-of-session persistence. Run before finishing so decisions, changes, and gotchas survive to the next session/tool. Writes to .agents/memory/MEMORY.md and .agents/memory/decisions/ (the same files /start reads).
---

# /save-memory — Persist context before ending

> **Why this exists:** decisions made in chat evaporate when the session ends. This
> ritual writes them to disk so the next `/start` can recover them.
>
> **Canonical locations (do NOT change):** the running log is
> [.agents/memory/MEMORY.md](../../memory/MEMORY.md) and decision records live in
> [.agents/memory/decisions/](../../memory/decisions/). These are the exact files `/start`,
> `AGENTS.md`, and `CLAUDE.md` read — writing anywhere else (e.g. a separate
> CHANGELOG) silently breaks memory recovery for the next session.

## Steps

1. **MEMORY.md entry** — Add a dated entry at the TOP of the Log section in
   [.agents/memory/MEMORY.md](../../memory/MEMORY.md) (newest on top), using the format in that
   file's header:
   - **Changed:** what was actually done (files/areas).
   - **Why:** the reason / the problem it solved.
   - **Gotchas:** anything surprising a future agent must know.
   - **Open threads:** unfinished follow-ups.

   Also refresh the **"Current focus"** section at the top of MEMORY.md if the focus shifted.

   **Archive policy (token efficiency):** MEMORY.md's Log section should hold roughly the
   15 most recent entries. When it grows past that (or past ~300 lines), move the oldest
   entries verbatim into `.agents/memory/archive/<YYYY-MM>.md` (create the folder/file if
   needed) and leave one line at the bottom of the Log: "Older entries: see archive/".
   Never rewrite or summarize archived entries — move them as-is.
2. **Decision record (ADR)** — If a non-trivial technical/architecture decision was made
   (new pattern, dependency, tradeoff, or a rule change), copy
   [.agents/memory/decisions/TEMPLATE.md](../../memory/decisions/TEMPLATE.md) to the next numbered
   record in [.agents/memory/decisions/](../../memory/decisions/) (Context → Decision →
   Consequences) and add a row to the index table in its `README.md`.
3. **Structure docs** — If files/folders were added, moved, or split, update
   [docs/PROJECT_MAP.md](../../../docs/PROJECT_MAP.md) — and
   [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) if a layer/subsystem changed.
4. **New convention** — If a new coding rule/convention emerged, add it to the correct
   `.agents/` file ([agents.md](../../agents.md) for global rules, or the relevant doc
   under `.agents/rules/`) and add/adjust its row in [.agents/INDEX.md](../../INDEX.md).
5. **Link check** — Run `python scripts/check_doc_links.py` from the repo root. If it
   reports broken links (usually caused by files moved this session), fix them before
   finishing — a broken doc graph silently blinds the next agent.
6. **Show the diff** — Before the user commits, show what was written (`git diff --stat`
   or the changed doc content) so nothing is persisted silently.

## Bilingual rule

Any new `.md` content in `.agents/` must be `***English***` first, then `***Myanmar***`
(agents read English only). MEMORY.md entries may use a compact bilingual line.

---

*Myanmar — ဘာလို့လိုအပ်လဲ:*
*Chat ထဲက ဆုံးဖြတ်ချက်တွေ session ဆုံးရင် ပျောက်တယ်။ ဒီ ritual က disk ပေါ်ရေးပေးတယ် —*
*.agents/memory/MEMORY.md မှာ entry (ဘာပြောင်း/ဘာကြောင့်/gotcha/open threads)၊ decision ရှိရင်*
*.agents/memory/decisions/ မှာ ADR အသစ်၊ file tree ပြောင်းရင် `docs/PROJECT_MAP.md` update၊*
*ပြီးမှ commit မလုပ်ခင် diff ပြပါ။ **သတိ:** `/start` က ဖတ်တဲ့ file တွေက ဒီ file တွေပဲ*
*ဖြစ်လို့ တခြားနေရာမှာ သွားရေးရင် memory ပျောက်ပါမယ်။*
