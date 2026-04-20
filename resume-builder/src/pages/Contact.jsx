import { useEffect } from "react"
import PageLayout from "../components/PageLayout"

export default function Contact() {
  const email = "resumeforgehelp@gmail.com"

  useEffect(() => {
    document.title = "Contact ResumeForge | Get Help & Support"
    const setMeta = (name, content) => {
      let el = document.querySelector('meta[name="' + name + '"]')
      if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
      el.setAttribute('content', content)
    }
    const setOg = (prop, content) => {
      let el = document.querySelector('meta[property="' + prop + '"]')
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el) }
      el.setAttribute('content', content)
    }
    const setCanonical = (url) => {
      let el = document.querySelector('link[rel="canonical"]')
      if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el) }
      el.href = url
    }
    setMeta('description', 'Contact ResumeForge for support, feedback, or questions about our free resume builder.')
    setMeta('keywords', 'contact resumeforge, resume builder support, help, feedback')
    setOg('og:title', 'Contact ResumeForge | Get Help & Support')
    setOg('og:description', 'Have questions about ResumeForge? Contact us anytime.')
    setOg('og:url', 'https://freeresumeforgebuilder.com/contact')
    setOg('og:type', 'website')
    setCanonical('https://freeresumeforgebuilder.com/contact')
  }, [])

  const handleCopy = () => {
    navigator.clipboard.writeText(email)
    alert("Email copied!")
  }

  const gmailLink = "https://mail.google.com/mail/?view=cm&fs=1&to=" + email + "&su=ResumeForge Support Request"
  const gmailLink2 = "https://mail.google.com/mail/?view=cm&fs=1&to=" + email

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">

        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Contact Us
        </h1>

        <p className="text-slate-600 mb-6 leading-relaxed">
          If you have any questions, feedback, or need help regarding ResumeForge,
          feel free to contact us anytime. We are here to help you.
        </p>

        <p className="text-slate-600 mb-8">
          For any kind of support or information, please email us at:
        </p>

        
          href={gmailLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          📩 Send Email
        </a>

        <p className="mt-6 text-sm text-slate-500">
          Or email directly at{" "}
          
            href={gmailLink2}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline font-medium"
          >
            {email}
          </a>
        </p>

        <button
          onClick={handleCopy}
          className="mt-4 text-sm text-blue-600 underline block mx-auto"
        >
          Copy Email Address
        </button>

        <p className="mt-3 text-xs text-slate-400">
          If email does not open on desktop, please copy the email and send manually.
        </p>

      </div>
    </PageLayout>
  )
}