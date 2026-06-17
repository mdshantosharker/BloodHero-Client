"use client";

import { useState } from "react";
import {
  Droplets,
  MapPin,
  Calendar,
  Clock,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Filter,
  User,
} from "lucide-react";

import { toast } from "@heroui/react";

export default function AllBloodDonationRequest() {
  const [filter, setFilter] = useState("all");

  const [requests, setRequests] = useState([
    {
      id: 1,
      recipient: "Rahim Ahmed",
      district: "Dhaka",
      upazila: "Mirpur",
      date: "2026-06-20",
      time: "10:30 AM",
      blood: "A+",
      status: "pending",
      donor: null,
    },

    {
      id: 2,
      recipient: "Karim Hasan",
      district: "Gazipur",
      upazila: "Tongi",
      date: "2026-06-22",
      time: "09:00 AM",
      blood: "O+",
      status: "inprogress",
      donor: {
        name: "John",
        email: "john@gmail.com",
      },
    },

    {
      id: 3,
      recipient: "Sadia Islam",
      district: "Dhaka",
      upazila: "Uttara",
      date: "2026-06-15",
      time: "02:00 PM",
      blood: "B+",
      status: "done",
      donor: {
        name: "Alex",
        email: "alex@gmail.com",
      },
    },
  ]);

  const changeStatus = (id, status) => {
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item)),
    );

    toast.success(`Request ${status}`);
  };

  const filtered =
    filter === "all"
      ? requests
      : requests.filter((item) => item.status === filter);

  return (
    <div className="min-h-screen bg-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl border border-red-100 p-5 md:p-8">
        {/* Header */}

        <div className="flex flex-col md:flex-row justify-between gap-5 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-red-600 flex items-center gap-2">
              <Droplets />
              All Blood Donation Requests
            </h1>

            <p className="text-gray-500 mt-2">
              Manage all users donation requests
            </p>
          </div>

          <div className="flex items-center gap-3 bg-red-50 px-4 py-3 rounded-2xl">
            <Filter size={20} className="text-red-500" />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent outline-none font-semibold"
            >
              <option value="all">All</option>

              <option>pending</option>

              <option>inprogress</option>

              <option>done</option>

              <option>canceled</option>
            </select>
          </div>
        </div>

        {/* Table */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="text-left bg-red-50">
                <th className="p-4 rounded-l-xl">Recipient</th>

                <th>Location</th>

                <th>Date</th>

                <th>Blood</th>

                <th>Status</th>

                <th>Donor</th>

                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-red-50 transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <User size={18} />
                      </div>

                      <p className="font-semibold">{item.recipient}</p>
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      {item.district}, {item.upazila}
                    </div>
                  </td>

                  <td>
                    <div className="flex gap-2">
                      <Calendar size={16} />

                      {item.date}
                    </div>

                    <div className="flex gap-2 text-sm text-gray-500">
                      <Clock size={16} />

                      {item.time}
                    </div>
                  </td>

                  <td>
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 font-bold">
                      {item.blood}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold

${
  item.status === "pending"
    ? "bg-yellow-100 text-yellow-600"
    : item.status === "inprogress"
      ? "bg-blue-100 text-blue-600"
      : item.status === "done"
        ? "bg-green-100 text-green-600"
        : "bg-gray-100 text-gray-600"
}

`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td>
                    {item.donor ? (
                      <div>
                        <p className="font-semibold">{item.donor.name}</p>

                        <p className="text-sm text-gray-500">
                          {item.donor.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400">No donor</span>
                    )}
                  </td>

                  <td>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-xl bg-blue-50 text-blue-600">
                        <Eye size={18} />
                      </button>

                      <button className="p-2 rounded-xl bg-yellow-50 text-yellow-600">
                        <Edit size={18} />
                      </button>

                      <button
                        onClick={() => toast.success("Deleted")}
                        className="p-2 rounded-xl bg-red-50 text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>

                      {item.status === "inprogress" && (
                        <>
                          <button
                            onClick={() => changeStatus(item.id, "done")}
                            className="p-2 rounded-xl bg-green-50 text-green-600"
                          >
                            <CheckCircle size={18} />
                          </button>

                          <button
                            onClick={() => changeStatus(item.id, "canceled")}
                            className="p-2 rounded-xl bg-red-50 text-red-600"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
