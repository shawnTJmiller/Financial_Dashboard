import React, { useState } from 'react';
import { InputPanel } from './components/InputPanel';
import { Gauge } from './components/Gauge';
import { DashboardLights } from './components/DashboardLights';
import { TableRow } from './components/TableSection';
import {
  calculateAllGauges,
  getGaugeVisibility,
  GaugeValues,
} from './utils/calculations';
import { hasDefaultNewRow } from './utils/validation';

export default function App() {
  const [fuelRows, setFuelRows] = useState<TableRow[]>([
    {
      id: '1',
      source: '',
      type: '',
      amount: 0,
      notes: '',
    },
  ]);

  const [incomeRows, setIncomeRows] = useState<TableRow[]>([
    {
      id: '2',
      source: '',
      type: '',
      amount: 0,
      notes: '',
    },
  ]);

  const [debtsRows, setDebtsRows] = useState<TableRow[]>([
    {
      id: '3',
      source: '',
      type: '',
      amount: 0,
      notes: '',
    },
  ]);

  const [panelPosition, setPanelPosition] = useState<'left' | 'top' | 'right' | 'bottom'>('left');
  const [showFuelWarning, setShowFuelWarning] = useState(false);
  const [showIncomeWarning, setShowIncomeWarning] = useState(false);
  const [showDebtsWarning, setShowDebtsWarning] = useState(false);

  // Convert rows to calculation format
  const fuelCalcRows = fuelRows.map(row => ({
    source: (row.source || '') as 'Bank' | 'Investment' | 'Other' | '',
    type: row.type || '',
    amount: row.amount,
    notes: row.notes,
  }));

  const incomeCalcRows = incomeRows.map(row => ({
    source: row.source,
    amount: row.amount,
    notes: row.notes,
  }));

  const debtsCalcRows = debtsRows.map(row => ({
    source: row.source,
    amount: row.amount,
    notes: row.notes,
  }));

  // Calculate gauge values
  const gaugeValues = calculateAllGauges(fuelCalcRows, incomeCalcRows, debtsCalcRows);
  const gaugeVisibility = getGaugeVisibility(gaugeValues);

  // Check warnings for default rows
  const handleFuelChange = (newRows: TableRow[]) => {
    // Clear warning when rows are updated (user edited a row)
    setShowFuelWarning(false);
    setFuelRows(newRows);
  };

  const handleIncomeChange = (newRows: TableRow[]) => {
    // Clear warning when rows are updated (user edited a row)
    setShowIncomeWarning(false);
    setIncomeRows(newRows);
  };

  const handleDebtsChange = (newRows: TableRow[]) => {
    // Clear warning when rows are updated (user edited a row)
    setShowDebtsWarning(false);
    setDebtsRows(newRows);
  };

  // Add row callbacks - only add if no default row exists, otherwise show warning
  const handleFuelAddClick = () => {
    if (hasDefaultNewRow(fuelRows)) {
      setShowFuelWarning(true);
      return;
    }
    setShowFuelWarning(false);
    setFuelRows([
      ...fuelRows,
      {
        id: Date.now().toString(),
        source: '',
        type: '',
        amount: 0,
        notes: '',
      },
    ]);
  };

  const handleIncomeAddClick = () => {
    if (hasDefaultNewRow(incomeRows)) {
      setShowIncomeWarning(true);
      return;
    }
    setShowIncomeWarning(false);
    setIncomeRows([
      ...incomeRows,
      {
        id: Date.now().toString(),
        source: '',
        type: '',
        amount: 0,
        notes: '',
      },
    ]);
  };

  const handleDebtsAddClick = () => {
    if (hasDefaultNewRow(debtsRows)) {
      setShowDebtsWarning(true);
      return;
    }
    setShowDebtsWarning(false);
    setDebtsRows([
      ...debtsRows,
      {
        id: Date.now().toString(),
        source: '',
        type: '',
        amount: 0,
        notes: '',
      },
    ]);
  };

  // Get needle colors for dashboard lights
  const getLightColor = (value: number, max: number): string => {
    const proportion = value / max;
    if (proportion < 0.5) {
      return '#ef4444'; // red
    } else if (proportion < 0.8) {
      return '#eab308'; // yellow
    }
    return '#22c55e'; // green
  };

  const dashboardLights = [
    {
      label: 'Savings',
      color: gaugeValues.savings >= 10000 ? '#22c55e' : getLightColor(gaugeValues.savings, 10000),
      visible: gaugeVisibility.savings,
      shouldFlash: gaugeValues.savings < 0,
    },
    {
      label: 'Retirement',
      color: getLightColor(gaugeValues.retirement, 1000000),
      visible: gaugeVisibility.retirement,
    },
    {
      label: 'Medical',
      color: getLightColor(gaugeValues.medical, 10000),
      visible: gaugeVisibility.medical,
    },
    {
      label: 'Income',
      color: gaugeValues.income >= 3000 ? '#22c55e' : gaugeValues.income >= 1500 ? '#eab308' : '#ef4444',
      visible: gaugeVisibility.income,
      shouldFlash: gaugeValues.income < 0,
    },
    {
      label: 'Home',
      color: getLightColor(gaugeValues.home, 10000),
      visible: gaugeVisibility.home,
    },
    {
      label: 'Car',
      color: getLightColor(gaugeValues.car, 5000),
      visible: gaugeVisibility.car,
    },
    {
      label: 'School',
      color: getLightColor(gaugeValues.school, 50000),
      visible: gaugeVisibility.school,
    },
    {
      label: 'Vacation',
      color: getLightColor(gaugeValues.vacation, 5000),
      visible: gaugeVisibility.vacation,
    },
    {
      label: 'Other 1',
      color: getLightColor(gaugeValues.otherGauge1, 10000),
      visible: gaugeVisibility.otherGauge1,
    },
    {
      label: 'Other 2',
      color: getLightColor(gaugeValues.otherGauge2, 10000),
      visible: gaugeVisibility.otherGauge2,
    },
  ];



  const renderLayoutContent = () => {
    if (panelPosition === 'left') {
      return (
        <div className="flex gap-4 h-full">
          <div className="w-96 flex-shrink-0">
            <InputPanel
              fuelRows={fuelRows}
              incomeRows={incomeRows}
              debtsRows={debtsRows}
              onFuelChange={handleFuelChange}
              onIncomeChange={handleIncomeChange}
              onDebtsChange={handleDebtsChange}
              onFuelAddClick={handleFuelAddClick}
              onIncomeAddClick={handleIncomeAddClick}
              onDebtsAddClick={handleDebtsAddClick}
              showFuelWarning={showFuelWarning}
              showIncomeWarning={showIncomeWarning}
              showDebtsWarning={showDebtsWarning}
            />
          </div>
          <div className="flex-1 overflow-auto">
            <OutputGrid gaugeValues={gaugeValues} gaugeVisibility={gaugeVisibility} dashboardLights={dashboardLights} />
          </div>
        </div>
      );
    }
    return (
      <div>
        <InputPanel
          fuelRows={fuelRows}
          incomeRows={incomeRows}
          debtsRows={debtsRows}
          onFuelChange={handleFuelChange}
          onIncomeChange={handleIncomeChange}
          onDebtsChange={handleDebtsChange}
          onFuelAddClick={handleFuelAddClick}
          onIncomeAddClick={handleIncomeAddClick}
          onDebtsAddClick={handleDebtsAddClick}
          showFuelWarning={showFuelWarning}
          showIncomeWarning={showIncomeWarning}
          showDebtsWarning={showDebtsWarning}
        />
        <div className="mt-4">
          <OutputGrid gaugeValues={gaugeValues} gaugeVisibility={gaugeVisibility} dashboardLights={dashboardLights} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-100">Financial Dashboard</h1>
        <select
          value={panelPosition}
          onChange={e => setPanelPosition(e.target.value as any)}
          className="bg-gray-800 text-gray-100 px-3 py-2 rounded border border-gray-700"
        >
          <option value="left">Panel Left</option>
          <option value="top">Panel Top</option>
          <option value="right">Panel Right</option>
          <option value="bottom">Panel Bottom</option>
        </select>
      </div>

      {renderLayoutContent()}
    </div>
  );
}

const OutputGrid: React.FC<{
  gaugeValues: GaugeValues;
  gaugeVisibility: Record<string, boolean>;
  dashboardLights: any[];
}> = ({ gaugeValues, gaugeVisibility, dashboardLights }) => {
  // Helper to convert grid position (1-70) to CSS grid row/col


  return (
    <div className="grid gap-4 p-4" style={{
      gridTemplateColumns: 'repeat(10, minmax(0, 1fr))',
      gridTemplateRows: 'auto auto auto auto auto auto auto',
    }}>
      {/* Savings Gauge (positions 1,2,11,12) */}
      <div style={{ gridColumn: '1 / span 2', gridRow: '1 / span 2' }}>
        <Gauge
          min={0}
          max={10000}
          value={gaugeValues.savings}
          label="Savings"
          visible={gaugeVisibility.savings}
          size={160}
        />
      </div>

      {/* Income Gauge (positions 13-16, 23-26, 33-36, 43-46) */}
      <div style={{ gridColumn: '3 / span 4', gridRow: '1 / span 4' }}>
        <Gauge
          min={-50000}
          max={100000}
          value={gaugeValues.income}
          label="Net Income"
          visible={gaugeVisibility.income}
          size={400}
        />
      </div>

      {/* Vacation Gauge (positions 9,10,19,20) */}
      <div style={{ gridColumn: '9 / span 2', gridRow: '1 / span 2' }}>
        <Gauge
          min={0}
          max={5000}
          value={gaugeValues.vacation}
          label="Vacation"
          visible={gaugeVisibility.vacation}
          size={160}
        />
      </div>

      {/* Retirement Gauge (positions 29,30,39,40) */}
      <div style={{ gridColumn: '9 / span 2', gridRow: '3 / span 2' }}>
        <Gauge
          min={0}
          max={1000000}
          value={gaugeValues.retirement}
          label="Retirement"
          visible={gaugeVisibility.retirement}
          size={160}
        />
      </div>

      {/* Home Gauge (positions 7,8,17,18) */}
      <div style={{ gridColumn: '7 / span 2', gridRow: '1 / span 2' }}>
        <Gauge
          min={0}
          max={10000}
          value={gaugeValues.home}
          label="Home"
          visible={gaugeVisibility.home}
          size={160}
        />
      </div>

      {/* Car Gauge (positions 27,28,37,38) */}
      <div style={{ gridColumn: '7 / span 2', gridRow: '3 / span 2' }}>
        <Gauge
          min={0}
          max={5000}
          value={gaugeValues.car}
          label="Car"
          visible={gaugeVisibility.car}
          size={160}
        />
      </div>

      {/* Medical Gauge (positions 47,48,57,58) */}
      <div style={{ gridColumn: '7 / span 2', gridRow: '5 / span 2' }}>
        <Gauge
          min={0}
          max={10000}
          value={gaugeValues.medical}
          label="Medical"
          visible={gaugeVisibility.medical}
          size={160}
        />
      </div>

      {/* School Gauge (positions 49,50,59,60) */}
      <div style={{ gridColumn: '9 / span 2', gridRow: '5 / span 2' }}>
        <Gauge
          min={0}
          max={50000}
          value={gaugeValues.school}
          label="School"
          visible={gaugeVisibility.school}
          size={160}
        />
      </div>

      {/* Other 1 Gauge (positions 21,22,31,32) */}
      <div style={{ gridColumn: '1 / span 2', gridRow: '3 / span 2' }}>
        <Gauge
          min={0}
          max={10000}
          value={gaugeValues.otherGauge1}
          label="Other 1"
          visible={gaugeVisibility.otherGauge1}
          size={160}
        />
      </div>

      {/* Other 2 Gauge (positions 41,42,51,52) */}
      <div style={{ gridColumn: '1 / span 2', gridRow: '5 / span 2' }}>
        <Gauge
          min={0}
          max={10000}
          value={gaugeValues.otherGauge2}
          label="Other 2"
          visible={gaugeVisibility.otherGauge2}
          size={160}
        />
      </div>

      {/* Dashboard Lights (positions 61-70) */}
      <div style={{ gridColumn: '1 / span 10', gridRow: '7 / span 1' }}>
        <DashboardLights lights={dashboardLights} />
      </div>
    </div>
  );
};
