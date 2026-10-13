<<<<<<< HEAD
# Student Finance Tracker

Theme: Modern student budgeting dashboard with calm blue and green accents.


## Features
- Add income and expense transactions with validation rules.
- Search and sort the transaction table with safe regex-based filtering.
- Highlight matching text in the results table.
- Dashboard summary cards for total balance, income, expenses, and average transaction value.
- Monthly and category spending caps with live status updates.
- Import/export JSON data and persist via localStorage.
- Currency and unit preferences with accessible form controls and live announcements.
- Fully static front-end with no external framework dependencies.

## Regex catalog
| Pattern | Example input | Meaning |
| --- | --- | --- |
| `food` | `Groceries and food` | Simple case-insensitive search for food-related entries |
| `^\d{4}-\d{2}-\d{2}$` | `2025-09-18` | Validates ISO date format |
| `^[A-Za-z][A-Za-z0-9&/.' -]{1,29}$` | `Transport` | Accepts category names with common punctuation |
| `^(?:income|expense)$` | `expense` | Restricts type values to the allowed enum |
| `\b(?:coffee|bus|textbook)\b` | `Coffee with friends` | Matches common student spending keywords |

## Keyboard map 
- Tab / Shift+Tab: move between form controls and buttons.
- Enter: submit the add-transaction and settings forms.
- Escape: clear focus from current input and return to the page flow.
- Search box: type or paste a term to filter results immediately.
- Delete button: activates with Enter or Space when focused.

## Accessibility notes
- All form inputs have explicit labels and error text tied to their field IDs.
- The page has a skip link for keyboard users to move straight to main content.
- The `aria-live` region announces validation errors and import/export updates.
- Buttons and inputs have visible focus states and good contrast.
- Tables use semantic `<table>` markup and mobile-friendly layout adjustments.

## How to Run

The app uses ES modules, which browsers block when you open `index.html` by double-clicking it. Serve the folder locally instead.

1. Clone the repo and open a terminal in the project folder:
```bash
   git clone https://github.com/aalier1-dot/student-finance-tracker.git
   cd student-finance-tracker
```
2. Start a local server (requires Python):
```bash
   python -m http.server 8000
```
3. Open http://localhost:8000/ in your browser.

Alternatively, use the **Live Server** extension in VS Code and choose "Open with Live Server" on `index.html`.

The live version is at https://aalier1-dot.github.io/student-finance-tracker/

## How to Run Tests

With the local server running, open http://localhost:8000/tests.html. Each regex rule is checked with small assertions, and the page shows a pass or fail result for every test.

## Deployment
https://github.com/aalier1-dot/student-finance-tracker.git>/student-finance-tracker
GitHub Pages URL: https://<aalier1-dot>.github.io/student-finance-tracker/

## Demo video
Demo video: TBD — record a 2–3 minute walkthrough showing keyboard navigation, regex edge cases, and import/export actions and update this section with the unlisted YouTube link before submission.

## Data model
Each transaction stores:
- `id`: unique item identifier
- `description`: short text summary
- `amount`: decimal value
- `category`: spending group
- `date`: ISO formatted date
- `type`: `income` or `expense`
- `createdAt`: record creation time
- `updatedAt`: last modification time
=======
# student-finance-tracker
“Student finance tracker built with vanilla HTML, CSS, and JS”.
>>>>>>> b4a8ecc6720222254f93c812f5801bfc435516f8
