import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Manually decode a JWT token
const decodeJWT = (token) => {
  const base64Url = token.split('.')[1]; 
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); 
  const decodedData = JSON.parse(atob(base64)); 
  return decodedData;
};

// Validate token by checking its expiration locally
const isTokenValidLocally = (token) => {
  try {
    const decoded = decodeJWT(token);
    const currentTime = Date.now() / 1000; // Current time in seconds
    return decoded.exp > currentTime;
  } catch (err) {
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  useEffect(() => {
    const validateToken = () => {
      if (!token || !isTokenValidLocally(token)) {
        // If token is missing or invalid, remove it and mark as not authenticated
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } else {
        // Token is valid
        setIsAuthenticated(true);
      }
      setIsLoading(false); // Stop loading once validation is complete
    };
    validateToken();
  }, [token]); // Dependency on token, re-run validation when it changes

  if (isLoading) {
    return <div>Loading...</div>; // Show loading state while validating the token
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />; 
  }

  return children; 
};

export default ProtectedRoute;
