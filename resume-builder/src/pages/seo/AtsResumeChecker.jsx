import { useEffect } from 'react'; import { Link } from 'react-router-dom'; import PageLayout from '../../components/PageLayout'
export default function AtsResumeChecker() {
  useEffect(() => {
    document.title = 'ATS Resume Checker Free 2026 | Check Your Resume Score | ResumeForge'
    let m = document.querySelector('meta[name="description"]'); if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = 'Check your resume ATS score for free. Get instant feedback and tips to improve your resume and pass automated screening systems.'
    let c = document.querySelector('link[rel="canonical"]'); if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c) }
    c.href = 'https://freeresumeforgebuilder.com/ats-resume-checker'
  }, [])
  const faqs = [
    { q: 'What is an ATS resume checker?', a: 'An ATS resume checker analyzes your resume against ATS criteria and gives you a score with improvement suggestions.' },
    { q: 'Is the ATS checker free?', a: 'Yes. ResumeForge includes a built-in ATS score checker completely free as part of the resume builder.' },
    { q: 'What does a good ATS score mean?', a: 'A score of 80+ means your resume is well-optimized for ATS. Below 60 means you should improve keywords and formatting.' },
    { q: 'How do I improve my ATS score?', a: 'Add relevant keywords from the job description, use standard section headings, remove graphics and tables, and fill in all major resume sections.' },
  ]
  return (
    <PageLayout>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1a1a2e' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', padding: '72px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>Free ATS Resume Checker</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.7 }}>Check your resume ATS score instantly. Get real-time feedback and fix issues before you apply.</p>
          <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>🚀 Check My Resume Score Free</Link>
        </div>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '16px' }}>Why Your ATS Score Matters</h2>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '16px' }}>Over 75% of resumes are rejected by ATS before a human ever reads them. An ATS resume checker helps you identify formatting problems, missing keywords, and weak sections — so you can fix them before sending your application.</p>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '32px' }}>ResumeForge includes a built-in ATS score checker that analyzes your resume in real time and gives you actionable tips to improve your score. It's completely free and part of the resume builder.</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '16px' }}>What the ATS Checker Looks For</h2>
          {['Completeness of key sections (Experience, Education, Skills, Summary)', 'Use of action verbs and quantified achievements', 'Presence of contact information', 'Keyword density and relevance', 'Section headings and formatting quality', 'Overall resume length and structure'].map((tip, i) => (
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
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 12px' }}>Check Your ATS Score Now — Free</h2>
            <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>🚀 Open ATS Resume Checker</Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}