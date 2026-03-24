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
    leftTextAdjustment: 0,
    rightTextAdjustment: 0,
    verticalTextAdjustmentForMinMaxLabels: 10,
    verticalTextAdjustmentForCurrentSavingsLabel: -10,
  },
  'Medical': {
    label: 'Medical',
    minSavings: 0,
    maxSavings: 10000,
    baseCircumference: 90,
    baseRotation: 315,
    baseYellowColorStop: 0.5,
    baseGreenColorStop: 0.8,
    leftTextAdjustment: 80,
    rightTextAdjustment: -40,
    verticalTextAdjustmentForMinMaxLabels: -210,
    verticalTextAdjustmentForCurrentSavingsLabel: -200,
  },
  'Home': {
    label: 'Home',
    minSavings: 0,
    maxSavings: 10000,
    baseCircumference: 90,
    baseRotation: 315,
    baseYellowColorStop: 0.66,
    baseGreenColorStop: 1,
    leftTextAdjustment: 80,
    rightTextAdjustment: -40,
    verticalTextAdjustmentForMinMaxLabels: -210,
    verticalTextAdjustmentForCurrentSavingsLabel: -200,
  },
  'Car': {
    label: 'Vehicle',
    minSavings: 0,
    maxSavings: 5000,
    baseCircumference: 90,
    baseRotation: 315,
    baseYellowColorStop: 0.66,
    baseGreenColorStop: 1,
    leftTextAdjustment: 80,
    rightTextAdjustment: -40,
    verticalTextAdjustmentForMinMaxLabels: -210,
    verticalTextAdjustmentForCurrentSavingsLabel: -200,
  },
  'School': {
    label: 'School',
    minSavings: 0,
    maxSavings: 50000,
    baseCircumference: 180,
    baseRotation: 270,
    baseYellowColorStop: 0.5,
    baseGreenColorStop: 1,
    leftTextAdjustment: 0,
    rightTextAdjustment: 0,
    verticalTextAdjustmentForMinMaxLabels: 10,
    verticalTextAdjustmentForCurrentSavingsLabel: -10,
  },
  'Vacation': {
    label: 'Vacation',
    minSavings: 0,
    maxSavings: 5000,
    baseCircumference: 180,
    baseRotation: 270,
    baseYellowColorStop: 0.66,
    baseGreenColorStop: 1,
    leftTextAdjustment: 0,
    rightTextAdjustment: 0,
    verticalTextAdjustmentForMinMaxLabels: 10,
    verticalTextAdjustmentForCurrentSavingsLabel: -10,
  },
  'Other 1': {
    label: 'Other 1',
    minSavings: 0,
    maxSavings: 10000,
    baseCircumference: 270,
    baseRotation: 225,
    baseYellowColorStop: 0.5,
    baseGreenColorStop: 1,
    leftTextAdjustment: 80,
    rightTextAdjustment: -40,
    verticalTextAdjustmentForMinMaxLabels: 175,
    verticalTextAdjustmentForCurrentSavingsLabel: 125,
  },
  'Other 2': {
    label: 'Other 2',
    minSavings: 0,
    maxSavings: 10000,
    baseCircumference: 270,
    baseRotation: 225,
    baseYellowColorStop: 0.5,
    baseGreenColorStop: 1,
    leftTextAdjustment: 80,
    rightTextAdjustment: -40,
    verticalTextAdjustmentForMinMaxLabels: 175,
    verticalTextAdjustmentForCurrentSavingsLabel: 125,
  },
  'Net Income': {
    label: 'Net Income',
    minSavings: -2000,
    maxSavings: 10000,
    baseCircumference: 270,
    baseRotation: 225,
    baseYellowColorStop: 0.4,
    baseGreenColorStop: 0.75,
    leftTextAdjustment: 80,
    rightTextAdjustment: -40,
    verticalTextAdjustmentForMinMaxLabels: 175,
    verticalTextAdjustmentForCurrentSavingsLabel: 125,
  },
  'Savings': {
    label: 'Savings',
    minSavings: 0,
    maxSavings: 10000,
    baseCircumference: 270,
    baseRotation: 225,
    baseYellowColorStop: 0.5,
    baseGreenColorStop: 1,
    leftTextAdjustment: 80,
    rightTextAdjustment: -40,
    verticalTextAdjustmentForMinMaxLabels: 175,
    verticalTextAdjustmentForCurrentSavingsLabel: 125,
  },
};

export const getGaugeConfig = (label: string): GaugeConfig => {
  return gaugeConfigs[label] || gaugeConfigs['Savings'];
};
