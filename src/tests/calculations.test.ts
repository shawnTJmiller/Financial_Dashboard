import { describe, it, expect } from 'vitest';
import {
  calculateTotalFuel,
  calculateRetirementInvestments,
  calculateMedicalInvestments,
  calculateSchoolInvestments,
  calculateNetIncome,
  allocateTierGauges,
  calculateAllGauges,
  getGaugeVisibility,
} from '../utils/calculations';
import {
  validateAmount,
  formatAmount,
  parseAmount,
  hasDefaultNewRow,
  isDefaultRow,
} from '../utils/validation';

describe('Calculations', () => {
  describe('calculateTotalFuel', () => {
    it('sums Bank and Other sources, excludes Investment', () => {
      const rows = [
        { source: 'Bank' as const, type: 'Checking', amount: 5000, notes: '' },
        { source: 'Investment' as const, type: 'IRA', amount: 10000, notes: '' },
        { source: 'Other' as const, type: '', amount: 2000, notes: '' },
      ];
      expect(calculateTotalFuel(rows)).toBe(7000);
    });

    it('includes unselected (empty source) rows', () => {
      const rows = [
        { source: '' as const, type: '', amount: 3000, notes: '' },
        { source: 'Bank' as const, type: 'Savings', amount: 2000, notes: '' },
      ];
      expect(calculateTotalFuel(rows)).toBe(5000);
    });

    it('returns 0 for empty list', () => {
      expect(calculateTotalFuel([])).toBe(0);
    });
  });

  describe('calculateRetirementInvestments', () => {
    it('sums IRA and Roth IRA types', () => {
      const rows = [
        { source: 'Investment' as const, type: 'IRA', amount: 5000, notes: '' },
        { source: 'Investment' as const, type: 'Roth IRA', amount: 3000, notes: '' },
        { source: 'Investment' as const, type: '529 Plan', amount: 2000, notes: '' },
      ];
      expect(calculateRetirementInvestments(rows)).toBe(8000);
    });

    it('includes Crypto Currency and Misc', () => {
      const rows = [
        { source: 'Investment' as const, type: 'Crypto Currency', amount: 1000, notes: '' },
        { source: 'Investment' as const, type: 'Misc.', amount: 500, notes: '' },
      ];
      expect(calculateRetirementInvestments(rows)).toBe(1500);
    });
  });

  describe('calculateMedicalInvestments', () => {
    it('sums HSA and FSA types only', () => {
      const rows = [
        { source: 'Investment' as const, type: 'HSA', amount: 1000, notes: '' },
        { source: 'Investment' as const, type: 'FSA', amount: 2000, notes: '' },
        { source: 'Investment' as const, type: 'IRA', amount: 5000, notes: '' },
      ];
      expect(calculateMedicalInvestments(rows)).toBe(3000);
    });
  });

  describe('calculateSchoolInvestments', () => {
    it('sums 529 Plan, ESA, and UGMA/UTMA types', () => {
      const rows = [
        { source: 'Investment' as const, type: '529 Plan', amount: 2000, notes: '' },
        { source: 'Investment' as const, type: 'ESA', amount: 1000, notes: '' },
        { source: 'Investment' as const, type: 'UGMA / UTMA', amount: 1500, notes: '' },
      ];
      expect(calculateSchoolInvestments(rows)).toBe(4500);
    });
  });

  describe('calculateNetIncome', () => {
    it('adds income and debts (debts negative)', () => {
      const income = [
        { source: 'Salary', amount: 5000, notes: '' },
        { source: 'Bonus', amount: 1000, notes: '' },
      ];
      const debts = [
        { source: 'Loan', amount: -500, notes: '' },
        { source: 'CC', amount: -200, notes: '' },
      ];
      expect(calculateNetIncome(income, debts)).toBe(5300);
    });

    it('returns negative if debts exceed income', () => {
      const income = [{ source: 'Salary', amount: 2000, notes: '' }];
      const debts = [{ source: 'Loan', amount: -3000, notes: '' }];
      expect(calculateNetIncome(income, debts)).toBe(-1000);
    });
  });

  describe('allocateTierGauges', () => {
    it('tier >= 50000', () => {
      const result = allocateTierGauges(50000);
      expect(result.otherGauge2).toBe(10000);
      expect(result.otherGauge1).toBe(10000);
      expect(result.vacation).toBe(5000);
      expect(result.car).toBe(5000);
      expect(result.home).toBe(10000);
      expect(result.savings).toBe(10000);
    });

    it('tier > 40000 and < 50000', () => {
      const result = allocateTierGauges(45000);
      expect(result.otherGauge1).toBe(10000);
      expect(result.vacation).toBe(5000);
      expect(result.car).toBe(5000);
      expect(result.home).toBe(10000);
      expect(result.savings).toBe(10000);
      expect(result.otherGauge2).toBe(5000);
    });

    it('tier > 30000 and <= 40000', () => {
      const result = allocateTierGauges(35000);
      expect(result.vacation).toBe(5000);
      expect(result.car).toBe(5000);
      expect(result.home).toBe(10000);
      expect(result.savings).toBe(10000);
      expect(result.otherGauge1).toBe(5000);
    });

    it('tier > 25000 and <= 30000', () => {
      const result = allocateTierGauges(28000);
      expect(result.car).toBe(5000);
      expect(result.home).toBe(10000);
      expect(result.savings).toBe(10000);
      expect(result.vacation).toBe(3000);
    });

    it('tier > 20000 and <= 25000', () => {
      const result = allocateTierGauges(22000);
      expect(result.home).toBe(10000);
      expect(result.savings).toBe(10000);
      expect(result.car).toBe(2000);
    });

    it('tier > 10000 and <= 20000', () => {
      const result = allocateTierGauges(15000);
      expect(result.savings).toBe(10000);
      expect(result.home).toBe(5000);
    });

    it('tier <= 10000', () => {
      const result = allocateTierGauges(5000);
      expect(result.savings).toBe(5000);
    });
  });

  describe('getGaugeVisibility', () => {
    it('always shows savings and income', () => {
      const visibility = getGaugeVisibility({
        savings: 0,
        retirement: 0,
        medical: 0,
        income: 0,
        home: 0,
        car: 0,
        school: 0,
        vacation: 0,
        otherGauge1: 0,
        otherGauge2: 0,
      });
      expect(visibility.savings).toBe(true);
      expect(visibility.income).toBe(true);
    });

    it('shows others only if > 0', () => {
      const visibility = getGaugeVisibility({
        savings: 100,
        retirement: 5000,
        medical: 0,
        income: 50,
        home: 1000,
        car: 0,
        school: 500,
        vacation: 0,
        otherGauge1: 2000,
        otherGauge2: 0,
      });
      expect(visibility.retirement).toBe(true);
      expect(visibility.medical).toBe(false);
      expect(visibility.home).toBe(true);
      expect(visibility.car).toBe(false);
      expect(visibility.school).toBe(true);
      expect(visibility.vacation).toBe(false);
      expect(visibility.otherGauge1).toBe(true);
      expect(visibility.otherGauge2).toBe(false);
    });
  });
});

