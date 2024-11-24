import React, { useState } from 'react';
import './paperOut.css';

const PaperOutModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('reel-out');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReel, setSelectedReel] = useState(null);
  const [outQuantity, setOutQuantity] = useState('');

  // Mock data - replace with your actual data
  const [reels, setReels] = useState([
    {
      reelNumber: 'A-001',
      paperName: '30/120/16',
      quantity: 1000,
      millName: 'Mill A',
      shade: 'White',
      rate: 45.50,
      days: 5,
      isPartiallyUsed: false
    }
  ]);

  const [history, setHistory] = useState([
    {
      date: '2024-11-17',
      reelNumber: 'A-001',
      paperName: '30/120/16',
      quantityUsed: 200,
      quantityLeft: 800,
      millName: 'Mill A',
      shade: 'White',
      ratePerKg: 45.50
    }
  ]);

  const filteredReels = reels.filter(reel => 
    Object.values(reel).some(value => 
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleReelDoubleClick = (reel) => {
    setSelectedReel(reel);
  };

  const handleOutQuantitySubmit = () => {
    if (!selectedReel || !outQuantity || isNaN(outQuantity)) return;

    const outQty = Number(outQuantity);
    const updatedReels = reels.map(reel => {
      if (reel.reelNumber === selectedReel.reelNumber) {
        const newQuantity = reel.quantity - outQty;
        return {
          ...reel,
          quantity: newQuantity,
          isPartiallyUsed: true
        };
      }
      return reel;
    }).filter(reel => reel.quantity > 0);

    const historyEntry = {
      date: new Date().toISOString().split('T')[0],
      reelNumber: selectedReel.reelNumber,
      paperName: selectedReel.paperName,
      quantityUsed: outQty,
      quantityLeft: selectedReel.quantity - outQty,
      millName: selectedReel.millName,
      shade: selectedReel.shade,
      ratePerKg: selectedReel.rate
    };

    setReels(updatedReels);
    setHistory([historyEntry, ...history]);
    setSelectedReel(null);
    setOutQuantity('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-header">
          <h2>Paper Out Management</h2>
        </div>

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'reel-out' ? 'active' : ''}`}
            onClick={() => setActiveTab('reel-out')}
          >
            Reel Out
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
        </div>

        {activeTab === 'reel-out' ? (
          <div className="form-content">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by paper name, shade, reel number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Reel Number</th>
                    <th>Paper Name</th>
                    <th>Quantity</th>
                    <th>Mill Name</th>
                    <th>Shade</th>
                    <th>Rate</th>
                    <th>Days</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReels.map((reel) => (
                    <tr
                      key={reel.reelNumber}
                      onDoubleClick={() => handleReelDoubleClick(reel)}
                      className="table-row-hover"
                    >
                      <td>
                        {reel.isPartiallyUsed && <span className="star">★</span>}
                      </td>
                      <td>{reel.reelNumber}</td>
                      <td>{reel.paperName}</td>
                      <td>{reel.quantity}</td>
                      <td>{reel.millName}</td>
                      <td>{reel.shade}</td>
                      <td>{reel.rate}</td>
                      <td>{reel.days}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  <th>Quantity Used</th>
                  <th>Quantity Left</th>
                  <th>Mill Name</th>
                  <th>Shade</th>
                  <th>Rate/kg</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.date}</td>
                    <td>{entry.reelNumber}</td>
                    <td>{entry.paperName}</td>
                    <td>{entry.quantityUsed}</td>
                    <td>{entry.quantityLeft}</td>
                    <td>{entry.millName}</td>
                    <td>{entry.shade}</td>
                    <td>{entry.ratePerKg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReel && (
          <div className="modal-overlay">
            <div className="modal-content sub-modal">
              <div className="modal-header">
                <h2>Reel Out - {selectedReel.reelNumber}</h2>
              </div>
              <div className="form-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="outQuantity">Out Quantity</label>
                    <input
                      type="number"
                      id="outQuantity"
                      value={outQuantity}
                      onChange={(e) => setOutQuantity(e.target.value)}
                      max={selectedReel.quantity}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="balance">Balance</label>
                    <input
                      type="number"
                      id="balance"
                      value={outQuantity ? selectedReel.quantity - Number(outQuantity) : selectedReel.quantity}
                      disabled
                    />
                  </div>
                </div>
                <div className="button-group">
                  <button 
                    className="button secondary"
                    onClick={() => setSelectedReel(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="button primary"
                    onClick={handleOutQuantitySubmit}
                    disabled={!outQuantity || Number(outQuantity) > selectedReel.quantity}
                  >
                    Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperOutModal;