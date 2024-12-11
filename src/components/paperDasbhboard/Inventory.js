import React, { useState, useEffect } from "react";
import axios from "axios";
import "./inventory.css";

const InventoryModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchInitialData();
    }
  }, [isOpen]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/inventory/search", {
        params: { searchTerm: "" },
      });
      setInventoryData(response.data);
    } catch (err) {
      setError("Failed to fetch inventory data");
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      fetchInitialData();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/inventory/search", {
        params: { searchTerm: query },
      });
      setInventoryData(response.data);
    } catch (err) {
      setError("Failed to perform search");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const resetSearch = () => {
    setSearchQuery("");
    fetchInitialData();
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

        <div className="search-container mb-4">
          <input
            type="text"
            placeholder="Search by paper name, reel number, mill name, or shade..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input w-full"
          />
        </div>

        {loading && <p className="text-center text-blue-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

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
          <button type="button" className="button secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;
