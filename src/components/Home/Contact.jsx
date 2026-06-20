"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

export default function Contact() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    },
  };

  return (
    <div className="w-full bg-linear-to-br from-slate-50 via-rose-50/50 to-neutral-100 relative overflow-hidden">
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[-5%] w-112.5 h-112.5 bg-linear-to-br from-red-500/10 to-rose-500/0 rounded-full blur-[100px] pointer-events-none z-0 transform-gpu"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-[5%] left-[-10%] w-100 h-100 bg-linear-to-tr from-rose-500/10 to-amber-500/0 rounded-full blur-[90px] pointer-events-none z-0 transform-gpu"
      />

      <section className="relative max-w-7xl mx-auto px-6 py-28 transform-gpu">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16 relative z-10"
        >
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full mb-4 cursor-default transition-all duration-300 hover:shadow-lg hover:shadow-red-500/5"
            >
              <HeartHandshake
                size={16}
                className="text-red-500 animate-pulse"
              />
              <span className="text-xs font-bold uppercase tracking-widest text-red-600">
                Get In Touch
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]"
            >
              Let's Save a Precious <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 via-rose-500 to-rose-600">
                Life Together
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-slate-500 mt-5 text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed"
            >
              Have questions, urgent blood requirements, or want to partner with
              us? Reach out to our response team anytime, we are active 24/7.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <motion.div
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-[2rem] p-8 lg:p-10 lg:col-span-7 flex flex-col justify-between shadow-[0_20px_50px_-20px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_-15px_rgba(239,68,68,0.06)] transition-all duration-500 group/card transform-gpu"
            >
              <div>
                <div className="mb-8">
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    Send Message
                  </h3>
                  <p className="text-sm font-semibold text-slate-400 mt-1">
                    Our emergency coordinators will check and respond quickly.
                  </p>
                </div>

                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Your Name"
                      className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-100 focus:border-red-500 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:ring-4 focus:ring-red-500/10 transition-all duration-300 shadow-inner"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email"
                      className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-100 focus:border-red-500 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:ring-4 focus:ring-red-500/10 transition-all duration-300 shadow-inner"
                    />
                  </div>

                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us about your emergency requirement or feedback..."
                    className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-100 focus:border-red-500 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:ring-4 focus:ring-red-500/10 transition-all duration-300 shadow-inner resize-none"
                  />

                  <motion.button
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    className="w-full cursor-pointer bg-linear-to-r from-red-500 via-rose-500 to-rose-600 hover:opacity-95 text-white py-4.5 rounded-2xl font-black text-sm shadow-xl shadow-red-500/20 hover:shadow-red-500/30 flex items-center justify-center gap-2.5 transition-all duration-300 group/btn"
                  >
                    <span>Send Message</span>
                    <Send
                      size={15}
                      className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5 transition-transform duration-300"
                    />
                  </motion.button>
                </form>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-slate-950 border border-slate-900 rounded-[2rem] p-8 lg:p-10 lg:col-span-5 text-white flex flex-col justify-between relative overflow-hidden shadow-2xl transform-gpu group/info"
            >
              <div className="absolute top-[-20%] right-[-20%] w-75 h-75 bg-red-500/15 rounded-full blur-[70px] pointer-events-none" />
              <div className="absolute bottom-[-30%] left-[-20%] w-62.5 h-62.5 bg-rose-500/10 rounded-full blur-[60px] pointer-events-none" />

              <div className="relative z-10">
                <div className="mb-10">
                  <h3 className="text-2xl font-black tracking-tight text-white">
                    Contact Information
                  </h3>
                  <p className="text-sm font-bold text-slate-500 mt-1">
                    Get directly in touch with our central hub.
                  </p>
                </div>

                <div className="space-y-5">
                  {[
                    {
                      icon: <Phone size={20} />,
                      label: "Emergency Hotline",
                      value: "+880 1234-567890",
                      href: "tel:+8801234567890",
                    },
                    {
                      icon: <Mail size={20} />,
                      label: "Official Support",
                      value: "support@bloodhero.com",
                      href: "mailto:support@bloodhero.com",
                    },
                    {
                      icon: <MapPin size={20} />,
                      label: "Central Operations",
                      value: "Dhaka, Bangladesh",
                      href: null,
                    },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 6, scale: 1.01 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      className="flex gap-4.5 items-center p-3 rounded-2xl bg-white/2 border border-white/3 hover:bg-white/5 hover:border-white/8 transition-all duration-300 group/row cursor-pointer"
                    >
                      <div className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover/row:bg-red-500 group-hover/row:text-white transition-all duration-300 shadow-lg">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="font-extrabold text-sm text-slate-200 group-hover/row:text-red-400 transition-colors flex items-center gap-1"
                          >
                            {item.value}
                            <ArrowRight
                              size={12}
                              className="opacity-0 group-hover/row:opacity-100 group-hover/row:translate-x-1 transition-all duration-300"
                            />
                          </a>
                        ) : (
                          <p className="font-extrabold text-sm text-slate-200">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="mt-12 bg-white/3 border border-white/5 hover:border-red-500/20 rounded-2xl p-5 backdrop-blur-md relative z-10 transition-colors duration-300"
              >
                <p className="text-xs leading-relaxed text-slate-400 font-medium">
                  Every blood request and message is securely handled. Your
                  input directly helps BloodHero expand its network to reach
                  more people in critical need.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
