import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../navbar/Navbar';
import './paperMaster.css'

const PaperMasterForm = ({ onSave, lastPartNumber }) => {
  const [formData, setFormData] = useState({
    type: 'K',
    reelSize: '',
    gsm: '',
    bf: '',
    partNumber: (lastPartNumber + 1).toString(),
    partName: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'reelSize':
        if (value && (isNaN(value) || value < 1 || value > 100)) {
          newErrors[name] = 'Reel size must be between 1 and 100';
        } else {
          delete newErrors[name];
        }
        break;
      case 'gsm':
        if (value && (isNaN(value) || value < 1 || value > 1000)) {
          newErrors[name] = 'GSM must be between 1 and 1000';
        } else {
          delete newErrors[name];
        }
        break;
      case 'bf':
        if (value && (isNaN(value) || value < 1 || value > 1000)) {
          newErrors[name] = 'BF must be between 1 and 1000';
        } else {
          delete newErrors[name];
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      if (name === 'reelSize' || name === 'gsm' || name === 'bf') {
        if (newData.reelSize && newData.gsm && newData.bf) {
          newData.partName = `${newData.reelSize}/${newData.gsm}/${newData.bf}`;
        }
      }

      return newData;
    });
    validateField(name, value);
  };

  const handleSave = () => {
    const isValid = ['reelSize', 'gsm', 'bf'].every(field =>
      validateField(field, formData[field])
    );

    if (isValid) {
      onSave(formData);
      alert('Paper Master saved successfully! Redirecting to dashboard...');
      // navigate('/dashboard');
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto mt-16 paper-box">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 heading-paper-master">Paper Master</h2>
      </div>

      <div className="space-y-4">
        {/* <div className="flex items-center space-x-2">
          <label className="w-32 font-semibold text-gray-700">Type</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-32 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span className="text-sm text-gray-500 ml-2">
            K = Kraft Paper Reels, S = Paper Sheets
          </span>
        </div> */}

        <div className="flex items-center space-x-2">
          <label className="w-32 font-semibold text-gray-700 input-fiel-name-paper1">Reel Size</label>
          <input
            type="number"
            name="reelSize"
            value={formData.reelSize}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-32 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 input-text-paper"
          />
          {errors.reelSize && (
            <span className="text-red-500 text-sm">{errors.reelSize}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <label className="w-32 font-semibold text-gray-700 input-fiel-name-paper2">GSM</label>
          <input
            type="number"
            name="gsm"
            value={formData.gsm}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-32 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 input-text-paper"
          />
          {errors.gsm && (
            <span className="text-red-500 text-sm">{errors.gsm}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <label className="w-32 font-semibold text-gray-700 input-fiel-name-paper3">BF</label>
          <input
            type="number"
            name="bf"
            value={formData.bf}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-32 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 input-text-paper"
          />
          {errors.bf && (
            <span className="text-red-500 text-sm">{errors.bf}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <label className="w-32 font-semibold text-gray-700 input-fiel-name-paper4">Part No.</label>
          <input
            type="text"
            value={formData.partNumber}
            disabled
            className="border rounded px-3 py-2 w-32 bg-gray-100 text-gray-600 input-text-paper "
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="w-32 font-semibold text-gray-700 input-fiel-name-paper5">Part Name</label>
          <input
            type="text"
            value={formData.partName}
            disabled
            className="border rounded px-3 py-2 w-full bg-gray-100 text-gray-600 input-text-paper "
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 button-paper button-cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={Object.keys(errors).length > 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 button-paper button-save"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const PaperMasterPage = () => {
  const [paperMasters, setPaperMasters] = useState([]);

  const handleSave = (formData) => {
    setPaperMasters(prev => [...prev, formData]);
  };

  return (
    <>
      <Navigation />

      <div className="p-4 pt-20 min-h-screen bg-gray-50 ">
        <div className="mb-8">
          {/* <h1 className="text-3xl font-bold text-gray-800">Paper Master</h1> */}
        </div>

        <PaperMasterForm
          onSave={handleSave}
          lastPartNumber={paperMasters.length - 1}
        />

        {/* <div className="space-y-4 mt-8">
          {paperMasters.map((paper, index) => (
            <div key={paper.partNumber} className="p-4 border rounded bg-white">
              <p className="text-gray-700 font-semibold">Part Name: {paper.partName}</p>
              <p className="text-gray-500">Part Number: {paper.partNumber}</p>
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
};

export default PaperMasterPage;
