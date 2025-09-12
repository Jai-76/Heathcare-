// src/components/Requirements/RequirementInput.jsx
import React, { useState, useEffect } from 'react';
import { useAPI } from './hooks/useAPI';
import AIPreview from './AIPreview';

const RequirementInput = ({ projectId }) => {
  const [requirement, setRequirement] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [complianceFrameworks, setComplianceFrameworks] = useState({
    hipaa: true,
    fda21cfr: true,
    iso13485: false,
    gdpr: true
  });

  const { post, loading } = useAPI();

  useEffect(() => {
    // Real-time AI analysis
    if (requirement.length > 50) {
      analyzeRequirement();
    }
  }, [requirement]);

  const analyzeRequirement = async () => {
    const response = await post('/api/analyze-requirement', {
      text: requirement,
      frameworks: complianceFrameworks
    });
    setAiAnalysis(response.data);
  };

  const generateTestCases = async () => {
    await post('/api/generate-testcases', {
      requirementId: projectId,
      text: requirement,
      frameworks: complianceFrameworks
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Healthcare Requirement Input</h2>

        {/* Input Area */}
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-md"
          placeholder="Enter your healthcare requirements here..."
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
        />

        {/* Compliance Framework Selection */}
        <div className="mt-6 p-4 bg-orange-50 rounded-md">
          <h3 className="font-semibold mb-3">Compliance Frameworks</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(complianceFrameworks).map(([key, value]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setComplianceFrameworks({
                    ...complianceFrameworks,
                    [key]: e.target.checked
                  })}
                />
                <span className="ml-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              </label>
            ))}
          </div>
        </div>

        {/* AI Analysis Preview */}
        {aiAnalysis && <AIPreview analysis={aiAnalysis} />}

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md">
            Save Draft
          </button>
          <button 
            onClick={generateTestCases}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white rounded-md"
          >
            {loading ? 'Generating...' : 'Generate Test Cases'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequirementInput;
