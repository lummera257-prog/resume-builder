import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: '#111827', color: '#d1d5db', padding: '40px 0 24px', flexShrink: 0 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '32px',
          marginBottom: '32px',
        }}>

          {/* Brand */}
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>ResumeForge</div>
            <div style={{ color: '#9ca3af', fontSize: '12px', lineHeight: 1.6 }}>Free ATS Resume Builder</div>
          </div>

          {/* Tools */}
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Resume Tools</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { to: '/free-resume-builder', label: 'Free Resume Builder' },
                { to: '/ats-resume-builder',  label: 'ATS Resume Builder' },
                { to: '/cv-builder',          label: 'CV Builder' },
                { to: '/ats-resume-checker',  label: 'ATS Resume Checker' },
                { to: '/resume-templates',    label: 'Resume Templates' },
              ].map((l, i) => (
                <Link key={i} to={l.to} style={{ color: '#9ca3af', fontSize: '12px', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '13px', marginBottom: '12px' }}>Resources</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { to: '/blog',                    label: 'Blog' },
                { to: '/resume-examples',         label: 'Resume Examples' },
                { to: '/resume-for-freshers',     label: 'Resume for Freshers' },
                { to: '/software-engineer-resume',label: 'Software Engineer Resume' },
                { to: '/how-to-make-a-resume',    label: 'How to Make a Resume' },
              ].map((l, i) => (
                <Link key={i} to={l.to} style={{ color: '#9ca3af', fontSize: '12px', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{ fontSize: '11px', color: '#6b7280' }}>
            © {new Date().getFullYear()} ResumeForge
          </div>
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {[
              { to: '/blog',    label: 'Blog' },
              { to: '/about',   label: 'About' },
              { to: '/contact', label: 'Contact' },
              { to: '/privacy', label: 'Privacy' },
              { to: '/terms',   label: 'Terms' },
            ].map((l, i) => (
              <Link key={i} to={l.to} style={{ fontSize: '11px', color: '#6b7280', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#6b7280'}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}