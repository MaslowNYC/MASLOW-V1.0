
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requireFounder = false }) => {
  const { user, loading, isFounder } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      // Check if user is authenticated first
      if (!user) {
        toast({
          title: "Member Access Required",
          description: "Join the community to access this page.",
          className: "bg-[#3B5998] text-[#F5F1E8] border-[#C5A059]",
        });
        navigate('/login');
        return;
      }

      // If user is authenticated, check for founder requirement if active
      if (requireFounder && !isFounder) {
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Founder access required.",
        });
        navigate('/'); // Redirect to home or another safe page
      }
    }
  }, [user, loading, isFounder, requireFounder, navigate, toast]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F5F1E8]">
        <Loader2 className="w-8 h-8 text-[#C5A059] animate-spin" />
      </div>
    );
  }

  // Render children only if all checks pass
  if (!user) return null;
  if (requireFounder && !isFounder) return null;

  return children;
};

export default ProtectedRoute;
