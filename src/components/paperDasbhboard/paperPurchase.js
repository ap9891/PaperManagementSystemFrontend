import React, { useState, useCallback, useEffect } from 'react';
import './PaperPurchase.css';

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

  const [history, setHistory] = useState([]);

  // Mock master data (replace with actual data from your backend)
  const paperMasterData = ['30/120/16', '32/140/18', '28/100/14'];
  const millMasterData = ['Mill A', 'Mill B', 'Mill C'];
  const shadeMasterData = ['White', 'Brown', 'Black'];

  // Generate Reel Number using useCallback
  const generateReelNumber = useCallback(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const financialYear = currentMonth > 3 ? currentYear : currentYear - 1;
    const prefix = String.fromCharCode(65 + (financialYear % 26));
    const number = history.length + 1;
    return `${prefix}-${number}`;
  }, [history.length]);

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0],
        reelNumber: generateReelNumber()
      }));
    }
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
      alert("Please fill all required fields");
      return false;
    }
    
    if (parseInt(formData.quantity) < 1 || parseInt(formData.quantity) > 2000) {
      alert("Quantity must be between 1 and 2000");
      return false;
    }
    
    return true;
  };

  const handleSave = (saveAndNext = false) => {
    if (!validateForm()) return;

    const newEntry = { ...formData, id: Date.now() };
    setHistory(prev => [newEntry, ...prev]);
    alert("Paper purchase record saved successfully");

    if (saveAndNext) {
      setFormData(prev => ({
        ...prev,
        reelNumber: generateReelNumber(),
        quantity: '',
        price: '',
        remark: ''
      }));
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        reelNumber: generateReelNumber(),
        paperName: '',
        quantity: '',
        millName: '',
        shade: '',
        ratePerKg: '',
        price: '',
        remark: ''
      });
    }
  };

  if (!isOpen) return null;

  return (
<div className="modal-overlay">
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
      {/* <button
        className="close-button"
        aria-label="Close modal"
        onClick={onClose}
      >
        &times;
      </button> */}
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