import { useState, useEffect, useRef } from 'react'
import jsQR from 'jsqr'
import { Cpu, QrCode, Plus, Trash2, Pencil, Check, X, AlertCircle, CheckCircle, Loader2, WifiOff } from 'lucide-react'
import { useDevices } from '../hooks/useDevices'
import { DEMO_MODE } from '../lib/demo'

// ── QR Scanner ──────────────────────────────────────────────────────────────
function QRScanner({ onScan, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(null)
  const [status, setStatus] = useState('starting')

  useEffect(() => {
    let active = true

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        if (!active) { stream.getTracks().forEach(t => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          setStatus('scanning')
          tick()
        }
      } catch {
        setStatus('error')
      }
    }

    function tick() {
      if (!active) return
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState !== 4) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)
      if (code?.data) { onScan(code.data); return }
      rafRef.current = requestAnimationFrame(tick)
    }

    start()

    return () => {
      active = false
      cancelAnimationFrame(rafRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [onScan])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-scada-panel border border-scada-border rounded-2xl overflow-hidden w-full max-w-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b border-scada-border">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-scada-accent" />
            <span className="font-display text-xs font-bold tracking-widest text-scada-text">SCAN QR CODE</span>
          </div>
          <button onClick={onClose} className="text-scada-muted hover:text-scada-text transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative bg-black aspect-square">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          <canvas ref={canvasRef} className="hidden" />

          {status === 'scanning' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-52 h-52">
                {[['top-0 left-0', 'border-t-2 border-l-2'],
                  ['top-0 right-0', 'border-t-2 border-r-2'],
                  ['bottom-0 left-0', 'border-b-2 border-l-2'],
                  ['bottom-0 right-0', 'border-b-2 border-r-2']
                ].map(([pos, border], i) => (
                  <div key={i} className={`absolute ${pos} w-8 h-8 ${border} border-scada-accent rounded-sm`} />
                ))}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-scada-accent/60"
                  style={{ animation: 'scanLine 2s ease-in-out infinite' }} />
              </div>
            </div>
          )}

          {status === 'starting' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="font-mono text-xs">Starting camera...</span>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white p-4 text-center">
              <WifiOff className="w-8 h-8 text-scada-red" />
              <span className="font-mono text-xs text-scada-red">Camera access denied</span>
              <span className="font-mono text-[10px] text-scada-muted">Please allow camera or enter Device ID manually</span>
            </div>
          )}
        </div>

        <div className="px-4 py-3">
          <p className="font-mono text-[11px] text-scada-muted text-center">
            Point camera at the QR code printed on your device
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 0%; }
          50% { top: calc(100% - 2px); }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  )
}

