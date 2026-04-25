import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import FormPanel from '../components/FormPanel'
import PreviewPanel from '../components/PreviewPanel'
import Footer from '../components/Footer'
import { useResume } from '../context/ResumeContext'

function trackConversion(action) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: 'Resume Builder',
      event_label: 'User Engagement',
    })
  }
}

function TrustBar() {
  return (
    <div
      role="banner"
      aria-label="ResumeForge features"
      style={{
        background: 'linear-gradient(90deg, #1e3a5f 0%, #2563eb 100%)',
        padding: '6px 16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '24px',
        flexWrap: 'wrap',
        flexShrink: 0,
      }}
    >
      {[
        '✅ 100% Free',
        '⚡ No Login Required',
        '📄 Instant PDF Download',
        '🎯 ATS-Friendly',
        '🔒 Private & Secure',
      ].map((item, i) => (
        <span key={i} style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.92)',
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}>
          {item}
        </span>
      ))}
    </div>
  )
}

export default function Builder() {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const location = useLocation()
  const { updateSettings } = useResume()

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (location.state?.templateKey) {
      updateSettings({
        template: location.state.templateKey,
        colorScheme: location.state.colorScheme || 'blue',
      })
      window.history.replaceState({}, document.title)
    }
    trackConversion('page_view')
  }, [])

  // TrustBar ~32px + Header ~56px + StatusBar ~24px = ~112px
  const PANEL_HEIGHT = 'calc(100vh - 112px)'

  return (
    // Outer wrapper: min-height so page can scroll to reveal footer
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>

      <h1 className="sr-only">
        Free Resume Builder Online — ATS-Friendly Resume Maker | ResumeForge
      </h1>

      {/* Sticky top chrome */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <TrustBar />
        <Header
          previewVisible={previewVisible}
          setPreviewVisible={setPreviewVisible}
        />
      </div>

      {isMobile ? (

        /* ════ MOBILE ════ */
        <main
          id="main-content"
          aria-label="Resume Builder"
          style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
        >
          {!previewVisible && (
            <div style={{ background: '#fff' }}>
              <FormPanel />
            </div>
          )}
          {previewVisible && (
            <div style={{ background: '#f1f5f9' }}>
              <PreviewPanel />
            </div>
          )}

          <div style={{
            background: 'linear-gradient(90deg, #1e3a5f 0%, #2563eb 100%)',
            padding: '4px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.92)' }}>💾 Auto-saved · 100% Free</span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.92)' }}>Built with ❤️</span>
          </div>

          <Footer />
        </main>

      ) : (

        /* ════ DESKTOP ════ */
        <main
          id="main-content"
          aria-label="Resume Builder"
          style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
        >
          {/* Panels row — fixed viewport height so they scroll independently */}
          <div style={{
            display: 'flex',
            height: PANEL_HEIGHT,
            flexShrink: 0,
          }}>

            {/* Form Panel — independent scroll */}
            <section
              aria-label="Resume form"
              style={{
                width: '55%',
                height: '100%',
                overflowY: 'scroll',
                background: '#fff',
                borderRight: '1px solid #e2e8f0',
                flexShrink: 0,
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
              }}
            >
              <FormPanel />
            </section>

            {/* Preview Panel — independent scroll */}
            <section
              aria-label="Resume preview"
              style={{
                flex: 1,
                height: '100%',
                overflowY: 'scroll',
                background: '#f1f5f9',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
              }}
            >
              <PreviewPanel />
            </section>
          </div>

          {/* Status Bar */}
          <div
            aria-hidden="true"
            style={{
              flexShrink: 0,
              background: 'linear-gradient(90deg, #1e3a5f 0%, #2563eb 100%)',
              height: '24px',
              padding: '0 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.92)' }}>
              💾 Auto-saved · No account needed · 100% Free
            </span>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.92)' }}>
              Built with ❤️ — ResumeForge
            </span>
          </div>

          {/* Footer — in normal document flow, revealed by page scroll */}
          <Footer />
        </main>
      )}
    </div>
  )
}