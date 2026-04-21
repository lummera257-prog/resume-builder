const fmt = (d) => {
  if (!d) return ''
  if (/^\d{4}-\d{2}/.test(d)) {
    const [y, m] = d.split('-')
    return new Date(y, m - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return d
}

const accentVars = {
  blue:    { main: '#2563eb', light: '#dbeafe', bg: '#eff6ff' },
  emerald: { main: '#059669', light: '#d1fae5', bg: '#ecfdf5' },
  violet:  { main: '#7c3aed', light: '#ede9fe', bg: '#f5f3ff' },
  rose:    { main: '#e11d48', light: '#fce7f3', bg: '#fff1f2' },
  slate:   { main: '#475569', light: '#e2e8f0', bg: '#f8fafc' },
  amber:   { main: '#d97706', light: '#fef3c7', bg: '#fffbeb' },
}

function Heading({ title, color, bg }) {
  return (
    <div style={{
      margin: '14px 0 8px', background: bg,
      padding: '5px 10px', borderLeft: `3px solid ${color}`,
      borderRadius: '0 4px 4px 0',
    }}>
      <h2 style={{
        fontSize: '8.5pt', fontWeight: 700, letterSpacing: '0.14em',
        textTransform: 'uppercase', color, margin: 0,
      }}>{title}</h2>
    </div>
  )
}

export default function CreativeTemplate({ resume }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements, customSections, settings } = resume
  const scheme = accentVars[settings.colorScheme] || accentVars.blue
  const activeSet = new Set(settings.activeSections)
  const ordered = settings.sectionOrder.filter(s => activeSet.has(s))
  const sideKeys = ['skills', 'languages', 'certifications']
  const mainKeys = ordered.filter(k => !sideKeys.includes(k))

  return (
    <div id="resume-preview" style={{
      width: '210mm',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Arial', 'Helvetica', sans-serif",
      fontSize: '9.5pt',
      background: '#fff',
    }}>
      {/* HEADER */}
      <div style={{
        background: scheme.main, padding: '12mm 14mm 10mm',
        display: 'flex', alignItems: 'flex-start', gap: '16px',
      }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16pt', fontWeight: 700, color: '#fff', flexShrink: 0,
        }}>
          {(personalInfo.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('')}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '20pt', fontWeight: 800, margin: 0, color: '#fff', lineHeight: 1.2 }}>
            {personalInfo.name || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p style={{ margin: '4px 0 8px', color: 'rgba(255,255,255,0.85)', fontSize: '9.5pt' }}>
              {personalInfo.title}
            </p>
          )}
          <div style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.8)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {personalInfo.email    && <span>✉ {personalInfo.email}</span>}
            {personalInfo.phone    && <span>📞 {personalInfo.phone}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
            {personalInfo.github   && <span>💻 {personalInfo.github}</span>}
            {personalInfo.website  && <span>🌐 {personalInfo.website}</span>}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ display: 'flex', minHeight: '220mm' }}>
        {/* SIDEBAR */}
        <div style={{
          width: '62mm',
          background: scheme.bg,
          padding: '10mm 8mm',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}>
          {activeSet.has('skills') && skills.length > 0 && (
            <div>
              <Heading title="Skills" color={scheme.main} bg={scheme.light} />
              {skills.map(s => (
                <div key={s.id} style={{ marginBottom: '8px' }}>
                  {s.category && (
                    <div style={{ fontSize: '7.5pt', fontWeight: 700, color: scheme.main, marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {s.category}
                    </div>
                  )}
                  <div style={{ fontSize: '7.5pt', color: '#444', lineHeight: 1.6 }}>
                    {Array.isArray(s.items) ? s.items.join(' · ') : s.items}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSet.has('languages') && languages.length > 0 && (
            <div>
              <Heading title="Languages" color={scheme.main} bg={scheme.light} />
              {languages.map(l => (
                <div key={l.id} style={{ marginBottom: '5px', fontSize: '8pt' }}>
                  <strong style={{ color: '#222' }}>{l.language}</strong>
                  {l.proficiency && <div style={{ color: '#666', fontSize: '7.5pt' }}>{l.proficiency}</div>}
                </div>
              ))}
            </div>
          )}

          {activeSet.has('certifications') && certifications.length > 0 && (
            <div>
              <Heading title="Certifications" color={scheme.main} bg={scheme.light} />
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '6px' }}>
                  <div style={{ fontSize: '7.5pt', fontWeight: 600, color: '#222' }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '7pt', color: '#666' }}>{c.issuer}</div>}
                  {c.date   && <div style={{ fontSize: '7pt', color: '#888' }}>{fmt(c.date)}</div>}
                </div>
              ))}
            </div>
          )}

          {activeSet.has('achievements') && achievements.length > 0 && (
            <div>
              <Heading title="Achievements" color={scheme.main} bg={scheme.light} />
              {achievements.map(a => (
                <div key={a.id} style={{ marginBottom: '6px' }}>
                  <div style={{ fontSize: '7.5pt', fontWeight: 600, color: '#222' }}>{a.title}</div>
                  {a.description && <div style={{ fontSize: '7pt', color: '#555', lineHeight: 1.4, marginTop: '2px' }}>{a.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, padding: '10mm 12mm', boxSizing: 'border-box' }}>
          {mainKeys.map(key => {
            switch (key) {
              case 'summary':
                return summary ? (
                  <div key={key}>
                    <Heading title="Profile" color={scheme.main} bg={scheme.light} />
                    <p style={{ margin: 0, color: '#333', lineHeight: 1.65, fontSize: '9pt' }}>{summary}</p>
                  </div>
                ) : null

              case 'experience':
                return experience.length > 0 ? (
                  <div key={key}>
                    <Heading title="Work Experience" color={scheme.main} bg={scheme.light} />
                    {experience.map((e, i) => (
                      <div key={e.id} style={{ marginBottom: i < experience.length - 1 ? '10px' : 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <strong style={{ fontSize: '10pt', color: '#111' }}>{e.position}</strong>
                          <span style={{ fontSize: '7.5pt', color: '#888', background: scheme.light, padding: '1px 6px', borderRadius: '10px' }}>
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
                    <Heading title="Education" color={scheme.main} bg={scheme.light} />
                    {education.map(e => (
                      <div key={e.id} style={{ marginBottom: '7px' }}>
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
                    <Heading title="Projects" color={scheme.main} bg={scheme.light} />
                    {projects.map((p, i) => (
                      <div key={p.id} style={{ marginBottom: i < projects.length - 1 ? '8px' : 0 }}>
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
                <Heading title={cs.title} color={scheme.main} bg={scheme.light} />
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
    </div>
  )
}