export function compileRegex(input, flags = 'i') {
  if (!String(input ?? '').trim()) return null;
  try {
    return new RegExp(String(input), flags);
  } catch {
    return null;
  }
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

export function highlight(text, regex) {
  const value = String(text ?? '');
  if (!regex) return escapeHtml(value);
  const flags = regex.flags.includes('g') ? regex.flags : `${regex.flags}g`;
  const globalRegex = new RegExp(regex.source, flags);
  let output = '';
  let lastIndex = 0;
  let match;

  while ((match = globalRegex.exec(value)) !== null) {
    if (match[0].length === 0) {
      globalRegex.lastIndex += 1;
      continue;
    }
    output += escapeHtml(value.slice(lastIndex, match.index));
    output += `<mark>${escapeHtml(match[0])}</mark>`;
    lastIndex = match.index + match[0].length;
  }
  return output + escapeHtml(value.slice(lastIndex));
}

export function validateTransaction(transaction) {
  const errors = {};
  const description = String(transaction?.description ?? '').trim();
  const category = String(transaction?.category ?? '').trim();
  const amount = Number(transaction?.amount);
  const date = String(transaction?.date ?? '');
  const type = String(transaction?.type ?? '').toLowerCase();

  if (description.length < 3 || description.length > 80) {
    errors.description = 'Enter a description between 3 and 80 characters.';
  }
  if (!Number.isFinite(amount) || amount <= 0 || Math.round(amount * 100) !== amount * 100) {
    errors.amount = 'Enter a positive amount with no more than two decimal places.';
  }
  if (!/^[A-Za-z][A-Za-z0-9&/.' -]{1,29}$/.test(category)) {
    errors.category = 'Use 2–30 letters, numbers, spaces, or common punctuation; start with a letter.';
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.date = 'Enter a date in YYYY-MM-DD format.';
  } else {
    const parsed = new Date(`${date}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
      errors.date = 'Enter a real calendar date.';
    }
  }
  if (type !== 'income' && type !== 'expense') {
    errors.type = 'Choose income or expense.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value) || 0);
}
