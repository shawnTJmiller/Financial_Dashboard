import React, { useState, useEffect } from 'react';
import { InputPanel } from './components/InputPanel';
import { Gauge } from './components/Gauge';
import { DashboardLights } from './components/DashboardLights';
import { ConsentBanner } from './components/ConsentBanner';
import { TableRow } from './components/TableSection';
import {
  calculateAllGauges,
  getGaugeVisibility,
  getLightColor,
  getIncomeColor,
  getShouldFlash,
  GaugeValues,
} from './utils/calculations';
import { hasDefaultNewRow } from './utils/validation';
import { useCookieConsent } from './hooks/useCookieConsent';
import { useDashboardStorage } from './hooks/useDashboardStorage';

export default function App() {
  // Hooks for consent and storage management
  const { isLoaded: consentLoaded, setCookieConsent, hasPreviousConsent, isFunctionalEnabled } = useCookieConsent();
  const { loadData, saveData, hasLoadedData, setHasLoadedData } = useDashboardStorage();

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

  const [isInputPanelExpanded, setIsInputPanelExpanded] = useState(false);
  const [showFuelWarning, setShowFuelWarning] = useState(false);
  const [showIncomeWarning, setShowIncomeWarning] = useState(false);
  const [showDebtsWarning, setShowDebtsWarning] = useState(false);

  // Load saved data when consent is available and functional cookies are enabled
  useEffect(() => {
    if (consentLoaded && isFunctionalEnabled && !hasLoadedData) {
      const savedData = loadData();
      if (savedData) {
        setFuelRows(savedData.fuelRows);
        setIncomeRows(savedData.incomeRows);
        setDebtsRows(savedData.debtsRows);
        setHasLoadedData(true);
      }
    } else if (consentLoaded && !isFunctionalEnabled) {
      setHasLoadedData(true);
    }
  }, [consentLoaded, isFunctionalEnabled, loadData, hasLoadedData, setHasLoadedData]);

  // Auto-save data to localStorage whenever rows change (if consent given)
  useEffect(() => {
    if (isFunctionalEnabled && consentLoaded && hasLoadedData) {
      saveData({
        fuelRows,
        incomeRows,
        debtsRows,
      });
    }
  }, [fuelRows, incomeRows, debtsRows, isFunctionalEnabled, consentLoaded, hasLoadedData, saveData]);

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
  const dashboardLights = [
    {
      label: 'Savings',
      color: gaugeValues.savings >= 10000 ? '#22c55e' : getLightColor(gaugeValues.savings, 10000),
      visible: gaugeVisibility.savings,
      shouldFlash: getShouldFlash(gaugeValues.savings),
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
      color: getIncomeColor(gaugeValues.income),
      visible: gaugeVisibility.income,
      shouldFlash: getShouldFlash(gaugeValues.income),
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
    // When input panel is expanded, show it full screen
    if (isInputPanelExpanded) {
      return (
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
          isExpanded={isInputPanelExpanded}
          onToggleExpand={() => setIsInputPanelExpanded(!isInputPanelExpanded)}
        />
      );
    }

    // Default layout: input panel on left, output grid on right
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
            isExpanded={isInputPanelExpanded}
            onToggleExpand={() => setIsInputPanelExpanded(!isInputPanelExpanded)}
          />
        </div>
        <div className="flex-1 overflow-auto">
          <OutputGrid gaugeValues={gaugeValues} gaugeVisibility={gaugeVisibility} dashboardLights={dashboardLights} />
        </div>
      </div>
    );
  };

  const handleAcceptConsent = () => {
    setCookieConsent(true);
    setHasLoadedData(true);
    const savedData = loadData();
    if (savedData) {
      setFuelRows(savedData.fuelRows);
      setIncomeRows(savedData.incomeRows);
      setDebtsRows(savedData.debtsRows);
    }
  };

  const handleDeclineConsent = () => {
    setCookieConsent(false);
    setHasLoadedData(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-100">Financial Dashboard</h1>
      </div>

      {renderLayoutContent()}

      {/* Show consent banner if no previous consent has been given */}
      {consentLoaded && !hasPreviousConsent() && (
        <ConsentBanner onAccept={handleAcceptConsent} onDecline={handleDeclineConsent} />
      )}
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
