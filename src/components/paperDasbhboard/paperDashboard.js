import React, { useState } from "react"; // Add useState to the import
import { Link } from "react-router-dom";
import "./paperDashboard.css";
import Navigation from "../navbar/Navbar";
import PaperPurchaseModal from "./paperPurchase";
import PaperOutModal from "./paperOut";
import InventoryModal from "./Inventory";

const PaperDashboard = () => {
  const [isPaperModalOpen, setIsPaperModalOpen] = useState(false);
  const [isPaperOutModalOpen, setIsPaperOutModalOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false); // Ensure the initial state is false

  const handlePaperInClick = (e) => {
    e.preventDefault(); // Prevent default Link behavior
    setIsPaperModalOpen(true);
  };

  const handlePaperOutClick = (e) => {
    e.preventDefault();
    setIsPaperOutModalOpen(true);
  };

  const handleInventoryClick = (e) => {
    e.preventDefault();
    setIsInventoryOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div>
        <Navigation />
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Date Display */}
        <div className="date-display">
          <div>
            {new Date().toLocaleString("en-US", {
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

        {/* Title */}
        <h1 className="main-title">Fantasy Packaging Private Limited</h1>

        {/* Action Buttons Grid */}
        <div className="buttons-grid">
          <Link to="/paper-raw" onClick={handlePaperInClick}>
            Paper In
          </Link>

          <Link to="/paper-raw" onClick={handlePaperOutClick}>
            Paper Out
          </Link>

          <Link to="/paper-raw" onClick={handleInventoryClick}>
            Open Inventory
          </Link>
        </div>

        <PaperOutModal
          isOpen={isPaperOutModalOpen}
          onClose={() => setIsPaperOutModalOpen(false)}
        />

        <PaperPurchaseModal
          isOpen={isPaperModalOpen}
          onClose={() => setIsPaperModalOpen(false)}
        />

        <InventoryModal
          isOpen={isInventoryOpen}
          onClose={() => setIsInventoryOpen(false)} // Ensure this closes the modal
        />
      </div>
    </div>
  );
};

export default PaperDashboard;