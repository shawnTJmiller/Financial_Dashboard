// Types for financial data
export interface FuelRow {
  source: 'Bank' | 'Investment' | 'Other' | '';
  type: string;
  amount: number;
  notes: string;
}

export interface IncomeRow {
  source: string;
  amount: number;
  notes: string;
}

export interface DebtsRow {
  source: string;
  amount: number;
  notes: string;
}

export interface GaugeValues {
  savings: number;
  retirement: number;
  medical: number;
  income: number;
  home: number;
  car: number;
  school: number;
  vacation: number;
  otherGauge1: number;
  otherGauge2: number;
}

// Calculate total fuel amount (Bank, Other, or unselected sources only)
export const calculateTotalFuel = (fuelRows: FuelRow[]): number => {
  return fuelRows
    .filter(row => row.source === 'Bank' || row.source === 'Other' || row.source === '')
    .reduce((sum, row) => sum + row.amount, 0);
};

// Calculate investment totals by type
export const calculateRetirementInvestments = (fuelRows: FuelRow[]): number => {
  const retirementTypes = ['IRA', 'Roth IRA', '401(k) / 403 (b)', 'Crypto Currency', 'Misc.'];
  return fuelRows
    .filter(row => row.source === 'Investment' && retirementTypes.includes(row.type))
    .reduce((sum, row) => sum + row.amount, 0);
};

export const calculateMedicalInvestments = (fuelRows: FuelRow[]): number => {
  const medicalTypes = ['HSA', 'FSA'];
  return fuelRows
    .filter(row => row.source === 'Investment' && medicalTypes.includes(row.type))
    .reduce((sum, row) => sum + row.amount, 0);
};

export const calculateSchoolInvestments = (fuelRows: FuelRow[]): number => {
  const schoolTypes = ['529 Plan', 'ESA', 'UGMA / UTMA'];
  return fuelRows
    .filter(row => row.source === 'Investment' && schoolTypes.includes(row.type))
    .reduce((sum, row) => sum + row.amount, 0);
};

// Calculate net income
export const calculateNetIncome = (incomeRows: IncomeRow[], debtsRows: DebtsRow[]): number => {
  const income = incomeRows.reduce((sum, row) => sum + row.amount, 0);
  const debts = debtsRows.reduce((sum, row) => sum + row.amount, 0);
  return income + debts; // Debts are negative by default
};

// EXACT Tier Allocation Logic - DO NOT MODIFY
export const allocateTierGauges = (totalFuelAmount: number): Partial<GaugeValues> => {
  if (totalFuelAmount >= 50000) {
    return {
      otherGauge2: 10000,
      otherGauge1: 10000,
      vacation: 5000,
      car: 5000,
      home: 10000,
      savings: totalFuelAmount - (10000 + 10000 + 5000 + 5000 + 10000),
    };
  } else if (totalFuelAmount > 40000) {
    return {
      otherGauge1: 10000,
      vacation: 5000,
      car: 5000,
      home: 10000,
      savings: 10000,
      otherGauge2: totalFuelAmount - (10000 + 5000 + 5000 + 10000 + 10000),
    };
  } else if (totalFuelAmount > 30000) {
    return {
      vacation: 5000,
      car: 5000,
      home: 10000,
      savings: 10000,
      otherGauge1: totalFuelAmount - (5000 + 5000 + 10000 + 10000),
    };
  } else if (totalFuelAmount > 25000) {
    return {
      car: 5000,
      home: 10000,
      savings: 10000,
      vacation: totalFuelAmount - (5000 + 10000 + 10000),
    };
  } else if (totalFuelAmount > 20000) {
    return {
      home: 10000,
      savings: 10000,
      car: totalFuelAmount - (10000 + 10000),
    };
  } else if (totalFuelAmount > 10000) {
    return {
      savings: 10000,
      home: totalFuelAmount - 10000,
    };
  } else {
    return {
      savings: totalFuelAmount,
    };
  }
};

// Calculate all gauge values
export const calculateAllGauges = (
  fuelRows: FuelRow[],
  incomeRows: IncomeRow[],
  debtsRows: DebtsRow[]
): GaugeValues => {
  const totalFuel = calculateTotalFuel(fuelRows);
  const tierAllocation = allocateTierGauges(totalFuel);

  return {
    savings: tierAllocation.savings ?? 0,
    retirement: calculateRetirementInvestments(fuelRows),
    medical: calculateMedicalInvestments(fuelRows),
    income: calculateNetIncome(incomeRows, debtsRows),
    home: tierAllocation.home ?? 0,
    car: tierAllocation.car ?? 0,
    school: calculateSchoolInvestments(fuelRows),
    vacation: tierAllocation.vacation ?? 0,
    otherGauge1: tierAllocation.otherGauge1 ?? 0,
    otherGauge2: tierAllocation.otherGauge2 ?? 0,
  };
};

// Determine gauge visibility
export const getGaugeVisibility = (gaugeValues: GaugeValues) => {
  return {
    savings: true, // Always visible
    retirement: gaugeValues.retirement > 0,
    medical: gaugeValues.medical > 0,
    income: true, // Always visible
    home: gaugeValues.home > 0,
    car: gaugeValues.car > 0,
    school: gaugeValues.school > 0,
    vacation: gaugeValues.vacation > 0,
    otherGauge1: gaugeValues.otherGauge1 > 0,
    otherGauge2: gaugeValues.otherGauge2 > 0,
  };
};
