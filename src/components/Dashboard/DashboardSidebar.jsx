"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  User,
  HeartPulse,
  HandCoins,
  LogOut,
  PlusCircle,
  UserCog,
  Users,
} from "lucide-react";

import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";

const DashboardSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  const user = session?.user;

  const roleBasedItems = {
    donor: [
      {
        icon: LayoutDashboard,
        label: "Dashboard Home",
        link: "/dashboard/donor",
      },
    ],
    volunteer: [
      {
        icon: LayoutDashboard,
        label: "Dashboard Home",
        link: "/dashboard/volunteer",
      },
      {
        icon: HeartPulse,
        label: "All Blood Requests",
        link: "/dashboard/volunteer/all-blood-donation-requests",
      },
    ],
    admin: [
      {
        icon: LayoutDashboard,
        label: "Dashboard Home",
        link: "/dashboard/admin",
      },
      {
        icon: UserCog,
        label: "All Users",
        link: "/dashboard/admin/all-users",
      },
      {
        icon: Users,
        label: "All Blood Requests",
        link: "/dashboard/admin/all-blood-donation-requests",
      },
    ],
  };

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setShowModal(false);
          toast.success(`${user?.name} Successfully Logged Out`);
          router.push("/auth/login");
          setTimeout(() => {
            window.location.reload();
          }, 400);
        },
      },
    });
  };

  return (
    <aside className="w-80 bg-white text-zinc-800 rounded-3xl shadow-xl border border-zinc-100 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-zinc-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shadow-md">
            <HeartPulse size={26} className="text-red-500" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-zinc-900 tracking-wide">
              Blood<span className="text-red-600">Hero</span>
            </h1>
            <p className="text-zinc-400 text-xs capitalize font-medium mt-0.5">
              {user?.role || "Dashboard"}
            </p>
          </div>
        </Link>
      </div>

      <div className="p-6 pb-2">
        <div className="bg-linear-to-br from-rose-900 to-red-500  border border-zinc-100 rounded-3xl p-5 shadow-2xs flex flex-col items-center justify-center">
          <div className="relative group">
            <img
              src={user?.image}
              alt={user?.name}
              className="w-20 h-20 rounded-full border-2 border-red-500/20 object-cover shadow-sm p-0.5"
            />
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse"></span>
          </div>
          <div className="text-center mt-3">
            <h3 className="font-bold text-base text-white tracking-wide">
              {user?.name}
            </h3>
            <p className="text-white text-xs break-all mt-0.5 max-w-50">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-6">
        {roleBasedItems[user?.role]?.length > 0 && (
          <div className="space-y-1.5">
            <p className="px-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Main Navigation
            </p>
            {roleBasedItems[user?.role].map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.link;

              return (
                <Link
                  key={item.link}
                  href={item.link}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
                  ${
                    isActive
                      ? "bg-zinc-900 text-white font-semibold shadow-md"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-red-600"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-red-500" : "text-zinc-400"}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="space-y-1.5 pt-4 border-t border-zinc-100">
          <p className="px-4 text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Personal & Core
          </p>

          <Link
            href="/dashboard/my-donation-requests"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
            ${
              pathname === "/dashboard/my-donation-requests"
                ? "bg-zinc-900 text-white font-semibold shadow-md"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-red-600"
            }`}
          >
            <HeartPulse
              size={20}
              className={
                pathname === "/dashboard/my-donation-requests"
                  ? "text-red-500"
                  : "text-zinc-400"
              }
            />
            <span>My Request</span>
          </Link>

          <Link
            href="/dashboard/create-donation-request"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
            ${
              pathname === "/dashboard/create-donation-request"
                ? "bg-zinc-900 text-white font-semibold shadow-md"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-red-600"
            }`}
          >
            <PlusCircle
              size={20}
              className={
                pathname === "/dashboard/create-donation-request"
                  ? "text-red-500"
                  : "text-zinc-400"
              }
            />
            <span>Create Request</span>
          </Link>

          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
            ${
              pathname === "/dashboard/profile"
                ? "bg-zinc-900 text-white font-semibold shadow-md"
                : "text-zinc-600 hover:bg-zinc-50 hover:text-red-600"
            }`}
          >
            <User
              size={20}
              className={
                pathname === "/dashboard/profile"
                  ? "text-red-500"
                  : "text-zinc-400"
              }
            />
            <span>Profile</span>
          </Link>

          {(user?.role === "donor" || user?.role === "admin") && (
            <Link
              href="/funding"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
              ${
                pathname === "/funding"
                  ? "bg-zinc-900 text-white font-semibold shadow-md"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-red-600"
              }`}
            >
              <HandCoins
                size={20}
                className={
                  pathname === "/funding" ? "text-red-500" : "text-zinc-400"
                }
              />
              <span>Funding</span>
            </Link>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-zinc-100 bg-zinc-50/50">
        <button
          onClick={() => setShowModal(true)}
          className="w-full cursor-pointer flex items-center justify-center gap-3 py-3 rounded-2xl bg-red-600 text-white hover:bg-red-700 transition-all duration-300 shadow-md shadow-red-600/10 font-medium active:scale-98"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 backdrop-blur-xs transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-zinc-100 p-6 w-full max-w-sm mx-4 transform transition-all duration-300 scale-100 opacity-100 text-left animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-zinc-900 mb-2">
              Are you sure?
            </h3>
            <p className="text-sm text-zinc-500 mb-6 font-normal">
              You will be logged out of your account. You need to log in again
              to access the dashboard.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-zinc-500 hover:bg-zinc-100 font-medium transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 font-medium transition duration-200 cursor-pointer shadow-md"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default DashboardSidebar;
