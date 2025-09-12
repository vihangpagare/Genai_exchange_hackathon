import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Users, Calendar, Star, ChevronRight, Eye, DollarSign, Target, Building2, LogOut, Sparkles, Heart, Rocket } from 'lucide-react';
import firebaseService from '../services/firebaseService';

const InvestorsPage = ({ user, userType, onLogout }) => {
  const [investors, setInvestors] = useState([]);
  const [filteredInvestors, setFilteredInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    sector: '',
    investmentRange: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchInvestors();
  }, []);

  useEffect(() => {
    filterInvestors();
  }, [investors, searchTerm, selectedFilters]);

  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const allInvestors = await firebaseService.getAllInvestors();
      setInvestors(allInvestors);
    } catch (error) {
      console.error('Error fetching investors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterInvestors = () => {
    let filtered = investors.filter(investor => {
      const matchesSearch = investor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           investor.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           investor.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           investor.sectors?.some(sector => sector.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSector = !selectedFilters.sector || 
                           investor.sectors?.includes(selectedFilters.sector);
      const matchesRange = !selectedFilters.investmentRange || 
                          investor.investmentRange === selectedFilters.investmentRange;
      const matchesLocation = !selectedFilters.location || 
                             investor.location?.toLowerCase().includes(selectedFilters.location.toLowerCase());
      
      return matchesSearch && matchesSector && matchesRange && matchesLocation;
    });
    
    setFilteredInvestors(filtered);
  };

  const getSectors = () => {
    const allSectors = investors.flatMap(investor => investor.sectors || []);
    const uniqueSectors = [...new Set(allSectors)];
    return uniqueSectors.sort();
  };

  const getInvestmentRanges = () => {
    const ranges = [...new Set(investors.map(investor => investor.investmentRange).filter(Boolean))];
    return ranges.sort();
  };

  const getLocations = () => {
    const locations = [...new Set(investors.map(investor => investor.location).filter(Boolean))];
    return locations.sort();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
        {/* Floating gradient shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
        
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg font-medium">Loading investors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Floating gradient shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-bounce"></div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-lg border-b-2 border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl font-black text-gray-900">All Investors</h1>
                <Sparkles className="h-6 w-6 text-pink-500" />
              </div>
              <p className="text-gray-600 text-lg font-medium">Connect with experienced investors</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-4 py-2 bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-2xl">
                <div className="text-sm font-bold text-pink-700">
                  {filteredInvestors.length} of {investors.length} investors
                </div>
              </div>
              {user && (
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 rounded-2xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-200 hover:border-red-300 font-bold"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-pink-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-400" />
                <input
                  type="text"
                  placeholder="Search investors by name, company, or sectors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-pink-200 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all duration-300 text-lg font-medium"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 px-6 py-4 border-2 border-pink-200 rounded-2xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-105 font-bold text-pink-700"
            >
              <Filter className="h-5 w-5" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-8 pt-8 border-t-2 border-pink-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sector Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Sector Focus</label>
                  <select
                    value={selectedFilters.sector}
                    onChange={(e) => setSelectedFilters({...selectedFilters, sector: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all duration-300 font-medium"
                  >
                    <option value="">All Sectors</option>
                    {getSectors().map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>

                {/* Investment Range Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Investment Range</label>
                  <select
                    value={selectedFilters.investmentRange}
                    onChange={(e) => setSelectedFilters({...selectedFilters, investmentRange: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all duration-300 font-medium"
                  >
                    <option value="">All Ranges</option>
                    {getInvestmentRanges().map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Location</label>
                  <select
                    value={selectedFilters.location}
                    onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-pink-200 rounded-2xl focus:ring-4 focus:ring-pink-200 focus:border-pink-400 transition-all duration-300 font-medium"
                  >
                    <option value="">All Locations</option>
                    {getLocations().map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Investors Grid */}
        {filteredInvestors.length === 0 ? (
          <div className="text-center py-16 relative z-10">
            <div className="p-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl inline-block mb-6">
              <TrendingUp className="h-16 w-16 text-pink-600 mx-auto" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">No investors found</h3>
            <p className="text-gray-600 text-lg font-medium">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInvestors.map((investor) => (
              <InvestorCard key={investor.id} investor={investor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const InvestorCard = ({ investor }) => {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-pink-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-pink-200 group">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">{investor.name || 'Investor'}</h3>
              <p className="text-sm text-pink-600 font-bold">{investor.company || 'Investment Firm'}</p>
            </div>
          </div>
          {investor.experience && (
            <div className="px-3 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 border border-pink-200">
              {investor.experience}+ years
            </div>
          )}
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-base mb-6 leading-relaxed font-medium line-clamp-3">
          {investor.bio || 'Experienced investor looking for promising opportunities'}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-emerald-500" />
              <span className="font-bold">{investor.investmentRange || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span className="font-bold">{investor.investmentsCount || 0} deals</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-purple-500" />
            <span className="font-bold">{investor.location || 'N/A'}</span>
          </div>
        </div>

        {/* Sectors */}
        {investor.sectors && investor.sectors.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {investor.sectors.slice(0, 3).map((sector, index) => (
                <span key={index} className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 text-xs rounded-full font-bold border border-pink-200">
                  {sector}
                </span>
              ))}
              {investor.sectors.length > 3 && (
                <span className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 text-xs rounded-full font-bold border border-gray-200">
                  +{investor.sectors.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 font-black text-lg shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-pink-300">
          <Eye className="h-5 w-5" />
          <span>Connect</span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default InvestorsPage;

