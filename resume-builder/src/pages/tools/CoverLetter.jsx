import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { FileEdit, AlertCircle, Copy, Download, RefreshCw, Check, ChevronDown } from 'lucide-react'
import { jsPDF } from 'jspdf'

// FAQ Accordion component
function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-b border-slate-200">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full py-4 flex items-center justify-between text-left focus:outline-none"
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

export default function CoverLetter() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    role: '',
    company: '',
    addressedTo: 'Hiring Manager',
    customAddressedTo: '',
    experience: '',
    skills: '',
    achievement: '',
    tone: 'Professional',
    industry: 'Technology'
  })
  
  const [error, setError] = useState(null)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'Free Cover Letter Generator – Professional Templates'
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) { metaDesc = document.createElement('meta'); metaDesc.name = 'description'; document.head.appendChild(metaDesc) }
    metaDesc.content = 'Free cover letter generator. Build a professional, tailored cover letter instantly and download as PDF.'
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGenerate = () => {
    if (!formData.name.trim() || !formData.role.trim() || !formData.company.trim()) {
      setError('Please fill in your Full Name, Job Title, and Company Name.')
      return
    }

    setError(null)

    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const addr = formData.addressedTo === 'Custom' ? formData.customAddressedTo : formData.addressedTo
    const finalAddr = addr || 'Hiring Manager'
    
    let closing = 'Sincerely,'
    if (formData.tone === 'Enthusiastic') closing = 'With great enthusiasm,'
    else if (formData.tone === 'Formal') closing = 'Respectfully yours,'

    const letter = `${formData.name}
${formData.email} | ${formData.phone}
${formData.location} | ${date}

${formData.company}
Attn: ${finalAddr}

Dear ${finalAddr},

I am writing to express my strong interest in the ${formData.role} position at ${formData.company}. With ${formData.experience || 'several years'} of experience in the ${formData.industry} industry and expertise in ${formData.skills || 'my field'}, I am confident in my ability to make a significant contribution to your team.

In my previous role, I ${formData.achievement || 'consistently delivered high-quality results'}. This experience has equipped me with the skills necessary to excel in this position and deliver measurable results from day one.

I am particularly drawn to ${formData.company} because of its reputation for innovation and excellence. I would welcome the opportunity to discuss how my background, skills, and achievements align with your team's goals.

Thank you for your time and consideration. I look forward to the opportunity to speak with you.

${closing}

${formData.name}`

    setResult(letter)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const doc = new jsPDF()
    doc.setFont("helvetica")
    doc.setFontSize(11)
    
    const lines = doc.splitTextToSize(result, 170) // 210mm width - 40mm margins (20 left, 20 right)
    doc.text(lines, 20, 20) // 20mm top/left margins
    
    doc.save(`Cover_Letter_${formData.company.replace(/\s+/g, '_')}.pdf`)
  }

  return (
    <PageLayout>
      <div className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">Home</Link> &gt; <span className="text-slate-400">Tools</span> &gt; <span className="text-slate-800 font-medium">Cover Letter Generator</span>
      </div>

      <div className="mb-10 text-center md:text-left max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Free Cover Letter Generator</h1>
        <p className="text-lg text-slate-600">Fill in your details below. Generate a professional, tailored cover letter instantly. Ready to copy or download as PDF.</p>
      </div>

      <div className="max-w-4xl mx-auto mb-16">
        {!result ? (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            {/* Personal Info */}
            <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Jane Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="e.g. jane@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. (555) 123-4567" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">City, State</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. New York, NY" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>

            {/* Job Info */}
            <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2">Job Information</h3>
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Job Title Applying For *</label>
                <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Senior Frontend Developer" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Company Name *</label>
                <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. TechCorp Inc." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Letter Addressed To</label>
                <select name="addressedTo" value={formData.addressedTo} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                  <option>Hiring Manager</option>
                  <option>HR Manager</option>
                  <option>Supervisor</option>
                  <option>Director</option>
                  <option>Recruiter</option>
                  <option>Custom</option>
                </select>
              </div>
              {formData.addressedTo === 'Custom' && (
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">Enter Name or Title</label>
                  <input type="text" name="customAddressedTo" value={formData.customAddressedTo} onChange={handleChange} placeholder="e.g. Dr. Smith" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
              )}
            </div>

            {/* Experience & Skills */}
            <h3 className="font-bold text-lg text-slate-800 mb-4 border-b pb-2 mt-8">Experience & Skills</h3>
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Years of Experience</label>
                <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5 years" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Key Skills (comma separated)</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. React, Node.js, Project Management" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-bold text-slate-800 mb-2">Your Biggest Achievement</label>
              <input type="text" name="achievement" value={formData.achievement} onChange={handleChange} placeholder="e.g. increased sales by 20% in Q3" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
            </div>

            <div className="grid md:grid-cols-2 gap-5 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Tone</label>
                <select name="tone" value={formData.tone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                  <option>Professional</option>
                  <option>Enthusiastic</option>
                  <option>Formal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">Industry</label>
                <select name="industry" value={formData.industry} onChange={handleChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                  <option>Technology</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Other</option>
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
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-600/20 active:scale-[0.99]"
            >
              <FileEdit size={20} /> Generate My Cover Letter →
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Check className="text-emerald-500" size={18}/> Ready to Send</h3>
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={handleCopy} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors">
                  {copied ? <Check size={16} className="text-emerald-600"/> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={handleDownload} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 border border-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-sm font-medium transition-colors">
                  <Download size={16} /> Download PDF
                </button>
                <button onClick={() => setResult('')} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors">
                  <RefreshCw size={16} /> Edit
                </button>
              </div>
            </div>
            
            <div className="p-8 md:p-12">
              <div className="max-w-2xl mx-auto font-sans text-slate-800 whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
              <p className="text-slate-600 mb-4 text-sm">Now that you have a great cover letter, make sure your resume matches.</p>
              <Link to="/builder" className="inline-flex px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                Pair with a matching resume →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* SEO Content */}
      <div className="max-w-3xl mx-auto py-12 border-t border-slate-200 prose prose-slate">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">What Makes a Great Cover Letter?</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          A great cover letter doesn't just repeat your resume—it tells the story of your career. It connects your past achievements directly to the specific needs of the company you are applying to. It should show genuine enthusiasm for the role and demonstrate that you've done your research about the organization.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mb-4">Cover Letter Tips by Industry</h2>
        <ul className="list-disc pl-6 text-slate-600 mb-8 space-y-2">
          <li><strong>Technology:</strong> Focus on problem-solving, specific tech stacks, and how your code impacted business metrics.</li>
          <li><strong>Marketing:</strong> Highlight successful campaigns, ROI, and your ability to understand target audiences. Let your creativity shine in the writing.</li>
          <li><strong>Finance:</strong> Keep it formal, highly analytical, and focus on accuracy, risk management, and financial modeling achievements.</li>
          <li><strong>Healthcare:</strong> Emphasize patient care, compliance with regulations, and your ability to work calmly under pressure.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm not-prose mb-12">
          <FaqItem 
            question="Are cover letters still necessary in 2026?" 
            answer="While some companies rely solely on resumes, a well-written cover letter can be the deciding factor when choosing between two equally qualified candidates. It shows extra effort and allows you to explain context that a resume cannot." 
          />
          <FaqItem 
            question="How long should a cover letter be?" 
            answer="Your cover letter should almost never exceed one page. The sweet spot is 3-4 concise paragraphs, or roughly 250-300 words. Recruiters skim, so make every sentence count." 
          />
          <FaqItem 
            question="Should I include my contact info?" 
            answer="Yes, when you copy this letter into an email or document, be sure to add your standard header (Name, Phone, Email, LinkedIn) at the top, and the employer's details if sending a formal PDF. Our PDF download handles this formatting automatically." 
          />
          <FaqItem 
            question="Who should I address the cover letter to?" 
            answer="Try to find the name of the hiring manager. If you cannot find it, 'Dear Hiring Manager' or 'Dear [Team Name] Team' is the best professional alternative. Avoid 'To Whom It May Concern'." 
          />
        </div>
      </div>
    </PageLayout>
  )
}
