import { useState } from 'react'
import { X } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'

const OUTPUT_TYPES = ['vfd', 'relay', 'contactor', 'led', 'motor', 'valve', 'other']

export default function AddOutputModal({ onClose, onAdd }) {
  const { t, isRTL } = useI18n()
  const [name, setName] = useState('')
  const [type, setType] = useState('relay')

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({
      id: `output_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      type,
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
            {t('dashboard.addOutputTitle')}
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
              {t('dashboard.outputName')}
            </label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Main Pump, Valve #3..."
              className="w-full px-3 py-2 rounded-xl bg-scada-bg border border-scada-border font-mono text-sm text-scada-text placeholder:text-scada-muted/40 outline-none focus:border-primary transition-colors"
              dir="auto"
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-bold tracking-widest text-scada-text mb-1.5">
              {t('dashboard.outputType')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {OUTPUT_TYPES.map(ot => (
                <button
                  key={ot}
                  type="button"
                  onClick={() => setType(ot)}
                  className={`px-3 py-2 rounded-xl font-mono text-xs font-bold tracking-wider border transition-all ${
                    type === ot
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-scada-border text-scada-muted hover:text-scada-text hover:bg-scada-dim'
                  }`}
                >
                  {t(`dashboard.outputType${ot.charAt(0).toUpperCase() + ot.slice(1)}`)}
                </button>
              ))}
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
              {t('dashboard.addOutput')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
