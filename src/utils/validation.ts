// Validation utilities

export const validateAmount = (value: string): { valid: boolean; error?: string } => {
  if (value === '') {
    return { valid: true }; // Empty is allowed
  }

  // Check if it's a valid number
  const num = parseFloat(value);
  if (isNaN(num)) {
    return { valid: false, error: 'Invalid number' };
  }

  // Check decimal places (max 2)
  const decimalMatch = value.match(/\.(\d+)/);
  if (decimalMatch && decimalMatch[1].length > 2) {
    return { valid: false, error: 'Maximum 2 decimal places' };
  }

  // Check only one decimal point
  if ((value.match(/\./g) || []).length > 1) {
    return { valid: false, error: 'Only one decimal point allowed' };
  }

  return { valid: true };
};

export const formatAmount = (value: number): string => {
  if (value === 0 || value.toString() === '0') {
    return '0.00';
  }
  return value.toFixed(2);
};

export const parseAmount = (value: string): number => {
  if (value === '' || value === '-') {
    return 0;
  }
  return parseFloat(value) || 0;
};

export const hasDefaultNewRow = (rows: any[]): boolean => {
  // Check if there's exactly one row that:
  // - Has empty source (or '<Select One>')
  // - Has amount 0
  // - Is in a "new" state (no user input)
  return rows.some(
    row =>
      (row.source === '' || row.source === '<Select One>') &&
      row.amount === 0 &&
      row.notes === ''
  );
};

export const isDefaultRow = (row: any): boolean => {
  return (
    (row.source === '' || row.source === '<Select One>') &&
    row.amount === 0 &&
    row.notes === ''
  );
};

export const validateBankTypes = (type: string): boolean => {
  const validTypes = ['Checking', 'Savings', 'Money Market', 'CD'];
  return validTypes.includes(type);
};

export const validateInvestmentTypes = (type: string): boolean => {
  const validTypes = [
    'IRA',
    'Roth IRA',
    '401(k) / 403 (b)',
    '529 Plan',
    'ESA',
    'UGMA / UTMA',
    'HSA',
    'FSA',
    'Crypto Currency',
    'Misc.',
  ];
  return validTypes.includes(type);
};
