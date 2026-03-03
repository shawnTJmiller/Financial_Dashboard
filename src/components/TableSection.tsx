import React, { useState } from 'react';
import { AmountPopup } from './AmountPopup';
import { formatAmount } from '../utils/validation';

export interface TableRow {
  id: string;
  source: string;
  type?: string;
  amount: number;
  notes: string;
}

interface TableSectionProps {
  title: string;
  rows: TableRow[];
  columns: ('source' | 'type' | 'amount' | 'notes')[];
  sourceOptions?: string[];
  typeOptions?: Record<string, string[]>;
  onAddRow: () => void;
  onDeleteRow: (id: string) => void;
  onUpdateRow: (id: string, field: string, value: any) => void;
  defaultAmountNegative?: boolean;
  showWarning?: boolean;
  onWarningDismiss?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const TableSection: React.FC<TableSectionProps> = ({
  title,
  rows,
  columns,
  sourceOptions = [],
  typeOptions = {},
  onAddRow,
  onDeleteRow,
  onUpdateRow,
  defaultAmountNegative = false,
  showWarning = false,
  onWarningDismiss,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAmount, setEditingAmount] = useState<number>(0);

  const handleAmountClick = (id: string, currentAmount: number) => {
    setEditingId(id);
    setEditingAmount(currentAmount);
  };

  const handleAmountSave = (amount: number) => {
    if (editingId) {
      onUpdateRow(editingId, 'amount', amount);
      setEditingId(null);
    }
  };

  const handleSourceChange = (id: string, source: string) => {
    onUpdateRow(id, 'source', source);
    // Reset type when source changes
    onUpdateRow(id, 'type', '');
  };

  const getTypeOptions = (rowId: string): string[] => {
    const row = rows.find(r => r.id === rowId);
    if (row && row.source && typeOptions[row.source]) {
      return typeOptions[row.source];
    }
    return [];
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-100">{title}</h3>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="text-gray-400 hover:text-gray-200 text-sm"
            >
              {isCollapsed ? '▶' : '▼'}
            </button>
          )}
        </div>
        <button
          onClick={onAddRow}
          className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          + Add
        </button>
      </div>

      {showWarning && (
        <div className="bg-yellow-900 border border-yellow-700 text-yellow-100 px-3 py-2 rounded mb-3 text-sm flex justify-between items-center">
          <span>Cannot add row while default row exists. Edit the existing row first.</span>
          {onWarningDismiss && (
            <button
              onClick={onWarningDismiss}
              className="text-yellow-100 hover:text-yellow-200 ml-2"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {!isCollapsed && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-300">
            <thead>
              <tr className="border-b border-gray-700">
                {columns.map(col => (
                  <th key={col} className="text-left py-2 px-2 font-semibold text-gray-400 capitalize">
                    {col === 'amount' ? 'Amount' : col}
                  </th>
                ))}
                <th className="text-left py-2 px-2 font-semibold text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className="border-b border-gray-700 hover:bg-gray-700">
                  {columns.map(col => (
                    <td key={`${row.id}-${col}`} className="py-2 px-2">
                      {col === 'source' && sourceOptions.length > 0 ? (
                        <select
                          value={row.source || ''}
                          onChange={e => handleSourceChange(row.id, e.target.value)}
                          className="bg-gray-700 text-gray-100 px-2 py-1 rounded text-sm w-full"
                        >
                          <option value="">Select One</option>
                          {sourceOptions.map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : col === 'type' && row.source ? (
                        <select
                          value={row.type || ''}
                          onChange={e => onUpdateRow(row.id, 'type', e.target.value)}
                          className="bg-gray-700 text-gray-100 px-2 py-1 rounded text-sm w-full"
                        >
                          <option value="">Select Type</option>
                          {getTypeOptions(row.id).map(opt => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : col === 'amount' ? (
                        <button
                          onClick={() => handleAmountClick(row.id, row.amount)}
                          className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-2 py-1 rounded text-sm font-mono w-full text-right"
                        >
                          {formatAmount(row.amount)}
                        </button>
                      ) : col === 'notes' ? (
                        <input
                          type="text"
                          value={row.notes}
                          onChange={e => onUpdateRow(row.id, 'notes', e.target.value)}
                          placeholder="Notes..."
                          className="bg-gray-700 text-gray-100 px-2 py-1 rounded text-sm w-full"
                        />
                      ) : (
                        <span className="text-gray-400">{row[col as keyof TableRow]}</span>
                      )}
                    </td>
                  ))}
                  <td className="py-2 px-2">
                    <button
                      onClick={() => onDeleteRow(row.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId && (
        <AmountPopup
          initialValue={editingAmount}
          onSave={handleAmountSave}
          onCancel={() => setEditingId(null)}
          allowNegative={defaultAmountNegative}
          title="Edit Amount"
        />
      )}
    </div>
  );
};
