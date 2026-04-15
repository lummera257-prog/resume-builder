import PageLayout from "../components/PageLayout";

export default function Contact() {
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

        {/* EMAIL BUTTON */}
        <a
          href="mailto:resumeforgehelp@gmail.com?subject=ResumeForge Support Request"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          📩 Send Email
        </a>

        {/* EMAIL TEXT */}
        <p className="mt-6 text-sm text-slate-500">
          Or email directly at{" "}
          <a
            href="mailto:resumeforgehelp@gmail.com"
            className="text-blue-600 underline font-medium"
          >
            resumeforgehelp@gmail.com
          </a>
        </p>

      </div>
    </PageLayout>
  );
}