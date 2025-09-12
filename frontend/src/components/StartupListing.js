import React, { useState, useEffect } from 'react';
import { Search, Filter, Building2, TrendingUp, Users, Calendar, Star, ChevronRight, Eye, BarChart3, Shield, Target, DollarSign, LogOut } from 'lucide-react';
import firebaseService from '../services/firebaseService';

const StartupListing = ({ user, onStartupSelect, onLogout }) => {
  const [startups, setStartups] = useState([]);
  const [filteredStartups, setFilteredStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    sector: '',
    stage: '',
    hasAnalysis: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchStartups();
  }, []);

  useEffect(() => {
    filterStartups();
  }, [startups, searchTerm, selectedFilters]);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      const allStartups = await firebaseService.getAllStartups();
      setStartups(allStartups);
    } catch (error) {
      console.error('Error fetching startups:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStartups = () => {
    let filtered = startups.filter(startup => {
      const matchesSearch = startup.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           startup.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           startup.sector?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSector = !selectedFilters.sector || startup.sector === selectedFilters.sector;
      const matchesStage = !selectedFilters.stage || startup.stage === selectedFilters.stage;
      const matchesAnalysis = selectedFilters.hasAnalysis === 'all' || 
                             (selectedFilters.hasAnalysis === 'yes' && startup.hasAnalysis) ||
                             (selectedFilters.hasAnalysis === 'no' && !startup.hasAnalysis);
      
      return matchesSearch && matchesSector && matchesStage && matchesAnalysis;
    });
    
    setFilteredStartups(filtered);
  };

  const getSectors = () => {
    const sectors = [...new Set(startups.map(startup => startup.sector).filter(Boolean))];
    return sectors.sort();
  };

  const getStages = () => {
    const stages = [...new Set(startups.map(startup => startup.stage).filter(Boolean))];
    return stages.sort();
  };

  const getAnalysisCount = (startup) => {
    let count = 0;
    if (startup.documentAnalysis) count++;
    if (startup.emailAnalysis) count++;
    if (startup.callAnalysis) count++;
    if (startup.factCheckAnalysis) count++;
    if (startup.businessModelAnalysis) count++;
    if (startup.marketIntelligenceAnalysis) count++;
    if (startup.riskAssessmentAnalysis) count++;
    if (startup.comprehensiveAnalysis) count++;
    return count;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading startups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Startup Portfolio</h1>
              <p className="text-gray-600 mt-1">Discover and analyze promising startups</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                {filteredStartups.length} of {startups.length} startups
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search startups by name, description, or sector..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sector Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                  <select
                    value={selectedFilters.sector}
                    onChange={(e) => setSelectedFilters({...selectedFilters, sector: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Sectors</option>
                    {getSectors().map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>

                {/* Stage Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                  <select
                    value={selectedFilters.stage}
                    onChange={(e) => setSelectedFilters({...selectedFilters, stage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Stages</option>
                    {getStages().map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>

                {/* Analysis Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Status</label>
                  <select
                    value={selectedFilters.hasAnalysis}
                    onChange={(e) => setSelectedFilters({...selectedFilters, hasAnalysis: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Startups</option>
                    <option value="yes">With Analysis</option>
                    <option value="no">Without Analysis</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Startups Grid */}
        {filteredStartups.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No startups found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} getAnalysisCount={getAnalysisCount} getScoreColor={getScoreColor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StartupCard = ({ startup, getAnalysisCount, getScoreColor }) => {
  const analysisCount = getAnalysisCount(startup);
  const hasAnalysis = analysisCount > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{startup.companyName}</h3>
              <p className="text-sm text-gray-500">{startup.sector}</p>
            </div>
          </div>
          {hasAnalysis && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(startup.overallScore || 75)}`}>
              {startup.overallScore || 75}/100
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {startup.description || 'No description available'}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{startup.teamSize || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{startup.foundedYear || 'N/A'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <BarChart3 className="h-4 w-4" />
            <span>{analysisCount} analyses</span>
          </div>
        </div>

        {/* Analysis Types Available */}
        {hasAnalysis && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {startup.documentAnalysis && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Document</span>
              )}
              {startup.emailAnalysis && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Email</span>
              )}
              {startup.callAnalysis && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Call</span>
              )}
              {startup.businessModelAnalysis && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Business Model</span>
              )}
              {startup.marketIntelligenceAnalysis && (
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">Market Intel</span>
              )}
              {startup.riskAssessmentAnalysis && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Risk Assessment</span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onStartupSelect(startup)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
        >
          <Eye className="h-4 w-4" />
          <span>View Analysis</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default StartupListing;
