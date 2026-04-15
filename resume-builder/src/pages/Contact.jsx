import { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import PageLayout from "../components/PageLayout";

const SERVICE_ID = "service_pwv2pwm";
const TEMPLATE_ID = "template_ckxrn8jd";
const PUBLIC_KEY = "g44cv1OpiOUsCPuTg";

export default function Contact() {
  const formRef = useRef();
  const [form, setForm] = useState({ from_name: "", from_email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  useEffect(() => {
    document.title = "Contact Us | ResumeForge - Free Resume Builder";
  }, []);

  const validate = () => {
    const e = {};
    if (!form.from_name.trim() || form.from_name.trim().length < 2) e.from_name = "Name must be at least 2 characters.";
    if (!form.from_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.from_email)) e.from_email = "Please enter a valid email.";
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
    setStatus("sending");
    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => {
        setStatus("success");
        setForm({ from_name: "", from_email: "", subject: "", message: "" });
      })
      .catch(() => setStatus("error"));
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[field] ? "border-red-400 bg-red-50" : "border-slate-200"}`;

  return (
    <PageLayout>
      <div style={{ background: "linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)", margin: "-1px", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)", padding: "72px 24px 80px", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: "50px", padding: "8px 20px", color: "#fff", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "20px" }}>
            Get In Touch
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, color: "#fff", margin: "0 0 16px" }}>Contact Us</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", maxWidth: "500px", margin: "0 auto" }}>
            Have a question or feedback? We'd love to hear from you. We usually respond within 24–48 hours.
          </p>
        </div>

        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px 60px" }}>
          {/* Form Card */}
          <div style={{ background: "#fff", borderRadius: "20px", padding: "40px", marginTop: "-40px", boxShadow: "0 8px 40px rgba(37,99,235,0.1)", position: "relative", zIndex: 2 }}>

            {status === "success" && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex gap-3 items-start">
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-bold mb-1">Message sent successfully!</p>
                  <p className="text-green-600">We'll get back to you within 24–48 hours.</p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                ❌ Something went wrong. Please email us at <a href="mailto:resumeforgehelp@gmail.com" className="underline font-semibold">resumeforgehelp@gmail.com</a>
              </div>
            )}

            <h2 className="text-xl font-bold text-slate-800 mb-1">Send us a message</h2>
            <p className="text-slate-400 text-sm mb-6">All fields are required.</p>

            <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Name</label>
                  <input name="from_name" type="text" placeholder="John Doe" value={form.from_name}
                    onChange={(e) => handleChange("from_name", e.target.value)} className={inputClass("from_name")} />
                  {errors.from_name && <p className="text-red-500 text-xs mt-1">⚠ {errors.from_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <input name="from_email" type="email" placeholder="you@example.com" value={form.from_email}
                    onChange={(e) => handleChange("from_email", e.target.value)} className={inputClass("from_email")} />
                  {errors.from_email && <p className="text-red-500 text-xs mt-1">⚠ {errors.from_email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                <input name="subject" type="text" placeholder="How can we help?" value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)} className={inputClass("subject")} />
                {errors.subject && <p className="text-red-500 text-xs mt-1">⚠ {errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
                <textarea name="message" rows={5} placeholder="Write your message here..." value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className={`${inputClass("message")} resize-none`} />
                <div className="flex justify-between items-center mt-1">
                  {errors.message ? <p className="text-red-500 text-xs">⚠ {errors.message}</p> : <span />}
                  <span className={`text-xs ${form.message.length >= 10 ? "text-green-500" : "text-slate-400"}`}>
                    {form.message.length} chars
                  </span>
                </div>
              </div>

              <button type="submit" disabled={status === "sending"}
                className="w-full text-white font-bold py-3 rounded-xl text-sm transition-opacity disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)" }}>
                {status === "sending" ? "Sending..." : "Send Message →"}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-slate-400">
              Or email us directly at{" "}
              <a href="mailto:resumeforgehelp@gmail.com" className="text-blue-600 font-semibold hover:underline">
                resumeforgehelp@gmail.com
              </a>
            </p>
          </div>

          {/* Trust Cards */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { icon: "⚡", title: "Fast Response", desc: "We reply within 24–48 hours" },
              { icon: "🔒", title: "Private & Secure", desc: "Your data is never stored" },
              { icon: "💬", title: "Friendly Support", desc: "Real humans, not bots" },
            ].map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-slate-100">
                <div className="text-2xl mb-2">{card.icon}</div>
                <p className="font-bold text-slate-700 text-sm mb-1">{card.title}</p>
                <p className="text-slate-400 text-xs">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}