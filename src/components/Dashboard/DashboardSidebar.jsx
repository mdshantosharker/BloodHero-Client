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
    <aside className="w-80 bg-white rounded-3xl shadow-xl border border-red-100 flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-red-100">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-lg">
            <HeartPulse size={26} />
          </div>
          <div>
            <h1 className="font-bold text-xl text-red-600">BloodHero</h1>
            <p className="text-gray-500 text-sm capitalize">
              {user?.role || "Dashboard"}
            </p>
          </div>
        </Link>
      </div>

      <div className="p-6 pb-2">
        <div className="bg-linear-to-r from-red-500 to-red-600 rounded-3xl p-5 text-white shadow-lg">
          <div className="flex justify-center">
            <img
              src={user?.image}
              alt={user?.name}
              className="w-20 h-20 rounded-full border-4 border-white object-cover"
            />
          </div>
          <div className="text-center mt-4">
            <h3 className="font-bold text-lg">{user?.name}</h3>
            <p className="text-red-100 text-sm break-all">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-6">
        {roleBasedItems[user?.role]?.length > 0 && (
          <div className="space-y-2">
            <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Main Navigation
            </p>
            {roleBasedItems[user?.role].map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.link;

              return (
                <Link
                  key={item.link}
                  href={item.link}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-red-50 text-red-600 font-semibold shadow-xs"
                      : "text-gray-600 hover:bg-red-50/60 hover:text-red-600"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="space-y-2 pt-2 border-t border-gray-100">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Personal & Core
          </p>

          <Link
            href="/dashboard/my-donation-requests"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
            ${
              pathname === "/dashboard/my-donation-requests"
                ? "bg-red-50 text-red-600 font-semibold shadow-xs"
                : "text-gray-600 hover:bg-red-50/60 hover:text-red-600"
            }`}
          >
            <HeartPulse size={20} />
            <span>My Request</span>
          </Link>

          <Link
            href="/dashboard/create-donation-request"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
            ${
              pathname === "/dashboard/create-donation-request"
                ? "bg-red-50 text-red-600 font-semibold shadow-xs"
                : "text-gray-600 hover:bg-red-50/60 hover:text-red-600"
            }`}
          >
            <PlusCircle size={20} />
            <span>Create Request</span>
          </Link>

          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
            ${
              pathname === "/dashboard/profile"
                ? "bg-red-50 text-red-600 font-semibold shadow-xs"
                : "text-gray-600 hover:bg-red-50/60 hover:text-red-600"
            }`}
          >
            <User size={20} />
            <span>Profile</span>
          </Link>

          {(user?.role === "donor" || user?.role === "admin") && (
            <Link
              href="/dashboard/funding"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
              ${
                pathname === "/dashboard/funding"
                  ? "bg-red-50 text-red-600 font-semibold shadow-xs"
                  : "text-gray-600 hover:bg-red-50/60 hover:text-red-600"
              }`}
            >
              <HandCoins size={20} />
              <span>Funding</span>
            </Link>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-red-100 bg-gray-50/50">
        <button
          onClick={() => setShowModal(true)}
          className="w-full cursor-pointer flex items-center justify-center gap-3 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition shadow-lg font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border p-6 w-full max-w-sm mx-4 transform transition-all animate-scale-in text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-500 mb-6 font-normal">
              You will be logged out of your account. You need to log in again
              to access the dashboard.
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
    </aside>
  );
};

export default DashboardSidebar;
