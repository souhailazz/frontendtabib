// Add this as a temporary route to test sessionStorage
// Add to your router: <Route path="/test-session" element={<SessionStorageTest />} />

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const SessionStorageTest = () => {
  const [testData, setTestData] = useState('');
  const [storedData, setStoredData] = useState('');
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    // Check for stored data on mount
    const stored = sessionStorage.getItem('bookingFormData');
    setStoredData(stored || 'No data found');
  }, []);

  const saveTestData = () => {
    const testBookingData = {
      doctorId: 123,
      doctorData: { 
        id: 123, 
        nom: 'Test', 
        prenom: 'Doctor',
        specialite: 'Cardiologie',
        city: 'Casablanca'
      },
      date: '2025-08-20',
      time: '14:30',
      reason: 'Test consultation',
      consultationType: 'in-person',
      currentPath: '/response-search?specialite=Cardiologie',
      searchParams: {
        specialite: 'Cardiologie'
      }
    };

    sessionStorage.setItem('bookingFormData', JSON.stringify(testBookingData));
    sessionStorage.setItem('pendingBooking', 'true');
    sessionStorage.setItem('returnPath', '/response-search?specialite=Cardiologie');

    setStoredData(JSON.stringify(testBookingData, null, 2));
    alert('Test data saved! Now try logging in/out or navigating.');
  };

  const clearTestData = () => {
    sessionStorage.removeItem('bookingFormData');
    sessionStorage.removeItem('pendingBooking');
    sessionStorage.removeItem('returnPath');
    setStoredData('No data found');
    alert('Test data cleared!');
  };

  const simulateLogin = () => {
    navigate('/login');
  };

  const goToSearchResults = () => {
    navigate('/response-search?specialite=Cardiologie');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🧪 Session Storage Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <strong>Auth Status:</strong> {isLoggedIn ? '✅ Logged In' : '❌ Not Logged In'}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Current Stored Data:</h3>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          border: '1px solid #ddd',
          maxHeight: '300px',
          overflow: 'auto',
          fontSize: '12px'
        }}>
          {storedData}
        </pre>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Actions:</h3>
        <button 
          onClick={saveTestData}
          style={{ margin: '5px', padding: '10px', background: '#007bff', color: 'white', border: 'none' }}
        >
          💾 Save Test Booking Data
        </button>
        
        <button 
          onClick={clearTestData}
          style={{ margin: '5px', padding: '10px', background: '#dc3545', color: 'white', border: 'none' }}
        >
          🗑️ Clear Test Data
        </button>
        
        <button 
          onClick={simulateLogin}
          style={{ margin: '5px', padding: '10px', background: '#28a745', color: 'white', border: 'none' }}
        >
          🔐 Go to Login
        </button>
        
        <button 
          onClick={goToSearchResults}
          style={{ margin: '5px', padding: '10px', background: '#ffc107', color: 'black', border: 'none' }}
        >
          🔍 Go to Search Results
        </button>
      </div>

      <div style={{ background: '#fff3cd', padding: '15px', border: '1px solid #ffc107', borderRadius: '5px' }}>
        <h4>🧪 Test Steps:</h4>
        <ol>
          <li>Click "Save Test Booking Data" to simulate filling a booking form</li>
          <li>Click "Go to Login" to simulate the redirect</li>
          <li>Login with your credentials</li>
          <li>Check if you're redirected back to search results</li>
          <li>Check console logs for debug info</li>
        </ol>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Real-time Session Data:</h3>
        <div>
          <strong>pendingBooking:</strong> {sessionStorage.getItem('pendingBooking') || 'None'}
        </div>
        <div>
          <strong>returnPath:</strong> {sessionStorage.getItem('returnPath') || 'None'}
        </div>
        <div>
          <strong>bookingFormData exists:</strong> {sessionStorage.getItem('bookingFormData') ? '✅ Yes' : '❌ No'}
        </div>
      </div>
    </div>
  );
};

export default SessionStorageTest;