import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '../../components/PageLayout'
import { useSEO } from '../../utils/useSEO'
import { CheckCircle, ChevronDown } from 'lucide-react'

function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border-b border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-center justify-between text-left"
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

export default function AtsChecker() {
  useSEO({
    title: 'Free ATS Resume Checker – Instant ATS Score',
    description: 'Check your resume ATS score for free. Get an instant compatibility score and tips to help your resume pass Applicant Tracking Systems.',
    path: '/tools/ats-checker',
  })

  return (
    <PageLayout>
      <div className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">Home</Link> &gt; <span className="text-slate-400">Tools</span> &gt; <span className="text-slate-800 font-medium">ATS Resume Checker</span>
      </div>

      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Free ATS Resume Checker</h1>
        <p className="text-lg text-slate-600 max-w-3xl">Upload your PDF resume. Get an instant, 100% private ATS score based on section analysis, power words, and formatting.</p>
      </div>

      {/* 🚧 Under Maintenance */}
      <div className="mb-16 flex flex-col items-center justify-center text-center py-16 px-8 bg-amber-50 border-2 border-dashed border-amber-300 rounded-3xl">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold text-amber-800 mb-3">Tool Under Maintenance</h2>
        <p className="text-amber-700 max-w-xl mb-6">We're upgrading our ATS Resume Checker to make it even more powerful and accurate. It'll be back soon — better than ever!</p>
        <Link to="/builder" className="inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
          Build Your Free Resume Instead →
        </Link>
      </div>

      {/* SEO Content */}
      <div className="max-w-3xl mx-auto mb-16 space-y-12">

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What is an ATS Score?</h2>
          <p className="text-slate-600 leading-relaxed">An ATS (Applicant Tracking System) score measures how well your resume is optimized for automated hiring software. Over 98% of Fortune 500 companies use ATS to filter resumes before a human ever sees them. If your resume scores below 70, it is likely rejected automatically — no matter how qualified you are. Our free ATS resume checker analyzes your resume instantly, giving you a detailed score across 6 key areas so you know exactly what to fix. No login required, 100% private, and processed locally on your device.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">How Our Free ATS Resume Checker Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Upload Your Resume', desc: 'Upload your PDF resume or paste your resume text directly into the checker.' },
              { step: '2', title: 'Instant Analysis', desc: 'We scan for keywords, section structure, spelling accuracy, formatting, and quantified achievements.' },
              { step: '3', title: 'Get Your Score', desc: 'Receive an instant ATS score out of 100 with specific improvement tips and missing keywords.' },
            ].map(item => (
              <div key={item.step} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">{item.step}</div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">What Makes a Resume ATS-Friendly?</h2>
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-start gap-3"><CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" /><span><strong>Use standard section headings</strong> — Stick to headings like "Work Experience", "Education", and "Skills" that ATS systems recognize.</span></li>
            <li className="flex items-start gap-3"><CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" /><span><strong>Include job-specific keywords</strong> — Mirror the language used in the job description naturally throughout your resume.</span></li>
            <li className="flex items-start gap-3"><CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" /><span><strong>Avoid tables, columns, and graphics</strong> — Complex layouts confuse ATS parsers and can cause your resume to be misread.</span></li>
            <li className="flex items-start gap-3"><CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" /><span><strong>Use standard fonts</strong> — Arial, Calibri, or Times New Roman are safe choices that ATS systems handle correctly.</span></li>
            <li className="flex items-start gap-3"><CheckCircle size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" /><span><strong>Save as PDF or Word</strong> — A standard PDF preserves your formatting while remaining machine-readable.</span></li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Who Should Use an ATS Checker?</h2>
          <p className="text-slate-600 leading-relaxed">Anyone applying for jobs online should check their resume for ATS compatibility. This includes recent graduates and freshers applying for their first job, experienced professionals switching roles or industries, career changers entering a new field, and anyone who has been applying to jobs without hearing back. If your resume is not passing ATS filters, even the most impressive experience will never reach a recruiter's desk.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6">
            <FaqItem question="Is this ATS checker really free?" answer="Yes, 100% free. No login, no credit card, no hidden fees. Upload your resume and get your score instantly." />
            <FaqItem question="How accurate is the ATS score?" answer="Our scoring analyzes 6 key factors: section detection, contact info quality, spelling accuracy, power words, formatting and length, and quantified achievements — giving you a reliable score out of 100." />
            <FaqItem question="What file types are supported?" answer="We support PDF uploads and direct text paste. Simply upload your PDF resume or copy and paste your resume text into the checker." />
            <FaqItem question="What is a good ATS score?" answer="A score of 75 or above is considered good. A score of 90 or above means your resume is fully ATS-ready and should pass automated filters at most companies." />
            <FaqItem question="Will a high ATS score guarantee an interview?" answer="A high ATS score means your resume passes automated filters and reaches human recruiters — significantly improving your chances. However, the final interview decision is made by the hiring team." />
            <FaqItem question="How do I improve my ATS score?" answer="Use our free resume builder which comes with 6 professionally designed ATS-optimized templates. Resumes built with ResumeForge templates automatically score 90+ on our ATS checker." />
          </div>
        </section>

      </div>
    </PageLayout>
  )
}