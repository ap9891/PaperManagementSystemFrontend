import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  if (
    location.pathname === "/login" ||
    location.pathname === "/" ||
    location.pathname === "/forgot-password"
  ) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <nav className="navbar">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="space-x-4">
              <Link to="/logout" className="logout-dashboard">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:rotate-12 transition-transform"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="main-content">
        <div className="date-display">
          <div>
            {currentTime.toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
        <h1 className="main-title">Fantasy Packaging Private Limited</h1>
        <div className="buttons-grid">
          <Link to="/paper-raw">Paper Raw Material</Link>
          <Link to="/polythene-raw">Polythene Raw Material</Link>
          <Link to="/disposable-plates">Disposable Plates</Link>
          <Link to="/store">Store</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;