describe('Validation', () => {
  describe('validateAmount', () => {
    it('accepts empty string', () => {
      expect(validateAmount('').valid).toBe(true);
    });

    it('accepts valid numbers', () => {
      expect(validateAmount('100').valid).toBe(true);
      expect(validateAmount('100.50').valid).toBe(true);
      expect(validateAmount('0.01').valid).toBe(true);
      expect(validateAmount('-50.75').valid).toBe(true);
    });

    it('rejects more than 2 decimals', () => {
      expect(validateAmount('100.999').valid).toBe(false);
    });

    it('rejects multiple decimals', () => {
      expect(validateAmount('100.50.75').valid).toBe(false);
    });

    it('rejects non-numeric', () => {
      expect(validateAmount('abc').valid).toBe(false);
    });
  });

  describe('formatAmount', () => {
    it('formats to 2 decimals', () => {
      expect(formatAmount(100)).toBe('100.00');
      expect(formatAmount(100.5)).toBe('100.50');
      expect(formatAmount(0)).toBe('0.00');
    });
  });

  describe('parseAmount', () => {
    it('parses valid strings', () => {
      expect(parseAmount('100')).toBe(100);
      expect(parseAmount('100.50')).toBe(100.5);
      expect(parseAmount('0')).toBe(0);
    });

    it('returns 0 for empty', () => {
      expect(parseAmount('')).toBe(0);
      expect(parseAmount('-')).toBe(0);
    });
  });

  describe('hasDefaultNewRow', () => {
    it('detects default new row', () => {
      const rows = [
        { source: '', amount: 0, notes: '' },
      ];
      expect(hasDefaultNewRow(rows)).toBe(true);
    });

    it('returns false if row has been modified', () => {
      const rows = [
        { source: 'Bank', amount: 0, notes: '' },
      ];
      expect(hasDefaultNewRow(rows)).toBe(false);
    });

    it('returns false if no rows', () => {
      expect(hasDefaultNewRow([])).toBe(false);
    });
  });

  describe('isDefaultRow', () => {
    it('identifies default row', () => {
      const row = { source: '', amount: 0, notes: '' };
      expect(isDefaultRow(row)).toBe(true);
    });

    it('rejects row with source', () => {
      const row = { source: 'Bank', amount: 0, notes: '' };
      expect(isDefaultRow(row)).toBe(false);
    });
  });
});
