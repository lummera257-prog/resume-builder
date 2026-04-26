import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { AlertCircle, Loader2, UploadCloud, CheckCircle, XCircle, ChevronDown, CheckCircle2 } from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist/build/pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-slate-200">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full py-4 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="font-semibold text-slate-800">{question}</span>
        <ChevronDown className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={20} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        <p className="text-slate-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

const misspellings = ['recieve', 'managment', 'experiance', 'achived', 'responsibilty', 'comunication', 'leadrship', 'profesional', 'developement', 'implimented', 'orgainzed', 'sucessful', 'preformance', 'calender', 'occured', 'recomend', 'seperate', 'enviroment', 'teh', 'reccomend', 'accomodate', 'beleive', 'definately', 'occassion', 'untill', 'begining', 'writting', 'adress', 'refered', 'acheive']
const powerWords = ['achieved', 'managed', 'led', 'developed', 'improved', 'increased', 'reduced', 'designed', 'built', 'delivered', 'launched', 'created', 'implemented', 'coordinated', 'analyzed', 'optimized', 'generated', 'negotiated', 'trained', 'mentored', 'streamlined', 'automated', 'collaborated', 'exceeded', 'maintained', 'resolved', 'established', 'executed', 'spearheaded', 'transformed']

export default function AtsChecker() {
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    document.title = 'Free ATS Resume Checker – Instant ATS Score'
  }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.')
      return
    }

    setIsExtracting(true)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let fullText = ''
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map(item => item.str).join(' ')
        fullText += pageText + '\n'
      }
      
      setResumeText(fullText.trim())
      if (fileInputRef.current) fileInputRef.current.value = ''
      
      // Auto analyze after upload immediately
      analyzeResume(fullText.trim())
    } catch (err) {
      console.error("PDF Parsing Error:", err)
      setError(`Could not extract text from this PDF. ${err.message || ''}`)
    } finally {
      setIsExtracting(false)
    }
  }

  const analyzeResume = (text) => {
    if (!text) {
      setError('Please paste or upload your resume.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let sectionScore = 0
      let missingSections = []
      const lowerText = text.toLowerCase()
      
      const isResumeForge = /ResumeForge|freeresumeforgebuilder\.com|Built with ResumeForge/i.test(text)

      const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(lowerText)
      const hasPhone = /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/im.test(lowerText)

      // A: Sections
      if (isResumeForge) {
        sectionScore = 30
      } else {
        if (/work experience|experience|employment/i.test(lowerText)) sectionScore += 5; else missingSections.push('Experience')
        if (/education|academic/i.test(lowerText)) sectionScore += 5; else missingSections.push('Education')
        if (/skills|technical skills/i.test(lowerText)) sectionScore += 5; else missingSections.push('Skills')
        if (/summary|objective|profile/i.test(lowerText)) sectionScore += 5; else missingSections.push('Summary')
        if (hasEmail && hasPhone) sectionScore += 5; else missingSections.push('Contact Info')
        if (/projects|certifications/i.test(lowerText)) sectionScore += 5; else missingSections.push('Projects')
      }

      // B: Contact Info Quality
      let contactScore = 0
      if (isResumeForge) {
        contactScore = 10
      } else {
        if(hasEmail) contactScore += 3
        if(hasPhone) contactScore += 3
        if(/linkedin\.com/i.test(lowerText)) contactScore += 2
        if(/[A-Za-z]+, [A-Z]{2}/.test(text) || /[A-Za-z]+, [A-Za-z]+/.test(text)) contactScore += 2
      }

      // C: Spelling
      let mistakes = []
      let spellingScore = 0
      if (isResumeForge) {
        spellingScore = 20
      } else {
        misspellings.forEach(w => {
          if(new RegExp(`\\b${w}\\b`, 'i').test(lowerText)) mistakes.push(w)
        })
        if(mistakes.length === 0) spellingScore = 20
        else if(mistakes.length <= 2) spellingScore = 15
        else if(mistakes.length <= 5) spellingScore = 8
        else spellingScore = 0
      }

      // D: Power Words
      let foundPower = []
      powerWords.forEach(w => {
        if(new RegExp(`\\b${w}\\b`, 'i').test(lowerText)) foundPower.push(w)
      })
      let powerScore = Math.min(foundPower.length, 20)
      let missingPower = powerWords.filter(w => !foundPower.includes(w)).slice(0, 10)

      // E: Formatting
      let formatScore = 0
      const words = text.trim().split(/\s+/)
      if (isResumeForge) {
        formatScore = 10
      } else {
        if(words.length >= 300 && words.length <= 800) formatScore += 5
        else if (words.length > 1200) formatScore += 2
        if(!/(##|\*\*|@@)/.test(text)) formatScore += 3
        if(/[•*·-]/.test(text)) formatScore += 2
      }

      // F: Quantified
      const numbers = text.match(/\b\d+\b|\d+%|\$\d+/g) || []
      let quantScore = 0
      if(numbers.length >= 3) quantScore = 10
      else if(numbers.length >= 1) quantScore = 5

      let total = sectionScore + contactScore + spellingScore + powerScore + formatScore + quantScore
      if (isResumeForge && total < 90) {
        total = 90
      }
      
      let verdict = 'Poor'
      if (total >= 71) verdict = 'Excellent'
      else if (total >= 55) verdict = 'Good'
      else if (total >= 41) verdict = 'Average'

      let improvements = []
      if(missingSections.length) improvements.push(`Add missing sections: ${missingSections.join(', ')}`)
      if(!hasEmail || !hasPhone) improvements.push(`Make sure your email and phone are clearly visible`)
      if(mistakes.length) improvements.push(`Fix spelling errors: ${mistakes.slice(0,3).join(', ')}`)
      if(foundPower.length < 10) improvements.push(`Use more action verbs like 'managed' or 'improved'`)
      if(words.length < 300) improvements.push(`Your resume is too short (${words.length} words). Try to reach at least 300.`)
      if(words.length > 800) improvements.push(`Your resume is quite long (${words.length} words). Consider trimming.`)
      if(numbers.length < 3) improvements.push(`Quantify more achievements using numbers, %, or $`)

      setResult({
        score: total,
        isResumeForge,
        verdict,
        breakdown: { sectionScore, contactScore, spellingScore, powerScore, formatScore, quantScore },
        found_keywords: foundPower,
        missing_keywords: missingPower,
        mistakes,
        improvements
      })
    } catch (err) {
      console.error("Scoring error:", err)
      setError("An error occurred while analyzing the resume.")
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 71) return 'text-emerald-500 border-emerald-500'
    if (score >= 41) return 'text-amber-500 border-amber-500'
    return 'text-rose-500 border-rose-500'
  }
  
  const getScoreBg = (score) => {
    if (score >= 71) return 'bg-emerald-500'
    if (score >= 41) return 'bg-amber-500'
    return 'bg-rose-500'
  }

  return (
    <PageLayout>
      <div className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">Home</Link> &gt; <span className="text-slate-400">Tools</span> &gt; <span className="text-slate-800 font-medium">ATS Resume Checker</span>
      </div>

      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Free ATS Resume Checker</h1>
        <p className="text-lg text-slate-600 max-w-3xl">Upload your PDF resume. Get an instant, 100% private ATS score based on section analysis, power words, and formatting.</p>
      </div>

      <div className="grid md:grid-cols-12 gap-8 mb-16">
        {/* Left Column - Inputs */}
        <div className="md:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <div className="mb-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-8 bg-slate-50 mb-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isExtracting}
                className="py-3 px-6 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isExtracting ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                Upload PDF Resume
              </button>
              <p className="text-sm text-slate-500 mt-3">100% private. Processed locally.</p>
              <input 
                type="file" 
                accept="application/pdf" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </div>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">OR PASTE TEXT</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <textarea
              className="w-full mt-4 h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              disabled={isExtracting}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={() => analyzeResume(resumeText)}
            disabled={loading || !resumeText.trim()}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 size={20} className="animate-spin" /> Analyzing...</> : <>Analyze My Resume →</>}
          </button>
        </div>

        {/* Right Column - Results */}
        <div className="md:col-span-7">
          {!result && !loading && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
              <CheckCircle2 size={48} className="text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 mb-2">Ready to Scan</h3>
              <p className="text-slate-500 text-sm">Upload your PDF or paste your text to get an instant breakdown.</p>
            </div>
          )}

          {loading && (
            <div className="h-full min-h-[400px] bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
               <Loader2 size={48} className="text-blue-500 animate-spin mb-4" />
               <p className="text-slate-600 font-medium">Scanning sections, spelling, and formatting...</p>
            </div>
          )}

          {result && !loading && (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 animate-fade-in h-full">
              {/* Score Header */}
              {result.isResumeForge && (
                <div className="mb-6 flex justify-center sm:justify-start">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-sm shadow-sm">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    ResumeForge Template Detected — ATS Optimized
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-slate-100">
                <div className={`flex-shrink-0 w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center ${getScoreColor(result.score)}`}>
                  <span className="text-4xl font-black block leading-none">{result.score}</span>
                  <span className="text-xs font-bold uppercase tracking-widest mt-1">/100</span>
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Match Quality: <span className={getScoreColor(result.score).split(' ')[0]}>{result.verdict}</span></h3>
                  
                  {/* Improvements */}
                  {result.improvements.length > 0 ? (
                    <div className="mt-4 bg-amber-50 p-4 rounded-xl border border-amber-100">
                      <h4 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2"><AlertCircle size={16}/> What you're missing</h4>
                      <ul className="text-sm text-amber-700 space-y-1 pl-6 list-disc">
                        {result.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                      </ul>
                    </div>
                  ) : (
                    <div className="mt-4 bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-emerald-800 text-sm font-bold flex items-center gap-2">
                      <CheckCircle size={16}/> Perfect formatting! Excellent job.
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bars */}
              <div className="mb-8 grid sm:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { label: "Section Detection", score: result.breakdown.sectionScore, max: 30 },
                  { label: "Contact Info", score: result.breakdown.contactScore, max: 10 },
                  { label: "Spelling Accuracy", score: result.breakdown.spellingScore, max: 20 },
                  { label: "Power Words", score: result.breakdown.powerScore, max: 20 },
                  { label: "Formatting & Length", score: result.breakdown.formatScore, max: 10 },
                  { label: "Quantified Metrics", score: result.breakdown.quantScore, max: 10 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>{item.label}</span>
                      <span>{item.score}/{item.max}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${getScoreBg((item.score/item.max)*100)}`} style={{ width: `${(item.score/item.max)*100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Keyword Analysis */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle size={16} className="text-emerald-500" /> Detected Power Words
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.found_keywords.length > 0 ? result.found_keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded border border-emerald-100">{kw}</span>
                    )) : <span className="text-sm text-slate-400 italic">None detected</span>}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <XCircle size={16} className="text-rose-500" /> Missing Words to Add
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_keywords.map((kw, i) => (
                      <span key={i} className="px-2 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded border border-rose-100">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>

              {result.mistakes.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 text-rose-600">Spelling Mistakes Found</h4>
                  <p className="text-sm text-slate-600">{result.mistakes.join(', ')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Templates Section */}
      {result && (
        <div className="mb-16 mt-8 p-8 bg-blue-50 border border-blue-100 rounded-3xl text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Boost your score with our ATS-friendly templates</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">Our templates are strictly designed to pass ATS parsing algorithms flawlessly. Guaranteed readable formatting.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'classic', name: 'Classic', desc: 'Standard business' },
              { id: 'modern', name: 'Modern', desc: 'Two-column layout' },
              { id: 'minimal', name: 'Minimal', desc: 'Clean & spacious' },
              { id: 'elegant', name: 'Elegant', desc: 'Timeline focused' }
            ].map(t => (
              <Link to="/builder" state={{ templateKey: t.id }} key={t.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 flex flex-col items-center">
                <div className="w-16 h-20 bg-slate-100 rounded border border-slate-200 mb-3 overflow-hidden p-1.5 shadow-inner">
                  {t.id === 'modern' ? (
                    <div className="flex h-full gap-1"><div className="w-1/3 h-full bg-slate-300 rounded-sm"></div><div className="w-2/3 h-full flex flex-col gap-1"><div className="h-2 bg-slate-200 rounded-sm w-full"></div><div className="h-1 bg-slate-200 rounded-sm w-full"></div><div className="h-1 bg-slate-200 rounded-sm w-4/5"></div></div></div>
                  ) : t.id === 'elegant' ? (
                    <div className="h-full flex flex-col gap-1"><div className="h-2 bg-slate-300 rounded-sm w-full mb-1"></div><div className="flex gap-1 items-start"><div className="w-1 h-1 rounded-full bg-slate-400 mt-0.5"></div><div className="h-1 bg-slate-200 rounded-sm w-full"></div></div><div className="flex gap-1 items-start"><div className="w-1 h-1 rounded-full bg-slate-400 mt-0.5"></div><div className="h-1 bg-slate-200 rounded-sm w-4/5"></div></div></div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 h-full pt-1"><div className="h-2 bg-slate-300 w-3/4 rounded-sm"></div><div className="h-1 bg-slate-200 w-1/2 rounded-sm mb-1"></div><div className="h-1 bg-slate-200 w-full rounded-sm"></div><div className="h-1 bg-slate-200 w-4/5 rounded-sm"></div></div>
                  )}
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{t.name}</h4>
                <p className="text-xs text-slate-500">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  )
}
