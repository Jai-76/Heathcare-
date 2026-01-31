import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

const TestCaseForm = ({ darkMode = false }) => {
  const [formData, setFormData] = useState({
    requirement: '',
    systemType: 'EHR',
    priority: 'medium',
    compliance: ['HIPAA']
  });
  const [generatedTestCases, setGeneratedTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedCases, setSavedCases] = useState(() => {
    const saved = localStorage.getItem('savedTestCases');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('savedTestCases', JSON.stringify(savedCases));
  }, [savedCases]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          [name]: [...prev[name], value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.generateTestCases(formData);
      setGeneratedTestCases(response.testCases);
      
      // Save to local storage
      setSavedCases(prev => [...prev, {
        id: Date.now(),
        formData,
        testCases: response.testCases,
        createdAt: new Date().toLocaleString()
      }]);
    } catch (err) {
      setError('Failed to generate test cases. Please try again.');
      console.error('Test case generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportTestCases = () => {
    if (generatedTestCases.length === 0) return;
    const data = {
      requirement: formData.requirement,
      systemType: formData.systemType,
      priority: formData.priority,
      compliance: formData.compliance,
      testCases: generatedTestCases,
      exportedAt: new Date().toLocaleString(),
      source: 'Healthcare AI Assistant'
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-cases-${formData.systemType.toLowerCase()}-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="card-premium">
      <div className="p-8">
        <div className="mb-8 animate-slide-up">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">Generate Healthcare Test Cases</h2>
          <p className="text-gray-600 text-lg">Create comprehensive test cases for healthcare systems with AI-powered recommendations.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Requirement Input */}
          <div className="space-y-3">
            <label htmlFor="requirement" className="block text-sm font-semibold text-gray-900">
              📋 Healthcare Requirement Description
            </label>
            <textarea
              id="requirement"
              name="requirement"
              rows={4}
              value={formData.requirement}
              onChange={handleInputChange}
              placeholder="Describe the healthcare feature or requirement you want to test..."
              className="input-field resize-none"
              required
            />
          </div>

        {/* System Type */}
        <div className="space-y-3">
          <label htmlFor="systemType" className="block text-sm font-semibold text-gray-900">
            🏗️ System Type
          </label>
          <select
            id="systemType"
            name="systemType"
            value={formData.systemType}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="EHR">Electronic Health Records (EHR)</option>
            <option value="PACS">Picture Archiving and Communication System (PACS)</option>
            <option value="LIS">Laboratory Information System (LIS)</option>
            <option value="RIS">Radiology Information System (RIS)</option>
            <option value="EMR">Electronic Medical Records (EMR)</option>
            <option value="HIS">Hospital Information System (HIS)</option>
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-3">
          <label htmlFor="priority" className="block text-sm font-semibold text-gray-900">
            ⚡ Test Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Compliance Requirements */}
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-900">
            ✓ Compliance Requirements
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['HIPAA', 'GDPR', 'FDA', 'HL7', 'DICOM'].map((compliance) => (
              <label key={compliance} className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-smooth cursor-pointer">
                <input
                  type="checkbox"
                  name="compliance"
                  value={compliance}
                  checked={formData.compliance.includes(compliance)}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">{compliance}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent"></div>
                Generating...
              </span>
            ) : (
              '🚀 Generate Test Cases'
            )}
          </button>
        </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-slide-down">
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        )}

        {/* Generated Test Cases */}
        {generatedTestCases.length > 0 && (
          <div className="mt-8 animate-slide-up">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>✅</span> Generated Test Cases
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedTestCases.map((testCase, index) => (
                <div key={index} className="card bg-gradient-to-br from-indigo-50 to-purple-50 p-5 border-2 border-indigo-100 hover:shadow-lg">
                  <h4 className="font-bold text-gray-900 text-lg mb-2">{testCase.title}</h4>
                  <p className="text-sm text-gray-600 mb-4">{testCase.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                      {testCase.priority}
                    </span>
                    {testCase.compliance.map(comp => (
                      <span key={comp} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCaseForm;