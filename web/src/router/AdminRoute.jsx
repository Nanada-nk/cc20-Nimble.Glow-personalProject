import { Navigate, Outlet } from 'react-router';
import authStore from '../stores/authStore';

function AdminRoute() {
  const token = authStore((state) => state.token);
  const user = authStore((state) => state.user);

  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  if (user?.role !== 'ADMIN' && user?.role !== 'SUPERADMIN') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default AdminRoute;