// ── Add Device Modal ────────────────────────────────────────────────────────
function AddDeviceModal({ onAdd, onClose }) {
  const [step, setStep] = useState('input')
  const [deviceId, setDeviceId] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleScanned(value) {
    setDeviceId(value)
    setStep('input')
  }

  async function handleSubmit() {
    if (!deviceId.trim()) { setError('Please enter a Device ID'); return }
    setLoading(true)
    setError(null)
    const result = await onAdd(deviceId.trim(), name.trim())
    setLoading(false)
    if (result?.error) setError(result.error)
    else onClose()
  }

  if (step === 'scanning') {
    return <QRScanner onScan={handleScanned} onClose={() => setStep('input')} />
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-scada-panel border border-scada-border rounded-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-scada-border">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-scada-accent" />
            <span className="font-display text-xs font-bold tracking-widest text-scada-text">ADD NEW DEVICE</span>
          </div>
          <button onClick={onClose} className="text-scada-muted hover:text-scada-text transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <button
            onClick={() => setStep('scanning')}
            className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-scada-accent/40 rounded-xl hover:border-scada-accent/70 hover:bg-scada-accent/5 transition-all group"
          >
            <QrCode className="w-6 h-6 text-scada-accent group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="font-display text-xs font-bold tracking-wider text-scada-accent">SCAN QR CODE</div>
              <div className="font-mono text-[10px] text-scada-muted">Point at the code printed on your device</div>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-scada-border" />
            <span className="font-mono text-xs text-scada-muted">OR</span>
            <div className="flex-1 h-px bg-scada-border" />
          </div>

          <div>
            <label className="font-mono text-xs text-scada-muted uppercase tracking-wider block mb-1.5">
              Device ID
            </label>
            <input
              type="text"
              value={deviceId}
              onChange={e => setDeviceId(e.target.value)}
              placeholder="e.g. AA:BB:CC:DD:EE:FF"
              className="w-full rounded-lg px-4 py-2.5 font-mono text-sm bg-scada-dim border border-scada-border text-scada-text placeholder:text-scada-muted/50 focus:outline-none focus:border-scada-accent/50"
            />
          </div>

          <div>
            <label className="font-mono text-xs text-scada-muted uppercase tracking-wider block mb-1.5">
              Device Name <span className="text-scada-muted/50">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Main Building Pump"
              className="w-full rounded-lg px-4 py-2.5 font-mono text-sm bg-scada-dim border border-scada-border text-scada-text placeholder:text-scada-muted/50 focus:outline-none focus:border-scada-accent/50"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-scada-red/10 border border-scada-red/30 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 text-scada-red shrink-0" />
              <span className="font-mono text-xs text-scada-red">{error}</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !deviceId.trim()}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-display text-xs font-bold tracking-widest transition-all disabled:opacity-50"
            style={{ background: '#B94040', color: '#FBF7EF', boxShadow: '0 0 16px rgba(185,64,64,0.25)' }}
          >
            {loading
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> LINKING...</>
              : <><Cpu className="w-3.5 h-3.5" /> LINK DEVICE</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Device Card ─────────────────────────────────────────────────────────────
function DeviceCard({ device, onRemove, onRename }) {
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState(device.name)
  const [removing, setRemoving] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState(false)

  async function handleRename() {
    if (!nameInput.trim()) return
    await onRename(device.device_id, nameInput.trim())
    setEditing(false)
  }

  async function handleRemove() {
    if (!confirmRemove) { setConfirmRemove(true); return }
    setRemoving(true)
    await onRemove(device.device_id)
  }

  const claimedAt = new Date(device.claimed_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <div className="bg-scada-panel border border-scada-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(185,64,64,0.12)', border: '1px solid rgba(185,64,64,0.3)' }}>
            <Cpu className="w-4 h-4 text-scada-accent" />
          </div>
          {editing ? (
            <div className="flex items-center gap-1 flex-1">
              <input
                autoFocus
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setEditing(false) }}
                className="flex-1 rounded px-2 py-1 font-mono text-sm bg-scada-dim border border-scada-accent/50 text-scada-text focus:outline-none min-w-0"
              />
              <button onClick={handleRename} className="text-scada-green hover:opacity-80 transition-opacity shrink-0">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => { setEditing(false); setNameInput(device.name) }} className="text-scada-muted hover:text-scada-text transition-colors shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="min-w-0">
              <div className="font-display text-sm font-bold text-scada-text truncate">{device.name}</div>
              <div className="font-mono text-[10px] text-scada-muted">Linked {claimedAt}</div>
            </div>
          )}
        </div>

        {!editing && (
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => setEditing(true)}
              className="p-1.5 text-scada-muted hover:text-scada-accent transition-colors rounded-lg hover:bg-scada-dim">
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRemove}
              disabled={removing}
              className={`p-1.5 transition-colors rounded-lg ${confirmRemove ? 'text-scada-red bg-scada-red/10' : 'text-scada-muted hover:text-scada-red hover:bg-scada-red/10'}`}
              title={confirmRemove ? 'Click again to confirm' : 'Remove device'}
            >
              {removing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      <div className="rounded-lg px-3 py-2 font-mono text-xs text-scada-muted break-all"
        style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-scada-muted/60 mr-1">ID:</span>
        {device.device_id}
      </div>

      {confirmRemove && !removing && (
        <div className="flex items-center gap-2 bg-scada-red/10 border border-scada-red/30 rounded-lg px-3 py-2">
          <AlertCircle className="w-3.5 h-3.5 text-scada-red shrink-0" />
          <span className="font-mono text-[11px] text-scada-red flex-1">Click remove again to confirm</span>
          <button onClick={() => setConfirmRemove(false)} className="font-mono text-[11px] text-scada-muted hover:text-scada-text transition-colors">
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main DevicesPage ─────────────────────────────────────────────────────────
export default function DevicesPage() {
  const { devices, loading, error, claimDevice, removeDevice, renameDevice } = useDevices()
  const [showAdd, setShowAdd] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)

  async function handleAdd(deviceId, name) {
    const result = await claimDevice(deviceId, name)
    if (!result?.error) {
      setSuccessMsg(`Device "${name || deviceId.slice(-6)}" linked successfully!`)
      setTimeout(() => setSuccessMsg(null), 4000)
    }
    return result
  }

  if (DEMO_MODE) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <div className="bg-scada-panel border border-scada-border rounded-xl p-6 text-center space-y-2">
          <Cpu className="w-8 h-8 text-scada-muted mx-auto" />
          <div className="font-display text-xs font-bold tracking-widest text-scada-text">DEVICE MANAGEMENT</div>
          <p className="font-mono text-xs text-scada-muted">Device pairing is disabled in demo mode</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-display text-xs font-bold tracking-widest text-white">MY DEVICES</div>
          <div className="font-mono text-[10px] text-white/60 mt-0.5">
            {devices.length} device{devices.length !== 1 ? 's' : ''} linked
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg font-display text-xs font-bold tracking-wider transition-all hover:opacity-90"
          style={{ background: '#B94040', color: '#FBF7EF', boxShadow: '0 0 12px rgba(185,64,64,0.3)' }}
        >
          <Plus className="w-3.5 h-3.5" />
          ADD DEVICE
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 bg-scada-green/10 border border-scada-green/30 rounded-lg px-4 py-2.5">
          <CheckCircle className="w-4 h-4 text-scada-green shrink-0" />
          <span className="font-mono text-xs text-scada-green">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-scada-red/10 border border-scada-red/30 rounded-lg px-4 py-2.5">
          <AlertCircle className="w-4 h-4 text-scada-red shrink-0" />
          <span className="font-mono text-xs text-scada-red">{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-scada-accent animate-spin" />
        </div>
      )}

      {!loading && devices.length === 0 && (
        <div className="bg-scada-panel border border-dashed border-scada-border rounded-xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'rgba(185,64,64,0.1)', border: '1px solid rgba(185,64,64,0.2)' }}>
            <Cpu className="w-6 h-6 text-scada-accent/60" />
          </div>
          <div className="font-display text-xs font-bold tracking-widest text-scada-text">NO DEVICES LINKED</div>
          <p className="font-mono text-xs text-scada-muted leading-relaxed">
            Add your first device by scanning the QR code printed on your ESP32 board or enter the Device ID manually.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-display text-xs font-bold tracking-wider transition-all hover:opacity-90 mt-2"
            style={{ background: '#B94040', color: '#FBF7EF' }}
          >
            <Plus className="w-3.5 h-3.5" />
            ADD FIRST DEVICE
          </button>
        </div>
      )}

      {!loading && devices.length > 0 && (
        <div className="space-y-3">
          {devices.map(device => (
            <DeviceCard
              key={device.device_id}
              device={device}
              onRemove={removeDevice}
              onRename={renameDevice}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <AddDeviceModal
          onAdd={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  )
}
