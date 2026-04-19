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
    <div style={{
      background: 'linear-gradient(90deg, #1e3a5f 0%, #2563eb 100%)',
      padding: '6px 16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '24px',
      flexWrap: 'wrap',
      flexShrink: 0,
    }}>
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      <h1 className="sr-only">
        Free Resume Builder Online — ATS-Friendly Resume Maker | ResumeForge
      </h1>

      <TrustBar />

      <div style={{ flexShrink: 0 }}>
        <Header
          previewVisible={previewVisible}
          setPreviewVisible={setPreviewVisible}
        />
      </div>

      {isMobile ? (
        /* ════ MOBILE ════ */
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

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
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            padding: '4px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>💾 Auto-saved · 100% Free</span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Built with ❤️</span>
          </div>

          <Footer />
        </div>

      ) : (

        /* ════ DESKTOP ════ */
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

          {/* ✅ FIXED — flex:1 instead of fixed height */}
          <div style={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden',
            minHeight: 0,
          }}>
            {/* Form */}
            <div style={{
              width: '55%',
              height: '100%',
              overflowY: 'scroll',
              background: '#fff',
              borderRight: '1px solid #e2e8f0',
              flexShrink: 0,
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
            }}>
              <FormPanel />
            </div>

            {/* Preview */}
            <div style={{
              flex: 1,
              height: '100%',
              overflowY: 'scroll',
              background: '#f1f5f9',
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
            }}>
              <PreviewPanel />
            </div>
          </div>

          {/* Status Bar */}
          <div style={{
            flexShrink: 0,
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            height: '20px',
            padding: '0 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>
              💾 Auto-saved · No account needed · 100% Free
            </span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>
              Built with ❤️ — ResumeForge
            </span>
          </div>

          <Footer />
        </div>
      )}

    </div>
  )
}