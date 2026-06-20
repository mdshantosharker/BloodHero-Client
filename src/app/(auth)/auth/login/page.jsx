"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeartPulse, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const { data: session } = useSession();
  const user = session?.user;

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newErrors = {};

    if (!form.email.value.trim()) {
      newErrors.email = "Email is required";
    }
    if (!form.password.value) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    const { data, error } = await authClient.signIn.email({
      email: form.email.value,
      password: form.password.value,
    });

    setIsLoading(false);

    if (data) {
      toast.success("Login Successfully");
      if (callbackUrl) {
        window.location.href = callbackUrl;
      } else {
        window.location.href = "/";
      }
      console.log(user?.role);
    }

    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex items-center justify-center px-5 py-16 overflow-hidden select-none">
      <div className="absolute top-[-20%] left-[-10%] w-125 h-125 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-150 h-150 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        animate={{
          borderRadius: [
            "42% 58% 70% 30% / 45% 45% 55% 55%",
            "70% 30% 52% 48% / 60% 40% 60% 40%",
            "42% 58% 70% 30% / 45% 45% 55% 55%",
          ],
          y: [0, -12, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-12 right-12 w-32 h-32 bg-linear-to-br from-red-500/5 to-rose-500/20 border border-red-500/10 hidden lg:block"
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.7, bounce: 0.2 }}
        className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_25px_60px_-15px_rgba(244,63,94,0.08)] border border-slate-200/60 p-8 md:p-11 relative z-10"
      >
        <div className="text-center mb-9">
          <motion.div
            whileHover={{ scale: 1.08, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30 cursor-pointer"
          >
            <HeartPulse size={32} className="animate-pulse" />
          </motion.div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-5">
            Welcome Back
          </h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1.5">
            Login • Save a Life
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="group">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-red-500">
              Email Address
            </label>
            <div className="relative mt-2">
              <div className="absolute left-4 top-3.5 text-slate-400 transition-colors group-focus-within:text-red-500 pointer-events-none">
                <Mail size={18} />
              </div>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all duration-200 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 placeholder:text-slate-400"
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-xs font-bold mt-1.5 ml-1"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          <div className="group">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-red-500">
                Password
              </label>
            </div>
            <div className="relative mt-2">
              <div className="absolute left-4 top-3.5 text-slate-400 transition-colors group-focus-within:text-red-500 pointer-events-none">
                <Lock size={18} />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl py-3.5 pl-12 pr-12 text-sm font-medium text-slate-800 outline-none transition-all duration-200 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-xs font-bold mt-1.5 ml-1"
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            disabled={isLoading}
            className="w-full cursor-pointer bg-linear-to-r from-red-500 to-rose-600 text-white py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-red-500/20 hover:shadow-red-500/30 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In Securely</span>
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center mt-8 text-sm font-bold text-slate-400">
          New to BloodHero?
          <Link
            href={
              callbackUrl
                ? `/auth/registration?callbackUrl=${callbackUrl}`
                : "/auth/registration"
            }
            className="text-red-500 hover:text-red-600 ml-1.5 transition-colors inline-flex items-center gap-0.5 group"
          >
            Create Account
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
              →
            </span>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
