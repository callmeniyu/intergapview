import React from "react";

const Loader = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-accent-400 border-t-transparent" role="status" aria-label="loading" />
      {message && <p className="text-sm font-semibold text-stone-400">{message}</p>}
    </div>
  );
};

export default Loader;
