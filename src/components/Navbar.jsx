"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import {
  HeartPulse,
  User,
  ChevronDown,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const user = {
    name: "Shanto",
    email: "shanto@gmail.com",
  };

  // outside click close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = () => {
    alert("logout");
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}

        <Link href="/" className="flex items-center gap-2">
          <div className="w-11 h-11 rounded-full bg-red-500 flex items-center justify-center text-white shadow">
            <HeartPulse size={25} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-red-600">BloodHero</h1>

            <p className="text-xs text-gray-500">Donate • Save Life</p>
          </div>
        </Link>

        {/* Links */}

        <div className="hidden md:flex gap-8 font-medium">
          <Link
            href="/donation-requests"
            className="hover:text-red-500 transition"
          >
            Donation Requests
          </Link>

          {user && (
            <Link href="/funding" className="hover:text-red-500 transition">
              Funding
            </Link>
          )}
        </div>

        {/* Right Side */}

        {user ? (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <User size={22} />
              </div>

              <span className="hidden sm:block font-medium">{user.name}</span>

              <ChevronDown size={18} />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border p-2">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-left"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="px-5 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition">
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
