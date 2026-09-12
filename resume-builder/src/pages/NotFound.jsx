import { Link } from "react-router-dom"
import PageLayout from "../components/PageLayout"
import { useSEO } from "../utils/useSEO"

export default function NotFound() {
  useSEO({
    title: "Page Not Found — ResumeForge",
    description: 'The page you\'re looking for doesn\'t exist. Head back to ResumeForge to build your free ATS-friendly resume.',
    path: '/404',
    noindex: true,
  })

  return (
    <PageLayout>
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 16px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '8px' }}>🧭</div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, color: '#1e3a5f', margin: '0 0 12px' }}>
          404 — Page Not Found
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '420px', lineHeight: 1.7, margin: '0 0 28px' }}>
          The page you're looking for doesn't exist or may have moved. Let's get you back on track.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/"
            className="btn-primary"
            style={{ textDecoration: 'none' }}>
            ← Back to Home
          </Link>
          <Link to="/builder"
            className="btn-secondary"
            style={{ textDecoration: 'none' }}>
            Build My Resume
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}
