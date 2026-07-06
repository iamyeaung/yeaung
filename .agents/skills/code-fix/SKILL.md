---
name: code-fix
description: Reads recorded findings from all analysis skills (code-review, qa-tester, ui-ux-tester) and executes prioritized fixes based on user approval. Write-only counterpart to the read-only analysis pipeline.
---

# /code-fix — Unified Code Remediation Workflow (Write-Only)

> **Role:** Act as the single **write-only remediation agent** for this project. You read
> findings recorded by the 3 read-only analysis skills (`/code-review`, `/qa-tester`,
> `/ui-ux-tester`) and fix them **only after explicit user approval**.
>
> **Parent Rules:** [AGENTS.md](../../../AGENTS.md) | [agents.md](../../agents.md)

---

## [READ → PRESENT → APPROVE → FIX → VERIFY → MARK FIXED]

---

## Step 1: Read All Report Files

Read these 3 report files and collect all **unresolved** items (items still `- [ ]`, NOT marked `[FIXED]`):

| Source Skill | Report File |
|---|---|
| `/code-review` | [code_review_records.md](../../reports/code_review_records.md) |
| `/qa-tester` | [qa_tester_records.md](../../reports/qa_tester_records.md) |
| `/ui-ux-tester` | [ui_ux_tester_records.md](../../reports/ui_ux_tester_records.md) |

**Fastest path — aggregate unresolved items automatically** (read-only):

```bash
bash .agents/skills/code-fix/scripts/code_fix_helper.sh findings
```
```powershell
powershell -File .agents/skills/code-fix/scripts/code_fix_helper.ps1 findings
```

**If none of the 3 files exist or all are empty**, STOP and tell the user to run one of the
analysis skills first (`/code-review`, `/qa-tester`, or `/ui-ux-tester`) — **do not invent issues**.

---

## Step 2: Present Merged Priority List

Show the user a consolidated view grouped by **source → priority**:

```
📋 Code Review Issues (from /code-review):
  🔴 High Priority (ဦးစားပေး):
    1. [AREA] file/path.ext:L## — issue description
    2. ...
  🟡 Normal Priority (ပုံမှန်):
    1. [AREA] file/path.ext — issue description
    2. ...

📋 QA Tester Issues (from /qa-tester):
  🔴 High Priority (ဦးစားပေး):
    1. ...
  🟡 Normal Priority (ပုံမှန်):
    1. ...

📋 UI/UX Tester Issues (from /ui-ux-tester):
  🔴 High Priority (ဦးစားပေး):
    1. ...
  🟡 Normal Priority (ပုံမှန်):
    1. ...
```

If a report file doesn't exist or has no unresolved items, show:
```
📋 [Source] Issues: ✅ No unresolved issues (or not yet analyzed)
```

---

## Step 3: Interactive Approval

Use your agent's structured question tool (**`AskUserQuestion`** in Claude Code; `ask_question` in
Antigravity) to ask the user what to fix. Present options like:

- "Fix ALL High Priority issues from all sources"
- "Fix ALL issues from /code-review only"
- "Fix ALL issues from /qa-tester only"
- "Fix ALL issues from /ui-ux-tester only"
- "Let me pick specific issues"

**Note:** The `ask_question` dialog must follow bilingual rules (English + Myanmar).

If the user picks "specific issues", list individual items and let them select.

---

## Step 4: Fix & Verify

Once approved:

0. **Safety checkpoint (BEFORE editing anything):** create a reversible restore point so a bad
   fix can be rolled back. This is write-only work — never start without it.
   ```bash
   bash .agents/skills/code-fix/scripts/code_fix_helper.sh checkpoint
   ```
   (Saves a stash snapshot without touching the working tree; restore with `git stash apply`.)

1. **Fix:** Execute the changes using the appropriate code editing tools.
   - Follow ALL project golden rules ([AGENTS.md §4 — Golden rules](../../../AGENTS.md))
   - For editor/canvas changes, warn about regression risks (Protocol 7)
   - For changes touching >3 files, consider a git worktree

2. **Recheck:** After each fix, verify concretely — don't just assume it compiles:
   - Re-run the source skill's sweep to confirm the finding is actually gone:
     - code-review finding → `bash .agents/skills/code-review/scripts/run_review.sh --working`
     - qa-tester finding → `bash .agents/skills/qa-tester/scripts/run_qa.sh` (or just the affected target)
   - Run the relevant existing test if one exists
   - Verify it didn't break neighboring functionality

3. **Format:** After all fixes (uses the correct npm-based frontend tooling, not bun):
   ```bash
   bash .agents/skills/code-fix/scripts/code_fix_helper.sh format
   ```
   Or manually — Backend: `npx prettier --write \"src/**/*.{js,jsx,ts,tsx,css,md}\"` in `frontend`;
   Frontend: `npm run format` in `frontend`.

---

## Step 5: Update Report Records

For each fixed issue, update its status in the **source report file**:

- Change `- [ ]` to `- [x] [FIXED]`
- Add the fix date: `[FIXED 2026-MM-DD]`

Example:
```markdown
# Before:
- [ ] **[Edge Case]** `yeaung_service.ts:L45` — Missing null check on yeaung_name

# After:
- [x] [FIXED 2026-07-03] **[Edge Case]** `yeaung_service.ts:L45` — Missing null check on yeaung_name
```

---

## Step 6: Summary & Save Memory

Provide a **bilingual summary** (English + Burmese):
- How many issues were fixed (by source and priority)
- Which files were modified
- Any issues that were skipped or deferred

Then explicitly instruct the user to run `/save-memory` to persist the session context.

---

*Myanmar — အနှစ်ချုပ်:*
*ဒီ skill က `/code-review`, `/qa-tester`, `/ui-ux-tester` ၃ ခုစလုံးရဲ့ findings ကို ဖတ်ပြီး user approval ပေါ်မူတည်ပြီး ပြင်ဆင်ပေးတဲ့ write-only skill ဖြစ်ပါတယ်။ Source/Priority အလိုက် merged list ပြ → user ရွေးခိုင်း → ပြင် → verify → report file မှာ FIXED အဖြစ် mark → session save ညွှန်ကြားပါတယ်။ Report file တစ်ခုမှ မရှိရင် analysis skill ကို အရင်ခေါ်ဖို့ ပြောပါတယ်။*
