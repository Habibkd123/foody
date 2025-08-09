import React from 'react';
import { useApiCall } from '../../hooks/useApiCall';
import { useLoading } from '../../context/LoadingContext';

const LoadingExample: React.FC = () => {
  const { callApi } = useApiCall();
  const { isLoading, loadingMessage } = useLoading();

  const handleApiCall = async () => {
    try {
      // Simulate an API call
      const result = await callApi(
        async () => {
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 2000));
          return { message: 'API call completed successfully!' };
        },
        { loadingMessage: 'Processing your request...' }
      );
      
      console.log('API Result:', result);
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const handleApiCallWithoutGlobalLoader = async () => {
    try {
      // Simulate an API call without showing global loader
      const result = await callApi(
        async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return { message: 'Local API call completed!' };
        },
        { loadingMessage: 'Processing...', showGlobalLoader: false }
      );
      
      console.log('Local API Result:', result);
    } catch (error) {
      console.error('Local API Error:', error);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Loading System Example</h2>
      
      <div className="space-y-2">
        <button
          onClick={handleApiCall}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Test Global Loader'}
        </button>
        
        <button
          onClick={handleApiCallWithoutGlobalLoader}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test Local Loader
        </button>
      </div>
      
      {isLoading && (
        <div className="text-sm text-gray-600">
          Current loading message: {loadingMessage}
        </div>
      )}
    </div>
  );
};

export default LoadingExample; 