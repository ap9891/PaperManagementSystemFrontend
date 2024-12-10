import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure to install axios: npm install axios
import "./paperOut.css";
import Alert from "../Alert/Alert";

axios.defaults.baseURL = "http://localhost:9090";
const PaperOutModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("reel-out");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReel, setSelectedReel] = useState(null);
  const [outQuantity, setOutQuantity] = useState("");

  // State for reels and history
  const [reels, setReels] = useState([]);
  const [history, setHistory] = useState([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch reels and history on component mount
  useEffect(() => {
    if (isOpen) {
      fetchReels();
      fetchHistory();
    }
  }, [isOpen]);

  // Fetch reels from backend
  const fetchReels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const reelsResponse = await axios.get("/api/reels");
      setReels(reelsResponse.data);
    } catch (err) {
      setError("Failed to fetch reels. Please try again.");
      console.error("Reels fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch history from backend
  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const historyResponse = await axios.get("/api/reels/history");
      setHistory(historyResponse.data);
    } catch (err) {
      setError("Failed to fetch history. Please try again.");
      console.error("History fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Search reels
  const searchReels = async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const searchResponse = await axios.get(
        `/api/reels/search?searchTerm=${query}`
      );
      setReels(searchResponse.data);
    } catch (err) {
      setError("Failed to search reels. Please try again.");
      console.error("Reels search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      if (query) {
        searchReels(query);
      } else {
        fetchReels(); // Reset to full list if search is empty
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle reel out submission
  const handleOutQuantitySubmit = async () => {
    if (!selectedReel || !outQuantity || isNaN(outQuantity)) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/reels/stock-out", {
        reelNumber: selectedReel.reelNumber,
        outQuantity: Number(outQuantity),
      });

      // Refresh reels and history after successful stock out
      fetchReels();
      fetchHistory();

      // Set success message
      setSuccessMessage(`Successfully stocked out ${outQuantity} from reel ${selectedReel.reelNumber}`);

      setSelectedReel(null);
      setOutQuantity("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to stock out reel. Please try again."
      );
      console.error("Reel out error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reel double click
  const handleReelDoubleClick = (reel) => {
    setSelectedReel(reel);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      {/* Render Alert for success messages */}
      {successMessage && (
        <Alert 
          type="success" 
          message={successMessage} 
          onClose={() => setSuccessMessage(null)} 
        />
      )}

      {/* Render Alert for error messages */}
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}

      <div className="modal-content">
        <div>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="modal-header">
          <h2>Paper Out Management</h2>
        </div>

        {/* Remove old error display as it's now handled by Alert */}
        {/* {error && <div className="error-message">{error}</div>} */}

        {isLoading && <div className="loading-spinner">Loading...</div>}

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "reel-out" ? "active" : ""}`}
            onClick={() => setActiveTab("reel-out")}
          >
            Reel Out
          </button>
          <button
            className={`tab-button ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>
        </div>

        {/* Rest of the code remains the same */}
        {activeTab === "reel-out" ? (
          <div className="form-content">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by paper name, shade, reel number..."
                value={searchQuery}
                onChange={handleSearchChange}
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
                  {reels.map((reel) => (
                    <tr
                      key={reel.reelNumber}
                      onDoubleClick={() => handleReelDoubleClick(reel)}
                      className="table-row-hover"
                    >
                      <td>
                        {reel.isPartiallyUsed && (
                          <span className="star">★</span>
                        )}
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
                {history.map((entry) => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.outTimestamp).toLocaleDateString()}</td>
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
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value >= 0) {
                          setOutQuantity(value);
                        } else {
                          // Replace alert with our new Alert component
                          setError("Quantity must be a positive value.");
                        }
                      }}
                      max={selectedReel.quantity}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="balance">Balance</label>
                    <input
                      type="number"
                      id="balance"
                      value={
                        outQuantity
                          ? selectedReel.quantity - Number(outQuantity)
                          : selectedReel.quantity
                      }
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
                    disabled={
                      !outQuantity ||
                      Number(outQuantity) > selectedReel.quantity ||
                      isLoading
                    }
                  >
                    {isLoading ? "Processing..." : "Out"}
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