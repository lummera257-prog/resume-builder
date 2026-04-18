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

// ATS Score
function ATSScore() {
  const { resume } = useResume()
  const ats = calculateATSScore(resume)
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mb-3 rounded-xl border overflow-hidden" style={{ borderColor: ats.color + '40' }}>
      <div
        className="px-3 py-2.5 flex items-center gap-3 cursor-pointer"
        style={{ backgroundColor: ats.color + '10' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span style={{ color: ats.color }}>ATS Score — {ats.grade}</span>
            <span style={{ color: ats.color }}>{ats.score}/100</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${ats.score}%`, backgroundColor: ats.color }}
            />
          </div>
        </div>
        <ChevronDown size={14} className={`transition ${expanded ? 'rotate-180' : ''}`} />
      </div>

      {expanded && (
        <div className="p-3 text-xs bg-white border-t space-y-1">
          {ats.issues.map((i, idx) => (
            <p key={idx} className="text-red-500">⚠ {i}</p>
          ))}
          {ats.tips.map((t, idx) => (
            <p key={idx} className="text-slate-500">💡 {t}</p>
          ))}
        </div>
      )}
    </div>
  )
}

// Accordion Wrapper
function Section({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="mb-3 bg-white border border-slate-300 rounded-xl overflow-hidden">
      <div
        className="px-4 py-3 flex justify-between items-center cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-semibold text-slate-800">{title}</span>
        <ChevronDown size={14} className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && <div className="p-4">{children}</div>}
    </div>
  )
}

// Settings
function SettingsPanel() {
  const { resume, updateSettings } = useResume()
  const { settings } = resume

  return (
    <Section title="Resume Settings">
      <div className="space-y-4">

        {/* Template */}
        <div>
          <label className="form-label">Template</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'clarity',   label: '📄 Classic',   desc: 'ATS-friendly, single column' },
              { id: 'prism',     label: '✨ Modern',    desc: 'Two columns, sidebar layout' },
              { id: 'minimal',   label: '🪄 Minimal',   desc: 'Ultra-clean typography' },
              { id: 'elegant',   label: '💎 Elegant',   desc: 'Centered, timeline layout' },
              { id: 'executive', label: '🏆 Executive', desc: 'Bold sidebar, dark accent' },
              { id: 'creative',  label: '🎨 Creative',  desc: 'Vibrant two-column design' },
            ].map(t => (
              <button key={t.id} type="button"
                onClick={() => updateSettings({ template: t.id })}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  settings.template === t.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}>
                <p className="text-xs font-semibold">{t.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Color */}
        <div>
          <label className="form-label">Color</label>
          <div className="flex gap-2 mt-1 flex-wrap">
            {COLOR_SCHEMES.map(c => (
              <button key={c.id}
                onClick={() => updateSettings({ colorScheme: c.id })}
                title={c.label}
                className={`w-7 h-7 rounded-full border-2 transition-all ${
                  settings.colorScheme === c.id
                    ? 'scale-125 border-slate-400'
                    : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: c.color }}
              />
            ))}
          </div>
        </div>

      </div>
    </Section>
  )
}

// Section Manager
function SectionOrderPanel() {
  const { resume, toggleSection } = useResume()
  const { settings } = resume

  return (
    <Section title="Section Manager">
      <div className="space-y-2">
        {settings.sectionOrder.map(key => {
          const meta = SECTION_META[key]
          const active = settings.activeSections.includes(key)
          if (!meta) return null

          return (
            <div key={key} className="flex justify-between items-center py-1">
              <span className="text-sm text-slate-700">{meta.icon} {meta.label}</span>
              <button
                onClick={() => toggleSection(key)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  active
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}>
                {active ? 'ON' : 'OFF'}
              </button>
            </div>
          )
        })}

        <button className="w-full mt-2 border-2 border-dashed border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 p-2 text-xs text-slate-500 rounded-lg flex justify-center gap-1 transition-all">
          <Plus size={12} /> Add Custom Section
        </button>
      </div>
    </Section>
  )
}

// Main Export
export default function FormPanel() {
  const { resume } = useResume()
  const { settings } = resume

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-4 pt-4 pb-24">

        <ATSScore />
        <SettingsPanel />
        <SectionOrderPanel />

        <Section title="Personal Info" defaultOpen={true}>
          <PersonalInfo />
        </Section>

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
          <Section key={cs.id} title={cs.title}>
            <CustomSection section={cs} />
          </Section>
        ))}

        {/* ── End of Form indicator ── */}
        <div className="flex flex-col items-center gap-2 mt-4 mb-2">
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-px bg-slate-300" />
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
              End of Form
            </span>
            <div className="flex-1 h-px bg-slate-300" />
          </div>
          <p className="text-xs text-slate-400 text-center">
            ✅ All sections filled · Download PDF when ready
          </p>
        </div>

      </div>
    </div>
  )
}