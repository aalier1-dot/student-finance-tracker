# M1 — Specification and Wireframes

## Product goal

Provide students with a simple, browser-based place to record income and expenses, inspect their overall balance, and keep an eye on monthly and category spending caps. The app has no backend; transaction data and preferences are stored in the browser.

## Scope

### In scope

- Create income and expense transactions.
- Validate transaction input and display inline feedback.
- Search with regular expressions, sort, and remove transactions.
- Summarize income, expenses, balance, and average transaction value.
- Configure monthly and category caps, currency, and reporting unit.
- Persist records and settings with `localStorage`; import/export records as JSON.

### Not in the current implementation

- Edit existing transactions or ask for confirmation before deleting.
- A 7-day spending chart, category selector, currency conversion rates, or quick converter.
- A custom keyboard dialog, regex case toggle, or advanced lookahead/back-reference validation.

## Desktop wireframe

```text
+------------------------------------------------------------------+
| Student Planner / Finance Tracker       [Export] [Import]        |
+------------------------------------------------------------------+
| Summary                                                          |
| [Balance]       [Income]       [Expenses]       [Average tx]      |
+--------------------------------+---------------------------------+
| Spending goals                 | Add transaction                 |
| Monthly cap     Category cap   | Description     Amount          |
| [            ]  [           ]  | Category        Date            |
| [Apply goals]                  | Type                            |
| Status and spending summary    | [Save transaction] [Clear]      |
+--------------------------------+---------------------------------+
| Preferences                                                       |
| Currency             Unit              [Update settings]          |
+------------------------------------------------------------------+
| Transactions                                  [Search / regex]    |
| Description | Category | Amount | Type | Date | Action            |
| ...                                                              |
+------------------------------------------------------------------+
```

## Mobile wireframe

```text
+------------------------------+
| Finance Tracker              |
| [Export] [Import]            |
+------------------------------+
| Summary cards (2 per row)    |
+------------------------------+
| Spending goals               |
| Monthly cap                  |
| Category cap                 |
| [Apply goals]                |
+------------------------------+
| Add transaction              |
| Fields stacked vertically   |
+------------------------------+
| Preferences                  |
+------------------------------+
| Transactions / search        |
| Each row displayed as a card |
+------------------------------+
```

## Data model

### Transaction

```json
{
  "id": "txn_01",
  "description": "Lunch at cafeteria",
  "amount": 12.5,
  "category": "Food",
  "date": "2026-09-12",
  "type": "expense",
  "createdAt": "2026-09-12T12:40:00.000Z",
  "updatedAt": "2026-09-12T12:40:00.000Z"
}
```

- `id`: unique string identifier.
- `description`: trimmed text, 3–80 characters.
- `amount`: positive finite number with no more than two decimal places.
- `category`: 2–30 characters, starts with a letter, and uses the supported letters, digits, spaces, and punctuation.
- `date`: valid calendar date in ISO `YYYY-MM-DD` format.
- `type`: either `income` or `expense`.
- `createdAt` / `updatedAt`: ISO timestamps.

### Preferences

Preferences are stored separately and include `currency`, `unit`, `monthlyCap`, and `categoryCap`.

## Accessibility plan

- Use semantic landmarks and a logical heading hierarchy.
- Provide a skip link, explicit input labels, keyboard-operable controls, and visible focus styles.
- Associate validation feedback with each form field and expose invalid state with `aria-invalid`.
- Announce validation errors and important updates through live regions.
- Preserve semantic table headers on wide screens and provide row labels in the compact mobile presentation.
- Respect reduced-motion settings and verify color contrast with an accessibility checker before submission.
