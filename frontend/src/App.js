import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './providers/firebase';
import Auth from './components/Auth';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import StartupDashboard from './components/StartupDashboard';
import InvestorDashboard from './components/InvestorDashboard';
import StartupDetail from './components/StartupDetail';
import StartupListing from './components/StartupListing';
import StartupsPage from './components/StartupsPage';
import InvestorsPage from './components/InvestorsPage';
import InvestorAnalysisView from './components/InvestorAnalysisView';

function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Get user type from localStorage or user metadata
        const storedUserType = localStorage.getItem('userType');
        setUserType(storedUserType);
      } else {
        setUserType(null);
        setSelectedStartup(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle URL routing
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/') {
      setCurrentPage('home');
    } else if (path === '/startups') {
      setCurrentPage('startups');
    } else if (path === '/investors') {
      setCurrentPage('investors');
    } else if (path === '/auth') {
      setCurrentPage('auth');
    } else if (path.startsWith('/startup/')) {
      setCurrentPage('startup-detail');
    } else if (path === '/dashboard') {
      setCurrentPage('dashboard');
    }
  }, []);

  const handleAuthSuccess = (user, type, additionalData = {}) => {
    setUser(user);
    setUserType(type);
    localStorage.setItem('userType', type);
    
    // Store additional user data in Firebase if provided
    if (additionalData.companyName || additionalData.fullName) {
      // This would be handled by the Firebase service
      console.log('Additional user data:', additionalData);
    }
    
    // Redirect based on user type
    if (type === 'startup') {
      window.location.href = '/dashboard';
    } else if (type === 'investor') {
      window.location.href = '/startups';
    }
  };

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem('userType');
    setUser(null);
    setUserType(null);
    setSelectedStartup(null);
    window.location.href = '/';
  };

  const handleStartupSelect = (startup) => {
    setSelectedStartup(startup);
    window.location.href = `/startup/${startup.id}`;
  };

  const handleBackToDashboard = () => {
    setSelectedStartup(null);
    if (userType === 'investor') {
      window.location.href = '/startups';
    } else {
      window.location.href = '/dashboard';
    }
  };

  const handleLogin = () => {
    window.location.href = '/auth';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render based on current page
  if (currentPage === 'auth') {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  if (currentPage === 'startup-detail' && selectedStartup) {
    return (
      <InvestorAnalysisView 
        startupId={selectedStartup.id} 
        onBack={handleBackToDashboard}
      />
    );
  }

  if (currentPage === 'dashboard' && userType === 'startup') {
    return (
      <div>
        <Navbar user={user} userType={userType} onLogout={handleLogout} currentPage="dashboard" />
        <StartupDashboard user={user} onLogout={handleLogout} />
      </div>
    );
  }

  if (currentPage === 'startups') {
    return (
      <div>
        <Navbar user={user} userType={userType} onLogout={handleLogout} currentPage="startups" />
        <StartupsPage 
          user={user} 
          userType={userType}
          onLogout={handleLogout}
          onStartupSelect={handleStartupSelect}
        />
      </div>
    );
  }

  if (currentPage === 'investors') {
    return (
      <div>
        <Navbar user={user} userType={userType} onLogout={handleLogout} currentPage="investors" />
        <InvestorsPage 
          user={user} 
          userType={userType}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // Default to home page
  return (
    <div>
      <Navbar user={user} userType={userType} onLogout={handleLogout} currentPage="home" />
      <HomePage 
        user={user} 
        userType={userType} 
        onLogin={handleLogin}
        onStartupSelect={handleStartupSelect}
      />
    </div>
  );
}

export default App;