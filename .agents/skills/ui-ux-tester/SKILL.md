---
name: ui-ux-tester
description: Visual and usability QA — audits theme consistency, responsive layout, accessibility, interactive states, and design system compliance. Read-only (never modifies source code).
---

# /ui-ux-tester — Visual & Usability Quality Audit (Read-Only)

> **Role:** Act as a strict UI/UX Quality Inspector for the TBWays Tools Full-Stack Web app
> (React 18 + Tailwind CSS). Your job is to **discover and record** visual, design, and
> usability issues — **NEVER fix code directly.** All findings go to the report file for
> `/code-fix` to consume.
>
> **Parent Rules:** [AGENTS.md](../../../AGENTS.md) | [agents.md](../../agents.md)
> **Design Rules:** [design_rules.md](../../rules/core_and_standards/design_rules.md)
> **Frontend Rules:** [frontend_rules.md](../../rules/core_and_standards/frontend_rules.md)

---

## [STRICT CONSTRAINT: READ-ONLY]

⛔ **DO NOT** modify any source code, CSS, or configuration files.
✅ **DO** inspect code, open the browser (with permission), take screenshots, and **record all findings** to the report file.

---

> **Fastest path — run the static audit script first** to front-load every greppable check
> (hardcoded colors, inline styles, inline fontSize, clickable `<div>`, `<img>` without alt,
> dark-mode coverage). Read-only; combine its output with the browser check (Step 8):
>
> ```bash
> bash .agents/skills/ui-ux-tester/scripts/run_ui_audit.sh
> ```
> ```powershell
> powershell -File .agents/skills/ui-ux-tester/scripts/run_ui_audit.ps1   # Windows (primary shell)
> ```

---

## Step 1: Design System & Theme Consistency Audit

### This project's theme tokens (the CORRECT way — do NOT flag these)
Tailwind is configured with `darkMode: 'class'` and CSS-variable-backed tokens
([tailwind.config.js](../../../frontend/tailwind.config.js)):

| Token class | Meaning |
|---|---|
| `bg-main`, `bg-card` | surface backgrounds (`var(--color-bg-*)`) |
| `text-main`, `text-muted` | foreground text (`var(--color-text-*)`) |
| `border` | border color (`var(--color-border)`) |
| `primary` | brand red `#D6001C` |
| `blue-*`, `indigo-*` | intentionally remapped to the red brand — **not a bug** if used |

A **violation** is a raw `#hex` / `rgb()` / `hsl()` literal or an inline `style={{ color/background }}`
where one of the tokens above should be used instead.

### Tailwind Theme Compliance
Scan all frontend files for violations:

| Check | How to detect | Severity |
|---|---|---|
| **Hardcoded colors** | Search for `color:`, `background:`, `#[0-9a-f]`, `rgb(`, `hsl(` in JSX/CSS that should be Tailwind classes | High |
| **Hardcoded font sizes** | Search for `font-size:` or inline `fontSize:` instead of Tailwind `text-*` classes | Normal |
| **Hardcoded spacing** | Search for `margin:`, `padding:` with pixel values instead of Tailwind `m-*`, `p-*` | Normal |
| **Inline styles** | Search for `style={{` in JSX — flag when a Tailwind class equivalent exists | Normal |
| **Inconsistent color usage** | Same semantic meaning (e.g., "success", "danger") using different colors across components | High |

### Dark/Light Mode
- Check if `dark:` variants are used consistently
- Identify components that render incorrectly in dark mode (missing dark variants)

### Typography
- Verify font family consistency (Google Fonts like Inter/Roboto vs browser defaults)
- Check heading hierarchy (`h1` > `h2` > `h3` — proper nesting, single `h1` per page)

---

## Step 2: Responsive Layout Audit

### Breakpoint Coverage
Check that key pages handle these Tailwind breakpoints:

| Breakpoint | Width | What to check |
|---|---|---|
| `sm` | 640px | Mobile layout — sidebar collapsed, stacked layouts |
| `md` | 768px | Tablet — adjusted grid columns |
| `lg` | 1024px | Desktop — full layout |
| `xl` | 1280px | Wide screen — no excessive whitespace |

### Common Issues to Flag
- Horizontal overflow (content wider than viewport)
- Text truncation without `title` attribute or tooltip
- Images/tables not responsive (fixed widths)
- Sidebar/navigation unusable on mobile
- Touch targets too small for mobile (< 44px)

---

## Step 3: Component Reuse & Consistency Audit

### Shared Components Check
- Read `frontend/src/components/` to understand available shared components
- Scan feature pages for **duplicate UI patterns** that should use shared components:
  - Multiple button styles that should be one `Button` component
  - Repeated modal patterns that should use a shared `Modal`
  - Duplicate loading spinners, error messages, empty states

### Naming & Structure
- Component file names follow PascalCase convention
- Props are destructured consistently
- Components are focused (single visual responsibility)

---

## Step 4: Interactive States Audit

For each interactive element (buttons, inputs, links, cards), verify these states exist:

