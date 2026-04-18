import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">

          {/* Brand */}
          <div>
            <span className="text-white font-semibold text-base">ResumeForge</span>
            <p className="text-xs text-gray-400 mt-1">Free ATS Resume Builder</p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Resume Tools</h3>
            <nav className="flex flex-col gap-2 text-xs">
              <Link to="/free-resume-builder" className="hover:text-white">Free Resume Builder</Link>
              <Link to="/ats-resume-builder" className="hover:text-white">ATS Resume Builder</Link>
              <Link to="/cv-builder" className="hover:text-white">CV Builder</Link>
              <Link to="/ats-resume-checker" className="hover:text-white">ATS Resume Checker</Link>
              <Link to="/resume-templates" className="hover:text-white">Resume Templates</Link>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Resources</h3>
            <nav className="flex flex-col gap-2 text-xs">
              <Link to="/blog" className="hover:text-white">Blog</Link>
              <Link to="/resume-examples" className="hover:text-white">Resume Examples</Link>
              <Link to="/resume-for-freshers" className="hover:text-white">Resume for Freshers</Link>
              <Link to="/software-engineer-resume" className="hover:text-white">Software Engineer Resume</Link>
              <Link to="/how-to-make-a-resume" className="hover:text-white">How to Make a Resume</Link>
            </nav>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-[11px] text-gray-500">
            © {new Date().getFullYear()} ResumeForge
          </div>
          <nav className="flex gap-3 text-[11px] text-gray-500">
            <Link to="/blog" className="hover:text-white">Blog</Link>
            <Link to="/about" className="hover:text-white">About</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
          </nav>
        </div>

      </div>
    </footer>
  );
}