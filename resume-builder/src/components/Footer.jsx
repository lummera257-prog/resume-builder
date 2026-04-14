import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-white font-bold text-lg">ResumeForge</span>
            <p className="text-sm text-gray-400 mt-1">Free ATS-Friendly Resume Builder</p>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </nav>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} ResumeForge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}