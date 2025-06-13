import React from 'react';
import { useAuth } from '../components/Auth/AuthContext';

const DebugAuth = () => {
  const { user, isAuthenticated } = useAuth();

  const handleTestAuth = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userObj = localStorage.getItem('user');
    
    console.log('=== AUTH DEBUG ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('user object:', user);
    console.log('accessToken:', accessToken);
    console.log('refreshToken:', refreshToken);
    console.log('user localStorage:', userObj);
  };

  const handleClearAuth = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload();
  };

  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999, background: 'white', padding: '10px', border: '1px solid #ccc' }}>
      <h4>Auth Debug</h4>
      <p>Auth Status: {isAuthenticated ? 'Logged In' : 'Not Logged In'}</p>
      <p>User: {user?.username || 'None'}</p>
      <button onClick={handleTestAuth}>Log Auth Info</button>
      <button onClick={handleClearAuth} style={{ marginLeft: '10px' }}>Clear Auth</button>
    </div>
  );
};

export default DebugAuth;
