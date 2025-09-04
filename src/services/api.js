import axios from 'axios';

// Configure axios defaults
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes timeout for large document processing
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.detail || 
                     error.response.data?.message || 
                     error.response.data?.error ||
                     `Server error: ${error.response.status}`;
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check if the backend is running.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// Document analysis API
export const analyzeDocument = async (formData) => {
  try {
    const response = await api.post('/analyze/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Document analysis failed: ${error.message}`);
  }
};

// Email analysis API
export const analyzeEmail = async (emailText) => {
  try {
    const response = await api.post('/analyze/email', {
      email_text: emailText
    });
    return response.data;
  } catch (error) {
    throw new Error(`Email analysis failed: ${error.message}`);
  }
};

// Call transcript analysis API
export const analyzeCall = async (callText) => {
  try {
    const response = await api.post('/analyze/call', {
      call_text: callText
    });
    return response.data;
  } catch (error) {
    throw new Error(`Call analysis failed: ${error.message}`);
  }
};

// Health check API
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error(`Health check failed: ${error.message}`);
  }
};

export default api;
