
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
  DollarSign,
  ShoppingBag,
  Zap,
  LayoutDashboard,
  Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';
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

const RevenueSimulator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Financial Projection State
  const [formData, setFormData] = useState({
    // Hull Operations
    suites: 8, // Using 'suites' database field for Hulls
    hours_open: 14,
    avg_duration: 30, // Session length in minutes
    avg_price: 35, // Price per session (using avg_price db field)
    occupancy_rate: 45,
    // 1. Add 'turnaround_time' to the initial formData state (around line 70)
    turnaround_time: 5, // minutes

    
    // Retail & Secondary Revenue
    retail_spend_per_visit: 12,
    
    // Membership
    active_members: 150,
    monthly_fee: 49,
    
    // Sponsorships (Brand Partners)
    brand_partners: 1,
    fee_per_partner: 5000,
    
    // Real Estate & Expenses
    total_sq_ft: 2500,
    rent_per_sq_ft: 65,
    monthly_staff_cost: 12000,
    monthly_utilities: 1500,

    has_omny: true
  });

  // Load saved projections
  useEffect(() => {
    if (!user) return;

    const fetchProjections = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('financial_projections')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error; 
        
        if (data) {
          setFormData(prev => ({
            ...prev,
            suites: data.suites ?? prev.suites,
            hours_open: data.hours_open ?? prev.hours_open,
            avg_price: data.avg_price ?? prev.avg_price,
            avg_duration: data.avg_duration ?? prev.avg_duration,
            occupancy_rate: data.occupancy_rate ?? prev.occupancy_rate,
            active_members: data.active_members ?? prev.active_members,
            monthly_fee: data.monthly_fee ?? prev.monthly_fee,
            brand_partners: data.brand_partners ?? prev.brand_partners,
            fee_per_partner: data.fee_per_partner ?? prev.fee_per_partner,
            has_omny: data.has_omny ?? prev.has_omny,
            total_sq_ft: data.total_sq_ft ?? prev.total_sq_ft,
            rent_per_sq_ft: data.rent_per_sq_ft ?? prev.rent_per_sq_ft,
            retail_spend_per_visit: data.retail_spend_per_visit ?? prev.retail_spend_per_visit,
            monthly_staff_cost: data.monthly_staff_cost ?? prev.monthly_staff_cost,
            monthly_utilities: data.monthly_utilities ?? prev.monthly_utilities
          }));
        }
      } catch (error) {
        console.error('Error fetching projections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjections();
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'has_omny' ? value : Number(value)
    }));
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your financial scenarios.",
        variant: "destructive"
      });
      return;
    }

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
        title: "Scenario Saved",
        description: "Your financial projections have been updated.",
        className: "bg-[#3B5998] text-[#F5F1E8] border-[#C5A059]"
      });
    } catch (error) {
      console.error('Error saving scenario:', error);
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Calculations
  
  const metrics = useMemo(() => {

    // 1. Hull Revenue
    // Capacity = (Minutes Open / Duration + Turnaround) * Num Hulls
    const totalCycleTime = (formData.avg_duration || 30) + (formData.turnaround_time || 5);
    const dailySessionsCapacity = Math.floor(1440 / totalCycleTime) * formData.suites;

    // OMNY integration boost
    const omnyMultiplier = formData.has_omny ? 1.10 : 1.0;
    const effectiveOccupancy = (formData.occupancy_rate / 100) * omnyMultiplier;
    
    const dailySessions = Math.round(dailySessionsCapacity * effectiveOccupancy);
    const dailyHullRevenue = dailySessions * formData.avg_price;
    const monthlyHullRevenue = dailyHullRevenue * 30;

    // 2. Retail Revenue (driven by foot traffic/sessions)
    // Assuming each session is a distinct visit for simplicity, or 1 visit = 1 session
    const monthlyRetailRevenue = dailySessions * 30 * formData.retail_spend_per_visit;

    // 3. Recurring Revenue (Memberships + Sponsors)
    const monthlyMembershipRevenue = formData.active_members * formData.monthly_fee;
    const monthlySponsorshipRevenue = formData.brand_partners * formData.fee_per_partner;

    const totalMonthlyRevenue = monthlyHullRevenue + monthlyRetailRevenue + monthlyMembershipRevenue + monthlySponsorshipRevenue;
    
    // 4. Expenses
    const annualRent = formData.total_sq_ft * formData.rent_per_sq_ft;
    const monthlyRent = annualRent / 12;
    const totalMonthlyExpenses = monthlyRent + formData.monthly_staff_cost + formData.monthly_utilities;

    // 5. Profitability
    const monthlyProfit = totalMonthlyRevenue - totalMonthlyExpenses;
    const annualRevenue = totalMonthlyRevenue * 12;
    const annualExpenses = totalMonthlyExpenses * 12;
    const annualProfit = monthlyProfit * 12;
    
    const profitMargin = totalMonthlyRevenue > 0 ? (monthlyProfit / totalMonthlyRevenue) * 100 : 0;

    // 6. Break Even Point (Occupancy)
    // Fixed Costs = Rent + Staff + Utilities + Sponsor/Member offset?
    // We want to find occupancy where Revenue = Expenses
    // Rev = (Capacity * Occ * 30 * Price) + (Capacity * Occ * 30 * Retail) + FixedRev
    // Exp = FixedExp
    // FixedRev + (Capacity * 30 * (Price + Retail)) * Occ = FixedExp
    // Occ = (FixedExp - FixedRev) / (Capacity * 30 * (Price + Retail))
    
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
      annualRevenue,
      monthlyRent,
      totalMonthlyExpenses,
      annualExpenses,
      monthlyProfit,
      annualProfit,
      profitMargin,
      breakEvenOccupancy: Math.max(0, Math.min(100, breakEvenOccupancy))
    };
  }, [formData]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-4">
        <Loader2 className="w-12 h-12 text-[#C5A059] animate-spin" />
        <p className="text-[#3B5998] font-medium">Loading your projection model...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 bg-gray-50/50 rounded-xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl font-serif text-[#3B5998] font-bold flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-[#C5A059]" />
            Maslow Revenue Simulator
          </h2>
          <p className="text-gray-500 mt-2 max-w-2xl">
            Project the financial performance of a Maslow Sanctuary location. Adjust hull density, operational hours, and revenue streams to calculate EBITDA.
          </p>
        </div>
        <div className="flex gap-3">
             <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-[#C5A059] hover:bg-[#b08d4b] text-white shadow-lg min-w-[140px]"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Model
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* INPUTS COLUMN */}
        <div className="xl:col-span-7 space-y-6">
          
          {/* 1. Space & Operations */}
          <Card className="border-t-4 border-t-[#3B5998] shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#3B5998]">
                <Building2 className="w-5 h-5" />
                Hull Configuration & Ops
              </CardTitle>
              <CardDescription>Define the physical capacity and operational hours.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Number of Hulls</Label>
                <FormattedInput 
                  value={formData.suites}
                  onChange={(val) => handleInputChange('suites', val)}
                />
              </div>
              <div className="space-y-2">
                <Label>Hours Open / Day</Label>
                <FormattedInput 
                  value={formData.hours_open}
                  onChange={(val) => handleInputChange('hours_open', val)}
                  suffix="hrs"
                />
              </div>
              <div className="space-y-2">
                <Label>Session Duration</Label>
                <FormattedInput 
                  value={formData.avg_duration}
                  onChange={(val) => handleInputChange('avg_duration', val)}
                  suffix="min"
                />
              </div>
              <div className="space-y-2">
                <Label>Price per Session</Label>
                <FormattedInput 
                  value={formData.avg_price}
                  onChange={(val) => handleInputChange('avg_price', val)}
                  prefix="$"
                />
              </div>
              
              <div className="col-span-1 md:col-span-2 pt-4 border-t border-dashed">
                <div className="flex justify-between mb-4">
                  <Label className="text-base font-semibold text-[#3B5998]">Target Occupancy Rate</Label>
                  <span className="text-[#C5A059] font-bold text-lg">{formData.occupancy_rate}%</span>
                </div>
                <Slider 
                  value={[formData.occupancy_rate]} 
                  onValueChange={(val) => handleInputChange('occupancy_rate', val[0])}
                  max={100} 
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Conservative (30%)</span>
                  <span>Target (65%)</span>
                  <span>Peak (90%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Secondary Revenue Streams */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-[#3B5998]">
                  <ShoppingBag className="w-4 h-4" />
                  Retail & Add-ons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-gray-500">Avg Spend / Visit</Label>
                  <FormattedInput 
                    value={formData.retail_spend_per_visit}
                    onChange={(val) => handleInputChange('retail_spend_per_visit', val)}
                    prefix="$"
                  />
                  <p className="text-[10px] text-gray-400">Beverages, merch, supplements</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-[#3B5998]">
                  <DollarSign className="w-4 h-4" />
                  Sponsorships
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-bold text-gray-500">Monthly Revenue</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <FormattedInput 
                      placeholder="Partners"
                      value={formData.brand_partners}
                      onChange={(val) => handleInputChange('brand_partners', val)}
                      suffix="qty"
                    />
                    <FormattedInput 
                      placeholder="Fee"
                      value={formData.fee_per_partner}
                      onChange={(val) => handleInputChange('fee_per_partner', val)}
                      prefix="$"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-[#3B5998]">
                <Users className="w-4 h-4" />
                Membership Program
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Active Members</Label>
                <FormattedInput 
                  value={formData.active_members}
                  onChange={(val) => handleInputChange('active_members', val)}
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Fee</Label>
                <FormattedInput 
                  value={formData.monthly_fee}
                  onChange={(val) => handleInputChange('monthly_fee', val)}
                  prefix="$"
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. Costs & Expenses */}
          <Card className="border-t-4 border-t-red-400 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Wallet className="w-5 h-5" />
                Expenses & Real Estate
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Total Space (sq ft)</Label>
                <FormattedInput 
                  value={formData.total_sq_ft}
                  onChange={(val) => handleInputChange('total_sq_ft', val)}
                />
              </div>
              <div className="space-y-2">
                <Label>Annual Rent / sq ft</Label>
                <FormattedInput 
                  value={formData.rent_per_sq_ft}
                  onChange={(val) => handleInputChange('rent_per_sq_ft', val)}
                  prefix="$"
                />
              </div>
              <div className="space-y-2">
                <Label>Monthly Staffing</Label>
                <FormattedInput 
                  value={formData.monthly_staff_cost}
                  onChange={(val) => handleInputChange('monthly_staff_cost', val)}
                  prefix="$"
                />
              </div>
              <div className="space-y-2">
                <Label>Utilities & Misc</Label>
                <FormattedInput 
                  value={formData.monthly_utilities}
                  onChange={(val) => handleInputChange('monthly_utilities', val)}
                  prefix="$"
                />
              </div>
            </CardContent>
          </Card>
        </div>


        {/* OUTPUTS COLUMN */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Main Hero Card */}
          <Card className="bg-[#3B5998] text-white border-none shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-[#C5A059] opacity-10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <CardHeader>
              <CardTitle className="text-[#C5A059] uppercase tracking-wider text-sm font-semibold">Annual Net Profit</CardTitle>
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
                  Break-even Occ: <span className="text-white">{formatNumber(metrics.breakEvenOccupancy, { maximumFractionDigits: 1 })}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly P&L Summary */}
          <Card className="shadow-lg border-t-4 border-t-[#C5A059]">
            <CardHeader>
              <CardTitle className="text-[#3B5998]">Monthly P&L</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Revenue Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-end border-b pb-1">
                  <span className="font-bold text-gray-700">Total Revenue</span>
                  <span className="font-bold text-[#3B5998]">{formatNumber(metrics.totalMonthlyRevenue, { type: 'currency', maximumFractionDigits: 0 })}</span>
                </div>
                <div className="pl-4 space-y-1 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Hull Sessions</span>
                    <span>{formatNumber(metrics.monthlyHullRevenue, { type: 'currency', maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Retail</span>
                    <span>{formatNumber(metrics.monthlyRetailRevenue, { type: 'currency', maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memberships</span>
                    <span>{formatNumber(metrics.monthlyMembershipRevenue, { type: 'currency', maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sponsorships</span>
                    <span>{formatNumber(metrics.monthlySponsorshipRevenue, { type: 'currency', maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>

              {/* Expense Section */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-end border-b pb-1">
                  <span className="font-bold text-gray-700">Total Expenses</span>
                  <span className="font-bold text-red-600">-{formatNumber(metrics.totalMonthlyExpenses, { type: 'currency', maximumFractionDigits: 0 })}</span>
                </div>
                <div className="pl-4 space-y-1 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Rent</span>
                    <span>{formatNumber(metrics.monthlyRent, { type: 'currency', maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staff</span>
                    <span>{formatNumber(formData.monthly_staff_cost, { type: 'currency', maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Utilities & Misc</span>
                    <span>{formatNumber(formData.monthly_utilities, { type: 'currency', maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>

              {/* Net Result */}
              <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
                <span className="text-lg font-bold text-gray-900">Net Monthly</span>
                <span className={`text-xl font-bold ${metrics.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                   {formatNumber(metrics.monthlyProfit, { type: 'currency', maximumFractionDigits: 0 })}
                </span>
              </div>

            </CardContent>
          </Card>

           {/* Capacity Stats */}
           <Card className="bg-[#3B5998]/5 border-none">
            <CardContent className="p-6">
              <h4 className="font-bold text-[#3B5998] mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Operational Metrics
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Daily Capacity</div>
                  <div className="text-lg font-bold text-gray-800">{metrics.dailySessionsCapacity} <span className="text-xs font-normal text-gray-500">sessions</span></div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase">Est. Daily Visits</div>
                  <div className="text-lg font-bold text-[#C5A059]">{metrics.dailySessions} <span className="text-xs font-normal text-gray-500">visits</span></div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-gray-500 uppercase mb-1">Monthly Foot Traffic</div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#3B5998] h-2.5 rounded-full" style={{ width: `${formData.occupancy_rate}%` }}></div>
                  </div>
                  <div className="text-right text-xs text-gray-500 mt-1">{formatNumber(metrics.dailySessions * 30)} visitors / mo</div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default RevenueSimulator;
