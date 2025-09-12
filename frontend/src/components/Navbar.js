import React, { useState } from 'react';
import { Menu, X, Building2, TrendingUp, LogOut, User, Sparkles, Rocket, Heart } from 'lucide-react';

const Navbar = ({ user, userType, onLogout, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', current: currentPage === 'home' },
    { name: 'Startups', href: '/startups', current: currentPage === 'startups' },
    { name: 'Investors', href: '/investors', current: currentPage === 'investors' },
  ];

  const handleNavClick = (href) => {
    if (href === '/') {
      window.location.href = '/';
    } else if (href === '/startups') {
      window.location.href = userType === 'startup' ? '/dashboard' : '/startups';
    } else if (href === '/investors') {
      window.location.href = '/investors';
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-xl border-b-2 border-purple-100 sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-3 group cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-300 border-2 border-white">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black text-gray-900 flex items-center space-x-1">
                  <span>InvestAI</span>
                  <Sparkles className="h-5 w-5 text-pink-500" />
                </span>
                <p className="text-xs text-purple-600 font-bold">AI-Powered Investment Platform</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                    item.current
                      ? 'text-white bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg border-2 border-purple-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 border-2 border-transparent hover:border-purple-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl px-4 py-2">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-purple-100">
                      {userType === 'startup' ? (
                        <Building2 className="h-4 w-4 text-purple-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-pink-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-black text-gray-900">
                        {user.displayName || user.email}
                      </span>
                      <p className="text-xs text-purple-600 font-semibold">
                        {userType === 'startup' ? 'Startup' : 'Investor'}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={onLogout}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-bold text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 rounded-2xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-200 hover:border-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => window.location.href = '/auth'}
                    className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-bold transition-colors duration-300 hover:bg-gray-50 rounded-2xl border-2 border-transparent hover:border-gray-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => window.location.href = '/auth'}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-2xl text-sm font-black hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border-2 border-purple-300 flex items-center space-x-2"
                  >
                    <span>Get Started</span>
                    <Rocket className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-2xl text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300 border-2 border-gray-200 hover:border-purple-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-4 pb-6 space-y-3 bg-gradient-to-b from-white to-purple-50 border-t-2 border-purple-100 shadow-xl">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className={`block w-full text-left px-4 py-3 rounded-2xl text-base font-bold transition-all duration-300 transform hover:scale-105 ${
                  item.current
                    ? 'text-white bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg border-2 border-purple-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 border-2 border-transparent hover:border-purple-200'
                }`}
              >
                {item.name}
              </button>
            ))}
            
            {user ? (
              <div className="pt-6 pb-3 border-t-2 border-purple-200 space-y-4">
                <div className="flex items-center px-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-purple-100">
                    {userType === 'startup' ? (
                      <Building2 className="h-5 w-5 text-purple-600" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-pink-600" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-black text-gray-800">
                      {user.displayName || user.email}
                    </div>
                    <div className="text-sm text-purple-600 font-bold">
                      {userType === 'startup' ? 'Startup' : 'Investor'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-3 text-base font-bold text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-600 rounded-2xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-200 hover:border-red-300"
                >
                  <div className="flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            ) : (
              <div className="pt-6 pb-3 border-t-2 border-purple-200 space-y-3">
                <button
                  onClick={() => window.location.href = '/auth'}
                  className="block w-full text-left px-4 py-3 text-base font-bold text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 rounded-2xl transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-purple-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => window.location.href = '/auth'}
                  className="block w-full text-left px-4 py-3 text-base font-bold bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-purple-300 flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <Rocket className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

