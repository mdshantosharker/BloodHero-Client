"use client";

import Link from "next/link";
import {
  HeartPulse,
  CalendarDays,
  Clock,
  MapPin,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { useState } from "react";

export default function DonorDashboard() {
  const { data: session, isPending } = useSession();

  const [mounted, setMounted] = useState(false);

  if (typeof window !== "undefined" && !mounted) {
    setMounted(true);
  }

  if (!mounted || isPending) {
    return (
      <div className="min-h-100 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const user = session?.user;

  const donationRequests = [
    {
      _id: "1",
      recipientName: "Rahim",
      district: "Dhaka",
      upazila: "Mirpur",
      date: "2026-06-20",
      time: "10:30 AM",
      bloodGroup: "A+",
      status: "inprogress",
    },
    {
      _id: "2",
      recipientName: "Karim",
      district: "Gazipur",
      upazila: "Tongi",
      date: "2026-06-22",
      time: "2:00 PM",
      bloodGroup: "B+",
      status: "pending",
    },
  ];

  const recentRequests = donationRequests.slice(0, 3);

  const deleteRequest = (id) => {
    if (window.confirm("Delete this request?")) {
      console.log(id);
    }
  };

  return (
    <div className="space-y-8">
      <div
        className="
bg-linear-to-r
from-red-500
to-red-600
rounded-3xl
p-6
md:p-8
text-white
shadow-xl
"
      >
        <div className="flex gap-4 items-center">
          <div
            className="
w-14 h-14
rounded-2xl
bg-white/20
flex
items-center
justify-center
"
          >
            <HeartPulse size={32} />
          </div>

          <div>
            <h1 className="text-xl md:text-3xl font-bold">
              Welcome, {user?.name} 👋
            </h1>

            <p className="text-red-100">Thank you for saving lives</p>
          </div>
        </div>
      </div>

      {recentRequests.length > 0 && (
        <div
          className="
bg-white
rounded-3xl
border
shadow-lg
p-4 md:p-6
"
        >
          <h2
            className="
text-xl
font-bold
mb-5
"
          >
            Recent Donation Requests
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-225 w-full">
              <thead>
                <tr
                  className="
border-b
text-gray-500
text-left
"
                >
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Blood</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {recentRequests.map((item) => (
                  <tr
                    key={item._id}
                    className="
border-b
hover:bg-red-50
transition
"
                  >
                    <td className="p-3 font-semibold">{item.recipientName}</td>

                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <MapPin size={15} />
                        {item.district}, {item.upazila}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-sm">
                        <div className="flex gap-1">
                          <CalendarDays size={14} />

                          {item.date}
                        </div>

                        <div className="flex gap-1">
                          <Clock size={14} />

                          {item.time}
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span
                        className="
bg-red-100
text-red-600
px-3
py-1
rounded-full
font-bold
"
                      >
                        {item.bloodGroup}
                      </span>
                    </td>

                    <td className="p-3">
                      <span
                        className={`
px-3 py-1 rounded-full text-sm
${
  item.status === "pending"
    ? "bg-yellow-100 text-yellow-700"
    : item.status === "done"
      ? "bg-green-100 text-green-700"
      : item.status === "canceled"
        ? "bg-gray-100 text-gray-700"
        : "bg-blue-100 text-blue-700"
}
`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/donor/view/${item._id}`}
                          className="p-2 bg-blue-100 rounded-lg text-blue-600"
                        >
                          <Eye size={17} />
                        </Link>

                        <Link
                          href={`/dashboard/donor/edit/${item._id}`}
                          className="p-2 bg-yellow-100 rounded-lg text-yellow-600"
                        >
                          <Edit size={17} />
                        </Link>

                        <button
                          onClick={() => deleteRequest(item._id)}
                          className="
p-2
bg-red-100
rounded-lg
text-red-600
"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-6">
            <Link
              href="/dashboard/donor/my-donation-requests"
              className="
inline-block
bg-red-500
text-white
px-7
py-3
rounded-full
hover:bg-red-600
transition
"
            >
              View My All Requests
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
