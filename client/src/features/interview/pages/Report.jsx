import { useEffect, useState } from "react";
import { CalendarDays, Check, ChevronDown, Code, Download, FileText, LayoutGrid, Lightbulb, MessageCircle, Target } from "lucide-react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import useInterview from "../hooks/useInterview";
import { useParams } from "react-router";
import Loader from "../../../components/Loader";

/* ── Static style maps / config ────────────────────────── */
const SEVERITY_META = {
  high: { badge: "border-red-500/30 bg-red-500/10 text-red-300" },
  medium: { badge: "border-accent-500/30 bg-accent-500/10 text-accent-300" },
  low: { badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" },
};

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "technical", label: "Technical Questions", icon: Code },
  { id: "behavioral", label: "Behavioral Questions", icon: MessageCircle },
  { id: "preparation", label: "Preparation Plan", icon: CalendarDays },
  { id: "context", label: "Interview Context", icon: FileText },
];

const TAB_META = {
  overview: { title: "Overview", subtitle: "A quick snapshot of your report", icon: LayoutGrid },
  technical: { title: "Technical questions", subtitle: "Practice these with clear, structured answers", icon: Code },
  behavioral: { title: "Behavioral questions", subtitle: "Frame your stories using the STAR method", icon: MessageCircle },
  preparation: { title: "Preparation plan", subtitle: "A day-by-day roadmap to interview day", icon: CalendarDays },
  context: { title: "Interview context", subtitle: "The inputs that shaped this report", icon: FileText },
};

const glass = "rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/40 backdrop-blur-xl";

/* ── Small building blocks ─────────────────────────────── */
const ScoreRing = ({ score }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffab4a" />
            <stop offset="100%" stopColor="#c05800" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle cx="60" cy="60" r={radius} fill="none" stroke="url(#scoreGradient)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${dash} ${circumference}`} className="drop-shadow-[0_2px_4px_rgba(255,171,74,0.3)]" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-cream sm:text-2xl">{score}%</span>
      </div>
    </div>
  );
};

const QuestionCard = ({ index, item }) => {
  const [open, setOpen] = useState(false);

  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition duration-200 hover:bg-white/[0.03] hover:border-white/20">
      <button type="button" onClick={() => setOpen((prev) => !prev)} aria-expanded={open} className="group flex w-full items-start gap-4 p-4 text-left sm:p-6">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-800/60 text-xs font-bold text-accent-300 ring-1 ring-white/10">{index + 1}</span>
        <span className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-relaxed text-cream sm:text-[0.95rem]">{item.question}</h3>
          <span className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-stone-500">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-400" aria-hidden="true" />
            <span>
              <span className="font-semibold text-stone-400">Why this is asked — </span>
              {item.intention}
            </span>
          </span>
        </span>
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-stone-400 transition duration-200 group-hover:border-accent-400/40 group-hover:text-accent-300">
          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </span>
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <div className="border-t border-white/10 bg-black/20 px-4 py-4 sm:px-6">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent-300/80">Suggested answer</p>
            <p className="mt-1.5 text-sm leading-relaxed text-stone-300">{item.answer}</p>
          </div>
        </div>
      </div>
    </article>
  );
};

const ContextCard = ({ label, icon: Icon, content }) => (
  <article className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
    <div className="mb-3 flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-800/50 text-accent-300 ring-1 ring-white/10">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <h3 className="text-sm font-semibold text-cream">{label}</h3>
    </div>
    <p className="whitespace-pre-line text-sm leading-relaxed text-stone-400">{content}</p>
  </article>
);

