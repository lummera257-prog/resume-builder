/**
 * CLARITY TEMPLATE — Classic single-column, ATS-optimised
 * Clean, minimal, professional. Passes all major ATS scanners.
 */

// color/font maps defined inline — no external import needed

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
    <div className="mb-3 mt-5 first:mt-0">
      <h2 style={{ color, fontFamily: 'inherit', fontSize: '10pt', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0, paddingBottom: '4px', borderBottom: `2px solid ${color}` }}>
        {title}
      </h2>
    </div>
  )
}

// ─── Main template ────────────────────────────────────────────────────────────
export default function ClassicTemplate({ resume }) {
  const { personalInfo, summary, experience, education, skills, projects,
    certifications, languages, achievements, customSections, settings } = resume

  const scheme  = accentVars[settings.colorScheme] || accentVars.blue
  const fontCss = fontMap[settings.fontFamily] || fontMap.modern
  const fontSize = settings.fontSize === 'small' ? '9.5pt' : settings.fontSize === 'large' ? '11pt' : '10pt'

  const activeSet = new Set(settings.activeSections)
  const orderedSections = settings.sectionOrder.filter(s => activeSet.has(s))

  // Section renderer map
  const renderSection = (key) => {
    switch (key) {
      case 'summary':        return summary        ? <SummarySection key={key} summary={summary} color={scheme.main} /> : null
      case 'experience':     return experience.length     ? <ExperienceSection key={key} items={experience} color={scheme.main} /> : null
      case 'education':      return education.length      ? <EducationSection key={key} items={education} color={scheme.main} /> : null
      case 'skills':         return skills.length         ? <SkillsSection key={key} items={skills} color={scheme.main} light={scheme.light} border={scheme.border} /> : null
      case 'projects':       return projects.length       ? <ProjectsSection key={key} items={projects} color={scheme.main} /> : null
      case 'certifications': return certifications.length ? <CertsSection key={key} items={certifications} color={scheme.main} /> : null
      case 'languages':      return languages.length      ? <LangsSection key={key} items={languages} color={scheme.main} /> : null
      case 'achievements':   return achievements.length   ? <AchievementsSection key={key} items={achievements} color={scheme.main} /> : null
      default: return null
    }
  }

  return (
    <div
      id="resume-preview"
      style={{
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#ffffff',
        fontFamily: fontCss,
        fontSize,
        color: '#1a1a1a',
        padding: '14mm 16mm',
        boxSizing: 'border-box',
        lineHeight: 1.45,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: `3px solid ${scheme.main}` }}>
        <h1 style={{ margin: '0 0 2px 0', fontSize: '22pt', fontWeight: 700, color: scheme.dark, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {personalInfo.name || 'Your Name'}
        </h1>
        {personalInfo.title && (
          <p style={{ margin: '0 0 6px 0', fontSize: '11pt', color: scheme.main, fontWeight: 500 }}>
            {personalInfo.title}
          </p>
        )}
        {/* Contact line */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: '8.5pt', color: '#555' }}>
          {personalInfo.email    && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone    && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          {personalInfo.github   && <span>💻 {personalInfo.github}</span>}
          {personalInfo.website  && <span>🌐 {personalInfo.website}</span>}
        </div>
      </div>

      {/* ── Sections in user-defined order ─────────────────────────────────── */}
      {orderedSections.map(renderSection)}

      {/* ── Custom sections ─────────────────────────────────────────────────── */}
      {customSections.map(cs => cs.entries?.length > 0 && (
        <div key={cs.id}>
          <SectionHeading title={cs.title || 'Other'} color={scheme.main} />
          {cs.entries.map(entry => (
            <div key={entry.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '10pt' }}>{entry.title}</strong>
                <span style={{ fontSize: '8.5pt', color: '#666' }}>{entry.subtitle}</span>
              </div>
              {entry.description && <p style={{ margin: '2px 0 0 0', fontSize: '9pt', color: '#444' }}>{entry.description}</p>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Section components ─────────────────────────────────────────────────────────

function SummarySection({ summary, color }) {
  return (
    <div>
      <SectionHeading title="Professional Summary" color={color} />
      <p style={{ margin: 0, fontSize: '9.5pt', color: '#333', lineHeight: 1.55 }}>{summary}</p>
    </div>
  )
}

function ExperienceSection({ items, color }) {
  return (
    <div>
      <SectionHeading title="Work Experience" color={color} />
      {items.map(exp => (
        <div key={exp.id} style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1px' }}>
            <div>
              <strong style={{ fontSize: '10.5pt', color: '#111' }}>{exp.position}</strong>
              <span style={{ fontSize: '9.5pt', color: '#444' }}> · {exp.company}</span>
              {exp.location && <span style={{ fontSize: '8.5pt', color: '#888' }}> · {exp.location}</span>}
            </div>
            <span style={{ fontSize: '8.5pt', color: '#666', whiteSpace: 'nowrap', marginLeft: '8px' }}>
              {fmt(exp.startDate)} – {exp.current ? 'Present' : fmt(exp.endDate)}
            </span>
          </div>
          {exp.description && (
            <div style={{ fontSize: '9pt', color: '#333', lineHeight: 1.5, marginTop: '3px', whiteSpace: 'pre-line' }}>
              {exp.description}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function EducationSection({ items, color }) {
  return (
    <div>
      <SectionHeading title="Education" color={color} />
      {items.map(edu => (
        <div key={edu.id} style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <strong style={{ fontSize: '10.5pt', color: '#111' }}>{edu.institution}</strong>
              <div style={{ fontSize: '9.5pt', color: '#444' }}>
                {edu.degree}{edu.field ? ` in ${edu.field}` : ''}
                {edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
              </div>
            </div>
            <span style={{ fontSize: '8.5pt', color: '#666', whiteSpace: 'nowrap', marginLeft: '8px' }}>
              {fmt(edu.startDate)}{edu.endDate ? ` – ${fmt(edu.endDate)}` : ''}
            </span>
          </div>
          {edu.description && <p style={{ margin: '2px 0 0 0', fontSize: '9pt', color: '#555' }}>{edu.description}</p>}
        </div>
      ))}
    </div>
  )
}

function SkillsSection({ items, color, light, border }) {
  return (
    <div>
      <SectionHeading title="Skills" color={color} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {items.map(skill => (
          <div key={skill.id} style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
            {skill.category && (
              <span style={{ fontSize: '9pt', fontWeight: 600, color: color, minWidth: '100px', flexShrink: 0 }}>
                {skill.category}:
              </span>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {(Array.isArray(skill.items) ? skill.items : (skill.items || '').split(',')).map((s, idx) => {
                const label = s.trim()
                return label ? (
                  <span key={idx} style={{ fontSize: '8.5pt', backgroundColor: light, border: `1px solid ${border}`, color: '#333', padding: '1px 7px', borderRadius: '3px' }}>
                    {label}
                  </span>
                ) : null
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectsSection({ items, color }) {
  return (
    <div>
      <SectionHeading title="Projects" color={color} />
      {items.map(proj => (
        <div key={proj.id} style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <strong style={{ fontSize: '10pt', color: '#111' }}>{proj.name}</strong>
            {proj.link && <span style={{ fontSize: '8pt', color: color }}>{proj.link}</span>}
          </div>
          {proj.technologies && (
            <p style={{ margin: '1px 0', fontSize: '8.5pt', color: '#777', fontStyle: 'italic' }}>
              Tech: {proj.technologies}
            </p>
          )}
          {proj.description && (
            <p style={{ margin: '2px 0 0 0', fontSize: '9pt', color: '#333', lineHeight: 1.5 }}>{proj.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}

function CertsSection({ items, color }) {
  return (
    <div>
      <SectionHeading title="Certifications" color={color} />
      {items.map(cert => (
        <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', alignItems: 'baseline' }}>
          <div>
            <strong style={{ fontSize: '9.5pt', color: '#111' }}>{cert.name}</strong>
            {cert.issuer && <span style={{ fontSize: '9pt', color: '#555' }}> · {cert.issuer}</span>}
          </div>
          <span style={{ fontSize: '8.5pt', color: '#666', whiteSpace: 'nowrap', marginLeft: '8px' }}>{fmt(cert.date)}</span>
        </div>
      ))}
    </div>
  )
}

function LangsSection({ items, color }) {
  return (
    <div>
      <SectionHeading title="Languages" color={color} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px' }}>
        {items.map(lang => (
          <span key={lang.id} style={{ fontSize: '9pt' }}>
            <strong style={{ color: '#111' }}>{lang.language}</strong>
            <span style={{ color: '#666' }}> — {lang.proficiency}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function AchievementsSection({ items, color }) {
  return (
    <div>
      <SectionHeading title="Achievements" color={color} />
      {items.map(ach => (
        <div key={ach.id} style={{ marginBottom: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <strong style={{ fontSize: '9.5pt', color: '#111' }}>{ach.title}</strong>
            {ach.date && <span style={{ fontSize: '8.5pt', color: '#666' }}>{fmt(ach.date)}</span>}
          </div>
          {ach.description && <p style={{ margin: '2px 0 0 0', fontSize: '9pt', color: '#444', lineHeight: 1.45 }}>{ach.description}</p>}
        </div>
      ))}
    </div>
  )
}
