import { Users, HandCoins, HeartPulse, ShieldCheck } from "lucide-react";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getAllUsers, getDonations } from "@/lib/api/users/allUsers";
import { paymentsHistory } from "@/lib/api/payments/history";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const data = await getAllUsers();
  const bloodData = await getDonations();
  const res = await paymentsHistory();
  const totalDonationsAmount = res.reduce(
    (acc, item) => acc + (item.amount || 0),
    0,
  );
  // console.log(data);

  const stats = [
    {
      title: "Total Users",
      count: data.length,
      icon: Users,
      desc: "Registered Donors",
    },

    {
      title: "Total Funding",
      count: totalDonationsAmount,
      icon: HandCoins,
      desc: "Donation Amount",
    },

    {
      title: "Blood Requests",
      count: bloodData.length,
      icon: HeartPulse,
      desc: "Total Requests",
    },
  ];

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
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
