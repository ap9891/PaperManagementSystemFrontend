import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear authentication tokens and user info
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login page
        navigate('/login');
    }, [navigate]);

    return <div>Logging out...</div>;
};

export default Logout;