const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/10">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-center text-xs text-stone-500">
          © {new Date().getFullYear()} <span className="font-semibold text-accent-300/80">nysmhd</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
