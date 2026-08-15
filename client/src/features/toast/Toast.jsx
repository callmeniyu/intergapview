import React, { useEffect } from "react";

const styles = {
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    icon: "✓",
  },
  failed: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: "✕",
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: "i",
  },
};

export default function Toast({ id, status = "info", message, removeToast, duration = 3000 }) {
  const style = styles[status] || styles.info;

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, removeToast]);
  return (
    <div role="alert" className={`flex min-w-[300px] max-w-sm items-center gap-3 rounded-lg border px-4 py-3 shadow-lg ${style.bg} ${style.border} ${style.text}`}>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white font-bold">{style.icon}</span>

      <p className="flex-1 text-sm font-medium">{message}</p>

      <button onClick={() => removeToast(id)} className="text-lg opacity-50 transition hover:opacity-100" aria-label="Close notification">
        ×
      </button>
    </div>
  );
}
