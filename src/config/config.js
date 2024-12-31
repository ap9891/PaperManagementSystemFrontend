const getApiBaseUrl = () => {
    const env = process.env.REACT_APP_ENV || 'development';
    
    const API_URLS = {
      development: 'http://localhost:9090/api',
      production: 'https://api.example.com/api'
    };
  
    return API_URLS[env];
  };
  
  export const API_ENDPOINTS = {
    LOGIN: `${getApiBaseUrl()}/auth/login`,
    LOGOUT: `${getApiBaseUrl()}/auth/logout`,
    MILL: `${getApiBaseUrl()}/mills`,
    PAPER: `${getApiBaseUrl()}/paper-master`,
    SHADE: `${getApiBaseUrl()}/shades`
  };
  
  export default API_ENDPOINTS;