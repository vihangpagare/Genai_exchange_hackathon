import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Mail, Phone, Loader2, CheckCircle, AlertCircle, Sparkles, Brain, Zap, Search, Shield, BarChart2, Briefcase } from 'lucide-react';
import FileUpload from './components/FileUpload';
import AnalysisResults from './components/AnalysisResults';
import TextInput from './components/TextInput';
import FactCheckInput from './components/FactCheckInput';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { analyzeDocument, analyzeEmail, analyzeCall, factCheckContent } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('document');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const tabRefs = useRef({});
  const [announcement, setAnnouncement] = useState('');

  const handleDocumentUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await analyzeDocument(formData);
      setResults(response);
    } catch (err) {
      setError(err.message || 'Failed to analyze document');
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
    } catch (err) {
      setError(err.message || 'Failed to analyze email');
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
    } catch (err) {
      setError(err.message || 'Failed to analyze call transcript');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFactCheck = async (content, analysisType) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    setAnnouncement('Starting fact-check analysis...');

    try {
      const response = await factCheckContent(content, analysisType);
      setResults(response);
      setAnnouncement('Fact-check analysis completed successfully');
    } catch (err) {
      setError(err.message || 'Failed to fact-check content');
      setAnnouncement('Fact-check analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard navigation for tabs
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const tabIds = ['document', 'email', 'call', 'factcheck'];
      const currentIndex = tabIds.indexOf(activeTab);
      let nextIndex;
      
      if (event.key === 'ArrowLeft') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabIds.length - 1;
      } else {
        nextIndex = currentIndex < tabIds.length - 1 ? currentIndex + 1 : 0;
      }
      
      const nextTab = tabIds[nextIndex];
      setActiveTab(nextTab);
      setAnnouncement(`Switched to ${tabs.find(tab => tab.id === nextTab)?.label} tab`);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  const tabs = [
    { id: 'document', label: 'Document Analysis', icon: FileText, color: 'from-blue-500 to-purple-600' },
    { id: 'email', label: 'Email Analysis', icon: Mail, color: 'from-purple-500 to-pink-600' },
    { id: 'call', label: 'Call Analysis', icon: Phone, color: 'from-indigo-500 to-blue-600' },
    { id: 'factcheck', label: 'Fact Check', icon: Shield, color: 'from-emerald-500 to-teal-600' }
  ];

  return (
    <ThemeProvider>
      <div className="min-h-screen">
        {/* Skip Link for Accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        {/* Screen Reader Announcements */}
        <div 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
        >
          {announcement}
        </div>

        {/* Header */}
        <header className="glass border-b border-white/20 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl float p-3">
                <Brain className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                  Startup Document Analyzer
                </h1>
                <p className="text-white/80 text-base md:text-xl">
                  AI-powered analysis of documents, emails, and call transcripts
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3 text-white/70 bg-white/10 px-4 py-2 rounded-full">
                  <Sparkles className="w-5 h-5" aria-hidden="true" />
                  <span className="text-sm md:text-base font-medium">Powered by Gemini AI</span>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main id="main-content" className="container mx-auto px-4 py-8">
          {/* Tab Navigation */}
          <div className="card mb-10">
            <div 
              className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-200/50"
              role="tablist"
              aria-label="Analysis type selection"
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={el => tabRefs.current[tab.id] = el}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setAnnouncement(`Switched to ${tab.label} tab`);
                    }}
                    className={`flex flex-col items-center justify-center py-6 md:py-8 px-4 font-semibold transition-all duration-300 relative group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${isActive
                        ? 'text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`tabpanel-${tab.id}`}
                    id={`tab-${tab.id}`}
                    tabIndex={isActive ? 0 : -1}
                    title={`${tab.label} - Use arrow keys to navigate`}
                  >
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-t-xl`} />
                    )}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`p-3 rounded-xl transition-colors duration-300 ${
                        isActive 
                          ? 'bg-white/20' 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <Icon 
                          className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${
                            isActive ? 'text-white' : 'text-gray-600 group-hover:text-gray-700'
                          }`} 
                          aria-hidden="true"
                        />
                      </div>
                      <span className="text-sm md:text-base mt-1">{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-6 md:p-10">
              {/* Document Analysis Tab */}
              {activeTab === 'document' && (
                <div 
                  role="tabpanel"
                  id="tabpanel-document"
                  aria-labelledby="tab-document"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                      <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                        Upload Startup Document
                      </h2>
                      <p className="text-gray-600 text-sm md:text-lg">
                        Upload pitch decks, business plans, or other startup materials for comprehensive AI analysis.
                      </p>
                    </div>
                  </div>
                  <FileUpload
                    onFileUpload={handleDocumentUpload}
                    accept=".pdf,.pptx,.ppt"
                    maxSize={10 * 1024 * 1024} // 10MB
                  />
                </div>
              )}

              {/* Email Analysis Tab */}
              {activeTab === 'email' && (
                <div 
                  role="tabpanel"
                  id="tabpanel-email"
                  aria-labelledby="tab-email"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                      <Mail className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                        Email Communication Analysis
                      </h2>
                      <p className="text-gray-600 text-sm md:text-lg">
                        Paste email communications between founders and investors for detailed analysis.
                      </p>
                    </div>
                  </div>
                  <TextInput
                    onAnalyze={handleEmailAnalysis}
                    placeholder="Paste email content here..."
                    buttonText="Analyze Email"
                  />
                </div>
              )}

              {/* Call Analysis Tab */}
              {activeTab === 'call' && (
                <div 
                  role="tabpanel"
                  id="tabpanel-call"
                  aria-labelledby="tab-call"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="p-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg">
                      <Phone className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                        Call Transcript Analysis
                      </h2>
                      <p className="text-gray-600 text-sm md:text-lg">
                        Paste call transcripts or meeting notes for comprehensive analysis.
                      </p>
                    </div>
                  </div>
                  <TextInput
                    onAnalyze={handleCallAnalysis}
                    placeholder="Paste call transcript here..."
                    buttonText="Analyze Call"
                  />
                </div>
              )}

              {/* Fact Check Tab */}
              {activeTab === 'factcheck' && (
                <div 
                  role="tabpanel"
                  id="tabpanel-factcheck"
                  aria-labelledby="tab-factcheck"
                  tabIndex={0}
                >
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                      <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                        AI Fact Checker
                      </h2>
                      <p className="text-gray-600 text-sm md:text-lg">
                        Verify claims, check data accuracy, and validate information with web search capabilities.
                      </p>
                    </div>
                  </div>
                
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200">
                      <div className="flex items-center gap-3 mb-4">
                        <BarChart2 className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                        <h3 className="text-lg font-semibold text-emerald-800">
                          Fact-Checking Capabilities
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-emerald-700">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                          <span>Data normalization and validation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                          <span>Web search verification</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                          <span>Internal consistency checks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                          <span>Mathematical verification</span>
                        </div>
                      </div>
                    </div>
                    
                    <FactCheckInput onFactCheck={handleFactCheck} />
                  </div>
                </div>
              )}
          </div>
        </div>

          {/* Loading State */}
          {isLoading && (
            <div className="card text-center" role="status" aria-live="polite">
              <div className="loading">
                <div className="relative">
                  <Loader2 className="w-8 h-8 md:w-12 md:h-12 animate-spin text-blue-500" aria-hidden="true" />
                  <Zap className="w-4 h-4 md:w-6 md:h-6 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
                </div>
                <span className="text-lg md:text-xl font-semibold mt-4">
                  Analyzing content with AI...
                </span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="error" role="alert" aria-live="assertive">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6" aria-hidden="true" />
                <span className="font-semibold text-lg">Analysis Error</span>
              </div>
              <p className="mt-2">{error}</p>
            </div>
          )}

          {/* Results */}
          {results && !isLoading && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl">
                <CheckCircle className="w-6 h-6" aria-hidden="true" />
                <span className="font-semibold text-lg">Analysis Complete</span>
                <Sparkles className="w-5 h-5 ml-auto" aria-hidden="true" />
              </div>
              <AnalysisResults results={results} />
            </div>
          )}
      </main>

      {/* Footer */}
      <footer className="glass border-t border-white/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white/80">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">Powered by Google Gemini AI</span>
            </div>
            <p className="text-sm">Built for comprehensive startup analysis</p>
          </div>
        </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;