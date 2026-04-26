import { useEffect } from 'react'; import { Link } from 'react-router-dom'; import PageLayout from '../../components/PageLayout'
export default function HowToMakeResume() {
  useEffect(() => {
    document.title = 'How to Make a Resume in 2026 | Step-by-Step Guide | ResumeForge'
    let m = document.querySelector('meta[name="description"]'); if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
    m.content = 'Learn how to make a professional resume step by step. Tips, examples, and a free resume builder to create your resume in minutes.'
    let c = document.querySelector('link[rel="canonical"]'); if (!c) { c = document.createElement('link'); c.rel = 'canonical'; document.head.appendChild(c) }
    c.href = 'https://freeresumeforgebuilder.com/how-to-make-a-resume'
  }, [])
  const steps = [
    { n: '1', t: 'Choose the Right Format', d: 'Pick a reverse-chronological format for most jobs. Use a functional format if you have gaps in employment.' },
    { n: '2', t: 'Add Your Contact Information', d: 'Include name, email, phone, location, LinkedIn, and GitHub (for tech roles).' },
    { n: '3', t: 'Write a Strong Summary', d: 'A 2-3 sentence summary at the top that highlights your experience, key skills, and career goals.' },
    { n: '4', t: 'List Your Work Experience', d: 'Start with your most recent job. Use bullet points with action verbs and quantified results.' },
    { n: '5', t: 'Add Education', d: 'Include degree, institution, graduation year, and GPA if above 3.0.' },
    { n: '6', t: 'Include Your Skills', d: 'List relevant technical and soft skills organized by category.' },
    { n: '7', t: 'Add Optional Sections', d: 'Projects, certifications, languages, and achievements can strengthen your resume.' },
    { n: '8', t: 'Optimize for ATS', d: 'Include keywords from the job description. Use standard headings and clean formatting.' },
    { n: '9', t: 'Proofread and Download', d: 'Check for spelling errors, inconsistent formatting, and missing information. Then download as PDF.' },
  ]
  const faqs = [
    { q: 'How long should a resume be?', a: 'One page for 0-5 years of experience. Two pages for senior professionals. Never more than two pages.' },
    { q: 'What font should I use for a resume?', a: 'Use clean, readable fonts like Calibri, Arial, Helvetica, or Times New Roman in 10-12pt size.' },
    { q: 'Should I use a resume template?', a: 'Yes. A good template ensures proper formatting, ATS compatibility, and a professional appearance.' },
    { q: 'Do I need a different resume for each job?', a: 'Ideally yes — tailor your resume summary and skills section to match each job description for best results.' },
  ]
  return (
    <PageLayout>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1a1a2e' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', padding: '72px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>How to Make a Resume in 2026</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.7 }}>A complete step-by-step guide to writing a professional resume that gets noticed — and a free builder to create it instantly.</p>
          <Link to="/builder" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>🚀 Build My Resume Now</Link>
        </div>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '24px' }}>9 Steps to Write a Perfect Resume</h2>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'flex-start' }}>
              <div style={{ background: '#2563eb', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0, fontSize: '0.9rem' }}>{s.n}</div>
              <div>
                <h3 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 700, color: '#1e3a5f' }}>{s.t}</h3>
                <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.d}</p>
              </div>
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
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 12px' }}>Ready? Build Your Resume in Minutes</h2>
            <Link to="/builder" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>🚀 Create Your Free Resume Now</Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}