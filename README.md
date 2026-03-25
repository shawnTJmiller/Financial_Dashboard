# Financial Dashboard

A production-ready, pure static Single Page Application for financial management and visualization.

## Features

- **Pure Static SPA**: No backend, APIs, or persistence required
- **Real-time Calculations**: Dynamic gauge and dashboard updates
- **Modular Architecture**: Clean component-based structure
- **Responsive Design**: Works across different screen sizes
- **Chart.js Gauges**: Doughnut-style gauge visualizations with dashed backgrounds
- **Font Awesome Icons**: Elegant status light indicators
- **Type-Safe**: Built with TypeScript
- **Well-Tested**: Comprehensive unit tests including dashboard light color logic

## Technology Stack

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Modern build tool
- **Tailwind CSS**: Utility-first styling
- **Chart.js 4.5.1**: Doughnut gauge visualizations
- **react-chartjs-2 5.3.1**: React wrapper for Chart.js
- **Font Awesome 6**: Icon library for status lights
- **Vitest**: Unit testing framework

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building

Create a production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Testing

Run the test suite:
```bash
npm run test
```

Run tests with UI:
```bash
npm run test:ui
```

### Test Coverage

The test suite includes:
- **Calculation Tests**: Tier allocation, investment categorization, income calculations
- **Validation Tests**: Amount validation, formatting, parsing
- **Dashboard Light Tests**: Color calculation logic, Income thresholds, flashing state
  - Standard light color proportions (red < 50%, yellow 50-80%, green ≥ 80%)
  - Income custom thresholds (red < $1,500, yellow $1,500-$2,999, green ≥ $3,000)
  - Gauge-specific max values and configurations
  - Flashing behavior for negative values

All 55 tests validate core business logic and UI indicator behavior.

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── AmountPopup.tsx  # Calculator popup
│   │   ├── Gauge.tsx        # Chart.js doughnut gauge component
│   │   ├── TableSection.tsx # Data table component
│   │   ├── DashboardLights.tsx # Font Awesome status light icons
│   │   └── InputPanel.tsx   # Main input section
│   ├── utils/
│   │   ├── calculations.ts  # Core calculation logic & light color functions
│   │   ├── gaugeConfig.ts   # Gauge visual configuration settings
│   │   └── validation.ts    # Validation utilities
│   ├── tests/
│   │   └── calculations.test.ts # Unit tests including dashboard light tests
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## Application Architecture

### Input Section
- **Financial Fuel**: Manage bank accounts, investments, and other sources
- **Income**: Track income sources
- **Debts**: Track debt obligations

### Output Section
Grid-based layout (10 gauges × 10 status lights per row) with Chart.js doughnut gauges:
- **Savings**: Financial cushion (max $10,000, or dynamic when tier ≥ $50,000)
- **Retirement**: Long-term retirement funds (max $1,000,000)
- **Medical**: HSA/FSA funds (max $10,000)
- **Income**: Net income after debts (custom thresholds: red < $1,500, yellow $1,500-$2,999, green ≥ $3,000)
- **Home**: Home-related funds (max $10,000)
- **Car**: Vehicle-related funds (max $5,000)
- **School**: Education funds (max $50,000)
- **Vacation**: Travel funds (max $5,000)
- **Other Gauge 1 & 2**: Additional allocations (max $10,000 each)

**Dashboard Lights**: Font Awesome status indicators with dynamic color coding and flashing alerts for negative values

### Calculation Engine

#### Tier-Based Allocation
The system uses tier-based allocation for fuel distribution:

- **Tier ≤ $10,000**: Savings only
- **Tier > $10,000**: Savings with overflow to Home
- **Tier > $20,000**: Savings & Home with overflow to Car
- **Tier > $25,000**: Savings, Home & Car with overflow to Vacation
- **Tier > $30,000**: All with overflow to Other Gauge 1
- **Tier > $40,000**: All with overflow to Other Gauge 2
- **Tier ≥ $50,000**: All gauges funded

#### Investment Categorization

