# Financial Dashboard

A production-ready, pure static Single Page Application for financial management and visualization.

## Features

- **Pure Static SPA**: No backend, APIs, or persistence required
- **Real-time Calculations**: Dynamic gauge and dashboard updates
- **Modular Architecture**: Clean component-based structure
- **Responsive Design**: Works across different screen sizes
- **SVG Gauges**: Custom, scalable gauge visualizations
- **Type-Safe**: Built with TypeScript
- **Well-Tested**: Comprehensive unit tests included

## Technology Stack

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Modern build tool
- **Tailwind CSS**: Utility-first styling
- **Vitest**: Unit testing framework
- **SVG**: Vector graphics

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

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── AmountPopup.tsx  # Calculator popup
│   │   ├── Gauge.tsx        # SVG gauge component
│   │   ├── TableSection.tsx # Data table component
│   │   ├── DashboardLights.tsx # Status lights
│   │   └── InputPanel.tsx   # Main input section
│   ├── utils/
│   │   ├── calculations.ts  # Core calculation logic
│   │   └── validation.ts    # Validation utilities
│   ├── tests/
│   │   └── calculations.test.ts # Unit tests
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
Grid-based layout (10×7) with gauges:
- **Savings**: Financial cushion
- **Retirement**: Long-term retirement funds
- **Medical**: HSA/FSA funds
- **Income**: Net income after debts
- **Home**: Home-related funds
- **Car**: Vehicle-related funds
- **School**: Education funds
- **Vacation**: Travel funds
- **Other Gauge 1 & 2**: Additional allocations
- **Dashboard Lights**: Status indicators

### Calculation Engine

#### Tier-Based Allocation
The system uses tier-based allocation for fuel distribution:

- **Tier ≥ $50,000**: All gauges funded
- **Tier > $40,000**: All except overflow to Other Gauge 2
- **Tier > $30,000**: All except overflow to Other Gauge 1
- **Tier > $25,000**: All except overflow to Vacation
- **Tier > $20,000**: All except overflow to Car
- **Tier > $10,000**: All except overflow to Home
- **Tier ≤ $10,000**: Savings only

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
- **Color Coding**:
  - Red: Low values (< 50%)
  - Yellow: Medium values (50-80%)
  - Green: High values (> 80%)

## Performance

- **No external API calls**: All calculations are local
- **No persistence**: Fresh state on reload (as designed)
- **Optimized rendering**: React component memoization
- **Minimal dependencies**: Lightweight bundle

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Responsive design supports mobile and desktop

## License

This project is part of a financial dashboard application suite.

## Future Enhancements

- Export/Import functionality (CSV, JSON)
- Multiple dashboard presets
- Additional gauge customization
- Advanced reporting features
