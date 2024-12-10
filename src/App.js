import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './components/dashboard/Dashboard';
import PaperMasterPage from './components/paper/paperMasterData';
import MillMasterPage from './components/mill/MillMaster';
import ShadeMasterPage from './components/shade/ShadeMaster';
import PaperMasterFind from './components/paper/findPaperMaster';
import PaperDashboard from './components/paperDasbhboard/paperDashboard';
import Logout from './components/auth/Logout';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/paper-master" element={<PaperMasterPage />} />
          <Route path="/mill-master" element={<MillMasterPage />} />
          <Route path="/shade-master" element={<ShadeMasterPage />} />
          <Route path="/master" element={<PaperMasterFind />} />
          <Route path="/paper-raw" element={<PaperDashboard/>}/>
          <Route path="/logout" element={<Logout />} />
        </Route>

        {/* Optional: Add a catch-all 404 route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;