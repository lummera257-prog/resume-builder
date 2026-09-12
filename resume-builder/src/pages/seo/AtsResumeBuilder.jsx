import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { useSEO } from '../../utils/useSEO'

export default function AtsResumeBuilder() {
  useSEO({
    title: 'ATS Resume Builder Free 2026 | Beat the Bots | ResumeForge',
    description: 'Build an ATS-optimized resume that passes automated screening. Free online ATS resume builder with proven templates. No login required.',
    path: '/ats-resume-builder',
  })

  const faqs = [
    { q: 'What is an ATS resume?', a: 'An ATS (Applicant Tracking System) resume is formatted to be parsed correctly by automated HR software before a human ever reads it.' },
    { q: 'How do I make my resume ATS-friendly?', a: 'Use simple formatting, standard section headings, relevant keywords, and avoid tables, images, or fancy fonts.' },
    { q: 'Does ResumeForge create ATS-friendly resumes?', a: 'Yes. All ResumeForge templates are specifically built to pass ATS systems used by top companies worldwide.' },
    { q: 'Is the ATS resume builder free?', a: 'Completely free. No signup, no payment, no watermarks.' },
    { q: 'What ATS score should I aim for?', a: 'Aim for 80+ on ATS scoring tools. ResumeForge includes a built-in ATS score checker to help you optimize.' },
  ]

  return (
    <PageLayout>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1a1a2e' }}>

        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', padding: '72px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>
            ATS Resume Builder — Free & Online
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            75% of resumes never reach a human. Build an ATS-optimized resume that gets past the bots and in front of hiring managers.
          </p>
          <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
            🚀 Build ATS Resume Free
          </Link>
        </div>

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '16px' }}>What is an ATS and Why Does It Matter?</h2>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '16px' }}>
            Over 98% of Fortune 500 companies use Applicant Tracking Systems (ATS) to filter resumes before a recruiter ever sees them. If your resume isn't formatted correctly, it gets rejected automatically — no matter how qualified you are.
          </p>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '32px' }}>
            An ATS scans your resume for keywords, checks formatting, and ranks candidates. ResumeForge templates are specifically built to pass this screening — giving you the best chance to land an interview.
          </p>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '20px' }}>ATS Optimization Features</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {[
              { icon: '🎯', title: 'Keyword Optimization', desc: 'Built-in ATS score shows you which keywords to add for your target role.' },
              { icon: '📐', title: 'Clean Formatting', desc: 'No tables, no images, no columns that break ATS parsing.' },
              { icon: '📝', title: 'Standard Section Headings', desc: 'Uses recognized headings like Experience, Education, Skills that all ATS systems understand.' },
              { icon: '✅', title: 'Real-time ATS Score', desc: 'See your ATS score update live as you fill in your resume sections.' },
              { icon: '📄', title: 'PDF & Text Ready', desc: 'Download in PDF format optimized for both ATS parsing and human reading.' },
              { icon: '🔍', title: 'Instant Feedback', desc: 'Get tips and suggestions to improve your ATS score before you apply.' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#f8faff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 6px', color: '#1e3a5f' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#555', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '16px' }}>ATS Resume Tips That Actually Work</h2>
          {[
            'Use standard section headings: Work Experience, Education, Skills',
            'Include exact keywords from the job description',
            'Avoid headers, footers, tables, and text boxes',
            'Use common fonts like Arial, Calibri, or Times New Roman',
            'Save as PDF unless the employer requests Word format',
            'List skills as plain text, not as visual skill bars',
            'Spell out abbreviations at least once in your resume',
          ].map((tip, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-start' }}>
              <span style={{ color: '#2563eb', fontWeight: 700, flexShrink: 0 }}>✓</span>
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

          <div style={{ background: '#f0f4ff', borderRadius: '12px', padding: '24px', margin: '40px 0' }}>
            <h3 style={{ margin: '0 0 12px', color: '#1e3a5f', fontWeight: 700 }}>Also Explore</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {[
                { to: '/free-resume-builder', label: 'Free Resume Builder' },
                { to: '/cv-builder', label: 'CV Builder' },
                { to: '/resume-for-freshers', label: 'Resume for Freshers' },
                { to: '/software-engineer-resume', label: 'Software Engineer Resume' },
                { to: '/ats-resume-checker', label: 'ATS Resume Checker' },
              ].map((l, i) => (
                <Link key={i} to={l.to} style={{ background: '#fff', border: '1px solid #2563eb', color: '#2563eb', padding: '6px 14px', borderRadius: '20px', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>{l.label}</Link>
              ))}
            </div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 12px' }}>Beat the ATS. Land the Interview.</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 24px' }}>Build your ATS-optimized resume for free right now. No account needed.</p>
            <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
              🚀 Create Your Free Resume Now
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}