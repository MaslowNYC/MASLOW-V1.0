import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Users, DollarSign, Shield, Lock, AlertTriangle, Activity, CreditCard, Calculator, TrendingUp, BarChart3, Building, ChevronDown, ChevronRight, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { formatNumber } from '@/utils/formatting';
import type { Profile } from '@/types/database.types';

// Import additional dashboard components
import RevenueSimulator from '@/components/RevenueSimulator';
import PricingCalculator from '@/components/PricingCalculator';
import PaymentModal from '@/components/PaymentModal';
import PaymentOptionsModal from '@/components/PaymentOptionsModal';

type TabType = 'financial' | 'pricing' | 'buildout' | 'command';

interface Stats {
  totalUsers: number;
  totalFunding: number;
  tierBreakdown: Record<string, number>;
}

interface EfficiencyData {
  avgTurnaround: string;
  annualLoss: string;
  leakDetected: boolean;
}

interface UsageLogRow {
  turnaround_time: number | null;
  created_at: string | null;
}

// Build-Out Planner Types
interface BuildOutCategory {
  name: string;
  items: { label: string; amount: number }[];
}

interface BuildOutData {
  realEstate: BuildOutCategory;
  designArchitecture: BuildOutCategory;
  construction: BuildOutCategory;
  ffe: BuildOutCategory;
  technology: BuildOutCategory;
  preOpening: BuildOutCategory;
  amountRaised: number;
}

const AdminFundingDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate: NavigateFunction = useNavigate();

  // Security State
  const [verifying, setVerifying] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // Data State
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalFunding: 0,
    tierBreakdown: {}
  });
  const [efficiencyData, setEfficiencyData] = useState<EfficiencyData | null>(null);
  const [recentPledges, setRecentPledges] = useState<Profile[]>([]);
  const [allUsers, setAllUsers] = useState<Profile[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Payment Modal State
  const [showPaymentOptions, setShowPaymentOptions] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<{ name: string; price: number }>({ name: 'Test Tier', price: 100 });

  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>('financial');

  // Build-Out Planner State
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    realEstate: true,
    designArchitecture: false,
    construction: false,
    ffe: false,
    technology: false,
    preOpening: false
  });

  const [buildOutData, setBuildOutData] = useState<BuildOutData>({
    realEstate: {
      name: 'Real Estate',
      items: [
        { label: 'Security Deposit (3 months)', amount: 40625 },
        { label: 'First Month Rent', amount: 13542 },
        { label: 'Broker Fee', amount: 13542 },
        { label: 'Legal (Lease Review)', amount: 5000 }
      ]
    },
    designArchitecture: {
      name: 'Design & Architecture',
      items: [
        { label: 'Architect / MEP Engineer', amount: 25000 },
        { label: 'Interior Designer', amount: 15000 },
        { label: 'Permits & Expediting', amount: 10000 },
        { label: '3D Renderings', amount: 3000 }
      ]
    },
    construction: {
      name: 'Construction',
      items: [
        { label: 'General Contractor', amount: 175000 },
        { label: 'Plumbing (8 suites)', amount: 40000 },
        { label: 'Electrical', amount: 25000 },
        { label: 'HVAC', amount: 35000 },
        { label: 'Flooring', amount: 20000 },
        { label: 'Millwork & Cabinetry', amount: 30000 },
        { label: 'Contingency (15%)', amount: 48750 }
      ]
    },
    ffe: {
      name: 'FF&E (Furniture, Fixtures & Equipment)',
      items: [
        { label: 'Suite Pods (8 units)', amount: 80000 },
        { label: 'Lounge Furniture', amount: 15000 },
        { label: 'Reception Desk', amount: 8000 },
        { label: 'Lighting Fixtures', amount: 12000 },
        { label: 'Signage & Wayfinding', amount: 5000 },
        { label: 'Art & Decor', amount: 10000 }
      ]
    },
    technology: {
      name: 'Technology',
      items: [
        { label: 'OMNY Integration / Hardware', amount: 15000 },
        { label: 'POS System', amount: 5000 },
        { label: 'Security Cameras', amount: 8000 },
        { label: 'Access Control System', amount: 12000 },
        { label: 'WiFi Infrastructure', amount: 5000 },
        { label: 'Audio/Visual', amount: 10000 }
      ]
    },
    preOpening: {
      name: 'Pre-Opening Costs',
      items: [
        { label: 'Staff Training (2 weeks)', amount: 8000 },
        { label: 'Initial Inventory', amount: 15000 },
        { label: 'Marketing Launch', amount: 20000 },
        { label: 'Insurance (3 months)', amount: 4500 },
        { label: 'Working Capital Reserve', amount: 50000 },
        { label: 'Soft Opening Expenses', amount: 5000 }
      ]
    },
    amountRaised: 125000
  });

  const toggleSection = (section: string): void => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getTotalCapital = (): number => {
    const categories = [
      buildOutData.realEstate,
      buildOutData.designArchitecture,
      buildOutData.construction,
      buildOutData.ffe,
      buildOutData.technology,
      buildOutData.preOpening
    ];
    return categories.reduce((total, cat) =>
      total + cat.items.reduce((sum, item) => sum + item.amount, 0), 0
    );
  };

  const getCategoryTotal = (category: BuildOutCategory): number => {
    return category.items.reduce((sum, item) => sum + item.amount, 0);
  };

  const updateItemAmount = (categoryKey: keyof Omit<BuildOutData, 'amountRaised'>, itemIndex: number, value: string): void => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setBuildOutData(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        items: prev[categoryKey].items.map((item, idx) =>
          idx === itemIndex ? { ...item, amount: numValue } : item
        )
      }
    }));
  };

  const updateAmountRaised = (value: string): void => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    setBuildOutData(prev => ({ ...prev, amountRaised: numValue }));
  };

  const formatInputValue = (value: number): string => {
    return value.toLocaleString('en-US');
  };

  const exportBuildOutPDF = (): void => {
    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const totalCapital = getTotalCapital();
    const remaining = totalCapital - buildOutData.amountRaised;
    const percentRaised = (buildOutData.amountRaised / totalCapital) * 100;

    const categories = [
      buildOutData.realEstate,
      buildOutData.designArchitecture,
      buildOutData.construction,
      buildOutData.ffe,
      buildOutData.technology,
      buildOutData.preOpening
    ];

    const categoryRows = categories.map(cat => `
      <tr style="background: #f8f8f8; font-weight: bold;">
        <td colspan="2">${cat.name}</td>
        <td class="right">$${getCategoryTotal(cat).toLocaleString()}</td>
      </tr>
      ${cat.items.map(item => `
        <tr>
          <td></td>
          <td>${item.label}</td>
          <td class="right">$${item.amount.toLocaleString()}</td>
        </tr>
      `).join('')}
    `).join('');

    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Maslow Build-Out Capital Plan - ${reportDate}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Georgia', serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 3px solid #C5A059; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 32px; font-weight: bold; color: #3B5998; }
          .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
          .date { color: #888; font-size: 12px; margin-top: 10px; }
          h2 { color: #3B5998; font-size: 18px; margin: 25px 0 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
          .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; }
          .kpi { background: #f8f8f8; padding: 15px; border-radius: 8px; text-align: center; }
          .kpi-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
          .kpi-value { font-size: 24px; font-weight: bold; color: #3B5998; margin-top: 5px; }
          .kpi-value.success { color: #16a34a; }
          .kpi-value.warning { color: #dc2626; }
          .progress-bar { background: #e5e5e5; border-radius: 10px; height: 20px; margin: 15px 0; overflow: hidden; }
          .progress-fill { background: linear-gradient(90deg, #3B5998, #C5A059); height: 100%; border-radius: 10px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .table th, .table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; }
          .table th { background: #3B5998; color: white; font-size: 11px; text-transform: uppercase; }
          .table td { font-size: 13px; }
          .table .right { text-align: right; }
          .total-row { background: #3B5998 !important; color: white !important; font-weight: bold; }
          .total-row td { color: white !important; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 11px; color: #888; text-align: center; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">MASLOW</div>
          <div class="subtitle">Build-Out Capital Plan</div>
          <div class="date">Generated: ${reportDate}</div>
        </div>

        <h2>Funding Summary</h2>
        <div class="kpi-grid">
          <div class="kpi">
            <div class="kpi-label">Total Capital Required</div>
            <div class="kpi-value">$${totalCapital.toLocaleString()}</div>
          </div>
          <div class="kpi">
            <div class="kpi-label">Amount Raised</div>
            <div class="kpi-value success">$${buildOutData.amountRaised.toLocaleString()}</div>
          </div>
          <div class="kpi">
            <div class="kpi-label">Remaining to Raise</div>
            <div class="kpi-value warning">$${remaining.toLocaleString()}</div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-size: 12px; color: #666;">Funding Progress</span>
            <span style="font-size: 12px; font-weight: bold; color: #3B5998;">${percentRaised.toFixed(1)}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentRaised}%;"></div>
          </div>
        </div>

        <h2>Capital Requirements Breakdown</h2>
        <table class="table">
          <tr><th>Category</th><th>Line Item</th><th class="right">Amount</th></tr>
          ${categoryRows}
          <tr class="total-row">
            <td colspan="2">TOTAL CAPITAL REQUIRED</td>
            <td class="right">$${totalCapital.toLocaleString()}</td>
          </tr>
        </table>

        <div class="footer">
          <p>This report was generated by Maslow Build-Out Planner</p>
          <p>Confidential - For Internal Use Only</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportHTML);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  // 1. SECURITY CHECK
  useEffect(() => {
    const checkAdminStatus = async (): Promise<void> => {
      if (!user) {
        navigate('/');
        return;
      }
      const { data, error } = await (supabase
        .from('profiles') as any)
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error || !data || data.is_admin !== true) {
        console.warn("Unauthorized access attempt blocked.");
        navigate('/');
      } else {
        setIsAdmin(true);
        setVerifying(false);
        fetchData();
      }
    };
    checkAdminStatus();
  }, [user, navigate]);

  // 2. DATA FETCHING
  const fetchData = async (): Promise<void> => {
    try {
      // A. Fetch Users
      const { data: profiles } = await (supabase
        .from('profiles') as any)
        .select('*')
        .order('created_at', { ascending: false });

      setAllUsers((profiles as Profile[]) || []);

      // Calc User Stats
      const totalUsers = profiles?.length || 0;
      let totalFunding = 0;
      const tierBreakdown: Record<string, number> = {};

      profiles?.forEach((profile: Profile) => {
        const amount = profile.contribution_amount || getTierPrice(profile.membership_tier);
        totalFunding += amount;
        const tier = profile.membership_tier || 'Free/None';
        tierBreakdown[tier] = (tierBreakdown[tier] || 0) + 1;
      });

      setStats({ totalUsers, totalFunding, tierBreakdown });
      setRecentPledges((profiles?.slice(0, 10) as Profile[]) || []);

      // B. Fetch Operational Logs (The Efficiency Leak)
      const { data: logs } = await (supabase
        .from('usage_logs') as any)
        .select('turnaround_time, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (logs && logs.length > 0) {
        // OPERATIONAL FORMULA
        const TARGET_TURNAROUND = 1.5; // 90 Seconds
        const SESSION_PRICE = 85;

        // Filter out nulls
        const validLogs = (logs as UsageLogRow[]).filter(l => l.turnaround_time !== null);
        const totalTurnaround = validLogs.reduce((acc, log) => acc + (log.turnaround_time ?? 0), 0);
        const avgTurnaround = validLogs.length > 0 ? totalTurnaround / validLogs.length : 0;

        // Calculate Revenue Loss based on 12h day (720 mins)
        const targetCycle = 30 + TARGET_TURNAROUND;
        const actualCycle = 30 + avgTurnaround;

        const potentialSessions = Math.floor(720 / targetCycle);
        const actualSessions = Math.floor(720 / actualCycle);

        const dailyLoss = (potentialSessions - actualSessions) * SESSION_PRICE;
        const annualLoss = dailyLoss * 365;

        setEfficiencyData({
          avgTurnaround: avgTurnaround.toFixed(1),
          annualLoss: annualLoss.toLocaleString(),
          leakDetected: avgTurnaround > TARGET_TURNAROUND
        });
      }

    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const getTierPrice = (tierName: string | null | undefined): number => {
    switch (tierName) {
      case 'THE BUILDER': return 100;
      case 'THE FOUNDING MEMBER': return 500;
      case 'THE ARCHITECT': return 10000;
      case 'THE SOVEREIGN': return 25000;
      default: return 0;
    }
  };

  const downloadCSV = (): void => {
    if (allUsers.length === 0) return;
    const headers = ['ID', 'Email', 'First Name', 'Last Name', 'Tier', 'Total Contributed', 'Joined Date'];
    const rows = allUsers.map(profile => [
      profile.id,
      profile.email,
      profile.first_name || '',
      profile.last_name || '',
      profile.membership_tier || 'None',
      profile.contribution_amount || getTierPrice(profile.membership_tier),
      new Date(profile.created_at || '').toLocaleDateString()
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `maslow_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (verifying || loadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F1E8]">
        <Lock className="w-12 h-12 text-[#C5A059] mb-4 animate-pulse" />
        <div className="text-[#3B5998] font-serif text-xl tracking-widest">VERIFYING SECURITY CLEARANCE...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'financial', label: 'Financial Tools', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'pricing', label: 'Session Pricing', icon: <Calculator className="w-4 h-4" /> },
    { id: 'buildout', label: 'Build-Out Planner', icon: <Building className="w-4 h-4" /> },
    { id: 'command', label: 'Revenue Command', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-[#F5F1E8] min-h-screen">

      {/* TAB NAVIGATION */}
      <div className="mb-4">
        <div className="flex gap-1 border-b-2 border-[#3B5998]/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 font-semibold text-xs md:text-sm uppercase tracking-wider transition-all duration-200 border-b-4 -mb-[2px] ${
                activeTab === tab.id
                  ? 'border-[#C5A059] text-[#3B5998] bg-white rounded-t-lg'
                  : 'border-transparent text-[#3B5998]/60 hover:text-[#3B5998] hover:bg-white/50'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: FINANCIAL TOOLS */}
      {activeTab === 'financial' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3B5998] uppercase tracking-widest">Financial Tools</h1>
            <p className="text-[#3B5998]/60 mt-1 text-sm">Revenue projections, pricing models, and payment testing.</p>
          </div>

          {/* Revenue Simulator */}
          <div>
            <RevenueSimulator />
          </div>
        </motion.div>
      )}

      {/* TAB 2: SESSION PRICING CALCULATOR */}
      {activeTab === 'pricing' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3B5998] uppercase tracking-widest">Session Pricing Calculator</h1>
            <p className="text-[#3B5998]/60 mt-1 text-sm">Configure and simulate session pricing models.</p>
          </div>

          {/* Pricing Calculator */}
          <div className="mb-6">
            <PricingCalculator />
          </div>
        </motion.div>
      )}

      {/* TAB 3: BUILD-OUT PLANNER */}
      {activeTab === 'buildout' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6 border-b-4 border-[#C5A059] pb-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3B5998] uppercase tracking-widest">Build-Out Planner</h1>
              <p className="text-[#3B5998]/60 mt-1 text-sm">Capital requirements and funding tracker for location build-out.</p>
            </div>
            <Button
              onClick={exportBuildOutPDF}
              size="sm"
              variant="outline"
              className="border-[#3B5998] text-[#3B5998] hover:bg-[#3B5998] hover:text-white"
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white border-t-4 border-t-[#3B5998]">
              <CardContent className="pt-4">
                <div className="text-xs font-bold text-[#3B5998] uppercase tracking-wider mb-1">Total Capital Required</div>
                <div className="text-3xl font-black text-[#3B5998]">${getTotalCapital().toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="bg-white border-t-4 border-t-green-500">
              <CardContent className="pt-4">
                <div className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">Amount Raised</div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 text-xl font-black">$</span>
                  <Input
                    type="text"
                    value={formatInputValue(buildOutData.amountRaised)}
                    onChange={(e) => updateAmountRaised(e.target.value)}
                    className="pl-8 text-3xl font-black text-green-600 h-12 border-green-200 focus:border-green-500"
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white border-t-4 border-t-amber-500">
              <CardContent className="pt-4">
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Remaining to Raise</div>
                <div className="text-3xl font-black text-amber-600">${(getTotalCapital() - buildOutData.amountRaised).toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Funding Progress Bar */}
          <Card className="mb-6 bg-gradient-to-r from-[#3B5998]/5 to-[#C5A059]/5">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-[#3B5998]">Funding Progress</span>
                <span className="text-sm font-bold text-[#C5A059]">
                  {((buildOutData.amountRaised / getTotalCapital()) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#3B5998] to-[#C5A059] transition-all duration-500"
                  style={{ width: `${(buildOutData.amountRaised / getTotalCapital()) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>$0</span>
                <span>${getTotalCapital().toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Collapsible Cost Sections */}
          <div className="space-y-3">
            {[
              { key: 'realEstate' as const, data: buildOutData.realEstate },
              { key: 'designArchitecture' as const, data: buildOutData.designArchitecture },
              { key: 'construction' as const, data: buildOutData.construction },
              { key: 'ffe' as const, data: buildOutData.ffe },
              { key: 'technology' as const, data: buildOutData.technology },
              { key: 'preOpening' as const, data: buildOutData.preOpening }
            ].map(({ key, data }) => (
              <Card key={key} className="overflow-hidden">
                <button
                  onClick={() => toggleSection(key)}
                  className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {expandedSections[key] ? (
                      <ChevronDown className="w-5 h-5 text-[#3B5998]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[#3B5998]" />
                    )}
                    <span className="font-bold text-[#3B5998]">{data.name}</span>
                  </div>
                  <span className="font-bold text-[#C5A059]">${getCategoryTotal(data).toLocaleString()}</span>
                </button>
                {expandedSections[key] && (
                  <CardContent className="pt-0 pb-3">
                    <div className="space-y-2">
                      {data.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3 py-1 border-b border-gray-100 last:border-0">
                          <span className="text-sm text-gray-700 flex-1">{item.label}</span>
                          <div className="relative w-32">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <Input
                              type="text"
                              value={formatInputValue(item.amount)}
                              onChange={(e) => updateItemAmount(key, idx, e.target.value)}
                              className="pl-7 text-right text-sm h-8"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Total Summary */}
          <Card className="mt-6 bg-[#3B5998] text-white">
            <CardContent className="py-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold uppercase tracking-wider">Total Capital Required</span>
                <span className="text-3xl font-black">${getTotalCapital().toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* TAB 4: REVENUE COMMAND */}
      {activeTab === 'command' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* HERO IMAGE SECTION */}
          <div className="relative mb-6 rounded-xl shadow-xl overflow-hidden z-0">
            <img
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
              alt="Dashboard Hero"
              className="w-full h-40 md:h-56 object-cover"
            />
            <div className="absolute inset-0 ring-1 ring-white/20 rounded-xl pointer-events-none bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 md:left-6 text-white z-10">
              <h2 className="text-xl md:text-2xl font-serif font-bold tracking-wide">Operational Command</h2>
              <p className="text-white/80 font-light text-sm">Status: Active Monitoring</p>
            </div>
          </div>

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-6 border-b-4 border-[#C5A059] pb-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-black text-[#3B5998] uppercase tracking-widest">Revenue Command</h1>
              <p className="text-[#C5A059] font-bold mt-1 text-sm">Maslow Administrative Command</p>
            </div>
            <Button
              onClick={downloadCSV}
              className="bg-[#3B5998] text-white hover:bg-[#2d4475] flex items-center gap-2 text-sm"
            >
              <Download size={16} /> Export CSV
            </Button>
          </div>

          {/* OPERATIONAL INTELLIGENCE ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* The Efficiency Leak Card */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className={`h-full border-l-8 ${efficiencyData?.leakDetected ? 'border-l-red-500 bg-red-50' : 'border-l-green-500 bg-green-50'}`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${efficiencyData?.leakDetected ? 'text-red-800' : 'text-green-800'}`}>
                    <AlertTriangle className="h-5 w-5" />
                    {efficiencyData?.leakDetected ? 'Efficiency Leak Detected' : 'Operations Optimal'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-4xl font-black mb-2 ${efficiencyData?.leakDetected ? 'text-red-600' : 'text-green-600'}`}>
                     -${efficiencyData?.annualLoss || '0'}/yr
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Projected revenue loss per suite due to cleaning delays.
                  </p>
                  <div className="text-sm font-medium bg-white/50 p-2 rounded inline-block">
                    Avg Turnaround: <span className="text-slate-900 font-bold">{efficiencyData?.avgTurnaround || '0'} min</span>
                    <span className="text-slate-500 ml-2">(Target: 1.5 min)</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Real-Time Grid Status */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="h-full bg-white border border-[#3B5998]/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#3B5998]">
                    <Activity className="h-5 w-5" />
                    Live Grid Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-black text-[#3B5998]">82%</div>
                    <span className="text-green-500 font-bold text-sm">+4% vs avg</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Current active sessions across all suites.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* EXISTING METRICS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div className="bg-white p-4 md:p-5 rounded-lg shadow-md border border-[#3B5998]/10">
              <div className="flex items-center gap-3 mb-1">
                <Users className="text-[#C5A059] w-6 h-6" />
                <h3 className="text-xs font-bold text-[#3B5998] uppercase">Total Members</h3>
              </div>
              <p className="text-3xl md:text-4xl font-black text-[#3B5998]">{stats.totalUsers}</p>
            </motion.div>

            <motion.div className="bg-white p-4 md:p-5 rounded-lg shadow-md border border-[#3B5998]/10">
              <div className="flex items-center gap-3 mb-1">
                <DollarSign className="text-green-600 w-6 h-6" />
                <h3 className="text-xs font-bold text-[#3B5998] uppercase">Total Pledged</h3>
              </div>
              <p className="text-3xl md:text-4xl font-black text-[#3B5998]">{formatNumber(stats.totalFunding)}</p>
            </motion.div>

            <motion.div className="bg-white p-4 md:p-5 rounded-lg shadow-md border border-[#3B5998]/10">
              <div className="flex items-center gap-3 mb-1">
                <Shield className="text-[#3B5998] w-6 h-6" />
                <h3 className="text-xs font-bold text-[#3B5998] uppercase">Top Tier</h3>
              </div>
              <div className="text-sm space-y-1">
                {Object.entries(stats.tierBreakdown).map(([tier, count]) => (
                  <div key={tier} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
                    <span className="font-medium text-[#3B5998]">{tier}</span>
                    <span className="font-bold text-[#C5A059]">{count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-lg shadow-md border border-[#3B5998]/10 overflow-hidden">
            <div className="bg-[#3B5998] px-4 py-2">
              <h3 className="text-white font-bold uppercase tracking-wider text-sm">Recent Accessions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-xs font-bold text-[#3B5998] uppercase">Email</th>
                    <th className="px-3 py-2 text-xs font-bold text-[#3B5998] uppercase">Tier</th>
                    <th className="px-3 py-2 text-xs font-bold text-[#3B5998] uppercase">Date</th>
                    <th className="px-3 py-2 text-xs font-bold text-[#3B5998] uppercase text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentPledges.map((profile) => (
                    <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 text-[#3B5998] font-medium text-sm">{profile.email}</td>
                      <td className="px-3 py-2 text-sm text-gray-600">
                        <span className="bg-[#F5F1E8] px-2 py-0.5 rounded text-[#3B5998] font-bold text-xs border border-[#C5A059]/30">
                          {profile.membership_tier || 'Member'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">{new Date(profile.created_at || '').toLocaleDateString()}</td>
                      <td className="px-3 py-2 text-right font-bold text-[#3B5998] text-sm">
                        {formatNumber(profile.contribution_amount || getTierPrice(profile.membership_tier))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Payment Modals (shared across tabs) */}
      <PaymentOptionsModal
        isOpen={showPaymentOptions}
        onClose={() => setShowPaymentOptions(false)}
        tierName={selectedTier.name}
        price={selectedTier.price}
        onPayWithCard={() => {
          setShowPaymentOptions(false);
          setShowPaymentModal(true);
        }}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        tierName={selectedTier.name}
        price={selectedTier.price}
      />
    </div>
  );
};

export default AdminFundingDashboard;
