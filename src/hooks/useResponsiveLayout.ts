import { useState, useEffect } from 'react';

export type DeviceSize = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

export interface ViewportInfo {
  deviceSize: DeviceSize;
  orientation: Orientation;
  isMobile: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
}

/**
 * Hook to manage responsive viewport information
 * Breakpoints: mobile <= 768px, tablet 768px-1024px, desktop > 1024px
 */
export const useResponsiveLayout = (): ViewportInfo => {
  const [viewport, setViewport] = useState<ViewportInfo>({
    deviceSize: 'desktop',
    orientation: 'landscape',
    isMobile: false,
    isPortrait: false,
    isLandscape: true,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Determine device size
      const deviceSize: DeviceSize = width <= 768 ? 'mobile' : width <= 1024 ? 'tablet' : 'desktop';
      
      // Determine orientation
      const orientation: Orientation = height > width ? 'portrait' : 'landscape';
      
      setViewport({
        deviceSize,
        orientation,
        isMobile: deviceSize === 'mobile',
        isPortrait: orientation === 'portrait',
        isLandscape: orientation === 'landscape',
      });
    };

    // Set initial viewport
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return viewport;
};
