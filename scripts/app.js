// scripts/app.js
// ── Main entry point — wires up all events ──

import {
  state, initState, addRecord, updateRecord, deleteRecord,
  setBudget, addCategory, removeCategory, setRates,
  genId, validateImport, getStats, getFilteredRecords
} from './state.js';
import {
  renderDashboard, renderRecords, renderCategories,
  renderBudgetUI, populateForm, resetForm,
  flashStatus, updateSortBtn
} from './ui.js';
import {
  validateDescription, validateAmount, validateDate,
  validateCategory, validateCategoryName,
  validateBudget, validateRate, showError
} from './validators.js';
import { compileRegex, isValidRegex } from './search.js';
import { saveRecords, clearAll } from './storage.js';

/* ── Safe helpers: a missing element logs a warning instead of crashing the whole file ── */
const on = (selector, event, handler) => {
  const el = document.querySelector(selector);
  if (!el) { console.warn(`Missing element: ${selector}`); return; }
  el.addEventListener(event, handler);
};
const setVal = (id, value) => {
  const el = document.getElementById(id);
  if (!el) { console.warn(`Missing element: #${id}`); return; }
  el.value = value;
};

/* ── Bootstrap ── */
initState();
renderDashboard();
renderRecords();
renderCategories();
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
if (typeof lucide !== 'undefined') lucide.createIcons();

/* ════════════════════════════════════════════════
   NAV — mobile hamburger
════════════════════════════════════════════════ */
(() => {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }));
})();

/* ════════════════════════════════════════════════
   ADD / EDIT FORM
════════════════════════════════════════════════ */
const txnForm = document.getElementById('txn-form');
const editIdEl = document.getElementById('edit-id');

txnForm.addEventListener('submit', e => {
  e.preventDefault();
  const desc = document.getElementById('f-description').value;
  const amt = document.getElementById('f-amount').value;
  const cat = document.getElementById('f-category').value;
  const date = document.getElementById('f-date').value;

  const errDesc = document.getElementById('err-description');
  const errAmt = document.getElementById('err-amount');
  const errCat = document.getElementById('err-category');
  const errDate = document.getElementById('err-date');

  const eDesc = validateDescription(desc);
  const eAmt = validateAmount(amt);
  const eCat = validateCategory(cat);
  const eDate = validateDate(date);

  showError(document.getElementById('f-description'), errDesc, eDesc);
  showError(document.getElementById('f-amount'), errAmt, eAmt);
  showError(document.getElementById('f-category'), errCat, eCat);
  showError(document.getElementById('f-date'), errDate, eDate);

  if (eDesc || eAmt || eCat || eDate) return;

  const now = new Date().toISOString();
  const id = editIdEl.value;

  if (id) {
    updateRecord(id, { description: desc.trim(), amount: parseFloat(amt), category: cat, date });
    flashStatus('form-status', '✓ Transaction updated.');
  } else {
    addRecord({
      id: genId(),
      description: desc.trim(),
      amount: parseFloat(amt),
      category: cat,
      date,
      createdAt: now,
      updatedAt: now,
    });
    flashStatus('form-status', '✓ Transaction added.');
  }

  resetForm();
  renderDashboard();
  renderRecords();
});

// Cancel edit
document.getElementById('form-cancel-btn').addEventListener('click', () => {
  resetForm();
  document.getElementById('form-status').textContent = '';
});

// Live validation on blur
['f-description', 'f-amount', 'f-category', 'f-date'].forEach(id => {
  const el = document.getElementById(id);
  el.addEventListener('blur', () => {
    const errEl = document.getElementById(id.replace('f-', 'err-'));
    if (!errEl) return;
    const validators = {
      'f-description': validateDescription,
      'f-amount': validateAmount,
      'f-category': validateCategory,
      'f-date': validateDate,
    };
    const err = validators[id]?.(el.value);
    showError(el, errEl, err);
  });
});

/* ════════════════════════════════════════════════
   RECORDS — edit / delete (event delegation)
════════════════════════════════════════════════ */
let pendingDeleteId = null;

function handleRecordAction(e) {
  const editBtn = e.target.closest('.btn-edit');
  const deleteBtn = e.target.closest('.btn-delete');

  if (editBtn) {
    const id = editBtn.dataset.id;
    const record = state.records.find(r => r.id === id);
    if (!record) return;
    populateForm(record);
    document.getElementById('add-transaction').scrollIntoView({ behavior: 'smooth' });
  }

  if (deleteBtn) {
    pendingDeleteId = deleteBtn.dataset.id;
    openDialog(deleteBtn.getAttribute('aria-label').replace('Delete ', ''));
  }
}

document.getElementById('records-tbody').addEventListener('click', handleRecordAction);
document.getElementById('records-cards').addEventListener('click', handleRecordAction);

