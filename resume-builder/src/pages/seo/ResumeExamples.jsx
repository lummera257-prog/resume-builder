import { useEffect } from 'react'; import { Link } from 'react-router-dom'; import PageLayout from '../../components/PageLayout'
export default function ResumeExamples() {
  useEffect(() => {
    document.title = 'Resume Examples 2026 | Professional Resume Samples | ResumeForge'
    let m = document.querySelector('meta[name="description"]'); if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = 'Browse professional resume examples for all industries and experience levels. Use free templates and build your resume instantly.'
    let c = document.querySelector('link[rel="canonical"]'); if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c) }
    c.href = 'https://freeresumeforgebuilder.com/resume-examples'
  }, [])
  const examples = [
    { role: 'Software Engineer', level: 'Mid-Senior', tags: ['Tech', 'Engineering'] },
    { role: 'Product Manager', level: 'Mid-Level', tags: ['Product', 'Management'] },
    { role: 'Fresh Graduate', level: 'Entry Level', tags: ['Fresher', 'Student'] },
    { role: 'Data Scientist', level: 'Senior', tags: ['Data', 'ML/AI'] },
    { role: 'Marketing Manager', level: 'Mid-Level', tags: ['Marketing', 'Growth'] },
    { role: 'UX Designer', level: 'Mid-Level', tags: ['Design', 'Creative'] },
  ]
  return (
    <PageLayout>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1a1a2e' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', padding: '72px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>Professional Resume Examples</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.7 }}>Browse resume examples for all roles and experience levels. Use our free builder to create yours in minutes.</p>
          <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>🚀 Build My Resume Free</Link>
        </div>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '20px' }}>Resume Examples by Role</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {examples.map((e, i) => (
              <div key={i} style={{ background: '#f8faff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e3a5f', margin: '0 0 6px' }}>{e.role}</h3>
                <p style={{ fontSize: '0.8rem', color: '#888', margin: '0 0 12px' }}>{e.level}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  {e.tags.map((t, j) => <span key={j} style={{ background: '#e0e7ff', color: '#3730a3', padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>{t}</span>)}
                </div>
                <Link to="/" style={{ background: '#2563eb', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none', display: 'inline-block' }}>Use This Example</Link>
              </div>
            ))}
          </div>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '16px' }}>The best resume examples share common traits: they are concise, use strong action verbs, quantify achievements, and are tailored to the specific role. Use these examples as inspiration — then build your own with ResumeForge for free.</p>
          <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: '16px', padding: '40px', textAlign: 'center', marginTop: '40px' }}>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 12px' }}>Create Your Own Professional Resume</h2>
            <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>🚀 Create Your Free Resume Now</Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}