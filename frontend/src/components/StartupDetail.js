import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, MapPin, Calendar, Users, DollarSign, TrendingUp, AlertTriangle, PieChart, BarChart3, FileText, Mail, Phone, Shield, Target, Star, ExternalLink } from 'lucide-react';
import firebaseService from '../services/firebaseService';

const StartupDetail = ({ startup, onBack, userType }) => {
  const [analyses, setAnalyses] = useState([]);
  const [financialMetrics, setFinancialMetrics] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadStartupDetails();
  }, [startup]);

  const loadStartupDetails = async () => {
    try {
      setLoading(true);
      
      // Load all related data
      const [
        analysesData,
        financialData,
        teamData,
        marketData,
        competitorsData
      ] = await Promise.all([
        firebaseService.getAnalysesByStartup(startup.id),
        firebaseService.getFinancialMetricsByStartup(startup.id),
        firebaseService.getTeamMembersByStartup(startup.id),
        firebaseService.getMarketDataByStartup(startup.id),
        firebaseService.getCompetitorsByStartup(startup.id)
      ]);

      setAnalyses(analysesData);
      setFinancialMetrics(financialData);
      setTeamMembers(teamData);
      setMarketData(marketData);
      setCompetitors(competitorsData);
    } catch (error) {
      console.error('Error loading startup details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAnalysisTypeIcon = (type) => {
    const icons = {
      'document': FileText,
      'email': Mail,
      'call': Phone,
      'factcheck': Shield,
      'business_model': PieChart,
      'market_intelligence': TrendingUp,
      'risk_assessment': AlertTriangle,
      'comprehensive': Target
    };
    return icons[type] || FileText;
  };

  const getAnalysisTypeColor = (type) => {
    const colors = {
      'document': 'from-blue-500 to-purple-600',
      'email': 'from-purple-500 to-pink-600',
      'call': 'from-indigo-500 to-blue-600',
      'factcheck': 'from-emerald-500 to-teal-600',
      'business_model': 'from-orange-500 to-red-600',
      'market_intelligence': 'from-green-500 to-emerald-600',
      'risk_assessment': 'from-red-500 to-pink-600',
      'comprehensive': 'from-violet-500 to-purple-600'
    };
    return colors[type] || 'from-gray-500 to-gray-600';
  };

  const getStageColor = (stage) => {
    const colors = {
      'pre-seed': 'bg-yellow-100 text-yellow-800',
      'seed': 'bg-green-100 text-green-800',
      'series-a': 'bg-blue-100 text-blue-800',
      'series-b': 'bg-purple-100 text-purple-800',
      'series-c': 'bg-pink-100 text-pink-800',
      'growth': 'bg-indigo-100 text-indigo-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'analyses', label: 'Analyses', icon: BarChart3 },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'market', label: 'Market', icon: TrendingUp }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading startup details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">{startup.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
              {startup.stage && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(startup.stage)}`}>
                  {startup.stage}
                </span>
              )}
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <Star className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Startup Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{startup.name}</h2>
              <p className="text-gray-600 mb-4">{startup.description || 'No description available.'}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {startup.industry && (
                  <div className="flex items-center space-x-1">
                    <Building2 className="h-4 w-4" />
                    <span>{startup.industry}</span>
                  </div>
                )}
                {startup.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{startup.location}</span>
                  </div>
                )}
                {startup.foundedYear && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Founded {startup.foundedYear}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total Analyses</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{analyses.length}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Financial Metrics</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{financialMetrics.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
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
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analyses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {analyses.slice(0, 6).map((analysis, index) => {
                      const Icon = getAnalysisTypeIcon(analysis.analysisType);
                      return (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`h-8 w-8 bg-gradient-to-r ${getAnalysisTypeColor(analysis.analysisType)} rounded-lg flex items-center justify-center`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {analysis.analysisType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {new Date(analysis.createdAt?.toDate?.() || analysis.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {analysis.analysisData?.analysis?.substring(0, 100)}...
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analyses' && (
              <div className="space-y-6">
                {analyses.map((analysis, index) => {
                  const Icon = getAnalysisTypeIcon(analysis.analysisType);
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`h-10 w-10 bg-gradient-to-r ${getAnalysisTypeColor(analysis.analysisType)} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {analysis.analysisType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(analysis.createdAt?.toDate?.() || analysis.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                          {analysis.analysisData?.analysis || 'No analysis data available.'}
                        </pre>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'financials' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Financial Metrics</h3>
                {financialMetrics.length === 0 ? (
                  <p className="text-gray-500">No financial metrics available.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {financialMetrics.map((metric, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{metric.metricName}</h4>
                        <p className="text-2xl font-bold text-blue-600">
                          {metric.metricValue?.toLocaleString()} {metric.metricUnit}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Confidence: {Math.round((metric.confidence || 0) * 100)}%
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                {teamMembers.length === 0 ? (
                  <p className="text-gray-500">No team information available.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{member.name}</h4>
                        {member.title && (
                          <p className="text-sm text-gray-600 mb-2">{member.title}</p>
                        )}
                        {member.isFounder && (
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            Founder
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'market' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Market Data</h3>
                {marketData.length === 0 ? (
                  <p className="text-gray-500">No market data available.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {marketData.map((data, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{data.dataType}</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {data.value?.toLocaleString()} {data.unit}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Confidence: {Math.round((data.confidence || 0) * 100)}%
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                
                {competitors.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Competitors</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {competitors.map((competitor, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900">{competitor.competitorName}</h5>
                          {competitor.description && (
                            <p className="text-sm text-gray-600 mt-1">{competitor.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupDetail;
