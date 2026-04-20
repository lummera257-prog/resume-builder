import { useEffect } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";

export default function Terms() {
  useEffect(() => {
    document.title = "Terms of Service | ResumeForge — Free Resume Builder"

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

    setMeta('description', 'Read ResumeForge Terms of Service. Understand your rights and responsibilities when using our free ATS-friendly resume builder. Simple, honest, and transparent.')
    setMeta('keywords', 'resumeforge terms of service, resume builder terms, conditions, user agreement')
    setOg('og:title', 'Terms of Service | ResumeForge — Free Resume Builder')
    setOg('og:description', 'Terms and conditions for using ResumeForge — our free, privacy-first resume builder. Simple, honest, and transparent.')
    setOg('og:url', 'https://freeresumeforgebuilder.com/terms')
    setOg('og:type', 'website')
    setCanonical('https://freeresumeforgebuilder.com/terms')
  }, [])

  const sections = [
    { icon: "✅", title: "Acceptance of Terms", content: "By accessing or using ResumeForge at www.freeresumeforgebuilder.com, you confirm that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of our service immediately." },
    { icon: "🛠️", title: "Use of Service", content: "ResumeForge is a free, browser-based resume builder intended for personal and professional use. You may use this platform to create, edit, and download resumes for legitimate employment purposes. Any misuse, automation, or scraping of our service is strictly prohibited." },
    { icon: "📄", title: "Your Content & Data", content: "All resume data you enter is processed locally in your browser. We do not store, collect, or share your personal resume information on our servers. You are solely responsible for the accuracy and legality of the content you include in your resumes." },
    { icon: "⚠️", title: "Disclaimer of Liability", content: "ResumeForge provides this service 'as is' without any warranties. We are not responsible for job application outcomes, interview results, or how third parties use your resume. We do not guarantee that resumes built using our tool will pass every ATS system." },
    { icon: "🔄", title: "Service Changes", content: "We reserve the right to modify, suspend, or discontinue any part of the service at any time without prior notice. We may also update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the updated Terms." },
    { icon: "©️", title: "Intellectual Property", content: "All templates, designs, code, and content on ResumeForge are the intellectual property of Team ResumeForge. You may not copy, reproduce, or distribute our platform's design or codebase without written permission." },
    { icon: "🔗", title: "Third-Party Links & Services", content: "Our platform may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of those sites. Visiting third-party links is at your own discretion and risk." },
    { icon: "📬", title: "Contact & Questions", content: "If you have any questions about these Terms & Conditions, please reach out to us via our Contact page. We are happy to clarify any concerns you may have." },
  ];

  return (
    <PageLayout>
      <div style={{ minHeight: "80vh", background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)", fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", margin: "-1px" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", padding: "72px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50px", padding: "8px 20px", color: "#fff", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "20px" }}>
              Legal
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
              Terms &amp; Conditions
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", maxWidth: "560px", margin: "0 auto 28px", lineHeight: 1.7 }}>
              Please read these terms carefully before using ResumeForge. They govern your use of our free resume building service.
            </p>
            <Link to="/"
              style={{ display: "inline-block", background: "#fff", color: "#1e3a5f", fontWeight: 700, fontSize: "0.95rem", padding: "12px 28px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", transition: "transform 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              🚀 Build My Resume — It's Free
            </Link>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", marginTop: "16px" }}>Last updated: April 2026</p>
          </div>
        </div>

        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px 60px" }}>

          {/* Intro Card */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px 36px", marginTop: "-36px", boxShadow: "0 8px 40px rgba(37,99,235,0.1)", borderLeft: "5px solid #2563eb", position: "relative", zIndex: 2 }}>
            <p style={{ color: "#374151", fontSize: "1rem", lineHeight: 1.8, margin: 0 }}>
              👋 Welcome to <strong>ResumeForge</strong>. These Terms & Conditions outline the rules and regulations for using our platform. By using our website, you accept these terms in full. This is a simple, honest agreement — we respect your time and privacy.
            </p>
          </div>

          {/* Sections */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px", margin: "40px 0" }}>
            {sections.map((section, index) => (
              <div key={index}
                style={{ background: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", transition: "box-shadow 0.2s ease", cursor: "default" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)")}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div style={{ fontSize: "1.6rem", lineHeight: 1, marginTop: "2px", flexShrink: 0 }}>{section.icon}</div>
                  <div>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e3a5f", margin: "0 0 10px" }}>{section.title}</h3>
                    <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.75, margin: 0 }}>{section.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", borderRadius: "16px", padding: "40px 36px", textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🙏</div>
            <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, margin: "0 0 10px" }}>Thank you for using ResumeForge</h3>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", margin: "0 0 24px", lineHeight: 1.7 }}>
              We are committed to providing a free, reliable, and privacy-first resume building experience.
            </p>
            <Link to="/"
              style={{ display: "inline-block", background: "#fff", color: "#1e3a5f", fontWeight: 700, fontSize: "0.95rem", padding: "12px 28px", borderRadius: "50px", textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
            >
              🚀 Build My Resume — Free
            </Link>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", margin: "20px 0 0" }}>
              — <strong style={{ color: "#fff" }}>Team ResumeForge</strong>
            </p>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}