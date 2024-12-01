import axios from 'axios';

const BASE_URL = 'http://localhost:9090/api/shades';

export const ShadeMasterService = {
  getAllShades: async () => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching shades:', error);
      throw error;
    }
  },

  createShade: async (shadeData) => {
    try {
      const response = await axios.post(BASE_URL, shadeData);
      return response.data;
    } catch (error) {
      console.error('Error creating shade:', error);
      throw error;
    }
  },

  updateShade: async (shadeId, shadeData) => {
    try {
      const response = await axios.put(`${BASE_URL}/${shadeId}`, shadeData);
      return response.data;
    } catch (error) {
      console.error('Error updating shade:', error);
      throw error;
    }
  },

  deleteShade: async (shadeId) => {
    try {
      await axios.delete(`${BASE_URL}/${shadeId}`);
    } catch (error) {
      console.error('Error deleting shade:', error);
      throw error;
    }
  }
};