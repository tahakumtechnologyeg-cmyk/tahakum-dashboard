import { useState } from 'react'
import {
  Upload, Cpu, Wifi, AlertCircle, CheckCircle2,
  Clock, ExternalLink, ChevronDown, ChevronUp, Info, RotateCcw,
} from 'lucide-react'
import { useControls } from '../hooks/useControls'
import { useAuth } from '../hooks/useAuth'

// ─── Shared card ──────────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.13)',
      borderRadius: 14,
      padding: '20px 22px',
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    idle:    { color: 'rgba(255,255,255,0.35)', bg: 'rgba(255,255,255,0.07)', label: 'IDLE' },
    pending: { color: '#FFD54F',                bg: 'rgba(255,213,79,0.12)',  label: 'QUEUING…' },
    ok:      { color: '#69F0AE',                bg: 'rgba(105,240,174,0.12)', label: 'SENT ✓' },
    error:   { color: '#EF5350',                bg: 'rgba(239,83,80,0.12)',   label: 'ERROR' },
  }
  const s = map[status] || map.idle
  return (
    <span style={{
      fontFamily: 'monospace', fontSize: 10, fontWeight: 700,
      letterSpacing: '0.1em', padding: '3px 10px', borderRadius: 20,
      color: s.color, background: s.bg, border: `1px solid ${s.color}40`,
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  )
}

// ─── Single OTA target card ───────────────────────────────────────────────────
function OtaTarget({ icon: Icon, title, subtitle, field, color = '#ff8a80', onTrigger }) {
  const [url,    setUrl]    = useState('')
  const [status, setStatus] = useState('idle')   // idle | pending | ok | error
  const [errMsg, setErrMsg] = useState('')

  const canSend = status !== 'pending' && status !== 'ok'

  function validate(u) {
    if (!u.trim())               return 'Please paste a firmware URL'
    if (!u.startsWith('https://')) return 'URL must start with https://'
    if (!u.endsWith('.bin'))      return 'URL must point to a .bin file'
    return null
  }

  async function handleSend() {
    const err = validate(url)
    if (err) { setErrMsg(err); setStatus('error'); return }
    setStatus('pending'); setErrMsg('')
    try {
      await onTrigger(field, url.trim())
      setStatus('ok')
      setTimeout(() => { setStatus('idle'); setUrl('') }, 10000)
    } catch (e) {
      setErrMsg(e?.message || 'Failed to write to Supabase')
      setStatus('error')
    }
  }

  function handleReset() { setStatus('idle'); setUrl(''); setErrMsg('') }

  return (
    <Card>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(185,64,64,0.15)', border: '1px solid rgba(185,64,64,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon style={{ width: 18, height: 18, color }} />
          </div>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700,
              letterSpacing: '0.08em', color: '#FBF7EF' }}>{title}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 10,
              color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{subtitle}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <StatusBadge status={status} />
          {(status === 'ok' || status === 'error') && (
            <button onClick={handleReset} title="Reset"
              style={{ background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(255,255,255,0.35)', padding: 2, display: 'flex' }}>
              <RotateCcw style={{ width: 13, height: 13 }} />
            </button>
          )}
        </div>
      </div>

      {/* ── URL input ── */}
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.08em',
          color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 6 }}>
          FIRMWARE .BIN URL
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="url"
            value={url}
            onChange={e => { setUrl(e.target.value); if (status === 'error') setStatus('idle') }}
            disabled={!canSend}
            placeholder="https://github.com/…/releases/download/v1.0/firmware.bin"
            style={{
              flex: 1, padding: '9px 12px',
              fontFamily: 'monospace', fontSize: 11, color: '#FBF7EF',
              background: 'rgba(0,0,0,0.28)',
              border: `1px solid ${status === 'error' ? 'rgba(239,83,80,0.5)' : 'rgba(255,255,255,0.14)'}`,
              borderRadius: 8, outline: 'none',
              opacity: canSend ? 1 : 0.5,
              transition: 'border-color 0.2s',
            }}
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            style={{
              padding: '9px 18px', borderRadius: 8, border: 'none', whiteSpace: 'nowrap',
              background: canSend ? '#B94040' : 'rgba(185,64,64,0.2)',
              color: canSend ? '#FBF7EF' : 'rgba(255,255,255,0.3)',
              fontFamily: 'monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
              cursor: canSend ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s',
            }}
          >
            {status === 'pending' ? <><Clock style={{ width: 13, height: 13 }} />QUEUING</>
             : status === 'ok'    ? <><CheckCircle2 style={{ width: 13, height: 13 }} />SENT</>
             :                      <><Upload style={{ width: 13, height: 13 }} />SEND OTA</>}
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {status === 'error' && errMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(239,83,80,0.09)', border: '1px solid rgba(239,83,80,0.28)',
          borderRadius: 8, padding: '8px 12px' }}>
          <AlertCircle style={{ width: 13, height: 13, color: '#EF5350', flexShrink: 0 }} />
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#EF5350' }}>{errMsg}</span>
        </div>
      )}

      {/* ── Success ── */}
      {status === 'ok' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(105,240,174,0.08)', border: '1px solid rgba(105,240,174,0.22)',
          borderRadius: 8, padding: '8px 12px' }}>
          <CheckCircle2 style={{ width: 13, height: 13, color: '#69F0AE', flexShrink: 0 }} />
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#69F0AE' }}>
            OTA command queued — device will update on next poll (≈5 s)
          </span>
        </div>
      )}
    </Card>
  )
}

