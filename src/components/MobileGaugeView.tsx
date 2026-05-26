import React from 'react';
import { Gauge } from './Gauge';
import { DashboardLights } from './DashboardLights';
import { GaugeValues } from '../utils/calculations';

interface MobileGaugeViewProps {
  selectedGaugeLabel: string;
  gaugeValues: GaugeValues;
  dashboardLights: any[];
  isPortrait: boolean;
  onLightSelect: (label: string) => void;
}

/**
 * Mobile gauge view component for displaying a single gauge with selectable lights
 * Supports both portrait and landscape orientations
 */
export const MobileGaugeView: React.FC<MobileGaugeViewProps> = ({
  selectedGaugeLabel,
  gaugeValues,
  dashboardLights,
  isPortrait,
  onLightSelect,
}) => {
  // Find the selected gauge's value
  const selectedValue = (gaugeValues as any)[
    selectedGaugeLabel === 'Income'
      ? 'income'
      : selectedGaugeLabel === 'Savings'
      ? 'savings'
      : selectedGaugeLabel === 'Retirement'
      ? 'retirement'
      : selectedGaugeLabel === 'Medical'
      ? 'medical'
      : selectedGaugeLabel === 'Home'
      ? 'home'
      : selectedGaugeLabel === 'Car'
      ? 'car'
      : selectedGaugeLabel === 'School'
      ? 'school'
      : selectedGaugeLabel === 'Vacation'
      ? 'vacation'
      : selectedGaugeLabel === 'Other 1'
      ? 'otherGauge1'
      : selectedGaugeLabel === 'Other 2'
      ? 'otherGauge2'
      : 'savings'
  ];

  if (isPortrait) {
    return (
      <div className="flex flex-col h-[100vh]">
        {/* Gauge - top 1/2 */}
        <div className="flex-1 flex items-center justify-center bg-gray-900 p-2">
          <Gauge
            min={0}
            max={10000}
            value={selectedValue}
            label={selectedGaugeLabel}
            visible={true}
            size={180}
          />
        </div>

        {/* Dashboard Lights - bottom 1/3 */}
        <div className="h-[33.33vh] bg-gray-800 p-2 overflow-auto">
          <DashboardLights
            lights={dashboardLights}
            selectedLabel={selectedGaugeLabel}
            onLightClick={onLightSelect}
            hideLabels={true}
          />
        </div>
      </div>
    );
  }

  // Landscape view
  return (
    <div className="flex h-[100vh]">
      {/* Gauge - left 2/3 */}
      <div className="w-[66.67vw] flex items-center justify-center bg-gray-900 p-2">
        <Gauge
          min={0}
          max={10000}
          value={selectedValue}
          label={selectedGaugeLabel}
          visible={true}
          size={240}
        />
      </div>

      {/* Dashboard Lights - right 1/4 */}
      <div className="w-[33.33vw] bg-gray-800 p-2 overflow-auto">
        <div className="grid grid-cols-2 gap-2">
          {dashboardLights.map((light, idx) => {
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
            
            const iconClass = iconMap[light.label] || 'fa-circle';

            const isFlashing = light.shouldFlash && light.visible;
            const isSelected = light.label === selectedGaugeLabel;
            const isActive = light.visible && !light.shouldFlash;

            return (
              <div
                key={idx}
                className={`flex flex-col items-center p-2 ${
                  isSelected ? 'border-2 border-white rounded-lg' : ''
                } ${isActive ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (isActive) {
                    onLightSelect(light.label);
                  }
                }}
              >
                <i
                  className={`fa ${iconClass} text-2xl ${isFlashing ? 'flashing-icon' : ''}`}
                  style={{
                    color: !isFlashing && light.visible ? light.color : isFlashing ? undefined : '#404040',
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Flashing animation style */}
      <style>{`
        @keyframes flashRed {
          0%, 100% { color: #404040; }
          50% { color: #ef4444; }
        }
        .flashing-icon { animation: flashRed 1s infinite; }
      `}</style>
    </div>
  );
};
