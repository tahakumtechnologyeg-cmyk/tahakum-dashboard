import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nProvider } from '../i18n/I18nContext'
import AddSensorModal from './AddSensorModal'

function renderWithI18n(ui) {
  return render(<I18nProvider>{ui}</I18nProvider>)
}

describe('AddSensorModal', () => {
  it('renders in custom mode by default', () => {
    renderWithI18n(<AddSensorModal onClose={() => {}} onAdd={() => {}} existingIds={[]} />)
    expect(screen.getByText('CUSTOM')).toBeInTheDocument()
    expect(screen.getByText('PRESET')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/e\.g\. Temperature/)).toBeInTheDocument()
  })

  it('switches to preset mode', () => {
    renderWithI18n(<AddSensorModal onClose={() => {}} onAdd={() => {}} existingIds={[]} />)
    fireEvent.click(screen.getByText('PRESET'))
    expect(screen.getByText('AVAILABLE PRESETS')).toBeInTheDocument()
  })

  it('shows all presets when none exist', () => {
    renderWithI18n(<AddSensorModal onClose={() => {}} onAdd={() => {}} existingIds={[]} />)
    fireEvent.click(screen.getByText('PRESET'))
    expect(screen.getByText('Nitrogen (N)')).toBeInTheDocument()
    expect(screen.getByText('Phosphorus (P)')).toBeInTheDocument()
    expect(screen.getByText('Potassium (K)')).toBeInTheDocument()
    expect(screen.getByText('Water Pressure')).toBeInTheDocument()
  })

  it('hides presets that are already added', () => {
    renderWithI18n(<AddSensorModal onClose={() => {}} onAdd={() => {}} existingIds={['NPK_NITROGEN', 'PRESSURE']} />)
    fireEvent.click(screen.getByText('PRESET'))
    expect(screen.queryByText('Nitrogen (N)')).not.toBeInTheDocument()
    expect(screen.queryByText('Water Pressure')).not.toBeInTheDocument()
    expect(screen.getByText('Phosphorus (P)')).toBeInTheDocument()
    expect(screen.getByText('Potassium (K)')).toBeInTheDocument()
  })

  it('shows empty state when all presets added', () => {
    renderWithI18n(<AddSensorModal onClose={() => {}} onAdd={() => {}} existingIds={['NPK_NITROGEN', 'NPK_PHOSPHORUS', 'NPK_POTASSIUM', 'PRESSURE']} />)
    fireEvent.click(screen.getByText('PRESET'))
    expect(screen.getByText(/All presets are already added/)).toBeInTheDocument()
  })

  it('adds a preset sensor', () => {
    const onAdd = vi.fn()
    renderWithI18n(<AddSensorModal onClose={() => {}} onAdd={onAdd} existingIds={[]} />)
    fireEvent.click(screen.getByText('PRESET'))
    fireEvent.click(screen.getByText('Water Pressure'))
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ id: 'PRESSURE', builtIn: true }))
  })

  it('adds a custom sensor', () => {
    const onAdd = vi.fn()
    renderWithI18n(<AddSensorModal onClose={() => {}} onAdd={onAdd} existingIds={[]} />)
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Temperature/), { target: { value: 'pH Meter' } })
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. °C/), { target: { value: 'pH' } })
    fireEvent.click(screen.getByText('+ Add Sensor'))
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({ name: 'pH Meter', unit: 'pH' }))
  })

  it('does not add custom sensor without name', () => {
    const onAdd = vi.fn()
    renderWithI18n(<AddSensorModal onClose={() => {}} onAdd={onAdd} existingIds={[]} />)
    fireEvent.click(screen.getByText('+ Add Sensor'))
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('calls onClose when overlay clicked', () => {
    const onClose = vi.fn()
    const { container } = renderWithI18n(<AddSensorModal onClose={onClose} onAdd={() => {}} existingIds={[]} />)
    const overlay = container.querySelector('[class*="fixed"]')
    fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when X button clicked', () => {
    const onClose = vi.fn()
    renderWithI18n(<AddSensorModal onClose={onClose} onAdd={() => {}} existingIds={[]} />)
    const xButtons = screen.getAllByRole('button')
    const xBtn = xButtons.find(b => b.querySelector('svg'))
    fireEvent.click(xBtn)
    expect(onClose).toHaveBeenCalled()
  })
})
