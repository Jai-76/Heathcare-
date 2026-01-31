import React, { useState } from 'react';
import api from '../services/api.js';

const DiseaseLookup = () => {
  const [disease, setDisease] = useState('');
  const [solutions, setSolutions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!disease.trim()) return;

    setLoading(true);
    setError('');
    setSolutions('');

    try {
      // Try to use the API first
      const prompt = `As a medical AI assistant, provide comprehensive information about ${disease.trim()}. Include:
1. Brief description of the disease
2. Common symptoms
3. Treatment options and solutions
4. Prevention methods
5. When to seek medical attention

Please provide accurate, helpful information based on medical knowledge. If this is not a recognized medical condition, provide general health advice.`;

      const response = await api.chatWithGemini(prompt);
      const result = response.response || response.error || 'No response received from the server.';

      setSolutions(result);
      setSearchHistory(prev => [{
        disease: disease.trim(),
        result,
        timestamp: new Date().toLocaleString()
      }, ...prev.slice(0, 4)]); // Keep last 5 searches

    } catch (err) {
      // Fallback to mock data if API fails
      console.error('API call failed, using fallback:', err);
      setError('Unable to connect to the server. Using demo data instead.');

      const mockResponses = {
        'diabetes': `**Diabetes Mellitus**

**Brief Description:** Diabetes is a chronic condition that affects how your body processes blood sugar (glucose).

**Common Symptoms:**
- Frequent urination
- Increased thirst
- Extreme hunger
- Unexplained weight loss
- Fatigue
- Slow-healing sores

**Treatment Options:**
1. **Lifestyle Changes:** Healthy diet, regular exercise, weight management
2. **Medications:** Metformin, insulin injections, sulfonylureas
3. **Blood Sugar Monitoring:** Regular glucose testing
4. **Regular Check-ups:** With healthcare provider

**Prevention Methods:**
- Maintain healthy weight
- Exercise regularly
- Eat balanced diet
- Get regular health screenings

**When to Seek Medical Attention:** If you experience symptoms of hyperglycemia or hypoglycemia, or if blood sugar levels are consistently high.`,

        'hypertension': `**Hypertension (High Blood Pressure)**

**Brief Description:** Hypertension is a condition where the force of blood against artery walls is too high.

**Common Symptoms:**
- Often asymptomatic
- Headaches
- Dizziness
- Blurred vision
- Chest pain
- Shortness of breath

**Treatment Options:**
1. **Lifestyle Modifications:** DASH diet, reduced salt intake, exercise
2. **Medications:** ACE inhibitors, beta-blockers, diuretics, calcium channel blockers
3. **Regular Monitoring:** Home blood pressure checks
4. **Stress Management:** Relaxation techniques

**Prevention Methods:**
- Maintain healthy weight
- Limit alcohol and caffeine
- Quit smoking
- Reduce stress
- Regular exercise

**When to Seek Medical Attention:** Blood pressure consistently above 130/80 mmHg, or if experiencing severe symptoms.`,

        'asthma': `**Asthma**

**Brief Description:** Asthma is a chronic respiratory condition characterized by inflammation and narrowing of the airways.

**Common Symptoms:**
- Wheezing
- Coughing (especially at night)
- Shortness of breath
- Chest tightness
- Difficulty speaking

**Treatment Options:**
1. **Quick-relief Medications:** Albuterol inhalers for acute symptoms
2. **Long-term Control:** Corticosteroid inhalers, leukotriene inhibitors
3. **Allergy Management:** Avoid triggers, allergy medications
4. **Asthma Action Plan:** Personalized management plan

**Prevention Methods:**
- Identify and avoid triggers
- Take medications as prescribed
- Get flu vaccine annually
- Maintain healthy lifestyle

**When to Seek Medical Attention:** Severe shortness of breath, blue lips/face, or if quick-relief medication doesn't help.`
      };

      const lowerDisease = disease.trim().toLowerCase();
      let fallbackResponse = mockResponses[lowerDisease];

      if (!fallbackResponse) {
        fallbackResponse = `**${disease.trim()}**

**Note:** Unable to connect to the AI service. This is demo information.

**General Recommendations:**
- Consult a qualified healthcare provider for proper diagnosis
- Keep records of symptoms and when they occur
- Follow prescribed treatment plans
- Maintain regular health check-ups

**Important:** This information is for educational purposes only and should not replace professional medical advice.`;
      }

      setSolutions(fallbackResponse);
      setSearchHistory(prev => [{
        disease: disease.trim(),
        result: fallbackResponse,
        timestamp: new Date().toLocaleString()
      }, ...prev.slice(0, 4)]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const loadFromHistory = (item) => {
    setDisease(item.disease);
    setSolutions(item.result);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Disease Information & Solutions</h2>
        <p className="text-gray-600">Enter a disease name to get comprehensive information, symptoms, treatments, and solutions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Search Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                placeholder="Enter disease name (e.g., diabetes, hypertension, asthma)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  'Get Solutions'
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Solutions Display */}
          {solutions && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900">Information for: {disease}</h3>
              </div>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {solutions}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search History Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Searches</h3>
              {searchHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>

            {searchHistory.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent searches</p>
            ) : (
              <div className="space-y-3">
                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-md border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => loadFromHistory(item)}
                  >
                    <p className="font-medium text-gray-900 text-sm">{item.disease}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.timestamp}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Search Suggestions */}
          <div className="bg-blue-50 rounded-lg p-4 mt-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-3">Common Conditions</h4>
            <div className="space-y-2">
              {['Diabetes', 'Hypertension', 'Asthma', 'Migraine', 'Anxiety', 'Depression'].map((condition) => (
                <button
                  key={condition}
                  onClick={() => setDisease(condition)}
                  className="w-full text-left px-3 py-2 text-sm text-blue-700 hover:bg-blue-100 rounded-md transition-colors"
                >
                  {condition}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseLookup;