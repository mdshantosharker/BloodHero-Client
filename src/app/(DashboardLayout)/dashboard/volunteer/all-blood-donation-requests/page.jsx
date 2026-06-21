"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Clock,
  MapPin,
  Filter,
  HeartPulse,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mail,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { doneRequest } from "@/lib/api/donor/action";
import { toast } from "@heroui/react";
import { getDonations } from "@/lib/api/users/allUsers";

export default function VolunteerBloodDonationRequestsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [filter, setFilter] = useState("all");
  const [requests, setRequests] = useState([]);

  const fetchAllRequests = async () => {
    try {
      const data = await getDonations();
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("Failed to fetch donation requests.");
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((item) => item.status === filter);

  const handleMarkAsDone = async (id, recipientName) => {
    try {
      const res = await doneRequest({ status: "done" }, id);

      toast.success(
        `${recipientName}'s request successfully marked as Done! 🎉`,
      );

      setRequests((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "done" } : item,
        ),
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleMarkAsCanceled = async (id, recipientName) => {
    try {
      const res = await doneRequest({ status: "canceled" }, id);

      toast.success(`${recipientName}'s request successfully Canceled! ❌`);

      setRequests((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "canceled" } : item,
        ),
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to cancel request.");
    }
  };

  return (
    <div className="space-y-8 relative pb-10">
      <div className="bg-linear-to-r from-red-800 via-red-700 to-orange-700 rounded-3xl p-10 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
          <HeartPulse size={250} />
        </div>
        <div className="flex gap-5 items-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner shrink-0">
            <HeartPulse size={35} className="animate-pulse text-white" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              All Blood Donation Requests 🩸
            </h1>
            <p className="text-red-50 text-sm md:text-base mt-1 font-medium opacity-90">
              Volunteer Dashboard • Full access to monitor, filter, and update
              request status.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xs border p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2.5 text-gray-800 font-bold px-1 text-sm md:text-base">
          <Filter className="text-red-500" size={18} />
          <span>Filter Requests:</span>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          {["all", "pending", "inprogress", "done", "canceled"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-4 py-2 rounded-xl capitalize font-semibold text-xs md:text-sm transition-all duration-200 cursor-pointer ${
                filter === item
                  ? "bg-red-500 text-white shadow-sm shadow-red-500/30"
                  : "text-gray-600 hover:text-red-500 hover:bg-red-50/50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-237.5 w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200/60 text-gray-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 pl-6 w-16 text-center text-xl">SL</th>
                <th className="p-4 text-xl">Recipient Info</th>
                <th className="p-4 text-xl">Location (Address)</th>
                <th className="p-4 text-xl">Date & Time</th>
                <th className="p-4 text-xl">Blood Group</th>
                <th className="p-4 text-xl">Status & Control</th>
                <th className="p-4 text-xl text-center pr-6">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100  text-gray-700 text-sm">
              {filteredRequests.map((item, index) => (
                <tr
                  key={item._id}
                  className="hover:bg-red-50/30 transition-colors duration-200"
                >
                  <td className="p-4 pl-6 text-center font-bold text-gray-400">
                    {index + 1}
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col  gap-0.5">
                      <span className="font-bold text-gray-900 text-base">
                        {item.recipientName}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                        <Mail size={12} className="shrink-0 text-gray-400" />
                        {item?.requesterEmail || "no-email@system.com"}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-gray-600 max-w-xs">
                    <div className="flex gap-1.5 items-start">
                      <MapPin
                        size={15}
                        className="text-red-400 shrink-0 mt-0.5"
                      />
                      <span className="truncate capitalize font-medium text-gray-700">
                        {item.recipientUpazila
                          ? `${item.recipientUpazila}, `
                          : ""}
                        {item.recipientDistrict || item.address}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 text-gray-600">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <Clock size={14} className="text-gray-400" />
                        <span>{item.donationDate || "Today"}</span>
                      </div>
                      <span className="text-xs text-gray-400 pl-5 font-medium">
                        Time: {item.donationTime}
                      </span>
                    </div>
                  </td>

                  <td className="p-4 ">
                    <span className="bg-red-50 flex flex-col justify-center items-center text-red-600 px-3.5 py-1.5 rounded-xl font-black text-xs tracking-wider border border-red-100 shadow-2xs">
                      {item.bloodGroup}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col gap-2 items-center">
                      <span
                        className={`px-3 py-1  rounded-full capitalize text-xs font-bold border ${
                          item.status === "pending"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : item.status === "inprogress"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : item.status === "done"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        • {item.status}
                      </span>

                      {item.status === "inprogress" && (
                        <div className="flex  gap-1.5 mt-0.5 animate-fade-in">
                          <button
                            onClick={() =>
                              handleMarkAsDone(item._id, item.recipientName)
                            }
                            className="flex items-center gap-1 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg transition-all shadow-xs font-semibold cursor-pointer"
                          >
                            <CheckCircle size={12} /> Done
                          </button>

                          <button
                            onClick={() =>
                              handleMarkAsCanceled(item._id, item.recipientName)
                            }
                            className="flex items-center gap-1 text-[11px] bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg transition-all shadow-xs font-semibold cursor-pointer"
                          >
                            <XCircle size={12} /> Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-center pr-6">
                    <div className="flex gap-2 justify-center">
                      <Link
                        href={`/donation-requests/${item._id}`}
                        className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 active:scale-95 transition-all border border-blue-100"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-16 text-gray-400 bg-gray-50/30 flex flex-col items-center justify-center gap-2">
            <AlertTriangle
              className="text-amber-400 animate-bounce"
              size={36}
            />
            <span className="font-bold text-gray-700 text-base">
              No Blood Donation Requests Found
            </span>
            <span className="text-xs text-gray-400">
              Try changing your filters.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
