import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'

export default function ResumeTemplates() {
  useEffect(() => {
    document.title = 'Free Resume Templates 2026 | ATS-Friendly Designs | ResumeForge'
    let m = document.querySelector('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = 'Browse free professional resume templates. ATS-friendly, modern and classic designs. Download as PDF instantly. No login required.'
    let c = document.querySelector('link[rel="canonical"]')
    if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c) }
    c.href = 'https://freeresumeforgebuilder.com/resume-templates'
  }, [])

  const faqs = [
    { q: 'Are these resume templates free?', a: 'Yes, all ResumeForge templates are completely free to use and download.' },
    { q: 'Which template is best for ATS?', a: 'The Classic (Clarity) template is the most ATS-friendly. It uses a clean single-column layout that all ATS systems can parse correctly.' },
    { q: 'Can I customize the template colors?', a: 'Yes. ResumeForge lets you choose from 6 color schemes for each template.' },
    { q: 'Which template is best for freshers?', a: 'Both templates work well for freshers. The Classic template is recommended for traditional industries, while Modern suits creative and tech roles.' },
  ]

  const templates = [
    { name: 'Classic (Clarity)', icon: '📄', desc: 'Single-column, clean ATS-friendly design. Best for corporate, finance, and traditional roles.', tags: ['ATS-Safe', 'Single Column', 'Professional'] },
    { name: 'Modern (Prism)', icon: '✨', desc: 'Two-column design with sidebar. Best for tech, creative, and design-forward roles.', tags: ['Modern', 'Two Column', 'Visual'] },
  ]

  return (
    <PageLayout>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1a1a2e' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', padding: '72px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>
            Free Resume Templates
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            Professional, ATS-friendly resume templates. Pick your style and build your resume for free.
          </p>
          <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
            🚀 Use Templates Free
          </Link>
        </div>

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '20px' }}>Available Resume Templates</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {templates.map((t, i) => (
              <div key={i} style={{ background: '#fff', border: '2px solid #e5e7eb', borderRadius: '16px', padding: '28px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{t.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e3a5f', margin: '0 0 8px' }}>{t.name}</h3>
                <p style={{ fontSize: '0.875rem', color: '#555', lineHeight: 1.6, margin: '0 0 16px' }}>{t.desc}</p>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {t.tags.map((tag, j) => (
                    <span key={j} style={{ background: '#f0f4ff', color: '#2563eb', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>
                <Link to="/" style={{ background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block' }}>Use This Template</Link>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '16px' }}>How to Choose the Right Resume Template</h2>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '16px' }}>Choosing the right resume template depends on your industry and the role you're applying for. For most corporate and traditional jobs, a clean single-column template is the safest choice. For tech, creative, and startup roles, a modern two-column layout can help you stand out.</p>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '32px' }}>Most importantly, make sure your template is ATS-compatible. Fancy graphics and columns can confuse automated screening software and get your resume rejected before a human ever reads it.</p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', margin: '40px 0 20px' }}>Frequently Asked Questions</h2>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 8px', color: '#1e3a5f' }}>{f.q}</h3>
              <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.a}</p>
            </div>
          ))}

          <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: '16px', padding: '40px', textAlign: 'center', marginTop: '40px' }}>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 12px' }}>Start With a Free Template</h2>
            <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
              🚀 Create Your Free Resume Now
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}