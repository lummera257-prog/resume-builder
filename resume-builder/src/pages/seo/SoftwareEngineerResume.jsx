import { Link } from 'react-router-dom'; import PageLayout from '../../components/PageLayout'
import { useSEO } from '../../utils/useSEO'
export default function SoftwareEngineerResume() {
  useSEO({
    title: 'Software Engineer Resume 2026 | Free Builder & Examples | ResumeForge',
    description: 'Build a professional software engineer resume for free. ATS-optimized templates, examples, and tips for SDE, backend, frontend, and full-stack roles.',
    path: '/software-engineer-resume',
  })
  const faqs = [
    { q: 'What skills should a software engineer put on a resume?', a: 'Include programming languages, frameworks, databases, cloud platforms, and tools relevant to your target role.' },
    { q: 'How do I write a software engineer resume with no experience?', a: 'Highlight personal projects, open-source contributions, internships, and relevant coursework.' },
    { q: 'Should I list all programming languages on my resume?', a: 'Only list languages you are genuinely proficient in. Relevance to the job description matters more than quantity.' },
    { q: 'How long should a software engineer resume be?', a: 'One page for under 5 years of experience. Two pages for senior roles with significant accomplishments.' },
  ]
  return (
    <PageLayout>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1a1a2e' }}>
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', padding: '72px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>Software Engineer Resume Builder</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.7 }}>Build a powerful software engineer resume that passes ATS and impresses tech recruiters. Free, no login required.</p>
          <Link to="/builder" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>🚀 Build SWE Resume Free</Link>
        </div>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '16px' }}>What Makes a Great Software Engineer Resume?</h2>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '16px' }}>A software engineer resume needs to demonstrate technical skills, measurable impact, and problem-solving ability. Recruiters at top tech companies spend an average of 6 seconds on the first scan — your resume must instantly communicate your value.</p>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '32px' }}>The most effective software engineer resumes quantify achievements, use relevant keywords from the job description, and follow a clean ATS-friendly format that both machines and humans can read easily.</p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '16px' }}>Must-Have Sections for a Software Engineer Resume</h2>
          {[
            'Contact info with LinkedIn and GitHub links',
            'Strong technical summary highlighting your stack and years of experience',
            'Work experience with quantified achievements (e.g., reduced load time by 40%)',
            'Technical skills organized by category (Languages, Frameworks, Cloud, Tools)',
            'Noteworthy personal or open-source projects with links',
            'Education with relevant coursework',
            'Certifications (AWS, Google Cloud, etc.)',
          ].map((tip, i) => (
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
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 12px' }}>Get Your Dream Tech Job</h2>
            <Link to="/builder" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>🚀 Create Your Free Resume Now</Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}