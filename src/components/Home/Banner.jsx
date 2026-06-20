"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeartPulse, Search, UserPlus, ShieldCheck, Users } from "lucide-react";

const MotionLink = motion(Link);

export default function Banner() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <section
      className="relative overflow-hidden w-full bg-cover bg-center bg-no-repeat py-28 md:py-36 flex items-center"
      style={{ backgroundImage: "url('/banner3.jpg')" }}
    >
      <div className="absolute inset-0 bg-linear-to-r from-slate-900  to-slate-900/40 backdrop-blur-[1.5px]" />

      <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[20%] w-150 h-100 bg-rose-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6 lg:col-span-7 text-left"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-2xl shadow-black/50"
          >
            <HeartPulse size={16} className="text-red-500 animate-pulse" />
            <span className="text-xs md:text-sm font-semibold tracking-wider text-slate-200 uppercase">
              Save Lives Network
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight text-white"
          >
            Donate Blood,
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 via-rose-400 to-amber-400">
              Be Someone's Hero
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-slate-300 max-w-xl text-base md:text-lg leading-relaxed font-medium"
          >
            Join BloodHero and connect with people who need blood. Your single,
            simple action can grant someone a beautifully complete second chance
            at life.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-4">
            <MotionLink
              href="/auth/registration"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 bg-linear-to-r from-red-500 to-rose-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 shadow-xl shadow-black/20"
            >
              <UserPlus size={20} />
              Join as a donor
            </MotionLink>

            <MotionLink
              href="/search"
              whileHover={{
                scale: 1.03,
                y: -2,
                backgroundColor: "rgba(255,255,255,1)",
                color: "#020617",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2.5 border border-white/20 text-white px-8 py-4 rounded-2xl font-bold backdrop-blur-md transition-all duration-300"
            >
              <Search size={20} />
              Search Donors
            </MotionLink>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 30 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-5 relative flex flex-col justify-center items-center lg:items-end w-full"
        >
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-90 bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl z-20"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-inner">
                  <HeartPulse size={22} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">
                    Live Urgent Pool
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Updated just now
                  </p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {["A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-"].map(
                (group, index) => (
                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      backgroundColor: "rgba(239, 68, 68, 0.15)",
                      borderColor: "rgba(239, 68, 68, 0.4)",
                    }}
                    key={index}
                    className="bg-white/5 border border-white/5 rounded-xl py-3 text-center cursor-pointer transition-all duration-200"
                  >
                    <span className="text-sm font-bold text-slate-200 block">
                      {group}
                    </span>
                    <span className="text-[10px] text-red-400 font-bold tracking-tight">
                      Active
                    </span>
                  </motion.div>
                ),
              )}
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 left-0 lg:-left-7.5 hidden sm:flex items-center gap-3 bg-slate-950/80 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl shadow-xl z-30"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Security
              </p>
              <h4 className="text-white text-xs font-bold">
                100% Verified Users
              </h4>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute -bottom-7.5 right-0 lg:right-4 hidden sm:flex items-center gap-3 bg-slate-950/80 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl shadow-xl z-30"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users size={18} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Community
              </p>
              <h4 className="text-white text-xs font-bold">
                4.8k Active Heroes
              </h4>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
