import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireFounder?: boolean;
}

const ProtectedRoute = ({ children, requireFounder = false }: ProtectedRouteProps) => {
  const { user, loading, isFounder } = useAuth();

  // 1. Show Spinner while deciding
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F5F1E8]">
        <Loader2 className="w-8 h-8 text-[#3B5998] animate-spin" />
      </div>
    );
  }

  // 2. Not Logged In? -> Go to Lock Screen
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. Logged In but NOT Founder? -> Go to The Hull
  if (requireFounder && !isFounder) {
    return <Navigate to="/hull" replace />;
  }

  // 4. Access Granted
  return <>{children}</>;
};

export default ProtectedRoute;
