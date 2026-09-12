const fmt = (d) => {
  if (!d) return ''
  if (/^\d{4}-\d{2}/.test(d)) {
    const [y, m] = d.split('-')
    return new Date(y, m - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return d
}

const accentVars = {
  blue:    { main: '#3b82f6', sidebar: '#1e293b' },
  emerald: { main: '#10b981', sidebar: '#1e293b' },
  violet:  { main: '#8b5cf6', sidebar: '#1e293b' },
  rose:    { main: '#f43f5e', sidebar: '#1e293b' },
  slate:   { main: '#94a3b8', sidebar: '#0f172a' },
  amber:   { main: '#f59e0b', sidebar: '#1e293b' },
}

function SideHead({ title, color }) {
  return (
    <h3 style={{
      fontSize: '7.5pt', fontWeight: 700, letterSpacing: '0.15em',
      textTransform: 'uppercase', color, margin: '14px 0 6px',
      borderBottom: `1px solid rgba(255,255,255,0.15)`, paddingBottom: '4px',
    }}>{title}</h3>
  )
}

function MainHead({ title, color }) {
  return (
    <div style={{ margin: '14px 0 7px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '3px', height: '16px', background: color, borderRadius: '2px', flexShrink: 0 }} />
      <h2 style={{
        fontSize: '9pt', fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#111', margin: 0,
      }}>{title}</h2>
    </div>
  )
}

export default function ExecutiveTemplate({ resume }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements, customSections, settings } = resume
  const scheme = accentVars[settings.colorScheme] || accentVars.blue
  const activeSet = new Set(settings.activeSections)
  const ordered = settings.sectionOrder.filter(s => activeSet.has(s))
  const sideKeys = ['skills', 'languages', 'certifications', 'achievements']
  const mainKeys = ordered.filter(k => !sideKeys.includes(k))

  return (
    <div id="resume-preview" style={{
      width: '210mm',
      display: 'flex',
      fontFamily: "'Arial', sans-serif",
      fontSize: '9.5pt',
      background: '#fff',
    }}>
      {/* SIDEBAR */}
      <div style={{
        width: '65mm',
        minHeight: 'auto',
        background: scheme.sidebar,
        padding: '14mm 8mm 14mm 9mm',
        boxSizing: 'border-box',
        flexShrink: 0,
        color: '#fff',
      }}>
        <div style={{ marginBottom: '4px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <h1 style={{ fontSize: '18pt', fontWeight: 800, margin: 0, color: '#fff', lineHeight: 1.15 }}>
            {(personalInfo.name || 'Your Name').split(' ')[0]}
          </h1>
          <h1 style={{ fontSize: '18pt', fontWeight: 300, margin: 0, color: 'rgba(255,255,255,0.85)', lineHeight: 1.15 }}>
            {(personalInfo.name || '').split(' ').slice(1).join(' ')}
          </h1>
          {personalInfo.title && (
            <p style={{ fontSize: '7.5pt', color: scheme.main, margin: '6px 0 0', fontWeight: 600, letterSpacing: '0.05em' }}>
              {personalInfo.title}
            </p>
          )}
        </div>

        <SideHead title="Contact" color={scheme.main} />
        <div style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.8)', lineHeight: 2 }}>
          {personalInfo.phone    && <div>📞 {personalInfo.phone}</div>}
          {personalInfo.email    && <div>✉ {personalInfo.email}</div>}
          {personalInfo.location && <div>📍 {personalInfo.location}</div>}
          {personalInfo.linkedin && <div>🔗 {personalInfo.linkedin}</div>}
          {personalInfo.github   && <div>💻 {personalInfo.github}</div>}
          {personalInfo.website  && <div>🌐 {personalInfo.website}</div>}
        </div>

        {activeSet.has('skills') && skills.length > 0 && (
          <div>
            <SideHead title="Skills" color={scheme.main} />
            {skills.map(s => (
              <div key={s.id} style={{ marginBottom: '7px' }}>
                {s.category && <div style={{ fontSize: '7.5pt', fontWeight: 700, color: scheme.main, marginBottom: '3px' }}>{s.category}</div>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                  {(Array.isArray(s.items) ? s.items : (s.items || '').split(',')).map((item, i) => (
                    <span key={i} style={{
                      fontSize: '7pt', background: 'rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.9)', padding: '1px 6px', borderRadius: '2px',
                    }}>{item.trim()}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSet.has('languages') && languages.length > 0 && (
          <div>
            <SideHead title="Languages" color={scheme.main} />
            {languages.map(l => (
              <div key={l.id} style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.85)', marginBottom: '4px' }}>
                <strong style={{ color: '#fff' }}>{l.language}</strong>
                {l.proficiency && <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '7pt' }}>{l.proficiency}</div>}
              </div>
            ))}
          </div>
        )}

        {activeSet.has('certifications') && certifications.length > 0 && (
          <div>
            <SideHead title="Certifications" color={scheme.main} />
            {certifications.map(c => (
              <div key={c.id} style={{ marginBottom: '6px' }}>
                <div style={{ fontSize: '7.5pt', color: '#fff', fontWeight: 600 }}>{c.name}</div>
                {c.issuer && <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.65)' }}>{c.issuer}</div>}
                {c.date   && <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.5)' }}>{fmt(c.date)}</div>}
              </div>
            ))}
          </div>
        )}

        {activeSet.has('achievements') && achievements.length > 0 && (
          <div>
            <SideHead title="Achievements" color={scheme.main} />
            {achievements.map(a => (
              <div key={a.id} style={{ marginBottom: '6px' }}>
                <div style={{ fontSize: '7.5pt', color: '#fff', fontWeight: 600 }}>{a.title}</div>
                {a.description && <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.7)', marginTop: '2px', lineHeight: 1.4 }}>{a.description}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: '14mm 12mm 14mm 10mm', boxSizing: 'border-box' }}>
        {mainKeys.map(key => {
          switch (key) {
            case 'summary':
              return summary ? (
                <div key={key}>
                  <MainHead title="About Me" color={scheme.main} />
                  <p style={{ margin: 0, color: '#333', lineHeight: 1.65, fontSize: '9pt' }}>{summary}</p>
                </div>
              ) : null

            case 'experience':
              return experience.length > 0 ? (
                <div key={key}>
                  <MainHead title="Experience" color={scheme.main} />
                  {experience.map((e, i) => (
                    <div key={e.id} className="no-break" style={{ marginBottom: i < experience.length - 1 ? '10px' : 0, paddingLeft: '8px', borderLeft: `2px solid #f1f5f9` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <strong style={{ fontSize: '10pt', color: '#111' }}>{e.position}</strong>
                        <span style={{ fontSize: '7.5pt', color: '#888' }}>
                          {fmt(e.startDate)} – {e.current ? 'Present' : fmt(e.endDate)}
                        </span>
                      </div>
                      <div style={{ fontSize: '8.5pt', color: scheme.main, fontWeight: 600, marginBottom: '3px' }}>
                        {e.company}{e.location ? ` · ${e.location}` : ''}
                      </div>
                      {e.description && (
                        <div style={{ fontSize: '8.5pt', color: '#333', whiteSpace: 'pre-line', lineHeight: 1.55 }}>{e.description}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : null

            case 'education':
              return education.length > 0 ? (
                <div key={key}>
                  <MainHead title="Education" color={scheme.main} />
                  {education.map(e => (
                    <div key={e.id} style={{ marginBottom: '7px', paddingLeft: '8px', borderLeft: `2px solid #f1f5f9` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>{e.institution}</strong>
                        <span style={{ fontSize: '7.5pt', color: '#888' }}>
                          {fmt(e.startDate)}{e.endDate ? ` – ${fmt(e.endDate)}` : ''}
                        </span>
                      </div>
                      <div style={{ fontSize: '8.5pt', color: '#555' }}>
                        {e.degree}{e.field ? ` in ${e.field}` : ''}{e.gpa ? ` · GPA: ${e.gpa}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null

            case 'projects':
              return projects.length > 0 ? (
                <div key={key}>
                  <MainHead title="Projects" color={scheme.main} />
                  {projects.map((p, i) => (
                    <div key={p.id} className="no-break" style={{ marginBottom: i < projects.length - 1 ? '8px' : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '9.5pt' }}>{p.name}</strong>
                        {p.link && <span style={{ fontSize: '7.5pt', color: scheme.main }}>{p.link}</span>}
                      </div>
                      {p.technologies && <div style={{ fontSize: '8pt', color: scheme.main }}>{p.technologies}</div>}
                      {p.description && <div style={{ fontSize: '8.5pt', color: '#333' }}>{p.description}</div>}
                    </div>
                  ))}
                </div>
              ) : null

            default: return null
          }
        })}

        {customSections && customSections.map(cs => (
          cs.items && cs.items.length > 0 ? (
            <div key={cs.id}>
              <MainHead title={cs.title} color={scheme.main} />
              {cs.items.map(item => (
                <div key={item.id} style={{ marginBottom: '5px', fontSize: '8.5pt' }}>
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