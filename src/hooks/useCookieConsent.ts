import { useState, useEffect } from 'react';

const COOKIE_NAME = 'financial_dashboard_consent';
const COOKIE_EXPIRY_DAYS = 365;

export interface CookieConsent {
  functional: boolean;
  timestamp: number;
}

/**
 * Hook to manage cookie consent
 * Stores user's consent preference in browser cookies
 */
export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load consent from cookie on mount
  useEffect(() => {
    const savedConsent = getCookieConsent();
    setConsent(savedConsent);
    setIsLoaded(true);
  }, []);

  const setCookieConsent = (functional: boolean) => {
    const consentData: CookieConsent = {
      functional,
      timestamp: Date.now(),
    };

    // Save to cookie
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);
    
    document.cookie = `${COOKIE_NAME}=${JSON.stringify(consentData)}; expires=${expiryDate.toUTCString()}; path=/`;
    
    setConsent(consentData);
  };

  const hasPreviousConsent = () => {
    return consent !== null;
  };

  return {
    consent,
    isLoaded,
    setCookieConsent,
    hasPreviousConsent,
    isFunctionalEnabled: consent?.functional ?? false,
  };
};

/**
 * Helper function to get cookie consent from document.cookie
 */
function getCookieConsent(): CookieConsent | null {
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === COOKIE_NAME && value) {
      try {
        return JSON.parse(decodeURIComponent(value));
      } catch (e) {
        console.error('Failed to parse consent cookie', e);
        return null;
      }
    }
  }
  
  return null;
}
