"use client";

import { Users, Droplets, Wallet, HeartPulse } from "lucide-react";

export default function VolunteerDashboard() {
  const stats = [
    {
      title: "Total Donors",
      count: "120",
      icon: <Users size={32} />,
      desc: "Active blood donors",
    },

    {
      title: "Total Funding",
      count: "৳ 25,000",
      icon: <Wallet size={32} />,
      desc: "Organization support",
    },

    {
      title: "Blood Requests",
      count: "85",
      icon: <Droplets size={32} />,
      desc: "Donation requests",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}

      <div className="rounded-[30px] bg-linear-to-r from-red-500 to-rose-600 p-8 text-white shadow-xl">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur">
            <HeartPulse size={45} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Welcome Volunteer 🤝</h1>

            <p className="mt-2 text-red-100">
              Help people by managing blood donation activities
            </p>
          </div>
        </div>
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl border border-red-100 shadow-lg p-6 hover:-translate-y-1 transition"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              {item.icon}
            </div>

            <h2 className="mt-5 text-gray-500 font-medium">{item.title}</h2>

            <h1 className="text-3xl font-bold mt-1">{item.count}</h1>

            <p className="text-sm text-gray-400 mt-2">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Volunteer Info */}

      <div className="bg-white rounded-3xl border border-red-100 shadow-lg p-6">
        <h2 className="text-xl font-bold">Volunteer Responsibilities</h2>

        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="bg-red-50 p-4 rounded-2xl">
            🩸 Manage blood requests
          </div>

          <div className="bg-red-50 p-4 rounded-2xl">
            👥 Help donors & patients
          </div>

          <div className="bg-red-50 p-4 rounded-2xl">
            📋 Update donation status
          </div>
        </div>
      </div>
    </div>
  );
}
