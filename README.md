## Student Finance Tracker
- An accessibility, reponsive, vanilla HTML/CSS/JS web help us students record expenses, monitor budgets, and make informed financial decisions all in the browser with no backkend required.  

## Theme: Student Finance Tracker
 
 #Respostory: [aalier1-dot/student-finance-tracker](https://github.com/aalier1-dot/student-finance-tracker) 

 #GitHub: [Open the live app](https://aalier1-dot.github.io/student-finance-tracker/)

 ##My video link: https://drive.google.com/file/d/1SEXcLqVBlCDA9y8KDqEgtVEE4Qmoihf0/view?usp=drive_link

 #M1 specification: [Wireframe, data model, and accessibility plan](assets/spec.md) 
 
## Features

- Add, edit, and delete transactions with confirmation dialog
- Categories: Food, Books, Transport, Entertainment, Fees, Other (fully editable)
- Dashboard with total spent, transaction count, top category, average amount, and 7-day bar chart
- Monthly budget cap with live ARIA status (polite when under, assertive when exceeded)
- Live regex search with match highlighting using `<mark>`and case-insensitive toggle
- Sort records by date, description (A↕Z), or amount (↑↓)
- Responsive table on desktop, card list on mobile
- Import / Export JSON with structure validation
- Currency settings: base RWF with manual USD and EUR conversion rates + quick converter
- All data persisted to localStorage — works fully offline
- Accessible: skip link, visible focus, ARIA live regions, keyboard-only navigation

## Regex catalog

| Rule | Pattern | Purpose | Example input | Result |
|------|---------|---------|---------------|--------|
| Description: no leading/trailing spaces | `/^\S(?:.*\S)?$/` | Rejects `" Lunch"` or `"Lunch "` | `" Lunch"` | ❌ fails |
| Description: duplicate word (back-reference) | `/\b(\w+)\s+\1\b/i` | Catches `"the the book"` | `"the the"` | ❌ fails |
| Amount: integer or ≤2 decimal places | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | Rejects `01500` and `1.999` | `"1500.50"` | ✅ passes |
| Date: YYYY-MM-DD | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | Rejects `18/10/2026` and month 13 | `"2026-10-18"` | ✅ passes |
| Category name: letters, spaces, hyphens | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Rejects `Food2` and `Food!` | `"Non-Academic"` | ✅ passes |
| Budget / rate: positive, no all-zeros (lookahead) | `/^(?!0+$)\d+(\.\d{1,2})?$/` | Rejects `0` and `000` | `"100000"` | ✅ passes |
| Search: cents present | `/\.\d{2}\b/` | Finds amounts with cents | `"2500.50"` | ✅ matches |
| Search: beverage keyword | `/(coffee\|tea)/i` | Finds coffee/tea descriptions | `"Coffee with friends"` | ✅ matches |

## Keyboard map

| Key / Combo | Action |
|-------------|--------|
| `Tab` | Move focus forward through interactive elements |
| `Shift+Tab` | Move focus backward |
| `Enter` / `Space` | Activate focused button or link |
| `Escape` | Close the delete confirmation dialog |
| `Alt+1`…`Alt+7` (nav links) | Jump to About, Dashboard, Add, Search, Records, Budget, Settings via nav |
| Arrow keys (inside `<select>`) | Change sort field or category selection |
| `Tab` inside dialog | Cycles focus between Delete and Cancel buttons (focus trapped) |
## Accessibility notes

Skip-to-content link at top of page (#main-content)
All form inputs have associated <label> elements bound via for/id
Error messages use role="alert" with aria-live="assertive" for immediate announcement
Budget status uses aria-live="polite" when within budget, switches to "assertive" when exceeded
Search result count announced via role="status" / aria-live="polite"
Confirmation dialog uses role="dialog", aria-modal="true", focus trapped inside, Escape closes
All icon-only buttons have aria-label
Colour contrast ratio ≥ 4.5:1 for all text/background combinations
Visible focus outline on all interactive elements (2px solid accent colour)
aria-invalid="true" set on inputs that fail validation
Bar chart marked role="img" with aria-label; each bar day label includes accessible text

# How to Run Tests
Open tests.html directly in any browser (no server needed — uses plain <script>, not ES modules)
Click ▶ Run All Tests
Results are grouped by category with PASS/FAIL badges and a progress bar
Tests cover: description validation, amount validation, date validation, category validation, budget/rate validation, compileRegex, isValidRegex, highlight, import validation, and advanced regex patterns.

# How to Run the App
#Option A — Local file
Open index.html directly in a browser. All features work via localStorage.

#Option B — Live Server (recommended)
#VS Code: right-click index.html → Open with Live Server 
#or
npx serve .
# Load seed data
Open the browser console on index.html and run:

fetch('seed.json')
  .then(r => r.json())
  .then(d => { localStorage.setItem('sft:records', JSON.stringify(d)); location.reload(); });

# File Structure
student-finance-tracker/
├── assets/
│   └── spec.md         M1 wireframes, data model, and a11y plan
├── scripts/
│   ├── app.js          Entry point — event wiring
│   ├── search.js       compileRegex, isValidRegex, highlight
│   ├── state.js        Central state, CRUD, stats, ID generator
│   ├── storage.js      localStorage read/write helpers
│   ├── ui.js           DOM rendering — dashboard, records, forms
│   └── validators.js   All regex validation rules
├── styles/
│   └── main/syly.css        Mobile-first responsive styles
├── .gitignore
├── index.html
├── README.md
├── seed.json           15 diverse sample records
└── tests.html          In-browser test suits

#	Milestone	Status
M1  spec & Wireframes	✅
M2	Semantic Html & Bass CSS	✅
M3	Forms & Regex Validation	✅
M4	Render + Sort + Regex Search	✅
M5	Stats + Cap/Targets	✅
M6	Persistence + Import/Export + Settings	✅
M7	polish & A11y Audit	✅
