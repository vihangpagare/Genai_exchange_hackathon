import React, { useState, useEffect } from 'react';
import { Upload, FileText, Mail, Phone, Shield, PieChart, TrendingUp, AlertTriangle, Target, LogOut, User, Building2, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import FileUpload from './FileUpload';
import TextInput from './TextInput';
import AnalysisResults from './AnalysisResults';
import { analyzeDocument, analyzeEmail, analyzeCall, factCheckContent, analyzeBusinessModel, analyzeMarketIntelligence, analyzeRiskAssessment, comprehensiveAnalysis } from '../services/api';
import firebaseService from '../services/firebaseService';

const StartupDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('document');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [startupData, setStartupData] = useState(null);
  const [analyses, setAnalyses] = useState([]);

  const tabs = [
    { id: 'document', label: 'Document Analysis', icon: FileText, color: 'from-blue-500 to-purple-600' },
    { id: 'email', label: 'Email Analysis', icon: Mail, color: 'from-purple-500 to-pink-600' },
    { id: 'call', label: 'Call Analysis', icon: Phone, color: 'from-indigo-500 to-blue-600' },
    { id: 'factcheck', label: 'Fact Check', icon: Shield, color: 'from-emerald-500 to-teal-600' },
    { id: 'business-model', label: 'Business Model', icon: PieChart, color: 'from-orange-500 to-red-600' },
    { id: 'market-intelligence', label: 'Market Intel', icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
    { id: 'risk-assessment', label: 'Risk Assessment', icon: AlertTriangle, color: 'from-red-500 to-pink-600' },
    { id: 'comprehensive', label: 'Comprehensive', icon: Target, color: 'from-violet-500 to-purple-600' }
  ];

  useEffect(() => {
    loadStartupData();
  }, []);

  const loadStartupData = async () => {
    try {
      // Load startup data and analyses from Firebase
      const startups = await firebaseService.getAllStartups();
      const userStartup = startups.find(s => s.name === user.displayName || s.name === user.email);
      
      if (userStartup) {
        setStartupData(userStartup);
        const startupAnalyses = await firebaseService.getAnalysesByStartup(userStartup.id);
        setAnalyses(startupAnalyses);
      }
    } catch (error) {
      console.error('Error loading startup data:', error);
    }
  };

  const handleDocumentUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await analyzeDocument(formData);
      setResults(response);
      
      // Reload startup data after analysis
      await loadStartupData();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAnalysis = async (emailText) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await analyzeEmail(emailText);
      setResults(response);
      await loadStartupData();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallAnalysis = async (callText) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await analyzeCall(callText);
      setResults(response);
      await loadStartupData();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFactCheck = async (content) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await factCheckContent(content, 'general');
      setResults(response);
      await loadStartupData();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBusinessModelAnalysis = async (content) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await analyzeBusinessModel({ email_text: content });
      setResults(response);
      await loadStartupData();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarketIntelligenceAnalysis = async (content) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await analyzeMarketIntelligence({ email_text: content });
      setResults(response);
      await loadStartupData();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRiskAssessmentAnalysis = async (content) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await analyzeRiskAssessment({ email_text: content });
      setResults(response);
      await loadStartupData();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComprehensiveAnalysis = async (content) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await comprehensiveAnalysis({
        content,
        analysis_type: 'document',
        include_business_model: true,
        include_market_intelligence: true,
        include_risk_assessment: true,
        include_fact_check: true
      });
      setResults(response);
      await loadStartupData();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'document':
        return <FileUpload onFileUpload={handleDocumentUpload} />;
      case 'email':
        return <TextInput onAnalyze={handleEmailAnalysis} placeholder="Paste your email content here..." />;
      case 'call':
        return <TextInput onAnalyze={handleCallAnalysis} placeholder="Paste your call transcript here..." />;
      case 'factcheck':
        return <TextInput onAnalyze={handleFactCheck} placeholder="Paste content to fact-check here..." />;
      case 'business-model':
        return <TextInput onAnalyze={handleBusinessModelAnalysis} placeholder="Describe your business model..." />;
      case 'market-intelligence':
        return <TextInput onAnalyze={handleMarketIntelligenceAnalysis} placeholder="Describe your market and competition..." />;
      case 'risk-assessment':
        return <TextInput onAnalyze={handleRiskAssessmentAnalysis} placeholder="Describe potential risks and challenges..." />;
      case 'comprehensive':
        return <TextInput onAnalyze={handleComprehensiveAnalysis} placeholder="Paste comprehensive startup information here..." />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Startup Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user.displayName || user.email}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to your Startup Dashboard!</h2>
          <p className="text-gray-600 mb-4">
            Upload your documents, analyze your business model, and get comprehensive insights about your startup.
          </p>
          
          {startupData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Documents</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-1">{analyses.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Analyses</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-1">{analyses.length}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Status</span>
                </div>
                <p className="text-sm font-bold text-purple-600 mt-1">Active</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analysis Tabs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {getTabContent()}
              </div>
            </div>

            {/* Results */}
            {results && (
              <div className="mt-6">
                <AnalysisResults results={results} />
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-red-800">{error}</span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
                  <span className="text-blue-800">Analyzing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Recent Analyses Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Analyses</h3>
              {analyses.length === 0 ? (
                <p className="text-gray-500 text-sm">No analyses yet. Upload a document to get started!</p>
              ) : (
                <div className="space-y-3">
                  {analyses.slice(0, 5).map((analysis, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {analysis.analysisType || 'Analysis'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(analysis.createdAt?.toDate?.() || analysis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDashboard;
