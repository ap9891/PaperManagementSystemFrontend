import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../Alert/Alert';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Clear any existing tokens
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    useEffect(() => {
        // Check if user is already logged in
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setAlert(null);
    
        try {
            const response = await fetch('http://localhost:9090/api/auth/login', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    email: email.trim(), 
                    password: password 
                }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }
    
            // Store token and user info securely
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ 
                email: data.email,
                loggedInAt: new Date().toISOString()
            }));
            
            // Show success alert
            setAlert({
                type: 'success',
                message: 'Login successful! Redirecting to dashboard...'
            });
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Login error:', error);
            // Show error alert
            setAlert({
                type: 'error',
                message: error.message || 'Login failed. Please try again.'
            });
        }
    };

    const handleAlertClose = () => {
        setAlert(null);
    };

    return (
        <div className="login-container">
            {alert && (
                <Alert 
                    type={alert.type} 
                    message={alert.message} 
                    onClose={handleAlertClose}
                    duration={3000}
                />
            )}

            <h2 className="login-title">Login</h2>
            <form onSubmit={handleLogin}>
                <label className="login-label">Email</label>
                <input
                    type="email"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label className="login-label password-button">Password</label>
                <input
                    type="password"
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="login-button">Login</button>
            </form>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>
                    Test credentials:<br/>
                    Email: admin@example.com<br/>
                    Password: admin123
                </p>
            </div>
            <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
        </div>
    );
};

export default Login;