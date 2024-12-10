import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const BASE_URL = 'http://localhost:9090/api/auth';

    const handleSendOTP = async () => {
        // Validate email before sending
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/forgot-password`, { 
                email 
            });
            setStep(2);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        // Validate inputs
        if (!otp) {
            setError('OTP is required');
            return;
        }
        if (!newPassword || newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/reset-password`, {
                email,
                otp,
                newPassword
            });
            setStep(3);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <button
                            onClick={handleSendOTP}
                            disabled={loading}
                            className={`w-full p-2 rounded ${
                                loading ? 'bg-gray-400' : 'bg-blue-500 text-white'
                            }`}
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <button
                            onClick={handleResetPassword}
                            disabled={loading}
                            className={`w-full p-2 rounded ${
                                loading ? 'bg-gray-400' : 'bg-blue-500 text-white'
                            }`}
                        >
                            {loading ? 'Resetting Password...' : 'Reset Password'}
                        </button>
                    </div>
                );
            case 3:
                return (
                    <div className="text-center">
                        <h3 className="text-green-600 font-bold mb-4">
                            Password Reset Successfully
                        </h3>
                        <p>You can now log in with your new password.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        {error}
                    </div>
                )}
                {renderStep()}
            </div>
        </div>
    );
};

export default ForgotPassword;