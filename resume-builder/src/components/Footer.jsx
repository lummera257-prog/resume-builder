import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Left */}
          <div className="text-center md:text-left">
            <span className="text-white font-semibold text-base">
              ResumeForge
            </span>
            <p className="text-xs text-gray-400 mt-1">
              Free ATS Resume Builder
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-3 text-xs">
            <Link to="/about" className="hover:text-white">
              About
            </Link>
            <Link to="/contact" className="hover:text-white">
              Contact
            </Link>
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
          </nav>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-4 pt-3 text-center text-[11px] text-gray-500">
          © {new Date().getFullYear()} ResumeForge
        </div>

      </div>
    </footer>
  );
}