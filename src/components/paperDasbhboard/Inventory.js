import React, { useState } from 'react';
import './PaperPurchase.css'; // Reusing the same CSS file for consistency

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    className="absolute left-3 top-3 text-gray-400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const InventoryModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryData] = useState([
    {
      reelNumber: 'A-1',
      paperName: 'Premium Bond',
      quantity: 1500,
      millName: 'Supreme Mills',
      shade: 'White',
      days: 45,
      ratePerKg: 75.50,
      remark: 'Good quality'
    },
    {
      reelNumber: 'A-2',
      paperName: 'Matte Paper',
      quantity: 1200,
      millName: 'Elite Papers',
      shade: 'Cream',
      days: 30,
      ratePerKg: 82.25,
      remark: 'Standard quality'
    }
  ]);

  const filteredData = inventoryData.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
          <h2>Inventory Management</h2>
        </div>

        {/* Search Bar */}
        <div className="form-content">
          <div className="mb-4 relative">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Reel Number</th>
                  <th>Paper Name</th>
                  <th>Quantity (Tons)</th>
                  <th>Mill Name</th>
                  <th>Shade</th>
                  <th>Days</th>
                  <th>Rate/kg</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.reelNumber}</td>
                    <td>{item.paperName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.millName}</td>
                    <td>{item.shade}</td>
                    <td>{item.days}</td>
                    <td>{item.ratePerKg.toFixed(2)}</td>
                    <td>{item.remark || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="button-group">
            <button className="button secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;