import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { signIn, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [localError, setLocalError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLocalError(null)
    const { error } = await signIn(email, password)
    if (error) setLocalError(error.message)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-body"
      style={{ background: 'linear-gradient(160deg, #0A2A6E 0%, #0E4A9C 30%, #1565C0 55%, #0D47A1 80%, #083170 100%)' }}>

      {/* ── Sky glow ── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 90% 60% at 50% 10%, rgba(100,210,255,0.25) 0%, rgba(30,136,229,0.12) 50%, transparent 80%)'
      }} />

      {/* ── Animated grid floor ── */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(100,210,255,0.10) 1px, transparent 1px),
          linear-gradient(90deg, rgba(100,210,255,0.10) 1px, transparent 1px)
        `,
        backgroundSize: '52px 52px',
        maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)'
      }} />

      {/* ── Horizontal horizon light ── */}
      <div className="absolute w-full" style={{
        bottom: '28%', height: '1px',
        background: 'linear-gradient(90deg, transparent 0%, rgba(100,220,255,0.4) 30%, rgba(150,230,255,0.7) 50%, rgba(100,220,255,0.4) 70%, transparent 100%)'
      }} />

      {/* ── SVG Industrial Scene ── */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full"
        viewBox="0 0 1200 420"
        preserveAspectRatio="xMidYMax meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.75 }}
      >
        {/* Floor line */}
        <line x1="0" y1="380" x2="1200" y2="380" stroke="rgba(100,210,255,0.35)" strokeWidth="1.5" />

        {/* ════ ROBOT ARM 1 — LEFT ════ */}
        <g transform="translate(130, 290)">
          {/* Base plate */}
          <rect x="-28" y="68" width="56" height="14" rx="3" fill="rgba(13,71,161,0.6)" stroke="rgba(100,210,255,0.6)" strokeWidth="1.5"/>
          {/* Torso */}
          <rect x="-12" y="44" width="24" height="28" rx="3" fill="rgba(21,101,192,0.55)" stroke="rgba(100,210,255,0.5)" strokeWidth="1.5"/>
          {/* Link 1 — upper arm */}
          <rect x="-8" y="4" width="16" height="43" rx="4" fill="rgba(25,118,210,0.55)" stroke="rgba(100,220,255,0.55)" strokeWidth="1.5"/>
          {/* Shoulder joint */}
          <circle cx="0" cy="4" r="10" fill="rgba(13,71,161,0.7)" stroke="rgba(100,230,255,0.75)" strokeWidth="2.5"/>
          <circle cx="0" cy="4" r="4" fill="rgba(100,230,255,0.9)"/>
          {/* Link 2 — forearm, angled -40° */}
          <g transform="rotate(-40, 0, 4)">
            <rect x="-6" y="-50" width="12" height="56" rx="3" fill="rgba(30,136,229,0.55)" stroke="rgba(100,220,255,0.55)" strokeWidth="1.5"/>
            {/* Elbow joint */}
            <circle cx="0" cy="-50" r="7" fill="rgba(13,71,161,0.7)" stroke="rgba(100,230,255,0.75)" strokeWidth="2"/>
            <circle cx="0" cy="-50" r="3" fill="rgba(100,230,255,0.9)"/>
            {/* Link 3 — wrist, rotate back 60° */}
            <g transform="rotate(60, 0, -50)">
              <rect x="-5" y="-70" width="10" height="22" rx="2" fill="rgba(41,182,246,0.55)" stroke="rgba(100,220,255,0.55)" strokeWidth="1.5"/>
              {/* Wrist joint */}
              <circle cx="0" cy="-70" r="5.5" fill="rgba(13,71,161,0.7)" stroke="rgba(100,230,255,0.75)" strokeWidth="2"/>
              {/* Gripper */}
              <line x1="-9" y1="-83" x2="-3" y2="-74" stroke="rgba(100,230,255,0.85)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="9" y1="-83" x2="3" y2="-74" stroke="rgba(100,230,255,0.85)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="-6" y1="-87" x2="-9" y2="-83" stroke="rgba(100,230,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="6" y1="-87" x2="9" y2="-83" stroke="rgba(100,230,255,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
            </g>
          </g>
          {/* Status LED */}
          <circle cx="8" cy="52" r="3" fill="rgba(0,255,180,1)"/>
          <circle cx="8" cy="52" r="6" fill="rgba(0,255,180,0.2)"/>
        </g>

        {/* ════ CONVEYOR BELT ════ */}
        <g transform="translate(60, 0)">
          <rect x="0" y="348" width="460" height="32" rx="5" fill="rgba(13,71,161,0.35)" stroke="rgba(100,210,255,0.3)" strokeWidth="1.5"/>
          {/* Belt slats */}
          {[20,60,100,140,180,220,260,300,340,380,420].map(x => (
            <line key={x} x1={x} y1="348" x2={x} y2="380" stroke="rgba(100,210,255,0.18)" strokeWidth="1.5"/>
          ))}
          {/* Drive wheels */}
          <circle cx="18" cy="380" r="14" fill="rgba(13,60,130,0.7)" stroke="rgba(100,210,255,0.4)" strokeWidth="2"/>
          <circle cx="18" cy="380" r="6" fill="rgba(100,210,255,0.3)"/>
          <circle cx="444" cy="380" r="14" fill="rgba(13,60,130,0.7)" stroke="rgba(100,210,255,0.4)" strokeWidth="2"/>
          <circle cx="444" cy="380" r="6" fill="rgba(100,210,255,0.3)"/>
          {/* Boxes on belt */}
          <rect x="80" y="325" width="38" height="26" rx="3" fill="rgba(21,101,192,0.45)" stroke="rgba(100,210,255,0.35)" strokeWidth="1.5"/>
          <rect x="200" y="325" width="38" height="26" rx="3" fill="rgba(21,101,192,0.45)" stroke="rgba(100,210,255,0.35)" strokeWidth="1.5"/>
          <rect x="330" y="325" width="38" height="26" rx="3" fill="rgba(21,101,192,0.45)" stroke="rgba(100,210,255,0.35)" strokeWidth="1.5"/>
        </g>

        {/* ════ ROBOT ARM 2 — CENTER-LEFT ════ */}
        <g transform="translate(330, 270)">
          <rect x="-28" y="88" width="56" height="14" rx="3" fill="rgba(13,71,161,0.6)" stroke="rgba(100,210,255,0.6)" strokeWidth="1.5"/>
          <rect x="-12" y="62" width="24" height="30" rx="3" fill="rgba(21,101,192,0.55)" stroke="rgba(100,210,255,0.5)" strokeWidth="1.5"/>
          <rect x="-8" y="16" width="16" height="48" rx="4" fill="rgba(25,118,210,0.55)" stroke="rgba(100,220,255,0.55)" strokeWidth="1.5"/>
          <circle cx="0" cy="16" r="10" fill="rgba(13,71,161,0.7)" stroke="rgba(100,230,255,0.75)" strokeWidth="2.5"/>
          <circle cx="0" cy="16" r="4" fill="rgba(100,230,255,0.9)"/>
          {/* Arm angled +35° */}
          <g transform="rotate(35, 0, 16)">
            <rect x="-6" y="-52" width="12" height="70" rx="3" fill="rgba(30,136,229,0.55)" stroke="rgba(100,220,255,0.55)" strokeWidth="1.5"/>
            <circle cx="0" cy="-52" r="7" fill="rgba(13,71,161,0.7)" stroke="rgba(100,230,255,0.75)" strokeWidth="2"/>
            <circle cx="0" cy="-52" r="3" fill="rgba(100,230,255,0.9)"/>
            <g transform="rotate(-55, 0, -52)">
              <rect x="-5" y="-70" width="10" height="20" rx="2" fill="rgba(41,182,246,0.55)" stroke="rgba(100,220,255,0.55)" strokeWidth="1.5"/>
              <circle cx="0" cy="-70" r="5.5" fill="rgba(13,71,161,0.7)" stroke="rgba(100,230,255,0.75)" strokeWidth="2"/>
              <line x1="-9" y1="-84" x2="-3" y2="-74" stroke="rgba(100,230,255,0.85)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="9" y1="-84" x2="3" y2="-74" stroke="rgba(100,230,255,0.85)" strokeWidth="2.5" strokeLinecap="round"/>
            </g>
          </g>
          <circle cx="-8" cy="70" r="3" fill="rgba(0,255,180,1)"/>
          <circle cx="-8" cy="70" r="6" fill="rgba(0,255,180,0.2)"/>
        </g>

        {/* ════ TALL FACTORY STRUCTURE — CENTER ════ */}
        <g transform="translate(540, 0)">
          {/* Main column */}
          <rect x="0" y="160" width="50" height="220" rx="4" fill="rgba(13,71,161,0.4)" stroke="rgba(100,210,255,0.3)" strokeWidth="1.5"/>
          {/* Floors */}
          {[200,240,280,320,360].map(y => (
            <rect key={y} x="-10" y={y} width="70" height="6" rx="2" fill="rgba(30,136,229,0.35)" stroke="rgba(100,210,255,0.25)" strokeWidth="1"/>
          ))}
          {/* Chimney */}
          <rect x="12" y="100" width="26" height="65" rx="3" fill="rgba(21,101,192,0.45)" stroke="rgba(100,210,255,0.35)" strokeWidth="1.5"/>
          {/* Steam particles */}
          <circle cx="25" cy="90" r="5" fill="rgba(200,235,255,0.15)" stroke="rgba(100,210,255,0.2)" strokeWidth="1"/>
          <circle cx="18" cy="72" r="8" fill="rgba(200,235,255,0.1)" stroke="rgba(100,210,255,0.15)" strokeWidth="1"/>
          <circle cx="30" cy="55" r="12" fill="rgba(200,235,255,0.07)" stroke="rgba(100,210,255,0.1)" strokeWidth="1"/>
          {/* Warning light */}
          <circle cx="25" cy="155" r="5" fill="rgba(255,100,50,0.9)"/>
          <circle cx="25" cy="155" r="10" fill="rgba(255,100,50,0.15)"/>
        </g>

        {/* ════ WAREHOUSE RACKING — RIGHT ════ */}
        {/* Vertical uprights */}
        {[720, 940].map(x => (
          <rect key={x} x={x} y="110" width="8" height="270" rx="3" fill="rgba(21,101,192,0.45)" stroke="rgba(100,210,255,0.3)" strokeWidth="1.5"/>
        ))}
        {/* Shelf beams */}
        {[0,1,2,3,4].map(row => (
          <g key={row} transform={`translate(720, ${270 - row * 36})`}>
            <rect x="0" y="0" width="228" height="8" rx="2" fill="rgba(30,136,229,0.35)" stroke="rgba(100,210,255,0.3)" strokeWidth="1"/>
            {/* Pallets / boxes */}
            {[8, 58, 110, 162].map(bx => (
              <g key={bx}>
                <rect x={bx} y={-28} width={40} height={28} rx="3" fill="rgba(13,71,161,0.4)" stroke="rgba(100,200,255,0.25)" strokeWidth="1"/>
                <rect x={bx+4} y={-24} width={32} height={10} rx="1" fill="rgba(100,210,255,0.12)"/>
              </g>
            ))}
          </g>
        ))}

        {/* ════ AGV FORKLIFT ════ */}
        <g transform="translate(860, 342)">
          {/* Body */}
          <rect x="-35" y="-42" width="70" height="42" rx="6" fill="rgba(13,71,161,0.55)" stroke="rgba(100,210,255,0.45)" strokeWidth="1.5"/>
          {/* Cab window */}
          <rect x="-28" y="-36" width="26" height="24" rx="3" fill="rgba(100,200,255,0.12)" stroke="rgba(100,210,255,0.3)" strokeWidth="1"/>
          {/* Mast */}
          <rect x="22" y="-68" width="8" height="68" rx="2" fill="rgba(25,118,210,0.5)" stroke="rgba(100,210,255,0.4)" strokeWidth="1.5"/>
          {/* Forks */}
          <rect x="28" y="-30" width="28" height="5" rx="1" fill="rgba(100,200,255,0.55)" stroke="rgba(100,210,255,0.45)" strokeWidth="1"/>
          <rect x="28" y="-20" width="28" height="5" rx="1" fill="rgba(100,200,255,0.55)" stroke="rgba(100,210,255,0.45)" strokeWidth="1"/>
          {/* Box on forks */}
          <rect x="30" y="-52" width="30" height="24" rx="2" fill="rgba(21,101,192,0.5)" stroke="rgba(100,210,255,0.35)" strokeWidth="1"/>
          {/* Wheels */}
          <circle cx="-20" cy="3" r="9" fill="rgba(10,40,90,0.8)" stroke="rgba(100,210,255,0.45)" strokeWidth="2"/>
          <circle cx="-20" cy="3" r="4" fill="rgba(100,210,255,0.25)"/>
          <circle cx="20" cy="3" r="9" fill="rgba(10,40,90,0.8)" stroke="rgba(100,210,255,0.45)" strokeWidth="2"/>
          <circle cx="20" cy="3" r="4" fill="rgba(100,210,255,0.25)"/>
          {/* Status LEDs */}
          <circle cx="-25" cy="-36" r="3.5" fill="rgba(0,255,180,0.9)"/>
          <circle cx="-25" cy="-36" r="7" fill="rgba(0,255,180,0.15)"/>
          <circle cx="-15" cy="-36" r="3.5" fill="rgba(255,200,0,0.9)"/>
        </g>

        {/* ════ OVERHEAD CRANE ════ */}
        {/* Rail beam */}
        <rect x="550" y="78" width="610" height="10" rx="4" fill="rgba(21,101,192,0.45)" stroke="rgba(100,210,255,0.35)" strokeWidth="2"/>
        {/* Support columns */}
        <rect x="550" y="78" width="10" height="302" rx="3" fill="rgba(13,71,161,0.35)" stroke="rgba(100,210,255,0.2)" strokeWidth="1"/>
        <rect x="1150" y="78" width="10" height="302" rx="3" fill="rgba(13,71,161,0.35)" stroke="rgba(100,210,255,0.2)" strokeWidth="1"/>
        {/* Trolley */}
        <rect x="1020" y="70" width="64" height="22" rx="4" fill="rgba(25,118,210,0.6)" stroke="rgba(100,220,255,0.55)" strokeWidth="2"/>
        {/* Trolley wheels */}
        <circle cx="1030" cy="70" r="7" fill="rgba(13,60,130,0.8)" stroke="rgba(100,210,255,0.5)" strokeWidth="1.5"/>
        <circle cx="1074" cy="70" r="7" fill="rgba(13,60,130,0.8)" stroke="rgba(100,210,255,0.5)" strokeWidth="1.5"/>
        {/* Hoist cable */}
        <line x1="1052" y1="92" x2="1052" y2="175" stroke="rgba(100,210,255,0.5)" strokeWidth="2.5"/>
        {/* Hook */}
        <path d="M1045,175 Q1038,194 1052,196 Q1066,194 1059,175" fill="none" stroke="rgba(100,220,255,0.65)" strokeWidth="2.5"/>
        {/* Load block */}
        <rect x="1040" y="196" width="25" height="35" rx="3" fill="rgba(21,101,192,0.5)" stroke="rgba(100,210,255,0.4)" strokeWidth="1.5"/>

        {/* ════ DATA FLOW DOTS ════ */}
        {[90,150,220,290,360,430,640,720,800,880,960].map((x, i) => (
          <circle key={i} cx={x} cy={378} r="2.5" fill="rgba(100,220,255,0.55)"/>
        ))}

        {/* Arm glow halos */}
        <circle cx="130" cy="286" r="18" fill="rgba(100,200,255,0.05)" stroke="rgba(100,200,255,0.2)" strokeWidth="1"/>
        <circle cx="330" cy="286" r="18" fill="rgba(100,200,255,0.05)" stroke="rgba(100,200,255,0.2)" strokeWidth="1"/>
      </svg>

      {/* ── Scan lines overlay ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px)'
      }} />

      {/* ── Login Card ── */}
      <div className="relative z-10 w-full max-w-md px-5">
        <div style={{
          border: '1px solid rgba(0,180,255,0.35)',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          background: 'rgba(5,20,45,0.82)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 60px rgba(0,140,255,0.15), 0 0 0 1px rgba(0,180,255,0.1), 0 24px 48px rgba(0,0,0,0.4)'
        }}>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <div style={{
                width: 72, height: 72, borderRadius: 16,
                background: 'linear-gradient(135deg, #B94040, #8B2020)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(185,64,64,0.5), 0 0 60px rgba(185,64,64,0.2)'
              }}>
                <img src="./bolt-logo.svg" alt="Takamul" style={{width:44, height:44}} />
              </div>
            </div>
            <div className="font-display font-bold text-xl tracking-widest mb-1" style={{color:'#E0F4FF', letterSpacing:'0.2em'}}>
              TAKAMUL
            </div>
            <p className="font-mono text-xs tracking-widest" style={{color:'rgba(0,200,255,0.7)'}}>
              SMART SOLUTION — WATER TREATMENT
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="h-px flex-1" style={{background:'rgba(0,180,255,0.2)'}} />
              <span className="font-mono text-xs px-2" style={{color:'rgba(0,180,255,0.5)'}}>SECURE ACCESS</span>
              <div className="h-px flex-1" style={{background:'rgba(0,180,255,0.2)'}} />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="font-mono text-xs uppercase tracking-widest block mb-2" style={{color:'rgba(0,180,255,0.6)'}}>
                User / Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'rgba(0,180,255,0.5)'}} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg pl-10 pr-4 py-3 font-mono text-sm placeholder-opacity-40 focus:outline-none transition-all"
                  placeholder="admin@aquacontrol.io"
                  style={{
                    background: 'rgba(0,30,70,0.6)',
                    border: '1px solid rgba(0,150,220,0.3)',
                    color: '#E0F4FF',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,200,255,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,150,220,0.3)'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="font-mono text-xs uppercase tracking-widest block mb-2" style={{color:'rgba(0,180,255,0.6)'}}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:'rgba(0,180,255,0.5)'}} />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg pl-10 pr-12 py-3 font-mono text-sm focus:outline-none transition-all"
                  placeholder="••••••••"
                  style={{
                    background: 'rgba(0,30,70,0.6)',
                    border: '1px solid rgba(0,150,220,0.3)',
                    color: '#E0F4FF',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,200,255,0.6)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,150,220,0.3)'}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{color:'rgba(0,180,255,0.5)'}}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {(localError || error) && (
              <div className="flex items-center gap-2 rounded-lg px-4 py-3"
                style={{background:'rgba(185,64,64,0.15)', border:'1px solid rgba(185,64,64,0.35)'}}>
                <AlertCircle className="w-4 h-4 shrink-0" style={{color:'#ff6b6b'}} />
                <span className="font-mono text-xs" style={{color:'#ff9999'}}>{localError || error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-display font-bold text-sm tracking-widest py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{
                background: loading ? 'rgba(0,100,180,0.4)' : 'linear-gradient(135deg, rgba(0,140,220,0.9), rgba(0,100,180,0.9))',
                color: '#E0F4FF',
                border: '1px solid rgba(0,200,255,0.4)',
                boxShadow: loading ? 'none' : '0 0 24px rgba(0,160,255,0.3), 0 4px 12px rgba(0,0,0,0.3)'
              }}>
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  AUTHORIZE ACCESS
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-mono text-xs mt-5" style={{color:'rgba(0,150,200,0.4)'}}>
          Takamul Smart Solution v2.4.1 · ESP32-S3 + STM32 Integration
        </p>
      </div>
    </div>
  )
}
