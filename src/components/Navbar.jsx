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

import { authClient, useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Avatar } from "@heroui/react";

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);

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

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}

        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-red-500 flex items-center justify-center text-white shadow-md">
            <HeartPulse size={25} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-red-600">BloodHero</h1>

            <p className="text-xs text-gray-500">Donate • Save Life</p>
          </div>
        </Link>

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

        {user ? (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2"
            >
              <Avatar>
                <Avatar.Image alt={user?.image} src={user?.image} />
                <Avatar.Fallback>{user?.name}</Avatar.Fallback>
              </Avatar>

              <span className="hidden sm:block font-medium">{user.name}</span>

              <ChevronDown size={18} />
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border p-2">
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 text-left"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full border border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition"
            >
              Login
            </Link>

            <Link
              href="/registration"
              className="px-5 py-2.5 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 shadow-md transition"
            >
              Registration
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
