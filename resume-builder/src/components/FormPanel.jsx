import { useResume } from '../context/ResumeContext'
import { calculateATSScore } from '../utils/pdfExport'
import { COLOR_SCHEMES, SECTION_META } from '../utils/defaultData'
import PersonalInfo from './sections/PersonalInfo'
import Summary from './sections/Summary'
import Experience from './sections/Experience'
import Education from './sections/Education'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import Certifications from './sections/Certifications'
import Languages from './sections/Languages'
import Achievements from './sections/Achievements'
import CustomSection from './sections/CustomSection'
import { ChevronDown, Plus } from 'lucide-react'
import { useState } from 'react'

function ATSScore() {
  const { resume } = useResume()
  const ats = calculateATSScore(resume)
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{ marginBottom: '12px', borderRadius: '12px', border: `1px solid ${ats.color}40`, overflow: 'hidden' }}>
      <div
        style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', backgroundColor: ats.color + '10' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            <span style={{ color: ats.color }}>ATS Score — {ats.grade}</span>
            <span style={{ color: ats.color }}>{ats.score}/100</span>
          </div>
          <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${ats.score}%`, backgroundColor: ats.color, borderRadius: '999px', transition: 'width 0.5s ease' }} />
          </div>
        </div>
        <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'none', color: '#64748b' }} />
      </div>
      {expanded && (
        <div style={{ padding: '12px', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
          {ats.issues.map((i, idx) => <p key={idx} style={{ margin: '3px 0', fontSize: '12px', color: '#ef4444' }}>⚠ {i}</p>)}
          {ats.tips.map((t, idx) => <p key={idx} style={{ margin: '3px 0', fontSize: '12px', color: '#64748b' }}>💡 {t}</p>)}
        </div>
      )}
    </div>
  )
}

function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ marginBottom: '10px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden' }}>
      <div
        style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: '#f8fafc' }}
        onClick={() => setOpen(!open)}
      >
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{title}</span>
        <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none', color: '#64748b' }} />
      </div>
      {open && <div style={{ padding: '16px' }}>{children}</div>}
    </div>
  )
}

function SettingsPanel() {
  const { resume, updateSettings } = useResume()
  const { settings } = resume
  return (
    <Section title="Resume Settings">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', marginBottom: '8px' }}>Template</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { id: 'clarity',   label: '📄 Classic',   desc: 'ATS-friendly' },
              { id: 'prism',     label: '✨ Modern',    desc: 'Sidebar layout' },
              { id: 'minimal',   label: '🪄 Minimal',   desc: 'Clean typography' },
              { id: 'elegant',   label: '💎 Elegant',   desc: 'Timeline layout' },
              { id: 'executive', label: '🏆 Executive', desc: 'Bold sidebar' },
              { id: 'creative',  label: '🎨 Creative',  desc: 'Vibrant design' },
            ].map(t => (
              <button key={t.id} onClick={() => updateSettings({ template: t.id })}
                style={{
                  padding: '10px', borderRadius: '8px', textAlign: 'left', cursor: 'pointer',
                  border: settings.template === t.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  background: settings.template === t.id ? '#eff6ff' : '#fff',
                  transition: 'all 0.15s',
                }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: settings.template === t.id ? '#1d4ed8' : '#374151' }}>{t.label}</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>{t.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 500, color: '#64748b', marginBottom: '8px' }}>Color</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {COLOR_SCHEMES.map(c => (
              <button key={c.id} onClick={() => updateSettings({ colorScheme: c.id })} title={c.label}
                style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: c.color, cursor: 'pointer',
                  border: settings.colorScheme === c.id ? '3px solid #1e293b' : '2px solid transparent',
                  transform: settings.colorScheme === c.id ? 'scale(1.2)' : 'scale(1)',
                  transition: 'all 0.15s',
                }} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

function SectionOrderPanel() {
  const { resume, toggleSection } = useResume()
  const { settings } = resume
  return (
    <Section title="Section Manager">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {settings.sectionOrder.map(key => {
          const meta = SECTION_META[key]
          const active = settings.activeSections.includes(key)
          if (!meta) return null
          return (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
              <span style={{ fontSize: '13px', color: '#374151' }}>{meta.icon} {meta.label}</span>
              <button onClick={() => toggleSection(key)}
                style={{
                  padding: '4px 12px', fontSize: '11px', fontWeight: 600, borderRadius: '6px', cursor: 'pointer', border: 'none',
                  background: active ? '#3b82f6' : '#e2e8f0',
                  color: active ? '#fff' : '#64748b',
                  transition: 'all 0.15s',
                }}>
                {active ? 'ON' : 'OFF'}
              </button>
            </div>
          )
        })}
        <button style={{
          marginTop: '8px', width: '100%', padding: '8px', fontSize: '12px', color: '#64748b',
          border: '2px dashed #cbd5e1', borderRadius: '8px', background: 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
        }}>
          <Plus size={12} /> Add Custom Section
        </button>
      </div>
    </Section>
  )
}

export default function FormPanel() {
  const { resume } = useResume()
  const { settings } = resume
  return (
    <div style={{ padding: '16px 16px 80px' }}>
      <ATSScore />
      <SettingsPanel />
      <SectionOrderPanel />
      <Section title="Personal Info" defaultOpen={true}><PersonalInfo /></Section>
      {settings.sectionOrder.map(key => {
        switch (key) {
          case 'summary':        return <Section key={key} title="Summary"><Summary /></Section>
          case 'experience':     return <Section key={key} title="Experience"><Experience /></Section>
          case 'education':      return <Section key={key} title="Education"><Education /></Section>
          case 'skills':         return <Section key={key} title="Skills"><Skills /></Section>
          case 'projects':       return <Section key={key} title="Projects"><Projects /></Section>
          case 'certifications': return <Section key={key} title="Certifications"><Certifications /></Section>
          case 'languages':      return <Section key={key} title="Languages"><Languages /></Section>
          case 'achievements':   return <Section key={key} title="Achievements"><Achievements /></Section>
          default: return null
        }
      })}
      {resume.customSections.map(cs => (
        <Section key={cs.id} title={cs.title}><CustomSection section={cs} /></Section>
      ))}
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }} />
          <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>End of Form</span>
          <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }} />
        </div>
        <p style={{ fontSize: '11px', color: '#94a3b8' }}>✅ All sections filled · Download PDF when ready</p>
      </div>
    </div>
  )
}