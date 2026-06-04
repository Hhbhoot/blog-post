import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoutes = ({ requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={'/login'} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={'/'} replace />;
  }

  return <Outlet />;
};
