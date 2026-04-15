/**
 * CLARITY TEMPLATE — Classic single-column, ATS-optimised
 * Clean, minimal, professional. Passes all major ATS scanners.
 */

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (d) => {
  if (!d) return ''
  if (/^\d{4}-\d{2}/.test(d)) {
    const [y, m] = d.split('-')
    return new Date(y, m - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return d
}

const accentVars = {
  blue:    { main: '#2563eb', dark: '#1d4ed8', light: '#eff6ff', border: '#bfdbfe' },
  emerald: { main: '#059669', dark: '#047857', light: '#f0fdf4', border: '#a7f3d0' },
  violet:  { main: '#7c3aed', dark: '#6d28d9', light: '#f5f3ff', border: '#ddd6fe' },
  rose:    { main: '#e11d48', dark: '#be123c', light: '#fff1f2', border: '#fecdd3' },
  slate:   { main: '#475569', dark: '#334155', light: '#f8fafc', border: '#e2e8f0' },
  amber:   { main: '#d97706', dark: '#b45309', light: '#fffbeb', border: '#fde68a' },
}

const fontMap = {
  modern:  "'Geist', system-ui, sans-serif",
  classic: "'Playfair Display', Georgia, serif",
  minimal: "'JetBrains Mono', monospace",
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ title, color }) {
  return (
    <div style={{ marginTop: '12px', marginBottom: '6px' }}>
      <h2 style={{
        color,
        fontSize: '10pt',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        borderBottom: `2px solid ${color}`,
        paddingBottom: '3px',
        margin: 0
      }}>
        {title}
      </h2>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ClassicTemplate({ resume }) {
  const {
    personalInfo, summary, experience, education,
    skills, projects, certifications, languages,
    achievements, customSections, settings
  } = resume

  const scheme  = accentVars[settings.colorScheme] || accentVars.blue
  const fontCss = fontMap[settings.fontFamily] || fontMap.modern
  const fontSize =
    settings.fontSize === 'small' ? '9.5pt' :
    settings.fontSize === 'large' ? '11pt' : '10pt'

  const activeSet = new Set(settings.activeSections)
  const orderedSections = settings.sectionOrder.filter(s => activeSet.has(s))

  return (
    <div
      id="resume-preview"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: '#fff',
        fontFamily: fontCss,
        fontSize,
        color: '#111',
        padding: '14mm',
        boxSizing: 'border-box',
        lineHeight: 1.45
      }}
    >

      {/* Header */}
      <div style={{ borderBottom: `2px solid ${scheme.main}`, marginBottom: '10px', paddingBottom: '8px' }}>
        <h1 style={{ fontSize: '22pt', margin: 0 }}>{personalInfo.name || 'Your Name'}</h1>
        {personalInfo.title && (
          <p style={{ margin: '2px 0', color: scheme.main }}>{personalInfo.title}</p>
        )}
        <div style={{ fontSize: '8.5pt', color: '#555', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {/* Sections */}
      {orderedSections.map(key => {
        switch (key) {
          case 'summary':
            return summary && (
              <div key={key}>
                <SectionHeading title="Summary" color={scheme.main} />
                <p>{summary}</p>
              </div>
            )

          case 'experience':
            return experience.length > 0 && (
              <div key={key}>
                <SectionHeading title="Experience" color={scheme.main} />
                {experience.map(e => (
                  <div key={e.id} style={{ marginBottom: '8px' }}>
                    <strong>{e.position}</strong> — {e.company}
                    <div style={{ fontSize: '8pt', color: '#666' }}>
                      {fmt(e.startDate)} - {e.current ? 'Present' : fmt(e.endDate)}
                    </div>
                    <p>{e.description}</p>
                  </div>
                ))}
              </div>
            )

          case 'education':
            return education.length > 0 && (
              <div key={key}>
                <SectionHeading title="Education" color={scheme.main} />
                {education.map(e => (
                  <div key={e.id}>
                    <strong>{e.institution}</strong>
                    <p>{e.degree}</p>
                  </div>
                ))}
              </div>
            )

          case 'skills':
            return skills.length > 0 && (
              <div key={key}>
                <SectionHeading title="Skills" color={scheme.main} />
                <p>{skills.map(s => s.items).join(', ')}</p>
              </div>
            )

          default:
            return null
        }
      })}

    </div>
  )
}