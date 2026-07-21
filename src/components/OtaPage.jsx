import { useState } from 'react'
import {
  Upload, Cpu, Wifi, AlertCircle, CheckCircle2,
  Clock, ExternalLink, ChevronDown, ChevronUp, Info, RotateCcw,
} from 'lucide-react'
import { useControls } from '../hooks/useControls'
import { useAuth } from '../hooks/useAuth'

function Card({ children, style = {} }) {
  return (
    <div className="bg-scada-panel border border-scada-border rounded-xl p-[20px_22px]" style={style}>
      {children}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    idle:    { color: 'var(--scada-muted)', bg: 'var(--scada-dim)', label: 'IDLE' },
    pending: { color: '#d97706',            bg: 'rgba(217,119,6,0.1)',  label: 'QUEUING…' },
    ok:      { color: '#16a34a',            bg: 'rgba(22,163,74,0.1)', label: 'SENT ✓' },
    error:   { color: '#dc2626',            bg: 'rgba(220,38,38,0.1)',   label: 'ERROR' },
  }
  const s = map[status] || map.idle
  return (
    <span className="font-mono text-[10px] font-bold tracking-widest px-[10px] py-[3px] rounded-full whitespace-nowrap"
      style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}40` }}>
      {s.label}
    </span>
  )
}

function OtaTarget({ icon: Icon, title, subtitle, field, color = 'var(--color-primary)', onTrigger }) {
  const [url,    setUrl]    = useState('')
  const [status, setStatus] = useState('idle')
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
            <Icon style={{ width: 18, height: 18, color }} />
          </div>
          <div>
            <div className="font-mono text-xs font-bold tracking-wider text-scada-text">{title}</div>
            <div className="font-mono text-[10px] text-scada-muted mt-1">{subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          {(status === 'ok' || status === 'error') && (
            <button onClick={handleReset} title="Reset" className="text-scada-muted hover:text-scada-text p-0.5 flex bg-none border-none cursor-pointer">
              <RotateCcw style={{ width: 13, height: 13 }} />
            </button>
          )}
        </div>
      </div>

      <div className="mb-[10px]">
        <label className="font-mono text-[10px] tracking-wider text-scada-muted block mb-1.5">
          FIRMWARE .BIN URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={e => { setUrl(e.target.value); if (status === 'error') setStatus('idle') }}
            disabled={!canSend}
            placeholder="https://github.com/…/releases/download/v1.0/firmware.bin"
            className="flex-1 px-3 py-2.5 font-mono text-xs rounded-lg outline-none transition-colors bg-scada-dim text-scada-text placeholder:text-scada-muted/50"
            style={{ border: `1px solid ${status === 'error' ? 'rgba(220,38,38,0.5)' : 'var(--scada-border)'}`, opacity: canSend ? 1 : 0.5 }}
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="px-[18px] py-2.5 rounded-lg border-none whitespace-nowrap font-mono text-[11px] font-bold tracking-wider flex items-center gap-1.5 transition-all"
            style={{
              background: canSend ? 'var(--color-primary)' : 'var(--scada-border)',
              color: canSend ? '#fff' : 'var(--scada-muted)',
              cursor: canSend ? 'pointer' : 'not-allowed',
            }}
          >
            {status === 'pending' ? <><Clock style={{ width: 13, height: 13 }} />QUEUING</>
             : status === 'ok'    ? <><CheckCircle2 style={{ width: 13, height: 13 }} />SENT</>
             :                      <><Upload style={{ width: 13, height: 13 }} />SEND OTA</>}
          </button>
        </div>
      </div>

      {status === 'error' && errMsg && (
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle style={{ width: 13, height: 13, color: '#dc2626', flexShrink: 0 }} />
          <span className="font-mono text-xs text-red-600 dark:text-red-400">{errMsg}</span>
        </div>
      )}

      {status === 'ok' && (
        <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <CheckCircle2 style={{ width: 13, height: 13, color: '#16a34a', flexShrink: 0 }} />
          <span className="font-mono text-xs text-green-600 dark:text-green-400">
            OTA command queued — device will update on next poll (≈5 s)
          </span>
        </div>
      )}
    </Card>
  )
}

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
      <button onClick={() => setOpen(o => !o)} className="flex items-center justify-between w-full bg-none border-none cursor-pointer p-0">
        <div className="flex items-center gap-2">
          <Info style={{ width: 15, height: 15, color: 'var(--color-primary)' }} />
          <span className="font-mono text-[11px] font-bold tracking-wider" style={{ color: 'var(--color-primary)' }}>HOW IT WORKS</span>
        </div>
        {open
          ? <ChevronUp  style={{ width: 14, height: 14, color: 'var(--scada-muted)' }} />
          : <ChevronDown style={{ width: 14, height: 14, color: 'var(--scada-muted)' }} />}
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-3">
          {steps.map((text, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="font-mono text-[11px] font-bold shrink-0 mt-0.5 text-scada-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-mono text-[11px] text-scada-muted leading-relaxed">{text}</span>
            </div>
          ))}

          <div className="mt-1 px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400 leading-relaxed">
              ⚠ The firmware URL must be publicly accessible (no authentication).
              GitHub Releases direct asset links work perfectly.
            </span>
          </div>

          <a href="https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] no-underline"
            style={{ color: 'var(--color-primary)' }}>
            <ExternalLink style={{ width: 11, height: 11 }} />
            How to create a GitHub Release →
          </a>
        </div>
      )}
    </Card>
  )
}

export default function OtaPage() {
  const { applyControl, hasDevices } = useControls()
  const { user } = useAuth()

  async function triggerOta(field, url) {
    await applyControl({ [field]: url })
  }

  if (!hasDevices) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-scada-panel border border-dashed border-scada-border rounded-2xl mt-4">
        <div className="text-4xl mb-4">🔌</div>
        <h3 className="font-mono font-bold text-sm tracking-widest text-scada-text mb-2">NO DEVICE LINKED</h3>
        <p className="font-mono text-xs text-scada-muted max-w-[280px]">
          Link your ESP32 device first before triggering OTA updates.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 max-w-[680px] mx-auto">
      <div className="flex items-start gap-2.5 rounded-xl px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <AlertCircle style={{ width: 15, height: 15, color: '#d97706', flexShrink: 0, marginTop: 1 }} />
        <span className="font-mono text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
          OTA updates will reboot the target device. Make sure the system is in a safe state before proceeding.
        </span>
      </div>

      <OtaTarget
        icon={Wifi}
        title="ESP32-S3 FIRMWARE"
        subtitle="Wi-Fi · Supabase · UART Bridge"
        field="ota_esp32_url"
        onTrigger={triggerOta}
      />

      <OtaTarget
        icon={Cpu}
        title="STM32F401 FIRMWARE"
        subtitle="Sensors · Modbus · VFD Control"
        field="ota_stm32_url"
        onTrigger={triggerOta}
      />

      <HowItWorks />

      <p className="font-mono text-[10px] text-center pt-1 text-scada-muted/50">
        Signed in as {user?.email} · OTA commands are written to the Supabase controls table
      </p>
    </div>
  )
}
