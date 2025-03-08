import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface AuthResponse {
    token: string;
    email?: string;
}

interface OTPResponse {
    token: string;
}

const Login: React.FC = () => {
    const { login, skipLogin } = useAuth();
    const [authMethod, setAuthMethod] = useState<'google' | 'phone' | null>(null);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [identifier, setIdentifier] = useState('');

    const handleGoogleSuccess = async (response: any) => {
        try {
            setLoading(true);
            setError('');
            const { data } = await axios.post<AuthResponse>('http://localhost:5000/api/auth/google', {
                token: response.credential
            });
            await login(data.token);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to authenticate with Google');
            console.error('Google auth error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.match(/^\+?[1-9]\d{1,14}$/)) {
            setError('Please enter a valid phone number');
            return;
        }
        try {
            setLoading(true);
            setError('');
            await axios.post('http://localhost:5000/api/auth/send-otp', { phone });
            setIdentifier(phone);
            setAuthMethod('phone');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send OTP');
            console.error('Phone auth error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOTPVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp.match(/^\d{6}$/)) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }
        try {
            setLoading(true);
            setError('');
            const { data } = await axios.post<OTPResponse>('http://localhost:5000/api/auth/verify-otp', {
                identifier,
                otp
            });
            await login(data.token);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid OTP');
            console.error('OTP verification error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        skipLogin();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
            <div className="w-full max-w-md">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-lg shadow-xl"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-blue-900 mb-2">Welcome to Echelon</h1>
                        <p className="text-gray-600">Your gateway to skill development</p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-50 text-red-700 p-3 rounded-md mb-4"
                        >
                            {error}
                        </motion.div>
                    )}

                    <AnimatePresence mode="wait">
                        {!authMethod && (
                            <motion.div
                                key="auth-methods"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <div className="w-full">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => setError('Google authentication failed')}
                                        theme="outline"
                                        size="large"
                                        width="100%"
                                        useOneTap
                                    />
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                    </div>
                                </div>
                                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="+1 (555) 000-0000"
                                            pattern="^\+?[1-9]\d{1,14}$"
                                            required
                                        />
                                        <p className="mt-1 text-sm text-gray-500">Format: +1234567890</p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            'Continue with Phone'
                                        )}
                                    </button>
                                </form>

                                <div className="relative pt-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Or</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSkip}
                                    className="w-full text-center py-2 text-sm text-gray-600 hover:text-gray-900 underline"
                                >
                                    Skip login and explore as guest
                                </button>
                            </motion.div>
                        )}

                        {authMethod === 'phone' && (
                            <motion.form
                                key="otp-form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleOTPVerify}
                                className="space-y-4"
                            >
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                        Enter OTP
                                    </label>
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter 6-digit code"
                                        pattern="\d{6}"
                                        maxLength={6}
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">Enter the 6-digit code sent to your phone</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        'Verify OTP'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAuthMethod(null)}
                                    className="w-full text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Back to login options
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
