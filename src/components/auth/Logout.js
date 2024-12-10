import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../Alert/Alert';

const Logout = () => {
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        // Clear authentication tokens and user info
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login page after a short delay
        const timer = setTimeout(() => {
            navigate('/login');
        }, 3000);

        // Cleanup the timer if component unmounts
        return () => clearTimeout(timer);
    }, [navigate]);

    const handleAlertClose = () => {
        setShowAlert(false);
    };

    return (
        <>
            {showAlert && (
                <Alert 
                    type="success" 
                    message="Logged out successfully" 
                    onClose={handleAlertClose}
                    duration={3000}
                />
            )}
            <div>Logging out...</div>
        </>
    );
};

export default Logout;