/**
 * Gauge configuration settings for each gauge type
 * Each gauge has specific visual and numerical parameters
 */

export interface GaugeConfig {
  label: string;
  minSavings: number;
  maxSavings: number;
  baseCircumference: number;
  baseRotation: number;
  baseYellowColorStop: number;
  baseGreenColorStop: number;
  minMaxFontSize: number;
  currentValueFontSize: number;
  leftTextAdjustment: number;
  rightTextAdjustment: number;
  verticalTextAdjustmentForMinMaxLabels: number;
  verticalTextAdjustmentForCurrentSavingsLabel: number;
}

export const gaugeConfigs: Record<string, GaugeConfig> = {
  'Retirement': {
    label: 'Retirement',
    minSavings: 0,
    maxSavings: 1000000,
    baseCircumference: 180,
    baseRotation: 270,
    baseYellowColorStop: 0.5,
    baseGreenColorStop: 0.85,
    minMaxFontSize: 12,
    currentValueFontSize: 20,
    leftTextAdjustment: 0,
    rightTextAdjustment: 0,
    verticalTextAdjustmentForMinMaxLabels: 5,
    verticalTextAdjustmentForCurrentSavingsLabel: -15,
  },
  'Medical': {
    label: 'Medical',
    minSavings: 0,
    maxSavings: 10000,
    baseCircumference: 90,
    baseRotation: 315,
    baseYellowColorStop: 0.5,
    baseGreenColorStop: 0.8,
    minMaxFontSize: 12,
    currentValueFontSize: 20,
    leftTextAdjustment: 30,
    rightTextAdjustment: -5,
    verticalTextAdjustmentForMinMaxLabels: -80,
    verticalTextAdjustmentForCurrentSavingsLabel: -90,
  },
  'Home': {
    label: 'Home',
    minSavings: 0,
    maxSavings: 10000,
    baseCircumference: 90,
    baseRotation: 315,
    baseYellowColorStop: 0.66,
    baseGreenColorStop: 1,
    minMaxFontSize: 12,
    currentValueFontSize: 20,
    leftTextAdjustment: 30,
    rightTextAdjustment: -5,
    verticalTextAdjustmentForMinMaxLabels: -80,
    verticalTextAdjustmentForCurrentSavingsLabel: -90,
  },
  'Car': {
    label: 'Vehicle',
    minSavings: 0,
    maxSavings: 5000,
    baseCircumference: 90,
    baseRotation: 315,
    baseYellowColorStop: 0.66,
    baseGreenColorStop: 1,
    minMaxFontSize: 12,
    currentValueFontSize: 20,
    leftTextAdjustment: 30,
    rightTextAdjustment: -10,
    verticalTextAdjustmentForMinMaxLabels: -80,
    verticalTextAdjustmentForCurrentSavingsLabel: -90,
  },
  'School': {
    label: 'School',
    minSavings: 0,
    maxSavings: 50000,
    baseCircumference: 180,
    baseRotation: 270,
    baseYellowColorStop: 0.5,
    baseGreenColorStop: 1,
    minMaxFontSize: 12,
    currentValueFontSize: 20,
    leftTextAdjustment: 0,
    rightTextAdjustment: 0,
    verticalTextAdjustmentForMinMaxLabels: 5,
    verticalTextAdjustmentForCurrentSavingsLabel: -15,
  },
  'Vacation': {
    label: 'Vacation',
    minSavings: 0,
    maxSavings: 5000,
    baseCircumference: 180,
    baseRotation: 270,
    baseYellowColorStop: 0.66,
    baseGreenColorStop: 1,
    minMaxFontSize: 12,
    currentValueFontSize: 20,
    leftTextAdjustment: 0,
    rightTextAdjustment: 0,
    verticalTextAdjustmentForMinMaxLabels: 5,
    verticalTextAdjustmentForCurrentSavingsLabel: -15,
  },
  'Other 1': {
    label: 'Other 1',
    minSavings: 0,
    maxSavings: 10000,
    baseCircumference: 270,
    baseRotation: 225,
    baseYellowColorStop: 0.5,
    baseGreenColorStop: 1,
    minMaxFontSize: 12,
    currentValueFontSize: 20,
    leftTextAdjustment: 30,
    rightTextAdjustment: -10,
    verticalTextAdjustmentForMinMaxLabels: 50,
    verticalTextAdjustmentForCurrentSavingsLabel: 35,
  },
  'Other 2': {
    label: 'Other 2',
    minSavings: 0,
    maxSavings: 10000,
    baseCircumference: 270,
    baseRotation: 225,
    baseYellowColorStop: 0.5,
    baseGreenColorStop: 1,
    minMaxFontSize: 12,
    currentValueFontSize: 20,
    leftTextAdjustment: 30,
    rightTextAdjustment: -10,
    verticalTextAdjustmentForMinMaxLabels: 50,
    verticalTextAdjustmentForCurrentSavingsLabel: 35,
  },
  'Net Income': {
    label: 'Net Income',
    minSavings: -2000,
    maxSavings: 10000,
    baseCircumference: 270,
    baseRotation: 225,
    baseYellowColorStop: 0.5,
    baseGreenColorStop: 0.85,
    minMaxFontSize: 20,
    currentValueFontSize: 45,
    leftTextAdjustment: 30,
    rightTextAdjustment: -20,
    verticalTextAdjustmentForMinMaxLabels: 150,
    verticalTextAdjustmentForCurrentSavingsLabel: 90,
  },
  'Savings': {
    label: 'Savings',
    minSavings: 0,
    maxSavings: 100000,
    baseCircumference: 270,
    baseRotation: 225,
    baseYellowColorStop: 0.5,
    baseGreenColorStop: 1,
    minMaxFontSize: 12,
    currentValueFontSize: 20,
    leftTextAdjustment: 30,
    rightTextAdjustment: -10,
    verticalTextAdjustmentForMinMaxLabels: 50,
    verticalTextAdjustmentForCurrentSavingsLabel: 35,
  },
};

export const getGaugeConfig = (label: string): GaugeConfig => {
  return gaugeConfigs[label] || gaugeConfigs['Savings'];
};
