import { useState, useMemo } from "react";

const COLORS = {
  charcoal: "#2A2724",
  cream: "#FAF4ED",
  cream2: "#F2E8DC",
  gold: "#C49F58",
  moss: "#4A5C3A",
  water: "#7AABCC",
  red: "#C0392B",
  green: "#4A7C59",
  muted: "#8A8278",
};

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
      <span style={{ fontSize: 13, color: COLORS.cream, fontFamily: "'Jost', sans-serif", letterSpacing: "0.04em" }}>{label}</span>
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
        <span style={{ fontSize: 12, color: COLORS.muted, fontFamily: "'Jost', sans-serif", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 13, color: accent, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{format(value)}</span>
      </div>
      <div style={{ position: "relative", height: 4, background: "#3A3530", borderRadius: 2 }}>
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
    <div style={{ background: "#1E1B18", border: "1px solid #3A3530", borderRadius: 8, padding: big ? "20px 24px" : "16px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: "'Jost', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: big ? 28 : 22, color: color || COLORS.cream, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, lineHeight: 1.1 }}>{value}</span>
      {sub && <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: "'Jost', sans-serif" }}>{sub}</span>}
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
            <span style={{ fontSize: 12, color: COLORS.cream2, fontFamily: "'Jost', sans-serif" }}>{ch.label}</span>
            <span style={{ fontSize: 12, color: ch.color, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>{fmtK(ch.value)}/mo</span>
          </div>
          <div style={{ height: 6, background: "#2A2724", borderRadius: 3 }}>
            <div style={{ height: "100%", width: `${(ch.value / maxVal) * 100}%`, background: ch.color, borderRadius: 3, transition: "width 0.3s ease" }} />
          </div>
        </div>
      ))}
      <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #3A3530" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
          <span style={{ fontSize: 12, color: COLORS.muted, fontFamily: "'Jost', sans-serif" }}>Operating Costs</span>
          <span style={{ fontSize: 12, color: COLORS.red, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}>-{fmtK(costs)}/mo</span>
        </div>
        <div style={{ height: 6, background: "#2A2724", borderRadius: 3 }}>
          <div style={{ height: "100%", width: `${(costs / maxVal) * 100}%`, background: COLORS.red, borderRadius: 3 }} />
        </div>
      </div>
    </div>
  );
}

