import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Building2, MapPin, Calendar, Star, LogOut, User, Eye, BarChart3, AlertTriangle, PieChart } from 'lucide-react';
import firebaseService from '../services/firebaseService';

const InvestorDashboard = ({ user, onLogout, onStartupSelect }) => {
  const [startups, setStartups] = useState([]);
  const [filteredStartups, setFilteredStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const categories = [
    'all', 'fintech', 'healthtech', 'edtech', 'saas', 'ecommerce',
    'ai', 'machine learning', 'blockchain', 'cybersecurity',
    'biotech', 'cleantech', 'agtech', 'proptech'
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'industry', label: 'Industry' },
    { value: 'stage', label: 'Stage' }
  ];

  useEffect(() => {
    loadStartups();
  }, []);

  useEffect(() => {
    filterAndSortStartups();
  }, [startups, searchTerm, selectedCategory, sortBy]);

  const loadStartups = async () => {
    try {
      setLoading(true);
      const allStartups = await firebaseService.getAllStartups();
      setStartups(allStartups);
    } catch (error) {
      console.error('Error loading startups:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStartups = () => {
    let filtered = startups;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(startup =>
        startup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        startup.industry?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(startup =>
        startup.industry?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'industry':
          return (a.industry || '').localeCompare(b.industry || '');
        case 'stage':
          return (a.stage || '').localeCompare(b.stage || '');
        case 'recent':
        default:
          return new Date(b.createdAt?.toDate?.() || b.createdAt || 0) - 
                 new Date(a.createdAt?.toDate?.() || a.createdAt || 0);
      }
    });

    setFilteredStartups(filtered);
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

  const getIndustryIcon = (industry) => {
    const icons = {
      'fintech': '💰',
      'healthtech': '🏥',
      'edtech': '🎓',
      'saas': '☁️',
      'ecommerce': '🛒',
      'ai': '🤖',
      'blockchain': '⛓️',
      'cybersecurity': '🔒',
      'biotech': '🧬',
      'cleantech': '🌱',
      'agtech': '🌾',
      'proptech': '🏠'
    };
    return icons[industry?.toLowerCase()] || '🚀';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Investor Dashboard</h1>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Discover Investment Opportunities</h2>
          <p className="text-gray-600 mb-4">
            Explore startups, analyze their potential, and make informed investment decisions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total Startups</span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-1">{startups.length}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Active</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mt-1">{filteredStartups.length}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Categories</span>
              </div>
              <p className="text-2xl font-bold text-purple-600 mt-1">{categories.length - 1}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Featured</span>
              </div>
              <p className="text-2xl font-bold text-orange-600 mt-1">0</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Startups</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, description, or industry..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Startups Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No startups found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((startup) => (
              <div
                key={startup.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onStartupSelect(startup)}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {getIndustryIcon(startup.industry)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{startup.name}</h3>
                        <p className="text-sm text-gray-500">{startup.industry}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {startup.description || 'No description available.'}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {startup.stage && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(startup.stage)}`}>
                        {startup.stage}
                      </span>
                    )}
                    {startup.location && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {startup.location}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(startup.createdAt?.toDate?.() || startup.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-600">
                      <span>View Details</span>
                      <Eye className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestorDashboard;
