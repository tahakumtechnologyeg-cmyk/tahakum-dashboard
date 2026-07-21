import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'

const PRESET_SENSORS = [
  { id: 'NPK_NITROGEN',   label: 'Nitrogen (N)',       unit: 'mg/kg', min: 0, max: 1999 },
  { id: 'NPK_PHOSPHORUS', label: 'Phosphorus (P)',     unit: 'mg/kg', min: 0, max: 1999 },
  { id: 'NPK_POTASSIUM',  label: 'Potassium (K)',      unit: 'mg/kg', min: 0, max: 1999 },
  { id: 'PRESSURE',       label: 'Water Pressure',      unit: 'bar',   min: 0, max: 10   },
]

export default function AddSensorModal({ onClose, onAdd, existingIds }) {
  const { t, isRTL } = useI18n()
  const [mode, setMode] = useState('custom')
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('')
  const [rangeMin, setRangeMin] = useState('')
  const [rangeMax, setRangeMax] = useState('')

  const availablePresets = PRESET_SENSORS.filter(p => !existingIds?.includes(p.id))

  function handleAddCustom(e) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      builtIn: false,
      name: name.trim(),
      unit: unit.trim() || '-',
      min: parseFloat(rangeMin) || 0,
      max: parseFloat(rangeMax) || 100,
    })
    onClose()
  }

  function handleAddPreset(preset) {
    onAdd({ ...preset, builtIn: true })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div className="w-full max-w-sm bg-scada-panel border border-scada-border rounded-2xl shadow-2xl animate-scaleIn"
        onClick={e => e.stopPropagation()} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-scada-border">
          <h3 className="font-mono text-sm font-bold tracking-widest text-scada-text">{t('dashboard.addSensorTitle')}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-scada-muted hover:text-scada-text hover:bg-scada-dim transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex mx-5 mt-4 gap-1 bg-scada-bg rounded-lg p-1 border border-scada-border">
          <button onClick={() => setMode('custom')}
            className={`flex-1 py-1.5 rounded-md font-mono text-[10px] font-bold tracking-wider transition-all ${
              mode === 'custom' ? 'bg-scada-panel text-scada-text shadow-sm' : 'text-scada-muted hover:text-scada-text'
            }`}>
            CUSTOM
          </button>
          <button onClick={() => setMode('preset')}
            className={`flex-1 py-1.5 rounded-md font-mono text-[10px] font-bold tracking-wider transition-all ${
              mode === 'preset' ? 'bg-scada-panel text-scada-text shadow-sm' : 'text-scada-muted hover:text-scada-text'
            }`}>
            PRESET
          </button>
        </div>

        {mode === 'custom' ? (
          <form onSubmit={handleAddCustom} className="p-5 space-y-4">
            <div>
              <label className="block font-mono text-xs font-bold tracking-widest text-scada-text mb-1.5">{t('dashboard.sensorName')}</label>
              <input autoFocus value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Temperature, pH, Flow..."
                className="w-full px-3 py-2 rounded-xl bg-scada-bg border border-scada-border font-mono text-sm text-scada-text placeholder:text-scada-muted/40 outline-none focus:border-primary transition-colors" dir="auto" />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold tracking-widest text-scada-text mb-1.5">{t('dashboard.sensorUnit')}</label>
              <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="e.g. °C, pH, L/min..."
                className="w-full px-3 py-2 rounded-xl bg-scada-bg border border-scada-border font-mono text-sm text-scada-text placeholder:text-scada-muted/40 outline-none focus:border-primary transition-colors" dir="auto" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-xs font-bold tracking-widest text-scada-text mb-1.5">{t('dashboard.sensorRangeMin')}</label>
                <input type="number" value={rangeMin} onChange={e => setRangeMin(e.target.value)} placeholder="0"
                  className="w-full px-3 py-2 rounded-xl bg-scada-bg border border-scada-border font-mono text-sm text-scada-text placeholder:text-scada-muted/40 outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold tracking-widest text-scada-text mb-1.5">{t('dashboard.sensorRangeMax')}</label>
                <input type="number" value={rangeMax} onChange={e => setRangeMax(e.target.value)} placeholder="100"
                  className="w-full px-3 py-2 rounded-xl bg-scada-bg border border-scada-border font-mono text-sm text-scada-text placeholder:text-scada-muted/40 outline-none focus:border-primary transition-colors" />
              </div>
            </div>
            <button type="submit"
              className="w-full px-4 py-2.5 rounded-xl font-mono text-xs font-bold tracking-widest text-white transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)' }}>
              {t('dashboard.addSensor')}
            </button>
          </form>
        ) : (
          <div className="p-5 space-y-2">
            <p className="font-mono text-[10px] text-scada-muted tracking-widest mb-2">AVAILABLE PRESETS</p>
            {availablePresets.length === 0 ? (
              <p className="font-mono text-xs text-scada-muted text-center py-6">All presets are already added.</p>
            ) : (
              availablePresets.map(p => (
                <button key={p.id} onClick={() => handleAddPreset(p)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-scada-bg border border-scada-border hover:border-primary/40 hover:bg-primary/5 transition-all">
                  <div className="text-left">
                    <div className="font-display text-xs font-bold text-scada-text">{p.label}</div>
                    <div className="font-mono text-[10px] text-scada-muted">{p.min}–{p.max} {p.unit}</div>
                  </div>
                  <Plus size={14} className="text-scada-muted shrink-0" />
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
