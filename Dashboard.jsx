import { useState, useEffect, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine
} from "recharts";

// ─── CONFIG ──────────────────────────────────────────────────────
const SCRIPT_URL  = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
const REFRESH_MS  = 60000;
const KWH_TARIFF  = 1.25;

// ─── INJECT STYLES ───────────────────────────────────────────────
const css = document.createElement("style");
css.textContent = `
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500&family=Syne:wght@600;700;800&family=Inter:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
html { font-size:14px; }
body { background:#09090b; color:#e4e4e7; font-family:'Inter',sans-serif; -webkit-font-smoothing:antialiased; }

:root {
  --bg0:#09090b; --bg1:#0f1014; --bg2:#141519; --bg3:#1a1d23;
  --b1:#1e2128; --b2:#252a33; --b3:#2e3540;
  --blue:#3b82f6; --blue2:#1d4ed8; --blue-dim:#1e3a5f;
  --teal:#2dd4bf; --amber:#f59e0b; --red:#f87171; --green:#4ade80;
  --muted:#52525b; --sub:#71717a; --text:#e4e4e7;
  --mono:'DM Mono',monospace; --head:'Syne',sans-serif; --body:'Inter',sans-serif;
  --r:8px;
}

::-webkit-scrollbar { width:3px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--b2); border-radius:9px; }

@keyframes fadeUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
@keyframes spin    { to{transform:rotate(360deg)} }
@keyframes blink   { 0%,100%{opacity:1} 50%{opacity:.3} }
@keyframes ticker  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
@keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }

.fu  { animation:fadeUp .45s ease both; }
.fu1 { animation-delay:.06s } .fu2 { animation-delay:.12s }
.fu3 { animation-delay:.18s } .fu4 { animation-delay:.24s }
.fu5 { animation-delay:.30s } .fu6 { animation-delay:.36s }

/* Card */
.c {
  background:var(--bg1); border:1px solid var(--b1);
  border-radius:var(--r); overflow:hidden; position:relative;
}
.c::after {
  content:''; position:absolute; inset:0; pointer-events:none;
  border-radius:var(--r);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.04);
}

/* Label */
.lbl {
  font-family:var(--mono); font-size:10px; font-weight:400;
  letter-spacing:.16em; text-transform:uppercase; color:var(--muted);
}

/* Mono number */
.num { font-family:var(--mono); font-weight:300; line-height:1; }

/* Pill */
.pill {
  display:inline-flex; align-items:center; gap:5px;
  padding:3px 9px; border-radius:99px; font-family:var(--mono);
  font-size:9px; letter-spacing:.14em; font-weight:500;
  text-transform:uppercase; border:1px solid;
}
.pg { color:#4ade80; border-color:#4ade8030; background:#4ade8010; }
.pr { color:#f87171; border-color:#f8717130; background:#f8717110; animation:blink 1.4s infinite; }
.pa { color:#f59e0b; border-color:#f59e0b30; background:#f59e0b10; }
.pm { color:var(--muted); border-color:var(--b2); }

/* Dot */
.d { width:5px; height:5px; border-radius:50%; flex-shrink:0; }
.dg { background:#4ade80; box-shadow:0 0 5px #4ade80; }
.dr { background:#f87171; box-shadow:0 0 5px #f87171; }
.da { background:#f59e0b; box-shadow:0 0 5px #f59e0b; }
.dm { background:var(--muted); }

/* Divider */
.div { height:1px; background:var(--b1); }

/* Tab */
.tab {
  padding:5px 14px; font-family:var(--mono); font-size:10px;
  letter-spacing:.12em; text-transform:uppercase; cursor:pointer;
  background:transparent; border:1px solid transparent; border-radius:6px;
  color:var(--muted); transition:.15s;
}
.tab:hover { color:var(--sub); border-color:var(--b2); }
.tab.on { color:var(--blue); border-color:#3b82f630; background:#3b82f60a; }

/* Ctrl button */
.btn {
  font-family:var(--mono); font-size:10px; letter-spacing:.14em;
  text-transform:uppercase; padding:9px 20px; border-radius:6px;
  cursor:pointer; border:1px solid; transition:.15s; font-weight:500;
  width:100%;
}
.btn:active { transform:scale(.97); }
.bs { background:#4ade8010; color:#4ade80; border-color:#4ade8030; }
.bs:hover { background:#4ade8018; box-shadow:0 0 16px #4ade8015; }
.bx { background:#f8717110; color:#f87171; border-color:#f8717130; }
.bx:hover { background:#f8717118; box-shadow:0 0 16px #f8717115; }

/* Range */
input[type=range] {
  -webkit-appearance:none; appearance:none; width:100%; height:2px;
  border-radius:99px; outline:none; cursor:pointer;
  background:linear-gradient(90deg,var(--blue) var(--p,50%),var(--b2) var(--p,50%));
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance:none; width:12px; height:12px; border-radius:50%;
  background:#e4e4e7; border:2px solid var(--blue);
  box-shadow:0 0 0 2px #09090b;
}

/* Ring gauge SVG */
.ring-bg   { fill:none; stroke:var(--b2); stroke-width:5; }
.ring-fill { fill:none; stroke-width:5; stroke-linecap:round;
             transition:stroke-dashoffset .9s cubic-bezier(.4,0,.2,1), stroke .3s; }

/* Alarm rows */
.ar { display:grid; grid-template-columns:150px 100px 1fr 80px;
      gap:12px; padding:10px 18px; align-items:center;
      transition:.1s; border-bottom:1px solid var(--b1); }
.ar:hover { background:var(--bg2); }
.ac { border-left:2px solid #f87171; }
.aw { border-left:2px solid #f59e0b; }
.ai { border-left:2px solid var(--blue); }

/* Logo shimmer */
.logo {
  font-family:var(--head); font-weight:800; font-size:18px;
  letter-spacing:.28em; text-transform:uppercase;
  background:linear-gradient(90deg,#e4e4e7 20%,#3b82f6 45%,#e4e4e7 65%,#e4e4e7);
  background-size:250% auto; -webkit-background-clip:text; background-clip:text;
  -webkit-text-fill-color:transparent; animation:shimmer 5s linear infinite;
}

/* Ticker */
.tkw { overflow:hidden; white-space:nowrap; }
.tki { display:inline-flex; gap:40px; animation:ticker 35s linear infinite; }
.tkv { font-family:var(--mono); font-size:10px; color:var(--muted); letter-spacing:.1em; }
.tkv span { color:var(--sub); margin-left:5px; }
`;
document.head.appendChild(css);

