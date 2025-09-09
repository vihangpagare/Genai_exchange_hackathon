import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './providers/firebase';
import Auth from './components/Auth';
import StartupDashboard from './components/StartupDashboard';
import InvestorDashboard from './components/InvestorDashboard';
import StartupDetail from './components/StartupDetail';

function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [selectedStartup, setSelectedStartup] = useState(null);
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

  const handleAuthSuccess = (user, type, additionalData = {}) => {
    setUser(user);
    setUserType(type);
    localStorage.setItem('userType', type);
    
    // Store additional user data in Firebase if provided
    if (additionalData.companyName || additionalData.fullName) {
      // This would be handled by the Firebase service
      console.log('Additional user data:', additionalData);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem('userType');
    setUser(null);
    setUserType(null);
    setSelectedStartup(null);
  };

  const handleStartupSelect = (startup) => {
    setSelectedStartup(startup);
  };

  const handleBackToDashboard = () => {
    setSelectedStartup(null);
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

  if (!user) {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  if (selectedStartup) {
    return (
      <StartupDetail 
        startup={selectedStartup} 
        onBack={handleBackToDashboard}
        userType={userType}
      />
    );
  }

  if (userType === 'startup') {
    return (
      <StartupDashboard 
        user={user} 
        onLogout={handleLogout}
      />
    );
  }

  if (userType === 'investor') {
    return (
      <InvestorDashboard 
        user={user} 
        onLogout={handleLogout}
        onStartupSelect={handleStartupSelect}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome!</h1>
        <p className="text-gray-600 mb-4">Please select your user type to continue.</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Sign Out
                  </button>
      </div>
    </div>
  );
}

export default App;