import { useContext } from 'react';
import AuthContext from '../Context/Auth';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  const { user, setUser, loading, setLoading } = context;

  return { user, setUser, loading, setLoading };
};
