import { Link } from 'react-router-dom'
import { FileEdit, Wrench, LogOut, CheckCircle, Shield, Zap, FileText, Star, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { useSEO } from '../utils/useSEO'

// FAQ Accordion component
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

export default function Home() {
  useSEO({
    title: 'Free ATS-Friendly Resume Builder – No Login Required | ResumeForge',
    description: 'Build an ATS-optimized resume for free. Access instant PDF downloads, AI cover letter generator, and resume checker. No login needed.',
    path: '/',
  })

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar />
      <section className="bg-white border-b border-slate-200 pt-16 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            100% Free Forever
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
            Build an ATS-Friendly<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Resume That Gets You Hired</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Free resume builder trusted by thousands of job seekers. ATS-optimized, instant PDF download, no login required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/builder" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              Build My Resume Free
            </Link>
            <Link to="/tools/ats-checker" className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-semibold text-lg hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              Check My ATS Score
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500 font-medium">
            100% Free · No Login · ATS-Friendly · Instant PDF
          </p>
        </div>
      </section>

      {/* 2. Features Strip */}
      <section className="bg-slate-900 py-8 px-4 text-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400">
              <CheckCircle size={20} />
            </div>
            <span className="font-semibold text-sm">Free Forever</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400">
              <Zap size={20} />
            </div>
            <span className="font-semibold text-sm">ATS-Optimized</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-rose-400">
              <FileText size={20} />
            </div>
            <span className="font-semibold text-sm">Instant PDF</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-purple-400">
              <Shield size={20} />
            </div>
            <span className="font-semibold text-sm">Private & Secure</span>
          </div>
        </div>
      </section>

      {/* 3. Tools Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Free AI Resume Tools</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Boost your chances of getting hired with our suite of free, AI-powered tools designed specifically for job seekers.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Tool 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Wrench size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">ATS Resume Checker</h3>
              <p className="text-slate-600 mb-6 line-clamp-2">Upload your resume and the job description. Get an instant match score and missing keywords.</p>
              <Link to="/tools/ats-checker" className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700">
                Use Free Tool <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            {/* Tool 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileEdit size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Cover Letter Generator</h3>
              <p className="text-slate-600 mb-6 line-clamp-2">Generate a highly tailored, professional cover letter using our advanced AI model.</p>
              <Link to="/tools/cover-letter" className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-700">
                Use Free Tool <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            {/* Tool 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow group">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <LogOut size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Resignation Letter</h3>
              <p className="text-slate-600 mb-6 line-clamp-2">Leaving your job? Generate a professional, polite resignation letter in seconds.</p>
              <Link to="/tools/resignation-letter" className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700">
                Use Free Tool <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="py-20 px-4 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">Build Your Resume in 3 Simple Steps</h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-slate-100 z-0"></div>
            
            <div className="relative z-10 bg-white">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-blue-600/20">1</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Fill Details</h3>
              <p className="text-slate-600 px-4">Enter your experience, education, and skills into our easy-to-use form.</p>
            </div>
            
            <div className="relative z-10 bg-white">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-blue-600/20">2</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Choose Template</h3>
              <p className="text-slate-600 px-4">Select from our professionally designed, ATS-friendly templates.</p>
            </div>
            
            <div className="relative z-10 bg-white">
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-blue-600/20">3</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Download PDF</h3>
              <p className="text-slate-600 px-4">Instantly download your resume as a PDF and start applying!</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Resume Templates Preview */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">ATS-Friendly Templates</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-12">Our templates are designed to pass through Applicant Tracking Systems flawlessly while looking professional to human recruiters.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { id: 'classic', name: 'Classic', desc: 'ATS-Friendly' },
              { id: 'modern', name: 'Modern', desc: 'Two-column layout' },
              { id: 'minimal', name: 'Minimal', desc: 'Clean typography' },
              { id: 'elegant', name: 'Elegant', desc: 'Timeline layout' }
            ].map((t) => (
              <div key={t.id} className="aspect-[1/1.4] bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden relative group flex flex-col">
                
                {/* Wireframe wrapper */}
                <div className="flex-1 w-full bg-slate-50 relative overflow-hidden pointer-events-none">
                  
                  {t.id === 'classic' && (
                    <div className="absolute inset-x-4 top-4 bottom-4 flex flex-col gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <div className="h-5 w-1/2 bg-blue-600 rounded mx-auto mb-1"></div>
                      <div className="h-1.5 w-1/3 bg-slate-400 rounded mx-auto mb-3"></div>
                      <div className="h-2 w-1/4 bg-slate-500 rounded border-b border-slate-300 pb-1 mb-1"></div>
                      <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                      <div className="h-1.5 w-5/6 bg-slate-300 rounded mb-2"></div>
                      <div className="h-2 w-1/4 bg-slate-500 rounded border-b border-slate-300 pb-1 mb-1"></div>
                      <div className="h-1.5 w-full bg-slate-300 rounded"></div>
                      <div className="h-1.5 w-4/5 bg-slate-300 rounded"></div>
                    </div>
                  )}

                  {t.id === 'modern' && (
                    <div className="absolute inset-0 flex opacity-60 group-hover:opacity-100 transition-opacity">
                      <div className="w-1/3 bg-slate-800 h-full p-2 flex flex-col gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-600 mx-auto mb-2"></div>
                        <div className="h-1 w-full bg-slate-600 rounded"></div>
                        <div className="h-1 w-4/5 bg-slate-600 rounded"></div>
                        <div className="h-1 w-full bg-slate-600 rounded"></div>
                      </div>
                      <div className="w-2/3 p-3 flex flex-col gap-2 bg-white">
                        <div className="h-3 w-3/4 bg-blue-600 rounded mb-2"></div>
                        <div className="h-1 w-1/3 bg-slate-400 rounded mb-2"></div>
                        <div className="h-1 w-full bg-slate-200 rounded"></div>
                        <div className="h-1 w-5/6 bg-slate-200 rounded mb-2"></div>
                        <div className="h-1 w-full bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  )}

                  {t.id === 'minimal' && (
                    <div className="absolute inset-x-5 top-5 bottom-5 flex flex-col gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <div className="h-4 w-2/3 bg-slate-800 rounded mb-1"></div>
                      <div className="h-1 w-1/3 bg-slate-400 rounded mb-4"></div>
                      <div className="h-1.5 w-1/4 bg-slate-800 rounded mb-1"></div>
                      <div className="h-1 w-full bg-slate-200 rounded"></div>
                      <div className="h-1 w-3/4 bg-slate-200 rounded mb-3"></div>
                      <div className="h-1.5 w-1/4 bg-slate-800 rounded mb-1"></div>
                      <div className="h-1 w-full bg-slate-200 rounded"></div>
                      <div className="h-1 w-4/5 bg-slate-200 rounded"></div>
                    </div>
                  )}

                  {t.id === 'elegant' && (
                    <div className="absolute inset-x-4 top-5 bottom-4 flex flex-col gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <div className="h-4 w-1/2 bg-violet-700 rounded mb-1"></div>
                      <div className="h-1 w-1/3 bg-slate-400 rounded mb-4"></div>
                      <div className="flex gap-2 h-full">
                        <div className="w-px bg-violet-200 h-full relative">
                          <div className="absolute -left-1 top-1 w-2 h-2 rounded-full bg-violet-500"></div>
                          <div className="absolute -left-1 top-8 w-2 h-2 rounded-full bg-violet-500"></div>
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="h-1.5 w-1/3 bg-slate-500 rounded mt-1"></div>
                          <div className="h-1 w-full bg-slate-200 rounded"></div>
                          <div className="h-1 w-5/6 bg-slate-200 rounded mb-3"></div>
                          <div className="h-1.5 w-1/3 bg-slate-500 rounded mt-1"></div>
                          <div className="h-1 w-full bg-slate-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Overlay Button */}
                <div className="absolute inset-0 z-10 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                  <Link to="/builder" state={{ templateKey: t.id }} className="px-4 py-2 bg-white text-blue-600 rounded-lg font-bold text-sm hover:scale-105 transition-transform shadow-lg">
                    Use Template
                  </Link>
                </div>

                {/* Footer Label */}
                <div className="p-3 bg-white border-t border-slate-100 flex flex-col items-center justify-center relative z-20">
                  <span className="font-bold text-slate-800 text-sm">{t.name}</span>
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{t.desc}</span>
                </div>
              </div>
            ))}
          </div>
          
          <Link to="/resume-templates" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700">
            Browse All Templates →
          </Link>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="py-20 px-4 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Loved by Job Seekers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="flex text-amber-400 mb-4"><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
              <p className="text-slate-700 mb-6">"I used to struggle with formatting my resume in Word. ResumeForge made it incredibly easy, and the ATS checker helped me realize I was missing key skills. I got 3 interviews in a week!"</p>
              <div>
                <p className="font-bold text-slate-900">Sarah Jenkins</p>
                <p className="text-sm text-slate-500">Marketing Manager</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="flex text-amber-400 mb-4"><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
              <p className="text-slate-700 mb-6">"The cover letter generator is magic. It saved me hours of staring at a blank screen. It sounds so professional and tailored to my industry."</p>
              <div>
                <p className="font-bold text-slate-900">David Chen</p>
                <p className="text-sm text-slate-500">Software Engineer</p>
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <div className="flex text-amber-400 mb-4"><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/><Star fill="currentColor" size={16}/></div>
              <p className="text-slate-700 mb-6">"Finally, a resume builder that is actually free. No hidden paywalls when you click download. Clean, simple, and the PDF looks perfect."</p>
              <div>
                <p className="font-bold text-slate-900">Amanda Rivera</p>
                <p className="text-sm text-slate-500">Recent Graduate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <FaqItem 
              question="Is ResumeForge really 100% free?" 
              answer="Yes! There are no hidden fees, premium tiers, or watermarks. You can build, customize, and download your resume completely free of charge." 
            />
            <FaqItem 
              question="Do I need to create an account?" 
              answer="No, you don't need to sign up or log in. Your resume data is saved locally in your browser so you can come back and edit it later without needing an account." 
            />
            <FaqItem 
              question="Will my resume pass ATS systems?" 
              answer="Absolutely. All of our templates are specifically designed to be easily parsed by Applicant Tracking Systems (ATS). We avoid complex layouts like tables or graphics that confuse ATS software." 
            />
            <FaqItem 
              question="How do the AI tools work?" 
              answer="Our AI tools use advanced language models to generate professional cover letters, analyze your resume against job descriptions, and write resignation letters. We do not store or share your input data." 
            />
            <FaqItem 
              question="Can I edit my downloaded PDF?" 
              answer="To make changes, simply come back to ResumeForge (using the same browser) and edit your details in our builder, then download a fresh PDF." 
            />
          </div>
        </div>
      </section>

      {/* 8. Final CTA Banner */}
      <section className="py-24 px-4 bg-blue-600 text-center text-white relative overflow-hidden">
        {/* Background Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-white blur-[100px]"></div>
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Start Building Your Free Resume Today</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">Join thousands of successful job seekers who used ResumeForge to land their dream roles.</p>
          <Link to="/builder" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:bg-slate-50 hover:shadow-xl active:scale-95 transition-all shadow-lg shadow-black/10">
            Build My Resume Free
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  )
}
