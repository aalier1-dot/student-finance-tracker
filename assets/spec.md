# M1 — Project Spec: Student Finance Tracker
# Wireframes
# Mobile (~360px)
┌─────────────────────────┐
│ [≡]  Student Finance  ₣ │  ← sticky header, hamburger nav
├─────────────────────────┤
│ ABOUT                   │
│ Purpose description     │
│ How It Works steps      │
│ Developer contact       │
├─────────────────────────┤
│ DASHBOARD               │
│ ┌────────┐ ┌─────────┐  │
│ │ Count  │ │  Spent  │  │  ← 2-col stat grid
│ └────────┘ └─────────┘  │
│ ┌────────┐ ┌─────────┐  │
│ │Top Cat │ │  Avg    │  │
│ └────────┘ └─────────┘  │
│ [Bar Chart — 7 days]    │
│ [Category Breakdown]    │
├─────────────────────────┤
│ ADD TRANSACTION         │
│ [Description          ] │
│ [Amount   ] [Category▼] │
│ [Date                 ] │
│ [Add Transaction]       │
├─────────────────────────┤
│ REGEX SEARCH            │
│ [Search pattern       ] │
│ □ Case-insensitive      │
│ Example patterns listed │
├─────────────────────────┤
│ RECORDS (card layout)   │
│ ┌─────────────────────┐ │
│ │ Lunch at cafeteria  │ │
│ │ RWF 1,500    Food   │ │
│ │ 2025-09-25          │ │
│ │ [Edit]    [Delete]  │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ ...                 │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ BUDGET TARGET           │
│ [Monthly Budget input ] │
│ Budget | Spent | Left   │
│ [=====Progress Bar====] │
│ ✓ You have RWF X left   │
├─────────────────────────┤
│ SETTINGS                │
│ Currency rates (RWF)    │
│ [1 USD = ___]           │
│ [1 EUR = ___]           │
│ Quick Convert           │
│ ─────────────────────── │
│ Categories              │
│ [Food][Books][+Add]     │
│ ─────────────────────── │
│ Data Management         │
│ [Export] [Import] [Clear│
├─────────────────────────┤
│ Footer: name, email,    │
│ GitHub, © year          │
└─────────────────────────┘

# Tablet (~768px)
┌──────────────────────────────────────────────────┐
│ ₣ Student Finance  About Dashboard Add Search …  │  ← full nav row
├──────────────────────────────────────────────────┤
│ DASHBOARD                                        │
│ ┌────────┬──────────┬──────────┬────────────┐   │
│ │ Count  │  Spent   │ Top Cat  │  Average   │   │  ← 4-col stat grid
│ └────────┴──────────┴──────────┴────────────┘   │
│ ┌─────────────────────┬────────────────────┐     │
│ │   Bar Chart         │  Category List     │     │  ← side by side
│ └─────────────────────┴────────────────────┘     │
├──────────────────────────────────────────────────┤
│ ADD TRANSACTION                                  │
│ [Description                                  ]  │
│ [Amount              ]  [Category            ▼]  │  ← field-row
│ [Date                ]                           │
│ [Add Transaction]  [Cancel Edit]                 │
├──────────────────────────────────────────────────┤
│ RECORDS — Sort by [Date▼] [↑]   12 transactions  │
│ ┌──────────────┬────────┬──────┬────────┬──────┐ │
│ │ Description  │ Amount │ Cat  │ Date   │      │ │  ← table layout
│ ├──────────────┼────────┼──────┼────────┼──────┤ │
│ │ Lunch …      │ 1,500  │ Food │ 09-25  │ E  D │ │
│ └──────────────┴────────┴──────┴────────┴──────┘ │
└──────────────────────────────────────────────────┘

# Desktop (~1024px)
┌────────────────────────────────────────────────────────┐
│ ₣ Student Finance Tracker   About Dashboard Add … Sett │
├────────────────────────────────────────────────────────┤
│                        DASHBOARD                       │
│  ┌──────┬──────────┬──────────┬──────────┐            │
│  │Count │  Spent   │ Top Cat  │  Average │            │
│  └──────┴──────────┴──────────┴──────────┘            │
│  ┌──────────────────────────┬─────────────────────┐   │
│  │  Bar Chart (7 days)      │  By Category        │   │
│  │  ▄ ▄ ▄ █ ▄ ▄ ▄          │  Food     ████ 40%  │   │
│  │  M T W T F S S          │  Books    ██   20%  │   │
│  └──────────────────────────┴─────────────────────┘   │
├────────────────────────────────────────────────────────┤
│ RECORDS — Sort by [Description▼] [↓]   12 transactions │
│ ┌─────────────────┬──────────┬────────┬────────┬─────┐ │
│ │ Description     │ Amount   │ Cat    │ Date   │     │ │
│ ├─────────────────┼──────────┼────────┼────────┼─────┤ │
│ │ Bus pass …      │ 8,000    │Transport│09-01  │ E D │ │
│ │ Chemistry …     │ 12,000   │ Books  │ 09-23  │ E D │ │
│ └─────────────────┴──────────┴────────┴────────┴─────┘ │
└────────────────────────────────────────────────────────┘
# Data Model
# Transaction Record
{
  "id":          "rec_0001",
  "description": "Lunch at cafeteria",
  "amount":      1500,
  "category":    "Food",
  "date":        "2025-09-25",
  "createdAt":   "2025-09-25T11:30:00.000Z",
  "updatedAt":   "2025-09-25T11:30:00.000Z"
}
Field	Type	Validation
id	string	Auto-generated: rec_XXXX_timestamp
description	string	No leading/trailing spaces; no duplicate words
amount	number	Positive; up to 2 decimal places
category	string	Selected from managed list
date	string	Format YYYY-MM-DD; month 01–12; day 01–31
createdAt	string	ISO 8601 timestamp, set on creation
updatedAt	string	ISO 8601 timestamp, updated on every edit
localStorage Keys
Key	Contains	Default
sft:records	Array of transaction records	[]
sft:budget	Monthly budget cap (number)	0
sft:categories	Array of category strings	Built-in 6
sft:rates	Object { usd, eur }	{usd:1320,eur:1430}
Default Categories
Food · Books · Transport · Entertainment · Fees · Other

# Accessibility Plan

Landmark Structure
<header role="banner">
  <nav aria-label="Main navigation">
<main id="main-content">
  <section aria-labelledby="[heading-id]">  × 7
<footer role="contentinfo">
Heading Hierarchy
h1  — Brand: Student Finance Tracker
 h2 — Section title (About, Dashboard, Add Transaction …)
  h3 — Subsection (How It Works, Currency, Categories …)
   h4 — Detail headings (Quick Convert)
Keyboard Navigation Plan
Key	Action
Tab	Move forward through interactive elements
Shift+Tab	Move backward
Enter / Space	Activate button or link
Escape	Close delete confirmation dialog
Alt+1–7	Jump directly to each section
Arrow keys	Change sort field or category select
Tab (dialog)	Cycle focus between Delete and Cancel
ARIA Live Region Plan
Region	Role / aria-live	Trigger
Field errors	role="alert" assertive	On validation failure
Form status	role="status" polite	After add / update / delete
Search count	role="status" polite	On every search input change
Budget (under)	role="status" polite	When within budget
Budget (over)	role="alert" assertive	When budget exceeded
Settings status	role="status" polite	After save / import / export
Focus Management Plan
Skip-to-content link visible on focus → jumps to #main-content
All inputs have <label for> binding and aria-describedby pointing to error span
aria-invalid="true" set on inputs that fail validation
aria-required="true" on all required fields
Delete dialog: focus moves to Confirm button on open; returns to trigger on close
Sections have tabindex="-1" so Alt+1–7 keyboard jump can place focus
Visible focus outline on all interactive elements via :focus-visible
Colour Contrast
Element	Background	Text	Ratio
Body text	#0f1117	#e2e8f0	> 7:1
Muted text	#0f1117	#94a3b8	> 4.5:1
Accent text	#0f1117	#a78bfa	> 4.5:1
Error text	#0f1117	#ef4444	> 4.5:1
Motion
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration:  0.01ms !important;
  }
}
