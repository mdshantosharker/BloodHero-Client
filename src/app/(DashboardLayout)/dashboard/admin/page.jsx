import {
  Users,
  HandCoins,
  HeartPulse,
  ShieldCheck,
  ArrowUpRight,
  Activity,
  Clock,
  CheckCircle2,
  Droplet,
} from "lucide-react";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getAllUsers2, getDonations } from "@/lib/api/users/allUsers";
import { paymentsHistory2 } from "@/lib/api/payments/history";

export default async function AdminDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  const data = await getAllUsers2();
  const bloodData = await getDonations();
  const res = await paymentsHistory2();
  const totalDonationsAmount = res.reduce(
    (acc, item) => acc + (item.amount || 0),
    0,
  );

  console.log(data);
  const stats = [
    {
      title: "Total Users",
      count: data.length,
      icon: Users,
      desc: "Registered Donors",
      color: "from-blue-500 to-indigo-600 shadow-blue-500/20",
    },
    {
      title: "Total Funding",
      count: `${totalDonationsAmount.toLocaleString()} BDT`,
      icon: HandCoins,
      desc: "Donation Amount",
      color: "from-emerald-500 to-teal-600 shadow-emerald-500/20",
    },
    {
      title: "Blood Requests",
      count: bloodData.length,
      icon: HeartPulse,
      desc: "Total Requests",
      color: "from-rose-500 to-red-600 shadow-rose-500/20",
    },
  ];

  const recentRequestsDemo = [
    {
      id: "1",
      patient: "Abdur Rahman",
      group: "A+",
      hospital: "Dhaka Medical",
      status: "Urgent",
      time: "2 mins ago",
    },
    {
      id: "2",
      patient: "Fatima Begum",
      group: "O-",
      hospital: "Apollo Hospital",
      status: "Pending",
      time: "15 mins ago",
    },
    {
      id: "3",
      patient: "Siam Ahmed",
      group: "B+",
      hospital: "Square Hospital",
      status: "Managed",
      time: "1 hour ago",
    },
  ];

  const recentDonationsDemo = [
    {
      id: "1",
      donor: "Anisur Rahman",
      amount: "2,000 BDT",
      method: "bKash",
      date: "Today",
    },
    {
      id: "2",
      donor: "Taskin Ahmed",
      amount: "5,000 BDT",
      method: "Nagad",
      date: "Yesterday",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8 antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100">
              <ShieldCheck size={26} className="stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                Welcome, {user?.name || "Admin"}
              </h1>
              <p className="text-slate-500 text-sm mt-0.5 font-medium">
                Manage BloodHero platform system control panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 text-xs font-semibold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            System Live Status
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">
                      {item.title}
                    </p>
                    <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                      {item.count}
                    </h3>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-linear-to-br ${item.color} text-white flex items-center justify-center shadow-lg`}
                  >
                    <Icon size={22} className="stroke-[2.2]" />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>{item.desc}</span>
                  <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                    <Activity size={12} /> Active
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Droplet size={18} className="text-rose-500 fill-rose-500" />{" "}
                  Recent Blood Requests
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time update from users list
                </p>
              </div>
              <button className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-xl hover:bg-rose-100 transition">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-semibold text-slate-400 uppercase bg-slate-50/70 rounded-xl">
                    <th className="p-3 rounded-l-xl">Patient Name</th>
                    <th className="p-3">Blood Group</th>
                    <th className="p-3">Hospital</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-r-xl text-right">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm">
                  {recentRequestsDemo.map((req) => (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="p-3 font-semibold text-slate-800">
                        {req.patient}
                      </td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 bg-rose-50 text-rose-600 font-black rounded-md text-xs border border-rose-100">
                          {req.group}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 font-medium">
                        {req.hospital}
                      </td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            req.status === "Urgent"
                              ? "bg-red-50 text-red-600"
                              : req.status === "Pending"
                                ? "bg-amber-50 text-amber-600"
                                : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              req.status === "Urgent"
                                ? "bg-red-500 animate-pulse"
                                : req.status === "Pending"
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                            }`}
                          />
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3 text-right text-slate-400 text-xs font-medium">
                        {req.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Clock size={18} className="text-emerald-500" /> Funding
                    Logs
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Latest system financial transactions
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {recentDonationsDemo.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-2xs">
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {donation.donor}
                        </p>
                        <p className="text-xs text-slate-400 font-medium">
                          via {donation.method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-600">
                        +{donation.amount}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        {donation.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-linear-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 flex items-center justify-between shadow-md">
              <div>
                <p className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                  Quick Report
                </p>
                <p className="text-sm font-bold text-white mt-0.5">
                  Generate Month Summary
                </p>
              </div>
              <button className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition">
                <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
