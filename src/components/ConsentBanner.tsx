import React from 'react';

interface ConsentBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const ConsentBanner: React.FC<ConsentBannerProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-600 shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Cookie & Data Consent</h3>
            <p className="text-sm text-gray-300">
              We use functional cookies to save your financial dashboard data locally on your device. 
              This allows your input to persist when you revisit the site. We do not store any data on 
              external servers or use tracking cookies.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              By accepting, you consent to functional cookies for data persistence. 
              You can change this preference at any time.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={onDecline}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 px-4 py-2 rounded border border-gray-600 font-medium transition-colors"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition-colors"
            >
              Accept Functional Cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
