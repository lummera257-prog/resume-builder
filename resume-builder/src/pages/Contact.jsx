import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import PageLayout from "../components/PageLayout";

const SERVICE_ID = "service_pwv2pwm";
const TEMPLATE_ID = "template_ckxrn8jd";
const PUBLIC_KEY = "g44cv1OpiOUsCPuTg";

export default function Contact() {
  const [form, setForm] = useState({
    from_name: "",
    from_email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  useEffect(() => {
    document.title = "Contact Us | ResumeForge - Free Resume Builder";
  }, []);

  const validate = () => {
    const e = {};
    if (!form.from_name.trim() || form.from_name.trim().length < 2)
      e.from_name = "Name must be at least 2 characters.";
    if (
      !form.from_email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.from_email)
    )
      e.from_email = "Please enter a valid email.";
    if (!form.subject.trim() || form.subject.trim().length < 3)
      e.subject = "Subject must be at least 3 characters.";
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";
    return e;
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setStatus("sending");

    emailjs
      .send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.from_name,
          from_email: form.from_email,
          subject: form.subject,
          message: form.message,
        },
        PUBLIC_KEY
      )
      .then(() => {
        setStatus("success");
        setForm({
          from_name: "",
          from_email: "",
          subject: "",
          message: "",
        });
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field]
        ? "border-red-400 bg-red-50"
        : "border-slate-300"
    }`;

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto py-12 px-4">

        {/* Success / Error */}
        {status === "success" && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            ✅ Message sent successfully!
          </div>
        )}

        {status === "error" && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            ❌ Something went wrong. Try again.
          </div>
        )}

        <h1 className="text-2xl font-bold mb-2 text-slate-800">
          Contact Us
        </h1>
        <p className="text-slate-500 mb-6">
          Fill the form below and we’ll get back to you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={form.from_name}
              onChange={(e) =>
                handleChange("from_name", e.target.value)
              }
              className={inputClass("from_name")}
            />
            {errors.from_name && (
              <p className="text-red-500 text-xs">
                {errors.from_name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.from_email}
              onChange={(e) =>
                handleChange("from_email", e.target.value)
              }
              className={inputClass("from_email")}
            />
            {errors.from_email && (
              <p className="text-red-500 text-xs">
                {errors.from_email}
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) =>
                handleChange("subject", e.target.value)
              }
              className={inputClass("subject")}
            />
            {errors.subject && (
              <p className="text-red-500 text-xs">
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Message
            </label>
            <textarea
              rows="5"
              value={form.message}
              onChange={(e) =>
                handleChange("message", e.target.value)
              }
              className={inputClass("message")}
            />
            {errors.message && (
              <p className="text-red-500 text-xs">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {status === "sending" ? "Sending..." : "Send Message"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-500">
          Or email us at{" "}
          <a
            href="mailto:resumeforgehelp@gmail.com"
            className="text-blue-600 font-medium"
          >
            resumeforgehelp@gmail.com
          </a>
        </p>
      </div>
    </PageLayout>
  );
}