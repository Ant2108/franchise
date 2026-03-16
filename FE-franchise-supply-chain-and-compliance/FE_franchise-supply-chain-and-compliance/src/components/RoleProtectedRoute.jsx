import { Navigate } from 'react-router-dom';
import { getCookie, getUserRoles } from '../utils/cookieUtils';

const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = getCookie('access_token');
  const userRoles = getUserRoles();

  // 1. Chưa đăng nhập → chuyển về login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu có yêu cầu role cụ thể → kiểm tra
  if (allowedRoles.length > 0) {
    const hasPermission = userRoles.some(role => allowedRoles.includes(role));
    
    if (!hasPermission) {
      // Không có quyền → chuyển về trang phù hợp với role của user
      if (userRoles.includes('ADMIN')) {
        return <Navigate to="/admin" replace />;
      } else if (userRoles.includes('WAREHOUSE_MANAGER')) {
        return <Navigate to="/warehouse" replace />;
      } else {
        // Không có role phù hợp → về home
        return <Navigate to="/" replace />;
      }
    }
  }

  return children;
};

export default RoleProtectedRoute;
