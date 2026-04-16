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

function Heading({ title, color }) {
  return (
    <div style={{ marginTop: '14px', marginBottom: '6px' }}>
      <h2 style={{
        fontSize: '8pt', fontWeight: 700, letterSpacing: '0.18em',
        textTransform: 'uppercase', color, borderBottom: `1px solid #e5e7eb`,
        paddingBottom: '4px', margin: 0,
      }}>{title}</h2>
    </div>
  )
}

export default function MinimalTemplate({ resume }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements, customSections, settings } = resume
  const color = (accentVars[settings.colorScheme] || accentVars.blue).main
  const activeSet = new Set(settings.activeSections)
  const ordered = settings.sectionOrder.filter(s => activeSet.has(s))

  return (
    <div id="resume-preview" style={{
      width: '210mm', minHeight: '297mm', background: '#fff',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      fontSize: '9.5pt', color: '#222',
      padding: '16mm 18mm', boxSizing: 'border-box', lineHeight: 1.6,
    }}>
      {/* Header */}
      <div style={{ marginBottom: '14px' }}>
        <h1 style={{ fontSize: '24pt', fontWeight: 300, margin: 0, letterSpacing: '0.05em', color: '#111' }}>
          {personalInfo.name || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ margin: '3px 0 8px', color, fontSize: '10pt', fontWeight: 400 }}>
            {personalInfo.title}
          </p>
        )}
        <div style={{ fontSize: '8pt', color: '#777', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          {personalInfo.email    && <span>{personalInfo.email}</span>}
          {personalInfo.phone    && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
          {personalInfo.github   && <span>{personalInfo.github}</span>}
          {personalInfo.website  && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {ordered.map(key => {
        switch (key) {
          case 'summary':
            return summary ? (
              <div key={key}>
                <Heading title="Profile" color={color} />
                <p style={{ margin: 0, color: '#444', fontSize: '9pt' }}>{summary}</p>
              </div>
            ) : null

          case 'experience':
            return experience.length > 0 ? (
              <div key={key}>
                <Heading title="Experience" color={color} />
                {experience.map((e, i) => (
                  <div key={e.id} style={{ marginBottom: i < experience.length - 1 ? '10px' : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '9.5pt' }}>{e.position}</strong>
                      <span style={{ fontSize: '8pt', color: '#888' }}>
                        {fmt(e.startDate)} – {e.current ? 'Present' : fmt(e.endDate)}
                      </span>
                    </div>
                    <div style={{ color: '#666', fontSize: '8.5pt', marginBottom: '3px' }}>
                      {e.company}{e.location ? `, ${e.location}` : ''}
                    </div>
                    {e.description && (
                      <div style={{ fontSize: '8.5pt', color: '#333', whiteSpace: 'pre-line' }}>{e.description}</div>
                    )}
                  </div>
                ))}
              </div>
            ) : null

          case 'education':
            return education.length > 0 ? (
              <div key={key}>
                <Heading title="Education" color={color} />
                {education.map(e => (
                  <div key={e.id} style={{ marginBottom: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{e.institution}</strong>
                      <span style={{ fontSize: '8pt', color: '#888' }}>
                        {fmt(e.startDate)}{e.endDate ? ` – ${fmt(e.endDate)}` : ''}
                      </span>
                    </div>
                    <div style={{ color: '#555', fontSize: '8.5pt' }}>
                      {e.degree}{e.field ? ` in ${e.field}` : ''}{e.gpa ? ` · GPA: ${e.gpa}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            ) : null

          case 'skills':
            return skills.length > 0 ? (
              <div key={key}>
                <Heading title="Skills" color={color} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {skills.map(s => (
                    <div key={s.id} style={{ fontSize: '8.5pt' }}>
                      {s.category && <strong style={{ color: '#333' }}>{s.category}: </strong>}
                      <span style={{ color: '#555' }}>{Array.isArray(s.items) ? s.items.join(', ') : s.items}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null

          case 'projects':
            return projects.length > 0 ? (
              <div key={key}>
                <Heading title="Projects" color={color} />
                {projects.map((p, i) => (
                  <div key={p.id} style={{ marginBottom: i < projects.length - 1 ? '7px' : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>{p.name}</strong>
                      {p.link && <span style={{ fontSize: '7.5pt', color }}>{p.link}</span>}
                    </div>
                    {p.technologies && <div style={{ fontSize: '8pt', color: '#888' }}>{p.technologies}</div>}
                    {p.description && <div style={{ fontSize: '8.5pt', color: '#333' }}>{p.description}</div>}
                  </div>
                ))}
              </div>
            ) : null

          case 'certifications':
            return certifications.length > 0 ? (
              <div key={key}>
                <Heading title="Certifications" color={color} />
                {certifications.map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '8.5pt' }}>
                    <div><strong>{c.name}</strong>{c.issuer && <span style={{ color: '#666' }}> · {c.issuer}</span>}</div>
                    {c.date && <span style={{ color: '#888' }}>{fmt(c.date)}</span>}
                  </div>
                ))}
              </div>
            ) : null

          case 'languages':
            return languages.length > 0 ? (
              <div key={key}>
                <Heading title="Languages" color={color} />
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {languages.map(l => (
                    <span key={l.id} style={{ fontSize: '8.5pt' }}>
                      <strong>{l.language}</strong>{l.proficiency && <span style={{ color: '#666' }}> — {l.proficiency}</span>}
                    </span>
                  ))}
                </div>
              </div>
            ) : null

          case 'achievements':
            return achievements.length > 0 ? (
              <div key={key}>
                <Heading title="Achievements" color={color} />
                {achievements.map((a, i) => (
                  <div key={a.id} style={{ marginBottom: i < achievements.length - 1 ? '5px' : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '8.5pt' }}>{a.title}</strong>
                      {a.date && <span style={{ fontSize: '8pt', color: '#888' }}>{fmt(a.date)}</span>}
                    </div>
                    {a.description && <div style={{ fontSize: '8.5pt', color: '#444' }}>{a.description}</div>}
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
            <Heading title={cs.title} color={color} />
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
  )
}