import { compileRegex, highlight } from './validators.js';

export function filterTransactions(transactions, query) {
  const pattern = compileRegex(query, 'i');
  if (!pattern) return [...transactions];
  return transactions.filter((item) => {
    const searchable = `${item.description} ${item.category} ${item.type} ${item.amount} ${item.date}`;
    pattern.lastIndex = 0;
    return pattern.test(searchable);
  });
}

export function sortTransactions(transactions, field = 'date', direction = 'desc') {
  const multiplier = direction === 'asc' ? 1 : -1;
  return [...transactions].sort((left, right) => {
    const a = left[field];
    const b = right[field];
    if (field === 'amount') return (Number(a) - Number(b)) * multiplier;
    return String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true }) * multiplier;
  });
}

export function renderHighlightedText(value, query) {
  return highlight(value, compileRegex(query, 'i'));
}