export default function RevenueModelPage() {
  const [suites, setSuites] = useState(3);
  const [hoursPerDay, setHoursPerDay] = useState(14);
  const [utilization, setUtilization] = useState(70);
  const [bookedDuration, setBookedDuration] = useState(20);
  const [actualDuration, setActualDuration] = useState(13);
  const [avgTicket, setAvgTicket] = useState(12);
  const [rent, setRent] = useState(41700);
  const [staffCost, setStaffCost] = useState(17000);
  const [supplies, setSupplies] = useState(6000);
  const [otherCosts, setOtherCosts] = useState(8000);
  const [sampleEnabled, setSampleEnabled] = useState(true);
  const [sampleRate, setSampleRate] = useState(2.0);
  const [samplesPerSession, setSamplesPerSession] = useState(2.2);
  const [brandEnabled, setBrandEnabled] = useState(true);
  const [brandCategories, setBrandCategories] = useState(5);
  const [brandPerCategory, setBrandPerCategory] = useState(800);
  const [commissionEnabled, setCommissionEnabled] = useState(false);
  const [commissionConversion, setCommissionConversion] = useState(15);
  const [commissionAvgOrder, setCommissionAvgOrder] = useState(28);
  const [commissionPct, setCommissionPct] = useState(25);
  const [hullEnabled, setHullEnabled] = useState(false);
  const [hullMonthly, setHullMonthly] = useState(3000);
  const [corporateEnabled, setCorporateEnabled] = useState(false);
  const [corporateSessions, setCorporateSessions] = useState(80);
  const [corporateAvgRate, setCorporateAvgRate] = useState(18);
  const [membershipEnabled, setMembershipEnabled] = useState(false);
  const [memberCount, setMemberCount] = useState(30);
  const [memberPrice, setMemberPrice] = useState(49);
  const [memberUsagePerMonth, setMemberUsagePerMonth] = useState(3);

  const calc = useMemo(() => {
    const slotsActual = (hoursPerDay * 60) / actualDuration;
    const sessionsActual = suites * slotsActual * 30 * (utilization / 100);
    const slotsBooked = (hoursPerDay * 60) / bookedDuration;
    const sessionsBooked = suites * slotsBooked * 30 * (utilization / 100);
    const sessionRevenue = sessionsBooked * avgTicket;
    const sampleRevenue = sampleEnabled ? sessionsBooked * samplesPerSession * sampleRate : 0;
    const brandRevenue = brandEnabled ? brandCategories * brandPerCategory : 0;
    const commissionRevenue = commissionEnabled
      ? sessionsBooked * (commissionConversion / 100) * commissionAvgOrder * (commissionPct / 100) : 0;
    const hullRevenue = hullEnabled ? hullMonthly : 0;
    const corporateRevenue = corporateEnabled ? corporateSessions * corporateAvgRate : 0;
    const membershipCostPerMember = memberUsagePerMonth * avgTicket;
    const membershipSafe = memberPrice >= membershipCostPerMember;
    const membershipRevenue = membershipEnabled ? memberCount * memberPrice : 0;
    const totalRevenue = sessionRevenue + sampleRevenue + brandRevenue + commissionRevenue + hullRevenue + corporateRevenue + membershipRevenue;
    const totalCosts = rent + staffCost + supplies + otherCosts;
    const netCashFlow = totalRevenue - totalCosts;
    const revPerPct = (suites * slotsBooked * 30 * avgTicket) / 100
      + (sampleEnabled ? (suites * slotsBooked * 30 * samplesPerSession * sampleRate) / 100 : 0);
    const fixedRev = brandRevenue + hullRevenue;
    const breakEvenUtil = revPerPct > 0 ? Math.max(0, (totalCosts - fixedRev) / revPerPct) : null;
    const extraSessions = Math.round(sessionsActual - sessionsBooked);
    return {
      sessionsBooked: Math.round(sessionsBooked), extraSessions,
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
        { label: "Memberships", value: membershipRevenue, color: "#C49F58" },
      ],
    };
  }, [suites, hoursPerDay, utilization, bookedDuration, actualDuration, avgTicket,
    rent, staffCost, supplies, otherCosts, sampleEnabled, sampleRate, samplesPerSession,
    brandEnabled, brandCategories, brandPerCategory, commissionEnabled, commissionConversion,
    commissionAvgOrder, commissionPct, hullEnabled, hullMonthly, corporateEnabled,
    corporateSessions, corporateAvgRate, membershipEnabled, memberCount, memberPrice, memberUsagePerMonth]);

  const cashFlowColor = calc.netCashFlow >= 0 ? COLORS.green : calc.netCashFlow > -20000 ? COLORS.gold : COLORS.red;

  return (
    <div style={{ background: COLORS.charcoal, minHeight: "100vh", fontFamily: "'Jost', sans-serif", padding: "0 0 60px" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />

      <div style={{ borderBottom: "1px solid #3A3530", padding: "24px 32px 20px", display: "flex", alignItems: "baseline", gap: 16, background: "#1A1714" }}>
        <span style={{ fontSize: 22, color: COLORS.gold, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, letterSpacing: "0.12em" }}>MASLOW</span>
        <span style={{ fontSize: 13, color: COLORS.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>Revenue Model</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: calc.netCashFlow >= 0 ? COLORS.green : COLORS.red }} />
          <span style={{ fontSize: 12, color: COLORS.muted, letterSpacing: "0.06em" }}>
            {calc.netCashFlow >= 0 ? "CASH FLOW POSITIVE" : "RAMP-UP MODE"}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 0, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ borderRight: "1px solid #3A3530", padding: "28px 24px", overflowY: "auto", maxHeight: "calc(100vh - 80px)", position: "sticky", top: 0 }}>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, color: COLORS.gold, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #3A3530" }}>Operations</div>
            <Slider label="Suites" value={suites} min={1} max={10} onChange={setSuites} format={v => `${v} suites`} />
            <Slider label="Hours / Day" value={hoursPerDay} min={8} max={24} onChange={setHoursPerDay} format={v => `${v} hrs`} />
            <Slider label="Utilization" value={utilization} min={10} max={100} onChange={setUtilization} format={v => `${v}%`}
              accent={utilization >= (calc.breakEvenUtil || 60) ? COLORS.green : COLORS.gold} />
            {calc.breakEvenUtil !== null && (
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: -8, marginBottom: 12, paddingLeft: 2 }}>
                Break-even approx <span style={{ color: COLORS.gold }}>{Math.ceil(calc.breakEvenUtil)}%</span> utilization
              </div>
            )}
            <Slider label="Avg Ticket (session)" value={avgTicket} min={5} max={40} onChange={setAvgTicket} format={v => `$${v}`} />
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, color: COLORS.water, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #3A3530" }}>Duration Model</div>
            <Slider label="Avg Booked Duration" value={bookedDuration} min={5} max={60} onChange={setBookedDuration} format={v => `${v} min`} accent={COLORS.water} />
            <Slider label="Avg Actual Duration" value={actualDuration} min={3} max={bookedDuration} onChange={setActualDuration} format={v => `${v} min`} accent={COLORS.water} />
            <div style={{ background: "#1E1B18", borderRadius: 6, padding: "10px 14px", fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>
              {calc.extraSessions > 0
                ? <>Faster exits unlock <span style={{ color: COLORS.water }}>{calc.extraSessions} extra sessions/mo</span> vs booked-only model.</>
                : <>Set actual duration below booked to model early exits.</>}
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, color: "#C05050", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #3A3530" }}>Monthly Costs</div>
            <Slider label="Rent" value={rent} min={20000} max={80000} step={500} onChange={setRent} format={v => fmtK(v)} accent="#C05050" />
            <Slider label="Staff" value={staffCost} min={5000} max={40000} step={500} onChange={setStaffCost} format={v => fmtK(v)} accent="#C05050" />
            <Slider label="Supplies & Amenities" value={supplies} min={1000} max={20000} step={250} onChange={setSupplies} format={v => fmtK(v)} accent="#C05050" />
            <Slider label="Tech / Insurance / Other" value={otherCosts} min={1000} max={20000} step={250} onChange={setOtherCosts} format={v => fmtK(v)} accent="#C05050" />
          </div>

          <div>
            <div style={{ fontSize: 10, color: COLORS.gold, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #3A3530" }}>Revenue Channels</div>
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

        <div style={{ padding: "28px 28px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
            <MetricCard label="Monthly Revenue" value={fmt(calc.totalRevenue)} sub={`${calc.sessionsBooked.toLocaleString()} sessions (booked)`} color={COLORS.gold} big />
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

          <div style={{ background: "#1E1B18", border: "1px solid #3A3530", borderRadius: 8, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Revenue Breakdown</div>
            <RevenueBar channels={calc.channels} total={calc.totalRevenue} costs={calc.totalCosts} />
          </div>

          <div style={{ background: "#1E1B18", border: "1px solid #3A3530", borderRadius: 8, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Utilization Scenarios</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 1, background: "#3A3530", borderRadius: 6, overflow: "hidden" }}>
              {[40, 55, 70, 85, 100].map((u) => {
                const slotsB = (hoursPerDay * 60) / bookedDuration;
                const sessions = suites * slotsB * 30 * (u / 100);
                const rev = sessions * avgTicket
                  + (sampleEnabled ? sessions * samplesPerSession * sampleRate : 0)
                  + (brandEnabled ? brandCategories * brandPerCategory : 0)
                  + (commissionEnabled ? sessions * (commissionConversion / 100) * commissionAvgOrder * (commissionPct / 100) : 0)
                  + (hullEnabled ? hullMonthly : 0)
                  + (corporateEnabled ? corporateSessions * corporateAvgRate : 0)
                  + (membershipEnabled ? memberCount * memberPrice : 0);
                const net = rev - calc.totalCosts;
                const isCurrent = Math.abs(u - utilization) < 8;
                return (
                  <div key={u} style={{ background: isCurrent ? "#2A2520" : "#1A1714", padding: "14px 12px", textAlign: "center", borderBottom: isCurrent ? `2px solid ${COLORS.gold}` : "2px solid transparent" }}>
                    <div style={{ fontSize: 12, color: isCurrent ? COLORS.gold : COLORS.muted, marginBottom: 6, fontWeight: isCurrent ? 500 : 400 }}>{u}%</div>
                    <div style={{ fontSize: 15, color: net >= 0 ? COLORS.green : COLORS.cream, fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, marginBottom: 3 }}>{fmtK(rev)}</div>
                    <div style={{ fontSize: 11, color: net >= 0 ? COLORS.green : COLORS.red }}>{net >= 0 ? "+" : ""}{fmtK(net)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <MetricCard label="Break-Even Util." value={calc.breakEvenUtil !== null ? `${Math.ceil(calc.breakEvenUtil)}%` : "N/A"} color={COLORS.gold} />
            <MetricCard label="Sessions / Month" value={calc.sessionsBooked.toLocaleString()} sub="at booked duration" />
            <MetricCard label="Revenue / Suite / Day" value={fmtK(calc.totalRevenue / suites / 30)} color={COLORS.cream2} />
            <MetricCard label="Cost per Session" value={fmt(calc.totalCosts / Math.max(calc.sessionsBooked, 1))} color={COLORS.muted} />
          </div>
        </div>
      </div>
    </div>
  );
}
