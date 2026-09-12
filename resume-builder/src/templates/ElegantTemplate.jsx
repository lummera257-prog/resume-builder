import { fmt } from '../utils/formatDate'

const accentVars = {
  blue:    { main: '#1e3a8a' },
  emerald: { main: '#064e3b' },
  violet:  { main: '#4c1d95' },
  rose:    { main: '#881337' },
  slate:   { main: '#1e293b' },
  amber:   { main: '#78350f' },
}

function Heading({ title, color }) {
  return (
    <div style={{ textAlign: 'center', margin: '14px 0 8px' }}>
      <h2 style={{
        fontSize: '8.5pt', fontWeight: 700, letterSpacing: '0.25em',
        textTransform: 'uppercase', color, margin: 0,
      }}>{title}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
        <div style={{ flex: 1, height: '0.5px', background: '#ccc' }} />
        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color }} />
        <div style={{ flex: 1, height: '0.5px', background: '#ccc' }} />
      </div>
    </div>
  )
}

function TimelineEntry({ left, title, sub, color, desc, className }) {
  return (
    <div className={className} style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
      <div style={{ width: '52px', flexShrink: 0, textAlign: 'right', fontSize: '7.5pt', color: '#888', paddingTop: '1px', lineHeight: 1.4 }}>
        {left}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '3px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: `2px solid ${color}`, background: '#fff', flexShrink: 0 }} />
        <div style={{ flex: 1, width: '1px', background: '#e5e7eb', marginTop: '2px' }} />
      </div>
      <div style={{ flex: 1 }}>
        <strong style={{ fontSize: '9.5pt', color: '#111' }}>{title}</strong>
        {sub && <div style={{ fontSize: '8.5pt', color, marginBottom: '3px' }}>{sub}</div>}
        {desc && <div style={{ fontSize: '8.5pt', color: '#444', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{desc}</div>}
      </div>
    </div>
  )
}

export default function ElegantTemplate({ resume }) {
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, achievements, customSections, settings } = resume
  const color = (accentVars[settings.colorScheme] || accentVars.blue).main
  const activeSet = new Set(settings.activeSections)
  const ordered = settings.sectionOrder.filter(s => activeSet.has(s))

  return (
    /* ── Scroll wrapper ── */
    <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
      <div
        id="resume-preview"
        style={{
          width: '210mm',
          background: '#fff',
          fontFamily: "'Georgia', serif",
          fontSize: '9.5pt',
          color: '#222',
          padding: '14mm 16mm',
          boxSizing: 'border-box',
          lineHeight: 1.6,
          margin: '0 auto',
        }}
      >
        {/* Centered Header */}
        <div style={{ textAlign: 'center', borderBottom: `1px solid #ddd`, paddingBottom: '12px', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '26pt', fontWeight: 700, margin: 0, letterSpacing: '0.04em', color: '#111' }}>
            {personalInfo.name || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p style={{ margin: '4px 0 8px', color, fontSize: '10.5pt', fontStyle: 'italic' }}>
              {personalInfo.title}
            </p>
          )}
          <div style={{ fontSize: '8pt', color: '#666', display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            {personalInfo.email    && <span>✉ {personalInfo.email}</span>}
            {personalInfo.phone    && <span>📞 {personalInfo.phone}</span>}
            {personalInfo.location && <span>📍 {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
            {personalInfo.github   && <span>💻 {personalInfo.github}</span>}
            {personalInfo.website  && <span>🌐 {personalInfo.website}</span>}
          </div>
        </div>

        {ordered.map(key => {
          switch (key) {
            case 'summary':
              return summary ? (
                <div key={key}>
                  <Heading title="About Me" color={color} />
                  <p style={{ margin: '0 8mm', textAlign: 'justify', color: '#333', fontSize: '9pt' }}>{summary}</p>
                </div>
              ) : null

            case 'experience':
              return experience.length > 0 ? (
                <div key={key}>
                  <Heading title="Work Experience" color={color} />
                  {experience.map(e => (
                    <TimelineEntry key={e.id}
                      className="no-break"
                      left={<>{fmt(e.startDate)}<br />–<br />{e.current ? 'Present' : fmt(e.endDate)}</>}
                      title={e.position}
                      sub={`${e.company}${e.location ? ` · ${e.location}` : ''}`}
                      color={color}
                      desc={e.description}
                    />
                  ))}
                </div>
              ) : null

            case 'education':
              return education.length > 0 ? (
                <div key={key}>
                  <Heading title="Education" color={color} />
                  {education.map(e => (
                    <TimelineEntry key={e.id}
                      className="no-break"
                      left={<>{fmt(e.startDate)}<br />–<br />{fmt(e.endDate)}</>}
                      title={e.institution}
                      sub={`${e.degree}${e.field ? ` in ${e.field}` : ''}${e.gpa ? ` · GPA: ${e.gpa}` : ''}`}
                      color={color}
                      desc={e.description}
                    />
                  ))}
                </div>
              ) : null

            case 'skills':
              return skills.length > 0 ? (
                <div key={key}>
                  <Heading title="Skills" color={color} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                    {skills.map(s => (
                      <div key={s.id} style={{ textAlign: 'center', fontSize: '8.5pt' }}>
                        {s.category && <div style={{ fontWeight: 700, color, fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.category}</div>}
                        <div style={{ color: '#444' }}>{Array.isArray(s.items) ? s.items.join(' · ') : s.items}</div>
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
                    <div key={p.id} className="no-break" style={{ marginBottom: i < projects.length - 1 ? '8px' : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '9.5pt' }}>{p.name}</strong>
                        {p.link && <span style={{ fontSize: '7.5pt', color }}>{p.link}</span>}
                      </div>
                      {p.technologies && <div style={{ fontSize: '8pt', color, fontStyle: 'italic' }}>{p.technologies}</div>}
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
                    <div key={c.id} className="no-break" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '8.5pt' }}>
                      <div><strong>{c.name}</strong>{c.issuer && <span style={{ color: '#555', fontStyle: 'italic' }}> · {c.issuer}</span>}</div>
                      {c.date && <span style={{ color: '#888' }}>{fmt(c.date)}</span>}
                    </div>
                  ))}
                </div>
              ) : null

            case 'languages':
              return languages.length > 0 ? (
                <div key={key}>
                  <Heading title="Languages" color={color} />
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    {languages.map(l => (
                      <span key={l.id} style={{ fontSize: '8.5pt' }}>
                        <strong>{l.language}</strong>{l.proficiency && <span style={{ color: '#666', fontStyle: 'italic' }}> — {l.proficiency}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null

            case 'achievements':
              return achievements.length > 0 ? (
                <div key={key}>
                  <Heading title="Achievements & Awards" color={color} />
                  {achievements.map((a, i) => (
                    <div key={a.id} className="no-break" style={{ marginBottom: i < achievements.length - 1 ? '5px' : 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '9pt' }}>{a.title}</strong>
                        {a.date && <span style={{ fontSize: '8pt', color: '#888' }}>{fmt(a.date)}</span>}
                      </div>
                      {a.description && <div style={{ fontSize: '8.5pt', color: '#444', fontStyle: 'italic' }}>{a.description}</div>}
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
                  {item.description && <p style={{ margin: '2px 0', color: '#333', fontStyle: 'italic' }}>{item.description}</p>}
                </div>
              ))}
            </div>
          ) : null
        ))}
      </div>
    </div>
  )
}