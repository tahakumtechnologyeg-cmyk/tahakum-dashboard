import { useState } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'

export default function AddSensorModal({ onClose, onAdd }) {
  const { t, isRTL } = useI18n()
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('')
  const [rangeMin, setRangeMin] = useState('')
  const [rangeMax, setRangeMax] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      unit: unit.trim() || '-',
      rangeMin: parseFloat(rangeMin) || 0,
      rangeMax: parseFloat(rangeMax) || 100,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-scada-panel border border-scada-border rounded-2xl shadow-2xl animate-scaleIn"
        onClick={e => e.stopPropagation()}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-scada-border">
          <h3 className="font-mono text-sm font-bold tracking-widest text-scada-text">
            {t('dashboard.addSensorTitle')}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-scada-muted hover:text-scada-text hover:bg-scada-dim transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block font-mono text-xs font-bold tracking-widest text-scada-text mb-1.5">
              {t('dashboard.sensorName')}
            </label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Temperature, pH, Flow..."
              className="w-full px-3 py-2 rounded-xl bg-scada-bg border border-scada-border font-mono text-sm text-scada-text placeholder:text-scada-muted/40 outline-none focus:border-primary transition-colors"
              dir="auto"
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-bold tracking-widest text-scada-text mb-1.5">
              {t('dashboard.sensorUnit')}
            </label>
            <input
              value={unit}
              onChange={e => setUnit(e.target.value)}
              placeholder="e.g. °C, pH, L/min..."
              className="w-full px-3 py-2 rounded-xl bg-scada-bg border border-scada-border font-mono text-sm text-scada-text placeholder:text-scada-muted/40 outline-none focus:border-primary transition-colors"
              dir="auto"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-xs font-bold tracking-widest text-scada-text mb-1.5">
                {t('dashboard.sensorRangeMin')}
              </label>
              <input
                type="number"
                value={rangeMin}
                onChange={e => setRangeMin(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl bg-scada-bg border border-scada-border font-mono text-sm text-scada-text placeholder:text-scada-muted/40 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold tracking-widest text-scada-text mb-1.5">
                {t('dashboard.sensorRangeMax')}
              </label>
              <input
                type="number"
                value={rangeMax}
                onChange={e => setRangeMax(e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 rounded-xl bg-scada-bg border border-scada-border font-mono text-sm text-scada-text placeholder:text-scada-muted/40 outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl font-mono text-xs font-bold tracking-widest text-scada-muted border border-scada-border hover:bg-scada-dim transition-colors"
            >
              {t('support.contact')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl font-mono text-xs font-bold tracking-widest text-white transition-all hover:opacity-90"
              style={{ background: 'var(--color-primary)' }}
            >
              {t('dashboard.addSensor')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
