import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Users, DollarSign, Shield, Lock, AlertTriangle, Activity, CreditCard, Calculator, TrendingUp, BarChart3, Building, ChevronDown, ChevronRight, FileDown, Save, Loader2, MessageSquare, Video, Layers, Zap, Globe, Smartphone, Server, Cpu, CheckCircle, Clock, ArrowRight } from 'lucide-react';
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

type TabType = 'financial' | 'pricing' | 'buildout' | 'stack' | 'stackpricing' | 'journeys';

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
interface BuildOutItem {
  label: string;
  amount: number;
  notes?: string;
}

interface BuildOutCategory {
  name: string;
  items: BuildOutItem[];
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

  const [savingBuildOut, setSavingBuildOut] = useState<boolean>(false);

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
        { label: 'Plumbing (10 suites)', amount: 50000 },
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
        { label: 'Suite Pods (10 units)', amount: 100000 },
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

  const updateItemNotes = (categoryKey: keyof Omit<BuildOutData, 'amountRaised'>, itemIndex: number, notes: string): void => {
    setBuildOutData(prev => ({
      ...prev,
      [categoryKey]: {
        ...prev[categoryKey],
        items: prev[categoryKey].items.map((item, idx) =>
          idx === itemIndex ? { ...item, notes } : item
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

  // Load build-out data from database
  const loadBuildOutData = async (): Promise<void> => {
    try {
      const { data, error } = await (supabase
        .from('admin_config') as any)
        .select('config_value')
        .eq('config_key', 'buildout_planner')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading build-out data:', error);
        return;
      }

      if (data?.config_value) {
        setBuildOutData(data.config_value as BuildOutData);
      }
    } catch (err) {
      console.error('Error loading build-out data:', err);
    }
  };

  // Save build-out data to database
  const saveBuildOutData = async (): Promise<void> => {
    setSavingBuildOut(true);
    try {
      const { error } = await (supabase
        .from('admin_config') as any)
        .upsert({
          config_key: 'buildout_planner',
          config_value: buildOutData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'config_key' });

      if (error) throw error;
    } catch (err) {
      console.error('Error saving build-out data:', err);
    } finally {
      setSavingBuildOut(false);
    }
  };

  // Load build-out data when component mounts
  useEffect(() => {
    if (isAdmin) {
      loadBuildOutData();
    }
  }, [isAdmin]);

  const exportBuildOutPDF = (): void => {
    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Helper for consistent currency formatting (2 decimal places)
    const fmt = (val: number): string => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
        <td class="right">$${fmt(getCategoryTotal(cat))}</td>
      </tr>
      ${cat.items.map(item => `
        <tr>
          <td></td>
          <td>
            ${item.label}
            ${item.notes ? `<div style="font-size: 10px; color: #666; font-style: italic; margin-top: 2px;">📝 ${item.notes}</div>` : ''}
          </td>
          <td class="right">$${fmt(item.amount)}</td>
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
          .header { border-bottom: 3px solid #D4AF6A; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 32px; font-weight: bold; color: #286BCD; }
          .subtitle { color: #666; font-size: 14px; margin-top: 5px; }
          .date { color: #888; font-size: 12px; margin-top: 10px; }
          h2 { color: #1C2B3A; font-size: 18px; margin: 25px 0 15px; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
          .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px; }
          .kpi { background: #f8f8f8; padding: 15px; border-radius: 8px; text-align: center; }
          .kpi-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
          .kpi-value { font-size: 24px; font-weight: bold; color: #1C2B3A; margin-top: 5px; }
          .kpi-value.success { color: #16a34a; }
          .kpi-value.warning { color: #dc2626; }
          .progress-bar { background: #e5e5e5; border-radius: 10px; height: 20px; margin: 15px 0; overflow: hidden; }
          .progress-fill { background: linear-gradient(90deg, #1C2B3A, #D4AF6A); height: 100%; border-radius: 10px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .table th, .table td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; }
          .table th { background: #1C2B3A; color: white; font-size: 11px; text-transform: uppercase; }
          .table td { font-size: 13px; }
          .table .right { text-align: right; }
          .total-row { background: #1C2B3A !important; color: white !important; font-weight: bold; }
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
            <div class="kpi-value">$${fmt(totalCapital)}</div>
          </div>
          <div class="kpi">
            <div class="kpi-label">Amount Raised</div>
            <div class="kpi-value success">$${fmt(buildOutData.amountRaised)}</div>
          </div>
          <div class="kpi">
            <div class="kpi-label">Remaining to Raise</div>
            <div class="kpi-value warning">$${fmt(remaining)}</div>
          </div>
        </div>

        <div style="margin-bottom: 25px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-size: 12px; color: #666;">Funding Progress</span>
            <span style="font-size: 12px; font-weight: bold; color: #1C2B3A;">${percentRaised.toFixed(2)}%</span>
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
            <td class="right">$${fmt(totalCapital)}</td>
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F7F4]">
        <Lock className="w-12 h-12 text-[#D4AF6A] mb-4 animate-pulse" />
        <div className="text-[#1C2B3A] font-serif text-xl tracking-widest">VERIFYING SECURITY CLEARANCE...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'financial', label: 'Financial Tools', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'pricing', label: 'Session Pricing', icon: <Calculator className="w-4 h-4" /> },
    { id: 'buildout', label: 'Build-Out Planner', icon: <Building className="w-4 h-4" /> },
    { id: 'stack', label: 'Stack', icon: <Activity className="w-4 h-4" /> },
    { id: 'stackpricing', label: 'Stack Pricing', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'journeys', label: 'Guest Journeys', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 bg-[#F8F7F4] min-h-screen">

      {/* DASHBOARD HEADER */}
      <div className="mb-6 pt-8">
        <div className="flex items-center gap-3 mb-1">
          <img src="/MASLOW - Square.png" alt="Maslow" className="h-8 w-8" />
          <h1 className="text-2xl font-serif font-bold tracking-widest" style={{ color: 'var(--navy, #1C2B3A)' }}>
            MASLOW
          </h1>
        </div>
        <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--gold, #D4AF6A)', fontFamily: 'var(--sans)' }}>
          Admin Dashboard
        </p>
      </div>

      {/* TAB NAVIGATION */}
      <div className="mb-4">
        <div className="flex gap-1 border-b-2 border-[#1C2B3A]/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 font-semibold text-xs md:text-sm uppercase tracking-wider transition-all duration-200 border-b-4 -mb-[2px] ${
                activeTab === tab.id
                  ? 'border-[#D4AF6A] text-[#1C2B3A] bg-white rounded-t-lg'
                  : 'border-transparent text-[#1C2B3A]/60 hover:text-[#1C2B3A] hover:bg-white/50'
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
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#1C2B3A] uppercase tracking-widest">Financial Tools</h1>
            <p className="text-[#1C2B3A]/60 mt-1 text-sm">Revenue projections, pricing models, and payment testing.</p>
          </div>

          {/* Revenue Simulator — commented out, replaced by /model page */}
          {/* <RevenueSimulator /> */}
          <div className="bg-white rounded-xl border border-[#D4AF6A]/30 p-8 text-center shadow-sm">
            <TrendingUp className="w-10 h-10 text-[#D4AF6A] mx-auto mb-3" />
            <h3 className="text-xl font-serif font-bold text-[#1C2B3A] mb-2">Revenue Model</h3>
            <p className="text-[#1C2B3A]/60 mb-4 text-sm">The full interactive model lives at /model</p>
            <a
              href="/model"
              target="_blank"
              className="inline-flex items-center gap-2 bg-[#1C2B3A] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2d4475] transition-colors"
            >
              Open Revenue Model →
            </a>
          </div>
        </motion.div>
      )}

      {/* TAB 2: SESSION PRICING */}
      {activeTab === 'pricing' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#1C2B3A] uppercase tracking-widest">Session Pricing</h1>
            <p className="text-[#1C2B3A]/60 mt-1 text-sm">Current session tiers — duration, samples included, and price.</p>
          </div>
          <SessionPricingTable />
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 border-b-4 border-[#D4AF6A] pb-3">
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-black text-[#1C2B3A] uppercase tracking-widest">Build-Out Planner</h1>
              <p className="text-[#1C2B3A]/60 mt-1 text-xs">Capital requirements and funding tracker.</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={saveBuildOutData}
                disabled={savingBuildOut}
                size="sm"
                className="bg-[#D4AF6A] hover:bg-[#C49F58] text-white"
              >
                {savingBuildOut ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                Save
              </Button>
              <Button
                onClick={exportBuildOutPDF}
                size="sm"
                variant="outline"
                className="border-[#1C2B3A] text-[#1C2B3A] hover:bg-[#1C2B3A] hover:text-white"
              >
                <FileDown className="w-4 h-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white border-t-4 border-t-[#1C2B3A]">
              <CardContent className="pt-4">
                <div className="text-xs font-bold text-[#1C2B3A] uppercase tracking-wider mb-1">Total Capital Required</div>
                <div className="text-3xl font-black text-[#1C2B3A]">${getTotalCapital().toLocaleString()}</div>
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
          <Card className="mb-6 bg-gradient-to-r from-[#1C2B3A]/5 to-[#D4AF6A]/5">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-[#1C2B3A]">Funding Progress</span>
                <span className="text-sm font-bold text-[#D4AF6A]">
                  {((buildOutData.amountRaised / getTotalCapital()) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#1C2B3A] to-[#D4AF6A] transition-all duration-500"
                  style={{ width: `${(buildOutData.amountRaised / getTotalCapital()) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>$0</span>
                <span>${getTotalCapital().toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Collapsible Cost Sections - 2 Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {expandedSections[key] ? (
                      <ChevronDown className="w-4 h-4 text-[#1C2B3A]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#1C2B3A]" />
                    )}
                    <span className="font-bold text-[#1C2B3A] text-sm">{data.name}</span>
                  </div>
                  <span className="font-bold text-[#D4AF6A] text-sm">${getCategoryTotal(data).toLocaleString()}</span>
                </button>
                {expandedSections[key] && (
                  <CardContent className="pt-0 pb-2 px-3">
                    <div className="space-y-1">
                      {data.items.map((item, idx) => (
                        <div key={idx} className="border-b border-gray-100 last:border-0 py-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-700 flex-1 truncate">{item.label}</span>
                            <div className="relative w-24">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs">$</span>
                              <Input
                                type="text"
                                value={formatInputValue(item.amount)}
                                onChange={(e) => updateItemAmount(key, idx, e.target.value)}
                                className="pl-5 text-right text-xs h-7"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <MessageSquare className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <Input
                              type="text"
                              placeholder="Add note (e.g., 'Free from Toto')"
                              value={item.notes || ''}
                              onChange={(e) => updateItemNotes(key, idx, e.target.value)}
                              className="text-xs h-6 border-dashed border-gray-200 bg-gray-50/50 placeholder:text-gray-400 placeholder:italic"
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
          <Card className="mt-6 bg-[#1C2B3A] text-white">
            <CardContent className="py-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold uppercase tracking-wider" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>Total Capital Required</span>
                <span className="text-3xl font-black" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>${getTotalCapital().toLocaleString()}</span>
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
              <h2 className="text-xl md:text-2xl font-serif font-bold tracking-wide" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 8px rgba(0,0,0,0.4)' }}>Operational Command</h2>
              <p className="text-white/80 font-light text-sm" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>Status: Active Monitoring</p>
            </div>
          </div>

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-6 border-b-4 border-[#D4AF6A] pb-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-black text-[#1C2B3A] uppercase tracking-widest">Revenue Command</h1>
              <p className="text-[#D4AF6A] font-bold mt-1 text-sm">Maslow Administrative Command</p>
            </div>
            <Button
              onClick={downloadCSV}
              className="bg-[#1C2B3A] text-white hover:bg-[#2d4475] flex items-center gap-2 text-sm"
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
              <Card className="h-full bg-white border border-[#1C2B3A]/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1C2B3A]">
                    <Activity className="h-5 w-5" />
                    Live Grid Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-black text-[#1C2B3A]">82%</div>
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
            <motion.div className="bg-white p-4 md:p-5 rounded-lg shadow-md border border-[#1C2B3A]/10">
              <div className="flex items-center gap-3 mb-1">
                <Users className="text-[#D4AF6A] w-6 h-6" />
                <h3 className="text-xs font-bold text-[#1C2B3A] uppercase">Total Members</h3>
              </div>
              <p className="text-3xl md:text-4xl font-black text-[#1C2B3A]">{stats.totalUsers}</p>
            </motion.div>

            <motion.div className="bg-white p-4 md:p-5 rounded-lg shadow-md border border-[#1C2B3A]/10">
              <div className="flex items-center gap-3 mb-1">
                <DollarSign className="text-green-600 w-6 h-6" />
                <h3 className="text-xs font-bold text-[#1C2B3A] uppercase">Total Pledged</h3>
              </div>
              <p className="text-3xl md:text-4xl font-black text-[#1C2B3A]">{formatNumber(stats.totalFunding)}</p>
            </motion.div>

            <motion.div className="bg-white p-4 md:p-5 rounded-lg shadow-md border border-[#1C2B3A]/10">
              <div className="flex items-center gap-3 mb-1">
                <Shield className="text-[#1C2B3A] w-6 h-6" />
                <h3 className="text-xs font-bold text-[#1C2B3A] uppercase">Top Tier</h3>
              </div>
              <div className="text-sm space-y-1">
                {Object.entries(stats.tierBreakdown).map(([tier, count]) => (
                  <div key={tier} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
                    <span className="font-medium text-[#1C2B3A]">{tier}</span>
                    <span className="font-bold text-[#D4AF6A]">{count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-lg shadow-md border border-[#1C2B3A]/10 overflow-hidden">
            <div className="bg-[#1C2B3A] px-4 py-2">
              <h3 className="text-white font-bold uppercase tracking-wider text-sm">Recent Accessions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-xs font-bold text-[#1C2B3A] uppercase">Email</th>
                    <th className="px-3 py-2 text-xs font-bold text-[#1C2B3A] uppercase">Tier</th>
                    <th className="px-3 py-2 text-xs font-bold text-[#1C2B3A] uppercase">Date</th>
                    <th className="px-3 py-2 text-xs font-bold text-[#1C2B3A] uppercase text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentPledges.map((profile) => (
                    <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 text-[#1C2B3A] font-medium text-sm">{profile.email}</td>
                      <td className="px-3 py-2 text-sm text-gray-600">
                        <span className="bg-[#F8F7F4] px-2 py-0.5 rounded text-[#1C2B3A] font-bold text-xs border border-[#D4AF6A]/30">
                          {profile.membership_tier || 'Member'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">{new Date(profile.created_at || '').toLocaleDateString()}</td>
                      <td className="px-3 py-2 text-right font-bold text-[#1C2B3A] text-sm">
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

      {/* TAB 5: VIDEOS */}
      {activeTab === 'videos' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#1C2B3A] uppercase tracking-widest">Video Assets</h1>
            <p className="text-[#1C2B3A]/60 mt-1 text-sm">Promotional videos and animations for sharing.</p>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Ad 1 */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-[#1C2B3A] text-lg">Maslow Video Ad 1</CardTitle>
              </CardHeader>
              <CardContent>
                <video
                  controls
                  className="w-full rounded-lg shadow-md"
                  preload="metadata"
                >
                  <source src="/Videos/Maslow Video Ad 1 Final WM2.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>

            {/* Video Ad 2 */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-[#1C2B3A] text-lg">Maslow Video Ad 2</CardTitle>
              </CardHeader>
              <CardContent>
                <video
                  controls
                  className="w-full rounded-lg shadow-md"
                  preload="metadata"
                >
                  <source src="/Videos/Maslow Video Ad 2 Final WM2.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </CardContent>
            </Card>

            {/* Splash Animation */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-[#1C2B3A] text-lg">Splash Animation</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src="/Videos/splash-icon (1).gif"
                  alt="Maslow Splash Animation"
                  className="w-full rounded-lg shadow-md"
                />
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* TAB: STACK POSTER */}
      {activeTab === 'stack' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#1C2B3A] uppercase tracking-widest">Tech Stack</h1>
            <p className="text-[#1C2B3A]/60 mt-1 text-sm">Three-layer architecture — Guest · Platform · Physical</p>
          </div>
          <StackPoster />
        </motion.div>
      )}

      {/* TAB: STACK PRICING */}
      {activeTab === 'stackpricing' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#1C2B3A] uppercase tracking-widest">Stack Upgrades</h1>
            <p className="text-[#1C2B3A]/60 mt-1 text-sm">What to upgrade, when, and why — before we take real money.</p>
          </div>
          <StackPricingTable />
        </motion.div>
      )}

      {/* TAB: GUEST JOURNEYS */}
      {activeTab === 'journeys' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#1C2B3A] uppercase tracking-widest">Guest Journeys</h1>
            <p className="text-[#1C2B3A]/60 mt-1 text-sm">The four paths from need to suite entry.</p>
          </div>
          <GuestJourneys />
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

// ─────────────────────────────────────────
// SESSION PRICING TABLE
// ─────────────────────────────────────────
const SessionPricingTable: React.FC = () => {
  const tiers = [
    {
      name: 'Quick Stop',
      duration: 10,
      samples: 0,
      price: 5,
      note: 'In and out. No frills, no samples — just the suite.',
      color: '#7AABCC',
    },
    {
      name: 'Standard',
      duration: 15,
      samples: 2,
      price: 10,
      note: 'The most common booking. Enough time to decompress, try two products.',
      color: '#D4AF6A',
    },
    {
      name: 'Extended',
      duration: 30,
      samples: 3,
      price: 18,
      note: 'For guests who want to take their time. Three product samples included.',
      color: '#4A5C3A',
    },
    {
      name: 'Full Session',
      duration: 60,
      samples: 5,
      price: 32,
      note: 'The full Maslow experience. Best per-minute value. Five samples.',
      color: '#1C2B3A',
    },
  ];

  return (
    <div className="space-y-3">
      {tiers.map((tier) => (
        <div
          key={tier.name}
          className="bg-white rounded-xl border border-[#1C2B3A]/10 overflow-hidden"
        >
          <div className="flex items-stretch">
            {/* Color bar */}
            <div className="w-1.5 flex-shrink-0" style={{ backgroundColor: tier.color }} />
            <div className="flex-1 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: name + note */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-serif font-bold text-lg text-[#2A2724]">{tier.name}</h3>
                  </div>
                  <p className="text-sm text-[#2A2724]/60">{tier.note}</p>
                </div>
                {/* Right: stats */}
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-2xl font-black" style={{ color: tier.color }}>{tier.duration}</div>
                    <div className="text-xs text-[#2A2724]/50 uppercase tracking-wider">min</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-[#2A2724]">{tier.samples}</div>
                    <div className="text-xs text-[#2A2724]/50 uppercase tracking-wider">samples</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black" style={{ color: tier.color }}>${tier.price}</div>
                    <div className="text-xs text-[#2A2724]/50 uppercase tracking-wider">price</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Footer note */}
      <div className="bg-[#F8F7F4] rounded-xl border border-[#D4AF6A]/20 p-4 mt-4">
        <p className="text-xs text-[#2A2724]/60 leading-relaxed">
          <span className="font-bold text-[#2A2724]">Pricing rationale:</span> Longer sessions carry a volume discount on a per-minute basis.
          10 min = $0.50/min · 15 min = $0.67/min · 30 min = $0.60/min · 60 min = $0.53/min.
          Guests are rewarded for committing to more time. Samples are a product discovery mechanism, not a core deliverable.
        </p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// STACK POSTER
// ─────────────────────────────────────────
const StackPoster: React.FC = () => {
  const layers = [
    {
      id: 'guest',
      label: 'GUEST LAYER',
      color: '#D4AF6A',
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      icon: <Globe className="w-5 h-5" />,
      nodes: [
        { name: 'maslow.nyc', sub: 'React + Vite · Vercel', icon: <Globe className="w-4 h-4" /> },
        { name: 'Mobile App', sub: 'React Native · Expo · iOS + Android', icon: <Smartphone className="w-4 h-4" /> },
        { name: '/go Page', sub: 'Walk-up QR · Magic Link · Apple/Google Pay', icon: <Zap className="w-4 h-4" /> },
      ],
    },
    {
      id: 'platform',
      label: 'PLATFORM LAYER',
      color: '#1C2B3A',
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      icon: <Server className="w-5 h-5" />,
      nodes: [
        { name: 'Supabase', sub: 'Auth · Database · Realtime · Edge Functions', icon: <Server className="w-4 h-4" /> },
        { name: 'Stripe', sub: 'Payment Intents · Webhooks · Apple/Google Pay', icon: <DollarSign className="w-4 h-4" /> },
        { name: 'Vercel', sub: 'CDN · Edge Network · Serverless', icon: <Layers className="w-4 h-4" /> },
      ],
    },
    {
      id: 'physical',
      label: 'PHYSICAL LAYER',
      color: '#4A5C3A',
      bg: 'bg-green-50',
      border: 'border-green-300',
      icon: <Cpu className="w-5 h-5" />,
      nodes: [
        { name: 'ESP32 ×10', sub: 'Suite controllers · Supabase Realtime listener', icon: <Cpu className="w-4 h-4" /> },
        { name: 'UV-C System', sub: 'Post-session auto · ESP32 scheduled trigger', icon: <Zap className="w-4 h-4" /> },
        { name: 'Door Lock', sub: 'QR-controlled · Suite entry/exit', icon: <Lock className="w-4 h-4" /> },
      ],
    },
  ];

  const flow = [
    'Guest scans QR or opens app',
    'App calls Supabase Edge Function',
    'Edge Function creates Stripe Payment Intent',
    'Stripe webhook confirms → Supabase session created',
    'Supabase Realtime pushes to ESP32',
    'ESP32 unlocks door · starts UV-C timer',
  ];

  return (
    <div className="space-y-4">
      {layers.map((layer) => (
        <div key={layer.id} className={`rounded-xl border-2 ${layer.border} ${layer.bg} p-5`}>
          <div className="flex items-center gap-2 mb-4" style={{ color: layer.color }}>
            {layer.icon}
            <span className="text-xs font-black uppercase tracking-widest">{layer.label}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {layer.nodes.map((node) => (
              <div key={node.name} className="bg-white rounded-lg p-4 border border-white/80 shadow-sm">
                <div className="flex items-center gap-2 mb-1" style={{ color: layer.color }}>
                  {node.icon}
                  <span className="font-bold text-sm text-[#2A2724]">{node.name}</span>
                </div>
                <p className="text-xs text-[#2A2724]/60 leading-relaxed">{node.sub}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Data flow */}
      <div className="bg-[#2A2724] rounded-xl p-5 mt-2">
        <p className="text-xs font-black text-[#D4AF6A] uppercase tracking-widest mb-4">Request Flow</p>
        <div className="space-y-2">
          {flow.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[#D4AF6A] font-black text-xs w-5 flex-shrink-0 mt-0.5">{i + 1}.</span>
              <p className="text-white/80 text-xs leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// STACK PRICING TABLE
// ─────────────────────────────────────────
const StackPricingTable: React.FC = () => {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const upgrades = [
    {
      id: 'supabase',
      timing: 'Before taking money',
      priority: 'CRITICAL',
      service: 'Supabase',
      from: 'Free',
      to: 'Pro',
      cost: '$25/mo',
      why: 'Free tier PAUSES after 1 week of inactivity. This kills production. Non-negotiable before accepting real payments.',
    },
    {
      id: 'stripe',
      timing: 'Before taking money',
      priority: 'CRITICAL',
      service: 'Stripe',
      from: 'Test Mode',
      to: 'Live Mode',
      cost: '2.9% + 30¢/txn',
      why: 'Flip the API key from test to live. No monthly fee. Just needs to happen before real cards are charged.',
    },
    {
      id: 'vercel',
      timing: 'Before taking money',
      priority: 'CRITICAL',
      service: 'Vercel',
      from: 'Hobby',
      to: 'Pro',
      cost: '$20/mo',
      why: 'Hobby TOS explicitly prohibits commercial use. Currently in violation. Must upgrade before any real transactions.',
    },
    {
      id: 'expo',
      timing: 'Before opening doors',
      priority: 'HIGH',
      service: 'Expo / EAS',
      from: 'Free',
      to: 'Production',
      cost: '$99/mo',
      why: 'Free build queue takes 30–60 min per build. Production is minutes. Needed before app store launch.',
    },
    {
      id: 'xero',
      timing: 'When scaling',
      priority: 'MEDIUM',
      service: 'Xero',
      from: 'Trial',
      to: 'Starter',
      cost: '$15/mo',
      why: 'Before first revenue or contractors. Already chosen over QuickBooks.',
    },
    {
      id: 'github',
      timing: 'When scaling',
      priority: 'LOW',
      service: 'GitHub',
      from: 'Free',
      to: 'Team',
      cost: '$4/user/mo',
      why: 'Only needed when adding collaborators. Fine on Free for solo founder.',
    },
  ];

  const priorityColor: Record<string, string> = {
    CRITICAL: 'bg-red-100 text-red-700 border-red-200',
    HIGH: 'bg-amber-100 text-amber-700 border-amber-200',
    MEDIUM: 'bg-blue-100 text-blue-700 border-blue-200',
    LOW: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const timingGroups = ['Before taking money', 'Before opening doors', 'When scaling'];

  return (
    <div className="space-y-6">
      {timingGroups.map((group) => {
        const items = upgrades.filter(u => u.timing === group);
        return (
          <div key={group}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#D4AF6A]" />
              <h3 className="text-sm font-black text-[#1C2B3A] uppercase tracking-widest">{group}</h3>
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-[#1C2B3A]/10 overflow-hidden"
                >
                  <button
                    onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F8F7F4]/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${priorityColor[item.priority]}`}>
                        {item.priority}
                      </span>
                      <span className="font-bold text-[#2A2724]">{item.service}</span>
                      <span className="text-[#1C2B3A]/50 text-sm hidden sm:inline">
                        {item.from} → {item.to}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-[#D4AF6A] text-sm">{item.cost}</span>
                      <ArrowRight className={`w-4 h-4 text-[#1C2B3A]/40 transition-transform ${expanded === item.id ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                  {expanded === item.id && (
                    <div className="px-5 pb-4 border-t border-[#1C2B3A]/10 pt-3">
                      <p className="text-sm text-[#2A2724]/70 leading-relaxed">{item.why}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Total before launch */}
      <div className="bg-[#1C2B3A] text-white rounded-xl p-5">
        <p className="text-xs font-black uppercase tracking-widest text-[#D4AF6A] mb-2">Before Taking Real Money</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black">$45</span>
          <span className="text-white/60 text-sm">/month (Supabase + Vercel) + Stripe per-transaction</span>
        </div>
        <p className="text-white/50 text-xs mt-2">Stripe live mode flip is free. Total fixed overhead before launch: $45/mo.</p>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// GUEST JOURNEYS
// ─────────────────────────────────────────
const GuestJourneys: React.FC = () => {
  const [active, setActive] = React.useState(0);

  const journeys = [
    {
      id: 'preplanner',
      number: '01',
      title: 'Pre-Trip Planner',
      subtitle: 'Books from abroad before arriving in NYC',
      color: '#1C2B3A',
      bg: 'bg-blue-50',
      steps: [
        { label: 'Finds Maslow online or via recommendation' },
        { label: 'Creates account on maslow.nyc or the app' },
        { label: 'Browses session types and selects a time window' },
        { label: 'Pays via Stripe (card, Apple Pay, Google Pay)' },
        { label: 'Receives confirmation + QR code via email/app' },
        { label: 'Arrives in SoHo, opens app or email, scans QR' },
        { label: 'Suite unlocks — session begins' },
      ],
      note: 'Highest intent guest. Already committed before touching NYC pavement. The session is part of the trip plan.',
    },
    {
      id: 'appwalkup',
      number: '02',
      title: 'App-First Walk-Up',
      subtitle: 'Has the app, decides on the spot',
      color: '#D4AF6A',
      bg: 'bg-amber-50',
      steps: [
        { label: 'Is in SoHo, sees or knows about Maslow' },
        { label: 'Opens the Maslow app (already installed)' },
        { label: 'Selects location → session type → books' },
        { label: 'Pays in-app via Stripe' },
        { label: 'QR generated immediately in app' },
        { label: 'Walks to suite, scans QR on door panel' },
        { label: 'Suite unlocks — session begins' },
      ],
      note: 'The smoothest in-person path. App does the heavy lifting. Target: under 2 minutes from "I need a suite" to door unlocked.',
    },
    {
      id: 'web',
      number: '03',
      title: 'Web Booking',
      subtitle: 'Books via maslow.nyc on desktop or mobile',
      color: '#4A5C3A',
      bg: 'bg-green-50',
      steps: [
        { label: 'Discovers Maslow via search, social, or referral' },
        { label: 'Visits maslow.nyc — browses, reads, gets interested' },
        { label: 'Clicks Book → logs in or creates account' },
        { label: 'Selects location, session type, time' },
        { label: 'Pays via Stripe on the web' },
        { label: 'QR sent via email and available in account' },
        { label: 'Arrives, presents QR, suite unlocks' },
      ],
      note: 'Important for international guests and discovery. Web booking needs parity with app — same session types, same payment options.',
    },
    {
      id: 'truewalkup',
      number: '04',
      title: 'True Walk-Up',
      subtitle: 'No app, no account — scans QR on the door',
      color: '#7AABCC',
      bg: 'bg-sky-50',
      steps: [
        { label: 'Walks by, sees the suite, wants in — has nothing pre-installed' },
        { label: 'Scans QR code on the door with phone camera' },
        { label: 'Lands on maslow.nyc/go — mobile-optimized, no install required' },
        { label: 'Magic link auth — no password, just email or phone' },
        { label: 'One-tap Apple Pay or Google Pay' },
        { label: 'QR generated instantly in browser' },
        { label: 'Scans QR on door panel — suite unlocks. Under 90 seconds total.' },
      ],
      note: 'The hardest journey — and the most important. If we nail this, we serve everyone. This is the /go page. It is live.',
    },
  ];

  const current = journeys[active];

  return (
    <div className="space-y-4">
      {/* Journey selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {journeys.map((j, i) => (
          <button
            key={j.id}
            onClick={() => setActive(i)}
            className={`rounded-xl p-4 text-left border-2 transition-all ${
              active === i
                ? 'border-[#D4AF6A] bg-white shadow-md'
                : 'border-transparent bg-white/60 hover:bg-white hover:shadow-sm'
            }`}
          >
            <div className="text-2xl font-black mb-1" style={{ color: j.color }}>{j.number}</div>
            <div className="text-sm font-bold text-[#2A2724] leading-tight">{j.title}</div>
          </button>
        ))}
      </div>

      {/* Active journey detail */}
      <div className={`rounded-xl ${current.bg} border-2 p-6`} style={{ borderColor: current.color + '40' }}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-4xl font-black mb-1" style={{ color: current.color }}>{current.number}</div>
            <h3 className="text-xl font-serif font-bold text-[#2A2724]">{current.title}</h3>
            <p className="text-sm text-[#2A2724]/60 mt-0.5">{current.subtitle}</p>
          </div>
          {current.id === 'truewalkup' && (
            <span className="bg-green-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">LIVE</span>
          )}
        </div>

        <div className="space-y-2 mb-5">
          {current.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white text-xs font-black"
                style={{ backgroundColor: current.color }}
              >
                {i + 1}
              </div>
              <p className="text-sm text-[#2A2724]/80 leading-relaxed pt-0.5">{step.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/70 rounded-lg p-4 border border-white">
          <p className="text-sm text-[#2A2724]/70 italic leading-relaxed">{current.note}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminFundingDashboard;
