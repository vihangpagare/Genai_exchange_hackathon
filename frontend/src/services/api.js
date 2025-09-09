import axios from 'axios';
import firebaseService from './firebaseService';

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
    
    // Save to Firebase if analysis was successful
    if (response.data.ready_for_firebase) {
      try {
        const { startupId, documentId, analysisId } = await firebaseService.saveAnalysisResults(
          response.data,
          response.data.filename?.replace(/\.(pdf|pptx|ppt)$/i, ''),
          response.data.filename
        );
        response.data.firebaseData = { startupId, documentId, analysisId };
      } catch (firebaseError) {
        console.warn('Firebase save failed:', firebaseError);
        response.data.firebaseError = firebaseError.message;
      }
    }
    
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
    
    // Save to Firebase if analysis was successful
    if (response.data.ready_for_firebase) {
      try {
        const { startupId, analysisId } = await firebaseService.saveAnalysisResults(
          response.data,
          "Email Analysis"
        );
        response.data.firebaseData = { startupId, analysisId };
      } catch (firebaseError) {
        console.warn('Firebase save failed:', firebaseError);
        response.data.firebaseError = firebaseError.message;
      }
    }
    
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
    
    // Save to Firebase if analysis was successful
    if (response.data.ready_for_firebase) {
      try {
        const { startupId, analysisId } = await firebaseService.saveAnalysisResults(
          response.data,
          "Call Analysis"
        );
        response.data.firebaseData = { startupId, analysisId };
      } catch (firebaseError) {
        console.warn('Firebase save failed:', firebaseError);
        response.data.firebaseError = firebaseError.message;
      }
    }
    
    return response.data;
  } catch (error) {
    throw new Error(`Call analysis failed: ${error.message}`);
  }
};

// Fact-checking API
export const factCheckContent = async (content, analysisType = 'general') => {
  try {
    const response = await api.post('/analyze/factcheck', {
      content: content,
      analysis_type: analysisType
    });
    return response.data;
  } catch (error) {
    throw new Error(`Fact-checking failed: ${error.message}`);
  }
};

// Business Model Analysis API
export const analyzeBusinessModel = async (content) => {
  try {
    const response = await api.post('/analyze/business-model', {
      email_text: content
    });
    return response.data;
  } catch (error) {
    throw new Error(`Business model analysis failed: ${error.message}`);
  }
};

// Market Intelligence Analysis API
export const analyzeMarketIntelligence = async (content) => {
  try {
    const response = await api.post('/analyze/market-intelligence', {
      email_text: content
    });
    return response.data;
  } catch (error) {
    throw new Error(`Market intelligence analysis failed: ${error.message}`);
  }
};

// Risk Assessment Analysis API
export const analyzeRiskAssessment = async (content) => {
  try {
    const response = await api.post('/analyze/risk-assessment', {
      email_text: content
    });
    return response.data;
  } catch (error) {
    throw new Error(`Risk assessment analysis failed: ${error.message}`);
  }
};

// Comprehensive Analysis API
export const comprehensiveAnalysis = async (content, analysisType = 'document', options = {}) => {
  try {
    const response = await api.post('/analyze/comprehensive', {
      content: content,
      analysis_type: analysisType,
      include_business_model: options.includeBusinessModel !== false,
      include_market_intelligence: options.includeMarketIntelligence !== false,
      include_risk_assessment: options.includeRiskAssessment !== false,
      include_fact_check: options.includeFactCheck !== false
    });
    return response.data;
  } catch (error) {
    throw new Error(`Comprehensive analysis failed: ${error.message}`);
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