// ─── HELPERS ─────────────────────────────────────────────────────
const f    = (v, d = 1) => typeof v === "number" && !isNaN(v) ? v.toFixed(d) : "—";
const cl   = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const pct  = (v, lo, hi) => cl((v - lo) / (hi - lo), 0, 1);

// ─── RING ────────────────────────────────────────────────────────
function Ring({ val = 0, min = 0, max = 100, unit = "", label = "",
                color = "#3b82f6", alarmHi, size = 128 }) {
  const R = 44, cx = 64, cy = 67, sw = 258;
  const sa = -219;
  const circ = 2 * Math.PI * R;
  const arc  = circ * (sw / 360);
  const off  = arc * (1 - pct(val, min, max));
  const alarm = alarmHi != null && val > alarmHi;
  const c = alarm ? "#f87171" : color;

  const xy = (deg) => {
    const r = (deg - 90) * (Math.PI / 180);
    return [cx + R * Math.cos(r), cy + R * Math.sin(r)];
  };
  const arc_d = (sd, sw2) => {
    const [sx, sy] = xy(sd), [ex, ey] = xy(sd + sw2);
    return `M ${sx} ${sy} A ${R} ${R} 0 ${sw2 > 180 ? 1 : 0} 1 ${ex} ${ey}`;
  };
  const path = arc_d(sa, sw);

  return (
    <svg width={size} height={size} viewBox="0 0 128 128" style={{ display:"block", margin:"0 auto" }}>
      <path d={path} className="ring-bg" />
      <path d={path} className="ring-fill" stroke={c}
        strokeDasharray={`${arc} ${circ}`} strokeDashoffset={off} />
      {alarmHi != null && (() => {
        const [ax, ay] = xy(sa + sw * pct(alarmHi, min, max));
        return <circle cx={ax} cy={ay} r="3" fill="#f87171" opacity=".85" />;
      })()}
      <text x={cx} y={cy - 5} textAnchor="middle"
            fill={alarm ? "#f87171" : "#e4e4e7"}
            fontSize="19" fontFamily="DM Mono" fontWeight="300">
        {f(val)}
      </text>
      <text x={cx} y={cy + 11} textAnchor="middle" fill="#52525b" fontSize="8.5" fontFamily="DM Mono">
        {unit}
      </text>
      <text x={cx} y={cy + 24} textAnchor="middle" fill="#3f3f46" fontSize="7.5"
            fontFamily="Inter" letterSpacing="1.5">
        {label.toUpperCase()}
      </text>
      {alarm && (
        <text x={cx} y={cy + 38} textAnchor="middle" fill="#f87171"
              fontSize="7" fontFamily="DM Mono" letterSpacing="2"
              style={{ animation:"blink 1s infinite" }}>ALARM</text>
      )}
    </svg>
  );
}

