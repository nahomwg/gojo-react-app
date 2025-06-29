import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Enhanced global error handler
window.addEventListener('error', (event) => {
  // Suppress browser extension and blocked resource errors
  const suppressedErrors = [
    'Extension context invalidated',
    'message channel closed',
    'listener indicated an asynchronous response',
    'runtime.lastError',
    'ERR_BLOCKED_BY_CLIENT',
    'Failed to load resource',
    'Non-Error promise rejection captured'
  ];

  const shouldSuppress = suppressedErrors.some(error => 
    event.message?.includes(error) || 
    event.filename?.includes('extension') ||
    event.error?.message?.includes(error)
  );

  if (shouldSuppress) {
    event.preventDefault();
    return false;
  }
});

// Enhanced promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  const suppressedErrors = [
    'Extension context invalidated',
    'message channel closed',
    'listener indicated an asynchronous response',
    'runtime.lastError',
    'ERR_BLOCKED_BY_CLIENT',
    'Failed to load resource'
  ];

  const shouldSuppress = suppressedErrors.some(error => 
    event.reason?.message?.includes(error) ||
    String(event.reason).includes(error)
  );

  if (shouldSuppress) {
    event.preventDefault();
    return false;
  }
});

// Enhanced console error suppression
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  const suppressedPatterns = [
    'Extension context invalidated',
    'message channel closed',
    'listener indicated an asynchronous response',
    'runtime.lastError',
    'ERR_BLOCKED_BY_CLIENT'
  ];

  const shouldSuppress = suppressedPatterns.some(pattern => 
    message.includes(pattern)
  );

  if (!shouldSuppress) {
    originalConsoleError.apply(console, args);
  }
};

// Network status monitoring
let isOnline = navigator.onLine;
window.addEventListener('online', () => {
  isOnline = true;
  console.log('Network: Back online');
});

window.addEventListener('offline', () => {
  isOnline = false;
  console.log('Network: Gone offline');
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData) {
        console.log('Performance metrics:', {
          loadTime: perfData.loadEventEnd - perfData.loadEventStart,
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          networkTime: perfData.responseEnd - perfData.requestStart
        });
      }
    }, 0);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);