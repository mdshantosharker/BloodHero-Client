"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  User,
  HeartPulse,
  HandCoins,
  LogOut,
} from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "@heroui/react";
import { useRouter } from "next/navigation";
const DashboardSidebar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  //   console.log(session?.user);
  const user = session?.user;
  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          toast.success(user?.name + " Successfully LogOUt");
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

            <p className=" text-gray-500 text-lg font-bold">{user?.role}</p>
          </div>
        </Link>
      </div>

      <div className="p-6">
        <div className="bg-linear-to-r from-red-500 to-red-600 rounded-3xl p-5 text-white shadow-lg">
          <div className="flex justify-center">
            <img
              src={user?.image}
              alt=""
              className="w-20 h-20 rounded-full border-4 border-white object-cover"
            />
          </div>

          <div className="text-center mt-4">
            <h3 className="font-bold text-lg">{user?.name}</h3>

            <p className="text-red-100 text-sm">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50 text-red-600 font-semibold"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 transition"
          >
            <User size={20} />
            Profile
          </Link>

          <Link
            href="/dashboard/funding"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-50 transition"
          >
            <HandCoins size={20} />
            Funding
          </Link>
        </div>
      </nav>

      <div className="p-4">
        <button
          onClick={logout}
          className="w-full cursor-pointer flex items-center justify-center gap-3 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 transition shadow-lg"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
