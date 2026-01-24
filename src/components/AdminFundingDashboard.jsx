
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  Save, 
  TrendingUp, 
  Users, 
  Building2, 
  ShoppingBag,
  LayoutDashboard,
  Wallet,
  AlertCircle
} from 'lucide-react';
import { formatNumber } from '@/utils/formatting';

// Helper component for formatted input
const FormattedInput = ({ value, onChange, prefix = "", suffix = "", ...props }) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value === '' || value === null || value === undefined) {
      setDisplayValue('');
    } else {
      setDisplayValue(Number(value).toLocaleString('en-US'));
    }
  }, [value]);

  const handleChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    setDisplayValue(rawValue ? Number(rawValue).toLocaleString('en-US') : rawValue);
    onChange(rawValue);
  };

  return (
    <div className="relative">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{prefix}</span>}
      <Input 
        {...props} 
        type="text" 
        value={displayValue} 
        onChange={handleChange} 
        className={`${prefix ? 'pl-7' : ''} ${suffix ? 'pr-8' : ''}`}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{suffix}</span>}
    </div>
  );
};

const AdminFundingDashboard = () => {
  const { user, isFounder } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [liveMemberCount, setLiveMemberCount] = useState(0);

  // Financial Projection State
  const [formData, setFormData] = useState({
    suites: 8,
    hours_open: 14,
    avg_duration: 30,
    avg_price: 35,
    occupancy_rate: 45,
    retail_spend_per_visit: 12,
    active_members: 150,
    monthly_fee: 49,
    brand_partners: 1,
    fee_per_partner: 5000,
    total_sq_ft: 2500,
    rent_per_sq_ft: 65,
    monthly_staff_cost: 12000,
    monthly_utilities: 1500,
    has_omny: true
  });

  // Load Data (Live Count + Saved Projections)
  useEffect(() => {
    if (!isFounder) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Get Live Waitlist Count
        const { count, error: countError } = await supabase
          .from('beta_signups')
          .select('*', { count: 'exact', head: true });
        
        if (!countError) setLiveMemberCount(count || 0);

        // 2. Get Saved Projections
        const { data, error } = await supabase
          .from('financial_projections')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(); // Use maybeSingle to avoid 404 error if table empty

        if (data) {
          setFormData(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isFounder]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'has_omny' ? value : Number(value)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('financial_projections')
        .upsert({
          user_id: user.id,
          ...formData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;

      toast({
        title: "Model Saved",
        description: "Financial projections updated successfully.",
        className: "bg-[#3B5998] text-[#F5F1E8] border-[#C5A059]"
      });
    } catch (error) {
      console.error('Error saving:', error);
      toast({ title: "Save Failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // Calculations
  const metrics = useMemo(() => {
    // 1. Hull Revenue
    const dailyMinutes = formData.hours_open * 60;
    const dailySessionsCapacity = Math.floor(dailyMinutes / (formData.avg_duration || 30)) * formData.suites;
    
    // OMNY boost
    const effectiveOccupancy = (formData.occupancy_rate / 100);
    
    const dailySessions = Math.round(dailySessionsCapacity * effectiveOccupancy);
    const dailyHullRevenue = dailySessions * formData.avg_price;
    const monthlyHullRevenue = dailyHullRevenue * 30;

    // 2. Retail Revenue
    const monthlyRetailRevenue = dailySessions * 30 * formData.retail_spend_per_visit;

    // 3. Recurring Revenue
    const monthlyMembershipRevenue = formData.active_members * formData.monthly_fee;
    const monthlySponsorshipRevenue = formData.brand_partners * formData.fee_per_partner;

    const totalMonthlyRevenue = monthlyHullRevenue + monthlyRetailRevenue + monthlyMembershipRevenue + monthlySponsorshipRevenue;
    
    // 4. Expenses
    const annualRent = formData.total_sq_ft * formData.rent_per_sq_ft;
    const monthlyRent = annualRent / 12;
    const totalMonthlyExpenses = monthlyRent + formData.monthly_staff_cost + formData.monthly_utilities;

    // 5. Profitability
    const monthlyProfit = totalMonthlyRevenue - totalMonthlyExpenses;
    const annualProfit = monthlyProfit * 12;
    const profitMargin = totalMonthlyRevenue > 0 ? (monthlyProfit / totalMonthlyRevenue) * 100 : 0;

    // 6. Break Even Point
    const monthlyFixedExpenses = totalMonthlyExpenses;
    const monthlyFixedRevenue = monthlyMembershipRevenue + monthlySponsorshipRevenue;
    const variableRevenuePotential = dailySessionsCapacity * 30 * (formData.avg_price + formData.retail_spend_per_visit);
    
    let breakEvenOccupancy = 0;
    if (variableRevenuePotential > 0) {
      breakEvenOccupancy = ((monthlyFixedExpenses - monthlyFixedRevenue) / variableRevenuePotential) * 100;
    }

    return {
      dailySessionsCapacity,
      dailySessions,
      monthlyHullRevenue,
      monthlyRetailRevenue,
      monthlyMembershipRevenue,
      monthlySponsorshipRevenue,
      totalMonthlyRevenue,
      monthlyRent,
      totalMonthlyExpenses,
      monthlyProfit,
      annualProfit,
      profitMargin,
      breakEvenOccupancy: Math.max(0, Math.min(100, breakEvenOccupancy))
    };
  }, [formData]);

  if (!isFounder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8] text-[#3B5998]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p>Founder credentials required.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1E8]">
        <Loader2 className="w-12 h-12 text-[#C5A059] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] pt-24 pb-12 px-4">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        
        {/* TOP BAR: Live Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#3B5998]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#3B5998] flex items-center gap-3">
              <LayoutDashboard className="w-6 h-6 text-[#C5A059]" />
              Maslow Command Center
            </h1>
            <p className="text-gray-500 text-sm">System Status: Operational</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Live Waitlist</p>
              <p className="text-3xl font-bold text-[#3B5998]">{liveMemberCount.toLocaleString()}</p>
            </div>
            <div className="h-10 w-px bg-gray-200"></div>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-[#C5A059] hover:bg-[#b08d4b] text-white shadow-lg"
            >
              {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Model
            </Button>
          </div>
        </div>

        {/* MAIN SIMULATOR */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* INPUTS (Left Side) */}
          <div className="xl:col-span-7 space-y-6">
            
            {/* Operations */}
            <Card className="border-t-4 border-t-[#3B5998] shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#3B5998]">
                  <Building2 className="w-5 h-5" />
                  Hull Operations
                </CardTitle>
                <CardDescription>Capacity and pricing inputs.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Number of Suites</Label>
                  <FormattedInput value={formData.suites} onChange={(val) => handleInputChange('suites', val)} />
                </div>
                <div className="space-y-2">
                  <Label>Hours Open / Day</Label>
                  <FormattedInput value={formData.hours_open} onChange={(val) => handleInputChange('hours_open', val)} suffix="hrs" />
                </div>
                <div className="space-y-2">
                  <Label>Session Price</Label>
                  <FormattedInput value={formData.avg_price} onChange={(val) => handleInputChange('avg_price', val)} prefix="$" />
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <FormattedInput value={formData.avg_duration} onChange={(val) => handleInputChange('avg_duration', val)} suffix="min" />
                </div>
                
                <div className="col-span-1 md:col-span-2 pt-4 border-t border-dashed">
                  <div className="flex justify-between mb-2">
                    <Label className="font-semibold text-[#3B5998]">Occupancy Rate</Label>
                    <span className="text-[#C5A059] font-bold">{formData.occupancy_rate}%</span>
                  </div>
                  <Slider 
                    value={[formData.occupancy_rate]} 
                    onValueChange={(val) => handleInputChange('occupancy_rate', val[0])}
                    max={100} 
                    step={1}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Members & Sponsors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-[#3B5998]">
                    <Users className="w-4 h-4" />
                    Membership
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Active Members</Label>
                    <FormattedInput value={formData.active_members} onChange={(val) => handleInputChange('active_members', val)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Monthly Fee</Label>
                    <FormattedInput value={formData.monthly_fee} onChange={(val) => handleInputChange('monthly_fee', val)} prefix="$" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-[#3B5998]">
                    <ShoppingBag className="w-4 h-4" />
                    Retail & Partners
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Spend / Visit</Label>
                    <FormattedInput value={formData.retail_spend_per_visit} onChange={(val) => handleInputChange('retail_spend_per_visit', val)} prefix="$" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Partner Revenue</Label>
                    <FormattedInput value={formData.fee_per_partner} onChange={(val) => handleInputChange('fee_per_partner', val)} prefix="$" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expenses */}
            <Card className="border-t-4 border-t-red-400 shadow-sm bg-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Wallet className="w-5 h-5" />
                  Expenses (Monthly)
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Rent (Total/Yr)</Label>
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    {formatNumber(formData.total_sq_ft * formData.rent_per_sq_ft, { type: 'currency', maximumFractionDigits: 0 })}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <FormattedInput placeholder="Sq Ft" value={formData.total_sq_ft} onChange={(val) => handleInputChange('total_sq_ft', val)} />
                    <FormattedInput placeholder="$/ft" value={formData.rent_per_sq_ft} onChange={(val) => handleInputChange('rent_per_sq_ft', val)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Staff & Utils</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <FormattedInput placeholder="Staff" value={formData.monthly_staff_cost} onChange={(val) => handleInputChange('monthly_staff_cost', val)} prefix="$" />
                    <FormattedInput placeholder="Utils" value={formData.monthly_utilities} onChange={(val) => handleInputChange('monthly_utilities', val)} prefix="$" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* OUTPUTS (Right Side) */}
          <div className="xl:col-span-5 space-y-6">
            
            {/* HERO METRIC */}
            <Card className="bg-[#3B5998] text-white border-none shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-[#C5A059] opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
              <CardHeader>
                <CardTitle className="text-[#C5A059] uppercase tracking-wider text-sm font-semibold">Projected Annual Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-serif font-bold mb-2">
                  {formatNumber(metrics.annualProfit, { type: 'currency', maximumFractionDigits: 0 })}
                </div>
                <div className="flex gap-4 mt-4">
                  <div className="bg-white/10 px-3 py-1 rounded text-sm font-medium">
                    Margin: <span className={metrics.profitMargin > 20 ? "text-green-300" : "text-yellow-300"}>{formatNumber(metrics.profitMargin, { type: 'percent' })}</span>
                  </div>
                  <div className="bg-white/10 px-3 py-1 rounded text-sm font-medium">
                    Break-even: <span className="text-white">{formatNumber(metrics.breakEvenOccupancy, { maximumFractionDigits: 1 })}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* P&L Breakdown */}
            <Card className="shadow-lg border-t-4 border-t-[#C5A059] bg-white">
              <CardHeader>
                <CardTitle className="text-[#3B5998]">Monthly P&L</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Revenue */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end border-b pb-1">
                    <span className="font-bold text-gray-700">Revenue</span>
                    <span className="font-bold text-[#3B5998]">{formatNumber(metrics.totalMonthlyRevenue, { type: 'currency', maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="pl-4 space-y-1 text-sm text-gray-500">
                    <div className="flex justify-between"><span>Sessions</span><span>{formatNumber(metrics.monthlyHullRevenue, { type: 'currency', maximumFractionDigits: 0 })}</span></div>
                    <div className="flex justify-between"><span>Retail</span><span>{formatNumber(metrics.monthlyRetailRevenue, { type: 'currency', maximumFractionDigits: 0 })}</span></div>
                    <div className="flex justify-between"><span>Memberships</span><span>{formatNumber(metrics.monthlyMembershipRevenue, { type: 'currency', maximumFractionDigits: 0 })}</span></div>
                  </div>
                </div>

                {/* Expenses */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-end border-b pb-1">
                    <span className="font-bold text-gray-700">Expenses</span>
                    <span className="font-bold text-red-600">-{formatNumber(metrics.totalMonthlyExpenses, { type: 'currency', maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="pl-4 space-y-1 text-sm text-gray-500">
                    <div className="flex justify-between"><span>Rent</span><span>{formatNumber(metrics.monthlyRent, { type: 'currency', maximumFractionDigits: 0 })}</span></div>
                    <div className="flex justify-between"><span>Staff & Ops</span><span>{formatNumber(formData.monthly_staff_cost + formData.monthly_utilities, { type: 'currency', maximumFractionDigits: 0 })}</span></div>
                  </div>
                </div>

                {/* Net */}
                <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
                  <span className="text-lg font-bold text-gray-900">Net Monthly</span>
                  <span className={`text-xl font-bold ${metrics.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                     {formatNumber(metrics.monthlyProfit, { type: 'currency', maximumFractionDigits: 0 })}
                  </span>
                </div>

              </CardContent>
            </Card>

            {/* Foot Traffic Stats */}
            <Card className="bg-[#3B5998]/5 border-none">
              <CardContent className="p-6">
                <h4 className="font-bold text-[#3B5998] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Traffic Metrics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Daily Capacity</div>
                    <div className="text-lg font-bold text-gray-800">{metrics.dailySessionsCapacity}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Est. Visits</div>
                    <div className="text-lg font-bold text-[#C5A059]">{metrics.dailySessions}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFundingDashboard;