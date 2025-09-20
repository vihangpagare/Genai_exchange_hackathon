import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, Users, Calendar, MapPin, Globe, Mail, Phone, Star, TrendingUp, BarChart3, FileText, DollarSign, Target, Shield, Eye, ChevronRight, Sparkles, Heart, Rocket, ChevronDown, ChevronUp } from 'lucide-react';
import firebaseService from '../services/firebaseService';
import StartupChatbot from './StartupChatbot';

const StartupDetailView = ({ startup, onBack }) => {
  const [analytics, setAnalytics] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedAnalysis, setExpandedAnalysis] = useState({});
  const [startupData, setStartupData] = useState(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [showStaticContent, setShowStaticContent] = useState(false);

  useEffect(() => {
    if (startup?.id) {
      // Show static content immediately
      setStartupData(startup);
      setShowStaticContent(true);
      
      // Start background data fetching
      fetchStartupData();
      
      // Set a timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        setLoadingTimeout(true);
      }, 3000); // 3 second timeout
      
      return () => clearTimeout(timeout);
    }
  }, [startup]);

  const fetchStartupData = async () => {
    try {
      setDataLoading(true);
      setLoading(true);
      
      // Set mock analytics immediately (no API call needed)
      setAnalytics({
        totalAnalyses: 5,
        averageScore: startup.overallScore || 85,
        lastAnalysisDate: '2024-01-15',
        analysisBreakdown: {
          documentAnalysis: { score: 88, completed: true },
          emailAnalysis: { score: 82, completed: true },
          businessModelAnalysis: { score: 90, completed: true },
          marketIntelligenceAnalysis: { score: 85, completed: true },
          riskAssessmentAnalysis: { score: 78, completed: true }
        }
      });
      
      // Try to fetch real startup data from Firestore in background
      try {
        const realStartup = await firebaseService.getStartup(startup.id);
        if (realStartup) {
          setStartupData(realStartup);
        }
      } catch (firebaseError) {
        console.warn('Firebase fetch failed, using passed data:', firebaseError);
      }
      
      // Try to fetch analysis data in background (optional)
      try {
        const analysis = await firebaseService.getAnalysisByStartup(startup.id);
        setAnalysisData(analysis);
      } catch (analysisError) {
        console.warn('Analysis fetch failed:', analysisError);
        setAnalysisData(null);
      }
      
    } catch (error) {
      console.error('Error in fetchStartupData:', error);
    } finally {
      setDataLoading(false);
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-100 border border-emerald-200';
    if (score >= 60) return 'text-amber-700 bg-amber-100 border border-amber-200';
    return 'text-rose-700 bg-rose-100 border border-rose-200';
  };

  const toggleAnalysis = (analysisType) => {
    setExpandedAnalysis(prev => ({
      ...prev,
      [analysisType]: !prev[analysisType]
    }));
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Eye },
    { id: 'analysis', name: 'Analysis', icon: BarChart3 },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'documents', name: 'Documents', icon: FileText },
    { id: 'team', name: 'Team', icon: Users }
  ];

  // Show loading only if we don't have any data and haven't timed out
  if (!showStaticContent && !loadingTimeout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Loading startup details...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching data from database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-xl border-b-2 border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-6">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-purple-200"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="font-bold">Back</span>
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-xl">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-gray-900">{startupData.companyName || startupData.name}</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-gray-600 text-lg">{startupData.industry || startupData.sector}</p>
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-bold">
                      {startupData.stage}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {startup.overallScore && (
                <div className={`px-6 py-3 rounded-2xl text-lg font-black ${getScoreColor(startup.overallScore)} shadow-lg`}>
                  {startup.overallScore}/100
                </div>
              )}
              <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold">
                <Heart className="h-5 w-5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-2 mb-8">
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Company Description */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                  <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center space-x-2">
                    <FileText className="h-6 w-6 text-purple-600" />
                    <span>About {startup.companyName}</span>
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed font-medium">
                    {startupData.description || 'No description available for this startup.'}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                  <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center space-x-2">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                    <span>Key Metrics</span>
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-200">
                      <Users className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                      <div className="text-2xl font-black text-gray-900">{startupData.teamSize || 'N/A'}</div>
                      <div className="text-sm font-bold text-gray-600">Team Size</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                      <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-black text-gray-900">{startupData.foundedYear || 'N/A'}</div>
                      <div className="text-sm font-bold text-gray-600">Founded</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                      <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-black text-gray-900">{startupData.stage || 'N/A'}</div>
                      <div className="text-sm font-bold text-gray-600">Stage</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                      <Target className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                      <div className="text-2xl font-black text-gray-900">{startupData.industry || startupData.sector || 'N/A'}</div>
                      <div className="text-sm font-bold text-gray-600">Sector</div>
                    </div>
                  </div>
                </div>

                {/* Analysis Results */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                  <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center space-x-2">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                    <span>Analysis Results</span>
                    {loading && (
                      <div className="ml-2 animate-spin rounded-full h-5 w-5 border-2 border-purple-200 border-t-purple-600"></div>
                    )}
                  </h2>
                  
                  {analytics ? (
                    <div className="space-y-4">
                      {Object.entries(analytics.analysisBreakdown || {}).map(([analysis, data]) => (
                        <div key={analysis} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                              <FileText className="h-5 w-5 text-purple-600" />
                            </div>
                            <span className="font-bold text-gray-800 capitalize">
                              {analysis.replace('Analysis', ' Analysis')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(data.score)}`}>
                              {data.score}/100
                            </div>
                            <div className={`w-3 h-3 rounded-full ${data.completed ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 animate-pulse">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-200 rounded-xl w-9 h-9"></div>
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-8">
                {/* Analysis Overview */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                  <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center space-x-2">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                    <span>AI Analysis Results</span>
                    {dataLoading && (
                      <div className="ml-2 animate-spin rounded-full h-5 w-5 border-2 border-purple-200 border-t-purple-600"></div>
                    )}
                  </h2>
                  
                  {analysisData ? (
                    <>
                      {analysisData.individualAnalyses && Object.keys(analysisData.individualAnalyses).length > 0 ? (
                        <div className="space-y-4">
                          {Object.entries(analysisData.individualAnalyses).map(([analysisType, analysis]) => (
                            <div key={analysisType} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 overflow-hidden">
                              <button
                                onClick={() => toggleAnalysis(analysisType)}
                                className="w-full p-6 text-left flex items-center justify-between hover:bg-purple-100 transition-colors duration-200"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="p-2 bg-white rounded-xl shadow-sm">
                                    <BarChart3 className="h-5 w-5 text-purple-600" />
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-bold text-gray-800 capitalize">
                                      {analysisType.replace(/([A-Z])/g, ' $1').trim()} Analysis
                                    </h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                      <span>Status: {analysis.status || 'Completed'}</span>
                                      <span>Confidence: {analysis.confidence || 'High'}</span>
                                    </div>
                                  </div>
                                </div>
                                {expandedAnalysis[analysisType] ? (
                                  <ChevronUp className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                              
                              {expandedAnalysis[analysisType] && (
                                <div className="px-6 pb-6 border-t border-purple-200 bg-white/50">
                                  <div className="pt-4 prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                      {analysis.response || analysis.analysis || 'Analysis completed but no detailed results available.'}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : analysisData.concatenatedText ? (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 overflow-hidden">
                          <button
                            onClick={() => toggleAnalysis('comprehensive')}
                            className="w-full p-6 text-left flex items-center justify-between hover:bg-purple-100 transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-white rounded-xl shadow-sm">
                                <BarChart3 className="h-5 w-5 text-purple-600" />
                              </div>
                              <h3 className="text-lg font-bold text-gray-800">Comprehensive Analysis</h3>
                            </div>
                            {expandedAnalysis.comprehensive ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                          
                          {expandedAnalysis.comprehensive && (
                            <div className="px-6 pb-6 border-t border-purple-200 bg-white/50">
                              <div className="pt-4 prose max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                  {analysisData.concatenatedText}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500 text-lg">No analysis data available for this startup</p>
                        </div>
                      )}
                    </>
                  ) : dataLoading ? (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Analysis...</h3>
                        <p className="text-gray-500">Fetching analysis data from database</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                      <div className="text-center py-12">
                        <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">No Analysis Available</h3>
                        <p className="text-gray-500">This startup hasn't been analyzed yet. Analysis will appear here once completed.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Analysis Metadata */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                  <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center space-x-2">
                    <Target className="h-6 w-6 text-purple-600" />
                    <span>Analysis Details</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                      <div className="text-2xl font-black text-gray-900">
                        {analysisData && analysisData.individualAnalyses ? Object.keys(analysisData.individualAnalyses).length : 0}
                      </div>
                      <div className="text-sm font-bold text-gray-600">Analysis Types</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                      <div className="text-2xl font-black text-gray-900">
                        {analysisData?.status || 'Completed'}
                      </div>
                      <div className="text-sm font-bold text-gray-600">Status</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                      <div className="text-2xl font-black text-gray-900">
                        {analysisData?.confidence || 'High'}
                      </div>
                      <div className="text-sm font-bold text-gray-600">Confidence</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Detailed Analytics</h2>
                <p className="text-gray-600">Analytics data will be displayed here...</p>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Documents</h2>
                <p className="text-gray-600">Document management will be displayed here...</p>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Team Information</h2>
                <p className="text-gray-600">Team details will be displayed here...</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-black text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-bold">
                  <Mail className="h-5 w-5" />
                  <span>Contact Startup</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-bold">
                  <FileText className="h-5 w-5" />
                  <span>Request Analysis</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-bold">
                  <Calendar className="h-5 w-5" />
                  <span>Schedule Meeting</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* RAG Chatbot */}
      {startupData && (
        <StartupChatbot 
          startupId={startupData.id} 
          startupData={startupData}
          isOpen={isChatbotOpen} 
          onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
        />
      )}
    </div>
  );
};

export default StartupDetailView;