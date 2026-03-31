import React, { useState } from 'react';
import { TableSection, TableRow } from './TableSection';

interface InputPanelProps {
  fuelRows: TableRow[];
  incomeRows: TableRow[];
  debtsRows: TableRow[];
  onFuelChange: (rows: TableRow[]) => void;
  onIncomeChange: (rows: TableRow[]) => void;
  onDebtsChange: (rows: TableRow[]) => void;
  onFuelAddClick?: () => void;
  onIncomeAddClick?: () => void;
  onDebtsAddClick?: () => void;
  showFuelWarning?: boolean;
  showIncomeWarning?: boolean;
  showDebtsWarning?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  fuelRows,
  incomeRows,
  debtsRows,
  onFuelChange,
  onIncomeChange,
  onDebtsChange,
  onFuelAddClick,
  onIncomeAddClick,
  onDebtsAddClick,
  showFuelWarning = false,
  showIncomeWarning = false,
  showDebtsWarning = false,
  isExpanded = false,
  onToggleExpand,
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    fuel: false,
    income: false,
    debts: false,
  });

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const addFuelRow = () => {
    onFuelAddClick?.();
  };

  const addIncomeRow = () => {
    onIncomeAddClick?.();
  };

  const addDebtsRow = () => {
    onDebtsAddClick?.();
  };

  const deleteFuelRow = (id: string) => {
    onFuelChange(fuelRows.filter(row => row.id !== id));
  };

  const deleteIncomeRow = (id: string) => {
    onIncomeChange(incomeRows.filter(row => row.id !== id));
  };

  const deleteDebtsRow = (id: string) => {
    onDebtsChange(debtsRows.filter(row => row.id !== id));
  };

  const updateFuelRow = (id: string, field: string, value: any) => {
    onFuelChange(
      fuelRows.map(row =>
        row.id === id
          ? field === 'source'
            ? { ...row, [field]: value, type: '' }
            : { ...row, [field]: value }
          : row
      )
    );
  };

  const updateIncomeRow = (id: string, field: string, value: any) => {
    onIncomeChange(
      incomeRows.map(row =>
        row.id === id
          ? field === 'source'
            ? { ...row, [field]: value, type: '' }
            : { ...row, [field]: value }
          : row
      )
    );
  };

  const updateDebtsRow = (id: string, field: string, value: any) => {
    onDebtsChange(
      debtsRows.map(row =>
        row.id === id
          ? field === 'amount'
            ? { ...row, [field]: value > 0 ? -value : value }
            : field === 'source'
            ? { ...row, [field]: value, type: '' }
            : { ...row, [field]: value }
          : row
      )
    );
  };

  const bankTypes = ['Checking', 'Savings', 'Money Market', 'CD'];
  const investmentTypes = [
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

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100">Financial Input</h2>
        <button
          onClick={onToggleExpand}
          className="bg-gray-800 hover:bg-gray-700 text-gray-100 px-3 py-1 rounded border border-gray-600 text-sm font-medium transition-colors"
          title={isExpanded ? 'Contract panel' : 'Expand panel'}
        >
          {isExpanded ? '⊖' : '⊕'}
        </button>
      </div>

      <TableSection
        title="Financial Fuel"
        rows={fuelRows}
        columns={['source', 'type', 'amount', 'notes']}
        sourceOptions={['Bank', 'Investment', 'Other']}
        typeOptions={{
          Bank: bankTypes,
          Investment: investmentTypes,
        }}
        onAddRow={addFuelRow}
        onDeleteRow={deleteFuelRow}
        onUpdateRow={updateFuelRow}
        defaultAmountNegative={true}
        showWarning={showFuelWarning}
        isCollapsed={collapsedSections.fuel}
        onToggleCollapse={() => toggleSection('fuel')}
      />

      <TableSection
        title="Income"
        rows={incomeRows}
        columns={['amount', 'notes']}
        onAddRow={addIncomeRow}
        onDeleteRow={deleteIncomeRow}
        onUpdateRow={updateIncomeRow}
        defaultAmountNegative={false}
        showWarning={showIncomeWarning}
        isCollapsed={collapsedSections.income}
        onToggleCollapse={() => toggleSection('income')}
      />

      <TableSection
        title="Debts"
        rows={debtsRows}
        columns={['amount', 'notes']}
        onAddRow={addDebtsRow}
        onDeleteRow={deleteDebtsRow}
        onUpdateRow={updateDebtsRow}
        defaultAmountNegative={true}
        showWarning={showDebtsWarning}
        isCollapsed={collapsedSections.debts}
        onToggleCollapse={() => toggleSection('debts')}
      />
    </div>
  );
};
