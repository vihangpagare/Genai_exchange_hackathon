import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Building2, MapPin, Calendar, Star, LogOut, User, Eye, BarChart3, AlertTriangle, PieChart, Sparkles, Zap, Heart, Rocket, Target, Shield, Users, ChevronRight } from 'lucide-react';
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
      'pre-seed': 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200',
      'seed': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200',
      'series-a': 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200',
      'series-b': 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border border-purple-200',
      'series-c': 'bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 border border-pink-200',
      'growth': 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200'
    };
    return colors[stage] || 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200';
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
    <div className="min-h-screen bg-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-10 animate-bounce"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Investor Dashboard</h1>
                <p className="text-pink-100 text-sm font-medium">Discover your next investment</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 bg-white bg-opacity-20 rounded-2xl px-4 py-2 backdrop-blur-sm">
                <div className="p-1 bg-white rounded-lg">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-white font-semibold">{user.displayName || user.email}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-white hover:text-pink-200 transition-colors bg-white bg-opacity-20 rounded-2xl px-4 py-2 backdrop-blur-sm font-semibold"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-xl border-2 border-purple-100 p-8 mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="h-6 w-6 text-purple-500" />
            <h2 className="text-3xl font-black text-gray-900">Discover Investment Opportunities</h2>
            <Heart className="h-6 w-6 text-pink-500" />
          </div>
          <p className="text-xl text-gray-600 mb-8 font-medium">
            Explore promising startups, analyze their potential, and make informed investment decisions with AI-powered insights.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="flex items-center space-x-3 mb-3">
                <Building2 className="h-8 w-8" />
                <span className="text-lg font-bold">Total Startups</span>
              </div>
              <p className="text-4xl font-black">{startups.length}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="flex items-center space-x-3 mb-3">
                <TrendingUp className="h-8 w-8" />
                <span className="text-lg font-bold">Active</span>
              </div>
              <p className="text-4xl font-black">{filteredStartups.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="flex items-center space-x-3 mb-3">
                <BarChart3 className="h-8 w-8" />
                <span className="text-lg font-bold">Categories</span>
              </div>
              <p className="text-4xl font-black">{categories.length - 1}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
              <div className="flex items-center space-x-3 mb-3">
                <Star className="h-8 w-8" />
                <span className="text-lg font-bold">Featured</span>
              </div>
              <p className="text-4xl font-black">0</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 p-8 mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Search className="h-6 w-6 text-purple-500" />
            <h3 className="text-2xl font-black text-gray-900">Find Your Perfect Investment</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-3">Search Startups</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, description, or industry..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 text-lg font-medium"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-4 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 text-lg font-medium"
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
              <label className="block text-sm font-bold text-gray-700 mb-3">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-4 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-300 text-lg font-medium"
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
          <div className="flex flex-col justify-center items-center py-24">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-purple-500 mb-6"></div>
            <p className="text-xl font-bold text-gray-600">Loading amazing startups...</p>
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Building2 className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">No startups found</h3>
            <p className="text-xl text-gray-500 font-medium">Try adjusting your search or filter criteria to discover more opportunities.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStartups.map((startup) => (
              <div
                key={startup.id}
                className="bg-white rounded-3xl shadow-lg border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 p-8 group hover:-translate-y-2 hover:border-purple-200 cursor-pointer"
                onClick={() => onStartupSelect(startup)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300 text-2xl">
                      {getIndustryIcon(startup.industry)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900">{startup.name}</h3>
                      <p className="text-sm text-purple-600 font-bold">{startup.industry}</p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-purple-600 transform hover:scale-110 transition-all duration-300">
                    <Eye className="h-6 w-6" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-base mb-6 line-clamp-3 leading-relaxed font-medium">
                  {startup.description || 'No description available.'}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {startup.stage && (
                    <span className={`px-3 py-2 rounded-full text-xs font-bold ${getStageColor(startup.stage)}`}>
                      {startup.stage}
                    </span>
                  )}
                  {startup.location && (
                    <span className="px-3 py-2 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-full text-xs font-bold flex items-center border border-gray-200">
                      <MapPin className="h-3 w-3 mr-1" />
                      {startup.location}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span className="font-semibold">
                      {new Date(startup.createdAt?.toDate?.() || startup.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-600 hover:text-pink-600 font-bold transition-colors duration-200">
                    <span>View Details</span>
                    <ChevronRight className="h-4 w-4" />
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