// ─── LINEAR BAR ──────────────────────────────────────────────────
function Bar2({ val = 0, max = 100, zones, unit, label, note }) {
  const p = pct(val, 0, max) * 100;
  const zone = zones?.find(z => val <= z.max) ?? zones?.[zones.length - 1];
  const col  = zone?.color ?? "#3b82f6";
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:10 }}>
        <div>
          <div className="lbl" style={{ marginBottom:4 }}>{label}</div>
          {note && <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--muted)", marginTop:2 }}>{note}</div>}
        </div>
        <div>
          <span className="num" style={{ fontSize:22, color:col }}>{f(val)}</span>
          <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--muted)", marginLeft:4 }}>{unit}</span>
        </div>
      </div>
      <div style={{ height:4, background:"var(--b2)", borderRadius:99, overflow:"hidden", marginBottom:7 }}>
        <div style={{ height:"100%", width:`${p}%`, background:col,
                      borderRadius:99, transition:"width 1s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      {zones && (
        <div style={{ display:"flex", justifyContent:"space-between" }}>
          {zones.map((z, i) => (
            <span key={i} style={{ fontFamily:"var(--mono)", fontSize:9, letterSpacing:".1em",
                                   color: zone === z ? z.color : "var(--muted)" }}>
              {z.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── TOOLTIP ─────────────────────────────────────────────────────
const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"var(--bg2)", border:"1px solid var(--b2)",
                  borderRadius:6, padding:"8px 12px" }}>
      <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--muted)", marginBottom:5 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontFamily:"var(--mono)", fontSize:10, color:p.color, marginBottom:2 }}>
          {p.name}: <span style={{ color:"var(--text)" }}>{typeof p.value === "number" ? p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── KPIS ────────────────────────────────────────────────────────
function KPI({ label, value, unit, color = "var(--text)", note, delay = 0 }) {
  return (
    <div className="c fu" style={{ padding:"18px 20px", animationDelay:`${delay}s` }}>
      <div className="lbl" style={{ marginBottom:12 }}>{label}</div>
      <div style={{ display:"flex", alignItems:"baseline", gap:5 }}>
        <span className="num" style={{ fontSize:26, color }}>{value}</span>
        <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--muted)" }}>{unit}</span>
      </div>
      {note && <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--muted)", marginTop:8 }}>{note}</div>}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────
const DEMO = {
  VFD_Freq_Hz:48.5, VFD_Current_A:12.4, VFD_Voltage_V:398,
  VFD_Power_kW:7.2, VFD_Energy_kWh:143.6, VFD_RunHours:1847.3,
  VFD_Status:"RUNNING", VFD_FaultCode:0,
  Pressure_bar:4.8, Flow_Lmin:62.3, Flow_Total_m3:8741.2,
  TDS_ppm:342, DiffPressure_mbar:148, Temperature_C:34.7, WiFi_RSSI:-58,
};

export default function App() {
  const [d,       setD]       = useState(null);
  const [recent,  setRecent]  = useState([]);
  const [summary, setSummary] = useState([]);
  const [alarms,  setAlarms]  = useState([]);
  const [period,  setPeriod]  = useState("today");
  const [live,    setLive]    = useState(false);
  const [loading, setLoading] = useState(true);
  const [ts,      setTs]      = useState(null);
  const [freq,    setFreq]    = useState(50);
  const [section, setSection] = useState("overview");

  const fetchAll = useCallback(async () => {
    try {
      const [a, b, c] = await Promise.all([
        fetch(`${SCRIPT_URL}?action=latest`).then(r => r.json()),
        fetch(`${SCRIPT_URL}?action=recent&n=60`).then(r => r.json()),
        fetch(`${SCRIPT_URL}?action=alarms&n=50`).then(r => r.json()),
      ]);
      if (a.status === "ok") setD(a.data);
      if (b.status === "ok") setRecent(b.data);
      if (c.status === "ok") setAlarms(c.data);
      setLive(true); setTs(new Date());
    } catch { setLive(false); }
    finally { setLoading(false); }
  }, []);

  const fetchSum = useCallback(async () => {
    try {
      const r = await fetch(`${SCRIPT_URL}?action=summary&period=${period}`).then(x => x.json());
      if (r.status === "ok") setSummary(r.data);
    } catch {}
  }, [period]);

  useEffect(() => { fetchAll(); const t = setInterval(fetchAll, REFRESH_MS); return () => clearInterval(t); }, [fetchAll]);
  useEffect(() => { fetchSum(); }, [fetchSum]);

  const data   = d ?? DEMO;
  const run    = data.VFD_Status === "RUNNING";
  const fault  = data.VFD_Status === "FAULT";
  const sPill  = fault ? "pr" : run ? "pg" : "pm";
  const sDot   = fault ? "dr" : run ? "dg" : "dm";

  const chart  = recent.map((r, i) => ({
    t: r.Time?.slice(0, 5) ?? i,
    p: +r.Pressure_bar  || 0,
    f: +r.Flow_Lmin     || 0,
    T: +r.Temperature_C || 0,
    k: +r.VFD_Power_kW  || 0,
    s: +r.TDS_ppm        || 0,
  }));
  const cSum   = summary.map(r => ({
    d:   r.Date?.slice(5) ?? "",
    kwh: +r.TotalEnergy_kWh || 0,
    h:   +r.RunHours        || 0,
    p:   +r.AvgPressure_bar || 0,
  }));
  const totKwh = cSum.reduce((s, r) => s + r.kwh, 0);
  const crit   = alarms.filter(a => a.Severity === "CRITICAL").length;

  const tick = [
    { l:"PRESSURE", v:`${f(data.Pressure_bar)} bar` },
    { l:"FLOW",     v:`${f(data.Flow_Lmin)} L/min` },
    { l:"TDS",      v:`${f(data.TDS_ppm, 0)} ppm` },
    { l:"TEMP",     v:`${f(data.Temperature_C)} °C` },
    { l:"POWER",    v:`${f(data.VFD_Power_kW)} kW` },
    { l:"FREQ",     v:`${f(data.VFD_Freq_Hz)} Hz` },
    { l:"ΔP",       v:`${f(data.DiffPressure_mbar, 0)} mbar` },
    { l:"ENERGY",   v:`${f(data.VFD_Energy_kWh)} kWh` },
    { l:"VOL",      v:`${f(data.Flow_Total_m3, 2)} m³` },
    { l:"RUNTIME",  v:`${f(data.VFD_RunHours)} h` },
  ];

  if (loading) return (
    <div style={{ height:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
                  flexDirection:"column", gap:16, background:"var(--bg0)" }}>
      <div style={{ width:28, height:28, border:"2px solid var(--b2)", borderTopColor:"var(--blue)",
                    borderRadius:"50%", animation:"spin .75s linear infinite" }} />
      <div className="lbl" style={{ letterSpacing:".2em" }}>INITIALIZING TAKAMUL ICS</div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg0)" }}>

      {/* HEADER */}
      <header style={{
        position:"sticky", top:0, zIndex:200, height:54,
        background:"rgba(9,9,11,.92)", borderBottom:"1px solid var(--b1)",
        backdropFilter:"blur(16px)", padding:"0 22px",
        display:"flex", alignItems:"center", justifyContent:"space-between"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{
            width:30, height:30, borderRadius:7, flexShrink:0,
            background:"linear-gradient(140deg,#1d4ed8 0%,#3b82f6 100%)",
            display:"flex", alignItems:"center", justifyContent:"center"
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="logo">TAKAMUL</div>
            <div style={{ fontFamily:"var(--mono)", fontSize:8.5, color:"var(--muted)",
                          letterSpacing:".16em", marginTop:-1 }}>
              INDUSTRIAL CONTROL & MONITORING SYSTEM
            </div>
          </div>
        </div>

        <nav style={{ display:"flex", gap:3 }}>
          {[["overview","Overview"],["analytics","Analytics"],["alarms","Alarms"]].map(([k, l]) => (
            <button key={k} className={`tab ${section === k ? "on" : ""}`}
                    onClick={() => setSection(k)}>{l}</button>
          ))}
        </nav>

        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          {crit > 0 && (
            <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"#f87171",
                          letterSpacing:".12em", display:"flex", alignItems:"center", gap:5 }}>
              <span className="d dr" />{crit} CRITICAL
            </div>
          )}
          <div className={`pill ${sPill}`}>
            <span className={`d ${sDot}`} />{data.VFD_Status}
          </div>
          <div style={{ width:1, height:18, background:"var(--b1)" }} />
          <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--muted)",
                        display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ color: live ? "#4ade80" : "#f87171" }}>●</span>
            {live ? "LIVE" : "OFFLINE"}
          </div>
          <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--muted)" }}>
            {ts?.toLocaleTimeString("en-GB") ?? "—"}
          </div>
        </div>
      </header>

      {/* TICKER */}
      <div style={{ background:"var(--bg1)", borderBottom:"1px solid var(--b1)", padding:"6px 0" }}>
        <div className="tkw">
          <div className="tki">
            {[...tick, ...tick].map((x, i) => (
              <div key={i} className="tkv">{x.l}<span>{x.v}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <main style={{ maxWidth:1400, margin:"0 auto", padding:"22px 22px 60px" }}>

        {/* OVERVIEW */}
        {section === "overview" && (<>

          {/* VFD Panel */}
          <div className="c fu" style={{ marginBottom:14 }}>
            <div style={{ padding:"13px 20px", borderBottom:"1px solid var(--b1)",
                          display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontFamily:"var(--head)", fontWeight:700, fontSize:13,
                               letterSpacing:".04em" }}>VFD · 3-Phase Pump Drive</span>
                <div className={`pill ${sPill}`} style={{ fontSize:8.5 }}>
                  <span className={`d ${sDot}`} />{data.VFD_Status}
                </div>
              </div>
              <span style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--muted)" }}>
                Slave 01 · RS485 Modbus RTU
              </span>
            </div>

            <div style={{ padding:"18px 20px", display:"grid",
                          gridTemplateColumns:"120px 1fr 300px", gap:24, alignItems:"start" }}>
              {/* Buttons */}
              <div style={{ display:"flex", flexDirection:"column", gap:8, paddingTop:4 }}>
                <button className="btn bs">▶ Start</button>
                <button className="btn bx">■ Stop</button>
                <div style={{ fontFamily:"var(--mono)", fontSize:9, color:"var(--muted)",
                              textAlign:"center", marginTop:4 }}>
                  Slave 01
                </div>
              </div>

              {/* Freq + sparkline */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between",
                              alignItems:"baseline", marginBottom:10 }}>
                  <div className="lbl">Output Frequency</div>
                  <div>
                    <span className="num" style={{ fontSize:30, color:"var(--blue)" }}>{freq.toFixed(1)}</span>
                    <span style={{ fontFamily:"var(--mono)", fontSize:11, color:"var(--muted)", marginLeft:4 }}>Hz</span>
                  </div>
                </div>
                <input type="range" min="0" max="60" step="0.5" value={freq}
                       onChange={e => setFreq(+e.target.value)}
                       style={{ "--p":`${(freq/60)*100}%` }} />
                <div style={{ display:"flex", justifyContent:"space-between",
                              fontFamily:"var(--mono)", fontSize:8.5, color:"var(--muted)", margin:"5px 0 14px" }}>
                  <span>0</span><span>30 Hz</span><span>60</span>
                </div>
                <div style={{ height:48, marginTop:4 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chart.slice(-30)}>
                      <defs>
                        <linearGradient id="gkw" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={.22}/>
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="k" stroke="#3b82f6"
                            strokeWidth={1.5} fill="url(#gkw)" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Readbacks */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
                            gap:1, background:"var(--b1)", borderRadius:6, overflow:"hidden" }}>
                {[
                  { l:"Current", v:f(data.VFD_Current_A), u:"A" },
                  { l:"Voltage", v:f(data.VFD_Voltage_V, 0), u:"V" },
                  { l:"Power", v:f(data.VFD_Power_kW), u:"kW", hi:true },
                  { l:"Energy", v:f(data.VFD_Energy_kWh), u:"kWh", hi:true },
                  { l:"Run Hours", v:f(data.VFD_RunHours), u:"h" },
                  { l:"Fault Code", v:data.VFD_FaultCode ?? "0", u:"", err:fault },
                ].map(({ l, v, u, hi, err }) => (
                  <div key={l} style={{ background:"var(--bg2)", padding:"10px 13px" }}>
                    <div className="lbl" style={{ marginBottom:5 }}>{l}</div>
                    <div className="num" style={{ fontSize:16,
                      color: err ? "#f87171" : hi ? "#f59e0b" : "var(--text)" }}>
                      {v}<span style={{ fontFamily:"var(--mono)", fontSize:8.5,
                                        color:"var(--muted)", marginLeft:3 }}>{u}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sensor Row 1 */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:12 }}>
            {[
              { label:"Inlet Pressure", val:+data.Pressure_bar, min:0, max:10, unit:"bar", color:"#3b82f6",
                alarmHi:8, spark:"p", status:+data.Pressure_bar>8?"HIGH":"NORMAL", pill:+data.Pressure_bar>8?"pr":"pg" },
              { label:"Flow Rate", val:+data.Flow_Lmin, min:0, max:100, unit:"L/min", color:"#2dd4bf",
                alarmHi:90, spark:"f", status:"4-20mA", pill:"pm",
                extra: <div style={{ display:"flex", justifyContent:"space-between", marginTop:10 }}>
                  <div className="lbl">Total Volume</div>
                  <div className="num" style={{ fontSize:14, color:"var(--sub)" }}>
                    {f(data.Flow_Total_m3, 2)} <span style={{ fontSize:8.5, color:"var(--muted)" }}>m³</span>
                  </div>
                </div>
              },
              { label:"PT100 Temperature", val:+data.Temperature_C, min:0, max:100, unit:"°C", color:"#f59e0b",
                alarmHi:75, spark:"T", status:+data.Temperature_C>65?"WARM":"NORMAL",
                pill:+data.Temperature_C>65?"pa":"pg" },
            ].map(({ label, val, min, max, unit, color, alarmHi, spark, status, pill, extra }) => (
              <div key={label} className="c fu fu1">
                <div style={{ padding:"13px 16px", borderBottom:"1px solid var(--b1)",
                              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div className="lbl">{label}</div>
                  <div className={`pill ${pill}`} style={{ fontSize:8.5 }}>{status}</div>
                </div>
                <div style={{ padding:"14px 16px" }}>
                  <Ring val={val} min={min} max={max} unit={unit} label={label} color={color} alarmHi={alarmHi} />
                  {extra ?? (
                    <div style={{ marginTop:12, height:34 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chart.slice(-20)}>
                          <defs>
                            <linearGradient id={`g${spark}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={color} stopOpacity={.2}/>
                              <stop offset="100%" stopColor={color} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey={spark} stroke={color}
                                strokeWidth={1.5} fill={`url(#g${spark})`} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sensor Row 2 */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {/* TDS */}
            <div className="c fu fu2">
              <div style={{ padding:"13px 16px", borderBottom:"1px solid var(--b1)" }}>
                <div className="lbl">TDS — Water Quality</div>
              </div>
              <div style={{ padding:"16px" }}>
                <Bar2 val={+data.TDS_ppm} max={2000} unit="ppm" label="Total Dissolved Solids"
                  zones={[
                    { max:300,  label:"Excellent", color:"#4ade80" },
                    { max:600,  label:"Good",      color:"#2dd4bf" },
                    { max:1000, label:"Fair",       color:"#f59e0b" },
                    { max:2000, label:"Poor",       color:"#f87171" },
                  ]} />
                <div style={{ marginTop:16, height:38 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chart.slice(-20)}>
                      <Line type="monotone" dataKey="s" stroke="#2dd4bf" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Diff Pressure */}
            <div className="c fu fu3">
              <div style={{ padding:"13px 16px", borderBottom:"1px solid var(--b1)",
                            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div className="lbl">Differential Pressure</div>
                <div className="pill pm" style={{ fontSize:8.5 }}>Modbus RTU</div>
              </div>
              <div style={{ padding:"16px" }}>
                <Bar2 val={+data.DiffPressure_mbar} max={500} unit="mbar"
                  label="Filter ΔP" note="Slave 02 · Reg 0x0001"
                  zones={[
                    { max:100, label:"Clean",   color:"#4ade80" },
                    { max:250, label:"Monitor", color:"#f59e0b" },
                    { max:500, label:"Replace", color:"#f87171" },
                  ]} />
                <div className="div" style={{ margin:"16px 0 14px" }} />
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div className="lbl">Filter Status</div>
                  {(() => {
                    const v = +data.DiffPressure_mbar || 0;
                    const [lbl, cls] = v < 100 ? ["Clean ✓","pg"] : v < 250 ? ["Monitor ⚠","pa"] : ["Replace ✕","pr"];
                    return <div className={`pill ${cls}`} style={{ fontSize:8.5 }}>{lbl}</div>;
                  })()}
                </div>
              </div>
            </div>

            {/* System health */}
            <div className="c fu fu4">
              <div style={{ padding:"13px 16px", borderBottom:"1px solid var(--b1)" }}>
                <div className="lbl">System Health</div>
              </div>
              <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:13 }}>
                {[
                  { l:"WiFi Signal",    v:`${data.WiFi_RSSI ?? "—"} dBm`,     ok:+data.WiFi_RSSI > -75 },
                  { l:"Phase Voltage",  v:`${f(+data.VFD_Voltage_V / 1.732, 0)} V L-N`, ok:true },
                  { l:"Power Factor",   v:"0.93",                               ok:true },
                  { l:"Uptime",         v:`${f(data.VFD_RunHours)} h`,          ok:true },
                  { l:"Last Sync",      v:ts?.toLocaleTimeString("en-GB") ?? "—", ok:live },
                ].map(({ l, v, ok }) => (
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <span className={`d ${ok ? "dg" : "da"}`} />
                      <span style={{ fontFamily:"var(--body)", fontSize:11, color:"var(--sub)" }}>{l}</span>
                    </div>
                    <span style={{ fontFamily:"var(--mono)", fontSize:11 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>)}

        {/* ANALYTICS */}
        {section === "analytics" && (<>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
            <div style={{ fontFamily:"var(--head)", fontWeight:700, fontSize:16 }}>Consumption Analytics</div>
            <div style={{ display:"flex", gap:3 }}>
              {[["today","Today"],["week","Week"],["month","Month"],["year","Year"]].map(([k,l]) => (
                <button key={k} className={`tab ${period===k?"on":""}`} onClick={() => setPeriod(k)}>{l}</button>
              ))}
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:14 }}>
            <KPI label="Total Energy"   value={totKwh.toFixed(1)} unit="kWh" color="var(--amber)" delay={0} />
            <KPI label="Estimated Cost" value={(totKwh * KWH_TARIFF).toFixed(0)} unit="EGP"
                 note={`@ ${KWH_TARIFF} EGP / kWh`} color="var(--blue)" delay={.06} />
            <KPI label="Avg Pressure"   value={
              cSum.length ? (cSum.reduce((s,r)=>s+r.p,0)/cSum.length).toFixed(2) : "—"
            } unit="bar" color="var(--teal)" delay={.12} />
            <KPI label="Data Points" value={summary.length} unit="readings" delay={.18} />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            {[
              { title:"Energy — kWh", data:cSum, k:"kwh", color:"#f59e0b", name:"kWh", type:"area", gid:"gkwh2" },
              { title:"Operating Hours", data:cSum, k:"h",   color:"#3b82f6", name:"hrs", type:"bar" },
              { title:"Pressure Trend (last 60)", data:chart, k:"p", color:"#3b82f6", name:"bar", type:"line", ref:8 },
              { title:"Flow & Temperature",       data:chart, k:"f", color:"#2dd4bf", name:"L/min", type:"line",
                extra:[{ k:"T", color:"#f59e0b", name:"°C" }] },
            ].map(({ title, data: cd, k, color, name, type, gid, ref, extra }, i) => (
              <div key={i} className="c fu" style={{ animationDelay:`${i*.07}s` }}>
                <div style={{ padding:"13px 16px", borderBottom:"1px solid var(--b1)" }}>
                  <div className="lbl">{title}</div>
                </div>
                <div style={{ padding:"14px 16px", height:200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {type === "area" ? (
                      <AreaChart data={cd}>
                        <defs>
                          <linearGradient id={gid || `ga${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={.25}/>
                            <stop offset="100%" stopColor={color} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#1e2128" strokeDasharray="2 6" />
                        <XAxis dataKey="d" tick={{ fontFamily:"DM Mono", fontSize:8.5, fill:"#52525b" }} />
                        <YAxis tick={{ fontFamily:"DM Mono", fontSize:8.5, fill:"#52525b" }} />
                        <Tooltip content={<Tip />} />
                        <Area type="monotone" dataKey={k} name={name} stroke={color}
                              strokeWidth={1.8} fill={`url(#${gid || `ga${i}`})`} dot={false} />
                      </AreaChart>
                    ) : type === "bar" ? (
                      <BarChart data={cd}>
                        <CartesianGrid stroke="#1e2128" strokeDasharray="2 6" />
                        <XAxis dataKey="d" tick={{ fontFamily:"DM Mono", fontSize:8.5, fill:"#52525b" }} />
                        <YAxis tick={{ fontFamily:"DM Mono", fontSize:8.5, fill:"#52525b" }} />
                        <Tooltip content={<Tip />} />
                        <Bar dataKey={k} name={name} fill={color} radius={[3,3,0,0]} />
                      </BarChart>
                    ) : (
                      <LineChart data={cd}>
                        <CartesianGrid stroke="#1e2128" strokeDasharray="2 6" />
                        <XAxis dataKey="t" tick={{ fontFamily:"DM Mono", fontSize:8.5, fill:"#52525b" }}
                               interval="preserveStartEnd" />
                        <YAxis tick={{ fontFamily:"DM Mono", fontSize:8.5, fill:"#52525b" }} />
                        <Tooltip content={<Tip />} />
                        {ref && <ReferenceLine y={ref} stroke="#f8717155" strokeDasharray="3 5" />}
                        <Line type="monotone" dataKey={k} name={name} stroke={color}
                              strokeWidth={1.5} dot={false} />
                        {extra?.map(e => (
                          <Line key={e.k} type="monotone" dataKey={e.k} name={e.name}
                                stroke={e.color} strokeWidth={1.5} dot={false} />
                        ))}
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </>)}

        {/* ALARMS */}
        {section === "alarms" && (
          <div className="c fu">
            <div style={{ padding:"13px 18px", borderBottom:"1px solid var(--b1)",
                          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontFamily:"var(--head)", fontWeight:700, fontSize:14 }}>Alarm & Event Log</div>
              {crit > 0 && <div className="pill pr" style={{ fontSize:8.5 }}><span className="d dr" />{crit} Critical</div>}
            </div>
            {/* Header */}
            <div className="ar" style={{ borderBottom:"1px solid var(--b1)", background:"var(--bg2)" }}>
              {["Timestamp","Sensor","Message","Severity"].map(h => (
                <div key={h} className="lbl">{h}</div>
              ))}
            </div>
            {/* Rows */}
            <div style={{ maxHeight:520, overflowY:"auto" }}>
              {alarms.length === 0 ? (
                <div style={{ padding:"40px 18px", fontFamily:"var(--mono)", fontSize:11,
                              color:"var(--muted)", textAlign:"center" }}>
                  No active alarms — system nominal ✓
                </div>
              ) : alarms.map((a, i) => (
                <div key={i} className={`ar ${a.Severity==="CRITICAL"?"ac":a.Severity==="WARNING"?"aw":"ai"}`}>
                  <span style={{ fontFamily:"var(--mono)", fontSize:9.5, color:"var(--muted)" }}>
                    {a.Timestamp
                      ? new Date(a.Timestamp).toLocaleString("en-GB", { dateStyle:"short", timeStyle:"medium" })
                      : "—"}
                  </span>
                  <span style={{ fontFamily:"var(--mono)", fontSize:9.5, color:"var(--sub)",
                                 textTransform:"uppercase", letterSpacing:".08em" }}>{a.Sensor}</span>
                  <span style={{ fontFamily:"var(--body)", fontSize:11, color:"var(--text)" }}>{a.Message}</span>
                  <span style={{ fontFamily:"var(--mono)", fontSize:9, textAlign:"right", textTransform:"uppercase",
                                 letterSpacing:".1em",
                                 color: a.Severity==="CRITICAL" ? "#f87171"
                                      : a.Severity==="WARNING"  ? "#f59e0b"
                                      : "#3b82f6" }}>
                    {a.Severity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop:"1px solid var(--b1)", padding:"10px 22px",
        display:"flex", justifyContent:"space-between",
        fontFamily:"var(--mono)", fontSize:8.5, color:"var(--muted)", letterSpacing:".1em"
      }}>
        <span>TAKAMUL ICS · ESP32-S3 · v2.1.0</span>
        <span>AUTO-REFRESH {REFRESH_MS/1000}s · GOOGLE SHEETS BACKEND</span>
      </footer>
    </div>
  );
}
