import React, { useState, useEffect } from 'react';
import { Upload, FileText, Mail, Phone, Shield, PieChart, TrendingUp, AlertTriangle, Target, LogOut, User, Building2, Plus, CheckCircle, AlertCircle, Sparkles, Heart, Rocket } from 'lucide-react';
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
    { id: 'document', label: 'Document Analysis', icon: FileText, color: 'from-purple-500 to-pink-600' },
    { id: 'email', label: 'Email Analysis', icon: Mail, color: 'from-pink-500 to-rose-600' },
    { id: 'call', label: 'Call Analysis', icon: Phone, color: 'from-blue-500 to-cyan-600' },
    { id: 'factcheck', label: 'Fact Check', icon: Shield, color: 'from-emerald-500 to-teal-600' },
    { id: 'business-model', label: 'Business Model', icon: PieChart, color: 'from-orange-500 to-amber-600' },
    { id: 'market-intelligence', label: 'Market Intel', icon: TrendingUp, color: 'from-indigo-500 to-purple-600' },
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Floating gradient shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-bounce"></div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-lg border-b-2 border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-black text-gray-900">Startup Dashboard</h1>
                  <Sparkles className="h-6 w-6 text-pink-500" />
                </div>
                <p className="text-gray-600 text-lg font-medium">Upload documents and get AI-powered analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl">
                <div className="flex items-center space-x-2 text-sm font-bold text-purple-700">
                  <User className="h-4 w-4" />
                  <span>{user.displayName || user.email}</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 rounded-2xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-200 hover:border-red-300 font-bold"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-purple-100 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <h2 className="text-3xl font-black text-gray-900">Welcome to your Startup Dashboard!</h2>
            <Heart className="h-6 w-6 text-pink-500" />
          </div>
          <p className="text-gray-600 text-lg font-medium mb-6">
            Upload your documents, analyze your business model, and get comprehensive insights about your startup.
          </p>
          
          {startupData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-bold text-blue-900">Documents</span>
                </div>
                <p className="text-3xl font-black text-blue-600 mt-2">{analyses.length}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-bold text-emerald-900">Analyses</span>
                </div>
                <p className="text-3xl font-black text-emerald-600 mt-2">{analyses.length}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-bold text-purple-900">Status</span>
                </div>
                <p className="text-sm font-bold text-purple-600 mt-2">Active</p>
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
