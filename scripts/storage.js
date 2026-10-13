import { validateTransaction } from './validators.js';

const DATA_KEY = 'student-finance-tracker:data';
const SETTINGS_KEY = 'student-finance-tracker:settings';

export const DEFAULT_SETTINGS = {
  currency: 'USD',
  unit: 'per-month',
  monthlyCap: 1200,
  categoryCap: 300
};

export function loadTransactions() {
  try {
    const saved = JSON.parse(localStorage.getItem(DATA_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions) {
  localStorage.setItem(DATA_KEY, JSON.stringify(transactions));
}

export function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    return { ...DEFAULT_SETTINGS, ...saved };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function exportTransactionsJSON(transactions) {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'student-finance-transactions.json';
  link.click();
  URL.revokeObjectURL(url);
}

export async function importTransactionsFromFile(file) {
  const parsed = JSON.parse(await file.text());
  if (!Array.isArray(parsed)) throw new Error('The JSON file must contain an array of transactions.');
  if (parsed.length === 0) throw new Error('The JSON file contains no transactions.');

  const invalid = [];
  const records = parsed.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      invalid.push(index + 1);
      return null;
    }
    const record = {
      ...item,
      id: typeof item.id === 'string' && item.id ? item.id : `import_${Date.now()}_${index}`,
      description: String(item.description ?? '').trim(),
      amount: Number(item.amount),
      category: String(item.category ?? '').trim(),
      date: String(item.date ?? ''),
      type: String(item.type ?? '').toLowerCase()
    };
    if (!validateTransaction(record).isValid) invalid.push(index + 1);
    return record;
  });

  if (invalid.length) {
    throw new Error(`Import cancelled: invalid transaction row${invalid.length === 1 ? '' : 's'} ${invalid.join(', ')}.`);
  }
  return records;
}

export async function initializeTransactions() {
  const saved = loadTransactions();
  if (saved.length) return saved;

  const response = await fetch('./seed.json');
  if (!response.ok) throw new Error(`Could not load starter transactions (${response.status}).`);
  const records = await response.json();
  if (!Array.isArray(records)) throw new Error('The starter data file must contain an array.');
  return records;
}
