import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import FormPanel from '../components/FormPanel'
import PreviewPanel from '../components/PreviewPanel'
import Footer from '../components/Footer'
import { useResume } from '../context/ResumeContext'

export default function Builder() {
  const [previewVisible, setPreviewVisible] = useState(false)
  const location = useLocation()
  const { updateSettings } = useResume()

  useEffect(() => {
    if (location.state?.templateKey) {
      updateSettings({
        template: location.state.templateKey,
        colorScheme: location.state.colorScheme || 'blue',
      })
      window.history.replaceState({}, document.title)
    }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      <h1 className="sr-only">
        ResumeForge — Free ATS Resume Builder & CV Maker Online
      </h1>

      {/* Header */}
      <div style={{ flexShrink: 0 }}>
        <Header
          previewVisible={previewVisible}
          setPreviewVisible={setPreviewVisible}
        />
      </div>

      {/* ════ DESKTOP ════ */}
      <div
        className="hidden md:flex"
        style={{
          height: 'calc(100vh - 56px - 20px)',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
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

      {/* Desktop Status Bar */}
      <div
        className="hidden md:flex"
        style={{
          flexShrink: 0,
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          height: '20px',
          padding: '0 16px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '10px', color: '#94a3b8' }}>💾 Auto-saved · No account needed · 100% Free</span>
        <span style={{ fontSize: '10px', color: '#94a3b8' }}>Built with ❤️ — ResumeForge</span>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* ════ MOBILE ════ */}
      <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Form — tab dikhega jab preview band ho */}
        {!previewVisible && (
          <div style={{ background: '#fff' }}>
            <FormPanel />
          </div>
        )}

        {/* Preview — tab dikhega jab toggle ON ho */}
        {previewVisible && (
          <div style={{ background: '#f1f5f9', minHeight: '70vh' }}>
            <PreviewPanel />
          </div>
        )}

        {/* Mobile Status Bar */}
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

        {/* Mobile Footer — hamesha visible */}
        <Footer />

      </div>

    </div>
  )
}