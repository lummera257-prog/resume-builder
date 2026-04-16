import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'

export default function CvBuilder() {
  useEffect(() => {
    document.title = 'Free CV Builder Online 2026 | Professional CV Maker | ResumeForge'
    let m = document.querySelector('meta[name="description"]')
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = 'Create a professional CV online for free. No login required. ATS-friendly CV templates, instant PDF download. Build your CV in minutes.'
    let c = document.querySelector('link[rel="canonical"]')
    if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c) }
    c.href = 'https://freeresumeforgebuilder.com/cv-builder'
  }, [])

  const faqs = [
    { q: 'What is the difference between a CV and a resume?', a: 'A CV (Curriculum Vitae) is a detailed document listing your full academic and professional history. A resume is a shorter, targeted summary for a specific job.' },
    { q: 'Is this CV builder free?', a: 'Yes, completely free. No login, no payment, no hidden charges.' },
    { q: 'Can I use this for international job applications?', a: 'Yes. ResumeForge CV templates work for job applications worldwide including the UK, Canada, Australia, and India.' },
    { q: 'Can I download my CV as PDF?', a: 'Yes. Download your finished CV as a PDF instantly, for free.' },
    { q: 'How long should a CV be?', a: 'For most professionals, 1-2 pages is ideal. Academic CVs can be longer depending on publications and experience.' },
  ]

  return (
    <PageLayout>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1a1a2e' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', padding: '72px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>
            Free CV Builder Online
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            Create a professional CV in minutes. Free, no login, instant PDF download.
          </p>
          <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
            🚀 Build Your CV Free Now
          </Link>
        </div>

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '16px' }}>Why Use ResumeForge CV Builder?</h2>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '16px' }}>
            Creating a professional CV doesn't have to take hours. ResumeForge gives you a clean, structured CV builder where you can add all your experience, education, skills, certifications, languages, and achievements — and download a polished PDF in minutes.
          </p>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '32px' }}>
            Whether you're applying for jobs in the UK, Canada, India, or anywhere else in the world, our CV builder helps you create a document that looks professional and passes ATS screening.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '20px' }}>CV Builder Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {[
              { icon: '📝', title: 'All CV Sections', desc: 'Personal info, summary, experience, education, skills, languages, certifications, achievements.' },
              { icon: '🎨', title: 'Professional Templates', desc: 'Classic and Modern CV designs suitable for any industry.' },
              { icon: '⚡', title: 'Fast & Easy', desc: 'Fill in your details and have a complete CV ready in under 5 minutes.' },
              { icon: '🌍', title: 'International Format', desc: 'Works for job applications in the UK, Canada, Australia, India, and worldwide.' },
              { icon: '🔓', title: 'No Login Needed', desc: 'Start building your CV instantly without creating an account.' },
              { icon: '📄', title: 'PDF Download', desc: 'Download a high-quality PDF version of your CV for free.' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#f8faff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 6px', color: '#1e3a5f' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#555', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', margin: '40px 0 20px' }}>Frequently Asked Questions</h2>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 8px', color: '#1e3a5f' }}>{f.q}</h3>
              <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.a}</p>
            </div>
          ))}

          <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: '16px', padding: '40px', textAlign: 'center', marginTop: '40px' }}>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 12px' }}>Create Your Professional CV Today</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 24px' }}>Free, fast, and ATS-ready. No account needed.</p>
            <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
              🚀 Create Your Free CV Now
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}