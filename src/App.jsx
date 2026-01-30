import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage.jsx';
import SignupPage from './components/SignupPage.jsx';
import api from './services/api.js';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'signup'
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Healthcare AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {currentUser?.full_name || currentUser?.username || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to Healthcare AI Test Case Generator
            </h2>
            <p className="text-gray-600 mb-6">
              Your AI-powered healthcare test case generation platform is ready to use!
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 max-w-md mx-auto">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Features Available:</h3>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• AI-powered requirement analysis</li>
                <li>• Automated test case generation</li>
                <li>• Compliance checking (HIPAA, GDPR, FDA)</li>
                <li>• Chat with Gemini AI assistant</li>
                <li>• Export to Jira, TestRail, Azure DevOps</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;