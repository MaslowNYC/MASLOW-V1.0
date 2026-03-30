import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const COLORS = {
  charcoal: "#2A2724",
  cream: "#FAF4ED",
  cream2: "#EDE0D0",
  gold: "#D4AF6A",
  moss: "#6A8A56",
  water: "#8BBFD8",
  red: "#D45555",
  green: "#5A9E6A",
  muted: "#C5BDB4", // Lightened for better contrast
  label: "#E0D8D0", // New: high contrast label color
};

const STORAGE_KEY = "maslow-revenue-model";

interface StoredState {
  suites: number;
  hoursPerDay: number;
  utilization: number;
  bookedDuration: number;
  actualDuration: number;
  turnaroundSec: number;
  avgTicket: number;
  rent: number;
  staffCost: number;
  supplies: number;
  otherCosts: number;
  sampleEnabled: boolean;
  sampleRate: number;
  samplesPerSession: number;
  brandEnabled: boolean;
  brandCategories: number;
  brandPerCategory: number;
  commissionEnabled: boolean;
  commissionConversion: number;
  commissionAvgOrder: number;
  commissionPct: number;
  hullEnabled: boolean;
  hullMonthly: number;
  corporateEnabled: boolean;
  corporateSessions: number;
  corporateAvgRate: number;
  membershipEnabled: boolean;
  memberCount: number;
  memberPrice: number;
  memberUsagePerMonth: number;
}

const MODEL_VERSION = "v2-march2026"; // bump this to reset saved state

