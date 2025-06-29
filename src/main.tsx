import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Global error handler to suppress browser extension errors
window.addEventListener('error', (event) => {
  // Suppress browser extension errors
  if (
    event.message?.includes('Extension context invalidated') ||
    event.message?.includes('message channel closed') ||
    event.message?.includes('listener indicated an asynchronous response') ||
    event.filename?.includes('extension')
  ) {
    event.preventDefault();
    return false;
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  // Suppress browser extension promise rejections
  if (
    event.reason?.message?.includes('Extension context invalidated') ||
    event.reason?.message?.includes('message channel closed') ||
    event.reason?.message?.includes('listener indicated an asynchronous response')
  ) {
    event.preventDefault();
    return false;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);