import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageVisit } from '../lib/analytics';

/**
 * Hook to automatically track page visits when navigation occurs
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track the page visit
    void trackPageVisit(location.pathname).catch(() => {
      // Analytics failure must never interrupt routing or page rendering.
    });
  }, [location.pathname]);
}
