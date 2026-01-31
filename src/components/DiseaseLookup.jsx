import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

const DiseaseLookup = ({ darkMode = false }) => {
  const [disease, setDisease] = useState('');
  const [solutions, setSolutions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem('diseaseSearchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // Persist search history
    localStorage.setItem('diseaseSearchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

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

  const exportResults = () => {
    if (!solutions) return;
    const data = {
      disease,
      results: solutions,
      exportedAt: new Date().toLocaleString(),
      source: 'Healthcare AI Assistant'
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disease-${disease.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className={`card-premium transition-smooth ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
      <div className="p-8">
        <div className="mb-8 animate-slide-up">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">Disease Information & Solutions</h2>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Enter a disease name to get comprehensive information, symptoms, treatments, and solutions powered by AI.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Search Section */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  placeholder="Enter disease name (e.g., diabetes, hypertension, asthma)"
                  className={`input-field flex-1 text-base transition-smooth ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-8 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-smooth"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent"></div>
                      Searching...
                    </>
                  ) : (
                    <>🔍 Search</>
                  )}
                </button>
              </div>
            </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg animate-slide-down">
              <div className="flex items-center gap-3">
                <span className="text-red-600 text-xl">⚠️</span>
                <div>
                  <p className="font-medium text-red-900 dark:text-red-300">Notice</p>
                  <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Solutions Display */}
          {solutions && (
            <div className={`border-2 border-indigo-100 rounded-xl p-6 animate-slide-up transition-smooth ${darkMode ? 'bg-gray-700 border-indigo-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
              <div className={`flex items-center gap-3 mb-6 pb-4 border-b ${darkMode ? 'border-gray-600' : 'border-indigo-200'}`}>
                <span className="text-2xl">📋</span>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Information for: <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{disease}</span></h3>
              </div>
              <div className={`prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {solutions}
              </div>
              <button
                onClick={exportResults}
                className="mt-6 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-smooth flex items-center gap-2"
              >
                💾 Export Results
              </button>
            </div>
          )}
        </div>

        {/* Search History Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className={`card-premium p-5 transition-smooth ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <span>⏱️</span> Recent Searches
              </h3>
              {searchHistory.length > 0 && (
                <button
                  onClick={clearHistory}
                  className={`text-xs font-medium transition-smooth px-2 py-1 rounded ${darkMode ? 'text-gray-300 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'}`}
                >
                  Clear
                </button>
              )}
            </div>

            {searchHistory.length === 0 ? (
              <p className={`text-sm text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No recent searches yet</p>
            ) : (
              <div className="space-y-2">
                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg cursor-pointer transition-smooth ${darkMode ? 'bg-gray-600 hover:border-indigo-400 hover:shadow-md border border-gray-600' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 hover:border-indigo-300 hover:shadow-md'}`}
                    onClick={() => loadFromHistory(item)}
                  >
                    <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.disease}</p>
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>🕐 {item.timestamp}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Search Suggestions */}
          <div className={`card-premium p-5 bg-gradient-to-br transition-smooth ${darkMode ? 'from-gray-700 to-gray-800 border-gray-600' : 'from-indigo-50 to-white border-indigo-200'}`}>
            <h4 className={`text-sm font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-yellow-400' : 'text-indigo-900'}`}>
              <span>⭐</span> Quick Conditions
            </h4>
            <div className="space-y-2">
              {['Diabetes', 'Hypertension', 'Asthma', 'Migraine', 'Anxiety', 'Depression'].map((condition) => (
                <button
                  key={condition}
                  onClick={() => setDisease(condition)}
                  className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg transition-smooth ${darkMode ? 'text-indigo-300 bg-gray-600 hover:bg-indigo-600/40 border border-transparent hover:border-indigo-400' : 'text-indigo-700 bg-white hover:bg-indigo-100 border border-transparent hover:border-indigo-300'}`}
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