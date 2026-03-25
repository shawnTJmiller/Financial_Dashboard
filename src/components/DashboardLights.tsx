import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';

interface DashboardLightsProps {
  lights: {
    label: string;
    color: string;
    visible: boolean;
  }[];
}

// Map gauge labels to Font Awesome icon names
const iconMap: Record<string, string> = {
  'Savings': 'fa-bank',
  'Retirement': 'fa-hourglass-2',
  'Medical': 'fa-heartbeat',
  'Income': 'fa-wallet',
  'Home': 'fa-home',
  'Car': 'fa-car',
  'School': 'fa-graduation-cap',
  'Vacation': 'fa-plane',
  'Other 1': 'fa-gift',
  'Other 2': 'fa-battery',
};

export const DashboardLights: React.FC<DashboardLightsProps> = ({ lights }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-bold text-gray-100 mb-4">Status Lights</h3>
      <div className="grid grid-cols-5 gap-3">
        {lights.map((light, idx) => {
          const iconClass = iconMap[light.label] || 'fa-circle';
          return (
            <div key={idx} className="flex flex-col items-center" title={light.label}>
              <i
                className={`fa ${iconClass} text-2xl`}
                style={{
                  color: light.visible ? light.color : '#404040',
                }}
              />
              <p className="text-xs text-gray-400 mt-2 text-center truncate w-full">{light.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
