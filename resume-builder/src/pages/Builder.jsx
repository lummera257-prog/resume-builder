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
    <div className="flex min-h-screen flex-col bg-slate-100">
      <h1 className="sr-only">
        ResumeForge — Free ATS Resume Builder & CV Maker Online
      </h1>

      <Header
        previewVisible={previewVisible}
        setPreviewVisible={setPreviewVisible}
      />

      {/* ✅ Mobile: natural scroll | Desktop: fixed viewport height */}
      <div className="flex flex-row md:h-[calc(100vh-56px)] flex-1">
        {/* Form Panel */}
        <div className={`
          w-full md:w-[55%]
          md:overflow-y-auto
          bg-white border-r border-slate-200
          ${previewVisible ? 'hidden md:block' : 'block'}
        `}>
          <FormPanel />
        </div>

        {/* Preview Panel */}
        <div className={`
          w-full md:w-[45%]
          md:overflow-y-auto
          bg-slate-100
          ${previewVisible ? 'block' : 'hidden md:block'}
        `}>
          <PreviewPanel />
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-slate-200 bg-white px-4 py-2 flex items-center justify-between shrink-0">
        <span className="text-[11px] font-medium text-slate-500">
          💾 Auto-saved · No account needed · 100% Free
        </span>
        <span className="hidden text-[11px] text-slate-500 sm:block">
          Built with ❤️ — ResumeForge
        </span>
      </div>

      {/* ✅ Footer — always visible, no gap */}
      <Footer />
    </div>
  )
}