**Retirement Investments**:
- IRA, Roth IRA, 401(k)/403(b), Crypto Currency, Misc.

**Medical Investments**:
- HSA, FSA

**School Investments**:
- 529 Plan, ESA, UGMA/UTMA

### Gauge Visibility
- **Always Visible**: Savings, Income
- **Conditional**: All others only when value > 0

## Data Flow

1. User enters financial data in Input Section
2. Application calculates totals for each category
3. Tier allocation logic distributes fuel amounts
4. Gauge values update in real-time
5. Dashboard lights reflect current gauge status

## Styling

The application uses:
- **Dark neutral dashboard theme**: Professional, eye-friendly interface
- **Tailwind CSS**: Rapid, consistent styling
- **Chart.js Gauges**: Responsive doughnut charts with configurable colors and sizing
- **Font Awesome Icons**: Professional icon set for status indicators

### Color Coding for Dashboard Lights

Dashboard lights use a three-color system to indicate gauge health:

**Standard Gauges** (Savings, Retirement, Medical, Home, Car, School, Vacation, Other 1, Other 2):
- **Red**: < 50% of maximum (critical/low)
- **Yellow**: 50-80% of maximum (warning/moderate)
- **Green**: ≥ 80% of maximum (good/healthy)

**Income Gauge** (custom thresholds):
- **Red**: < $1,500 (critical)
- **Yellow**: $1,500 - $2,999 (warning)
- **Green**: ≥ $3,000 (healthy)

### Status Light Icons

Each dashboard light displays a Font Awesome icon corresponding to its gauge:
- **Savings**: Bank icon (fa-bank)
- **Retirement**: Hourglass icon (fa-hourglass-2)
- **Medical**: Heart icon (fa-heartbeat)
- **Income**: Wallet icon (fa-wallet)
- **Home**: Home icon (fa-home)
- **Car**: Car icon (fa-car)
- **School**: Graduation cap icon (fa-graduation-cap)
- **Vacation**: Plane icon (fa-plane)
- **Other 1**: Gift icon (fa-gift)
- **Other 2**: Battery icon (fa-battery)

### Flashing Animation

When **Savings** or **Income** values become negative, their status light icons enter a flashing state:
- Cycles between grey (#404040) and red (#ef4444)
- 1-second animation cycle
- Provides visual warning for critical negative balance states
- Animation runs continuously until value returns to positive

## Gauge Configuration

Gauges are configured via [src/utils/gaugeConfig.ts](src/utils/gaugeConfig.ts) with customizable properties:
- **Visual sizing**: Font sizes, text positioning, gauge rotation
- **Color thresholds**: Yellow and green proportion stops
- **Max values**: Default maximum amounts for each gauge type
  - Savings: $10,000 (dynamic maximum when tier ≥ $50,000)
  - Retirement: $1,000,000
  - School: $50,000
  - All others: $10,000 or $5,000 as configured

### Light Color Calculation Functions

Three utility functions in [src/utils/calculations.ts](src/utils/calculations.ts) determine status light colors:

1. **`getLightColor(value, max)`**: Standard proportion-based logic
   - Red when value/max < 0.5
   - Yellow when 0.5 ≤ value/max < 0.8
   - Green when value/max ≥ 0.8

2. **`getIncomeColor(income)`**: Custom Income thresholds
   - Red when income < $1,500
   - Yellow when $1,500 ≤ income < $3,000
   - Green when income ≥ $3,000

3. **`getShouldFlash(value)`**: Determines flashing state
   - Returns true when value < 0 (for Savings and Income)
   - Returns false for all non-negative values

## Performance

- **No external API calls**: All calculations are local
- **No persistence**: Fresh state on reload (as designed)
- **Optimized rendering**: React component memoization
- **Minimal dependencies**: Lightweight bundle

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge, Brave)
- Requires JavaScript enabled

## License

This project is part of a financial dashboard application suite.

## Future Enhancements

- Export/Import functionality (CSV, JSON)
- Multiple dashboard presets
- Additional gauge customization
- Advanced reporting features
- Responsive design supports mobile and desktop
