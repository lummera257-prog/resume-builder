import { useState } from 'react'
import Header from '../components/Header'
import FormPanel from '../components/FormPanel'
import PreviewPanel from '../components/PreviewPanel'
import Footer from '../components/Footer'

export default function Builder() {
  const [previewVisible, setPreviewVisible] = useState(false)

  return (
    <div className="flex h-screen flex-col bg-slate-100 overflow-hidden">

      <h1 className="sr-only">
        ResumeForge — Free ATS Resume Builder & CV Maker Online
      </h1>

      <Header
        previewVisible={previewVisible}
        setPreviewVisible={setPreviewVisible}
      />

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 min-h-0 flex-row overflow-hidden pb-16">

        {/* LEFT — FORM 55% */}
        <div
          className={`
            w-full md:w-[55%]
            min-h-0 overflow-y-auto
            bg-white border-r border-slate-200
            ${previewVisible ? 'hidden md:block' : 'block'}
          `}
        >
          <FormPanel />
        </div>

        {/* RIGHT — PREVIEW 45% */}
        <div
          className={`
            w-full md:w-[45%]
            min-h-0 overflow-y-auto
            bg-slate-100
            ${previewVisible ? 'block' : 'hidden md:block'}
          `}
        >
          <PreviewPanel />
        </div>

      </div>

      {/* Bottom Status Bar */}
      <div className="h-7 flex-shrink-0 border-t border-slate-200 bg-white px-4 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500">
          💾 Auto-saved · No account needed · 100% Free
        </span>
        <span className="hidden text-[11px] text-slate-500 sm:block">
          Built with ❤️ — ResumeForge
        </span>
      </div>

      {/* FIXED FOOTER */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <Footer />
      </div>

    </div>
  )
}