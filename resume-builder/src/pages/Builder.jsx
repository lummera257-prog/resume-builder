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

      {/* Builder Area — fixed height, independent scroll */}
      <div style={{
        display: 'flex',
        height: 'calc(100vh - 56px - 32px)',
        overflow: 'hidden',
        flexShrink: 0,
      }}>

        {/* Form Panel — mobile: full width, desktop: 55% */}
        <div style={{
          overflowY: 'auto',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          flexShrink: 0,
          // Mobile default
          width: '100%',
        }}
          className={`
            ${previewVisible ? 'hidden' : 'block'}
            md:block md:!w-[55%]
          `}
        >
          <FormPanel />
        </div>

        {/* Preview Panel — mobile: full width, desktop: 45% */}
        <div style={{
          overflowY: 'auto',
          background: '#f1f5f9',
          flex: 1,
        }}
          className={`
            ${previewVisible ? 'block' : 'hidden'}
            md:block
          `}
        >
          <PreviewPanel />
        </div>

      </div>

      {/* Status Bar */}
      <div style={{
        flexShrink: 0,
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '5px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
          💾 Auto-saved · No account needed · 100% Free
        </span>
        <span style={{ fontSize: '11px', color: '#64748b' }}>
          Built with ❤️ — ResumeForge
        </span>
      </div>

      {/* Footer — scroll karke dekho */}
      <Footer />

    </div>
  )
}