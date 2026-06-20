"use client";

import { motion } from "framer-motion";
import { Heart, Search, Zap, ShieldCheck } from "lucide-react";

export default function Featured() {
  const features = [
    {
      icon: Heart,
      title: "Verified Donors",
      text: "Connect with real, verified blood donors and build a life-saving community.",
      color: "from-red-500 to-rose-600",
      bgLight: "bg-red-500/10 text-red-500",
    },
    {
      icon: Search,
      title: "Smart Blood Finder",
      text: "Find the exact blood group you need instantly, filtered by your nearby location.",
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-500/10 text-blue-500",
    },
    {
      icon: Zap,
      title: "Instant Alerts",
      text: "Emergency requests broadcast instantly to active donors within your area.",
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-500/10 text-amber-500",
    },
    {
      icon: ShieldCheck,
      title: "100% Privacy Secure",
      text: "Your phone number and private data are protected with strict access control.",
      color: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-500/10 text-emerald-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  return (
    <section className="relative w-full bg-linear-to-br from-red-100 via-white to-rose-100 overflow-hidden py-24 px-6">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6 lg:col-span-1"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-red-600 bg-red-100/80 px-4 py-2 rounded-full border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Why BloodHero?
          </span>

          <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-none">
            Together We <br className="hidden md:inline" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-500 to-rose-600">
              Can Save Lives
            </span>
          </h2>

          <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed">
            Our platform seamlessly bridges the gap between active blood donors
            and urgent recipients to make donation faster than ever.
          </p>

          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-slate-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-500 shadow-lg hover:shadow-red-500/20 transition-all duration-300"
            >
              Learn More About Us
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative flex flex-col justify-between bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div
                  className={`absolute -right-12 -bottom-12 w-32 h-32 bg-linear-to-br ${item.color} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                />

                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${item.bgLight} group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <Icon size={24} />
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight group-hover:text-red-500 transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>

                {/* Number Indicator (Top Right Corner) */}
                <span className="absolute top-6 right-8 text-xs font-bold text-slate-300 group-hover:text-slate-400 transition-colors duration-300">
                  0{index + 1}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
