// API Configuration for different environments
const getApiUrl = () => {
  // Check if we're in production (GitHub Pages)
  if (window.location.hostname === 'srishtirana.github.io') {
    // For GitHub Pages, we'll use a mock API or disable backend features
    return null; // No backend API available on GitHub Pages
  }
  
  // Development environment
  return "http://localhost:5000/api";
};

export const API_URL = getApiUrl();

// Check if backend is available
export const isBackendAvailable = () => {
  return API_URL !== null;
};
