import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Validate session with server
  const validateSession = async () => {
    const storedUserType = sessionStorage.getItem("userType");
    const storedUserId = sessionStorage.getItem("userId");
    const storedUserEmail = sessionStorage.getItem("userEmail");
    const storedUserName = sessionStorage.getItem("userName");
    
    // If no stored data, just initialize
    if (!storedUserType || !storedUserId) {
      setIsInitialized(true);
      return;
    }

    // For doctors, skip server validation (they're stateless)
    if (storedUserType === 'docteur') {
      setIsLoggedIn(true);
      setUserId(storedUserId);
      setUserType(storedUserType);
      setUserEmail(storedUserEmail);
      setUserName(storedUserName);
      setIsInitialized(true);
      return;
    }

    // For patients, validate with server session using userId endpoint instead of /me
    if (storedUserType === 'patient') {
      try {
        const response = await fetch(`https://api.tabib.life/api/patients/${storedUserId}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          const userData = await response.json();
          // Session is valid, restore state
          setIsLoggedIn(true);
          setUserId(storedUserId);
          setUserType(storedUserType);
          setUserEmail(storedUserEmail || userData.email);
          setUserName(storedUserName || `${userData.prenom} ${userData.nom}`);
        } else {
          // Session expired or invalid
          clearAuthData();
        }
      } catch (error) {
        console.warn('Session validation failed:', error);
        clearAuthData();
      }
    }
    
    setIsInitialized(true);
  };

  const clearAuthData = () => {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userType");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userName");
    
    setIsLoggedIn(false);
    setUserId(null);
    setUserType(null);
    setUserEmail(null);
    setUserName(null);
  };

  // Initialize auth state on mount
  useEffect(() => {
    validateSession();
  }, []);

  const login = (userData) => {
    const { id, userType: type, email, name } = userData;
    const userIdString = id.toString();
    
    // Store in sessionStorage
    sessionStorage.setItem("userId", userIdString);
    sessionStorage.setItem("userType", type);
    sessionStorage.setItem("userEmail", email);
    sessionStorage.setItem("userName", name);
    
    // Update state
    setIsLoggedIn(true);
    setUserId(userIdString);
    setUserType(type);
    setUserEmail(email);
    setUserName(name);
  };

  const logout = async () => {
    // Clear server session only for patients
    if (userType === 'patient') {
      try {
        await fetch('https://api.tabib.life/api/patients/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } catch (error) {
        console.warn('Server logout failed:', error);
      }
    }

    // Clear local data
    clearAuthData();
  };

  const value = {
    isLoggedIn,
    userType,
    userId,
    userEmail,
    userName,
    isInitialized,
    login,
    logout,
    validateSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};