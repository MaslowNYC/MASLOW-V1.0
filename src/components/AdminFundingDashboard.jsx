
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, DollarSign, Users, RefreshCw, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RevenueSimulator from '@/components/RevenueSimulator';
import { formatNumber } from '@/utils/formatting';

const AdminFundingDashboard = () => {
  const [fundingGoal, setFundingGoal] = useState({ id: null, goal_amount: 0, current_total: 0 });
  const [memberships, setMemberships] = useState([]);
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [displayGoalAmount, setDisplayGoalAmount] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Goal
      const { data: goalData, error: goalError } = await supabase
        .from('funding_goal')
        .select('*')
        .single();
      
      if (goalError && goalError.code !== 'PGRST116') {
         console.error('Error fetching goal:', goalError);
      } else if (goalData) {
        setFundingGoal(goalData);
        setNewGoalAmount(goalData.goal_amount.toString());
        setDisplayGoalAmount(Number(goalData.goal_amount).toLocaleString());
      }

      // Fetch Memberships
      const { data: memData, error: memError } = await supabase
        .from('memberships')
        .select('*')
        .order('created_at', { ascending: false });

      if (memError) {
        console.error('Error fetching memberships:', memError);
      } else {
        setMemberships(memData || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGoalInputChange = (e) => {
    // Allow digits and dots only
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    setNewGoalAmount(rawValue);
    
    // Format for display (commas)
    if (rawValue && !isNaN(rawValue)) {
      setDisplayGoalAmount(Number(rawValue).toLocaleString());
    } else {
      setDisplayGoalAmount(rawValue);
    }
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      if (!fundingGoal.id) {
         const { error } = await supabase
            .from('funding_goal')
            .insert([{ goal_amount: newGoalAmount, current_total: fundingGoal.current_total }]);
          if (error) throw error;
      } else {
        const { error } = await supabase
            .from('funding_goal')
            .update({ goal_amount: newGoalAmount, updated_at: new Date().toISOString() })
            .eq('id', fundingGoal.id);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Funding goal updated successfully.",
        className: "bg-green-50 border-green-200",
      });
      fetchData();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update funding goal.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#3B5998]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 w-full overflow-x-hidden">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#3B5998]">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Manage funding goals and track sponsorships</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <Button variant="outline" onClick={fetchData} size="sm" className="flex-1 md:flex-none">
               <RefreshCw className="w-4 h-4 mr-2" /> Refresh
             </Button>
             <Button variant="destructive" onClick={handleLogout} size="sm" className="flex-1 md:flex-none">
               <LogOut className="w-4 h-4 mr-2" /> Logout
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(fundingGoal.current_total, { type: 'currency' })}</div>
              <p className="text-xs text-muted-foreground">
                {formatNumber((Number(fundingGoal.current_total) / Number(fundingGoal.goal_amount) * 100), { type: 'percent' })} of goal
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contributions</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(memberships.length)}</div>
              <p className="text-xs text-muted-foreground">
                Supporters recorded
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Goal Setting</CardTitle>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleUpdateGoal} className="flex gap-2">
                 <div className="flex-1">
                   <Input 
                     type="text"
                     value={displayGoalAmount}
                     onChange={handleGoalInputChange}
                     placeholder="Enter goal amount"
                     className="text-gray-900"
                   />
                 </div>
                 <Button type="submit" size="sm" disabled={isUpdating} className="bg-[#3B5998]">
                    {isUpdating ? '...' : 'Update'}
                 </Button>
               </form>
            </CardContent>
          </Card>
        </div>

        {/* Membership Table */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Recent Sponsorships</CardTitle>
            <CardDescription>
              A list of all recorded membership contributions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Added overflow-x-auto and webkit-overflow-scrolling for mobile table response */}
            <div className="w-full max-h-[500px] overflow-x-auto touch-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberships.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No memberships found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    memberships.map((mem) => (
                      <TableRow key={mem.id}>
                        <TableCell>{new Date(mem.created_at).toLocaleDateString()} {new Date(mem.created_at).toLocaleTimeString()}</TableCell>
                        <TableCell className="font-medium text-[#3B5998]">{mem.tier_name}</TableCell>
                        <TableCell className="font-bold">{formatNumber(mem.amount, { type: 'currency' })}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            mem.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {mem.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-gray-400 font-mono">{mem.id.slice(0, 8)}...</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* Revenue Simulator Section */}
        <div className="w-full overflow-hidden">
          <h2 className="text-2xl font-serif font-bold text-[#3B5998] mb-6">Financial Projections</h2>
          <RevenueSimulator />
        </div>

      </div>
    </div>
  );
};

export default AdminFundingDashboard;
