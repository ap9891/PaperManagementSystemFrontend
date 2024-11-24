// Navigation.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

const NavigationPaper = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="space-x-4">
            <Link
              to="/paper-raw"
              className={`${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              Paper Dashboard
            </Link>
            <Link
              to="/master"
              className={`${location.pathname === '/master' ? 'active' : ''}`}
            >
              Paper Master
            </Link>
            <Link
              to="/mill-master"
              className={`${location.pathname === '/mill-master' ? 'active' : ''}`}
            >
              Mill Master
            </Link>
            <Link
              to="/shade-master"
              className={`${location.pathname === '/shade-master' ? 'active' : ''}`}
            >
              Shade Master
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationPaper;