import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
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
  LayoutDashboard,
  Wallet
} from 'lucide-react';
import { formatNumber } from '@/utils/formatting';

// Interface for FormattedInput props
interface FormattedInputProps {
  value: number | string | null | undefined;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  className?: string;
}

// Helper component for formatted input
const FormattedInput: React.FC<FormattedInputProps> = ({
  value,
  onChange,
  prefix = "",
  suffix = "",
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');

  useEffect(() => {
    if (value === '' || value === null || value === undefined) {
      setDisplayValue('');
    } else {
      setDisplayValue(Number(value).toLocaleString('en-US'));
    }
  }, [value]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
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

// Interface for form data state
interface FormData {
  // Maslow Suite Operations
  suites: number;
  hours_open: number;
  avg_duration: number;
  avg_price: number;
  occupancy_rate: number;
  turnaround_time: number;

  // Retail & Secondary Revenue
  retail_spend_per_visit: number;

  // Membership
  active_members: number;
  monthly_fee: number;

  // Sponsorships (Brand Partners)
  brand_partners: number;
  fee_per_partner: number;

  // Real Estate & Expenses
  total_sq_ft: number;
  rent_per_sq_ft: number;
  monthly_staff_cost: number;
  monthly_utilities: number;

  has_omny: boolean;
}

// Interface for calculated metrics
interface Metrics {
  dailySessionsCapacity: number;
  dailySessions: number;
  monthlySuiteRevenue: number;
  monthlyRetailRevenue: number;
  monthlyMembershipRevenue: number;
  monthlySponsorshipRevenue: number;
  totalMonthlyRevenue: number;
  annualRevenue: number;
  monthlyRent: number;
  totalMonthlyExpenses: number;
  annualExpenses: number;
  monthlyProfit: number;
  annualProfit: number;
  profitMargin: number;
  breakEvenOccupancy: number;
}

const RevenueSimulator: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Financial Projection State
  const [formData, setFormData] = useState<FormData>({
    // Maslow Suite Operations
    suites: 8,
    hours_open: 14,
    avg_duration: 30,
    avg_price: 35,
    occupancy_rate: 45,
    turnaround_time: 90,

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

    const fetchProjections = async (): Promise<void> => {
      setLoading(true);
      try {
        const { data, error } = await (supabase
          .from('financial_projections') as any)
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

  const handleInputChange = (field: keyof FormData, value: string | number | boolean): void => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'has_omny' ? value : Number(value)
    }));
  };

  const handleSave = async (): Promise<void> => {
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
      const { error } = await (supabase
        .from('financial_projections') as any)
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
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Calculations
  const metrics = useMemo<Metrics>(() => {
    // 1. Maslow Suite Revenue (Paid Sessions)
    const turnaroundMinutes = (formData.turnaround_time || 90) / 60;
    const totalCycleTime = (formData.avg_duration || 30) + turnaroundMinutes;

    // FIX: Use actual hours_open instead of hardcoded 1440
    const minutesOpen = (formData.hours_open || 24) * 60;
    const dailySessionsCapacity = Math.floor(minutesOpen / totalCycleTime) * formData.suites;

    // OMNY integration boost
    const omnyMultiplier = formData.has_omny ? 1.10 : 1.0;
    const effectiveOccupancy = (formData.occupancy_rate / 100) * omnyMultiplier;

    const dailySessions = Math.round(dailySessionsCapacity * effectiveOccupancy);
    const dailySuiteRevenue = dailySessions * formData.avg_price;
    const monthlySuiteRevenue = dailySuiteRevenue * 30;

    // 2. Retail Revenue
    const monthlyRetailRevenue = dailySessions * 30 * formData.retail_spend_per_visit;

    // 3. Recurring Revenue
    const monthlyMembershipRevenue = formData.active_members * formData.monthly_fee;
    const monthlySponsorshipRevenue = formData.brand_partners * formData.fee_per_partner;

    const totalMonthlyRevenue = monthlySuiteRevenue + monthlyRetailRevenue + monthlyMembershipRevenue + monthlySponsorshipRevenue;

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
      monthlySuiteRevenue,
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
    <div className="w-full max-w-7xl mx-auto p-3 md:p-4 space-y-4 bg-gray-50/50 rounded-xl">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-200 pb-3">
        <div>
          <h2 className="text-xl md:text-2xl font-serif text-[#3B5998] font-bold flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-[#C5A059]" />
            Revenue Simulator
          </h2>
          <p className="text-gray-500 text-xs mt-1">
            Project financial performance. Adjust inputs to calculate EBITDA.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          size="sm"
          className="bg-[#C5A059] hover:bg-[#b08d4b] text-white shadow-md"
        >
          {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
          Save
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* INPUTS COLUMN */}
        <div className="lg:col-span-7 space-y-3">

          {/* Space & Operations */}
          <Card className="border-t-2 border-t-[#3B5998] shadow-sm">
            <CardHeader className="py-3 px-4">
              <CardTitle className="flex items-center gap-2 text-[#3B5998] text-sm">
                <Building2 className="w-4 h-4" />
                Suite Configuration & Ops
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 pb-4">
              <div className="space-y-1">
                <Label className="text-xs">Suites</Label>
                <FormattedInput
                  value={formData.suites}
                  onChange={(val) => handleInputChange('suites', val)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hours/Day</Label>
                <FormattedInput
                  value={formData.hours_open}
                  onChange={(val) => handleInputChange('hours_open', val)}
                  suffix="hrs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Duration</Label>
                <FormattedInput
                  value={formData.avg_duration}
                  onChange={(val) => handleInputChange('avg_duration', val)}
                  suffix="min"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Price</Label>
                <FormattedInput
                  value={formData.avg_price}
                  onChange={(val) => handleInputChange('avg_price', val)}
                  prefix="$"
                />
              </div>
              <div className="space-y-1 col-span-2 md:col-span-1">
                <div className="flex justify-between items-baseline">
                  <Label className="text-xs">Turnaround</Label>
                  <span className="text-[#C5A059] font-bold text-sm">{formData.turnaround_time}s</span>
                </div>
                <Slider
                  value={[formData.turnaround_time]}
                  onValueChange={(val: number[]) => handleInputChange('turnaround_time', val[0])}
                  min={0}
                  max={300}
                  step={15}
                  className="py-1"
                />
              </div>
              <div className="col-span-2 md:col-span-3 pt-2 md:pt-0 border-t md:border-t-0 border-dashed">
                <div className="flex justify-between mb-1">
                  <Label className="text-xs font-semibold text-[#3B5998]">Occupancy</Label>
                  <span className="text-[#C5A059] font-bold text-sm">{formData.occupancy_rate}%</span>
                </div>
                <Slider
                  value={[formData.occupancy_rate]}
                  onValueChange={(val: number[]) => handleInputChange('occupancy_rate', val[0])}
                  max={100}
                  step={1}
                  className="py-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Secondary Revenue - Combined Row */}
          <Card className="shadow-sm">
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-sm flex items-center gap-2 text-[#3B5998]">
                <ShoppingBag className="w-4 h-4" />
                Revenue Streams
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 pb-3">
              <div className="space-y-1">
                <Label className="text-xs">Retail/Visit</Label>
                <FormattedInput
                  value={formData.retail_spend_per_visit}
                  onChange={(val) => handleInputChange('retail_spend_per_visit', val)}
                  prefix="$"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sponsors</Label>
                <FormattedInput
                  value={formData.brand_partners}
                  onChange={(val) => handleInputChange('brand_partners', val)}
                  suffix="qty"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Fee/Partner</Label>
                <FormattedInput
                  value={formData.fee_per_partner}
                  onChange={(val) => handleInputChange('fee_per_partner', val)}
                  prefix="$"
                />
              </div>
              <div className="hidden md:block" />
              <div className="space-y-1">
                <Label className="text-xs">Members</Label>
                <FormattedInput
                  value={formData.active_members}
                  onChange={(val) => handleInputChange('active_members', val)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Member Fee</Label>
                <FormattedInput
                  value={formData.monthly_fee}
                  onChange={(val) => handleInputChange('monthly_fee', val)}
                  prefix="$"
                />
              </div>
            </CardContent>
          </Card>

          {/* Expenses & Real Estate */}
          <Card className="border-t-2 border-t-red-400 shadow-sm">
            <CardHeader className="py-2 px-4">
              <CardTitle className="flex items-center gap-2 text-red-700 text-sm">
                <Wallet className="w-4 h-4" />
                Expenses & Real Estate
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4 pb-3">
              <div className="space-y-1">
                <Label className="text-xs">Sq Ft</Label>
                <FormattedInput
                  value={formData.total_sq_ft}
                  onChange={(val) => handleInputChange('total_sq_ft', val)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Rent/sqft/yr</Label>
                <FormattedInput
                  value={formData.rent_per_sq_ft}
                  onChange={(val) => handleInputChange('rent_per_sq_ft', val)}
                  prefix="$"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Staff/mo</Label>
                <FormattedInput
                  value={formData.monthly_staff_cost}
                  onChange={(val) => handleInputChange('monthly_staff_cost', val)}
                  prefix="$"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Utilities/mo</Label>
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
        <div className="lg:col-span-5 space-y-3">
          {/* Monthly P&L */}
          <Card className="shadow-md border-t-2 border-t-[#C5A059]">
            <CardHeader className="py-2 px-4">
              <CardTitle className="text-[#3B5998] text-sm">Monthly P&L</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-3">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-700">Revenue</span>
                <span className="font-bold text-[#3B5998]">{formatNumber(metrics.totalMonthlyRevenue, { type: 'currency', maximumFractionDigits: 0 })}</span>
              </div>
              <div className="pl-3 space-y-0.5 text-xs text-gray-500">
                <div className="flex justify-between"><span>Sessions</span><span>{formatNumber(metrics.monthlySuiteRevenue, { type: 'currency', maximumFractionDigits: 0 })}</span></div>
                <div className="flex justify-between"><span>Retail</span><span>{formatNumber(metrics.monthlyRetailRevenue, { type: 'currency', maximumFractionDigits: 0 })}</span></div>
                <div className="flex justify-between"><span>Members</span><span>{formatNumber(metrics.monthlyMembershipRevenue, { type: 'currency', maximumFractionDigits: 0 })}</span></div>
                <div className="flex justify-between"><span>Sponsors</span><span>{formatNumber(metrics.monthlySponsorshipRevenue, { type: 'currency', maximumFractionDigits: 0 })}</span></div>
              </div>
              <div className="flex justify-between items-center text-sm pt-1 border-t">
                <span className="font-semibold text-gray-700">Expenses</span>
                <span className="font-bold text-red-600">-{formatNumber(metrics.totalMonthlyExpenses, { type: 'currency', maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t-2 border-gray-200">
                <span className="font-bold text-gray-900">Net Monthly</span>
                <span className={`text-lg font-bold ${metrics.monthlyProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                   {formatNumber(metrics.monthlyProfit, { type: 'currency', maximumFractionDigits: 0 })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Annual Net Profit */}
          <Card className="bg-[#3B5998] text-white border-none shadow-lg relative overflow-hidden">
            <CardContent className="p-4">
              <div className="text-[#C5A059] uppercase tracking-wider text-xs font-semibold mb-1">Annual Net Profit</div>
              <div className="text-3xl font-serif font-bold">
                {formatNumber(metrics.annualProfit, { type: 'currency', maximumFractionDigits: 0 })}
              </div>
              <div className="flex gap-2 mt-2 text-xs">
                <div className="bg-white/10 px-2 py-0.5 rounded">
                  Margin: <span className={metrics.profitMargin > 20 ? "text-green-300" : "text-yellow-300"}>{formatNumber(metrics.profitMargin, { type: 'percent' })}</span>
                </div>
                <div className="bg-white/10 px-2 py-0.5 rounded">
                  Break-even: {formatNumber(metrics.breakEvenOccupancy, { maximumFractionDigits: 1 })}%
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Capacity Stats */}
          <Card className="bg-[#3B5998]/5 border-none">
            <CardContent className="p-3">
              <h4 className="font-bold text-[#3B5998] mb-2 flex items-center gap-2 text-xs">
                <TrendingUp className="w-3 h-3" />
                Operational Metrics
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-500 uppercase text-[10px]">Daily Capacity</div>
                  <div className="font-bold text-gray-800">{metrics.dailySessionsCapacity} sessions</div>
                </div>
                <div>
                  <div className="text-gray-500 uppercase text-[10px]">Est. Daily</div>
                  <div className="font-bold text-[#C5A059]">{metrics.dailySessions} visits</div>
                </div>
                <div className="col-span-2">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-[#3B5998] h-1.5 rounded-full" style={{ width: `${formData.occupancy_rate}%` }}></div>
                  </div>
                  <div className="text-right text-[10px] text-gray-500 mt-0.5">{formatNumber(metrics.dailySessions * 30)} visitors/mo</div>
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
