"use client";

import Link from "next/link";
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

  const user = session?.user;

  const dashboardItems = {
    donor: [
      {
        icon: LayoutDashboard,
        label: "Dashboard Home",
        link: "/dashboard/donor",
      },
      {
        icon: HeartPulse,
        label: "My Donation Requests",
        link: "/dashboard/donor/my-donation-requests",
      },
      {
        icon: PlusCircle,
        label: "Create Donation Request",
        link: "/dashboard/donor/create-donation-request",
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
        label: "All Blood Donation Requests",
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
        label: "All Blood Donation Requests",
        link: "/dashboard/admin/all-blood-donation-requests",
      },
    ],
  };

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success(`${user?.name} Successfully Logged Out`);
          router.push("/login");
        },
      },
    });
  };

  return (
    <aside className="w-80 bg-white rounded-3xl shadow-xl border border-red-100 flex flex-col overflow-hidden">
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

      {/* User Card */}
      <div className="p-6">
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

      <nav className="flex-1 px-4 overflow-y-auto">
        <div className="space-y-2">
          {dashboardItems[user?.role]?.map((item) => {
            const Icon = item.icon;

            const isActive = pathname === item.link;

            return (
              <Link
                key={item.link}
                href={item.link}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
                ${
                  isActive
                    ? "bg-red-50 text-red-600 font-semibold shadow-sm"
                    : "hover:bg-red-50 hover:text-red-600"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}

          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
            ${
              pathname === "/dashboard/profile"
                ? "bg-red-50 text-red-600 font-semibold shadow-sm"
                : "hover:bg-red-50 hover:text-red-600"
            }`}
          >
            <User size={20} />
            Profile
          </Link>

          {/* Funding */}
          {(user?.role === "donor" || user?.role === "admin") && (
            <Link
              href="/dashboard/funding"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200
              ${
                pathname === "/dashboard/funding"
                  ? "bg-red-50 text-red-600 font-semibold shadow-sm"
                  : "hover:bg-red-50 hover:text-red-600"
              }`}
            >
              <HandCoins size={20} />
              Funding
            </Link>
          )}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-red-100">
        <button
          onClick={logout}
          className="w-full cursor-pointer flex items-center justify-center gap-3 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition shadow-lg font-medium"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
