import { useState, useRef, useEffect } from 'react'
import { User, Mail, Phone, Camera, Save, AlertCircle, CheckCircle, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { readAll, insertRow, updateRow } from '../lib/gsheet'
import { DEMO_MODE } from '../lib/demo'

export default function ProfilePage() {
  const { user } = useAuth()
  const fileInputRef = useRef(null)

  const [avatarUrl, setAvatarUrl] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [pendingFile, setPendingFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    full_name: '',
    username: '',
    phone: '',
    email: user?.email || '',
  })

  const [pwForm, setPwForm] = useState({ newPassword: '', confirmPassword: '' })
  const [showPw, setShowPw] = useState(false)
  const [pwOpen, setPwOpen] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [msg, setMsg] = useState(null)
  const [pwMsg, setPwMsg] = useState(null)

  useEffect(() => {
    if (DEMO_MODE || !user) return
    async function load() {
      try {
        const data = await readAll('profiles', { filters: { id: user.id }, single: true })
        if (data && !data.error) {
          setForm(f => ({
            ...f,
            full_name: data.full_name || '',
            username: data.username || '',
            phone: data.phone || '',
            email: data.email || user.email || '',
          }))
          if (data.avatar_url) setAvatarUrl(data.avatar_url)
        }
      } catch (e) {
        console.error('Profile load error:', e)
      }
    }
    load()
  }, [user])

  function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setMsg({ type: 'err', text: 'Image must be under 2 MB' })
      return
    }
    setPendingFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSaveProfile(e) {
    e.preventDefault()
    setMsg(null)
    setSavingProfile(true)

    try {
      if (DEMO_MODE) {
        await new Promise(r => setTimeout(r, 800))
        setMsg({ type: 'ok', text: 'Profile updated (demo mode)' })
        setSavingProfile(false)
        return
      }

      const now = new Date().toISOString()
      const existing = await readAll('profiles', { filters: { id: user.id }, single: true })

      const profile = {
        id: user.id,
        email: user.email,
        full_name: form.full_name,
        username: form.username,
        phone: form.phone,
        updated_at: now,
      }

      if (existing && existing.id) {
        await updateRow('profiles', profile)
      } else {
        profile.created_at = now
        await insertRow('profiles', profile)
      }

      setMsg({ type: 'ok', text: 'Profile saved successfully!' })
    } catch (err) {
      setMsg({ type: 'err', text: err.message })
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setPwMsg(null)
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'err', text: 'Passwords do not match' })
      return
    }
    if (pwForm.newPassword.length < 6) {
      setPwMsg({ type: 'err', text: 'Password must be at least 6 characters' })
      return
    }
    setSavingPw(true)
    try {
      await new Promise(r => setTimeout(r, 600))
      setPwMsg({ type: 'ok', text: 'Password changed (demo mode)' })
      setPwForm({ newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwMsg({ type: 'err', text: err.message })
    } finally {
      setSavingPw(false)
    }
  }

  const displayAvatar = avatarPreview || avatarUrl
  const initials = (form.full_name || form.username || form.email || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="space-y-6">

      <form onSubmit={handleSaveProfile} className="bg-scada-panel border border-scada-border rounded-xl p-6 space-y-5">

        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-scada-accent/40 overflow-hidden flex items-center justify-center bg-scada-dim">
              {displayAvatar
                ? <img src={displayAvatar} alt="avatar" className="w-full h-full object-cover" />
                : <span className="font-display text-2xl font-bold text-scada-accent">{initials}</span>
              }
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border border-scada-border bg-scada-panel transition-colors hover:bg-scada-accent/20"
            >
              <Camera className="w-3.5 h-3.5 text-scada-accent" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            icon={User}
            label="Full Name"
            value={form.full_name}
            onChange={v => setForm(f => ({ ...f, full_name: v }))}
            placeholder="Ahmed Mohamed"
          />
          <Field
            icon={User}
            label="Username"
            value={form.username}
            onChange={v => setForm(f => ({ ...f, username: v }))}
            placeholder="ahmed_ops"
          />
          <Field
            icon={Phone}
            label="Phone Number"
            type="tel"
            value={form.phone}
            onChange={v => setForm(f => ({ ...f, phone: v }))}
            placeholder="+20 1XX XXX XXXX"
          />
          <Field
            icon={Mail}
            label="Email"
            type="email"
            value={form.email}
            disabled
            placeholder="your@email.com"
            hint="Email cannot be changed here"
          />
        </div>

        {msg && <StatusMsg type={msg.type} text={msg.text} />}

        <button
          type="submit"
          disabled={savingProfile || uploading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-display text-xs font-bold tracking-widest transition-all disabled:opacity-50"
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            boxShadow: '0 0 16px rgba(37,99,235,0.25)',
          }}
        >
          {savingProfile || uploading ? (
            <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {uploading ? 'UPLOADING...' : 'SAVING...'}</>
          ) : (
            <><Save className="w-3.5 h-3.5" /> SAVE PROFILE</>
          )}
        </button>
      </form>

      <div className="bg-scada-panel border border-scada-border rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => { setPwOpen(o => !o); setPwMsg(null) }}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-scada-dim/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-scada-accent" />
            <span className="font-display text-xs font-bold tracking-widest text-scada-text">CHANGE PASSWORD</span>
          </div>
          <ChevronDown
            className="w-4 h-4 text-scada-muted transition-transform duration-300"
            style={{ transform: pwOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </button>

        <div
          style={{
            maxHeight: pwOpen ? '400px' : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <form onSubmit={handleChangePassword} className="px-6 pb-6 space-y-4 border-t border-scada-border/60">
            <div className="pt-4" />

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-scada-muted" />
              <input
                type={showPw ? 'text' : 'password'}
                value={pwForm.newPassword}
                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                placeholder="New password"
                className="w-full rounded-lg pl-10 pr-10 py-2.5 font-mono text-sm bg-scada-dim border border-scada-border text-scada-text placeholder:text-scada-muted/50 focus:outline-none focus:border-scada-accent/50"
              />
              <button type="button" onClick={() => setShowPw(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-scada-muted">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-scada-muted" />
              <input
                type={showPw ? 'text' : 'password'}
                value={pwForm.confirmPassword}
                onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
                className="w-full rounded-lg pl-10 pr-4 py-2.5 font-mono text-sm bg-scada-dim border border-scada-border text-scada-text placeholder:text-scada-muted/50 focus:outline-none focus:border-scada-accent/50"
              />
            </div>

            {pwMsg && <StatusMsg type={pwMsg.type} text={pwMsg.text} />}

            <button
              type="submit"
              disabled={savingPw || !pwForm.newPassword}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-display text-xs font-bold tracking-widest transition-all disabled:opacity-50 border border-scada-accent/40 text-scada-accent hover:bg-scada-accent/10"
            >
              {savingPw ? (
                <><div className="w-3.5 h-3.5 border-2 border-scada-accent/30 border-t-scada-accent rounded-full animate-spin" /> UPDATING...</>
              ) : (
                <><Lock className="w-3.5 h-3.5" /> UPDATE PASSWORD</>
              )}
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

function Field({ icon: Icon, label, value, onChange, type = 'text', placeholder, disabled, hint }) {
  return (
    <div>
      <label className="font-mono text-xs text-scada-muted uppercase tracking-wider block mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-scada-muted" />
        <input
          type={type}
          value={value}
          onChange={onChange ? e => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-lg pl-10 pr-4 py-2.5 font-mono text-sm bg-scada-dim border border-scada-border text-scada-text placeholder:text-scada-muted/50 focus:outline-none focus:border-scada-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      {hint && <p className="font-mono text-[10px] text-scada-muted mt-1">{hint}</p>}
    </div>
  )
}

function StatusMsg({ type, text }) {
  return (
    <div className={`flex items-center gap-2 rounded-lg px-4 py-2.5 ${
      type === 'ok'
        ? 'bg-scada-green/10 border border-scada-green/30 text-scada-green'
        : 'bg-scada-red/10 border border-scada-red/30 text-scada-red'
    }`}>
      {type === 'ok'
        ? <CheckCircle className="w-4 h-4 shrink-0" />
        : <AlertCircle className="w-4 h-4 shrink-0" />
      }
      <span className="font-mono text-xs">{text}</span>
    </div>
  )
}
