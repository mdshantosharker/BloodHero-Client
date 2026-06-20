"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, toast } from "@heroui/react";
import Link from "next/link";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const user = session?.user;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setOpen(false);
    setShowModal(true);
  };

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setShowModal(false);
          router.push("/auth/login");
          toast.success((user?.name || "User") + " Successfully Logout");
          setTimeout(() => {
            window.location.reload();
          }, 400);
        },
      },
    });
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Donation Requests", path: "/donation-requests" },
    ...(user ? [{ label: "Funding", path: "/funding" }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-200/50 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.03)] transform-gpu">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: [0, -10, 10, 0] }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="w-11 h-11 rounded-2xl bg-linear-to-br from-red-500/10 to-rose-500/5 border border-red-500/20 flex items-center justify-center text-red-500 shadow-sm group-hover:border-red-500/40"
          >
            <HeartPulse size={24} className="animate-pulse" />
          </motion.div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 group-hover:text-red-600 transition-colors duration-300">
              Blood<span className="text-red-500 bg-clip-text">Hero</span>
            </h1>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              Donate • Save Life
            </p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1.5 font-bold text-sm">
          {navItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={index}
                href={item.path}
                className={`relative px-4.5 py-2.5 rounded-xl transition-all duration-300 transform-gpu ${
                  isActive
                    ? "text-red-600 font-extrabold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeNavTab"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-slate-200/60 rounded-xl z-0"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div ref={dropdownRef} className="relative">
              <motion.button
                whileHover={{ scale: 1.02, y: -0.5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2.5 bg-white border border-slate-200/80 p-1.5 pr-3.5 rounded-2xl transition-all cursor-pointer text-slate-800 shadow-xs hover:border-slate-300 hover:shadow-sm"
              >
                <Avatar size="sm" className="w-8 h-8 ring-2 ring-red-500/10">
                  <Avatar.Image
                    alt={user?.image || ""}
                    src={user?.image || ""}
                  />
                  <Avatar.Fallback className="bg-linear-to-br from-red-500 to-rose-600 text-white font-black text-xs">
                    {user?.name?.slice(0, 2).toUpperCase()}
                  </Avatar.Fallback>
                </Avatar>
                <span className="font-extrabold text-sm text-slate-800">
                  {user.name}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-300 ${open ? "rotate-180 text-slate-900" : ""}`}
                />
              </motion.button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2.5 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/80 p-2 origin-top-right transform-gpu z-50"
                  >
                    <Link
                      href={`/dashboard/${user?.role}`}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold transition-all ${
                        pathname === `/dashboard/${user?.role}`
                          ? "bg-red-50/60 text-red-600 border border-red-100"
                          : "text-slate-700 hover:bg-slate-50 hover:text-red-500"
                      }`}
                    >
                      <LayoutDashboard size={16} className="text-red-500" />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogoutClick}
                      className="w-full cursor-pointer flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all text-left"
                    >
                      <LogOut
                        size={16}
                        className="text-slate-400 group-hover:text-red-500"
                      />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:text-slate-900 border border-slate-200/80 bg-white/50 hover:bg-white hover:border-slate-300 shadow-xs transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href="/auth/registration"
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-linear-to-r from-red-500 to-rose-600 text-white hover:opacity-95 shadow-lg shadow-red-500/10 hover:shadow-red-500/20 active:scale-98 transition-all duration-200"
              >
                Registration
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "tween", duration: 0.25 }}
            className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-md px-6 py-4 space-y-2.5 overflow-hidden transform-gpu"
          >
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  pathname === item.path
                    ? "bg-red-50 text-red-600 border border-red-100/50"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <hr className="border-slate-200/60 my-3" />
            {!user && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white shadow-xs"
                >
                  Login
                </Link>
                <Link
                  href="/auth/registration"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-3 bg-linear-to-r from-red-500 to-rose-600 text-white rounded-xl text-sm font-bold shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 transform-gpu">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
              className="relative bg-white rounded-3xl shadow-2xl border border-slate-200/80 p-6 w-full max-w-sm z-10 text-slate-700"
            >
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Are you sure?
              </h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">
                You will be securely logged out of your active terminal layer
                profile session.
              </p>
              <div className="flex gap-2.5 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={logout}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-linear-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/10 hover:opacity-95 active:scale-98 cursor-pointer transition-all"
                >
                  Yes, Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
