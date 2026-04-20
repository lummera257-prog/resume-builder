import NavBar from './NavBar'
import Footer from './Footer'

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar />
      {/* ✅ aria-label added — screen readers ke liye */}
      <main
        id="main-content"
        aria-label="Main content"
        className="flex-grow max-w-4xl mx-auto w-full px-4 py-12"
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
