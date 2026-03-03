import React, { useState, useEffect } from 'react';
import { validateAmount, formatAmount, parseAmount } from '../utils/validation';

interface AmountPopupProps {
  initialValue: number;
  onSave: (amount: number) => void;
  onCancel: () => void;
  allowNegative?: boolean;
  title?: string;
}

export const AmountPopup: React.FC<AmountPopupProps> = ({
  initialValue,
  onSave,
  onCancel,
  allowNegative = false,
  title = 'Enter Amount',
}) => {
  const [display, setDisplay] = useState<string>(formatAmount(initialValue).replace('.00', '') || '0');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      } else if (e.key === 'Enter') {
        handleSave();
      } else if (/\d/.test(e.key) || e.key === '.' || e.key === '-' || e.key === 'Backspace') {
        // Allow number keys, decimal, minus, backspace
      } else {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display]);

  const handleNumberClick = (num: string) => {
    setError('');
    let newDisplay = display;

    if (num === 'C') {
      newDisplay = '0';
    } else if (num === '⌫') {
      newDisplay = display.slice(0, -1) || '0';
    } else if (num === '+/-') {
      newDisplay = display.startsWith('-') ? display.slice(1) : '-' + display;
    } else if (num === '.') {
      if (!newDisplay.includes('.')) {
        newDisplay = newDisplay + '.';
      }
    } else {
      if (newDisplay === '0' && num !== '.') {
        newDisplay = num;
      } else {
        newDisplay = newDisplay + num;
      }
    }

    const validation = validateAmount(newDisplay);
    if (validation.valid) {
      setDisplay(newDisplay);
    } else {
      setError(validation.error || 'Invalid input');
    }
  };

  const handleSave = () => {
    const parsed = parseAmount(display);
    if (!allowNegative && parsed < 0) {
      setError('Negative values not allowed');
      return;
    }
    onSave(parsed);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg shadow-2xl w-80 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-100">{title}</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="bg-gray-800 p-4 rounded mb-4 text-right">
          <div className="text-2xl font-mono text-gray-100 break-words">
            {display}
          </div>
          {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {['7', '8', '9', '⌫'].map(btn => (
            <button
              key={btn}
              onClick={() => handleNumberClick(btn)}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded"
            >
              {btn}
            </button>
          ))}
          {['4', '5', '6', 'C'].map(btn => (
            <button
              key={btn}
              onClick={() => handleNumberClick(btn)}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded"
            >
              {btn}
            </button>
          ))}
          {['1', '2', '3', '.'].map(btn => (
            <button
              key={btn}
              onClick={() => handleNumberClick(btn)}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded"
            >
              {btn}
            </button>
          ))}
          <button
            onClick={() => handleNumberClick('0')}
            className="col-span-2 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded"
          >
            0
          </button>
          <button
            onClick={() => handleNumberClick('+/-')}
            className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded"
          >
            +/-
          </button>
          <button
            onClick={handleSave}
            className="bg-green-700 hover:bg-green-600 text-white font-semibold py-2 rounded"
          >
            Enter
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-100 font-semibold py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-green-700 hover:bg-green-600 text-white font-semibold py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
