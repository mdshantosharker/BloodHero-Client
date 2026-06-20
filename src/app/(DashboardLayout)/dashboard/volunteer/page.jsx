"use client";

import { useEffect, useState } from "react";
import { Users, HandCoins, HeartPulse } from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { getAllUsers, getDonations } from "@/lib/api/users/allUsers";
import { paymentsHistory } from "@/lib/api/payments/history";

export default function VolunteerDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const [users, setUsers] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getAllUsers();
        const donationsData = await getDonations();
        const res = await paymentsHistory();

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
    },
    {
      title: "Total Funding",
      count: totalDonationsAmount,
      icon: HandCoins,
      desc: "Donation Amount",
    },
    {
      title: "Blood Requests",
      count: bloodRequests.length,
      icon: HeartPulse,
      desc: "Total Requests",
    },
  ];

  return (
    <div className="space-y-8">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-3xl border border-red-100 shadow-lg p-6 hover:-translate-y-1 transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <Icon size={28} />
              </div>

              <h2 className="mt-5 text-gray-500 font-medium">{item.title}</h2>

              <h1 className="text-3xl font-bold mt-1">{item.count}</h1>

              <p className="text-sm text-gray-400 mt-2">{item.desc}</p>
            </div>
          );
        })}
      </div>

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
