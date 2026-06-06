import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import LoadingScreen from './LoadingScreen';

export const ProtectedRoutes = ({ requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Verifying session..." />;
  }

  if (!user) {
    return <Navigate to={'/login'} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={'/'} replace />;
  }

  return <Outlet />;
};
