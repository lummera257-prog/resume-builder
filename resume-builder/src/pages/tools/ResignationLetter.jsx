import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { LogOut, AlertCircle, Copy, Download, RefreshCw, Check, ChevronDown } from 'lucide-react'
import { useSEO } from '../../utils/useSEO'

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-b border-slate-200">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full py-4 flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-slate-800">{question}</span>
        <ChevronDown className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}
      >
        <p className="text-slate-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function ResignationLetter() {
  const [activeFormat, setActiveFormat] = useState('Standard Notice')
  
  const calculateLastDay = (notice) => {
    if (notice === 'Immediate') return new Date().toISOString().split('T')[0]
    
    const days = parseInt(notice) || 30
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString().split('T')[0]
  }

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    addressedTo: 'My Manager',
    customAddressedTo: '',
    notice_period: '30 days',
    last_day: calculateLastDay('30 days'),
    reason: '',
    tone: 'Professional & Grateful',
    language: 'English'
  })

  useEffect(() => {
    if (activeFormat !== 'Immediate Resignation') {
      setFormData(prev => ({ ...prev, last_day: calculateLastDay(prev.notice_period) }))
    }
  }, [formData.notice_period, activeFormat])

  const [error, setError] = useState(null)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  useSEO({
    title: 'Free Resignation Letter Generator – Professional Templates',
    description: 'Free resignation letter generator. Build a professional, simple, or immediate resignation letter instantly.',
    path: '/tools/resignation-letter',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGenerate = () => {
    if (!formData.name.trim() || !formData.company.trim()) {
      setError('Please fill in your name and company name.')
      return
    }

    setError(null)
    
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const addr = formData.addressedTo === 'Custom' ? formData.customAddressedTo : formData.addressedTo
    const finalAddr = addr || 'My Manager'
    
    let closing = 'Sincerely,'
    if (formData.tone === 'Neutral') closing = 'Regards,'
    else if (formData.tone === 'Apologetic') closing = 'With sincere apologies for any inconvenience,'

    let letter = ''
    const baseHeader = `${formData.name}
${formData.role || '[Job Title]'}
${date}

${finalAddr}
${formData.company}

Dear ${finalAddr},

`

    if (activeFormat === 'Standard Notice') {
      letter = `${baseHeader}I am writing to formally notify you of my resignation from my position as ${formData.role || '[Job Title]'} at ${formData.company}, effective ${formData.last_day} (${formData.notice_period} notice).

I am sincerely grateful for the opportunities for professional growth and development provided during my tenure here. I have truly valued my time with the team and the organization.

I am committed to ensuring a smooth transition and will do my best to complete all pending work and assist in training my replacement before my last day.

Thank you for your guidance and support.

${closing}

${formData.name}`
    } else if (activeFormat === 'Immediate Resignation') {
      const reasonText = formData.reason ? `\n${formData.reason}\n` : ''
      letter = `${baseHeader}I regret to inform you that due to unforeseen circumstances, I must resign from my position as ${formData.role || '[Job Title]'} at ${formData.company}, effective immediately.

I sincerely apologize for any inconvenience this may cause. I understand this is not ideal and I am fully willing to assist remotely during the transition period to ensure minimal disruption to the team.
${reasonText}
Thank you for your understanding.

${closing}

${formData.name}`
    } else if (activeFormat === 'Personal Reasons') {
      letter = `${baseHeader}Please accept this letter as my formal notice of resignation from my position as ${formData.role || '[Job Title]'} at ${formData.company}, effective ${formData.last_day}.

I have made this difficult decision due to personal reasons that require my full attention at this time. I want to assure you that this decision was not made lightly and is in no way a reflection of my experience at ${formData.company}.

I am truly grateful for the opportunities, experiences, and relationships I have built here. I will do everything I can to ensure a smooth handover before my departure.

Thank you for your understanding and support.

${closing}

${formData.name}`
    }

    setResult(letter)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    doc.setFont("helvetica")
    doc.setFontSize(11)

    const lines = doc.splitTextToSize(result, 170)
    doc.text(lines, 20, 20)

    doc.save(`Resignation_Letter_${formData.company.replace(/\s+/g, '_')}.pdf`)
  }

  return (
    <PageLayout>
      <div className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">Home</Link> &gt; <span className="text-slate-400">Tools</span> &gt; <span className="text-slate-800 font-medium">Resignation Letter Generator</span>
      </div>

      <div className="mb-10 text-center md:text-left max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Free Resignation Letter Generator</h1>
        <p className="text-lg text-slate-600">Generate a professional resignation letter instantly. Simple, formal, or immediate — perfectly formatted and ready to download.</p>
      </div>

      <div className="max-w-4xl mx-auto mb-16">
        {!result && (
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 shadow-inner">
            {['Standard Notice', 'Immediate Resignation', 'Personal Reasons'].map(format => (
              <button
                key={format}
                onClick={() => setActiveFormat(format)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${activeFormat === format ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {format}
              </button>
            ))}
          </div>
        )}

        {!result ? (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Your Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. John Smith" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Current Job Title</label>
                <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Marketing Executive" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Company Name *</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Global Tech LLC" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Letter Addressed To</label>
                <select name="addressedTo" value={formData.addressedTo} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                  <option>My Manager</option>
                  <option>HR Department</option>
                  <option>HR Manager</option>
                  <option>Director</option>
                  <option>Supervisor</option>
                  <option>Custom</option>
                </select>
              </div>
            </div>

            {formData.addressedTo === 'Custom' && (
              <div className="mb-5">
                <label className="block text-sm font-bold text-slate-800 mb-2">Enter Name or Title</label>
                <input type="text" name="customAddressedTo" value={formData.customAddressedTo} onChange={handleChange} placeholder="e.g. Dr. Sarah Connor" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
            )}

            {activeFormat !== 'Immediate Resignation' && (
              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Notice Period</label>
                  <select name="notice_period" value={formData.notice_period} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                    <option value="2 weeks">2 weeks</option>
                    <option value="30 days">30 days</option>
                    <option value="45 days">45 days</option>
                    <option value="60 days">60 days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Last Working Day</label>
                  <input type="date" name="last_day" value={formData.last_day} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-sm font-bold text-slate-800 mb-2">Reason for Leaving (optional)</label>
              <input type="text" name="reason" value={formData.reason} onChange={handleChange} placeholder="e.g. personal reasons, better opportunity, career change" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Tone</label>
                <select name="tone" value={formData.tone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                  <option>Professional & Grateful</option>
                  <option>Neutral</option>
                  <option>Apologetic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Language</label>
                <select name="language" value={formData.language} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                  <option>English</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-start gap-3">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-600/20 active:scale-[0.99]"
            >
              <LogOut size={20} /> Generate Resignation Letter →
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Check className="text-purple-500" size={18}/> Ready to Submit</h3>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={handleCopy} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
                  {copied ? <Check size={16} className="text-emerald-600"/> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={handleDownload} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-purple-600 border border-purple-600 text-white hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors">
                  <Download size={16} /> Download PDF
                </button>
                <button onClick={() => setResult('')} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">
                  <RefreshCw size={16} /> Edit
                </button>
              </div>
            </div>
            
            <div className="p-8 md:p-12">
              <div className="max-w-2xl mx-auto font-sans text-slate-800 whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEO Content */}
      <div className="max-w-3xl mx-auto py-12 border-t border-slate-200 prose prose-slate">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Write a Resignation Letter</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          A resignation letter should be brief, polite, and professional. Its primary purpose is to create an official record of notice, state your final day, and maintain a positive relationship with your employer. You do not need to over-explain your decision to leave.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">Resignation Letter Sample — What to Include</h2>
        <ul className="list-disc pl-6 text-slate-600 mb-8 space-y-2">
          <li><strong>The Date:</strong> Always include the date you submit the letter.</li>
          <li><strong>Statement of Resignation:</strong> Clearly state that you are resigning from your position.</li>
          <li><strong>Last Day of Work:</strong> Specify the exact date of your last day based on your notice period.</li>
          <li><strong>Gratitude:</strong> Thank your manager or the company for the opportunity.</li>
          <li><strong>Transition Offer:</strong> Offer to help wrap up your duties or train your replacement.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm not-prose mb-12">
          <FaqItem 
            question="How much notice should I give?" 
            answer="Check your employment contract. Standard notice is typically 2 weeks in the US, and 30-90 days in many other countries. Always default to what you legally agreed to." 
          />
          <FaqItem 
            question="Can I resign immediately without notice?" 
            answer="In at-will employment states (US), you can legally leave at any time. However, it may burn bridges and affect future references. In other regions, breaking a notice period contract could have legal or financial consequences." 
          />
          <FaqItem 
            question="Should I state my reason for leaving?" 
            answer="It is completely optional. If you are leaving for a better opportunity, you can mention it vaguely. If you are leaving due to dissatisfaction, it is better to say nothing at all in the letter." 
          />
        </div>
      </div>
    </PageLayout>
  )
}
