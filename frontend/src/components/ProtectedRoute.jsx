import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredUserType = null, requiredUserId = null, requiredUserTypeAndId = null }) => {
  const { isLoggedIn, userType, userId } = useAuth();

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/Login" replace />;
  }

  // If a specific user type is required and the user doesn't have it, redirect to home
  if (requiredUserType && userType !== requiredUserType) {
    return <Navigate to="/" replace />;
  }

  // If a specific user ID is required and the user doesn't have it, redirect to home
  if (requiredUserId && userId !== requiredUserId) {
    return <Navigate to="/" replace />;
  }

  // If both user type and ID are required (for admin: patient with ID 1)
  if (requiredUserTypeAndId && (userType !== requiredUserTypeAndId.type || userId !== requiredUserTypeAndId.id)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 