/* ════════════════════════════════════════════════
   CONFIRM DIALOG
════════════════════════════════════════════════ */
const dialog = document.getElementById('confirm-dialog');
const dialogTitle = document.getElementById('dialog-title');
const dialogDesc = document.getElementById('dialog-desc');
let _lastFocus = null;

function openDialog(name, isClearAll = false) {
  _lastFocus = document.activeElement;
  dialogTitle.textContent = isClearAll ? 'Clear All Data?' : 'Delete Transaction?';
  dialogDesc.textContent = isClearAll
    ? 'This will delete ALL transactions and settings. This action cannot be undone.'
    : `Delete "${name}"? This action cannot be undone.`;
  dialog.hidden = false;
  document.getElementById('dialog-confirm').focus();
}

function closeDialog() {
  dialog.hidden = true;
  pendingDeleteId = null;
  _lastFocus?.focus();
}

document.getElementById('dialog-confirm').addEventListener('click', () => {
  if (pendingDeleteId === '__CLEAR_ALL__') {
    clearAll();
    initState();
    resetForm();
    renderDashboard();
    renderRecords();
    renderCategories();
    setVal('rate-usd', state.rates.usd);
    setVal('rate-eur', state.rates.eur);
    flashStatus('data-status', '✓ All data cleared.');
  } else if (pendingDeleteId) {
    deleteRecord(pendingDeleteId);
    renderDashboard();
    renderRecords();
    flashStatus('form-status', '✓ Transaction deleted.');
  }
  closeDialog();
});

document.getElementById('dialog-cancel').addEventListener('click', closeDialog);

dialog.addEventListener('click', e => { if (e.target === dialog) closeDialog(); });

dialog.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDialog();
  if (e.key === 'Tab') {
    const focusable = [...dialog.querySelectorAll('button')];
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ════════════════════════════════════════════════
   SORT
════════════════════════════════════════════════ */
document.getElementById('sort-field').addEventListener('change', e => {
  state.sortField = e.target.value;
  renderRecords();
});

document.getElementById('sort-dir').addEventListener('click', () => {
  state.sortAsc = !state.sortAsc;
  updateSortBtn();
  renderRecords();
});

/* ════════════════════════════════════════════════
   SEARCH
════════════════════════════════════════════════ */
const searchInput = document.getElementById('search-input');
const searchCase = document.getElementById('search-case');
const searchError = document.getElementById('search-error');
const searchStatusEl = document.getElementById('search-status');

function doSearch() {
  const pattern = searchInput.value.trim();
  searchError.textContent = '';
  searchInput.removeAttribute('aria-invalid');

  if (!pattern) {
    state.searchRe = null;
    searchStatusEl.textContent = '';
    renderRecords();
    return;
  }

  if (!isValidRegex(pattern)) {
    searchError.textContent = 'Invalid regex pattern.';
    searchInput.setAttribute('aria-invalid', 'true');
    state.searchRe = null;
    renderRecords();
    return;
  }

  state.searchRe = compileRegex(pattern, searchCase.checked);
  renderRecords();

  const matchCount = getFilteredRecords().length;
  searchStatusEl.textContent = `${matchCount} of ${state.records.length} transaction${state.records.length !== 1 ? 's' : ''} match /${pattern}/`;
}

searchInput.addEventListener('input', doSearch);
searchCase.addEventListener('change', doSearch);
document.getElementById('search-clear').addEventListener('click', () => {
  searchInput.value = '';
  searchCase.checked = true;
  doSearch();
});

/* ════════════════════════════════════════════════
   BUDGET
════════════════════════════════════════════════ */
on('#budget-save', 'click', () => {
  const val = document.getElementById('budget-input').value;
  const errEl = document.getElementById('budget-error');
  const err = validateBudget(val);
  if (err) {
    errEl.textContent = err;
    return;
  }
  errEl.textContent = '';
  setBudget(parseFloat(val));
  renderBudgetUI();
});

/* ════════════════════════════════════════════════
   SETTINGS — Display currency switcher
════════════════════════════════════════════════ */
function syncCurrencyBtns() {
  document.querySelectorAll('.currency-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.cur === state.displayCurrency)
  );
}
syncCurrencyBtns();

on('.currency-toggle', 'click', e => {
  const btn = e.target.closest('.currency-btn');
  if (!btn) return;
  state.displayCurrency = btn.dataset.cur;
  localStorage.setItem('sft:display-currency', state.displayCurrency);
  syncCurrencyBtns();
  renderDashboard();
  renderRecords();
});

/* ════════════════════════════════════════════════
   SETTINGS — Currency rates
════════════════════════════════════════════════ */
setVal('rate-usd', state.rates.usd);
setVal('rate-eur', state.rates.eur);

on('#rates-save', 'click', () => {
  const usdVal = document.getElementById('rate-usd').value;
  const eurVal = document.getElementById('rate-eur').value;
  const eUsd = validateRate(usdVal);
  const eEur = validateRate(eurVal);
  if (eUsd || eEur) {
    flashStatus('rates-status', eUsd || eEur, true);
    return;
  }
  setRates({ usd: parseFloat(usdVal), eur: parseFloat(eurVal) });
  flashStatus('rates-status', '✓ Rates saved.');
});

// Quick converter
on('#conv-btn', 'click', () => {
  const amt = parseFloat(document.getElementById('conv-amount').value);
  const to = document.getElementById('conv-to').value;
  const result = document.getElementById('conv-result');
  if (isNaN(amt) || amt <= 0) { result.textContent = 'Enter a valid amount.'; return; }
  const rate = state.rates[to];
  if (!rate || rate <= 0) { result.textContent = 'Invalid conversion rate. Please update rates in Settings.'; return; }
  const converted = (amt / rate).toFixed(2);
  result.textContent = `${amt.toLocaleString()} RWF = ${converted} ${to.toUpperCase()}`;
});

/* ════════════════════════════════════════════════
   SETTINGS — Categories
════════════════════════════════════════════════ */
on('#add-cat-btn', 'click', () => {
  const input = document.getElementById('new-cat');
  const errEl = document.getElementById('err-new-cat');
  const val = input.value.trim();
  const err = validateCategoryName(val);
  showError(input, errEl, err);
  if (err) return;

  const duplicate = state.categories.find(c => c.toLowerCase() === val.toLowerCase());
  if (duplicate) {
    showError(input, errEl, `"${duplicate}" already exists. Please enter another category.`);
    return;
  }
  addCategory(val);
  renderCategories();
  input.value = '';
  errEl.textContent = '';
  flashStatus('data-status', `✓ Category "${val}" added.`);
});

on('#cat-list', 'click', e => {
  const btn = e.target.closest('button[data-cat]');
  if (!btn) return;
  const cat = btn.dataset.cat;
  const defaultCats = ['Food', 'Books', 'Transport', 'Entertainment', 'Fees', 'Other'];
  if (defaultCats.includes(cat)) {
    flashStatus('data-status', `"${cat}" is a default category and cannot be removed.`, true);
    return;
  }
  removeCategory(cat);
  renderCategories();
});

/* ════════════════════════════════════════════════
   SETTINGS — Data management
════════════════════════════════════════════════ */
// Export JSON (records + categories + rates)
on('#export-btn', 'click', () => {
  const payload = { records: state.records, categories: state.categories, rates: state.rates };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `finance-tracker-export-${new Date().toISOString().slice(0, 10)}.json`,
  });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  flashStatus('data-status', '✓ Exported successfully.');
});

