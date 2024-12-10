import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios'; 
import './PaperPurchase.css';
import Alert from '../Alert/Alert';

axios.defaults.baseURL = 'http://localhost:9090';

const PaperPurchaseModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('new');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    reelNumber: '',
    paperName: '',
    quantity: '',
    millName: '',
    shade: '',
    ratePerKg: '',
    price: '',
    remark: ''
  });

  // State for master data and history
  const [paperMasterData, setPaperMasterData] = useState([]);
  const [millMasterData, setMillMasterData] = useState([]);
  const [shadeMasterData, setShadeMasterData] = useState([]);
  const [history, setHistory] = useState([]);
  const [alert, setAlert] = useState(null);

  // Fetch master data on component mount
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [paperResponse, millResponse, shadeResponse] = await Promise.all([
          axios.get('/api/master-data/paper-names'),
          axios.get('/api/master-data/mill-names'),
          axios.get('/api/master-data/shades')
        ]);

        setPaperMasterData(paperResponse.data);
        setMillMasterData(millResponse.data);
        setShadeMasterData(shadeResponse.data);
      } catch (error) {
        console.error('Error fetching master data:', error);
        setAlert({
          type: 'error',
          message: 'Failed to load master data'
        });
      }
    };

    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get('/api/paper-purchases');
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching purchase history:', error);
        setAlert({
          type: 'error',
          message: 'Failed to load purchase history'
        });
      }
    };

    if (isOpen) {
      fetchMasterData();
      fetchPurchaseHistory();
    }
  }, [isOpen]);

  // Generate Reel Number
  const generateReelNumber = useCallback(async () => {
    try {
      const response = await axios.get('/api/paper-purchases/generate-reel-number');
      return response.data;
    } catch (error) {
      console.error('Error generating reel number:', error);
      alert('Failed to generate reel number');      setAlert({
        type: 'error',
        message: 'Failed to generate reel number'
      });
      return '';
    }
  }, []);

  // Update useEffect for reel number generation
  useEffect(() => {
    const fetchReelNumber = async () => {
      if (isOpen) {
        const reelNumber = await generateReelNumber();
        setFormData(prev => ({
          ...prev,
          date: new Date().toISOString().split('T')[0],
          reelNumber: reelNumber
        }));
      }
    };

    fetchReelNumber();
  }, [isOpen, generateReelNumber]);

  const calculatePrice = (quantity, rate) => {
    return quantity && rate ? (parseFloat(quantity) * parseFloat(rate)).toFixed(2) : '';
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'quantity' || field === 'ratePerKg') {
        newData.price = calculatePrice(
          field === 'quantity' ? value : prev.quantity,
          field === 'ratePerKg' ? value : prev.ratePerKg
        );
      }
      
      return newData;
    });
  };

  const validateForm = () => {
    if (!formData.paperName || !formData.quantity || !formData.millName || 
        !formData.shade || !formData.ratePerKg) {
      setAlert({
        type: 'warning',
        message: "Please fill all required fields"
      });
      return false;
    }
    
    if (parseInt(formData.quantity) < 1 || parseInt(formData.quantity) > 2000) {
      setAlert({
        type: 'warning',
        message: "Quantity must be between 1 and 2000"
      });
      return false;
    }
    if (parseInt(formData.ratePerKg) < 1) {
      setAlert({
        type: 'warning',
        message: "RatePerKg must be at least 1"
      });
      return false;
    }
    
    return true;
  };

  const handleSave = async (saveAndNext = false) => {
    if (!validateForm()) return;

    try {
      // Submit the paper purchase
      const response = await axios.post('/api/paper-purchases', formData);
      const savedPurchase = response.data;

      // Update local history
      setHistory(prev => [savedPurchase, ...prev]);
      
      // Show success alert
      setAlert({
        type: 'success',
        message: "Paper purchase record saved successfully"
      });

      // Reset form based on save type
      if (saveAndNext) {
        const newReelNumber = await generateReelNumber();
        setFormData(prev => ({
          ...prev,
          reelNumber: newReelNumber,
          quantity: '',
          price: '',
          remark: ''
        }));
      } else {
        const newReelNumber = await generateReelNumber();
        setFormData({
          date: new Date().toISOString().split('T')[0],
          reelNumber: newReelNumber,
          paperName: '',
          quantity: '',
          millName: '',
          shade: '',
          ratePerKg: '',
          price: '',
          remark: ''
        });
      }
    } catch (error) {
      console.error('Error saving paper purchase:', error);
      setAlert({
        type: 'error',
        message: 'Failed to save paper purchase'
      });
    }
  };


  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
            {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}
      <div className="modal-content">
        <div>
          <button
            className="close-button"
            aria-label="Close modal"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="modal-header">
          <h2>Paper Purchase</h2>
        </div>

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'new' ? 'active' : ''}`}
            onClick={() => setActiveTab('new')}
          >
            New
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        {activeTab === 'new' ? (
          <div className="form-content">
            <div className="form-grid">
              {/* Date Field */}
              <div className="form-group">
                <label htmlFor="date">
                  Date<span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>

              {/* Reel Number Field */}
              <div className="form-group">
                <label htmlFor="reelNumber">Reel Number</label>
                <input type="text" id="reelNumber" value={formData.reelNumber} disabled />
              </div>

              {/* Paper Name Field */}
              <div className="form-group">
                <label htmlFor="paperName">
                  Paper Name<span className="required">*</span>
                </label>
                <select
                  id="paperName"
                  value={formData.paperName}
                  onChange={(e) => handleInputChange('paperName', e.target.value)}
                >
                  <option value="">Select paper</option>
                  {paperMasterData.map((paper) => (
                    <option key={paper} value={paper}>
                      {paper}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Field */}
              <div className="form-group">
                <label htmlFor="quantity">
                  Quantity (kg)<span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max="2000"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                />
              </div>

              {/* Mill Name Field */}
              <div className="form-group">
                <label htmlFor="millName">
                  Mill Name<span className="required">*</span>
                </label>
                <select
                  id="millName"
                  value={formData.millName}
                  onChange={(e) => handleInputChange('millName', e.target.value)}
                >
                  <option value="">Select mill</option>
                  {millMasterData.map((mill) => (
                    <option key={mill} value={mill}>
                      {mill}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shade Field */}
              <div className="form-group">
                <label htmlFor="shade">
                  Shade<span className="required">*</span>
                </label>
                <select
                  id="shade"
                  value={formData.shade}
                  onChange={(e) => handleInputChange('shade', e.target.value)}
                >
                  <option value="">Select shade</option>
                  {shadeMasterData.map((shade) => (
                    <option key={shade} value={shade}>
                      {shade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rate/kg Field */}
              <div className="form-group">
                <label htmlFor="ratePerKg">
                  Rate/kg (₹)<span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="ratePerKg"
                  step="0.01"
                  value={formData.ratePerKg}
                  onChange={(e) => handleInputChange('ratePerKg', e.target.value)}
                />
              </div>

              {/* Price Field */}
              <div className="form-group">
                <label htmlFor="price">Price (₹)</label>
                <input type="text" id="price" value={formData.price} disabled />
              </div>

              {/* Remark Field */}
              <div className="form-group full-width">
                <label htmlFor="remark">Remark</label>
                <input
                  type="text"
                  id="remark"
                  value={formData.remark}
                  onChange={(e) => handleInputChange('remark', e.target.value)}
                />
              </div>
            </div>

            <div className="button-group">
              <button className="button secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="button secondary" onClick={() => handleSave(false)}>
                Save
              </button>
              <button className="button primary" onClick={() => handleSave(true)}>
                Save & Next
              </button>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Reel Number</th>
                  <th>Paper Name</th>
                  <th>Quantity (kg)</th>
                  <th>Mill Name</th>
                  <th>Shade</th>
                  <th>Rate/kg (₹)</th>
                  <th>Price (₹)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id}>
                    <td>{entry.date}</td>
                    <td>{entry.reelNumber}</td>
                    <td>{entry.paperName}</td>
                    <td>{entry.quantity}</td>
                    <td>{entry.millName}</td>
                    <td>{entry.shade}</td>
                    <td>{entry.ratePerKg}</td>
                    <td>{entry.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperPurchaseModal;