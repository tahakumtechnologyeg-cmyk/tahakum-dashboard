import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Dashboard from '../pages/Dashboard'

// Wrap Dashboard with required providers
vi.mock('../i18n/I18nContext', () => ({
  useI18n: () => ({
    t: (key) => {
      const map = {
        'dashboard.title': 'SCADA Dashboard',
        'dashboard.sensors': 'SENSOR OVERVIEW',
        'dashboard.sensorsSub': 'Real-time monitoring',
        'dashboard.trends': 'TREND ANALYSIS',
        'dashboard.trendsSub': 'Live time-series data',
        'dashboard.control': 'OUTPUT CONTROL PANEL',
        'dashboard.energy': 'ENERGY TRACKING',
        'dashboard.energySub': 'Pump consumption data',
        'dashboard.devices': 'MY DEVICES',
        'dashboard.devicesSub': 'Link and manage',
        'dashboard.ota': 'FIRMWARE UPDATE',
        'dashboard.otaSub': 'OTA',
        'dashboard.notifications': 'NOTIFICATIONS',
        'dashboard.notificationsSub': 'Sensor alerts',
        'dashboard.support': 'SUPPORT',
        'dashboard.supportSub': 'Get help',
        'dashboard.profile': 'PROFILE',
        'dashboard.profileSub': 'Manage',
        'dashboard.noDevice': 'NO DEVICE LINKED',
        'dashboard.noDeviceDesc': 'Link your ESP32',
        'dashboard.addDevice': '+ ADD DEVICE',
        'dashboard.addSensor': '+ Add Sensor',
        'dashboard.addSensorTitle': 'Add Custom Sensor',
        'dashboard.sensorName': 'Sensor Name',
        'dashboard.sensorUnit': 'Unit',
        'dashboard.sensorRangeMin': 'Range Min',
        'dashboard.sensorRangeMax': 'Range Max',
        'dashboard.deleteSensor': 'Delete',
        'dashboard.deleteConfirm': 'Delete this sensor?',
        'dashboard.customSensor': 'Custom Sensor',
        'dashboard.noCustomSensors': 'No sensors added yet',
        'dashboard.consumption': 'Consumption',
        'dashboard.daily': 'Daily',
        'dashboard.weekly': 'Weekly',
        'dashboard.monthly': 'Monthly',
        'dashboard.powerOn': 'ON',
        'dashboard.powerOff': 'OFF',
        'dashboard.forward': 'FWD',
        'dashboard.reverse': 'REV',
        'dashboard.speed': 'Speed',
        'dashboard.noTrendData': 'No historical data',
        'dashboard.defaultValue': 'Value',
        'dashboard.addOutput': '+ Add Output',
        'dashboard.addOutputTitle': 'Add Output Device',
        'dashboard.outputName': 'Device Name',
        'dashboard.outputType': 'Device Type',
        'dashboard.outputTypeVfd': 'VFD',
        'dashboard.outputTypeRelay': 'Relay',
        'dashboard.outputTypeContactor': 'Contactor',
        'dashboard.outputTypeLed': 'LED',
        'dashboard.outputTypeMotor': 'Motor',
        'dashboard.outputTypeValve': 'Valve',
        'dashboard.outputTypeOther': 'Other',
        'dashboard.deleteOutput': 'Delete',
        'dashboard.deleteOutputConfirm': 'Delete this output device?',
        'dashboard.customOutput': 'Output Device',
        'dashboard.noCustomOutputs': 'No output devices added yet',
        'nav.sensors': 'Sensor Overview',
        'nav.charts': 'Trend Analysis',
        'nav.control': 'Output Control',
        'nav.energy': 'Energy Tracking',
        'nav.devices': 'My Devices',
        'nav.ota': 'Firmware Update',
        'nav.notifications': 'Notifications',
        'nav.support': 'Support',
        'nav.profile': 'Profile',
        'nav.menu': 'MENU',
        'nav.signOut': 'Sign Out',
        'common.menu': 'Menu',
      }
      return map[key] || key
    },
    lang: 'en',
    toggleLang: () => {},
    isRTL: false,
  }),
  I18nProvider: ({ children }) => <>{children}</>,
}))

// Mock all external hooks
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user', email: 'admin@test.com' },
    signOut: vi.fn(),
    loading: false,
  }),
  AuthProvider: ({ children }) => <>{children}</>,
}))

vi.mock('../hooks/useTelemetry', () => ({
  useTelemetry: () => ({
    latest: {
      PRESSURE: { value: 3.5, created_at: new Date().toISOString() },
      NPK_NITROGEN: { value: 750, created_at: new Date().toISOString() },
      NPK_PHOSPHORUS: { value: 400, created_at: new Date().toISOString() },
      NPK_POTASSIUM: { value: 600, created_at: new Date().toISOString() },
    },
    history: {
      PRESSURE: Array.from({ length: 10 }, (_, i) => ({ time: new Date(Date.now() - i * 5000).toISOString(), value: 3 + Math.random() })),
      NPK_NITROGEN: Array.from({ length: 10 }, (_, i) => ({ time: new Date(Date.now() - i * 5000).toISOString(), value: 700 + Math.random() * 100 })),
    },
    connected: true,
    hasDevices: true,
  }),
}))

vi.mock('../hooks/useDevices', () => ({
  useDevices: () => ({
    devices: [{ device_id: 'esp32-001', name: 'ESP32-001' }],
    loading: false,
  }),
}))

vi.mock('../hooks/useControls', () => ({
  useControls: () => ({
    controls: { status: true, speed: 30, direction: 'forward' },
  }),
}))

vi.mock('../hooks/useDashboardConfig', () => ({
  useDashboardConfig: () => ({
    sensors: [
      { id: 'NPK_NITROGEN',   builtIn: true, label: 'Nitrogen (N)',       unit: 'mg/kg', min: 0, max: 1999 },
      { id: 'NPK_PHOSPHORUS', builtIn: true, label: 'Phosphorus (P)',     unit: 'mg/kg', min: 0, max: 1999 },
      { id: 'NPK_POTASSIUM',  builtIn: true, label: 'Potassium (K)',      unit: 'mg/kg', min: 0, max: 1999 },
      { id: 'PRESSURE',       builtIn: true, label: 'Water Pressure',      unit: 'bar',   min: 0, max: 10   },
    ],
    outputs: [
      { id: 'pump_vfd', builtIn: true, outputType: 'vfd', name: 'Water Pump' },
    ],
    loading: false,
    addSensor: vi.fn(),
    deleteSensor: vi.fn(),
    addOutput: vi.fn(),
    deleteOutput: vi.fn(),
  }),
}))

vi.mock('../lib/gsheet', () => ({
  readAll: () => Promise.resolve([]),
  readOne: () => Promise.resolve(null),
  insertRow: vi.fn(),
  updateRow: vi.fn(),
  deleteRow: vi.fn(),
}))

vi.mock('../lib/demo', () => ({
  DEMO_MODE: false,
}))

vi.mock('../lib/dashboard', () => ({
  fetchCustomSensors: () => Promise.resolve([]),
  addCustomSensor: vi.fn(),
  deleteCustomSensor: vi.fn(),
  fetchCustomOutputs: () => Promise.resolve([]),
  addCustomOutput: vi.fn(),
  deleteCustomOutput: vi.fn(),
}))

// Mock child components to avoid rendering issues
vi.mock('../components/LiveChart', () => ({ default: () => <div>LiveChart</div> }))
vi.mock('../components/PowerStats', () => ({ default: () => <div>PowerStats</div> }))
vi.mock('../components/DevicesPage', () => ({ default: () => <div>DevicesPage</div> }))
vi.mock('../components/OtaPage', () => ({ default: () => <div>OtaPage</div> }))
vi.mock('../components/SupportPage', () => ({ default: () => <div>SupportPage</div> }))
vi.mock('../components/ProfilePage', () => ({ default: () => <div>ProfilePage</div> }))
vi.mock('../components/AlertsPanel', () => ({ default: () => <div>AlertsPanel</div> }))

// Mock ThemeContext
vi.mock('../ThemeContext', () => ({
  useThemeContext: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
  ThemeProvider: ({ children }) => <>{children}</>,
}))

