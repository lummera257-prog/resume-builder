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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#f1f5f9' }}>

      <h1 className="sr-only">
        ResumeForge — Free ATS Resume Builder & CV Maker Online
      </h1>

      <Header
        previewVisible={previewVisible}
        setPreviewVisible={setPreviewVisible}
      />

      {/* Main Split Area */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

        {/* Form Panel */}
        <div style={{
          width: '55%',
          height: '100%',
          overflowY: 'auto',
          background: '#fff',
          borderRight: '1px solid #e2e8f0',
          display: previewVisible ? 'none' : 'block',
        }}
          className="md:block"
        >
          <FormPanel />
        </div>

        {/* Preview Panel */}
        <div style={{
          width: '45%',
          height: '100%',
          overflowY: 'auto',
          background: '#f1f5f9',
          display: previewVisible ? 'block' : 'none',
        }}
          className="md:block md:!display-block"
        >
          <PreviewPanel />
        </div>

      </div>

      {/* Status Bar */}
      <div style={{
        background: '#fff',
        borderTop: '1px solid #e2e8f0',
        padding: '6px 16px',
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

      <Footer />

    </div>
  )
}