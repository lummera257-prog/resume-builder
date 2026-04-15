import { useState } from 'react'
import Header from '../components/Header'
import FormPanel from '../components/FormPanel'
import PreviewPanel from '../components/PreviewPanel'
import Footer from '../components/Footer'

export default function Builder() {
  const [previewVisible, setPreviewVisible] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">

      <h1 className="sr-only">
        ResumeForge — Free ATS Resume Builder & CV Maker Online
      </h1>

      <Header
        previewVisible={previewVisible}
        setPreviewVisible={setPreviewVisible}
      />

      {/* MAIN LAYOUT */}
      <div className="flex flex-row h-[calc(100vh-56px)]">

        {/* LEFT — FORM */}
        <div
          className={`
            w-full md:w-[55%]
            overflow-y-auto
            bg-white border-r border-slate-200
            ${previewVisible ? 'hidden md:block' : 'block'}
          `}
        >
          <FormPanel />
        </div>

        {/* RIGHT — PREVIEW */}
        <div
          className={`
            w-full md:w-[45%]
            overflow-y-auto
            bg-slate-100
            ${previewVisible ? 'block' : 'hidden md:block'}
          `}
        >
          <PreviewPanel />
        </div>

      </div>

      {/* Status Bar */}
      <div className="h-7 border-t border-slate-200 bg-white px-4 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500">
          💾 Auto-saved · No account needed · 100% Free
        </span>
        <span className="hidden text-[11px] text-slate-500 sm:block">
          Built with ❤️ — ResumeForge
        </span>
      </div>

      {/* NORMAL FOOTER (NOT FIXED) */}
      <Footer />

    </div>
  )
}