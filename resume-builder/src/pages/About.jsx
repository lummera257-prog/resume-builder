import { useEffect } from "react";
import PageLayout from "../components/PageLayout";

export default function About() {
  useEffect(() => {
    document.title = "About ResumeForge | Free ATS Resume Builder for Everyone"

    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"]`)
      if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el) }
      el.setAttribute('content', content)
    }
    const setOg = (prop, content) => {
      let el = document.querySelector(`meta[property="${prop}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el) }
      el.setAttribute('content', content)
    }
    const setCanonical = (url) => {
      let el = document.querySelector('link[rel="canonical"]')
      if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el) }
      el.href = url
    }

    setMeta('description', 'Learn about ResumeForge — a 100% free ATS-friendly resume builder for students, freshers, and professionals. No login required. Build your resume in minutes.')
    setMeta('keywords', 'about resumeforge, free resume builder, ats resume, no login resume builder')
    setOg('og:title', 'About ResumeForge | Free ATS Resume Builder')
    setOg('og:description', 'ResumeForge helps job seekers build ATS-friendly resumes instantly. 100% free, no login, instant PDF download.')
    setOg('og:url', 'https://freeresumeforgebuilder.com/about')
    setOg('og:type', 'website')
    setCanonical('https://freeresumeforgebuilder.com/about')
  }, [])

  const stats = [
    { value: "100%", label: "Free Forever", icon: "🎁" },
    { value: "No Login", label: "Required", icon: "🔓" },
    { value: "ATS", label: "Friendly Templates", icon: "✅" },
    { value: "Instant", label: "PDF Download", icon: "⚡" },
  ];

  const features = [
    { icon: "🎯", title: "Built for Everyone", desc: "Whether you're a fresher, student, or experienced professional — ResumeForge works for all career levels." },
    { icon: "🚀", title: "No Hassle, No Login", desc: "Start building your resume immediately. No account, no signup, no wasted time." },
    { icon: "📄", title: "ATS-Optimized", desc: "Our templates are designed to pass Applicant Tracking Systems used by top companies worldwide." },
    { icon: "🎨", title: "Clean Modern Templates", desc: "Choose from professionally designed templates that make your resume stand out." },
    { icon: "🔒", title: "100% Private", desc: "Your resume data never leaves your browser. We don't store anything on our servers." },
    { icon: "💸", title: "Always Free", desc: "No hidden fees, no premium plans. Every feature is available to every user, forever." },
  ];

  return (
    <PageLayout>
      <div style={{ minHeight: "80vh", background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", margin: "-1px" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", padding: "72px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50px", padding: "8px 20px", color: "#fff", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "20px" }}>
              About Us
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
              Built for Job Seekers. <br />Made with ❤️
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
              ResumeForge helps students, freshers, and professionals create ATS-friendly resumes in minutes — completely free.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 60px" }}>

          {/* Intro Card */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px 36px", marginTop: "-36px", boxShadow: "0 8px 40px rgba(37,99,235,0.1)", borderLeft: "5px solid #2563eb", position: "relative", zIndex: 2 }}>
            <p style={{ color: "#374151", fontSize: "1rem", lineHeight: 1.8, margin: "0 0 14px" }}>
              👋 Welcome to <strong>ResumeForge</strong> — your trusted platform to create professional, ATS-friendly resumes in minutes, completely free.
            </p>
            <p style={{ color: "#6b7280", fontSize: "0.95rem", lineHeight: 1.8, margin: 0 }}>
              Our mission is simple: make resume building <strong>easy, fast, and free</strong> — so you can focus on landing the job, not formatting a document.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", margin: "32px 0" }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "14px", padding: "24px 16px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: "1.6rem", marginBottom: "8px" }}>{stat.icon}</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#2563eb", lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "6px" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1e3a5f", margin: "0 0 20px", textAlign: "center" }}>
            Why Choose ResumeForge?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "40px" }}>
            {features.map((f, i) => (
              <div key={i}
                style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", transition: "box-shadow 0.2s", cursor: "default" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)")}
              >
                <div style={{ fontSize: "1.6rem", marginBottom: "12px" }}>{f.icon}</div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1e3a5f", margin: "0 0 8px" }}>{f.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "#6b7280", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", borderRadius: "16px", padding: "36px", textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🚀</div>
            <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, margin: "0 0 10px" }}>We're continuously improving</h3>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", margin: "0 0 20px", lineHeight: 1.7 }}>
              ResumeForge is a passion project built to help people succeed in their careers. We update our templates and features regularly based on your feedback.
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", margin: 0 }}>
              — <strong style={{ color: "#fff" }}>Team ResumeForge</strong>
            </p>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}