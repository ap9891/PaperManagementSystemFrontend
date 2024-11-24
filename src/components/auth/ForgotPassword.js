/* eslint-disable no-unused-vars */
import { useState } from 'react';
import './ForgotPassword.css'
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
  
    const handleSendOTP = async () => {
      // API call to send OTP
      setStep(2);
    };
  
    const handleResetPassword = async () => {
      // API call to verify OTP and reset password
    };
  
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
          {step === 1 ? (
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
                className="w-full bg-blue-500 text-white p-2 rounded"
              >
                Send OTP
              </button>
            </div>
          ) : (
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
                className="w-full bg-blue-500 text-white p-2 rounded"
              >
                Reset Password
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default ForgotPassword;