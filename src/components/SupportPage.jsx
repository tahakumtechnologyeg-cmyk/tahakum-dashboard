import { Mail, MessageCircle, Globe, ChevronRight, Send } from 'lucide-react'
import { useI18n } from '../i18n/I18nContext'

const CONTACT_EMAIL = 'team.takamul.eg@gmail.com'

function ContactCard({ icon: Icon, title, value, subtitle, href, color = 'var(--color-primary)', actionLabel = 'Open' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-[18px_20px] rounded-xl no-underline cursor-pointer transition-all mb-3 bg-scada-panel border border-scada-border hover:bg-scada-dim hover:-translate-y-px"
      style={{ borderColor: 'var(--scada-border)' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}50`; e.currentTarget.style.boxShadow = `0 4px 20px ${color}18` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--scada-border)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}35` }}>
        <Icon style={{ width: 20, height: 20, color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-mono text-[10px] font-bold tracking-widest text-scada-muted mb-1">{title}</div>
        <div className="font-mono text-sm font-semibold text-scada-text mb-0.5 break-all">{value}</div>
        {subtitle && <div className="font-mono text-xs text-scada-muted/60">{subtitle}</div>}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <span className="font-mono text-[10px] font-bold tracking-wider" style={{ color }}>{actionLabel}</span>
        <ChevronRight style={{ width: 14, height: 14, color }} />
      </div>
    </a>
  )
}

export default function SupportPage() {
  const { t } = useI18n()

  return (
    <div>
      {/* Hero card */}
      <div className="p-7 rounded-xl mb-6 bg-scada-panel border border-scada-border text-center relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-30 h-30 rounded-full border border-primary/10" />
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full border border-primary/20" />

        <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center bg-primary-bg border border-primary/30">
          <MessageCircle style={{ width: 26, height: 26, color: 'var(--color-primary)' }} />
        </div>

        <div className="font-mono text-sm font-bold tracking-widest text-scada-text mb-2">{t('support.title')}</div>
        <div className="font-mono text-xs text-scada-muted max-w-xs mx-auto leading-relaxed">{t('support.desc')}</div>
      </div>

      {/* Contact methods */}
      <div className="mb-2">
        <div className="font-mono text-[10px] font-bold tracking-widest text-scada-muted/50 mb-3 pl-1">{t('support.contactUs')}</div>

        <ContactCard
          icon={Mail}
          title={t('support.emailSupport')}
          value={CONTACT_EMAIL}
          subtitle={t('support.emailSub')}
          href={`mailto:${CONTACT_EMAIL}?subject=Tahakum%20Technology%20SCADA%20Support%20Request`}
          actionLabel={t('support.sendEmail')}
        />

        <ContactCard
          icon={Send}
          title={t('support.quickReport')}
          subtitle={t('support.quickDesc')}
          value={t('support.quickSub')}
          href={`mailto:${CONTACT_EMAIL}?subject=Bug%20Report%20%E2%80%94%20Tahakum%20Technology%20SCADA&body=Device%3A%0AIssue%3A%0ASteps%20to%20reproduce%3A%0A`}
          color="var(--color-accent)"
          actionLabel={t('support.reportBug')}
        />

        <ContactCard
          icon={Globe}
          title={t('support.company')}
          value={t('support.companyValue')}
          subtitle={t('support.companySub')}
          href="mailto:team.takamul.eg@gmail.com"
          color="#22c55e"
          actionLabel={t('support.contact')}
        />
      </div>

      {/* Footer */}
      <div className="text-center py-5">
        <span className="font-mono text-[10px] text-scada-muted/40 tracking-widest">{t('support.footer')}</span>
      </div>
    </div>
  )
}
