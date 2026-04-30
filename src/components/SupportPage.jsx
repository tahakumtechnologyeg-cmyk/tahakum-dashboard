import { Mail, MessageCircle, Globe, Clock, ChevronRight, Send } from 'lucide-react'

const CONTACT_EMAIL = 'team.takamul.eg@gmail.com'

function ContactCard({ icon: Icon, title, value, subtitle, href, color = '#64d2ff', actionLabel = 'Open' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '18px 20px', borderRadius: 14,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        textDecoration: 'none', cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: 12,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.borderColor = `${color}50`
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = `0 4px 20px ${color}18`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: `${color}15`,
        border: `1px solid ${color}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon style={{ width: 20, height: 20, color }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)', marginBottom: 3 }}>
          {title}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: '#FBF7EF', marginBottom: 2, wordBreak: 'break-all' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            {subtitle}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 10, color, fontWeight: 700, letterSpacing: '0.06em' }}>
          {actionLabel}
        </span>
        <ChevronRight style={{ width: 14, height: 14, color }} />
      </div>
    </a>
  )
}

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#FBF7EF', fontWeight: 600 }}>
        {value}
      </span>
    </div>
  )
}

export default function SupportPage() {
  return (
    <div>
      {/* Hero card */}
      <div style={{
        padding: '28px 24px', borderRadius: 18, marginBottom: 24,
        background: 'linear-gradient(135deg, rgba(185,64,64,0.2) 0%, rgba(13,71,161,0.3) 100%)',
        border: '1px solid rgba(185,64,64,0.3)',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decoration rings */}
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 120, height: 120, borderRadius: '50%',
          border: '1px solid rgba(185,64,64,0.15)',
        }} />
        <div style={{
          position: 'absolute', top: -15, right: -15,
          width: 80, height: 80, borderRadius: '50%',
          border: '1px solid rgba(185,64,64,0.25)',
        }} />

        <div style={{
          width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
          background: 'rgba(185,64,64,0.2)', border: '1px solid rgba(185,64,64,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MessageCircle style={{ width: 26, height: 26, color: '#ff8a80' }} />
        </div>

        <div style={{ fontFamily: 'monospace', fontSize: 16, fontWeight: 700, letterSpacing: '0.1em', color: '#FBF7EF', marginBottom: 8 }}>
          TAKAMUL SUPPORT
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.55)', maxWidth: 300, margin: '0 auto', lineHeight: 1.7 }}>
          Having an issue? Our team is ready to help you get your system back on track.
        </div>
      </div>

      {/* Contact methods */}
      <div style={{ marginBottom: 8 }}>
        <div style={{
          fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)',
          marginBottom: 12, paddingLeft: 4,
        }}>
          CONTACT US
        </div>

        <ContactCard
          icon={Mail}
          title="EMAIL SUPPORT"
          value={CONTACT_EMAIL}
          subtitle="Typical response: within 24 hours"
          href={`mailto:${CONTACT_EMAIL}?subject=Takamul%20SCADA%20Support%20Request`}
          color="#64d2ff"
          actionLabel="Send Email"
        />

        <ContactCard
          icon={Send}
          title="QUICK REPORT"
          value="Send a pre-filled bug report"
          subtitle="Auto-fills device & system info"
          href={`mailto:${CONTACT_EMAIL}?subject=Bug%20Report%20%E2%80%94%20Takamul%20SCADA&body=Device%3A%0AIssue%3A%0ASteps%20to%20reproduce%3A%0A`}
          color="#ff8a80"
          actionLabel="Report Bug"
        />

        <ContactCard
          icon={Globe}
          title="COMPANY"
          value="Takamul Smart Solutions"
          subtitle="Egypt · Industrial Automation"
          href="mailto:team.takamul.eg@gmail.com"
          color="#a5d6a7"
          actionLabel="Contact"
        />
      </div>

      {/* System info section */}
      <div style={{
        padding: '18px 20px', borderRadius: 14, marginTop: 24,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
        }}>
          <Clock style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.4)' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>
            SYSTEM INFORMATION
          </span>
        </div>

        <InfoRow label="PLATFORM" value="Takamul SCADA v1.0" />
        <InfoRow label="HARDWARE" value="ESP32 · Modbus RTU" />
        <InfoRow label="PROTOCOL" value="MQTT / Supabase Realtime" />
        <InfoRow label="SENSORS" value="TDS · TEMP · FLOW · PRESS · ΔP" />
        <div style={{ paddingTop: 10 }}>
          <InfoRow label="SUPPORT EMAIL" value={CONTACT_EMAIL} />
        </div>
      </div>

      {/* Footer note */}
      <div style={{ textAlign: 'center', padding: '20px 16px 8px' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em' }}>
          © 2025 TAKAMUL SMART SOLUTIONS · EGYPT
        </span>
      </div>
    </div>
  )
}
