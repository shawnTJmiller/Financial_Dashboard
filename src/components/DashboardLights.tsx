import React from 'react';
import '@fortawesome/fontawesome-free/css/all.css';

interface DashboardLightsProps {
  lights: {
    label: string;
    color: string;
    visible: boolean;
    shouldFlash?: boolean;
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

const savingsToolTipText = "Savings is your rainy day fund.  It is\nimportant to have between 3-6 months\nof wages saved up.  Keeping around\n$10,000 for most incidents is safe.";
const retirementToolTipText = "Retirement investments are crucial for\nyour financial future.  Contributing to\na 401(k) or IRA will help you in life\nafter work.";
const medicalToolTipText = "Medical savings can help cover unexpected\nhealthcare costs.  Consider opening an HSA\nfor tax advantages or track your FSA savings\nhere.";
const incomeToolTipText = "Income represents your regular earnings.\nKeep track of all income and debts to\nunderstand your financial picture.";
const homeToolTipText = "After you have saved your emergency fund,\nstart saving for your home.  These funds can\nbe used towards a down payment, updates,\nor much needed repairs.";
const carToolTipText = "Now that your home is covered for emergency\nexpenses, you can start putting aside funds for\nyour next vehicle or for unexpected repairs.";
const schoolToolTipText = "School investments can help fund your\nchild's education.  Consider 529 plans or\nother education savings options.";
const vacationToolTipText = "This fills after your savings, home and\ncar funds have been taken care of.\nSaving up for a vacation rewards you\nfor all of the hard work you put in to\nget to this point.";
const other1ToolTipText = "When you start filling this it means\nyou have a lot of your bases covered.\nUse this fund for special projects or\nkeep building up your savings.";
const other2ToolTipText = "When you start filling this it means you\nhave not only your bases covered but\nalso extra funds available.  After this is\nfilled all future monies go toward your\nSavings!  GREAT JOB!!!";

// Map gauge labels to custom tooltip text
const tooltipMap: Record<string, string> = {
  'Savings': savingsToolTipText,
  'Retirement': retirementToolTipText,
  'Medical': medicalToolTipText,
  'Income': incomeToolTipText,
  'Home': homeToolTipText,
  'Car': carToolTipText,
  'School': schoolToolTipText,
  'Vacation': vacationToolTipText,
  'Other 1': other1ToolTipText,
  'Other 2': other2ToolTipText,
};

const flashingStyle = `
  @keyframes flashRed {
    0%, 100% {
      color: #404040;
    }
    50% {
      color: #ef4444;
    }
  }
  
  .flashing-icon {
    animation: flashRed 1s infinite;
  }
`;

export const DashboardLights: React.FC<DashboardLightsProps> = ({ lights }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <style>{flashingStyle}</style>
      <h3 className="text-lg font-bold text-gray-100 mb-4">Status Lights</h3>
      <div className="grid grid-cols-5 gap-3">
        {lights.map((light, idx) => {
          const iconClass = iconMap[light.label] || 'fa-circle';
          const isFlashing = light.shouldFlash && light.visible;
          const tooltipText = tooltipMap[light.label] || light.label;
          
          return (
            <div key={idx} className="flex flex-col items-center" title={tooltipText}>
              <i
                className={`fa ${iconClass} text-2xl ${isFlashing ? 'flashing-icon' : ''}`}
                style={{
                  color: !isFlashing && light.visible ? light.color : isFlashing ? undefined : '#404040',
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
