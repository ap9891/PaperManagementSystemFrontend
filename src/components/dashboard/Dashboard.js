import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './dashboard.css';
const Dashboard = () => {
  const location = useLocation();
  
  if (location.pathname === '/login' || location.pathname === '/' || location.pathname === '/forgot-password') {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* <div>
        <Navigation/>
      </div> */}

      {/* Main Content Area */}
      <div className="main-content">
        {/* Date Display */}
        <div className="date-display">
          <div>
            {new Date().toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}
          </div>
        </div>

        {/* Title */}
        <h1 className="main-title">
          Fantasy Packaging Private Limited
        </h1>

        {/* Action Buttons Grid */}
        <div className="buttons-grid">
          <Link to="/paper-raw">
            Paper Raw Material
          </Link>

          <Link to="/polythene-raw">
            Polythene Raw Material
          </Link>

          <Link to="/disposable-plates">
            Disposable Plates
          </Link>

          <Link to="/store">
            Store
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
