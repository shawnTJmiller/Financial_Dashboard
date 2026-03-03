import React from 'react';

interface DashboardLightsProps {
  lights: {
    label: string;
    color: string;
    visible: boolean;
  }[];
}

export const DashboardLights: React.FC<DashboardLightsProps> = ({ lights }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h3 className="text-lg font-bold text-gray-100 mb-4">Status Lights</h3>
      <div className="grid grid-cols-5 gap-3">
        {lights.map((light, idx) => (
          <div key={idx} className="flex flex-col items-center" title={light.label}>
            <div
              className="w-8 h-8 rounded-full border-2 border-gray-600 shadow-lg"
              style={{
                backgroundColor: light.visible ? light.color : '#404040',
              }}
            />
            <p className="text-xs text-gray-400 mt-2 text-center truncate w-full">{light.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
