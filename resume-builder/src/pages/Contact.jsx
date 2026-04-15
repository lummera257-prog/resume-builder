import { useState, useEffect } from "react";
import PageLayout from "../components/PageLayout";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Contact Us | ResumeForge - Free Resume Builder";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "Contact ResumeForge team for support, feedback, or queries. We respond within 24–48 hours.");
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email address.";
    if (!form.subject.trim() || form.subject.trim().length < 3) e.subject = "Subject must be at least 3 characters.";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    return e;
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      const mailto = `mailto:resumeforgehelp@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
      window.location.href = mailto;
      setSent(true);
      setLoading(false);
    }, 600);
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    border: `1.5px solid ${errors[field] ? "#ef4444" : "#e5e7eb"}`,
    fontSize: "0.9rem",
    color: "#1f2937",
    outline: "none",
    background: errors[field] ? "#fff5f5" : "#fff",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  });

  const labelStyle = {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
  };

  const errorStyle = {
    color: "#ef4444",
    fontSize: "0.78rem",
    marginTop: "4px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  };

  return (
    <PageLayout>
      <div
        style={{
          minHeight: "80vh",
          background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)",
          fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
          margin: "-1px",
        }}
      >
        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
            padding: "72px 24px 80px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "50px", padding: "8px 20px", color: "#fff", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "20px" }}>
              Get In Touch
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.2 }}>
              Contact Us
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
              Have a question or feedback? We'd love to hear from you. We usually respond within 24–48 hours.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px 60px" }}>
          {/* Form Card */}
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "40px",
              marginTop: "-40px",
              boxShadow: "0 8px 40px rgba(37,99,235,0.1)",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Success Banner */}
            {sent && (
              <div style={{ background: "#ecfdf5", border: "1.5px solid #6ee7b7", borderRadius: "12px", padding: "16px 20px", marginBottom: "28px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <span style={{ fontSize: "1.3rem" }}>✅</span>
                <div>
                  <p style={{ color: "#065f46", fontWeight: 700, margin: "0 0 4px", fontSize: "0.95rem" }}>Email client opened!</p>
                  <p style={{ color: "#047857", fontSize: "0.85rem", margin: 0 }}>Please send the email from your mail app. We'll get back to you within 24–48 hours.</p>
                </div>
              </div>
            )}

            <div style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1e3a5f", margin: "0 0 6px" }}>Send us a message</h2>
              <p style={{ color: "#9ca3af", fontSize: "0.88rem", margin: 0 }}>All fields are required.</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <label style={labelStyle} htmlFor="name">Your Name</label>
                  <input id="name" type="text" placeholder="John Doe" value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)} style={inputStyle("name")}
                    onFocus={(e) => { if (!errors.name) e.target.style.borderColor = "#2563eb"; }}
                    onBlur={(e) => { if (!errors.name) e.target.style.borderColor = "#e5e7eb"; }} />
                  {errors.name && <p style={errorStyle}>⚠ {errors.name}</p>}
                </div>
                <div>
                  <label style={labelStyle} htmlFor="email">Email Address</label>
                  <input id="email" type="email" placeholder="you@example.com" value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)} style={inputStyle("email")}
                    onFocus={(e) => { if (!errors.email) e.target.style.borderColor = "#2563eb"; }}
                    onBlur={(e) => { if (!errors.email) e.target.style.borderColor = "#e5e7eb"; }} />
                  {errors.email && <p style={errorStyle}>⚠ {errors.email}</p>}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle} htmlFor="subject">Subject</label>
                <input id="subject" type="text" placeholder="How can we help?" value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)} style={inputStyle("subject")}
                  onFocus={(e) => { if (!errors.subject) e.target.style.borderColor = "#2563eb"; }}
                  onBlur={(e) => { if (!errors.subject) e.target.style.borderColor = "#e5e7eb"; }} />
                {errors.subject && <p style={errorStyle}>⚠ {errors.subject}</p>}
              </div>

              <div style={{ marginBottom: "28px" }}>
                <label style={labelStyle} htmlFor="message">Message</label>
                <textarea id="message" rows={5} placeholder="Write your message here..." value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  style={{ ...inputStyle("message"), resize: "none", lineHeight: 1.6 }}
                  onFocus={(e) => { if (!errors.message) e.target.style.borderColor = "#2563eb"; }}
                  onBlur={(e) => { if (!errors.message) e.target.style.borderColor = "#e5e7eb"; }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {errors.message ? <p style={errorStyle}>⚠ {errors.message}</p> : <span />}
                  <span style={{ fontSize: "0.75rem", color: form.message.length > 10 ? "#10b981" : "#9ca3af" }}>
                    {form.message.length} chars
                  </span>
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{
                  width: "100%",
                  background: loading ? "#93c5fd" : "linear-gradient(135deg, #1e3a5f, #2563eb)",
                  color: "#fff", border: "none", borderRadius: "12px", padding: "14px",
                  fontSize: "0.95rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                  transition: "opacity 0.2s", letterSpacing: "0.3px",
                }}>
                {loading ? "Opening email client..." : "Send Message →"}
              </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "24px", fontSize: "0.85rem", color: "#9ca3af" }}>
              Or email us directly at{" "}
              <a href="mailto:resumeforgehelp@gmail.com" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
                resumeforgehelp@gmail.com
              </a>
            </p>
          </div>

          {/* Trust Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "28px" }}>
            {[
              { icon: "⚡", title: "Fast Response", desc: "We reply within 24–48 hours" },
              { icon: "🔒", title: "Private & Secure", desc: "Your data is never stored" },
              { icon: "💬", title: "Friendly Support", desc: "Real humans, not bots" },
            ].map((card, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: "14px", padding: "20px", textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{card.icon}</div>
                <p style={{ fontWeight: 700, color: "#1e3a5f", fontSize: "0.88rem", margin: "0 0 4px" }}>{card.title}</p>
                <p style={{ color: "#9ca3af", fontSize: "0.78rem", margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}