"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

import { HeartPulse, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, toast } from "@heroui/react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
          toast.success(user?.name + " Successfully Logout");
          setTimeout(() => {
            window.location.reload();
          }, 400);
        },
      },
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
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
            href="/"
            className={`relative px-1 py-2 transition-all duration-300 ${
              pathname === "/"
                ? "text-red-500 font-semibold"
                : "text-gray-600 hover:text-red-500"
            }`}
          >
            Home
            <span
              className={`absolute left-0 -bottom-0.5 h-0.5 bg-red-500 rounded-full transition-all duration-300 ${
                pathname === "/" ? "w-full" : "w-0"
              }`}
            />
          </Link>

          <Link
            href="/donation-requests"
            className={`relative px-1 py-2 transition-all duration-300 ${
              pathname === "/donation-requests"
                ? "text-red-500 font-semibold"
                : "text-gray-600 hover:text-red-500"
            }`}
          >
            Donation Requests
            <span
              className={`absolute left-0 -bottom-0.5 h-0.5 bg-red-500 rounded-full transition-all duration-300 ${
                pathname === "/donation-requests" ? "w-full" : "w-0"
              }`}
            />
          </Link>

          {user && (
            <Link
              href="/funding"
              className={`relative px-1 py-2 transition-all duration-300 ${
                pathname === "/funding"
                  ? "text-red-500 font-semibold"
                  : "text-gray-600 hover:text-red-500"
              }`}
            >
              Funding
              <span
                className={`absolute left-0 -bottom-0.5 h-0.5 bg-red-500 rounded-full transition-all duration-300 ${
                  pathname === "/funding" ? "w-full" : "w-0"
                }`}
              />
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
                  href={`/dashboard/${user?.role}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                    pathname === `/dashboard/${user?.role}`
                      ? "bg-red-50 text-red-500 font-semibold"
                      : "hover:bg-red-50 text-gray-700 hover:text-red-500"
                  }`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogoutClick}
                  className="w-full cursor-pointer flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 text-left text-gray-700 hover:text-red-500 transition-all duration-300"
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
              href="/auth/login"
              className="px-5 py-2.5 rounded-full border border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition"
            >
              Login
            </Link>

            <Link
              href="/auth/registration"
              className="px-5 py-2.5 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 shadow-md transition"
            >
              Registration
            </Link>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border p-6 w-full max-w-sm mx-4 transform transition-all animate-scale-in">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              You will be logged out of your account. You need to log in again
              to access full features.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 font-medium transition cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
