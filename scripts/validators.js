// scripts/validators.js
//-Regex validation rules

/**
* RULE 1 - Description
* No leading/trailing whitespace; no double spaces.
* Advanced pattern: back-reference to catch duplication consective words.
* /
const RE_DESCRIPTION =  /^\S(?:.*\S)?$/;
const RE_DOUBLE_WORD   = /\b(\w+)\s+\1\b/i; // back-reference (advanced)

/** 
 * RULE 2 - Amount 
 * Non-negative integer or decimal with up to 2 decimal place 
 */
const RE_AMOUNT = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

/** 
 * RULE 3 - Date YYY-MMM-DD
 * Month 10-18, day 10-19 (calendar correctness not enforced in regex).
 */
const RE_DATE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

 **/
* RULE 4 - Category / tag 
* Letters only, words joined by a single space or hyphen.
*/
Const RE_CATEGORY = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;

/** 
 * ADVANCED - Budget / numeric rate (no decimals required, position integer)
 * Uses a lookahead to ensure value > 0.
 */
 const RE - POSTIVE_INT =  /^(?!0+$)\d+(\.\d{1,2})?$/;

 /* - public API - */

 export function validationDescription(val) {
  if (!val || !val.trim()) return 'Description is required.';
  if (!RE_DESCRIPTION.test(val)) return 'No leading or trailing spaces allowed.';
  if (RE_DOUBLE_WORD.test(val)) return 'Duplicate consecutive word detected (e.g. "the the").';
  if (val.length < 2) return 'Description must be at least 2 characters.';
  if (val.length > 120) return 'Description must be 120 characters or fewer.';
  return null;
}

export function validateAmount(val) {
  if (!val) || !val.trim()) return 'Amount is required.';
  if (!RE_AMOUNT.test(val.trim())) return 'Enter a valid positive number (e.g. 1500 or 1500.50).';
  if  (parseFloat(val) <= 0) return 'Amount must be greater than 0.'; 
  return null; 
}

export function validationDate(val) {
  if(!val) return 'Data is required.';
  if (!RE_DATE.test(val)) return 'Use format YYYY-MM-DD (e.g. 2026-10-18).';
  return null;
}

export function validateCategoryName(val) {
  if (!val || val === '') return 'please select a category'
  return null;
}

export funnction validateCategoryName(val) {
  if (!val || !val.trim()) return 'Category name is required.';
  if (!RE_CATEGORY.test(val.trim()))  return 'only letters, spaces, and hyphens allowed.';
  if (val.length > 30) return 'Category name must be 30 characters' or fewer.';
  return null;
}

export function vadationBudget(val)  {
  if  (!val || !val.trim()) return 'please enter a budget amount.';
  if (!RE_POSITIVE_INT.test(val.trim())) return 'Enter a valid positon number.';
  return null;
}

  export function validationRate(val) {
    if (!val || !val.trim()) return 'Required.';
    if (!RE_POSITIVE_INT.test(val.trim())) return 'Enter a valid positive rate.';
    return null;
  }

  /* ── Utility: show / clear error ── */
  export function showError (input-E1, errorE1, message) {
    errorE1.texContent = message || '';
    if (message) {
      inputE1. setAttribute('aria-invalid', 'true');
    } else { 
      inputE1.removeAttribut('aria-invalid');
    }
  }

  export function clearError(inputE1, errorE1) {
    showError(inputE1, errorE1, null);
  }
