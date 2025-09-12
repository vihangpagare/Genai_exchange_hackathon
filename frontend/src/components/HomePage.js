import React, { useState } from 'react';
import { ArrowRight, Building2, TrendingUp, Users, Star, ChevronRight, Eye, BarChart3, Shield, Target, DollarSign, CheckCircle, Sparkles, Zap, Heart, Rocket } from 'lucide-react';

const HomePage = ({ user, userType, onLogin, onStartupSelect }) => {
  // Mock data for demonstration
  const [startups] = useState([
    {
      id: 1,
      companyName: "FinTech Innovators",
      sector: "Financial Technology",
      description: "Revolutionary payment solutions for the next generation of consumers",
      teamSize: 12,
      stage: "Series A",
      overallScore: 85
    },
    {
      id: 2,
      companyName: "HealthTech Solutions",
      sector: "Healthcare",
      description: "AI-powered diagnostic tools for early disease detection",
      teamSize: 8,
      stage: "Seed",
      overallScore: 78
    },
    {
      id: 3,
      companyName: "EduTech Platform",
      sector: "Education Technology",
      description: "Personalized learning experiences through adaptive AI",
      teamSize: 15,
      stage: "Series B",
      overallScore: 92
    }
  ]);

  const [investors] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      company: "Venture Capital Partners",
      bio: "Focused on early-stage tech startups with global potential",
      investmentRange: "$1M-$10M",
      sectors: ["FinTech", "HealthTech"]
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "Innovation Fund",
      bio: "Supporting founders building the future of work and education",
      investmentRange: "$500K-$5M",
      sectors: ["EdTech", "SaaS"]
    }
  ]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-100 border border-emerald-200';
    if (score >= 60) return 'text-amber-700 bg-amber-100 border border-amber-200';
    return 'text-rose-700 bg-rose-100 border border-rose-200';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        {/* Floating gradient shapes - exactly like the image */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-bounce"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Platform Badge - exactly like the image */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-pink-100 border border-pink-200 text-gray-700 text-sm font-semibold mb-8 shadow-sm">
              <Sparkles className="h-4 w-4 mr-2 text-pink-500" />
              AI-Powered Investment Analysis Platform
              <Heart className="h-4 w-4 ml-2 text-pink-500" />
            </div>
            
            {/* Main Headline - exactly like the image */}
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight">
              A sweet, secret
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"> analysis</span>
              <br />
              ingredient
            </h1>
            
            {/* Description - exactly like the image */}
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Plug into a world-class AI analysis team, making your investment process faster, more efficient, and scalable with comprehensive startup evaluation.
            </p>
            
            {/* CTA Button and secondary text - exactly like the image */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={user ? () => window.location.href = userType === 'startup' ? '/dashboard' : '/startups' : onLogin}
                className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-bold rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                {user ? (userType === 'startup' ? 'Go to Dashboard' : 'Explore Startups') : 'Get Started'}
                <Rocket className="ml-3 h-6 w-6" />
              </button>
              
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                No worries, you can cancel any time!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section - Jamm.co inspired */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              It's deliciously simple
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              It's just how you've always wanted investment analysis to work.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-3xl transform group-hover:scale-105 transition-all duration-500 border-4 border-white">
                  <Building2 className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-3xl p-8 border border-pink-100 group-hover:border-pink-200 transition-all duration-300">
                <h3 className="text-2xl font-black text-gray-900 mb-4">Subscribe</h3>
                <p className="text-gray-600 leading-relaxed">Startups upload their pitch decks, financials, and business plans for comprehensive analysis.</p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-3xl transform group-hover:scale-105 transition-all duration-500 border-4 border-white">
                  <Zap className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl p-8 border border-purple-100 group-hover:border-purple-200 transition-all duration-300">
                <h3 className="text-2xl font-black text-gray-900 mb-4">Add Tasks</h3>
                <p className="text-gray-600 leading-relaxed">Our AI agents analyze business models, market intelligence, and risk factors automatically.</p>
              </div>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-3xl transform group-hover:scale-105 transition-all duration-500 border-4 border-white">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-ping"></div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-100 group-hover:border-emerald-200 transition-all duration-300">
                <h3 className="text-2xl font-black text-gray-900 mb-4">Get Insights</h3>
                <p className="text-gray-600 leading-relaxed">Investors receive detailed analysis reports and investment recommendations within hours.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Startups Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6">
              Explore Startups
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Discover promising startups with comprehensive AI-powered analysis
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {startups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} getScoreColor={getScoreColor} onSelect={onStartupSelect} />
            ))}
          </div>
          
          <div className="text-center mt-16">
            <button
              onClick={() => window.location.href = '/startups'}
              className="inline-flex items-center px-8 py-4 bg-white border-3 border-purple-300 text-purple-700 font-bold rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All Startups
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Explore Investors Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6">
              Explore Investors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Connect with experienced investors looking for their next opportunity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {investors.map((investor) => (
              <InvestorCard key={investor.id} investor={investor} />
            ))}
          </div>
          
          <div className="text-center mt-16">
            <button
              onClick={() => window.location.href = '/investors'}
              className="inline-flex items-center px-8 py-4 bg-white border-3 border-pink-300 text-pink-700 font-bold rounded-2xl hover:border-pink-500 hover:bg-pink-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              View All Investors
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features section - Jamm.co inspired grid layout */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
              It's a win-win for everyone
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              You'll wonder how you ever operated in a different way.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200 group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Unlimited<br/>Requests</h3>
              <p className="text-gray-600 leading-relaxed">Get an unlimited analysis request backlog, prioritize as you will.</p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-purple-200 group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Wicked<br/>Fast</h3>
              <p className="text-gray-600 leading-relaxed">Analysis delivered for review within 2 business days, on average.</p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-emerald-200 group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Expert<br/>AI</h3>
              <p className="text-gray-600 leading-relaxed">Powered by small, tight-knit team of senior level AI models.</p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-orange-200 group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl group-hover:shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">Laser-<br/>Focused</h3>
              <p className="text-gray-600 leading-relaxed">We hone in on a single task at a time, resulting in stellar quality.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-pink-500 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full opacity-10 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full opacity-10 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-8">
            Let's make something sweet together
          </h2>
          <p className="text-xl text-pink-100 mb-12 font-medium leading-relaxed">
            Get access to world-class AI analysis for less than hiring a single analyst. 
            Stupid simple analysis subscription to level-up your investment process!
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={onLogin}
              className="inline-flex items-center px-10 py-5 bg-white text-purple-600 font-black text-lg rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
            >
              Get Started
              <ArrowRight className="ml-3 h-6 w-6" />
            </button>
            <button className="inline-flex items-center px-10 py-5 border-2 border-white text-white font-black text-lg rounded-2xl hover:bg-white hover:text-purple-600 transition-all duration-300 shadow-xl transform hover:-translate-y-1">
              Book a Call
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Startup Card Component - Chumbak inspired vibrant design
const StartupCard = ({ startup, getScoreColor, onSelect }) => {
  const cardColors = [
    'from-pink-400 to-rose-500',
    'from-purple-400 to-indigo-500', 
    'from-blue-400 to-cyan-500',
    'from-emerald-400 to-teal-500',
    'from-yellow-400 to-orange-500'
  ];
  const randomColor = cardColors[Math.floor(Math.random() * cardColors.length)];

  return (
    <div className="group">
      <div className={`bg-gradient-to-br ${randomColor} rounded-3xl p-1 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1`}>
        <div className="bg-white rounded-3xl p-8 h-full">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 bg-gradient-to-br ${randomColor} rounded-2xl shadow-lg`}>
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900">{startup.companyName}</h3>
                <p className="text-sm font-bold text-gray-600">{startup.sector}</p>
              </div>
            </div>
            {startup.overallScore && (
              <div className={`px-4 py-2 rounded-full text-sm font-black ${getScoreColor(startup.overallScore)} shadow-lg`}>
                {startup.overallScore}/100
              </div>
            )}
          </div>
          
          <p className="text-gray-600 mb-6 leading-relaxed font-medium">
            {startup.description || 'No description available'}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-pink-100 rounded-lg">
                  <Users className="h-4 w-4 text-pink-600" />
                </div>
                <span className="font-bold text-gray-700">{startup.teamSize || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-yellow-100 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <span className="font-bold text-gray-700">{startup.stage || 'N/A'}</span>
              </div>
            </div>
            
            <button
              onClick={() => onSelect && onSelect(startup)}
              className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${randomColor} text-white font-bold rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
            >
              <span>View</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Investor Card Component - Chumbak inspired vibrant design
const InvestorCard = ({ investor }) => {
  const cardColors = [
    'from-purple-400 to-pink-500',
    'from-indigo-400 to-purple-500', 
    'from-blue-400 to-indigo-500',
    'from-teal-400 to-blue-500',
    'from-orange-400 to-pink-500'
  ];
  const randomColor = cardColors[Math.floor(Math.random() * cardColors.length)];

  return (
    <div className="group">
      <div className={`bg-gradient-to-br ${randomColor} rounded-3xl p-1 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:-rotate-1`}>
        <div className="bg-white rounded-3xl p-8 h-full">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`p-3 bg-gradient-to-br ${randomColor} rounded-2xl shadow-lg`}>
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">{investor.name || 'Investor'}</h3>
              <p className="text-sm font-bold text-gray-600">{investor.company || 'Investment Firm'}</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6 leading-relaxed font-medium">
            {investor.bio || 'Experienced investor looking for promising opportunities'}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-emerald-100 rounded-lg">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="font-bold text-gray-700">{investor.investmentRange || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-blue-100 rounded-lg">
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-bold text-gray-700 text-xs">{investor.sectors?.join(', ') || 'All sectors'}</span>
              </div>
            </div>
          </div>
          
          <button className={`w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r ${randomColor} text-white font-bold rounded-2xl hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
            <span>Connect</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;