import { Navigate } from 'react-router-dom';
import { getCookie } from '../utils/cookieUtils';

const ProtectedRoute = ({ children }) => {
  const token = getCookie('access_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