/* ── Page ──────────────────────────────────────────────── */
const Report = () => {
  const [report, setReport] = useState(null);
  const { loading, handleGetInterviewReport, handleCreateResumePdf } = useInterview();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const activeMeta = TAB_META[activeTab];
  const ActiveIcon = activeMeta.icon;

  const tabCount = activeTab === "technical" ? `${report?.technicalQuestions.length} questions` : activeTab === "behavioral" ? `${report?.behavioralQuestions.length} questions` : activeTab === "preparation" ? `${report?.preparationPlans.length} days` : undefined;

  useEffect(() => {
    const getReport = async () => {
      const { ok, report, message } = await handleGetInterviewReport(id);
      console.log("report", report);

      if (ok) {
        setReport(report);
      } else {
        console.log(message);
      }
    };
    getReport();
  }, []);

  const getResumePdf = async () => {
    try {
      const { ok, message } = await handleCreateResumePdf(report?.resumeText, report?.selfDescription, report?.jobDescription);
      if (ok) {
        window.open(pdfUrl, "_blank");
      } else {
        console.log(message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-900 via-brand-950 to-[#140b03]">
        <Loader message="Fetching your report..." />
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-brand-900 via-brand-950 to-[#140b03] lg:h-screen">
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

      {/* ── Three-column dashboard ──────────────────── */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 pb-6 pt-3 sm:px-6 sm:pt-4 lg:min-h-0 lg:flex-row lg:gap-6 lg:px-8 lg:pb-8">
        {/* Left — section navigation */}
        <aside className="scrollbar-theme animate-fade-up motion-reduce:animate-none lg:min-h-0 lg:w-56 lg:shrink-0 lg:overflow-y-auto">
          <p className="mb-3 hidden px-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-stone-500 lg:block">Report Sections</p>
          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1 lg:gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button key={item.id} type="button" onClick={() => setActiveTab(item.id)} className={`group flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-semibold transition duration-200 lg:w-full lg:rounded-xl lg:px-4 lg:py-3 ${isActive ? "bg-brand-700/60 text-cream shadow-inner shadow-black/20" : "text-stone-400 hover:bg-white/[0.05] hover:text-cream"}`}>
                  <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-accent-300" : "text-stone-500"}`} aria-hidden="true" />
                  <span className="whitespace-nowrap lg:whitespace-normal">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button onClick={getResumePdf} className="mt-4 flex w-full items-center justify-center gap-2 cursor-pointer rounded-lg bg-brand-700/60 px-4 py-2.5 text-sm font-semibold text-cream shadow-inner shadow-black/20 transition duration-200 hover:bg-brand-700/80">
            <Download className="h-4 w-4" aria-hidden="true" />
            Download Resume
          </button>
        </aside>

        {/* Center — active section content (scrolls) */}
        <section className={`${glass} scrollbar-theme animate-fade-up min-w-0 flex-1 p-5 motion-reduce:animate-none sm:p-7 lg:overflow-y-auto`} style={{ animationDelay: "60ms" }}>
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-brand-800/50 text-accent-300 ring-1 ring-white/10">
                <ActiveIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-bold tracking-tight text-cream sm:text-lg">{activeMeta.title}</h2>
                <p className="mt-0.5 text-xs text-stone-500 sm:text-sm">{activeMeta.subtitle}</p>
              </div>
            </div>
            {tabCount && <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-stone-400">{tabCount}</span>}
          </div>

          {activeTab === "overview" && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {[
                { label: "Technical questions", value: report?.technicalQuestions.length, icon: Code },
                { label: "Behavioral questions", value: report?.behavioralQuestions.length, icon: MessageCircle },
                { label: "Skill gaps found", value: report?.skillGaps.length, icon: Target },
                { label: "Prep plan days", value: report?.preparationPlans.length, icon: CalendarDays },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center sm:p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-800/50 text-accent-300 ring-1 ring-white/10">
                    <stat.icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-xl font-bold text-cream sm:text-2xl">{stat.value}</span>
                  <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-stone-500">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "technical" && (
            <div className="space-y-4">
              {report?.technicalQuestions.map((item, index) => (
                <QuestionCard key={index} index={index} item={item} />
              ))}
            </div>
          )}

          {activeTab === "behavioral" && (
            <div className="space-y-4">
              {report?.behavioralQuestions.map((item, index) => (
                <QuestionCard key={index} index={index} item={item} />
              ))}
            </div>
          )}

          {activeTab === "preparation" && (
            <ol className="relative space-y-5 before:absolute before:bottom-2 before:left-[13px] before:top-2 before:w-px before:bg-white/10">
              {report?.preparationPlans.map((plan) => (
                <li key={plan.day} className="relative flex gap-5">
                  <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent-500/40 bg-brand-900 text-[0.65rem] font-bold text-accent-300">{plan.day}</span>
                  <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-accent-300">Day {plan.day}</p>
                    <h3 className="mt-1 text-sm font-semibold leading-snug text-cream sm:text-base">{plan.focus}</h3>
                    <ul className="mt-3 space-y-2">
                      {plan.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start gap-2.5 text-sm leading-relaxed text-stone-400">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {activeTab === "context" && (
            <div className="space-y-4">
              <ContextCard label="Job description" icon={FileText} content={report?.jobDescription} />
              <ContextCard label="Your resume" icon={FileText} content={report?.resumeText} />
              <ContextCard label="Self description" icon={MessageCircle} content={report?.selfDescription} />
            </div>
          )}
        </section>

        {/* Right — job title, match score + skill gaps */}
        <aside className="scrollbar-theme animate-fade-up space-y-6 motion-reduce:animate-none lg:min-h-0 lg:w-80 lg:shrink-0 lg:overflow-y-auto" style={{ animationDelay: "120ms" }}>
          <div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-bold tracking-tight text-cream">{report?.jobTitle}</h2>
              </div>
              <ScoreRing score={report?.matchScore} />
            </div>
          </div>

          {/* Skill gaps */}
          <div className={`${glass} p-6`}>
            <h3 className="flex items-center gap-2.5 text-sm font-bold text-cream">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-800/50 text-accent-300 ring-1 ring-white/10">
                <Target className="h-4 w-4" aria-hidden="true" />
              </span>
              Skill gaps
              <span className="ml-auto rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[0.65rem] font-semibold text-stone-400">{report?.skillGaps.length}</span>
            </h3>

            <ul className="mt-4 space-y-2.5">
              {report?.skillGaps.map((gap) => (
                <li key={gap.skill} className="rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium leading-snug text-cream">{gap.skill}</span>
                    <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${SEVERITY_META[gap.severity].badge}`}>{gap.severity}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Report;
