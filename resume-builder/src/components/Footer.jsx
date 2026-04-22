import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: '#111827', color: '#d1d5db', flexShrink: 0 }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '12px 20px 10px' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '10px',
        }}>

          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '12px', marginBottom: '3px' }}>ResumeForge</div>
            <div style={{ color: '#9ca3af', fontSize: '11px' }}>Free ATS Resume Builder</div>
          </div>

          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '11px', marginBottom: '6px' }}>Resume Tools</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { to: '/free-resume-builder', label: 'Free Resume Builder' },
                { to: '/ats-resume-builder',  label: 'ATS Resume Builder' },
                { to: '/cv-builder',          label: 'CV Builder' },
                { to: '/ats-resume-checker',  label: 'ATS Checker' },
                { to: '/resume-templates',    label: 'Templates' },
              ].map((l, i) => (
                <Link key={i} to={l.to} style={{ color: '#9ca3af', fontSize: '11px', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '11px', marginBottom: '6px' }}>Resources</div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { to: '/blog',                     label: 'Blog' },
                { to: '/resume-examples',          label: 'Examples' },
                { to: '/resume-for-freshers',      label: 'Freshers' },
                { to: '/software-engineer-resume', label: 'SWE Resume' },
                { to: '/how-to-make-a-resume',     label: 'How to Make' },
              ].map((l, i) => (
                <Link key={i} to={l.to} style={{ color: '#9ca3af', fontSize: '11px', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#fff'}
                  onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid #374151',
          paddingTop: '8px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '6px',
        }}>
          <div style={{ fontSize: '12px', color: '#9ca3af' }}>
            © {new Date().getFullYear()} ResumeForge
          </div>
          <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            {[
              { to: '/blog',    label: 'Blog' },
              { to: '/about',   label: 'About' },
              { to: '/contact', label: 'Contact' },
              { to: '/privacy', label: 'Privacy' },
              { to: '/terms',   label: 'Terms' },
            ].map((l, i) => (
              <Link key={i} to={l.to} style={{ fontSize: '12px', color: '#9ca3af', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = '#fff'}
                onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}