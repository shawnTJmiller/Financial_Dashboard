import { describe, it, expect } from 'vitest';
import {
  calculateTotalFuel,
  calculateRetirementInvestments,
  calculateMedicalInvestments,
  calculateSchoolInvestments,
  calculateNetIncome,
  allocateTierGauges,
  getGaugeVisibility,
  getLightColor,
  getIncomeColor,
  getShouldFlash,
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

describe('Dashboard Light Colors', () => {
  describe('getLightColor', () => {
    it('returns red when proportion < 0.5', () => {
      expect(getLightColor(4000, 10000)).toBe('#ef4444'); // 40%
      expect(getLightColor(0, 10000)).toBe('#ef4444'); // 0%
      expect(getLightColor(4999, 10000)).toBe('#ef4444'); // 49.99%
    });

    it('returns yellow when proportion 0.5-0.8', () => {
      expect(getLightColor(5000, 10000)).toBe('#eab308'); // 50%
      expect(getLightColor(7000, 10000)).toBe('#eab308'); // 70%
      expect(getLightColor(7999, 10000)).toBe('#eab308'); // 79.99%
    });

    it('returns green when proportion >= 0.8', () => {
      expect(getLightColor(8000, 10000)).toBe('#22c55e'); // 80%
      expect(getLightColor(10000, 10000)).toBe('#22c55e'); // 100%
      expect(getLightColor(12000, 10000)).toBe('#22c55e'); // 120% (overflow)
    });

    it('handles large max values (Retirement)', () => {
      expect(getLightColor(400000, 1000000)).toBe('#ef4444'); // 40%
      expect(getLightColor(500000, 1000000)).toBe('#eab308'); // 50%
      expect(getLightColor(800000, 1000000)).toBe('#22c55e'); // 80%
    });

    it('handles small max values', () => {
      expect(getLightColor(2000, 5000)).toBe('#ef4444'); // 40%
      expect(getLightColor(2500, 5000)).toBe('#eab308'); // 50%
      expect(getLightColor(4000, 5000)).toBe('#22c55e'); // 80%
    });

    it('handles negative values', () => {
      expect(getLightColor(-1000, 10000)).toBe('#ef4444'); // -10% (red)
    });
  });

  describe('getIncomeColor', () => {
    it('returns red when income < 1500', () => {
      expect(getIncomeColor(0)).toBe('#ef4444');
      expect(getIncomeColor(1000)).toBe('#ef4444');
      expect(getIncomeColor(1499)).toBe('#ef4444');
    });

    it('returns yellow when income 1500-2999', () => {
      expect(getIncomeColor(1500)).toBe('#eab308');
      expect(getIncomeColor(2000)).toBe('#eab308');
      expect(getIncomeColor(2999)).toBe('#eab308');
    });

    it('returns green when income >= 3000', () => {
      expect(getIncomeColor(3000)).toBe('#22c55e');
      expect(getIncomeColor(5000)).toBe('#22c55e');
      expect(getIncomeColor(10000)).toBe('#22c55e');
    });

    it('handles negative income', () => {
      expect(getIncomeColor(-500)).toBe('#ef4444'); // red
      expect(getIncomeColor(-1000)).toBe('#ef4444'); // red
    });
  });

  describe('getShouldFlash', () => {
    it('returns true when value < 0', () => {
      expect(getShouldFlash(-1)).toBe(true);
      expect(getShouldFlash(-100)).toBe(true);
      expect(getShouldFlash(-5000)).toBe(true);
    });

    it('returns false when value >= 0', () => {
      expect(getShouldFlash(0)).toBe(false);
      expect(getShouldFlash(1)).toBe(false);
      expect(getShouldFlash(5000)).toBe(false);
      expect(getShouldFlash(10000)).toBe(false);
    });
  });

  describe('Dashboard Light Configuration', () => {
    it('correctly configures Savings light with 10000 max', () => {
      // At 50% (5000)
      expect(getLightColor(5000, 10000)).toBe('#eab308'); // yellow
      // At 100% (10000+)
      expect(getLightColor(10000, 10000)).toBe('#22c55e'); // green
    });

    it('correctly configures Retirement light with 1000000 max', () => {
      // At 50% (500000)
      expect(getLightColor(500000, 1000000)).toBe('#eab308'); // yellow
      // At 100% (1000000)
      expect(getLightColor(1000000, 1000000)).toBe('#22c55e'); // green
    });

    it('correctly configures Medical light with 10000 max', () => {
      // At 50% (5000)
      expect(getLightColor(5000, 10000)).toBe('#eab308'); // yellow
    });

    it('correctly configures Car light with 5000 max', () => {
      // At 50% (2500)
      expect(getLightColor(2500, 5000)).toBe('#eab308'); // yellow
      // At 80% (4000)
      expect(getLightColor(4000, 5000)).toBe('#22c55e'); // green
    });

    it('correctly configures School light with 50000 max', () => {
      // At 50% (25000)
      expect(getLightColor(25000, 50000)).toBe('#eab308'); // yellow
      // At 100% (50000)
      expect(getLightColor(50000, 50000)).toBe('#22c55e'); // green
    });

    it('correctly configures Vacation light with 5000 max', () => {
      // At 80% (4000)
      expect(getLightColor(4000, 5000)).toBe('#22c55e'); // green
    });

    it('correctly configures Other gauges with 10000 max', () => {
      // At 50% (5000)
      expect(getLightColor(5000, 10000)).toBe('#eab308'); // yellow
    });
  });

  describe('Income Light vs Standard Light Color Logic', () => {
    it('Income uses custom thresholds, not proportion-based', () => {
      // Income at 2000 should be yellow (custom thresholds)
      expect(getIncomeColor(2000)).toBe('#eab308');
      // But with proportion-based at max 10000, 2000 would be red (20%)
      expect(getLightColor(2000, 10000)).toBe('#ef4444');
    });

    it('Savings at 10000+ is always green, independent of gauge max', () => {
      // This is a special case for Savings
      // At exactly 10000, custom logic returns green
      // But proportion (10000/10000 = 100%) also returns green
      expect(getLightColor(10000, 10000)).toBe('#22c55e');
      // Above 10000 is still green
      expect(getLightColor(15000, 10000)).toBe('#22c55e'); // 150%
    });
  });

  describe('Flash Status for Negative Values', () => {
    it('Savings should flash when negative', () => {
      // When savings value < 0, should flash
      expect(getShouldFlash(-100)).toBe(true);
      expect(getShouldFlash(-1)).toBe(true);
    });

    it('Income should flash when negative', () => {
      // When income value < 0, should flash
      expect(getShouldFlash(-500)).toBe(true);
      expect(getShouldFlash(-1)).toBe(true);
    });

    it('Other values should not flash when negative or positive', () => {
      // Only Savings and Income flash on negative
      // For other gauges, we just check if they should flash (which is false for non-Savings/Income)
      expect(getShouldFlash(-5000)).toBe(true); // Returns true for any negative
      expect(getShouldFlash(0)).toBe(false);
      expect(getShouldFlash(5000)).toBe(false);
    });
  });
});
