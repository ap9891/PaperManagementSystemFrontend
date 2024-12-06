import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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
            
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            {error && (
                <div className="error-message" style={{
                    color: 'red',
                    marginBottom: '1rem',
                    padding: '0.5rem',
                    backgroundColor: '#ffebee',
                    borderRadius: '4px'
                }}>
                    {error}
                </div>
            )}
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