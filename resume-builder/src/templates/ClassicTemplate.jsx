const fmt = (d) => {
  if (!d) return ''
  if (/^\d{4}-\d{2}/.test(d)) {
    const [y, m] = d.split('-')
    return new Date(y, m - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return d
}

const accentVars = {
  blue:    { main: '#2563eb' },
  emerald: { main: '#059669' },
  violet:  { main: '#7c3aed' },
  rose:    { main: '#e11d48' },
  slate:   { main: '#475569' },
  amber:   { main: '#d97706' },
}

const fontMap = {
  modern:  "'Geist', system-ui, sans-serif",
  classic: "'Playfair Display', Georgia, serif",
  minimal: "'JetBrains Mono', monospace",
}

function SectionHeading({ title, color }) {
  return (
    <div style={{ marginTop: '14px', marginBottom: '7px' }}>
      <h2 style={{
        color,
        fontSize: '9.5pt',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        borderBottom: `2px solid ${color}`,
        paddingBottom: '3px',
        margin: 0,
      }}>
        {title}
      </h2>
    </div>
  )
}

export default function ClassicTemplate({ resume }) {
  const {
    personalInfo, summary, experience, education,
    skills, projects, certifications, languages,
    achievements, customSections, settings
  } = resume

  const scheme  = accentVars[settings.colorScheme] || accentVars.blue
  const color   = scheme.main
  const fontCss = fontMap[settings.fontFamily] || fontMap.modern
  const fontSize =
    settings.fontSize === 'small' ? '9.5pt' :
    settings.fontSize === 'large' ? '11pt' : '10pt'

  const activeSet = new Set(settings.activeSections)
  const ordered   = settings.sectionOrder.filter(s => activeSet.has(s))

  return (
    /* ── Scroll wrapper ── */
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <div
        id="resume-preview"
        style={{
          width: '210mm',
          background: '#fff',
          fontFamily: fontCss,
          fontSize,
          color: '#111',
          padding: '14mm 16mm',
          boxSizing: 'border-box',
          lineHeight: 1.5,
          margin: '0 auto',
        }}
      >
        {/* ── Header ── */}
        <div style={{ borderBottom: `2.5px solid ${color}`, marginBottom: '10px', paddingBottom: '8px' }}>
          <h1 style={{ fontSize: '22pt', margin: 0, fontWeight: 700 }}>
            {personalInfo.name || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p style={{ margin: '3px 0 5px', color, fontWeight: 600, fontSize: '11pt' }}>
              {personalInfo.title}
            </p>
          )}
          <div style={{ fontSize: '8.5pt', color: '#555', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {personalInfo.email    && <span>✉ {personalInfo.email}</span>}
            {personalInfo.phone    && <span>📞 {personalInfo.phone}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
            {personalInfo.github   && <span>💻 {personalInfo.github}</span>}
            {personalInfo.website  && <span>🌐 {personalInfo.website}</span>}
          </div>
        </div>

        {/* ── Sections ── */}
        {ordered.map(key => {
          switch (key) {

            case 'summary':
              return summary ? (
                <div key={key}>
                  <SectionHeading title="Professional Summary" color={color} />
                  <p style={{ margin: 0, color: '#333' }}>{summary}</p>
                </div>
              ) : null

            case 'experience':
              return experience.length > 0 ? (
                <div key={key}>
                  <SectionHeading title="Work Experience" color={color} />
                  {experience.map((e, i) => (
                    <div key={e.id} className="no-break" style={{ marginBottom: i < experience.length - 1 ? '10px' : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <strong style={{ fontSize: '10.5pt' }}>{e.position}</strong>
                        <span style={{ fontSize: '8pt', color: '#666' }}>
                          {fmt(e.startDate)} – {e.current ? 'Present' : fmt(e.endDate)}
                        </span>
                      </div>
                      <div style={{ color, fontSize: '9pt', fontWeight: 600, marginBottom: '3px' }}>
                        {e.company}{e.location ? ` · ${e.location}` : ''}
                      </div>
                      {e.description && (
                        <div style={{ fontSize: '9pt', color: '#333', whiteSpace: 'pre-line' }}>
                          {e.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null

            case 'education':
              return education.length > 0 ? (
                <div key={key}>
                  <SectionHeading title="Education" color={color} />
                  {education.map(e => (
                    <div key={e.id} style={{ marginBottom: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <strong>{e.institution}</strong>
                        <span style={{ fontSize: '8pt', color: '#666' }}>
                          {fmt(e.startDate)}{e.endDate ? ` – ${fmt(e.endDate)}` : ''}
                        </span>
                      </div>
                      <div style={{ color: '#444', fontSize: '9pt' }}>
                        {e.degree}{e.field ? ` in ${e.field}` : ''}
                        {e.gpa ? ` · GPA: ${e.gpa}` : ''}
                      </div>
                      {e.description && (
                        <div style={{ fontSize: '8.5pt', color: '#555', marginTop: '2px' }}>{e.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null

            case 'skills':
              return skills.length > 0 ? (
                <div key={key}>
                  <SectionHeading title="Skills" color={color} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {skills.map(s => (
                      <div key={s.id} style={{ fontSize: '9pt' }}>
                        {s.category && (
                          <strong style={{ color: '#333' }}>{s.category}: </strong>
                        )}
                        <span style={{ color: '#444' }}>
                          {Array.isArray(s.items) ? s.items.join(', ') : s.items}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null

            case 'projects':
              return projects.length > 0 ? (
                <div key={key}>
                  <SectionHeading title="Projects" color={color} />
                  {projects.map((p, i) => (
                    <div key={p.id} className="no-break" style={{ marginBottom: i < projects.length - 1 ? '8px' : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <strong style={{ fontSize: '10pt' }}>{p.name}</strong>
                        {p.link && <span style={{ fontSize: '7.5pt', color }}>{p.link}</span>}
                      </div>
                      {p.technologies && (
                        <div style={{ fontSize: '8pt', color, marginBottom: '2px' }}>
                          Tech: {p.technologies}
                        </div>
                      )}
                      {p.description && (
                        <div style={{ fontSize: '9pt', color: '#333' }}>{p.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null

            case 'certifications':
              return certifications.length > 0 ? (
                <div key={key}>
                  <SectionHeading title="Certifications" color={color} />
                  {certifications.map(c => (
                    <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div>
                        <strong style={{ fontSize: '9.5pt' }}>{c.name}</strong>
                        {c.issuer && <span style={{ fontSize: '8.5pt', color: '#555' }}> · {c.issuer}</span>}
                      </div>
                      {c.date && <span style={{ fontSize: '8pt', color: '#777' }}>{fmt(c.date)}</span>}
                    </div>
                  ))}
                </div>
              ) : null

            case 'languages':
              return languages.length > 0 ? (
                <div key={key}>
                  <SectionHeading title="Languages" color={color} />
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    {languages.map(l => (
                      <div key={l.id} style={{ fontSize: '9pt' }}>
                        <strong>{l.language}</strong>
                        {l.proficiency && <span style={{ color: '#666' }}> — {l.proficiency}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null

            case 'achievements':
              return achievements.length > 0 ? (
                <div key={key}>
                  <SectionHeading title="Achievements & Awards" color={color} />
                  {achievements.map((a, i) => (
                    <div key={a.id} style={{ marginBottom: i < achievements.length - 1 ? '6px' : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <strong style={{ fontSize: '9.5pt' }}>{a.title}</strong>
                        {a.date && <span style={{ fontSize: '8pt', color: '#777' }}>{fmt(a.date)}</span>}
                      </div>
                      {a.description && (
                        <div style={{ fontSize: '9pt', color: '#333' }}>{a.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null

            default:
              return null
          }
        })}

        {/* Custom Sections */}
        {customSections && customSections.map(cs => (
          cs.items && cs.items.length > 0 ? (
            <div key={cs.id}>
              <SectionHeading title={cs.title} color={color} />
              {cs.items.map(item => (
                <div key={item.id} style={{ marginBottom: '6px', fontSize: '9pt' }}>
                  {item.title && <strong>{item.title}</strong>}
                  {item.description && <p style={{ margin: '2px 0', color: '#333' }}>{item.description}</p>}
                </div>
              ))}
            </div>
          ) : null
        ))}

      </div>
    </div>
  )
}