| State | What to check |
|---|---|
| **Default** | Base appearance is clear and intentional |
| **Hover** | Visual feedback on mouse hover (`hover:` classes) |
| **Focus** | Keyboard focus ring visible (`focus:`, `focus-visible:`) |
| **Active/Pressed** | Click feedback (`active:` classes) |
| **Disabled** | Grayed out + `cursor-not-allowed` + non-interactive |
| **Loading** | Spinner or skeleton while async operation runs |
| **Error** | Red border/text for validation errors, error messages |
| **Empty** | Empty state message when no data (not just blank space) |

Priority pages to check:
- `/yeaung-update` (YeaungSidebar, YeaungDataTable, BinaryModelManager)
- `/editor` (canvas controls, toolbar buttons)
- Search pages (search input, results list)
- Auth pages (login form)

---

## Step 5: Animation & Transition Audit

### Smooth Transitions
- Modal open/close — fade + scale or slide animation
- Sidebar expand/collapse — smooth width transition
- Page navigation — no jarring jumps
- Tab switching — smooth content transition
- Loading states — skeleton or spinner, not sudden content pop

### Performance
- No janky animations (check for layout thrashing — animating `width`, `height`, `top`, `left` instead of `transform`, `opacity`)
- `transition` or `animation` CSS properties used (not just instant state changes)

---

## Step 6: Accessibility (a11y) Audit

| Check | How to verify | Severity |
|---|---|---|
| **Semantic HTML** | `<button>` for clicks (not `<div onClick>`), `<nav>`, `<main>`, `<section>` | High |
| **ARIA labels** | Interactive elements have `aria-label` or visible text | High |
| **Alt text** | All `<img>` tags have meaningful `alt` attributes | Normal |
| **Color contrast** | Text meets WCAG AA (4.5:1 for normal text, 3:1 for large text) | High |
| **Keyboard navigation** | Tab order is logical, all features usable without mouse | Normal |
| **Screen reader** | Important content not hidden from assistive technology | Normal |
| **Focus management** | Focus moves logically after modal open/close, page change | Normal |

---

## Step 7: User Flow & UX Logic Audit

### Clarity & Feedback
- **CTAs (Call to Action):** Are primary actions obvious? Is there visual hierarchy between primary/secondary buttons?
- **Error messages:** Are they helpful? Do they tell the user what went wrong AND how to fix it?
- **Success feedback:** After completing an action, does the user get confirmation?
- **Destructive actions:** Are delete/reset actions confirmed with a dialog?
- **Progress indication:** Long operations show progress (not just a spinner)

### Navigation
- Breadcrumbs or back buttons where needed
- Active page highlighted in sidebar/navigation
- Consistent page layout structure across routes

---

## Step 8: Browser Visual Check (Requires Permission)

> ⚠️ **BEFORE launching any browser instance**, you MUST ask the user for explicit permission.
> If denied, skip this step entirely and note it in the report.

If permitted:
1. Start the app — this is a **Create React App** project: run `npm start` in
   `frontend` (serves on `http://localhost:3000`). There is no `dev`/bun script.
2. Take screenshots of key pages
3. Resize to different breakpoints and capture responsive behavior
4. Toggle dark/light mode if available
5. Test interactive elements (hover, click, focus)
6. Record any visual bugs with screenshots

---

## Step 9: Categorize & Record Findings

### 🔴 High Priority (ဦးစားပေး — အမြန်ပြင်သင့်)
- Hardcoded colors/styles when theme tokens exist (design system violation)
- Missing semantic HTML (clickable `<div>` instead of `<button>`)
- Color contrast failures (WCAG AA)
- Broken responsive layout (content overflow, unusable on mobile)
- Inconsistent color usage for same semantic meaning

### 🟡 Normal Priority (ပုံမှန် — မပြင်သေးလဲ ဖြစ်)
- Missing hover/focus/disabled states
- Missing empty/loading/error states
- Component duplication (should use shared component)
- Animation/transition improvements
- Typography/spacing inconsistencies
- Alt text missing on images
- Keyboard navigation gaps

### Record Format

Write findings to [`../../reports/ui_ux_tester_records.md`](../../reports/ui_ux_tester_records.md) — **create the file if it does not exist yet** (append new dated sections on later runs):

```markdown
## YYYY-MM-DD — UI/UX Tester Run

### 🔴 High Priority
- [ ] **[AREA]** `file/path.ext:L##` — Description of the issue
  - Evidence: screenshot / code snippet showing the problem
  - Impact: what users experience

### 🟡 Normal Priority
- [ ] **[AREA]** `file/path.ext` — Description of the issue
  - Suggestion: recommended fix approach
```

---

## Step 10: Report Summary

Provide a **bilingual summary** (English + Burmese):
- Total findings count (High / Normal per category)
- Worst offending pages/components
- Overall design system compliance score (approximate %)
- Instruct the user to run `/code-fix` when ready to remediate

---

*Myanmar — အနှစ်ချုပ်:*
*ဒီ skill က project ရဲ့ visual design နဲ့ usability quality ကို စစ်ဆေးပေးတဲ့ UI/UX tester ဖြစ်ပါတယ်။ Theme consistency, responsive layout, component reuse, interactive states, animation, accessibility (a11y), user flow logic — အကုန်စစ်ပြီး findings ကို `.agents/reports/ui_ux_tester_records.md` ထဲ record ထားပေးပါတယ်။ Code ကို ကိုယ်တိုင် **မပြင်ပါ** — ပြင်ဖို့ `/code-fix` ကို ခေါ်ပါ။*
