"use client";

import { useState } from "react";
import {
  Droplets,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";

export default function AllBloodDonationRequest() {
  const [filter, setFilter] = useState("all");

  const [requests, setRequests] = useState([
    {
      id: 1,
      recipient: "Rahim",
      district: "Dhaka",
      upazila: "Mirpur",
      blood: "A+",
      date: "2026-06-20",
      time: "10:00 AM",
      status: "pending",
    },

    {
      id: 2,
      recipient: "Karim",
      district: "Gazipur",
      upazila: "Tongi",
      blood: "O+",
      date: "2026-06-21",
      time: "2:00 PM",
      status: "inprogress",
    },

    {
      id: 3,
      recipient: "Sakib",
      district: "Chittagong",
      upazila: "Pahartali",
      blood: "B+",
      date: "2026-06-22",
      time: "5:00 PM",
      status: "done",
    },
  ]);

  const updateStatus = (id, status) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item,
      ),
    );
  };

  const filtered =
    filter === "all"
      ? requests
      : requests.filter((item) => item.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}

      <div
        className="
bg-linear-to-r
from-red-500
to-rose-600
rounded-3xl
p-7
text-white
shadow-xl
"
      >
        <div className="flex gap-4 items-center">
          <div
            className="
w-16
h-16
rounded-2xl
bg-white/20
flex
items-center
justify-center
"
          >
            <Droplets size={35} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">All Blood Requests</h1>

            <p className="text-red-100">Volunteer management panel</p>
          </div>
        </div>
      </div>

      {/* Filter */}

      <div
        className="
bg-white
rounded-2xl
border
p-4
flex
justify-between
"
      >
        <h2 className="font-bold">Donation Requests</h2>

        <select
          onChange={(e) => setFilter(e.target.value)}
          className="
border
rounded-xl
p-2
"
        >
          <option value="all">All</option>

          <option value="pending">Pending</option>

          <option value="inprogress">In Progress</option>

          <option value="done">Done</option>

          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Table */}

      <div
        className="
bg-white
rounded-3xl
shadow-lg
border
overflow-x-auto
"
      >
        <table className="w-full">
          <thead className="bg-red-50">
            <tr>
              <th className="p-4 text-left">Recipient</th>

              <th className="p-4">Location</th>

              <th className="p-4">Blood</th>

              <th className="p-4">Date</th>

              <th className="p-4">Status</th>

              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4">
                  <p className="font-bold">{item.recipient}</p>
                </td>

                <td className="p-4">
                  <div className="flex gap-1 justify-center">
                    <MapPin size={16} />
                    {item.district},{item.upazila}
                  </div>
                </td>

                <td className="p-4 text-center">
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
                    {item.blood}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <div>
                    {item.date}

                    <br />

                    <span className="text-gray-400 flex justify-center gap-1">
                      <Clock size={14} />

                      {item.time}
                    </span>
                  </div>
                </td>

                <td className="p-4 text-center">
                  <span
                    className={`
px-3 py-1 rounded-full text-sm font-bold

${
  item.status === "done"
    ? "bg-green-100 text-green-600"
    : item.status === "canceled"
      ? "bg-red-100 text-red-600"
      : "bg-yellow-100 text-yellow-600"
}

`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="p-4 text-center">
                  <select
                    value={item.status}
                    onChange={(e) => updateStatus(item.id, e.target.value)}
                    className="
border
rounded-xl
p-2
"
                  >
                    <option>pending</option>

                    <option>inprogress</option>

                    <option>done</option>

                    <option>canceled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
