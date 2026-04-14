/**
 * PRISM TEMPLATE — Modern two-column layout with sidebar
 * Sidebar: contact, skills, languages, certifications
 * Main:    summary, experience, education, projects, achievements
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

// ─── Sidebar section heading ──────────────────────────────────────────────────
function SideHeading({ title, color }) {
  return (
    <h2 style={{ fontSize: '7.5pt', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
      color, borderBottom: `1px solid ${color}40`, paddingBottom: '4px', marginBottom: '8px', marginTop: '14px' }}>
      {title}
    </h2>
  )
}

// ─── Main column section heading ──────────────────────────────────────────────
function MainHeading({ title, color }) {
  return (
    <h2 style={{ fontSize: '9.5pt', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
      color, borderBottom: `2px solid ${color}`, paddingBottom: '3px', marginBottom: '9px', marginTop: '14px' }}>
      {title}
    </h2>
  )
}

// ─── Main template ────────────────────────────────────────────────────────────
export default function ModernTemplate({ resume }) {
  const { personalInfo, summary, experience, education, skills, projects,
    certifications, languages, achievements, customSections, settings } = resume

  const scheme   = accentVars[settings.colorScheme] || accentVars.blue
  const fontCss  = fontMap[settings.fontFamily] || fontMap.modern
  const fontSize = settings.fontSize === 'small' ? '9pt' : settings.fontSize === 'large' ? '10.5pt' : '9.5pt'

  const activeSet = new Set(settings.activeSections)

  return (
    <div
      id="resume-preview"
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#ffffff',
        fontFamily: fontCss,
        fontSize,
        display: 'flex',
        boxSizing: 'border-box',
        lineHeight: 1.45,
      }}
    >
      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <div style={{
        width: '66mm',
        flexShrink: 0,
        backgroundColor: scheme.sidebar,
        color: '#e2e8f0',
        padding: '14mm 8mm',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Avatar / initials */}
        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: `${scheme.main}99`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px',
            fontSize: '20pt', fontWeight: 700, color: '#fff' }}>
            {(personalInfo.name || 'Y').charAt(0).toUpperCase()}
          </div>
          <h1 style={{ margin: 0, fontSize: '12pt', fontWeight: 700, color: '#fff', lineHeight: 1.2, textAlign: 'center' }}>
            {personalInfo.name || 'Your Name'}
          </h1>
          {personalInfo.title && (
            <p style={{ margin: '4px 0 0', fontSize: '8pt', color: scheme.sidebarText, textAlign: 'center', lineHeight: 1.3 }}>
              {personalInfo.title}
            </p>
          )}
        </div>

        {/* Contact */}
        <SideHeading title="Contact" color={scheme.sidebarText} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[
            { icon: '✉', val: personalInfo.email },
            { icon: '📞', val: personalInfo.phone },
            { icon: '📍', val: personalInfo.location },
            { icon: '🔗', val: personalInfo.linkedin },
            { icon: '💻', val: personalInfo.github },
            { icon: '🌐', val: personalInfo.website },
          ].filter(c => c.val).map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '8pt', flexShrink: 0, marginTop: '1px' }}>{c.icon}</span>
              <span style={{ fontSize: '7.5pt', color: '#d1d5db', wordBreak: 'break-all', lineHeight: 1.4 }}>{c.val}</span>
            </div>
          ))}
        </div>

        {/* Skills in sidebar */}
        {activeSet.has('skills') && skills.length > 0 && (
          <>
            <SideHeading title="Skills" color={scheme.sidebarText} />
            {skills.map(skill => (
              <div key={skill.id} style={{ marginBottom: '7px' }}>
                {skill.category && (
                  <p style={{ margin: '0 0 4px', fontSize: '7.5pt', fontWeight: 600, color: scheme.sidebarText }}>
                    {skill.category}
                  </p>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                  {(Array.isArray(skill.items) ? skill.items : (skill.items || '').split(',')).map((s, idx) => {
                    const label = s.trim()
                    return label ? (
                      <span key={idx} style={{ fontSize: '7pt', backgroundColor: '#ffffff15', border: '1px solid #ffffff20',
                        color: '#d1d5db', padding: '1px 5px', borderRadius: '2px' }}>
                        {label}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Languages in sidebar */}
        {activeSet.has('languages') && languages.length > 0 && (
          <>
            <SideHeading title="Languages" color={scheme.sidebarText} />
            {languages.map(lang => (
              <div key={lang.id} style={{ marginBottom: '5px' }}>
                <p style={{ margin: 0, fontSize: '8pt', fontWeight: 600, color: '#fff' }}>{lang.language}</p>
                <p style={{ margin: 0, fontSize: '7pt', color: '#9ca3af' }}>{lang.proficiency}</p>
              </div>
            ))}
          </>
        )}

        {/* Certifications in sidebar */}
        {activeSet.has('certifications') && certifications.length > 0 && (
          <>
            <SideHeading title="Certifications" color={scheme.sidebarText} />
            {certifications.map(cert => (
              <div key={cert.id} style={{ marginBottom: '6px' }}>
                <p style={{ margin: 0, fontSize: '7.5pt', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{cert.name}</p>
                <p style={{ margin: '1px 0 0', fontSize: '7pt', color: '#9ca3af' }}>{cert.issuer} {cert.date ? `· ${fmt(cert.date)}` : ''}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── MAIN COLUMN ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: '12mm 10mm 14mm', overflow: 'hidden' }}>

        {/* Summary */}
        {activeSet.has('summary') && summary && (
          <div>
            <MainHeading title="Profile" color={scheme.main} />
            <p style={{ margin: 0, fontSize: '9pt', color: '#374151', lineHeight: 1.6 }}>{summary}</p>
          </div>
        )}

        {/* Experience */}
        {activeSet.has('experience') && experience.length > 0 && (
          <div>
            <MainHeading title="Experience" color={scheme.main} />
            {experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '10pt', color: '#111827' }}>{exp.position}</strong>
                    <p style={{ margin: '1px 0 0', fontSize: '8.5pt', color: scheme.main, fontWeight: 600 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  </div>
                  <span style={{ fontSize: '8pt', color: '#6b7280', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {fmt(exp.startDate)} – {exp.current ? 'Present' : fmt(exp.endDate)}
                  </span>
                </div>
                {exp.description && (
                  <div style={{ marginTop: '4px', fontSize: '8.5pt', color: '#374151', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                    {exp.description}
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
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: '10pt', color: '#111827' }}>{edu.institution}</strong>
                    <p style={{ margin: '1px 0 0', fontSize: '8.5pt', color: '#555' }}>
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ''}{edu.gpa ? ` · ${edu.gpa}` : ''}
                    </p>
                  </div>
                  <span style={{ fontSize: '8pt', color: '#6b7280', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {fmt(edu.startDate)}{edu.endDate ? ` – ${fmt(edu.endDate)}` : ''}
                  </span>
                </div>
                {edu.description && <p style={{ margin: '2px 0 0', fontSize: '8.5pt', color: '#6b7280' }}>{edu.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {activeSet.has('projects') && projects.length > 0 && (
          <div>
            <MainHeading title="Projects" color={scheme.main} />
            {projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '9px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '9.5pt', color: '#111827' }}>{proj.name}</strong>
                  {proj.link && <span style={{ fontSize: '7.5pt', color: scheme.main }}>{proj.link}</span>}
                </div>
                {proj.technologies && <p style={{ margin: '1px 0', fontSize: '8pt', color: '#9ca3af', fontStyle: 'italic' }}>Tech: {proj.technologies}</p>}
                {proj.description && <p style={{ margin: '2px 0 0', fontSize: '8.5pt', color: '#374151', lineHeight: 1.5 }}>{proj.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Achievements */}
        {activeSet.has('achievements') && achievements.length > 0 && (
          <div>
            <MainHeading title="Achievements" color={scheme.main} />
            {achievements.map(ach => (
              <div key={ach.id} style={{ marginBottom: '7px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '9.5pt', color: '#111827' }}>{ach.title}</strong>
                  {ach.date && <span style={{ fontSize: '8pt', color: '#6b7280' }}>{fmt(ach.date)}</span>}
                </div>
                {ach.description && <p style={{ margin: '2px 0 0', fontSize: '8.5pt', color: '#374151', lineHeight: 1.45 }}>{ach.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Custom sections */}
        {customSections.map(cs => cs.entries?.length > 0 && (
          <div key={cs.id}>
            <MainHeading title={cs.title || 'Other'} color={scheme.main} />
            {cs.entries.map(entry => (
              <div key={entry.id} style={{ marginBottom: '7px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '9.5pt', color: '#111827' }}>{entry.title}</strong>
                  <span style={{ fontSize: '8pt', color: '#6b7280' }}>{entry.subtitle}</span>
                </div>
                {entry.description && <p style={{ margin: '2px 0 0', fontSize: '8.5pt', color: '#374151' }}>{entry.description}</p>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
