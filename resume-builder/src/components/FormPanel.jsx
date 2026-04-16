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
import { ChevronDown, Settings2, Plus } from 'lucide-react'
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
              className="h-full"
              style={{ width: `${ats.score}%`, backgroundColor: ats.color }}
            />
          </div>
        </div>
        <ChevronDown size={14} className={`transition ${expanded ? 'rotate-180' : ''}`} />
      </div>

      {expanded && (
        <div className="p-3 text-xs bg-white border-t">
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
    <div className="mb-3 bg-white border rounded-xl overflow-hidden">
      <div
        className="px-4 py-3 flex justify-between items-center cursor-pointer bg-slate-50"
        onClick={() => setOpen(!open)}
      >
        <span className="text-sm font-semibold">{title}</span>
        <ChevronDown size={14} className={`transition ${open ? 'rotate-180' : ''}`} />
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
        <div>
          <label className="text-xs">Template</label>
          <div className="grid grid-cols-2 gap-2 mt-1">
            {[
              { key: 'clarity', label: 'Classic' },
              { key: 'prism',   label: 'Modern' },
              { key: 'clarity', label: 'Minimal' },
              { key: 'clarity', label: 'Elegant' },
              { key: 'prism',   label: 'Executive' },
              { key: 'prism',   label: 'Creative' },
            ].map(t => (
              <button key={t.label}
                onClick={() => updateSettings({ template: t.key })}
                className={`p-2 border rounded text-xs ${
                  settings.template === t.key && settings.selectedLabel === t.label
                    ? 'bg-blue-50 border-blue-500'
                    : ''
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs">Color</label>
          <div className="flex gap-2 mt-1">
            {COLOR_SCHEMES.map(c => (
              <button key={c.id}
                onClick={() => updateSettings({ colorScheme: c.id })}
                className="w-6 h-6 rounded-full"
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
      {settings.sectionOrder.map(key => {
        const meta = SECTION_META[key]
        const active = settings.activeSections.includes(key)
        if (!meta) return null

        return (
          <div key={key} className="flex justify-between items-center mb-2">
            <span className="text-sm">{meta.label}</span>
            <button onClick={() => toggleSection(key)}
              className={`px-2 py-1 text-xs rounded ${
                active ? 'bg-blue-500 text-white' : 'bg-slate-200'
              }`}>
              {active ? 'ON' : 'OFF'}
            </button>
          </div>
        )
      })}

      <button className="w-full mt-2 border-dashed border p-2 text-xs flex justify-center gap-1">
        <Plus size={12}/> Add Section
      </button>
    </Section>
  )
}

// Main Export
export default function FormPanel() {
  const { resume } = useResume()
  const { settings } = resume

  return (
    <div className="px-4 pb-8 pt-4">

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

    </div>
  )
}