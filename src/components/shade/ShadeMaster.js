import React, { useState } from 'react';
// import Navigation from '../navbar/Navbar'; 
import NavigationPaper from '../navbar/NavbarPaper';
import './ShadeMaster.css';

const ShadeForm = ({ onSave, lastShadeId, editingShade }) => {
  const [formData, setFormData] = useState({
    shadeName: '',
    shadeId: (lastShadeId + 1).toString()
  });

  const [errors, setErrors] = useState({});

  // Update form data when editingShade changes
  React.useEffect(() => {
    if (editingShade) {
      setFormData({
        shadeName: editingShade.shadeName,
        shadeId: editingShade.shadeId
      });
    } else {
      setFormData({
        shadeName: '',
        shadeId: (lastShadeId + 1).toString()
      });
    }
  }, [editingShade, lastShadeId]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === 'shadeName' && !value.trim()) {
      newErrors[name] = 'Shade Name is required';
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
    const isValid = validateField('shadeName', formData.shadeName);

    if (isValid) {
      onSave(formData);
      alert(editingShade ? 'Shade updated successfully!' : 'Shade saved successfully!');
      if (!editingShade) {
        setFormData({
          shadeName: '',
          shadeId: ((parseInt(formData.shadeId) || 0) + 1).toString()
        });
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      shadeName: '',
      shadeId: (lastShadeId + 1).toString()
    });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg mx-auto mt-16 paper-box-mill shade-form-card">
      <h2 className="text-2xl font-bold text-gray-800 heading-paper-master-mill card-header-mill">
        {editingShade ? 'Update Shade' : 'Add Shade Master'}
      </h2>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <label className="w-32 font-semibold text-gray-700 input-fiel-name-paper1">Shade Name</label>
          <input
            type="text"
            name="shadeName"
            value={formData.shadeName}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter shade name"
          />
          {errors.shadeName && (
            <span className="text-red-500 text-sm">{errors.shadeName}</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <label className="w-32 font-semibold text-gray-700 input-fiel-name-paper2">Shade ID</label>
          <input
            type="text"
            value={formData.shadeId}
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
            {editingShade ? 'Update' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ShadeList = ({ shades, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredShades = shades.filter(shade =>
    shade.shadeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-8 filter-search-container">
      <div className="mb-4 flex gap-4 search-container">
        <input
          type="text"
          placeholder="Search by Shade Name"
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
                  Shade Name
                </th>
                <th className="px-6 py-3 w-1/4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider th-mill">
                  Shade ID
                </th>
                <th className="px-6 py-3 w-1/4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider th-mill">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredShades.map((shade) => (
                <tr key={shade.shadeId}>
                  <td className="px-6 py-4 whitespace-nowrap">{shade.shadeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{shade.shadeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap actions">
                    <button
                      onClick={() => onUpdate(shade)}
                      className="text-blue-600 hover:text-blue-900 mr-4 btn-update"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => onDelete(shade.shadeId)}
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

const ShadeMasterPage = () => {
  const [shades, setShades] = useState([]);
  const [editingShade, setEditingShade] = useState(null);

  const handleSave = (formData) => {
    if (editingShade) {
      setShades(prev => prev.map(shade => 
        shade.shadeId === editingShade.shadeId ? formData : shade
      ));
      setEditingShade(null);
    } else {
      setShades(prev => [...prev, formData]);
    }
  };

  const handleUpdate = (shade) => {
    setEditingShade(shade);
  };

  const handleDelete = (shadeId) => {
    if (window.confirm('Are you sure you want to delete this shade?')) {
      setShades(prev => prev.filter(shade => shade.shadeId !== shadeId));
    }
  };

  return (
    <>
      <NavigationPaper />
      <div className="p-4 pt-20 min-h-screen bg-gray-50">
        <ShadeForm
          onSave={handleSave}
          lastShadeId={Math.max(...shades.map(s => parseInt(s.shadeId) || 0), 0)}
          editingShade={editingShade}
        />
        <ShadeList
          shades={shades}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default ShadeMasterPage;