import React, { useState } from 'react';
import { authAPI } from '../services/api';

const ApiTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      const response = await authAPI.test();
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}\n${JSON.stringify(error.response?.data || {}, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    setResult('Testing registration...');
    
    try {
      const testData = {
        email: `test${Date.now()}@example.com`,
        username: `test${Date.now()}`,
        first_name: 'Test',
        last_name: 'User',
        password: 'testpass123',
        password_confirm: 'testpass123'
      };
      
      const response = await authAPI.register(testData);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}\n${JSON.stringify(error.response?.data || {}, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      
      <div className="space-x-4 mb-4">
        <button 
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test API Connection
        </button>
        
        <button 
          onClick={testRegistration}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Registration
        </button>
      </div>
      
      <div className="bg-white p-4 rounded border">
        <h3 className="font-semibold mb-2">Result:</h3>
        <pre className="whitespace-pre-wrap text-sm">
          {result || 'Click a button to test'}
        </pre>
      </div>
    </div>
  );
};

export default ApiTest;