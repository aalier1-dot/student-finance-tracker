# Student Finance Tracker

An accessible, responsive student finance tracker built with vanilla HTML, CSS, and JavaScript. It helps students record income and expenses, review summaries, and set spending caps. Data is stored in the browser; there is no backend.

- **Theme:**student Finanace Tracker
- **Repository:** [aalier1-dot/student-finance-tracker](https://github.com/aalier1-dot/student-finance-tracker)
- **GitHub Pages:** [Open the live app](https://aalier1-dot.github.io/student-finance-tracker/)
- **M1 specification:** [Wireframe, data model, and accessibility plan](assets/spec.md)

## Features

- Add and delete income or expense records.
- Validate descriptions, amounts, categories, dates, and transaction types with inline error messages.
- View balance, income, expenses, and average transaction amount.
- Set a monthly spending cap and a category cap; see an on-track, near-limit, or over-budget status.
- Search descriptions and other transaction details with case-insensitive regular-expression search; matching descriptions, categories, types, and dates are highlighted.
- Sort transactions by description, category, amount, type, or date.
- Import and export transaction data as JSON. Imports are validated before replacing saved data.
- Save transactions and preferences in `localStorage`.
- Choose USD, EUR, GBP, or ZAR and select a reporting unit.
- Start with 14 diverse example records from `seed.json` when browser storage is empty.

## Regex catalog

Search input is compiled using `new RegExp(input, 'i')`. Valid patterns filter records; malformed patterns do not crash the app and leave records unfiltered. Matching is highlighted using `<mark>` after escaping displayed text.

| Rule | Pattern or check | Example | Result |
| --- | --- | --- | --- |
| Category format | `/^[A-Za-z][A-Za-z0-9&/.' -]{1,29}$/` | `Food & Drink` | Accepted |
| Date format | `/^\d{4}-\d{2}-\d{2}$/`, followed by a real-calendar-date check | `2026-10-13` | Accepted |
| Amount | Finite number greater than zero, with at most two decimal places | `12.50` | Accepted |
| Transaction type | `income` or `expense` | `expense` | Accepted |
| Case-insensitive search | `food` | `Food & Drink` | Matches |
| Advanced search example | `\b(bus|coffee)\b` | `Coffee with friends` | Matches |
| Invalid search | `[` | Any record | Safely ignored; no crash |

**Rubric note:** The current transaction validator does not yet implement the requested advanced lookahead or back-reference validation rules. The search catalog's advanced example is a search pattern, not a validation rule.

## Keyboard map

- `Tab` / `Shift+Tab`: move through links, buttons, and form controls.
- `Enter`: submit forms or activate the focused button.
- `Space`: activate a focused button.
- Search: type a plain word or regular-expression pattern to filter records.
- Sort buttons: activate with `Enter` or `Space` to change the sort order.

There are no custom `Escape` shortcuts, keyboard traps, or `Alt+number` shortcuts in the current app.

## Accessibility notes

- Uses semantic header, main, section, form, table, and heading elements.
- Provides a skip-to-content link, associated form labels, and visible focus outlines.
- Inline validation text is announced, invalid fields receive `aria-invalid`, and focus moves to the first invalid field.
- Live regions announce app actions and update the summary and transaction list.
- The transaction table becomes a labeled card-like layout on narrow screens.
- Reduced-motion preferences are respected.
- Color contrast has not yet been independently measured; complete a contrast audit before submission.

## Project structure

```text
student-finance-tracker/
├── assets/
│   └── spec.md
├── scripts/
│   ├── app.js
│   ├── search.js
│   ├── state.js
│   ├── storage.js
│   ├── ui.js
│   └── validators.js
├── styles/
│   └── styles.css
├── .gitignore
├── index.html
├── README.md
├── seed.json
└── tests.html
```

## Run the app locally

The app uses JavaScript modules, so serve the project directory over HTTP rather than opening `index.html` directly.

```powershell
cd "C:\Users\HP\OneDrive\Desktop\student-finance-tracker"
python -m http.server 8000
```

Then open <http://localhost:8000/>. In VS Code, you can also use the Live Server extension.

## Run tests

With the local server running, open <http://localhost:8000/tests.html>. The page runs browser-based assertions for transaction validation, malformed regex handling, safe highlighting, search, and sorting. Review the displayed PASS/FAIL results.

## Data model

Each transaction is stored as a JSON object:

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | Transaction identifier |
| `description` | string | Short description, 3–80 characters |
| `amount` | number | Positive amount with up to two decimal places |
| `category` | string | Category label |
| `date` | string | Calendar date in `YYYY-MM-DD` format |
| `type` | string | `income` or `expense` |
| `createdAt` | string | ISO timestamp for record creation |
| `updatedAt` | string | ISO timestamp for last update |

## Milestones

| Milestone | Status |
| --- | --- |
| M1 — Spec and wireframes | Specification documented in `assets/spec.md` |
| M2 — Semantic HTML and base CSS | Implemented; responsive checks still recommended |
| M3 — Forms and regex validation | Core validation and assertion page implemented; advanced validation rule still needed |
| M4 — Render, sort, and regex search | Implemented |
| M5 — Statistics and caps | Summary cards and spending caps implemented; 7-day chart is not implemented |
| M6 — Persistence, import/export, and settings | Implemented with browser `localStorage` |
| M7 — Polish and accessibility audit | In progress; measure contrast and complete keyboard/device audit |

## Deployment and remaining submission items

The intended deployment is GitHub Pages: <https://aalier1-dot.github.io/student-finance-tracker/>. Confirm it loads after the latest push and that the tests page is available at <https://aalier1-dot.github.io/student-finance-tracker/tests.html>.

**Demo video:** 
