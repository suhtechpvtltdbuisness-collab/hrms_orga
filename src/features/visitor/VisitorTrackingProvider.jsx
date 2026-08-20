import { createContext, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { initTracking, trackPageView, trackEvent, linkUserToVisitor, getVisitorId } from './visitorTracking.js';

const VisitorContext = createContext(null);

export function VisitorTrackingProvider({ children }) {
  const location = useLocation();
  const initialised = useRef(false);

  useEffect(() => {
    if (!initialised.current) {
      initialised.current = true;
      initTracking();
    }
  }, []);

  useEffect(() => {
    trackPageView(window.location.href);
  }, [location.pathname, location.search]);

  return (
    <VisitorContext.Provider value={{ trackEvent, linkUserToVisitor, getVisitorId }}>
      {children}
    </VisitorContext.Provider>
  );
}

export function useVisitorTracking() {
  const ctx = useContext(VisitorContext);
  if (!ctx) {
    // Return no-op when used outside provider (graceful degradation)
    return {
      trackEvent: () => {},
      linkUserToVisitor: async () => {},
      getVisitorId: () => null,
    };
  }
  return ctx;
}
