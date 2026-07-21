import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SensorCard from './SensorCard'

function makeData(value) {
  return { value, created_at: '2026-07-21T10:00:00Z' }
}

describe('SensorCard', () => {
  it('returns null for unknown sensor type', () => {
    const { container } = render(<SensorCard sensorType="UNKNOWN" data={makeData(5)} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders Nitrogen sensor with label and value', () => {
    render(<SensorCard sensorType="NPK_NITROGEN" data={makeData(750)} />)
    expect(screen.getByText('N')).toBeInTheDocument()
    expect(screen.getByText('mg/kg')).toBeInTheDocument()
    expect(screen.getByText('750.0')).toBeInTheDocument()
  })

  it('renders Pressure sensor with value', () => {
    render(<SensorCard sensorType="PRESSURE" data={makeData(3.5)} />)
    expect(screen.getByText('PRES')).toBeInTheDocument()
    expect(screen.getByText('bar')).toBeInTheDocument()
    expect(screen.getByText('3.500')).toBeInTheDocument()
  })

  it('shows dash when value is null', () => {
    render(<SensorCard sensorType="PRESSURE" data={makeData(null)} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows dash when data is undefined', () => {
    render(<SensorCard sensorType="PRESSURE" data={undefined} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows normal status color for safe values', () => {
    render(<SensorCard sensorType="PRESSURE" data={makeData(3)} />)
    expect(screen.getByText('NORMAL')).toBeInTheDocument()
  })

  it('shows warning status for elevated values', () => {
    render(<SensorCard sensorType="PRESSURE" data={makeData(8)} />)
    expect(screen.getByText('WARNING')).toBeInTheDocument()
  })

  it('shows critical status for out-of-range values', () => {
    render(<SensorCard sensorType="PRESSURE" data={makeData(10)} />)
    expect(screen.getByText('CRITICAL')).toBeInTheDocument()
  })

  it('shows NPK critical alert for NPK sensors in critical', () => {
    render(<SensorCard sensorType="NPK_NITROGEN" data={makeData(1900)} />)
    expect(screen.getByText(/CRITICAL.*SOIL/)).toBeInTheDocument()
  })

  it('displays timestamp when created_at is present', () => {
    render(<SensorCard sensorType="PRESSURE" data={makeData(3)} />)
    expect(screen.getByText(/:00/)).toBeInTheDocument()
  })

  it('renders Potassium sensor with correct icon', () => {
    const { container } = render(<SensorCard sensorType="NPK_POTASSIUM" data={makeData(500)} />)
    expect(screen.getByText('K')).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders Phosphorus sensor', () => {
    render(<SensorCard sensorType="NPK_PHOSPHORUS" data={makeData(300)} />)
    expect(screen.getByText('P')).toBeInTheDocument()
  })

  it('formats small values with 3 decimal places', () => {
    render(<SensorCard sensorType="PRESSURE" data={makeData(5.123)} />)
    expect(screen.getByText('5.123')).toBeInTheDocument()
  })

  it('formats medium values with 2 decimal places', () => {
    render(<SensorCard sensorType="NPK_NITROGEN" data={makeData(50.5)} />)
    expect(screen.getByText('50.50')).toBeInTheDocument()
  })

  it('formats large values with 1 decimal place', () => {
    render(<SensorCard sensorType="NPK_NITROGEN" data={makeData(500)} />)
    expect(screen.getByText('500.0')).toBeInTheDocument()
  })
})
