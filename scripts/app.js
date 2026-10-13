import { validateTransaction } from './validators.js';
import { filterTransactions, sortTransactions } from './search.js';
import { initializeTransactions, exportTransactionsJSON, importTransactionsFromFile } from './storage.js';
import { appState, addTransaction, removeTransaction, setTransactions, updateSettings, getSummary } from './state.js';
import { renderStats, renderTransactionTable, renderGoalStatus } from './ui.js';

const form = document.querySelector('#transaction-form');
const tableBody = document.querySelector('#transaction-table-body');
const statsGrid = document.querySelector('#stats-grid');
const searchInput = document.querySelector('#search-input');
const monthlyCapInput = document.querySelector('#monthly-cap');
const categoryCapInput = document.querySelector('#category-cap');
const currencySelect = document.querySelector('#currency-select');
const unitSelect = document.querySelector('#unit-select');
const liveRegion = document.querySelector('#live-region');

function announce(message) {
  liveRegion.textContent = '';
  requestAnimationFrame(() => { liveRegion.textContent = message; });
}

function render() {
  const filtered = filterTransactions(appState.transactions, appState.searchQuery);
  const sorted = sortTransactions(filtered, appState.sortField, appState.sortDirection);
  renderStats(statsGrid, appState.transactions, appState.settings);
  renderTransactionTable(tableBody, sorted, appState.searchQuery, appState.settings);

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const summary = getSummary(appState.transactions);
  summary.monthExpenses = appState.transactions
    .filter((item) => item.type === 'expense' && item.date.startsWith(month))
    .reduce((total, item) => total + Number(item.amount), 0);
  summary.expensesByCategory = {};
  appState.transactions
    .filter((item) => item.type === 'expense' && item.date.startsWith(month))
    .forEach((item) => {
      summary.expensesByCategory[item.category] = (summary.expensesByCategory[item.category] || 0) + Number(item.amount);
    });
  renderGoalStatus(summary, appState.settings);
}

function setFieldError(name, message) {
  const input = document.querySelector(`#${name}`);
  const error = document.querySelector(`#${name}-error`);
  input.setAttribute('aria-invalid', String(Boolean(message)));
  input.classList.toggle('invalid-field', Boolean(message));
  error.textContent = message || '';
}

function clearErrors() {
  ['description', 'amount', 'category', 'date', 'type'].forEach((name) => setFieldError(name, ''));
}

function showErrors(errors) {
  Object.entries(errors).forEach(([name, message]) => setFieldError(name, message));
  const firstInvalid = Object.keys(errors)[0];
  if (firstInvalid) document.querySelector(`#${firstInvalid}`).focus();
}

function createId() {
  return `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

document.querySelector('#transaction-form').addEventListener('submit', (event) => {
  event.preventDefault();
  clearErrors();
  const data = new FormData(form);
  const transaction = {
    id: createId(),
    description: String(data.get('description') || '').trim(),
    amount: Number(data.get('amount')),
    category: String(data.get('category') || '').trim(),
    date: String(data.get('date') || ''),
    type: String(data.get('type') || ''),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  const result = validateTransaction(transaction);
  if (!result.isValid) {
    showErrors(result.errors);
    announce('Please fix the transaction errors.');
    return;
  }
  addTransaction(transaction);
  form.reset();
  clearErrors();
  render();
  announce('Transaction saved.');
});

form.addEventListener('reset', () => requestAnimationFrame(clearErrors));

searchInput.addEventListener('input', () => {
  appState.searchQuery = searchInput.value.trim();
  render();
  if (appState.searchQuery && !filterTransactions(appState.transactions, appState.searchQuery).length) {
    announce('No transactions match that regular expression.');
  }
});

document.querySelectorAll('.sort-button').forEach((button) => {
  button.addEventListener('click', () => {
    const field = button.dataset.sort;
    appState.sortDirection = appState.sortField === field && appState.sortDirection === 'asc' ? 'desc' : 'asc';
    appState.sortField = field;
    render();
    button.setAttribute('aria-label', `Sort by ${field}, ${appState.sortDirection === 'asc' ? 'ascending' : 'descending'}`);
  });
});

tableBody.addEventListener('click', (event) => {
  const button = event.target.closest('.delete-button');
  if (!button) return;
  removeTransaction(decodeURIComponent(button.dataset.id));
  render();
  announce('Transaction deleted.');
});

function savePreferences() {
  const monthlyCap = Number(monthlyCapInput.value);
  const categoryCap = Number(categoryCapInput.value);
  if (!Number.isFinite(monthlyCap) || monthlyCap < 0 || !Number.isFinite(categoryCap) || categoryCap < 0) {
    announce('Spending caps must be zero or greater.');
    return false;
  }
  updateSettings({
    monthlyCap,
    categoryCap,
    currency: currencySelect.value,
    unit: unitSelect.value
  });
  render();
  announce('Preferences saved.');
  return true;
}

document.querySelector('#settings-form').addEventListener('submit', (event) => {
  event.preventDefault();
  savePreferences();
});
document.querySelector('#apply-goal').addEventListener('click', savePreferences);

document.querySelector('#export-data').addEventListener('click', () => {
  exportTransactionsJSON(appState.transactions);
  announce('Transactions exported as JSON.');
});

const importInput = document.querySelector('#import-input');
document.querySelector('#import-button').addEventListener('click', () => importInput.click());
importInput.addEventListener('change', async () => {
  const [file] = importInput.files;
  if (!file) return;
  try {
    const imported = await importTransactionsFromFile(file);
    setTransactions(imported);
    render();
    announce(`${imported.length} transactions imported.`);
  } catch (error) {
    announce(error instanceof Error ? error.message : 'Could not import the JSON file.');
  } finally {
    importInput.value = '';
  }
});

async function init() {
  try {
    setTransactions(await initializeTransactions());
  } catch (error) {
    tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">Could not load starter data. Add a transaction to begin.</td></tr>';
    announce(error instanceof Error ? error.message : 'Could not load starter data.');
  }
  const settings = appState.settings;
  monthlyCapInput.value = String(settings.monthlyCap);
  categoryCapInput.value = String(settings.categoryCap);
  currencySelect.value = settings.currency;
  unitSelect.value = settings.unit;
  render();
}

init();
