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

      {/* Form + Preview — fixed height, independent scroll */}
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 56px)',
        overflow: 'hidden',
        flexShrink: 0,
      }}>

        {/* Form Panel */}
        <div
          style={{
            width: '55%',
            height: '100%',
            overflowY: 'auto',
            background: '#ffffff',
            borderRight: '1px solid #e2e8f0',
            flexShrink: 0,
          }}
          className={previewVisible ? 'hidden md:block' : 'block'}
        >
          <FormPanel />
        </div>

        {/* Preview Panel */}
        <div
          style={{
            flex: 1,
            height: '100%',
            overflowY: 'auto',
            background: '#f1f5f9',
          }}
          className={previewVisible ? 'block' : 'hidden md:block'}
        >
          <PreviewPanel />
        </div>

      </div>

      {/* Status Bar */}
      <div style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '5px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
          💾 Auto-saved · No account needed · 100% Free
        </span>
        <span style={{ fontSize: '11px', color: '#64748b' }}>
          Built with ❤️ — ResumeForge
        </span>
      </div>

      {/* Footer — page scroll ke saath aayega */}
      <Footer />

    </div>
  )
}