import { useState, useCallback } from 'react';
import { TableRow } from '../components/TableSection';

const STORAGE_KEY = 'financial_dashboard_data';

export interface DashboardData {
  fuelRows: TableRow[];
  incomeRows: TableRow[];
  debtsRows: TableRow[];
  timestamp: number;
}

/**
 * Hook to manage dashboard data persistence in localStorage
 */
export const useDashboardStorage = () => {
  const [hasLoadedData, setHasLoadedData] = useState(false);

  /**
   * Load saved dashboard data from localStorage
   */
  const loadData = useCallback((): DashboardData | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load dashboard data from storage', e);
    }
    return null;
  }, []);

  /**
   * Save dashboard data to localStorage
   */
  const saveData = useCallback((data: Omit<DashboardData, 'timestamp'>) => {
    try {
      const dataWithTimestamp: DashboardData = {
        ...data,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataWithTimestamp));
    } catch (e) {
      console.error('Failed to save dashboard data to storage', e);
    }
  }, []);

  /**
   * Clear all saved dashboard data
   */
  const clearData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear dashboard data from storage', e);
    }
  }, []);

  return {
    loadData,
    saveData,
    clearData,
    hasLoadedData,
    setHasLoadedData,
  };
};
