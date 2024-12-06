import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PaperPurchase.css";

// const SearchIcon = () => (
//   <svg
//     width="16"
//     height="16"
//     className="absolute left-3 top-3 text-gray-400"
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     <path
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       strokeWidth="2"
//       d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//     />
//   </svg>
// );

const InventoryModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search parameters
  const [paperName, setPaperName] = useState("");
  const [shade, setShade] = useState("");
  const [reelNumber, setReelNumber] = useState("");
  const [millName, setMillName] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchInventoryData();
    }
  }, [isOpen]);

  const fetchInventoryData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/inventory/search", {
        params: {
          paperName: paperName || undefined,
          shade: shade || undefined,
          reelNumber: reelNumber || undefined,
          millName: millName || undefined,
          quantity: quantity ? parseInt(quantity) : undefined,
        },
      });
      setInventoryData(response.data);
    } catch (err) {
      setError("Failed to fetch inventory data");
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInventoryData();
  };

  const resetSearch = () => {
    setPaperName("");
    setShade("");
    setReelNumber("");
    setMillName("");
    setQuantity("");
    fetchInventoryData();
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
          <h2>Inventory Management</h2>
        </div>

        {/* Advanced Search Form */}
        <form onSubmit={handleSearch} className="form-content">
          <div class="form-grid">
            {/* <div className="grid grid-cols-3 gap-4 mb-4"> */}
              <div class="form-group">
                <label for="paper-name">Paper Name</label>
                <input
                  type="text"
                  placeholder="Paper Name"
                  value={paperName}
                  onChange={(e) => setPaperName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div class="form-group">
                <label for="shade">Shade</label>
                <input
                  type="text"
                  placeholder="Shade"
                  value={shade}
                  onChange={(e) => setShade(e.target.value)}
                  className="input-field"
                />
              </div>
              <div class="form-group">
                <label for="reel-number">Reel Number</label>
                <input
                  type="text"
                  placeholder="Reel Number"
                  value={reelNumber}
                  onChange={(e) => setReelNumber(e.target.value)}
                  className="input-field"
                />
              </div>
              <div class="form-group">
                <label for="mill-name">Mill Name</label>
                <input
                  type="text"
                  placeholder="Mill Name"
                  value={millName}
                  onChange={(e) => setMillName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div class="form-group">
                <label for="quantity">Quantity</label>
                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="input-field"
                />
              </div>
            {/* </div> */}
          </div>

          <div class="button-group">
            <div>
              {/* <button type="submit" class="button secondary">
                Search
              </button> */}
              <button
                type="button"
                onClick={resetSearch}
                class="button primary"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Loading and Error States */}
          {loading && <p className="text-center text-blue-500">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

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
                {inventoryData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.reelNumber}</td>
                    <td>{item.paperName}</td>
                    <td>{item.quantity}</td>
                    <td>{item.millName}</td>
                    <td>{item.shade}</td>
                    <td>{item.days}</td>
                    <td>{item.ratePerKg.toFixed(2)}</td>
                    <td>{item.remark || "-"}</td>
                  </tr>
                ))}
                {inventoryData.length === 0 && !loading && (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No inventory data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="button secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;