describe('Dashboard Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the header with brand name', () => {
    render(<Dashboard />)
    expect(screen.getByText('TAHAKUM TECHNOLOGY')).toBeInTheDocument()
  })

  it('shows sensor overview tab by default', () => {
    render(<Dashboard />)
    expect(screen.getByText('SENSOR OVERVIEW')).toBeInTheDocument()
  })

  it('renders all 4 default sensor cards', () => {
    render(<Dashboard />)
    expect(screen.getByText('PRES')).toBeInTheDocument()
    expect(screen.getByText('N')).toBeInTheDocument()
    expect(screen.getByText('P')).toBeInTheDocument()
    expect(screen.getByText('K')).toBeInTheDocument()
  })

  it('shows live sensor values', () => {
    render(<Dashboard />)
    expect(screen.getByText('3.500')).toBeInTheDocument()
    expect(screen.getByText('750.0')).toBeInTheDocument()
  })

  it('switches to charts tab when clicked', async () => {
    render(<Dashboard />)
    fireEvent.click(screen.getByText('Trend Analysis'))
    expect(await screen.findByText('TREND ANALYSIS')).toBeInTheDocument()
  })

  it('switches to control tab', async () => {
    render(<Dashboard />)
    fireEvent.click(screen.getByText('Output Control'))
    expect(await screen.findByText('OUTPUT CONTROL PANEL')).toBeInTheDocument()
  })

  it('renders output card on control tab', async () => {
    render(<Dashboard />)
    fireEvent.click(screen.getByText('Output Control'))
    expect(await screen.findByText('Water Pump')).toBeInTheDocument()
    expect(screen.getAllByText('VFD').length).toBeGreaterThanOrEqual(1)
  })

  it('switches to notifications tab', async () => {
    render(<Dashboard />)
    fireEvent.click(screen.getByText('Notifications'))
    expect(await screen.findByText('NOTIFICATION CENTER')).toBeInTheDocument()
  })

  it('switches to devices tab', async () => {
    render(<Dashboard />)
    fireEvent.click(screen.getByText('My Devices'))
    expect(await screen.findByText('MY DEVICES')).toBeInTheDocument()
  })

  it('switches to profile tab', async () => {
    render(<Dashboard />)
    fireEvent.click(screen.getByText('Profile'))
    expect(await screen.findByText('PROFILE')).toBeInTheDocument()
  })

  it('toggles drawer menu', () => {
    render(<Dashboard />)
    const menuBtn = document.querySelector('header button')
    fireEvent.click(menuBtn)
    // Drawer should show menu text
    expect(screen.getByText('MENU')).toBeInTheDocument()
  })

  it('opens drawer and navigates to energy tab', async () => {
    render(<Dashboard />)
    const menuBtn = document.querySelector('header button')
    fireEvent.click(menuBtn)
    fireEvent.click(screen.getByText('Energy Tracking'))
    expect(await screen.findByText('ENERGY TRACKING')).toBeInTheDocument()
  })

  it('add sensor modal opens and can add custom sensor', async () => {
    render(<Dashboard />)
    fireEvent.click(screen.getByText('+ Add Sensor'))
    expect(screen.getByText('Add Custom Sensor')).toBeInTheDocument()

    const input = screen.getByPlaceholderText(/e\.g\. Temperature/)
    await userEvent.type(input, 'Temperature')
    const submitBtns = screen.getAllByText('+ Add Sensor')
    fireEvent.click(submitBtns[submitBtns.length - 1])
    // Modal should close after add
    await waitFor(() => {
      expect(screen.queryByText('Add Custom Sensor')).not.toBeInTheDocument()
    })
  })

  it('add output modal opens on control tab', async () => {
    render(<Dashboard />)
    fireEvent.click(screen.getByText('Output Control'))
    expect(await screen.findByText('+ Add Output'))
    fireEvent.click(screen.getByText('+ Add Output'))
    expect(screen.getByText('Add Output Device')).toBeInTheDocument()
  })

  it('shows delete buttons on sensor cards', () => {
    render(<Dashboard />)
    const deleteBtns = document.querySelectorAll('[class*="group-hover:opacity-100"]')
    expect(deleteBtns.length).toBeGreaterThanOrEqual(4)
  })
})
