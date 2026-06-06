export const SENSORS = {
  NPK_NITROGEN: {
    label: 'N',
    fullLabel: 'Nitrogen Content',
    unit: 'mg/kg',
    icon: 'Leaf',
    warningThreshold: 1500,
    criticalThreshold: 1800,
    min: 0,
    max: 1999,
    normalRange: [100, 1200],
    description: 'Soil nitrogen level',
  },
  NPK_PHOSPHORUS: {
    label: 'P',
    fullLabel: 'Phosphorus Content',
    unit: 'mg/kg',
    icon: 'Sprout',
    warningThreshold: 1500,
    criticalThreshold: 1800,
    min: 0,
    max: 1999,
    normalRange: [50, 1000],
    description: 'Soil phosphorus level',
  },
  NPK_POTASSIUM: {
    label: 'K',
    fullLabel: 'Potassium Content',
    unit: 'mg/kg',
    icon: 'Flower2',
    warningThreshold: 1500,
    criticalThreshold: 1800,
    min: 0,
    max: 1999,
    normalRange: [80, 1100],
    description: 'Soil potassium level',
  },
}

export function getSensorStatus(sensorType, value) {
  const cfg = SENSORS[sensorType]
  if (!cfg || value === null || value === undefined) return 'unknown'
  if (value >= cfg.criticalThreshold) return 'critical'
  if (value >= cfg.warningThreshold) return 'warning'
  return 'normal'
}

export const STATUS_COLORS = {
  normal: { text: 'text-scada-green', border: 'border-scada-green/40', bg: 'bg-scada-green/10', glow: '0 0 12px rgba(0,255,136,0.4)' },
  warning: { text: 'text-scada-amber', border: 'border-scada-amber/40', bg: 'bg-scada-amber/10', glow: '0 0 12px rgba(255,184,0,0.4)' },
  critical: { text: 'text-scada-red', border: 'border-scada-red/50', bg: 'bg-scada-red/10', glow: '0 0 16px rgba(255,59,59,0.5)' },
  unknown: { text: 'text-scada-muted', border: 'border-scada-muted/30', bg: 'bg-scada-dim/20', glow: 'none' },
}
