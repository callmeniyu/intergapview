import { Link } from "react-router";

const AuthLayout = ({ title, subtitle, children, footerText, footerLinkText, footerLinkTo }) => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-brand-900 via-brand-950 to-[#140b03] px-4 py-12">
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

      {/* ── Content ────────────────────────────────── */}
      <div className="relative w-full max-w-md animate-fade-up motion-reduce:animate-none">
        {/* Brand header */}
        <div className="mb-8 gap-5 flex items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-800 to-accent-500 shadow-lg shadow-brand-800/50 ring-1 ring-white/20">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-cream" aria-hidden="true">
              <path d="M13 2 3.5 13.5h6L8.5 22 20 9.5h-6.5L13 2z" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-bold tracking-tight text-cream">{title}</h1>
            <p className="mt-2 text-sm text-stone-400">{subtitle}</p>
          </div>
        </div>

        {/* Card */}
        <div className="animate-fade-up rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/60 backdrop-blur-xl motion-reduce:animate-none sm:p-8" style={{ animationDelay: "120ms" }}>
          {children}
        </div>

        {/* Footer */}
        <p className="animate-fade-up mt-6 text-center text-sm text-stone-400 motion-reduce:animate-none" style={{ animationDelay: "240ms" }}>
          {footerText}{" "}
          <Link to={footerLinkTo} className="auth-link">
            {footerLinkText}
          </Link>
        </p>
      </div>
    </main>
  );
};

export default AuthLayout;
