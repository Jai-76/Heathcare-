import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage.jsx';
import SignupPage from './components/SignupPage.jsx';
import TestCaseForm from './components/TestCaseForm.jsx';
import DiseaseLookup from './components/DiseaseLookup.jsx';
import api from './services/api.js';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'signup'
  const [activeTab, setActiveTab] = useState('disease'); // 'disease' or 'testcase'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await api.getCurrentUser();
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (response) => {
    setIsAuthenticated(true);
    setCurrentUser(response.user || { username: 'User' });
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('login');
  };

  const switchToSignup = () => setCurrentView('signup');
  const switchToLogin = () => setCurrentView('login');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center animate-slide-up">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">Loading Healthcare AI Assistant...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait while we prepare your workspace</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return currentView === 'login' ? (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={switchToSignup}
      />
    ) : (
      <SignupPage
        onSignupSuccess={() => setCurrentView('login')}
        onSwitchToLogin={switchToLogin}
      />
    );
  }

  // Main authenticated application
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">✨</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Healthcare AI</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">Welcome back</p>
                <p className="text-xs text-indigo-600">{currentUser?.full_name || currentUser?.username || 'User'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8 animate-slide-down">
          <div className="flex space-x-2 bg-white rounded-xl p-1 shadow-sm inline-flex">
            <button
              onClick={() => setActiveTab('disease')}
              className={`px-6 py-3 font-semibold rounded-lg transition-smooth ${
                activeTab === 'disease'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              🏥 Disease Information
            </button>
            <button
              onClick={() => setActiveTab('testcase')}
              className={`px-6 py-3 font-semibold rounded-lg transition-smooth ${
                activeTab === 'testcase'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              🧪 Test Cases
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'disease' ? <DiseaseLookup /> : <TestCaseForm />}
        </div>
      </main>
    </div>
  );
};

export default App;