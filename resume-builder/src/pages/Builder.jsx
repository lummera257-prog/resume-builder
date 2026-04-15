import { useState } from 'react'
import Header from '../components/Header'
import FormPanel from '../components/FormPanel'
import PreviewPanel from '../components/PreviewPanel'
import Footer from '../components/Footer'

export default function Builder() {
  const [previewVisible, setPreviewVisible] = useState(false)

  return (
    <div className="flex flex-col bg-slate-100" style={{ height: '100vh' }}>

      <h1 className="sr-only">
        ResumeForge — Free ATS Resume Builder & CV Maker Online
      </h1>

      <Header previewVisible={previewVisible} setPreviewVisible={setPreviewVisible} />

      {/* MAIN LAYOUT */}
      <div className="flex flex-row flex-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* LEFT — FORM 55% */}
        <div className={`
          w-full md:w-[55%]
          overflow-y-auto
          bg-white border-r border-slate-200
          ${previewVisible ? 'hidden md:block' : 'block'}
        `}>
          <FormPanel />
        </div>

        {/* RIGHT — PREVIEW 45% */}
        <div className={`
          w-full md:w-[45%]
          overflow-y-auto
          bg-slate-100
          ${previewVisible ? 'block' : 'hidden md:block'}
        `}>
          <PreviewPanel />
        </div>

      </div>

      {/* Bottom Status Bar */}
      <div className="h-7 bg-white border-t border-slate-200 flex items-center justify-between px-4 flex-shrink-0">
        <span className="text-[11px] text-slate-500 font-medium">
          💾 Auto-saved · No account needed · 100% Free
        </span>
        <span className="text-[11px] text-slate-500 hidden sm:block">
          Built with ❤️ — ResumeForge
        </span>
      </div>

      <Footer />

    </div>
  )
}