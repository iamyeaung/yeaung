# User Feedback — DevPulse

- **How collected:** Shared the live Vercel link with 3 IT students and developers, and collected written feedback via chat message.
- **When:** 2026-07-08

## Raw feedback

1. "Writing daily logs in Markdown is highly productive, but sometimes it is tedious to remember the formatting syntax for tables, code blocks, or links. Having a small formatting toolbar above the edit box would make writing much faster."
2. "The English/Myanmar language switch on the homepage works really well, but once I log in and go to the admin dashboard, the entire dashboard sidebar navigation labels (like 'Dashboard', 'Categories', 'Posts') are still in English. It should be fully translated."
3. "Right now, the home page list displays all daily logs chronologically. If I have 50+ logs, it is hard to find a specific log from weeks ago. We need a search box at the top to filter posts by their title/content keywords."

## Themes (what keeps coming up)

- **Markdown Editor UX:** The need for a visual styling toolbar helper to avoid memorizing raw Markdown formatting commands.
- **Incomplete Internationalization:** Gaps in translations, specifically the admin sidebar and dashboard navigation links when Myanmar locale is activated.
- **Search and Retrieval:** The lack of a quick global search input to lookup logs by keyword matching instead of manual scroll/pagination.

## Top 3 things to fix

- [ ] **Issue 1:** Add a Markdown formatting help toolbar (bold, italic, code-block, link, table) above the log editor workspace.
- [ ] **Issue 2:** Map localization dictionaries (`messages/en.json` and `messages/mm.json`) to all admin dashboard views, especially the `AdminSidebar` component.
- [ ] **Issue 3:** Integrate a client-side search text field on the landing logs page to run dynamic keyword filters.
