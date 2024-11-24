import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import PaperMasterPage from './components/paper/paperMasterData';
import Dashboard from './components/dashboard/Dashboard';
import MillMasterPage from './components/mill/MillMaster';
import ShadeMasterPage from './components/shade/ShadeMaster';
import PaperMasterFind from './components/paper/findPaperMaster';
import PaperDashboard from './components/paperDasbhboard/paperDashboard';


//test connection
// import ConnectionTest from './components/ConnectionTest';

// function App() {
//     return (
//         <div>
//             <h1>Backend Connection Test</h1>
//             <ConnectionTest />
//         </div>
//     );
// }

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Login />} />

        {/* Dashboard and Feature Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/paper-master" element={<PaperMasterPage />} />
        <Route path="/mill-master" element={<MillMasterPage />} />
        <Route path="/shade-master" element={<ShadeMasterPage />} />
        <Route path="/master" element={<PaperMasterFind />} />
        <Route path="/paper-raw" element={<PaperDashboard/>}/>
        {/* <Route path="/paper-in" element={<PaperPurchaseModal/>}/> */}

        {/* <Route path="/paper-stock" element={<PaperStock />} />
        <Route path="/fg-raw-stock" element={<FGRawStock />} />
        <Route path="/paper-in" element={<PaperIn />} />
        <Route path="/paper-out" element={<PaperOut />} /> */}
      </Routes>
    </Router>
  );
};

export default App;