// Import JSON — button opens the file picker
on('#import-btn', 'click', () => document.getElementById('import-input')?.click());

// Accepts the old format (array) or the new format ({ records, categories, rates })
on('#import-input', 'change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    let parsed;
    try { parsed = JSON.parse(ev.target.result); }
    catch { flashStatus('data-status', '✗ Invalid JSON file.', true); return; }

    const records = Array.isArray(parsed) ? parsed : parsed?.records;
    const err = validateImport(records);
    if (err) { flashStatus('data-status', `✗ ${err}`, true); return; }

    const now = new Date().toISOString();
    state.records = records.map(r => ({ createdAt: now, updatedAt: now, ...r }));
    saveRecords(state.records);

    if (Array.isArray(parsed?.categories)) {
      parsed.categories.forEach(c => {
        const name = String(c);
        const exists = state.categories.some(x => x.toLowerCase() === name.toLowerCase());
        if (!exists && !validateCategoryName(name)) addCategory(name);
      });
    }

    renderDashboard();
    renderRecords();
    renderCategories();
    flashStatus('data-status', `✓ Imported ${records.length} records.`);
  };
  reader.readAsText(file);
  e.target.value = ''; // reset so the same file can be re-imported
});

// Clear all
on('#clear-btn', 'click', () => {
  pendingDeleteId = '__CLEAR_ALL__';
  openDialog('', true);
});

/* ════════════════════════════════════════════════
   ALT+1…6 — jump to sections
════════════════════════════════════════════════ */
const sectionKeys = ['about', 'dashboard', 'add-transaction', 'records', 'budget-target', 'settings'];
document.addEventListener('keydown', e => {
  if (!e.altKey) return;
  const idx = parseInt(e.key, 10) - 1;
  if (idx >= 0 && idx < sectionKeys.length) {
    e.preventDefault();
    const target = document.getElementById(sectionKeys[idx]);
    target?.scrollIntoView({ behavior: 'smooth' });
    target?.focus();
  }
});

/* ════════════════════════════════════════════════
   WINDOW RESIZE — swap table / cards
════════════════════════════════════════════════ */
window.addEventListener('resize', () => {
  document.getElementById('records-cards').hidden = window.innerWidth >= 768;
});
document.getElementById('records-cards').hidden = window.innerWidth >= 768;