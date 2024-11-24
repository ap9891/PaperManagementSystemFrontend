import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navigation from '../navbar/Navbar'; 
import NavigationPaper from '../navbar/NavbarPaper';
import './millMaster.css'

const MillMasterForm = ({ onSave, lastMillId, editingMill }) => {
  const [formData, setFormData] = useState({
    millName: '',
    millId: (lastMillId + 1).toString()
  });

  const [errors, setErrors] = useState({});
  // const navigate = useNavigate(); 

  // Update form data when editingMill changes
  useEffect(() => {
    if (editingMill) {
      setFormData({
        millName: editingMill.millName,
        millId: editingMill.millId
      });
    } else {
      setFormData({
        millName: '',
        millId: (lastMillId + 1).toString()
      });
    }
  }, [editingMill, lastMillId]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'millName' && !value.trim()) {
      newErrors[name] = 'Mill Name is required';
    } else {
      delete newErrors[name];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSave = () => {
    const isValid = validateField('millName', formData.millName);

    if (isValid) {
      onSave(formData);
      alert(editingMill ? 'Mill updated successfully!' : 'Mill Master saved successfully!');
      if (!editingMill) {
        setFormData({
          millName: '',
          millId: ((parseInt(formData.millId) || 0) + 1).toString()
        });
      }
    }
  };

  const handleCancel = () => {
    // navigate('/dashboard');
    setFormData({
      millName: '',
      millId: (lastMillId + 1).toString()
    });
    // Clear any errors
    setErrors({});
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto mt-16 paper-box-mill shade-form-card">
      {/* <div className="mb-6"> */}
        <h2 className="text-2xl font-bold text-gray-800 heading-paper-master-mill card-header-mill">
          {editingMill ? 'Update Mill' : 'Add Mill Master'}
        </h2>
      {/* </div> */}

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <label className="w-32 font-semibold text-gray-700 input-fiel-name-mill">Mill Name</label>
          <input
            type="text"
            name="millName"
            value={formData.millName}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter mill name"
          />
          {errors.millName && (
            <span className="text-red-500 text-sm">{errors.millName}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <label className="w-32 font-semibold text-gray-700 input-fiel-name-paper2">Mill ID</label>
          <input
            type="text"
            value={formData.millId}
            disabled
            className="border rounded px-3 py-2 w-32 bg-gray-100 text-gray-600"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 button-cancel-mill"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={Object.keys(errors).length > 0}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 button-save-mill"
          >
            {editingMill ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

const MillList = ({ mills, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMills = mills.filter(mill =>
    mill.millName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-8 filter-search-container">
      <div className="mb-4 flex gap-4 search-container">
        <input
          type="text"
          placeholder="Search by Mill Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <span className="absolute left-2.5 top-2.5">🔍</span>
      </div>

      <div className="bg-white rounded-lg shadow table-paper flex justify-between">
        <div className="flex-1">
          <table className="min-w-full table-fixed">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 w-1/2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider th-mill">
                  Mill Name
                </th>
                <th className="px-6 py-3 w-1/4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider th-mill">
                  Mill ID
                </th>
                <th className="px-6 py-3 w-1/4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider th-mill">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMills.map((mill) => (
                <tr key={mill.millId}>
                  <td className="px-6 py-4 whitespace-nowrap">{mill.millName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{mill.millId}</td>
                  <td className="px-6 py-4 whitespace-nowrap actions">
                    <button
                      onClick={() => onUpdate(mill)}
                      className="text-blue-600 hover:text-blue-900 mr-4 btn-update"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => onDelete(mill.millId)}
                      className="text-red-600 hover:text-red-900 btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-1/4"></div>
      </div>
    </div>
  );
};

const MillMasterPage = () => {
  const [mills, setMills] = useState([]);
  const [editingMill, setEditingMill] = useState(null);

  const handleSave = (formData) => {
    if (editingMill) {
      setMills(prev => prev.map(mill => 
        mill.millId === editingMill.millId ? formData : mill
      ));
      setEditingMill(null);
    } else {
      setMills(prev => [...prev, formData]);
    }
  };

  const handleUpdate = (mill) => {
    setEditingMill(mill);
  };

  const handleDelete = (millId) => {
    if (window.confirm('Are you sure you want to delete this mill?')) {
      setMills(prev => prev.filter(mill => mill.millId !== millId));
    }
  };

  return (
    <>
      <NavigationPaper />
      <div className="p-4 pt-20 min-h-screen bg-gray-50">
        <MillMasterForm
          onSave={handleSave}
          lastMillId={Math.max(...mills.map(m => parseInt(m.millId) || 0), 0)}
          editingMill={editingMill}
        />
        <MillList
          mills={mills}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default MillMasterPage;