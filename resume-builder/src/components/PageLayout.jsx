import NavBar from './NavBar'
import Footer from './Footer'

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar />
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
        {children}
      </main>
      <Footer />
    </div>
  )
}