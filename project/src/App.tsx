import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { isAuthenticated, isSkipped } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated || isSkipped ? <Dashboard /> : <Login />}
    </div>
  );
};

const AppWrapper: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default AppWrapper;