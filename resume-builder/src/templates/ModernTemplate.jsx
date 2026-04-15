const fmt = (d) => {
  if (!d) return ''
  if (/^\d{4}-\d{2}/.test(d)) {
    const [y, m] = d.split('-')
    return new Date(y, m - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return d
}

const accentVars = {
  blue:    { main: '#2563eb', sidebar: '#1e3a8a', sidebarText: '#bfdbfe' },
  emerald: { main: '#059669', sidebar: '#064e3b', sidebarText: '#a7f3d0' },
  violet:  { main: '#7c3aed', sidebar: '#3b0764', sidebarText: '#ddd6fe' },
  rose:    { main: '#e11d48', sidebar: '#881337', sidebarText: '#fecdd3' },
  slate:   { main: '#475569', sidebar: '#0f172a', sidebarText: '#cbd5e1' },
  amber:   { main: '#d97706', sidebar: '#78350f', sidebarText: '#fde68a' },
}

const fontMap = {
  modern:  "'Geist', system-ui, sans-serif",
  classic: "'Playfair Display', Georgia, serif",
  minimal: "'JetBrains Mono', monospace",
}

function SideHeading({ title, color }) {
  return (
    <div style={{ marginTop: '16px', marginBottom: '6px' }}>
      <h3 style={{
        fontSize: '8pt',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color,
        borderBottom: `1px solid ${color}`,
        paddingBottom: '3px',
        margin: 0,
      }}>
        {title}
      </h3>
    </div>
  )
}

function MainHeading({ title, color }) {
  return (
    <div style={{ marginTop: '14px', marginBottom: '6px' }}>
      <h2 style={{
        fontSize: '9.5pt',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color,
        borderBottom: `2px solid ${color}`,
        paddingBottom: '3px',
        margin: 0,
      }}>
        {title}
      </h2>
    </div>
  )
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
        flexDirection: 'row',
        fontFamily: fontCss,
        fontSize,
        background: '#fff',
      }}
    >

      {/* ══════════════ SIDEBAR ══════════════ */}
      <div style={{
        width: '68mm',
        minHeight: '297mm',
        background: scheme.sidebar,
        color: '#fff',
        padding: '14mm 8mm 14mm 9mm',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}>

        {/* Name & Title */}
        <div style={{ borderBottom: `1px solid rgba(255,255,255,0.2)`, paddingBottom: '10px', marginBottom: '4px' }}>
          <h1 style={{
            fontSize: '14pt',
            fontWeight: 700,
            margin: 0,
            color: '#fff',
            lineHeight: 1.2,
          }}>
            {personalInfo.name || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p style={{
              fontSize: '8pt',
              color: scheme.sidebarText,
              margin: '5px 0 0',
              lineHeight: 1.4,
            }}>
              {personalInfo.title}
            </p>
          )}
        </div>

        {/* Contact */}
        <SideHeading title="Contact" color={scheme.sidebarText} />
        <div style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 }}>
          {personalInfo.email    && <div>✉ {personalInfo.email}</div>}
          {personalInfo.phone    && <div>📞 {personalInfo.phone}</div>}
          {personalInfo.location && <div>📍 {personalInfo.location}</div>}
          {personalInfo.linkedin && <div>🔗 {personalInfo.linkedin}</div>}
          {personalInfo.github   && <div>💻 {personalInfo.github}</div>}
          {personalInfo.website  && <div>🌐 {personalInfo.website}</div>}
        </div>

        {/* Skills */}
        {activeSet.has('skills') && skills.length > 0 && (
          <div>
            <SideHeading title="Skills" color={scheme.sidebarText} />
            {skills.map(s => (
              <div key={s.id} style={{ marginBottom: '6px' }}>
                {s.category && (
                  <div style={{ fontSize: '7.5pt', fontWeight: 700, color: scheme.sidebarText, marginBottom: '2px' }}>
                    {s.category}
                  </div>
                )}
                <div style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
                  {Array.isArray(s.items) ? s.items.join(' · ') : s.items}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {activeSet.has('languages') && languages.length > 0 && (
          <div>
            <SideHeading title="Languages" color={scheme.sidebarText} />
            {languages.map(l => (
              <div key={l.id} style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.85)', marginBottom: '3px' }}>
                <strong style={{ color: '#fff' }}>{l.language}</strong>
                {l.proficiency && <span> — {l.proficiency}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {activeSet.has('certifications') && certifications.length > 0 && (
          <div>
            <SideHeading title="Certifications" color={scheme.sidebarText} />
            {certifications.map(c => (
              <div key={c.id} style={{ marginBottom: '6px' }}>
                <div style={{ fontSize: '7.5pt', color: '#fff', fontWeight: 600, lineHeight: 1.4 }}>{c.name}</div>
                {c.issuer && <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.7)' }}>{c.issuer}</div>}
                {c.date   && <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.6)' }}>{fmt(c.date)}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {activeSet.has('achievements') && achievements.length > 0 && (
          <div>
            <SideHeading title="Achievements" color={scheme.sidebarText} />
            {achievements.map(a => (
              <div key={a.id} style={{ marginBottom: '6px' }}>
                <div style={{ fontSize: '7.5pt', color: '#fff', fontWeight: 600, lineHeight: 1.4 }}>{a.title}</div>
                {a.date        && <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.6)' }}>{fmt(a.date)}</div>}
                {a.description && <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.75)', marginTop: '2px', lineHeight: 1.5 }}>{a.description}</div>}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ══════════════ MAIN COLUMN ══════════════ */}
      <div style={{
        flex: 1,
        padding: '14mm 12mm 14mm 10mm',
        boxSizing: 'border-box',
        minHeight: '297mm',
      }}>

        {/* Summary */}
        {activeSet.has('summary') && summary && (
          <div>
            <MainHeading title="Professional Summary" color={scheme.main} />
            <p style={{ margin: 0, color: '#333', lineHeight: 1.6, fontSize: '9pt' }}>{summary}</p>
          </div>
        )}

        {/* Experience */}
        {activeSet.has('experience') && experience.length > 0 && (
          <div>
            <MainHeading title="Work Experience" color={scheme.main} />
            {experience.map((e, i) => (
              <div key={e.id} style={{ marginBottom: i < experience.length - 1 ? '10px' : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '10pt', color: '#111' }}>{e.position}</strong>
                  <span style={{ fontSize: '7.5pt', color: '#777' }}>
                    {fmt(e.startDate)} – {e.current ? 'Present' : fmt(e.endDate)}
                  </span>
                </div>
                <div style={{ fontSize: '8.5pt', color: scheme.main, fontWeight: 600, marginBottom: '3px' }}>
                  {e.company}{e.location ? ` · ${e.location}` : ''}
                </div>
                {e.description && (
                  <div style={{ fontSize: '8.5pt', color: '#333', whiteSpace: 'pre-line', lineHeight: 1.55 }}>
                    {e.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {activeSet.has('education') && education.length > 0 && (
          <div>
            <MainHeading title="Education" color={scheme.main} />
            {education.map(e => (
              <div key={e.id} style={{ marginBottom: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '10pt' }}>{e.institution}</strong>
                  <span style={{ fontSize: '7.5pt', color: '#777' }}>
                    {fmt(e.startDate)}{e.endDate ? ` – ${fmt(e.endDate)}` : ''}
                  </span>
                </div>
                <div style={{ fontSize: '8.5pt', color: '#555' }}>
                  {e.degree}{e.field ? ` in ${e.field}` : ''}
                  {e.gpa ? ` · GPA: ${e.gpa}` : ''}
                </div>
                {e.description && (
                  <div style={{ fontSize: '8pt', color: '#666', marginTop: '2px' }}>{e.description}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {activeSet.has('projects') && projects.length > 0 && (
          <div>
            <MainHeading title="Projects" color={scheme.main} />
            {projects.map((p, i) => (
              <div key={p.id} style={{ marginBottom: i < projects.length - 1 ? '8px' : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '9.5pt' }}>{p.name}</strong>
                  {p.link && <span style={{ fontSize: '7.5pt', color: scheme.main }}>{p.link}</span>}
                </div>
                {p.technologies && (
                  <div style={{ fontSize: '8pt', color: scheme.main, marginBottom: '2px' }}>
                    Tech: {p.technologies}
                  </div>
                )}
                {p.description && (
                  <div style={{ fontSize: '8.5pt', color: '#333', lineHeight: 1.5 }}>{p.description}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Custom Sections */}
        {customSections && customSections.map(cs => (
          cs.items && cs.items.length > 0 ? (
            <div key={cs.id}>
              <MainHeading title={cs.title} color={scheme.main} />
              {cs.items.map(item => (
                <div key={item.id} style={{ marginBottom: '6px' }}>
                  {item.title && <strong style={{ fontSize: '9.5pt' }}>{item.title}</strong>}
                  {item.description && (
                    <div style={{ fontSize: '8.5pt', color: '#333', marginTop: '2px' }}>{item.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : null
        ))}

      </div>
    </div>
  )
}