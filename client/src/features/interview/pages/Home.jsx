import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import { ArrowRight, FileText, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../../toast/toast.context";
import { useNavigate } from "react-router";
import useInterview from "../hooks/useInterview";
import { z } from "zod";
import Loader from "../../../components/Loader";

const STEPS = [
  {
    number: "01",
    title: "Upload your resume",
    description: "Share your resume as a PDF so the analysis starts from your real experience.",
  },
  {
    number: "02",
    title: "Add the job description",
    description: "Paste the posting you are targeting - the closer the match, the sharper the prep.",
  },
  {
    number: "03",
    title: "Get your interview report",
    description: "Receive targeted questions, skill gaps, and a day-by-day preparation plan.",
  },
];

const Home = () => {
  const resumeRef = useRef();
  const [formData, setFormData] = useState({
    resume: null,
    selfDescription: "",
    jobDescription: "",
  });
  const { showToast } = useToast();
  const { loading, reports, handleCreateInterviewReport, handleGetAllInterviewReports } = useInterview();
  const navigate = useNavigate();
  const [resumeFileName, setResumeFileName] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    handleGetAllInterviewReports();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, resume: file }));
    setResumeFileName(file ? file.name : "");
    // Clear resume error if it exists
    setErrors((prevErrors) => prevErrors.filter((error) => error.path[0] !== "resume"));
  };

  const formSchema = z.object({
    resume: z
      .any()
      .refine((file) => file instanceof File, "Resume is required.")
      .refine((file) => file?.type === "application/pdf", "Only PDF files are allowed.")
      .refine((file) => file?.size <= 3 * 1024 * 1024, "Resume must be less than 3MB."), // 3MB limit
    jobDescription: z.string().min(1, "Job description is required"),
    selfDescription: z.string().min(1, "Self description is required"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => prevErrors.filter((error) => error.path[0] !== name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationResult = formSchema.safeParse(formData);
    if (!validationResult.success) {
      setErrors(validationResult.error.issues);
      showToast({ status: "failed", message: validationResult.error.issues[0].message }); // Show the first error in a toast
      return;
    }

    // Clear any previous errors if validation passes
    setErrors([]);

    const { ok, report, message } = await handleCreateInterviewReport(formData.resume, formData.selfDescription, formData.jobDescription); // Fixed 'response' typo
    if (ok) {
      navigate(`/interview/report/${report._id}`);
    } else {
      showToast({ status: "error", message: message });
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-900 via-brand-950 to-[#140b03]">
        <Loader message="Generating your report, please wait..." />
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-brand-900 via-brand-950 to-[#140b03]">
      {/* ── Ambient background ─────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(200,88,0,0.22),transparent_70%)]" />
        <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] animate-float rounded-full bg-brand-800/40 blur-3xl motion-reduce:animate-none" />
        <div className="absolute -bottom-48 -right-40 h-[30rem] w-[30rem] animate-float rounded-full bg-accent-600/25 blur-3xl motion-reduce:animate-none" style={{ animationDelay: "-7s" }} />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 animate-float rounded-full bg-[#ffab4a]/10 blur-3xl motion-reduce:animate-none" style={{ animationDelay: "-3s" }} />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(rgba(253,251,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(253,251,212,0.5) 1px, transparent 1px)",
            backgroundSize: "54px 54px",
          }}
        />
      </div>

      <Navbar />

      <div className="relative mx-auto w-full max-w-6xl flex-1 px-4 pb-10 pt-4 sm:px-6 sm:pb-14 sm:pt-6 lg:px-8">
        {/* Body */}
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* ── Hero / info column ──────────────────── */}
          <section className="animate-fade-up motion-reduce:animate-none">
            <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-cream sm:text-4xl xl:text-[2.6rem] xl:leading-[1.15]">
              Turn your resume into a <span className="bg-gradient-to-r from-accent-400 via-accent-500 to-brand-400 bg-clip-text text-transparent">winning interview plan</span>
            </h1>
            {!reports && (
              <ol className="mt-10 space-y-6">
                {STEPS.map((step) => (
                  <li key={step.number} className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-xs font-bold text-accent-400">{step.number}</span>
                    <div>
                      <p className="text-sm font-semibold text-cream sm:text-base">{step.title}</p>
                      <p className="mt-1 max-w-sm text-sm leading-relaxed text-stone-500">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {reports?.length > 0 && (
              <section className="mt-10 border-t border-white/10 pt-6" aria-labelledby="previous-reports-heading">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 id="previous-reports-heading" className="text-base font-bold text-cream">
                    Previous reports
                  </h2>
                  <span className="text-xs text-stone-500">{reports.length} total</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {reports.map((report) => (
                    <button key={report._id} type="button" onClick={() => navigate(`/interview/report/${report._id}`)} className="group min-h-28 rounded-lg border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-accent-400/50 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-accent-400/60">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-500/10 text-accent-400">
                          <FileText className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="text-xs font-semibold text-accent-400">{report.matchScore ?? 0}% match</span>
                      </div>
                      <p className="mt-3 truncate text-sm font-semibold text-cream group-hover:text-accent-300">{report.jobTitle || "Interview report"}</p>
                      <p className="mt-1 text-xs text-stone-500">{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : "Recently created"}</p>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </section>

          {/* ── Form card ───────────────────────────── */}
          <section className="animate-fade-up rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/60 backdrop-blur-xl motion-reduce:animate-none sm:p-8" style={{ animationDelay: "120ms" }}>
            <div className="mb-6">
              <h2 className="text-lg font-bold tracking-tight text-cream sm:text-xl">Create your report</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job description */}
              <div>
                <label htmlFor="jobDescription" className="auth-label">
                  Job description
                </label>
                <textarea
                  name="jobDescription"
                  id="jobDescription"
                  value={formData.jobDescription} // Controlled component
                  onChange={handleChange}
                  rows={7}
                  placeholder="Paste the full job posting here…"
                  className="min-h-36 w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-cream shadow-inner shadow-black/30 outline-none transition duration-200 placeholder:text-stone-500 focus:border-accent-400/50 focus:bg-white/[0.06] focus:shadow-none focus:ring-4 focus:ring-accent-500/15"
                />
                {errors.find((e) => e.path[0] === "jobDescription") && <p className="mt-2 text-xs text-red-400">{errors.find((e) => e.path[0] === "jobDescription")?.message}</p>}
              </div>

              {/* Resume upload */}
              <div>
                <label htmlFor="resume" className="auth-label">
                  Resume (PDF)
                </label>
                <label htmlFor="resume" className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] px-4 py-8 text-center transition duration-200 hover:border-accent-400/60 hover:bg-white/[0.05] sm:py-10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-800/60 ring-1 ring-white/10 transition duration-200 group-hover:bg-accent-500/20 group-hover:ring-accent-400/40">
                    <Upload className="h-6 w-6 text-accent-400" strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-cream">{resumeFileName || "Click to upload your resume"}</span> {/* Display file name */}
                  <span className="text-xs text-stone-500">{resumeFileName ? `PDF · ${resumeFileName}` : "PDF · Max 3 MB"}</span> {/* Display file name or max size */}
                  <input type="file" ref={resumeRef} name="resume" id="resume" accept=".pdf" className="sr-only" onChange={handleFileChange} />
                  {errors.find((e) => e.path[0] === "resume") && <p className="mt-2 text-xs text-red-400">{errors.find((e) => e.path[0] === "resume")?.message}</p>}
                </label>
              </div>

              {/* Self description */}
              <div>
                <label htmlFor="selfDescription" className="auth-label">
                  Self description
                </label>
                <textarea
                  name="selfDescription"
                  id="selfDescription"
                  value={formData.selfDescription} // Controlled component
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us briefly about your experience, strengths, and goals…"
                  className="min-h-24 w-full resize-y rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-relaxed text-cream shadow-inner shadow-black/30 outline-none transition duration-200 placeholder:text-stone-500 focus:border-accent-400/50 focus:bg-white/[0.06] focus:shadow-none focus:ring-4 focus:ring-accent-500/15"
                />
                {errors.find((e) => e.path[0] === "selfDescription") && <p className="mt-2 text-xs text-red-400">{errors.find((e) => e.path[0] === "selfDescription")?.message}</p>}
              </div>

              <button type="submit" className="btn-primary group">
                Generate my report
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.2} aria-hidden="true" />
              </button>

              <p className="text-center text-xs text-stone-500">Reports are AI-generated - review the output before your interview.</p>
            </form>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default Home;