function loadState(): Partial<StoredState> {
  try {
    const version = localStorage.getItem(STORAGE_KEY + "-version");
    if (version !== MODEL_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_KEY + "-version", MODEL_VERSION);
      return {};
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

const fmt = (n: number) =>
  n < 0 ? `-$${Math.abs(Math.round(n)).toLocaleString()}` : `$${Math.round(n).toLocaleString()}`;

const fmtK = (n: number) => {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}k`;
  return `${sign}$${Math.round(abs)}`;
};

function Toggle({ label, enabled, onChange, color = COLORS.gold }: {
  label: string; enabled: boolean; onChange: (v: boolean) => void; color?: string;
}) {
  return (
    <button onClick={() => onChange(!enabled)} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: "6px 0", opacity: enabled ? 1 : 0.45, transition: "opacity 0.2s" }}>
      <div style={{ width: 36, height: 20, borderRadius: 10, background: enabled ? color : "#4A4540", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: enabled ? 19 : 3, transition: "left 0.2s" }} />
      </div>
      <span style={{ fontSize: 14, color: COLORS.cream, fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "0.04em" }}>{label}</span>
    </button>
  );
}

function Slider({ label, value, min, max, step = 1, onChange, format = (v: number) => String(v), accent = COLORS.gold }: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; format?: (v: number) => string; accent?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: COLORS.label, fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 14, color: accent, fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 600 }}>{format(value)}</span>
      </div>
      <div style={{ position: "relative", height: 4, background: "#4A4540", borderRadius: 2 }}>
        <div style={{ position: "absolute", left: 0, width: `${pct}%`, height: "100%", background: accent, borderRadius: 2, transition: "width 0.1s" }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: "absolute", top: -8, left: 0, width: "100%", height: 20, opacity: 0, cursor: "pointer", margin: 0 }} />
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, color, big = false }: {
  label: string; value: string; sub?: string; color?: string; big?: boolean;
}) {
  return (
    <div style={{ background: "#1E1B18", border: "1px solid #4A4540", borderRadius: 8, padding: big ? "20px 24px" : "16px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 12, color: COLORS.label, fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: big ? 30 : 24, color: color || COLORS.cream, fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 600, lineHeight: 1.1 }}>{value}</span>
      {sub && <span style={{ fontSize: 12, color: COLORS.muted, fontFamily: "system-ui, -apple-system, sans-serif" }}>{sub}</span>}
    </div>
  );
}

function RevenueBar({ channels, total, costs }: { channels: { label: string; value: number; color: string }[]; total: number; costs: number }) {
  const maxVal = Math.max(total, costs, 1);
  return (
    <div style={{ marginTop: 8 }}>
      {channels.filter(c => c.value > 0).map((ch) => (
        <div key={ch.label} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
            <span style={{ fontSize: 13, color: COLORS.cream2, fontFamily: "system-ui, -apple-system, sans-serif" }}>{ch.label}</span>
            <span style={{ fontSize: 13, color: ch.color, fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 600 }}>{fmtK(ch.value)}/mo</span>
          </div>
          <div style={{ height: 6, background: "#2A2724", borderRadius: 3 }}>
            <div style={{ height: "100%", width: `${(ch.value / maxVal) * 100}%`, background: ch.color, borderRadius: 3, transition: "width 0.3s ease" }} />
          </div>
        </div>
      ))}
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #4A4540" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
          <span style={{ fontSize: 12, color: COLORS.label, fontFamily: "system-ui, -apple-system, sans-serif" }}>Operating Costs</span>
          <span style={{ fontSize: 12, color: COLORS.red, fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 600 }}>-{fmtK(costs)}/mo</span>
        </div>
        <div style={{ height: 6, background: "#2A2724", borderRadius: 3 }}>
          <div style={{ height: "100%", width: `${(costs / maxVal) * 100}%`, background: COLORS.red, borderRadius: 3 }} />
        </div>
      </div>
    </div>
  );
}

export default function RevenueModelPage() {
  const initialState = loadState();

  const [suites, setSuites] = useState(initialState.suites ?? 12);
  const [hoursPerDay, setHoursPerDay] = useState(initialState.hoursPerDay ?? 22);
  const [utilization, setUtilization] = useState(initialState.utilization ?? 33);
  const [bookedDuration, setBookedDuration] = useState(initialState.bookedDuration ?? 20);
  const [actualDuration, setActualDuration] = useState(initialState.actualDuration ?? 13);
  const [turnaroundSec, setTurnaroundSec] = useState(initialState.turnaroundSec ?? 90);
  const [avgTicket, setAvgTicket] = useState(initialState.avgTicket ?? 14);
  const [rent, setRent] = useState(initialState.rent ?? 85000);
  const [staffCost, setStaffCost] = useState(initialState.staffCost ?? 28000);
  const [supplies, setSupplies] = useState(initialState.supplies ?? 3500);
  const [otherCosts, setOtherCosts] = useState(initialState.otherCosts ?? 9480);
  const [sampleEnabled, setSampleEnabled] = useState(initialState.sampleEnabled ?? true);
  const [sampleRate, setSampleRate] = useState(initialState.sampleRate ?? 2.0);
  const [samplesPerSession, setSamplesPerSession] = useState(initialState.samplesPerSession ?? 2.2);
  const [brandEnabled, setBrandEnabled] = useState(initialState.brandEnabled ?? true);
  const [brandCategories, setBrandCategories] = useState(initialState.brandCategories ?? 5);
  const [brandPerCategory, setBrandPerCategory] = useState(initialState.brandPerCategory ?? 800);
  const [commissionEnabled, setCommissionEnabled] = useState(initialState.commissionEnabled ?? false);
  const [commissionConversion, setCommissionConversion] = useState(initialState.commissionConversion ?? 15);
  const [commissionAvgOrder, setCommissionAvgOrder] = useState(initialState.commissionAvgOrder ?? 28);
  const [commissionPct, setCommissionPct] = useState(initialState.commissionPct ?? 25);
  const [hullEnabled, setHullEnabled] = useState(initialState.hullEnabled ?? false);
  const [hullMonthly, setHullMonthly] = useState(initialState.hullMonthly ?? 3000);
  const [corporateEnabled, setCorporateEnabled] = useState(initialState.corporateEnabled ?? false);
  const [corporateSessions, setCorporateSessions] = useState(initialState.corporateSessions ?? 80);
  const [corporateAvgRate, setCorporateAvgRate] = useState(initialState.corporateAvgRate ?? 18);
  const [membershipEnabled, setMembershipEnabled] = useState(initialState.membershipEnabled ?? false);
  const [memberCount, setMemberCount] = useState(initialState.memberCount ?? 30);
  const [memberPrice, setMemberPrice] = useState(initialState.memberPrice ?? 49);
  const [memberUsagePerMonth, setMemberUsagePerMonth] = useState(initialState.memberUsagePerMonth ?? 3);

  // Persist state to localStorage
  useEffect(() => {
    const state: StoredState = {
      suites, hoursPerDay, utilization, bookedDuration, actualDuration, turnaroundSec, avgTicket,
      rent, staffCost, supplies, otherCosts, sampleEnabled, sampleRate, samplesPerSession,
      brandEnabled, brandCategories, brandPerCategory, commissionEnabled, commissionConversion,
      commissionAvgOrder, commissionPct, hullEnabled, hullMonthly, corporateEnabled,
      corporateSessions, corporateAvgRate, membershipEnabled, memberCount, memberPrice, memberUsagePerMonth
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [suites, hoursPerDay, utilization, bookedDuration, actualDuration, turnaroundSec, avgTicket,
    rent, staffCost, supplies, otherCosts, sampleEnabled, sampleRate, samplesPerSession,
    brandEnabled, brandCategories, brandPerCategory, commissionEnabled, commissionConversion,
    commissionAvgOrder, commissionPct, hullEnabled, hullMonthly, corporateEnabled,
    corporateSessions, corporateAvgRate, membershipEnabled, memberCount, memberPrice, memberUsagePerMonth]);

  const [isExporting, setIsExporting] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = useCallback(async () => {
    if (!mainContentRef.current || isExporting) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(mainContentRef.current, {
        scale: 2,
        backgroundColor: "#2A2724",
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter",
      });

      const pageWidth = 8.5;
      const pageHeight = 11;
      const margin = 0.5;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      // Calculate aspect ratio to fit on one page
      const imgAspect = canvas.width / canvas.height;
      const pageAspect = contentWidth / contentHeight;

      let finalWidth = contentWidth;
      let finalHeight = contentWidth / imgAspect;

      if (finalHeight > contentHeight) {
        finalHeight = contentHeight;
        finalWidth = contentHeight * imgAspect;
      }

      const xOffset = margin + (contentWidth - finalWidth) / 2;
      const yOffset = margin;

      // Add header
      pdf.setFillColor(26, 23, 20);
      pdf.rect(0, 0, pageWidth, 0.7, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.setTextColor(212, 175, 106);
      pdf.text("MASLOW", margin, 0.45);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(224, 216, 208);
      pdf.text("Revenue Model", margin + 1.1, 0.45);
      pdf.text(new Date().toLocaleDateString(), pageWidth - margin, 0.45, { align: "right" });

      pdf.addImage(imgData, "PNG", xOffset, 0.8, finalWidth, finalHeight);

      pdf.save("maslow-revenue-model.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsExporting(false);
    }
  }, [isExporting]);

  const calc = useMemo(() => {
    const turnaroundMin = turnaroundSec / 60;
    // Each slot = booked duration + turnaround gap before next guest
    const slotsPerDay = (hoursPerDay * 60) / (actualDuration + turnaroundMin);
    const totalSessions = suites * slotsPerDay * 30 * (utilization / 100);
    // Booked-only capacity (for early-exit comparison) also includes turnaround
    const slotsBooked = (hoursPerDay * 60) / (bookedDuration + turnaroundMin);
    const sessionsIfBookedOnly = suites * slotsBooked * 30 * (utilization / 100);
    const sessionRevenue = totalSessions * avgTicket;
    const sampleRevenue = sampleEnabled ? totalSessions * samplesPerSession * sampleRate : 0;
    const brandRevenue = brandEnabled ? brandCategories * brandPerCategory : 0;
    const commissionRevenue = commissionEnabled
      ? totalSessions * (commissionConversion / 100) * commissionAvgOrder * (commissionPct / 100) : 0;
    const hullRevenue = hullEnabled ? hullMonthly : 0;
    const corporateRevenue = corporateEnabled ? corporateSessions * corporateAvgRate : 0;
    const membershipCostPerMember = memberUsagePerMonth * avgTicket;
    const membershipSafe = memberPrice >= membershipCostPerMember;
    const membershipRevenue = membershipEnabled ? memberCount * memberPrice : 0;
    const totalRevenue = sessionRevenue + sampleRevenue + brandRevenue + commissionRevenue + hullRevenue + corporateRevenue + membershipRevenue;
    const totalCosts = rent + staffCost + supplies + otherCosts;
    const netCashFlow = totalRevenue - totalCosts;
    const revPerPct = (suites * slotsPerDay * 30 * avgTicket) / 100
      + (sampleEnabled ? (suites * slotsPerDay * 30 * samplesPerSession * sampleRate) / 100 : 0);
    const fixedRev = brandRevenue + hullRevenue;
    const breakEvenUtil = revPerPct > 0 ? Math.max(0, (totalCosts - fixedRev) / revPerPct) : null;
    const extraSessions = Math.round(totalSessions - sessionsIfBookedOnly);
    return {
      totalSessions: Math.round(totalSessions), extraSessions,
      sessionRevenue, sampleRevenue, brandRevenue, commissionRevenue,
      hullRevenue, corporateRevenue, membershipRevenue,
      membershipSafe, membershipCostPerMember, totalRevenue, totalCosts, netCashFlow,
      breakEvenUtil: breakEvenUtil !== null ? Math.min(breakEvenUtil, 100) : null,
      channels: [
        { label: "Session Fees", value: sessionRevenue, color: COLORS.gold },
        { label: "Sample Add-ons", value: sampleRevenue, color: COLORS.water },
        { label: "Brand Placement", value: brandRevenue, color: COLORS.moss },
        { label: "Commissions", value: commissionRevenue, color: "#A07840" },
        { label: "Hull Activations", value: hullRevenue, color: "#7A9E7E" },
        { label: "Corporate/Bulk", value: corporateRevenue, color: "#6A8CAA" },
        { label: "Memberships", value: membershipRevenue, color: "#D4AF6A" },
      ],
    };
  }, [suites, hoursPerDay, utilization, bookedDuration, actualDuration, turnaroundSec, avgTicket,
    rent, staffCost, supplies, otherCosts, sampleEnabled, sampleRate, samplesPerSession,
    brandEnabled, brandCategories, brandPerCategory, commissionEnabled, commissionConversion,
    commissionAvgOrder, commissionPct, hullEnabled, hullMonthly, corporateEnabled,
    corporateSessions, corporateAvgRate, membershipEnabled, memberCount, memberPrice, memberUsagePerMonth]);

  const cashFlowColor = calc.netCashFlow >= 0 ? COLORS.green : calc.netCashFlow > -20000 ? COLORS.gold : COLORS.red;

  return (
    <>
      <Helmet>
        <title>Revenue Model — Maslow</title>
        <meta name="description" content="Interactive financial model for Maslow. Explore utilization scenarios, session types, and break-even projections." />
        <meta property="og:title" content="Revenue Model — Maslow" />
        <meta property="og:description" content="Interactive financial model for Maslow. Explore utilization scenarios, session types, and break-even projections." />
      </Helmet>
      <div style={{ background: COLORS.charcoal, minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", padding: "0 0 60px" }}>

      <div style={{ borderBottom: "1px solid #4A4540", padding: "24px 32px 20px", display: "flex", alignItems: "center", gap: 16, background: "#1A1714" }}>
        <span style={{ fontSize: 22, color: COLORS.gold, fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 600, letterSpacing: "0.12em" }}>MASLOW</span>
        <span style={{ fontSize: 13, color: COLORS.label, letterSpacing: "0.1em", textTransform: "uppercase" }}>Revenue Model</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 16, alignItems: "center" }}>
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            style={{
              background: "transparent",
              border: `1px solid ${COLORS.gold}`,
              borderRadius: 4,
              padding: "8px 16px",
              fontSize: 12,
              color: COLORS.gold,
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: isExporting ? "wait" : "pointer",
              transition: "all 0.2s",
              opacity: isExporting ? 0.6 : 1,
            }}
            onMouseOver={(e) => { if (!isExporting) { e.currentTarget.style.background = COLORS.gold; e.currentTarget.style.color = COLORS.charcoal; }}}
            onMouseOut={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.gold; }}
          >
            {isExporting ? "Generating..." : "Download PDF"}
          </button>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: calc.netCashFlow >= 0 ? COLORS.green : COLORS.red }} />
            <span style={{ fontSize: 12, color: COLORS.label, letterSpacing: "0.06em" }}>
              {calc.netCashFlow >= 0 ? "CASH FLOW POSITIVE" : "RAMP-UP MODE"}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 0, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ borderRight: "1px solid #4A4540", padding: "28px 24px", overflowY: "auto", maxHeight: "calc(100vh - 80px)", position: "sticky", top: 0 }}>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: COLORS.gold, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #4A4540" }}>Operations</div>
            <Slider label="Suites" value={suites} min={1} max={12} onChange={setSuites} format={v => `${v} suites`} />
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: -8, marginBottom: 12, paddingLeft: 2 }}>3,700 sqft flagship layout</div>
            <Slider label="Hours / Day" value={hoursPerDay} min={8} max={24} onChange={setHoursPerDay} format={v => `${v} hrs`} />
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: -8, marginBottom: 12, paddingLeft: 2 }}>22 hrs = 6AM–4AM · Hull closes at 10PM</div>
            <Slider label="Utilization" value={utilization} min={10} max={100} onChange={setUtilization} format={v => `${v}%`}
              accent={utilization >= (calc.breakEvenUtil || 60) ? COLORS.green : COLORS.gold} />
            {calc.breakEvenUtil !== null && (
              <div style={{ fontSize: 11, color: COLORS.label, marginTop: -8, marginBottom: 12, paddingLeft: 2 }}>
                Break-even approx <span style={{ color: COLORS.gold }}>{Math.ceil(calc.breakEvenUtil)}%</span> utilization
              </div>
            )}
            <Slider label="Avg Ticket (session)" value={avgTicket} min={5} max={40} onChange={setAvgTicket} format={v => `$${v}`} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: COLORS.water, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #4A4540" }}>Duration Model</div>
            <Slider label="Avg Booked Duration" value={bookedDuration} min={5} max={60} onChange={setBookedDuration} format={v => `${v} min`} accent={COLORS.water} />
            <Slider label="Avg Actual Duration" value={actualDuration} min={3} max={bookedDuration} onChange={setActualDuration} format={v => `${v} min`} accent={COLORS.water} />
            <Slider label="Suite Turnaround" value={turnaroundSec} min={60} max={180} step={15} onChange={setTurnaroundSec} format={v => `${v}s`} accent={COLORS.water} />
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: -8, marginBottom: 12, paddingLeft: 2 }}>
              {turnaroundSec}s reset (staff + UV‑C) — reduces available capacity
            </div>
            <div style={{ background: "#1E1B18", borderRadius: 6, padding: "10px 14px", fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>
              {calc.extraSessions > 0
                ? <>Faster exits unlock <span style={{ color: COLORS.water }}>{calc.extraSessions} extra sessions/mo</span> vs booked-only model.</>
                : <>Set actual duration below booked to model early exits.</>}
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "#C05050", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #4A4540" }}>Monthly Costs</div>
            <Slider label="Rent" value={rent} min={20000} max={90000} step={500} onChange={setRent} format={v => fmtK(v)} accent="#C05050" />
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: -8, marginBottom: 12, paddingLeft: 2 }}>$85K = 3,700 sqft · fight to $70K = +$180K/yr</div>
            <Slider label="Staff" value={staffCost} min={5000} max={40000} step={500} onChange={setStaffCost} format={v => fmtK(v)} accent="#C05050" />
            <Slider label="Supplies & Amenities" value={supplies} min={1000} max={20000} step={250} onChange={setSupplies} format={v => fmtK(v)} accent="#C05050" />
            <Slider label="Tech / Insurance / Other" value={otherCosts} min={1000} max={20000} step={250} onChange={setOtherCosts} format={v => fmtK(v)} accent="#C05050" />
            <div style={{ fontSize: 11, color: COLORS.muted, marginTop: -8, marginBottom: 12, paddingLeft: 2 }}>Includes Toto financing ~$5.3K + tech $4.2K</div>
          </div>

          <div>
            <div style={{ fontSize: 11, color: COLORS.gold, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #4A4540" }}>Revenue Channels</div>
            <Toggle label="Sample Add-ons" enabled={sampleEnabled} onChange={setSampleEnabled} />
            {sampleEnabled && (
              <div style={{ paddingLeft: 12, paddingBottom: 8 }}>
                <Slider label="Avg samples / session" value={samplesPerSession} min={0.5} max={5} step={0.1} onChange={setSamplesPerSession} format={v => v.toFixed(1)} accent={COLORS.water} />
                <Slider label="Price / sample" value={sampleRate} min={1} max={5} step={0.5} onChange={setSampleRate} format={v => `$${v}`} accent={COLORS.water} />
              </div>
            )}
            <Toggle label="Brand Placement" enabled={brandEnabled} onChange={setBrandEnabled} />
            {brandEnabled && (
              <div style={{ paddingLeft: 12, paddingBottom: 8 }}>
                <Slider label="Active brand categories" value={brandCategories} min={1} max={12} onChange={setBrandCategories} format={v => `${v}`} accent={COLORS.moss} />
                <Slider label="Avg monthly / category" value={brandPerCategory} min={200} max={3000} step={100} onChange={setBrandPerCategory} format={v => fmtK(v)} accent={COLORS.moss} />
              </div>
            )}
            <Toggle label="Sample to Purchase Commissions" enabled={commissionEnabled} onChange={setCommissionEnabled} />
            {commissionEnabled && (
              <div style={{ paddingLeft: 12, paddingBottom: 8 }}>
                <Slider label="Conversion rate" value={commissionConversion} min={1} max={50} onChange={setCommissionConversion} format={v => `${v}%`} accent="#A07840" />
                <Slider label="Avg order value" value={commissionAvgOrder} min={10} max={80} onChange={setCommissionAvgOrder} format={v => `$${v}`} accent="#A07840" />
                <Slider label="Maslow's cut" value={commissionPct} min={10} max={40} onChange={setCommissionPct} format={v => `${v}%`} accent="#A07840" />
              </div>
            )}
            <Toggle label="Hull Activations" enabled={hullEnabled} onChange={setHullEnabled} />
            {hullEnabled && (
              <div style={{ paddingLeft: 12, paddingBottom: 8 }}>
                <Slider label="Monthly activation revenue" value={hullMonthly} min={500} max={20000} step={250} onChange={setHullMonthly} format={v => fmtK(v)} accent="#7A9E7E" />
              </div>
            )}
            <Toggle label="Corporate / Bulk Bookings" enabled={corporateEnabled} onChange={setCorporateEnabled} />
            {corporateEnabled && (
              <div style={{ paddingLeft: 12, paddingBottom: 8 }}>
                <Slider label="Sessions / month" value={corporateSessions} min={10} max={500} step={10} onChange={setCorporateSessions} format={v => `${v}`} accent="#6A8CAA" />
                <Slider label="Avg rate / session" value={corporateAvgRate} min={8} max={40} onChange={setCorporateAvgRate} format={v => `$${v}`} accent="#6A8CAA" />
              </div>
            )}
            <Toggle label="Sovereign Memberships" enabled={membershipEnabled} onChange={setMembershipEnabled} />
            {membershipEnabled && (
              <div style={{ paddingLeft: 12, paddingBottom: 8 }}>
                <Slider label="Active members" value={memberCount} min={5} max={200} onChange={setMemberCount} format={v => `${v}`} accent={COLORS.gold} />
                <Slider label="Monthly price" value={memberPrice} min={15} max={200} step={5} onChange={setMemberPrice} format={v => `$${v}/mo`} accent={COLORS.gold} />
                <Slider label="Expected uses / member / mo" value={memberUsagePerMonth} min={1} max={20} onChange={setMemberUsagePerMonth} format={v => `${v}x`} accent={COLORS.gold} />
                {!calc.membershipSafe ? (
                  <div style={{ background: "#3A1A1A", border: "1px solid #C05050", borderRadius: 6, padding: "8px 12px", fontSize: 11, color: "#E08080", lineHeight: 1.5 }}>
                    Price too low - members cost you {fmt(calc.membershipCostPerMember)}/mo in session value.
                  </div>
                ) : (
                  <div style={{ background: "#1A2A1A", border: "1px solid #4A7C59", borderRadius: 6, padding: "8px 12px", fontSize: 11, color: "#7ABE8A", lineHeight: 1.5 }}>
                    Price covers usage cost ({fmt(calc.membershipCostPerMember)}/member/mo)
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="main-content" ref={mainContentRef} style={{ padding: "28px 28px", background: COLORS.charcoal }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            <MetricCard label="Monthly Revenue" value={fmt(calc.totalRevenue)} sub={`${calc.totalSessions.toLocaleString()} sessions (booked)`} color={COLORS.gold} big />
            <MetricCard label="Monthly Costs" value={`-${fmt(calc.totalCosts)}`} sub="Rent + staff + ops" color="#C07070" big />
            <MetricCard label="Net Cash Flow" value={fmt(calc.netCashFlow)}
              sub={calc.netCashFlow >= 0 ? "Cash flow positive" : `Need ${Math.ceil(calc.breakEvenUtil || 0)}% to break even`}
              color={cashFlowColor} big />
          </div>

          {calc.extraSessions > 0 && (
            <div style={{ background: "#1A2030", border: `1px solid ${COLORS.water}33`, borderRadius: 8, padding: "14px 20px", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: COLORS.water, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>Duration Efficiency (The Patrick Effect)</div>
              <div style={{ fontSize: 13, color: COLORS.cream2, lineHeight: 1.5 }}>
                Guests using <span style={{ color: COLORS.water }}>{actualDuration} min avg</span> vs booked <span style={{ color: COLORS.water }}>{bookedDuration} min</span> unlocks{" "}
                <span style={{ color: COLORS.water, fontWeight: 600 }}>{calc.extraSessions} extra sessions/month</span> worth{" "}
                <span style={{ color: COLORS.gold }}>{fmtK(calc.extraSessions * avgTicket)}</span> in additional revenue potential.
              </div>
            </div>
          )}

          <div style={{ background: "#1E1B18", border: "1px solid #4A4540", borderRadius: 8, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: COLORS.label, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Revenue Breakdown</div>
            <RevenueBar channels={calc.channels} total={calc.totalRevenue} costs={calc.totalCosts} />
          </div>

          <div style={{ background: "#1E1B18", border: "1px solid #4A4540", borderRadius: 8, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: COLORS.label, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Utilization Scenarios</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: "#4A4540", borderRadius: 6, overflow: "hidden" }}>
              {[25, 33, 50, 65, 80].map((u) => {
                const slotsB = (hoursPerDay * 60) / (bookedDuration + turnaroundSec / 60);
                const sessions = suites * slotsB * 30 * (u / 100);
                const rev = sessions * avgTicket
                  + (sampleEnabled ? sessions * samplesPerSession * sampleRate : 0)
                  + (brandEnabled ? brandCategories * brandPerCategory : 0)
                  + (commissionEnabled ? sessions * (commissionConversion / 100) * commissionAvgOrder * (commissionPct / 100) : 0)
                  + (hullEnabled ? hullMonthly : 0)
                  + (corporateEnabled ? corporateSessions * corporateAvgRate : 0)
                  + (membershipEnabled ? memberCount * memberPrice : 0);
                const net = rev - calc.totalCosts;
                const isBreakEven = u === 33;
                const isCurrent = Math.abs(u - utilization) < 8;
                return (
                  <div key={u} style={{ background: isCurrent ? "#2A2520" : "#1A1714", padding: "14px 12px", textAlign: "center", borderBottom: isCurrent ? `2px solid ${COLORS.gold}` : "2px solid transparent" }}>
                    <div style={{ fontSize: 12, color: isCurrent ? COLORS.gold : COLORS.muted, marginBottom: 4, fontWeight: isCurrent ? 500 : 400 }}>{u}%{isBreakEven ? " ★" : ""}</div>
                    {isBreakEven && <div style={{ fontSize: 9, color: COLORS.water, letterSpacing: "0.06em", marginBottom: 4, textTransform: "uppercase" }}>break-even</div>}
                    <div style={{ fontSize: 15, color: net >= 0 ? COLORS.green : COLORS.cream, fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 600, marginBottom: 3 }}>{fmtK(rev)}</div>
                    <div style={{ fontSize: 11, color: net >= 0 ? COLORS.green : COLORS.red }}>{net >= 0 ? "+" : ""}{fmtK(net)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <MetricCard label="Break-Even Util." value={calc.breakEvenUtil !== null ? `${Math.ceil(calc.breakEvenUtil)}%` : "N/A"} color={COLORS.gold} />
            <MetricCard label="Sessions / Month" value={calc.totalSessions.toLocaleString()} sub="at booked duration" />
            <MetricCard label="Revenue / Suite / Day" value={fmtK(calc.totalRevenue / suites / 30)} color={COLORS.cream2} />
            <MetricCard label="Cost per Session" value={fmt(calc.totalCosts / Math.max(calc.totalSessions, 1))} color={COLORS.muted} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
