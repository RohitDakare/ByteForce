import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import LoginScene from './LoginScene';

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    picture: string;
  };
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleGoogleSuccess = async (response: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const authResponse: AuthResponse = await authAPI.googleLogin(response.credential);
      const { token, user } = authResponse;
      
      // Store auth token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between p-8 gap-8">
        {/* 3D Scene */}
        <div className="w-full md:w-3/5 h-[400px] relative">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            gl={{ antialias: true }}
            className="rounded-lg shadow-xl bg-black/30"
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <LoginScene />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Canvas>
        </div>

        {/* Login Form */}
        <div className="w-full md:w-2/5 bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Welcome to Echelon
          </h1>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            {loading ? (
              <div className="flex items-center justify-center gap-2 text-white">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
              />
            )}
          </div>

          <p className="mt-8 text-gray-400 text-center text-sm">
            By logging in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
