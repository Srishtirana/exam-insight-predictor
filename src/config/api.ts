// API Configuration for different environments
const getApiUrl = () => {
  // Check if we're in production (GitHub Pages)
  if (window.location.hostname === 'srishirana.github.io') {
    return null; // Use mock data on GitHub Pages
  }
  
  // For local development, you can set this to your local backend URL
  // return "http://localhost:5000/api";
  
  // Default to mock data
  return null;
};

export const API_URL = getApiUrl();

// Check if backend is available
export const isBackendAvailable = () => {
  // For GitHub Pages, always use mock data
  if (window.location.hostname === 'srishirana.github.io') {
    return false;
  }
  
  // For local development, you can enable/disable mock data here
  return false; // Set to true to use real backend when available
};
