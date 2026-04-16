import { useEffect } from 'react'; import { Link } from 'react-router-dom'; import PageLayout from '../../components/PageLayout'
export default function ResumeForFreshers() {
  useEffect(() => {
    document.title = 'Resume for Freshers 2026 | Free First Resume Builder | ResumeForge'
    let m = document.querySelector('meta[name="description"]'); if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = 'Build your first resume as a fresher with no experience. Free resume builder for students and fresh graduates. ATS-friendly templates.'
    let c = document.querySelector('link[rel="canonical"]'); if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c) }
    c.href = 'https://freeresumeforgebuilder.com/resume-for-freshers'
  }, [])
  const faqs = [
    { q: 'How do I write a resume with no experience?', a: 'Focus on education, internships, projects, skills, and certifications. Use action verbs and quantify achievements where possible.' },
    { q: 'What should a fresher put in a resume?', a: 'Include education, skills, internships or projects, certifications, languages, and a strong objective/summary.' },
    { q: 'How long should a fresher resume be?', a: 'One page is ideal for freshers and students. Keep it concise and relevant.' },
    { q: 'Should freshers include a photo in their resume?', a: 'In most cases, no — especially for US, UK, and Canada applications. Check the local norms for your target country.' },
  ]
  return (
    <PageLayout>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1a1a2e' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', padding: '72px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>Resume for Freshers — Free Builder</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.7 }}>No experience? No problem. Build a professional resume as a fresher or student — free, fast, and ATS-ready.</p>
          <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>🚀 Build Fresher Resume Free</Link>
        </div>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '16px' }}>How to Write a Resume as a Fresher</h2>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '16px' }}>As a fresher, you may not have years of work experience — but that doesn't mean your resume has to be empty. The key is to highlight your education, projects, internships, skills, and any relevant certifications.</p>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '32px' }}>Recruiters hiring freshers look for potential, willingness to learn, and relevant skills. A well-structured resume that clearly presents your strengths can get you shortlisted even without full-time experience.</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '16px' }}>What to Include in a Fresher Resume</h2>
          {['Strong objective or professional summary', 'Education with GPA if above 3.0', 'Internships, part-time jobs, or freelance work', 'Academic and personal projects', 'Technical and soft skills', 'Certifications and online courses', 'Extra-curricular achievements and leadership roles', 'Languages if relevant to the role'].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <span style={{ color: '#2563eb', fontWeight: 700 }}>✓</span>
              <p style={{ margin: 0, color: '#444', fontSize: '0.9rem', lineHeight: 1.6 }}>{tip}</p>
            </div>
          ))}
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', margin: '40px 0 20px' }}>Frequently Asked Questions</h2>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 8px', color: '#1e3a5f' }}>{f.q}</h3>
              <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.a}</p>
            </div>
          ))}
          <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: '16px', padding: '40px', textAlign: 'center', marginTop: '40px' }}>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 12px' }}>Land Your First Job with a Great Resume</h2>
            <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>🚀 Create Your Free Resume Now</Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}