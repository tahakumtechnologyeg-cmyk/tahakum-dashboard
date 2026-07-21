import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import AddOutputModal from './AddOutputModal'
import { I18nProvider } from '../i18n/I18nContext'

function renderWithI18n(ui) {
  return render(<I18nProvider>{ui}</I18nProvider>)
}

describe('AddOutputModal', () => {
  it('renders with name input and type buttons', () => {
    renderWithI18n(<AddOutputModal onClose={() => {}} onAdd={() => {}} />)
    expect(screen.getByPlaceholderText(/e\.g\. Main Pump/)).toBeInTheDocument()
    expect(screen.getByText('VFD')).toBeInTheDocument()
    expect(screen.getByText('Relay')).toBeInTheDocument()
    expect(screen.getByText('Motor')).toBeInTheDocument()
  })

  it('defaults type to relay', () => {
    renderWithI18n(<AddOutputModal onClose={() => {}} onAdd={() => {}} />)
    const relayBtn = screen.getByText('Relay')
    expect(relayBtn.className).toContain('border-primary')
  })

  it('changes selected type on click', () => {
    renderWithI18n(<AddOutputModal onClose={() => {}} onAdd={() => {}} />)
    fireEvent.click(screen.getByText('Motor'))
    const motorBtn = screen.getByText('Motor')
    expect(motorBtn.className).toContain('border-primary')
  })

  it('adds output with correct data', () => {
    const onAdd = vi.fn()
    renderWithI18n(<AddOutputModal onClose={() => {}} onAdd={onAdd} />)
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Main Pump/), { target: { value: 'Cooling Fan' } })
    fireEvent.click(screen.getByText('+ Add Output'))
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Cooling Fan',
      outputType: 'relay',
    }))
    expect(onAdd.mock.calls[0][0].id).toMatch(/^output_/)
  })

  it('adds output with VFD type', () => {
    const onAdd = vi.fn()
    renderWithI18n(<AddOutputModal onClose={() => {}} onAdd={onAdd} />)
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Main Pump/), { target: { value: 'Pump 1' } })
    fireEvent.click(screen.getByText('VFD'))
    fireEvent.click(screen.getByText('+ Add Output'))
    expect(onAdd).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Pump 1',
      outputType: 'vfd',
    }))
  })

  it('does not add output without name', () => {
    const onAdd = vi.fn()
    renderWithI18n(<AddOutputModal onClose={() => {}} onAdd={onAdd} />)
    fireEvent.click(screen.getByText('+ Add Output'))
    expect(onAdd).not.toHaveBeenCalled()
  })

  it('calls onClose and onAdd on submit', () => {
    const onAdd = vi.fn()
    const onClose = vi.fn()
    renderWithI18n(<AddOutputModal onClose={onClose} onAdd={onAdd} />)
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Main Pump/), { target: { value: 'Test' } })
    fireEvent.click(screen.getByText('+ Add Output'))
    expect(onAdd).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when overlay clicked', () => {
    const onClose = vi.fn()
    const { container } = renderWithI18n(<AddOutputModal onClose={onClose} onAdd={() => {}} />)
    fireEvent.click(container.firstChild)
    expect(onClose).toHaveBeenCalled()
  })
})
