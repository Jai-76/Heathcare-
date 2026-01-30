import React, { useState } from 'react';
import api from '../services/api.js';

const TestCaseForm = () => {
  const [formData, setFormData] = useState({
    requirement: '',
    systemType: 'EHR',
    priority: 'medium',
    compliance: ['HIPAA']
  });
  const [generatedTestCases, setGeneratedTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      // For now, simulate API call - replace with actual API endpoint
      const response = await api.generateTestCases(formData);
      setGeneratedTestCases(response.testCases);
    } catch (err) {
      setError('Failed to generate test cases. Please try again.');
      console.error('Test case generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Healthcare Test Cases</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Requirement Input */}
        <div>
          <label htmlFor="requirement" className="block text-sm font-medium text-gray-700 mb-2">
            Healthcare Requirement Description
          </label>
          <textarea
            id="requirement"
            name="requirement"
            rows={4}
            value={formData.requirement}
            onChange={handleInputChange}
            placeholder="Describe the healthcare feature or requirement you want to test..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* System Type */}
        <div>
          <label htmlFor="systemType" className="block text-sm font-medium text-gray-700 mb-2">
            System Type
          </label>
          <select
            id="systemType"
            name="systemType"
            value={formData.systemType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            Test Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Compliance Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compliance Requirements
          </label>
          <div className="space-y-2">
            {['HIPAA', 'GDPR', 'FDA', 'HL7', 'DICOM'].map((compliance) => (
              <label key={compliance} className="flex items-center">
                <input
                  type="checkbox"
                  name="compliance"
                  value={compliance}
                  checked={formData.compliance.includes(compliance)}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">{compliance}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating...' : 'Generate Test Cases'}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Generated Test Cases */}
      {generatedTestCases.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Test Cases</h3>
          <div className="space-y-4">
            {generatedTestCases.map((testCase, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{testCase.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{testCase.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {testCase.priority}
                  </span>
                  {testCase.compliance.map(comp => (
                    <span key={comp} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
  );
};

export default TestCaseForm;