import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { I18nProvider } from '../i18n/I18nContext'
import OutputCard from './OutputCard'

function renderWithI18n(ui) {
  return render(<I18nProvider>{ui}</I18nProvider>)
}

const defaultOutput = { id: 'pump_vfd', builtIn: true, outputType: 'vfd', name: 'Water Pump' }
const customOutput = { id: 'custom_1', builtIn: false, outputType: 'relay', name: 'Cooling Fan' }
const motorOutput = { id: 'motor_1', builtIn: false, outputType: 'motor', name: 'Conveyor Motor' }
const valveOutput = { id: 'valve_1', builtIn: false, outputType: 'valve', name: 'Solenoid Valve' }

describe('OutputCard', () => {
  it('renders VFD output with name and type', () => {
    renderWithI18n(<OutputCard output={defaultOutput} onDelete={() => {}} />)
    expect(screen.getByText('Water Pump')).toBeInTheDocument()
    expect(screen.getAllByText('VFD').length).toBeGreaterThanOrEqual(1)
  })

  it('shows VFD type label from translation', () => {
    renderWithI18n(<OutputCard output={defaultOutput} onDelete={() => {}} />)
    expect(screen.getAllByText('VFD').length).toBeGreaterThanOrEqual(1)
  })

  it('shows relay type label for relay outputs', () => {
    renderWithI18n(<OutputCard output={customOutput} onDelete={() => {}} />)
    expect(screen.getByText('RELAY')).toBeInTheDocument()
  })

  it('toggles power on/off when clicking power button', () => {
    renderWithI18n(<OutputCard output={defaultOutput} onDelete={() => {}} />)
    const powerBtn = document.querySelector('[class*="w-12 h-12 rounded-full"]')
    fireEvent.click(powerBtn)
    expect(screen.getByText('ON')).toBeInTheDocument()
    fireEvent.click(powerBtn)
    expect(screen.getByText('OFF')).toBeInTheDocument()
  })

  it('shows speed slider for VFD', () => {
    renderWithI18n(<OutputCard output={defaultOutput} onDelete={() => {}} />)
    expect(screen.getByText('Hz')).toBeInTheDocument()
    const sliders = screen.getAllByDisplayValue('25')
    expect(sliders.length).toBeGreaterThanOrEqual(1)
  })

  it('shows speed slider for motor', () => {
    renderWithI18n(<OutputCard output={motorOutput} onDelete={() => {}} />)
    expect(screen.getByText('Hz')).toBeInTheDocument()
  })

  it('does not show speed slider for relay', () => {
    renderWithI18n(<OutputCard output={customOutput} onDelete={() => {}} />)
    expect(screen.queryByText('Hz')).not.toBeInTheDocument()
  })

  it('does not show speed slider for valve', () => {
    renderWithI18n(<OutputCard output={valveOutput} onDelete={() => {}} />)
    expect(screen.queryByText('Hz')).not.toBeInTheDocument()
  })

  it('shows direction buttons for motor', () => {
    renderWithI18n(<OutputCard output={motorOutput} onDelete={() => {}} />)
    expect(screen.getByText('FWD')).toBeInTheDocument()
    expect(screen.getByText('REV')).toBeInTheDocument()
  })

  it('shows direction buttons for VFD', () => {
    renderWithI18n(<OutputCard output={defaultOutput} onDelete={() => {}} />)
    expect(screen.getByText('FWD')).toBeInTheDocument()
    expect(screen.getByText('REV')).toBeInTheDocument()
  })

  it('does not show direction for relay', () => {
    renderWithI18n(<OutputCard output={customOutput} onDelete={() => {}} />)
    expect(screen.queryByText('FWD')).not.toBeInTheDocument()
    expect(screen.queryByText('REV')).not.toBeInTheDocument()
  })

  it('shows consumption for VFD', () => {
    renderWithI18n(<OutputCard output={defaultOutput} onDelete={() => {}} />)
    expect(screen.getByText('Daily')).toBeInTheDocument()
    expect(screen.getByText('Weekly')).toBeInTheDocument()
    expect(screen.getByText('Monthly')).toBeInTheDocument()
  })

  it('shows consumption for motor', () => {
    renderWithI18n(<OutputCard output={motorOutput} onDelete={() => {}} />)
    expect(screen.getByText('Daily')).toBeInTheDocument()
  })

  it('does NOT show consumption for relay', () => {
    renderWithI18n(<OutputCard output={customOutput} onDelete={() => {}} />)
    expect(screen.queryByText('Daily')).not.toBeInTheDocument()
    expect(screen.queryByText('Weekly')).not.toBeInTheDocument()
    expect(screen.queryByText('Monthly')).not.toBeInTheDocument()
  })

  it('does NOT show consumption for valve', () => {
    renderWithI18n(<OutputCard output={valveOutput} onDelete={() => {}} />)
    expect(screen.queryByText('Daily')).not.toBeInTheDocument()
  })

  it('shows delete button for all outputs', () => {
    renderWithI18n(<OutputCard output={defaultOutput} onDelete={() => {}} />)
    expect(document.querySelector('[title="Delete"]')).toBeInTheDocument()
  })

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn()
    renderWithI18n(<OutputCard output={customOutput} onDelete={onDelete} />)
    fireEvent.click(document.querySelector('[title="Delete"]'))
    expect(onDelete).toHaveBeenCalledWith('custom_1')
  })

  it('starts with power OFF', () => {
    renderWithI18n(<OutputCard output={defaultOutput} onDelete={() => {}} />)
    expect(screen.getByText('OFF')).toBeInTheDocument()
  })

  it('speed slider starts at 25 for VFD', () => {
    renderWithI18n(<OutputCard output={defaultOutput} onDelete={() => {}} />)
    const slider = document.querySelector('input[type="range"]')
    expect(slider.value).toBe('25')
  })

  it('speed slider starts at 0 for motor', () => {
    renderWithI18n(<OutputCard output={motorOutput} onDelete={() => {}} />)
    const slider = document.querySelector('input[type="range"]')
    expect(slider.value).toBe('0')
  })
})
