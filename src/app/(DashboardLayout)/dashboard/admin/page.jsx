"use client";

import { Users, HandCoins, HeartPulse, ShieldCheck } from "lucide-react";

import { useSession } from "@/lib/auth-client";

export default function AdminDashboard() {
  const { data: session } = useSession();

  const user = session?.user;

  const stats = [
    {
      title: "Total Users",
      count: 1250,
      icon: Users,
      desc: "Registered Donors",
    },

    {
      title: "Total Funding",
      count: "$4500",
      icon: HandCoins,
      desc: "Donation Amount",
    },

    {
      title: "Blood Requests",
      count: 320,
      icon: HeartPulse,
      desc: "Total Requests",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}

      <div className="bg-linear-to-r from-red-500 to-rose-600 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={32} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name}</h1>

            <p className="text-red-100 mt-1">
              Manage BloodHero platform from here
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                bg-white
                rounded-3xl
                border
                border-gray-100
                p-5
                shadow-sm
                hover:shadow-lg
                transition
                "
            >
              <div className="flex items-center justify-between">
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-red-50
                    text-red-600
                    flex
                    items-center
                    justify-center
                    "
                >
                  <Icon size={28} />
                </div>

                <span className="text-3xl font-bold text-gray-800">
                  {item.count}
                </span>
              </div>

              <h2 className="mt-5 text-lg font-bold text-gray-800">
                {item.title}
              </h2>

              <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
