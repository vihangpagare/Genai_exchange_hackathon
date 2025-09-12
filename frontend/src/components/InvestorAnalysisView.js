import React, { useState, useEffect } from 'react';
import { ArrowLeft, Building2, BarChart3, Shield, Target, DollarSign, Mail, Phone, FileText, CheckCircle, AlertTriangle, TrendingUp, Users, Calendar, Star } from 'lucide-react';
import firebaseService from '../services/firebaseService';

const InvestorAnalysisView = ({ startupId, onBack }) => {
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStartupData();
  }, [startupId]);

  const fetchStartupData = async () => {
    try {
      setLoading(true);
      const startupData = await firebaseService.getStartup(startupId);
      setStartup(startupData);
    } catch (error) {
      console.error('Error fetching startup data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'Low', color: 'text-green-600 bg-green-100' };
    if (score >= 60) return { level: 'Medium', color: 'text-yellow-600 bg-yellow-100' };
    return { level: 'High', color: 'text-red-600 bg-red-100' };
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'business', label: 'Business Model', icon: DollarSign },
    { id: 'market', label: 'Market Intelligence', icon: Target },
    { id: 'risk', label: 'Risk Assessment', icon: Shield },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'communications', label: 'Communications', icon: Mail }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Startup not found</h3>
          <p className="text-gray-500 mb-4">The requested startup could not be found.</p>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{startup.companyName}</h1>
                  <p className="text-gray-600">{startup.sector} • {startup.stage}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {startup.overallScore && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(startup.overallScore)}`}>
                  Score: {startup.overallScore}/100
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && <OverviewTab startup={startup} getScoreColor={getScoreColor} getRiskLevel={getRiskLevel} />}
          {activeTab === 'business' && <BusinessModelTab analysis={startup.businessModelAnalysis} />}
          {activeTab === 'market' && <MarketIntelligenceTab analysis={startup.marketIntelligenceAnalysis} />}
          {activeTab === 'risk' && <RiskAssessmentTab analysis={startup.riskAssessmentAnalysis} />}
          {activeTab === 'documents' && <DocumentsTab analysis={startup.documentAnalysis} />}
          {activeTab === 'communications' && <CommunicationsTab emailAnalysis={startup.emailAnalysis} callAnalysis={startup.callAnalysis} />}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ startup, getScoreColor, getRiskLevel }) => {
  const metrics = [
    { label: 'Overall Score', value: startup.overallScore || 75, color: getScoreColor(startup.overallScore || 75) },
    { label: 'Market Potential', value: startup.marketScore || 70, color: getScoreColor(startup.marketScore || 70) },
    { label: 'Business Model', value: startup.businessScore || 65, color: getScoreColor(startup.businessScore || 65) },
    { label: 'Risk Level', value: getRiskLevel(startup.riskScore || 60).level, color: getRiskLevel(startup.riskScore || 60).color }
  ];

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${metric.color}`}>
                {typeof metric.value === 'number' ? `${metric.value}/100` : metric.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Company Name</p>
                <p className="text-gray-900">{startup.companyName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Sector</p>
                <p className="text-gray-900">{startup.sector || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Stage</p>
                <p className="text-gray-900">{startup.stage || 'Not specified'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Team Size</p>
                <p className="text-gray-900">{startup.teamSize || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Founded</p>
                <p className="text-gray-900">{startup.foundedYear || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-600">Funding</p>
                <p className="text-gray-900">{startup.fundingAmount || 'Not disclosed'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {startup.description && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
          <p className="text-gray-700 leading-relaxed">{startup.description}</p>
        </div>
      )}
    </div>
  );
};

// Business Model Tab Component
const BusinessModelTab = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Business Model Analysis</h3>
        <p className="text-gray-500">This startup hasn't been analyzed for business model yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Model Analysis</h3>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: analysis.analysis || 'No analysis available' }} />
        </div>
      </div>
    </div>
  );
};

// Market Intelligence Tab Component
const MarketIntelligenceTab = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Market Intelligence Analysis</h3>
        <p className="text-gray-500">This startup hasn't been analyzed for market intelligence yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Intelligence Analysis</h3>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: analysis.analysis || 'No analysis available' }} />
        </div>
      </div>
    </div>
  );
};

// Risk Assessment Tab Component
const RiskAssessmentTab = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Risk Assessment Analysis</h3>
        <p className="text-gray-500">This startup hasn't been analyzed for risk assessment yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment Analysis</h3>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: analysis.analysis || 'No analysis available' }} />
        </div>
      </div>
    </div>
  );
};

// Documents Tab Component
const DocumentsTab = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Document Analysis</h3>
        <p className="text-gray-500">This startup hasn't uploaded any documents for analysis yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Analysis</h3>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: analysis.analysis || 'No analysis available' }} />
        </div>
      </div>
    </div>
  );
};

// Communications Tab Component
const CommunicationsTab = ({ emailAnalysis, callAnalysis }) => {
  return (
    <div className="space-y-6">
      {/* Email Analysis */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Mail className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Email Analysis</h3>
        </div>
        {emailAnalysis ? (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: emailAnalysis.analysis || 'No analysis available' }} />
          </div>
        ) : (
          <p className="text-gray-500">No email analysis available</p>
        )}
      </div>

      {/* Call Analysis */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Phone className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Call Analysis</h3>
        </div>
        {callAnalysis ? (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: callAnalysis.analysis || 'No analysis available' }} />
          </div>
        ) : (
          <p className="text-gray-500">No call analysis available</p>
        )}
      </div>
    </div>
  );
};

export default InvestorAnalysisView;

