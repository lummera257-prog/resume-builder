import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { useSEO } from '../../utils/useSEO'

export default function FreeResumeBuilder() {
  useSEO({
    title: 'Free Resume Builder Online 2026 | No Login | ResumeForge',
    description: 'Build a professional resume for free online. No login, no signup. ATS-friendly templates, instant PDF download. Start in 2 minutes.',
    path: '/free-resume-builder',
  })

  const faqs = [
    { q: 'Is this resume builder really free?', a: 'Yes, 100% free. No credit card, no subscription, no hidden charges ever.' },
    { q: 'Do I need to create an account?', a: 'No. You can start building your resume immediately without any signup or login.' },
    { q: 'Can I download my resume as a PDF?', a: 'Yes. Once your resume is ready, download it as a PDF instantly for free.' },
    { q: 'Are the templates ATS-friendly?', a: 'Yes. All templates are designed to pass Applicant Tracking Systems used by top companies.' },
    { q: 'Can I use this for any job?', a: 'Absolutely. ResumeForge works for all industries, roles, and experience levels.' },
  ]

  return (
    <PageLayout>
      <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: '#1a1a2e' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)', padding: '72px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#fff', margin: '0 0 16px' }}>
            Free Resume Builder Online
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 28px', lineHeight: 1.7 }}>
            Create a professional, ATS-friendly resume in minutes. No login required. No fees. Just results.
          </p>
          <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
            🚀 Create Your Free Resume Now
          </Link>
        </div>

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '48px 24px' }}>

          {/* Why Free */}
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '16px' }}>
            Why Use a Free Resume Builder?
          </h2>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '16px' }}>
            Building a resume from scratch in Word or Google Docs is time-consuming and frustrating. Formatting breaks, fonts look off, and you never know if your resume will pass the ATS screening. A free online resume builder solves all of this — instantly.
          </p>
          <p style={{ color: '#444', lineHeight: 1.8, marginBottom: '32px' }}>
            ResumeForge gives you professionally designed templates, a simple editor, and one-click PDF download — all completely free. No login, no watermarks, no limits.
          </p>

          {/* Features */}
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '20px' }}>
            What You Get — Completely Free
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {[
              { icon: '✅', title: 'ATS-Friendly Templates', desc: 'Pass automated resume screening used by 99% of Fortune 500 companies.' },
              { icon: '⚡', title: 'Build in 2 Minutes', desc: 'Fill in your details, choose a template, and download your resume instantly.' },
              { icon: '🔓', title: 'No Login Required', desc: 'Start immediately. No account, no email, no personal data collected.' },
              { icon: '📄', title: 'Instant PDF Download', desc: 'Download a print-ready PDF version of your resume for free.' },
              { icon: '🎨', title: 'Multiple Templates', desc: 'Choose from Classic and Modern resume designs to match your style.' },
              { icon: '🔒', title: '100% Private', desc: 'Your data stays in your browser. We never store or share your resume data.' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#f8faff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 6px', color: '#1e3a5f' }}>{f.title}</h3>
                <p style={{ fontSize: '0.875rem', color: '#555', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', marginBottom: '16px' }}>
            How to Build Your Resume for Free
          </h2>
          {[
            { step: '1', title: 'Open the Builder', desc: 'Go to ResumeForge and open the free resume builder. No signup needed.' },
            { step: '2', title: 'Fill in Your Details', desc: 'Add your name, experience, education, skills, and any other sections.' },
            { step: '3', title: 'Choose a Template', desc: 'Pick from Classic or Modern ATS-friendly resume templates.' },
            { step: '4', title: 'Download as PDF', desc: 'Hit the Download button and get your resume as a PDF — instantly and free.' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
              <div style={{ background: '#2563eb', color: '#fff', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>{s.step}</div>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 600, color: '#1e3a5f' }}>{s.title}</h3>
                <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}

          {/* FAQ */}
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e3a5f', margin: '40px 0 20px' }}>
            Frequently Asked Questions
          </h2>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 8px', color: '#1e3a5f' }}>{f.q}</h3>
              <p style={{ margin: 0, color: '#555', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.a}</p>
            </div>
          ))}

          {/* Internal Links */}
          <div style={{ background: '#f0f4ff', borderRadius: '12px', padding: '24px', margin: '40px 0' }}>
            <h3 style={{ margin: '0 0 12px', color: '#1e3a5f', fontWeight: 700 }}>Also Explore</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {[
                { to: '/ats-resume-builder', label: 'ATS Resume Builder' },
                { to: '/cv-builder', label: 'CV Builder' },
                { to: '/resume-for-freshers', label: 'Resume for Freshers' },
                { to: '/resume-templates', label: 'Resume Templates' },
                { to: '/how-to-make-a-resume', label: 'How to Make a Resume' },
              ].map((l, i) => (
                <Link key={i} to={l.to} style={{ background: '#fff', border: '1px solid #2563eb', color: '#2563eb', padding: '6px 14px', borderRadius: '20px', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 500 }}>{l.label}</Link>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 12px' }}>Ready to Build Your Resume?</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: '0 0 24px' }}>Join thousands of job seekers who built their resume with ResumeForge — free, fast, and ATS-ready.</p>
            <Link to="/" style={{ background: '#fff', color: '#2563eb', padding: '14px 32px', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
              🚀 Create Your Free Resume Now
            </Link>
          </div>

        </div>
      </div>
    </PageLayout>
  )
}