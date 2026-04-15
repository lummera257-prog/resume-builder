import { Link, useLocation } from 'react-router-dom'
import { FileText } from 'lucide-react'

export default function NavBar() {
  const location = useLocation()

  const navLinks = [
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 h-14 max-w-4xl mx-auto">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <FileText size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-800 text-base tracking-tight">
            ResumeForge
          </span>
        </Link>

        {/* Nav Links + CTA */}
        <div className="flex items-center gap-1 sm:gap-4">

          {/* About + Contact links */}
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hidden sm:inline-block ${
                location.pathname === link.to
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* CTA Button */}
          <Link
            to="/"
            className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Build My Resume →
          </Link>
        </div>
      </div>
    </header>
  )
}