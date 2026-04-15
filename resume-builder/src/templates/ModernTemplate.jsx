/**
 * PRISM TEMPLATE — Modern two-column layout with sidebar
 */

const accentVars = {
  blue:    { main: '#2563eb', dark: '#1e3a8a', sidebar: '#1e3a8a', sidebarText: '#bfdbfe' },
  emerald: { main: '#059669', dark: '#064e3b', sidebar: '#064e3b', sidebarText: '#a7f3d0' },
  violet:  { main: '#7c3aed', dark: '#3b0764', sidebar: '#3b0764', sidebarText: '#ddd6fe' },
  rose:    { main: '#e11d48', dark: '#881337', sidebar: '#881337', sidebarText: '#fecdd3' },
  slate:   { main: '#475569', dark: '#0f172a', sidebar: '#0f172a', sidebarText: '#cbd5e1' },
  amber:   { main: '#d97706', dark: '#78350f', sidebar: '#78350f', sidebarText: '#fde68a' },
}

const fontMap = {
  modern:  "'Geist', system-ui, sans-serif",
  classic: "'Playfair Display', Georgia, serif",
  minimal: "'JetBrains Mono', monospace",
}

const fmt = (d) => {
  if (!d) return ''
  if (/^\d{4}-\d{2}/.test(d)) {
    const [y, m] = d.split('-')
    return new Date(y, m - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return d
}

export default function ModernTemplate({ resume }) {
  const {
    personalInfo, summary, experience, education,
    skills, projects, certifications, languages,
    achievements, customSections, settings
  } = resume

  const scheme   = accentVars[settings.colorScheme] || accentVars.blue
  const fontCss  = fontMap[settings.fontFamily] || fontMap.modern
  const fontSize =
    settings.fontSize === 'small' ? '9pt' :
    settings.fontSize === 'large' ? '10.5pt' : '9.5pt'

  const activeSet = new Set(settings.activeSections)

  return (
    <div
      id="resume-preview"
      style={{
        width: '210mm',
        minHeight: '297mm',
        display: 'flex',
        fontFamily: fontCss,
        fontSize,
        background: '#fff',
      }}
    >

      {/* Sidebar */}
      <div style={{
        width: '65mm',
        background: scheme.sidebar,
        color: '#fff',
        padding: '14mm 8mm'
      }}>
        <h2 style={{ fontSize: '12pt' }}>{personalInfo.name}</h2>
        <p style={{ fontSize: '8pt' }}>{personalInfo.title}</p>

        {skills.length > 0 && (
          <div>
            <h3 style={{ marginTop: '10px' }}>Skills</h3>
            {skills.map(s => (
              <p key={s.id}>{s.items}</p>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: '12mm' }}>

        {summary && (
          <div>
            <h3>Summary</h3>
            <p>{summary}</p>
          </div>
        )}

        {experience.map(e => (
          <div key={e.id}>
            <strong>{e.position}</strong> - {e.company}
            <p>{e.description}</p>
          </div>
        ))}

        {education.map(e => (
          <div key={e.id}>
            <strong>{e.institution}</strong>
            <p>{e.degree}</p>
          </div>
        ))}

      </div>
    </div>
  )
}