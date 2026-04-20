import { useEffect } from "react"
import PageLayout from "../components/PageLayout"

export default function Contact() {
  useEffect(() => {
    document.title = "Contact ResumeForge | Get Help and Support"
    let d = document.querySelector('meta[name="description"]')
    if (!d) {
      d = document.createElement('meta')
      d.name = 'description'
      document.head.appendChild(d)
    }
    d.setAttribute('content', 'Contact ResumeForge for support and feedback.')
    let c = document.querySelector('link[rel="canonical"]')
    if (!c) {
      c = document.createElement('link')
      c.rel = 'canonical'
      document.head.appendChild(c)
    }
    c.href = 'https://freeresumeforgebuilder.com/contact'
  }, [])

  const email = "resumeforgehelp@gmail.com"

  const handleCopy = () => {
    navigator.clipboard.writeText(email)
    alert("Email copied!")
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">

        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Contact Us
        </h1>

        <p className="text-slate-600 mb-6 leading-relaxed">
          If you have any questions or need help, feel free to contact us anytime.
        </p>

        <p className="text-slate-600 mb-8">
          Email us at:
        </p>

        <p className="text-lg font-semibold text-blue-600 mb-6">
          {email}
        </p>

        <button
          onClick={handleCopy}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-4"
        >
          Copy Email Address
        </button>

        <p className="mt-3 text-xs text-slate-400">
          Copy the email above and send us a message from your email app.
        </p>

      </div>
    </PageLayout>
  )
}