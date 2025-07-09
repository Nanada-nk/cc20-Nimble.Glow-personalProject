import { Navigate, Outlet } from 'react-router';
import authStore from '../stores/authStore';

function ProtectedRoute() {
  const token = authStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;