import { Link, useLocation } from "react-router";
import { LogOut, Zap } from "lucide-react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useState } from "react";

const Navbar = ({ right }) => {
  const { pathname } = useLocation();
  const isLoginSignup = pathname.startsWith("/login") || pathname.startsWith("/register");

  const { user, handleLogout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-10 animate-fade-up motion-reduce:animate-none">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-800 to-accent-500 shadow-lg shadow-brand-800/50 ring-1 ring-white/20 transition duration-200 group-hover:brightness-110 sm:h-11 sm:w-11">
            <Zap className="h-5 w-5 text-cream sm:h-6 sm:w-6" fill="currentColor" strokeWidth={0} aria-hidden="true" />
          </div>
          <div>
            <p className="text-base font-bold tracking-tight text-cream sm:text-lg">InterGap</p>
            <p className="hidden text-xs text-stone-400 sm:block">AI Interview Coach</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <div className="relative">
              <button type="button" onClick={() => setIsMenuOpen((prev) => !prev)} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-3.5 transition duration-200 hover:border-white/20 hover:bg-white/[0.08] cursor-pointer">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-800 to-accent-500 text-xs font-bold text-cream ring-1 ring-white/20">{user.username.charAt(0).toUpperCase()}</span>
                <span className="hidden text-sm font-semibold text-cream md:block">{user.username}</span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full z-20 mt-2 w-48 origin-top-right rounded-xl border border-white/10 bg-brand-900/80 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-lg">
                  <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-stone-300 transition duration-200 hover:bg-white/[0.06] hover:text-cream">
                    <LogOut className="h-4 w-4 text-stone-400" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {!isLoginSignup && (
                <>
                  <Link to="/login" className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-stone-300 transition duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-cream">
                    Login
                  </Link>
                  <Link to="/register" className="rounded-lg bg-gradient-to-r from-brand-700 via-brand-600 to-accent-500 px-4 py-2 text-xs font-semibold text-cream shadow-lg shadow-brand-800/50 transition duration-200 hover:brightness-110">
                    Sign up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
