
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, LayoutDashboard } from 'lucide-react';

const AdminControls = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  // If user is not authenticated, render absolutely nothing
  if (!user) {
    return null;
  }

  // Only show dashboard and logout to authenticated users
  return (
    <div className="absolute top-4 right-4 z-50 flex gap-2">
      <Link to="/admin">
        <Button variant="secondary" size="sm" className="bg-[#C5A059] text-[#3B5998] hover:bg-[#b08d4b] border-none font-bold">
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
      </Link>
      <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/10" title="Logout">
        <LogOut className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default AdminControls;
