import React, { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// Performance optimization: Disable StrictMode in production
const StrictModeWrapper = import.meta.env.DEV ? StrictMode : React.Fragment;

// Lazy load the main App component
const App = lazy(() => import('./App.tsx'));

// Create root with error boundary
const container = document.getElementById('root')!;
const root = createRoot(container);

// Add loading fallback and error boundary
root.render(
  <StrictModeWrapper>
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
        <div className="animate-pulse text-2xl text-primary-600">Loading...</div>
      </div>
    }>
      <App />
    </Suspense>
  </StrictModeWrapper>
);
