import React, { useState } from 'react';
import { Upload, FileText, Mail, Phone, Loader2, CheckCircle, AlertCircle, Sparkles, Brain, Zap } from 'lucide-react';
import FileUpload from './components/FileUpload';
import AnalysisResults from './components/AnalysisResults';
import TextInput from './components/TextInput';
import { analyzeDocument, analyzeEmail, analyzeCall } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('document');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

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

  const tabs = [
    { id: 'document', label: 'Document Analysis', icon: FileText, color: 'from-blue-500 to-purple-600' },
    { id: 'email', label: 'Email Analysis', icon: Mail, color: 'from-purple-500 to-pink-600' },
    { id: 'call', label: 'Call Analysis', icon: Phone, color: 'from-indigo-500 to-blue-600' }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-white/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg float">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Startup Document Analyzer</h1>
              <p className="text-white/80 text-lg">AI-powered analysis of startup documents, emails, and call transcripts</p>
            </div>
            <div className="ml-auto flex items-center gap-2 text-white/60">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Powered by Gemini AI</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="card mb-8">
          <div className="flex border-b border-gray-200/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-8 py-6 font-semibold transition-all duration-300 relative ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {activeTab === tab.id && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-t-xl`} />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      activeTab === tab.id 
                        ? 'bg-white/20' 
                        : 'bg-gray-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        activeTab === tab.id ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    {tab.label}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-8">
            {/* Document Analysis Tab */}
            {activeTab === 'document' && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Upload Startup Document</h2>
                    <p className="text-gray-600">
                      Upload PDF documents, pitch decks, or other startup materials for comprehensive AI analysis.
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
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Email Communication Analysis</h2>
                    <p className="text-gray-600">
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
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Call Transcript Analysis</h2>
                    <p className="text-gray-600">
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
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="card text-center">
            <div className="loading">
              <div className="relative">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <Zap className="w-4 h-4 text-purple-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <span className="text-lg font-semibold">Analyzing content with AI...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6" />
              <span className="font-semibold text-lg">Analysis Error</span>
            </div>
            <p className="mt-2">{error}</p>
          </div>
        )}

        {/* Results */}
        {results && !isLoading && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl">
              <CheckCircle className="w-6 h-6" />
              <span className="font-semibold text-lg">Analysis Complete</span>
              <Sparkles className="w-5 h-5 ml-auto" />
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
            <p>Built for comprehensive startup analysis</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
