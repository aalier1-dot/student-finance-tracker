import { DEFAULT_SETTINGS, loadSettings, saveSettings, saveTransactions } from './storage.js';

export const appState = {
  transactions: [],
  settings: loadSettings(),
  searchQuery: '',
  sortField: 'date',
  sortDirection: 'desc'
};

export function setTransactions(transactions) {
  appState.transactions = [...transactions];
  saveTransactions(appState.transactions);
}

export function addTransaction(transaction) {
  appState.transactions = [transaction, ...appState.transactions];
  saveTransactions(appState.transactions);
}

export function removeTransaction(id) {
  appState.transactions = appState.transactions.filter((transaction) => transaction.id !== id);
  saveTransactions(appState.transactions);
}

export function updateSettings(settings) {
  appState.settings = { ...appState.settings, ...settings };
  saveSettings(appState.settings);
}

export function getSummary(transactions) {
  const income = transactions
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const expenses = transactions
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const expensesByCategory = {};
  transactions.filter((item) => item.type === 'expense').forEach((item) => {
    expensesByCategory[item.category] = (expensesByCategory[item.category] || 0) + Number(item.amount);
  });
  return {
    income,
    expenses,
    balance: income - expenses,
    average: transactions.length ? transactions.reduce((sum, item) => sum + Number(item.amount), 0) / transactions.length : 0,
    expensesByCategory
  };
}

export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...appState.settings };
}
