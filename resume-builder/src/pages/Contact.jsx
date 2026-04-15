import PageLayout from "../components/PageLayout";

export default function Contact() {
  const email = "resumeforgehelp@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    alert("Email copied!");
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">

        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Contact Us
        </h1>

        <p className="text-slate-600 mb-6 leading-relaxed">
          If you have any questions, feedback, or need help regarding ResumeForge,
          feel free to contact us anytime. We are here to help you.
        </p>

        <p className="text-slate-600 mb-8">
          For any kind of support or information, please email us at:
        </p>

        {/* GMAIL BUTTON (BEST FIX) */}
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=ResumeForge Support Request`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          📩 Send Email
        </a>

        {/* EMAIL TEXT */}
        <p className="mt-6 text-sm text-slate-500">
          Or email directly at{" "}
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline font-medium"
          >
            {email}
          </a>
        </p>

        {/* COPY BUTTON */}
        <button
          onClick={handleCopy}
          className="mt-4 text-sm text-blue-600 underline"
        >
          Copy Email Address
        </button>

        {/* HELPER NOTE */}
        <p className="mt-3 text-xs text-slate-400">
          If email does not open on desktop, please copy the email and send manually.
        </p>

      </div>
    </PageLayout>
  );
}