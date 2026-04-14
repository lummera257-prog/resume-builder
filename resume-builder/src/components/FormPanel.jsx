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
import { ChevronUp, ChevronDown, Settings2, Plus, GripVertical } from 'lucide-react'
import { useState } from 'react'

// ─── ATS Score meter ──────────────────────────────────────────────────────────
function ATSScore() {
  const { resume } = useResume()
  const ats = calculateATSScore(resume)
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="mx-4 mb-3 rounded-xl border overflow-hidden" style={{ borderColor: ats.color + '40' }}>
      <div className="px-3 py-2.5 flex items-center gap-3 cursor-pointer select-none"
        style={{ backgroundColor: ats.color + '10' }}
        onClick={() => setExpanded(e => !e)}>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold" style={{ color: ats.color }}>
              ATS Score — {ats.grade}
            </span>
            <span className="text-xs font-bold" style={{ color: ats.color }}>{ats.score}/100</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${ats.score}%`, backgroundColor: ats.color }} />
          </div>
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </div>

      {expanded && (ats.issues.length > 0 || ats.tips.length > 0) && (
        <div className="px-3 py-2 bg-white border-t text-xs space-y-1" style={{ borderColor: ats.color + '30' }}>
          {ats.issues.map((issue, i) => (
            <p key={i} className="text-red-500 flex gap-1.5"><span>⚠</span>{issue}</p>
          ))}
          {ats.tips.map((tip, i) => (
            <p key={i} className="text-slate-500 flex gap-1.5"><span>💡</span>{tip}</p>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Settings panel ───────────────────────────────────────────────────────────
function SettingsPanel() {
  const { resume, updateSettings } = useResume()
  const { settings } = resume

  return (
    <div className="mx-4 mb-3 bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
        <Settings2 size={14} className="text-slate-500" />
        <span className="text-sm font-semibold text-slate-700">Resume Settings</span>
      </div>
      <div className="p-4 space-y-4">
        {/* Template */}
        <div>
          <label className="form-label">Template</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'clarity', label: '📄 Classic', desc: 'ATS-friendly, single column' },
              { id: 'prism',   label: '✨ Modern',  desc: 'Two columns, sidebar layout' },
            ].map(t => (
              <button key={t.id} type="button"
                onClick={() => updateSettings({ template: t.id })}
                className={`p-2.5 rounded-lg border text-left transition-all ${settings.template === t.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                <p className="text-xs font-semibold">{t.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Color scheme */}
        <div>
          <label className="form-label">Accent Color</label>
          <div className="flex gap-2 flex-wrap">
            {COLOR_SCHEMES.map(c => (
              <button key={c.id} type="button"
                onClick={() => updateSettings({ colorScheme: c.id })}
                className={`w-7 h-7 rounded-full border-2 transition-all ${settings.colorScheme === c.id ? 'scale-125 border-slate-400' : 'border-transparent hover:scale-110'}`}
                style={{ backgroundColor: c.color }}
                title={c.label} />
            ))}
          </div>
        </div>

        {/* Font family */}
        <div>
          <label className="form-label">Font Style</label>
          <div className="flex gap-2">
            {[
              { id: 'modern', label: 'Modern' },
              { id: 'classic', label: 'Classic' },
              { id: 'minimal', label: 'Minimal' },
            ].map(f => (
              <button key={f.id} type="button"
                onClick={() => updateSettings({ fontFamily: f.id })}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-all ${settings.fontFamily === f.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Font size */}
        <div>
          <label className="form-label">Font Size</label>
          <div className="flex gap-2">
            {['small', 'medium', 'large'].map(s => (
              <button key={s} type="button"
                onClick={() => updateSettings({ fontSize: s })}
                className={`flex-1 py-1.5 text-xs rounded-lg border transition-all capitalize ${settings.fontSize === s
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Section order manager ────────────────────────────────────────────────────
function SectionOrderPanel() {
  const { resume, reorderSections, toggleSection, addCustomSection } = useResume()
  const { settings } = resume
  const [showOrder, setShowOrder] = useState(false)

  const moveSection = (index, dir) => {
    const order = [...settings.sectionOrder]
    const newIdx = index + dir
    if (newIdx < 0 || newIdx >= order.length) return
    ;[order[index], order[newIdx]] = [order[newIdx], order[index]]
    reorderSections(order)
  }

  return (
    <div className="mx-4 mb-3 bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between cursor-pointer"
        onClick={() => setShowOrder(s => !s)}>
        <span className="text-sm font-semibold text-slate-700">Section Manager</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${showOrder ? 'rotate-180' : ''}`} />
      </div>

      {showOrder && (
        <div className="p-3">
          <p className="text-xs text-slate-400 mb-3">Toggle visibility and reorder sections</p>
          {settings.sectionOrder.map((key, i) => {
            const meta = SECTION_META[key]
            const active = settings.activeSections.includes(key)
            if (!meta) return null
            return (
              <div key={key} className="flex items-center gap-2 mb-1.5 p-2 rounded-lg hover:bg-slate-50">
                <button type="button" onClick={() => toggleSection(key)}
                  className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${active ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                  {active && <span className="text-white text-[9px]">✓</span>}
                </button>
                <span className="text-sm flex-1 text-slate-700">{meta.icon} {meta.label}</span>
                <div className="flex gap-1">
                  <button type="button" onClick={() => moveSection(i, -1)} disabled={i === 0}
                    className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"><ChevronUp size={12} /></button>
                  <button type="button" onClick={() => moveSection(i, 1)} disabled={i === settings.sectionOrder.length - 1}
                    className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"><ChevronDown size={12} /></button>
                </div>
              </div>
            )
          })}

          {/* Add custom section */}
          <button type="button" onClick={addCustomSection}
            className="w-full mt-2 py-2 border-2 border-dashed border-slate-200 rounded-lg text-xs text-slate-500
                       hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-1">
            <Plus size={12} /> Add Custom Section
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main FormPanel ───────────────────────────────────────────────────────────
export default function FormPanel() {
  const { resume } = useResume()
  const { settings } = resume

  return (
    <div className="h-full overflow-y-auto pb-8 pt-4">
      {/* ATS Score at top */}
      <ATSScore />

      {/* Settings */}
      <SettingsPanel />

      {/* Section order */}
      <SectionOrderPanel />

      <div className="mx-4 mb-3 border-t border-slate-200 pt-4">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Resume Content</p>
      </div>

      {/* Always show personal info */}
      <div className="px-4">
        <PersonalInfo />
      </div>

      {/* Render sections in order */}
      <div className="px-4">
        {settings.sectionOrder.map(key => {
          switch (key) {
            case 'summary':        return <Summary key={key} />
            case 'experience':     return <Experience key={key} />
            case 'education':      return <Education key={key} />
            case 'skills':         return <Skills key={key} />
            case 'projects':       return <Projects key={key} />
            case 'certifications': return <Certifications key={key} />
            case 'languages':      return <Languages key={key} />
            case 'achievements':   return <Achievements key={key} />
            default:               return null
          }
        })}

        {/* Custom sections */}
        {resume.customSections.map(cs => (
          <CustomSection key={cs.id} section={cs} />
        ))}
      </div>
    </div>
  )
}
