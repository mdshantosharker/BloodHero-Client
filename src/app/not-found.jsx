"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeartPulse, Home, ArrowLeft, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="h-screen w-screen bg-[#090506] flex flex-col items-center justify-center px-4 select-none relative overflow-hidden text-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-red-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse" />
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-rose-950/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-125 h-125 bg-red-950/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,#140d0e_1px,transparent_1px),linear-gradient(to_bottom,#140d0e_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-10 flex flex-col items-center justify-center">
        <div className="relative group">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="text-[9rem] sm:text-[12rem] font-black leading-none tracking-tighter bg-linear-to-b from-white via-red-100 to-red-500/20 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(239,68,68,0.2)]"
          >
            404
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-red-600 px-6 py-2 rounded-full shadow-lg shadow-red-600/40 border border-red-400 flex items-center gap-2"
          >
            <HeartPulse size={18} className="text-white animate-pulse" />
            <span className="text-xs font-black tracking-widest uppercase text-red-50">
              Heartbeat Lost
            </span>
          </motion.div>
        </div>

        <div className="space-y-3 max-w-sm pt-4">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-black tracking-tight bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
          >
            This Route is Empty
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-zinc-500 font-medium leading-relaxed"
          >
            The page you're trying to reach doesn't exist or has been relocated.
            Let's get you back on track to saving lives.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 w-full px-6 sm:px-0 justify-center"
        >
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center gap-2 bg-[#140d0f] hover:bg-[#1a1113] text-zinc-300 hover:text-white px-7 py-4 rounded-2xl font-bold text-sm transition-all duration-300 border border-zinc-800 hover:border-zinc-700 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center gap-2 bg-linear-to-r from-red-600 to-rose-600 text-white px-7 py-4 rounded-2xl font-black text-sm transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_0_25px_rgba(220,38,38,0.2)] hover:shadow-[0_0_35px_rgba(220,38,38,0.4)] cursor-pointer group"
          >
            <Home
              size={16}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <span>Return Home</span>
          </button>
        </motion.div>
      </div>

      <div className="absolute top-0 left-1/4 w-px h-20 bg-linear-to-b from-red-500/50 to-transparent" />
    </div>
  );
}
