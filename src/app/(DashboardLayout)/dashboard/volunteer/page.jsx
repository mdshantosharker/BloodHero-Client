"use client";

import { useEffect, useState } from "react";
import {
  Users,
  HandCoins,
  HeartPulse,
  Activity,
  CheckCircle,
  Flame,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { getAllUsers2, getDonations } from "@/lib/api/users/allUsers";
import { paymentsHistory, paymentsHistory2 } from "@/lib/api/payments/history";

export default function VolunteerDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const [users, setUsers] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getAllUsers2();
        const donationsData = await getDonations();
        const res = await paymentsHistory2();

        setUsers(usersData || []);
        setBloodRequests(donationsData || []);
        setHistory(res || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const totalDonationsAmount = history.reduce(
    (acc, item) => acc + (item.amount || 0),
    0,
  );

  console.log(history);
  console.log(bloodRequests);

  const stats = [
    {
      title: "Total Users",
      count: users.length,
      icon: Users,
      desc: "Registered Donors",
      gradient: "from-rose-500/10 to-red-500/5 text-rose-600 border-rose-100",
    },
    {
      title: "Total Funding",
      count: totalDonationsAmount,
      icon: HandCoins,
      desc: "Donation Amount",
      gradient: "from-rose-500/10 to-red-500/5 text-rose-600 border-rose-100",
    },
    {
      title: "Blood Requests",
      count: bloodRequests.length,
      icon: HeartPulse,
      desc: "Total Requests",
      gradient: "from-rose-500/10 to-red-500/5 text-rose-600 border-rose-100",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-2 antialiased">
      <div className="relative overflow-hidden rounded-[32px] bg-linear-to-br from-red-800 via-rose-600 to-red-700 p-8 text-white shadow-xl shadow-red-900/10 transition-all duration-300 hover:shadow-red-900/20">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-black/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md border border-white/20 transition-transform duration-500 hover:rotate-6">
              <HeartPulse size={44} className="text-white animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm uppercase tracking-widest">
                  Volunteer Portal
                </span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
                Welcome Volunteer 🤝
              </h1>
              <p className="mt-1.5 text-red-100 text-sm sm:text-base font-medium max-w-xl">
                Help people by managing blood donation activities and tracking
                platform metrics.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="group relative bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute bottom-0 left-6 right-6 h-1 bg-linear-to-r from-red-500 to-rose-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-full" />

              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-gray-400 font-bold text-xs uppercase tracking-wider">
                    {item.title}
                  </h2>
                  <h1 className="text-4xl font-black mt-2 text-gray-800 tracking-tight transition-all group-hover:text-red-600">
                    {item.count}
                  </h1>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl bg-linear-to-br ${item.gradient} flex items-center justify-center border transition-transform group-hover:scale-110 duration-300`}
                >
                  <Icon size={26} />
                </div>
              </div>

              <p className="text-xs font-semibold text-gray-400 mt-5 flex items-center gap-1.5">
                <Activity size={12} className="text-emerald-500" />
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-md p-8 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-50 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-xl text-red-600">
              <Flame size={20} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">
                Core System Responsibilities
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Your authorized management dashboard tasks
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-linear-to-b from-gray-50 to-white border border-gray-100 p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:border-red-100 hover:bg-red-50/10">
            <div className="flex items-start justify-between">
              <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                🩸
              </span>
              <CheckCircle
                size={16}
                className="text-gray-300 group-hover:text-red-500 transition-colors"
              />
            </div>
            <h4 className="font-bold text-gray-800 mt-4 text-base">
              Manage Requests
            </h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Approve, update, or track emergency blood and plasma requests
              across the platform.
            </p>
          </div>

          <div className="group bg-linear-to-b from-gray-50 to-white border border-gray-100 p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:border-red-100 hover:bg-red-50/10">
            <div className="flex items-start justify-between">
              <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                👥
              </span>
              <CheckCircle
                size={16}
                className="text-gray-300 group-hover:text-red-500 transition-colors"
              />
            </div>
            <h4 className="font-bold text-gray-800 mt-4 text-base">
              Support Community
            </h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Bridge the gap efficiently between registered active donors and
              emergency patients.
            </p>
          </div>

          <div className="group bg-linear-to-b from-gray-50 to-white border border-gray-100 p-5 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:border-red-100 hover:bg-red-50/10">
            <div className="flex items-start justify-between">
              <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">
                📋
              </span>
              <CheckCircle
                size={16}
                className="text-gray-300 group-hover:text-red-500 transition-colors"
              />
            </div>
            <h4 className="font-bold text-gray-800 mt-4 text-base">
              Status Reports
            </h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Monitor and update real-time donation statuses for transparent
              data workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
