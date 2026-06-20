import { HeartPulse } from "lucide-react";
import React from "react";

const loadingPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-slate-50/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="relative flex items-center justify-center z-10">
        <div className="w-14 h-14 border-4 border-red-500 border-t-transparent rounded-full animate-spin absolute" />
        <HeartPulse size={24} className="text-red-500 animate-pulse" />
      </div>
      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest z-10 mt-2">
        Scanning urgent requirements...
      </p>
    </div>
  );
};

export default loadingPage;
