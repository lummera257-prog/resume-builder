import { useEffect } from "react";
import PageLayout from "../components/PageLayout";

export default function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy | ResumeForge — Your Data Never Leaves Your Browser"

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

    setMeta('description', 'ResumeForge Privacy Policy — your resume data never leaves your browser. No tracking, no server storage, 100% private and secure. Read our full privacy commitment.')
    setMeta('keywords', 'resumeforge privacy policy, resume builder privacy, data security, no tracking')
    setOg('og:title', 'Privacy Policy | ResumeForge — 100% Private Resume Builder')
    setOg('og:description', 'Your resume data never leaves your browser. ResumeForge is committed to your privacy — no tracking, no storage, always free.')
    setOg('og:url', 'https://freeresumeforgebuilder.com/privacy')
    setOg('og:type', 'website')
    setCanonical('https://freeresumeforgebuilder.com/privacy')
  }, [])

  const sections = [
    { icon: "🔒", title: "Information We Do NOT Collect", content: "ResumeForge does not collect, store, or transmit any personal information you enter while building your resume. All data is processed entirely within your browser and stays on your device." },
    { icon: "🍪", title: "Cookies", content: "We may use minimal, anonymous cookies to improve performance and user experience. These cookies do not store any personally identifiable information and cannot be used to track you across other websites." },
    { icon: "📊", title: "Analytics & Advertising", content: "We may use anonymized analytics tools (such as Google Analytics) and display ads (such as Google AdSense) to help maintain and improve the free service. These third-party services may collect non-personal usage data per their own privacy policies." },
    { icon: "🔗", title: "Third-Party Services", content: "Our platform may link to or integrate with third-party tools. We are not responsible for the privacy practices of those services. We encourage you to review their privacy policies before interacting with them." },
    { icon: "🛡️", title: "Data Security", content: "Since all resume data stays in your browser and is never sent to our servers, the security of your information is inherently protected. We have no access to your resume content at any time." },
    { icon: "👶", title: "Children's Privacy", content: "ResumeForge is intended for users aged 16 and above. We do not knowingly collect any data from children. If you believe a child has used our service, please contact us immediately." },
    { icon: "📝", title: "Changes to This Policy", content: "We may update this Privacy Policy from time to time. Any changes will be reflected on this page with an updated date. Continued use of the platform after changes means you accept the revised policy." },
    { icon: "📬", title: "Contact Us", content: "If you have any questions or concerns about this Privacy Policy, please reach out to us through our Contact page. We aim to respond to all privacy-related queries promptly." },
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
              Privacy Policy
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", maxWidth: "560px", margin: "0 auto 20px", lineHeight: 1.7 }}>
              Your privacy is our priority. Here's exactly how we handle your data — transparently and honestly.
            </p>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>Last updated: April 2026</p>
          </div>
        </div>

        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px" }}>

          {/* Intro Card */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px 36px", marginTop: "-36px", boxShadow: "0 8px 40px rgba(37,99,235,0.1)", borderLeft: "5px solid #2563eb", position: "relative", zIndex: 2 }}>
            <p style={{ color: "#374151", fontSize: "1rem", lineHeight: 1.8, margin: 0 }}>
              👋 Welcome to <strong>ResumeForge</strong>. We believe privacy is a right, not a feature. This policy explains clearly what data we collect (very little), what we don't (almost everything), and how we keep your information safe.
            </p>
          </div>

          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "center", margin: "32px 0 8px" }}>
            <div style={{ background: "#ecfdf5", border: "1px solid #6ee7b7", borderRadius: "50px", padding: "10px 24px", color: "#065f46", fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px" }}>
              ✅ Your resume data NEVER leaves your browser — guaranteed.
            </div>
          </div>

          {/* Sections */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(380px, 100%), 1fr))", gap: "20px", margin: "32px 0" }}>
            {sections.map((section, index) => (
              <div key={index}
                style={{ background: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: "1px solid #e5e7eb", transition: "box-shadow 0.2s ease", cursor: "default" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)")}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div style={{ fontSize: "1.6rem", lineHeight: 1, marginTop: "2px", flexShrink: 0 }}>{section.icon}</div>
                  <div>
                    <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e3a5f", margin: "0 0 10px" }}>{section.title}</h2>
                    <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: 1.75, margin: 0 }}>{section.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", borderRadius: "16px", padding: "36px", textAlign: "center", marginBottom: "60px" }}>
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>🙏</div>
            <h3 style={{ color: "#fff", fontSize: "1.2rem", fontWeight: 700, margin: "0 0 10px" }}>Thank you for trusting ResumeForge</h3>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.95rem", margin: "0 0 20px", lineHeight: 1.7 }}>
              We are committed to keeping this platform free, honest, and privacy-first — always.
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