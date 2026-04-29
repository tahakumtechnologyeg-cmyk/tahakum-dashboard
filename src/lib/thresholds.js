export const SENSORS = {
  TDS: {
    label: 'TDS',
    fullLabel: 'Total Dissolved Solids',
    unit: 'ppm',
    icon: 'Droplets',
    warningThreshold: 500,
    criticalThreshold: 700,
    min: 0,
    max: 1000,
    normalRange: [50, 450],
    description: 'Dissolved mineral concentration',
  },
  TEMPERATURE: {
    label: 'TEMP',
    fullLabel: 'Water Temperature',
    unit: '°C',
    icon: 'Thermometer',
    warningThreshold: 35,
    criticalThreshold: 40,
    min: 0,
    max: 50,
    normalRange: [10, 30],
    description: 'PT100 RTD sensor',
  },
  FLOW: {
    label: 'FLOW',
    fullLabel: 'Flow Rate',
    unit: 'L/min',
    icon: 'Gauge',
    warningThreshold: 100,
    criticalThreshold: 115,
    min: 0,
    max: 150,
    normalRange: [15, 90],
    description: 'Inline flow meter',
  },
  PRESSURE: {
    label: 'PRESS',
    fullLabel: 'Line Pressure',
    unit: 'bar',
    icon: 'Activity',
    warningThreshold: 6.0,
    criticalThreshold: 7.0,
    min: 0,
    max: 10,
    normalRange: [2.0, 5.5],
    description: 'Main line pressure',
  },
  DIFF_PRESSURE: {
    label: 'ΔP',
    fullLabel: 'Differential Pressure',
    unit: 'bar',
    icon: 'ArrowLeftRight',
    warningThreshold: 0.8,
    criticalThreshold: 1.0,
    min: 0,
    max: 1.5,
    normalRange: [0.05, 0.7],
    description: 'Filter ΔP — high = clogging',
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
