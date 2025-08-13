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

  // Check authentication status on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUserType = localStorage.getItem("userType");
    const storedUserEmail = localStorage.getItem("userEmail");
    const storedUserName = localStorage.getItem("userName");

    if (storedUserId && storedUserType) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
      setUserType(storedUserType);
      setUserEmail(storedUserEmail);
      setUserName(storedUserName);
    }
    
    // Mark as initialized after checking
    setIsInitialized(true);
  }, []);

  const login = (userData) => {
    const { id, userType: type, email, name } = userData;
    
    // Store userId as string to ensure consistent comparison
    const userIdString = id.toString();
    
    localStorage.setItem("userId", userIdString);
    localStorage.setItem("userType", type);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name);
    
    setIsLoggedIn(true);
    setUserId(userIdString);
    setUserType(type);
    setUserEmail(email);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    
    setIsLoggedIn(false);
    setUserId(null);
    setUserType(null);
    setUserEmail(null);
    setUserName(null);
  };

  const value = {
    isLoggedIn,
    userType,
    userId,
    userEmail,
    userName,
    isInitialized,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};