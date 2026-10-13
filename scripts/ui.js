import { formatCurrency } from './validators.js';
import { getSummary } from './state.js';

export function renderStats(container, transactions, settings) {
  const summary = getSummary(transactions);
  const cards = [
    ['Balance', summary.balance, 'primary'],
    ['Income', summary.income, 'positive'],
    ['Expenses', summary.expenses, 'negative'],
    ['Average transaction', summary.average, 'neutral']
  ];
  container.innerHTML = cards.map(([label, value, tone]) => `
    <article class="stat-card ${tone}">
      <span class="stat-label">${label}</span>
      <strong class="stat-value">${formatCurrency(value, settings.currency)}</strong>
    </article>
  `).join('');
}

export function renderTransactionTable(body, transactions, query, settings) {
  if (!transactions.length) {
    body.innerHTML = '<tr><td colspan="6" class="empty-state">No transactions match your search.</td></tr>';
    return;
  }
  body.innerHTML = transactions.map((item) => `
    <tr>
      <td data-label="Description">${escapeHighlight(item.description, query)}</td>
      <td data-label="Category">${escapeHighlight(item.category, query)}</td>
      <td data-label="Amount" class="amount ${item.type}">${formatCurrency(item.amount, settings.currency)}</td>
      <td data-label="Type">${escapeHighlight(item.type, query)}</td>
      <td data-label="Date">${escapeHighlight(item.date, query)}</td>
      <td data-label="Action"><button class="delete-button" type="button" data-id="${encodeURIComponent(item.id)}" aria-label="Delete ${safeText(item.description)}">Delete</button></td>
    </tr>
  `).join('');
}

function safeText(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function escapeHighlight(value, query) {
  const text = String(value ?? '');
  if (!query.trim()) return safeText(text);
  try {
    const regex = new RegExp(query, 'ig');
    let result = '';
    let index = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!match[0]) { regex.lastIndex += 1; continue; }
      result += safeText(text.slice(index, match.index));
      result += `<mark>${safeText(match[0])}</mark>`;
      index = match.index + match[0].length;
    }
    return result + safeText(text.slice(index));
  } catch {
    return safeText(text);
  }
}

export function renderGoalStatus(summary, settings) {
  const monthKey = new Date().toISOString().slice(0, 7);
  const monthExpenses = summary.transactions
    ? summary.transactions
    : [];
  const spent = summary.monthExpenses ?? summary.expenses;
  const cap = Number(settings.monthlyCap) || 0;
  const categoryCap = Number(settings.categoryCap) || 0;
  const categoryMax = Math.max(0, ...Object.values(summary.expensesByCategory));
  const over = (cap > 0 && spent > cap) || (categoryCap > 0 && categoryMax > categoryCap);
  const near = !over && cap > 0 && spent >= cap * .8;
  const status = document.querySelector('#goal-status');
  status.textContent = over ? 'Over budget' : near ? 'Near limit' : 'On track';
  status.classList.toggle('warning', over || near);
  document.querySelector('#goal-summary').textContent =
    `Monthly expenses: ${formatCurrency(spent, settings.currency)} / ${formatCurrency(cap, settings.currency)}. Highest category total: ${formatCurrency(categoryMax, settings.currency)} / ${formatCurrency(categoryCap, settings.currency)}.`;
}