// ─── Collapsible how-it-works ─────────────────────────────────────────────────
function HowItWorks() {
  const [open, setOpen] = useState(false)
  const steps = [
    'Paste the direct .bin download URL (e.g. from a GitHub Release asset).',
    'Click SEND OTA — the URL is written into the controls row in Supabase.',
    'ESP32 picks it up on its next poll cycle (≈ 5 s).',
    'ESP32 OTA: chip downloads binary over HTTPS and reboots into new firmware.',
    'STM32 OTA: ESP32 downloads the .bin then programs STM32 over UART bootloader.',
    'System resumes automatically — no cables or physical access needed.',
  ]
  return (
    <Card>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <Info style={{ width: 15, height: 15, color: '#90CAF9' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.08em', color: '#90CAF9' }}>HOW IT WORKS</span>
        </div>
        {open
          ? <ChevronUp  style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.35)' }} />
          : <ChevronDown style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.35)' }} />}
      </button>

      {open && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 11 }}>
          {steps.map((text, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700,
                color: '#B94040', flexShrink: 0, marginTop: 1 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: 11,
                color: 'rgba(255,255,255,0.62)', lineHeight: 1.65 }}>{text}</span>
            </div>
          ))}

          {/* Warning */}
          <div style={{ marginTop: 4, padding: '10px 14px',
            background: 'rgba(255,213,79,0.07)', border: '1px solid rgba(255,213,79,0.22)',
            borderRadius: 8 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: '#FFD54F', lineHeight: 1.6 }}>
              ⚠ The firmware URL must be publicly accessible (no authentication).
              GitHub Releases direct asset links work perfectly.
            </span>
          </div>

          <a href="https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository"
            target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
              fontFamily: 'monospace', fontSize: 10, color: '#90CAF9', textDecoration: 'none' }}>
            <ExternalLink style={{ width: 11, height: 11 }} />
            How to create a GitHub Release →
          </a>
        </div>
      )}
    </Card>
  )
}

// ─── Main page export ─────────────────────────────────────────────────────────
export default function OtaPage() {
  const { applyControl, hasDevices } = useControls()
  const { user } = useAuth()

  async function triggerOta(field, url) {
    await applyControl({ [field]: url })
  }

  // ── No device linked ─────────────────────────────────────────────────────
  if (!hasDevices) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '48px 24px', textAlign: 'center',
        background: 'rgba(255,255,255,0.06)', borderRadius: 16,
        border: '1px dashed rgba(255,255,255,0.2)', marginTop: 16,
      }}>
        <div style={{ fontSize: 42, marginBottom: 14 }}>🔌</div>
        <h3 style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13,
          letterSpacing: '0.1em', color: '#FBF7EF', marginBottom: 8 }}>NO DEVICE LINKED</h3>
        <p style={{ fontFamily: 'monospace', fontSize: 11,
          color: 'rgba(255,255,255,0.5)', maxWidth: 280 }}>
          Link your ESP32 device first before triggering OTA updates.
        </p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 680 }}>

      {/* ── Safety warning ── */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        background: 'rgba(255,213,79,0.08)', border: '1px solid rgba(255,213,79,0.25)',
        borderRadius: 12, padding: '11px 16px',
      }}>
        <AlertCircle style={{ width: 15, height: 15, color: '#FFD54F', flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#FFD54F', lineHeight: 1.6 }}>
          OTA updates will reboot the target device. Make sure the system is in a safe state before proceeding.
        </span>
      </div>

      {/* ── ESP32 target ── */}
      <OtaTarget
        icon={Wifi}
        title="ESP32-S3 FIRMWARE"
        subtitle="Wi-Fi · Supabase · UART Bridge"
        field="ota_esp32_url"
        onTrigger={triggerOta}
      />

      {/* ── STM32 target ── */}
      <OtaTarget
        icon={Cpu}
        title="STM32F401 FIRMWARE"
        subtitle="Sensors · Modbus · VFD Control"
        field="ota_stm32_url"
        onTrigger={triggerOta}
      />

      {/* ── How it works ── */}
      <HowItWorks />

      {/* ── Footer note ── */}
      <p style={{ fontFamily: 'monospace', fontSize: 10,
        color: 'rgba(255,255,255,0.22)', textAlign: 'center', paddingTop: 2 }}>
        Signed in as {user?.email} · OTA commands are written to the Supabase controls table
      </p>
    </div>
  )
}
