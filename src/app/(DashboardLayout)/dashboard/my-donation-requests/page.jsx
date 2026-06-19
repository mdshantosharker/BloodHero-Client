"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Eye,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Filter,
  HeartPulse,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { getAllRequest } from "@/lib/api/donor/server";
import { deleteMyRequests, doneRequest } from "@/lib/api/donor/action";
import { toast } from "@heroui/react";

export default function MyDonationRequestsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [filter, setFilter] = useState("all");
  const [requestList, setRequestList] = useState([]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);

  const fetchRequests = async () => {
    if (!user?.email) return;
    try {
      const data = await getAllRequest(user.email);
      setRequestList(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load donation requests.");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user?.email]);

  const filteredRequests =
    filter === "all"
      ? requestList
      : requestList.filter((item) => item.status === filter);

  const openDeleteModal = (item) => {
    setRequestToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!requestToDelete) return;

    toast.promise(deleteMyRequests(requestToDelete._id), {
      loading: "Deleting request...",
      success: () => {
        setIsDeleteModalOpen(false);
        setRequestToDelete(null);
        fetchRequests();
        return `Successfully deleted request for ${requestToDelete.recipientName}!`;
      },
      error: "Failed to delete request. Try again.",
    });
  };

  const openCancelModal = (item) => {
    setRequestToCancel(item);
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!requestToCancel) return;

    toast.promise(doneRequest({ status: "canceled" }, requestToCancel._id), {
      loading: "Canceling request...",
      success: () => {
        setIsCancelModalOpen(false);
        setRequestToCancel(null);
        fetchRequests();
        return `Successfully canceled request for ${requestToCancel.recipientName}!`;
      },
      error: "Failed to cancel request. Try again.",
    });
  };

  const handleMarkAsDone = async (id) => {
    try {
      const res = await doneRequest({ status: "done" }, id);
      console.log(res);
      toast.success("Request successfully marked as Done! 🎉");

      setRequestList((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "done" } : item,
        ),
      );
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="space-y-8 relative pb-10">
      <div className="bg-linear-to-r from-red-600 via-red-500 to-orange-500 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
          <HeartPulse size={250} />
        </div>
        <div className="flex gap-5 items-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner shrink-0">
            <HeartPulse size={35} className="animate-pulse text-white" />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              My Donation Requests 🩸
            </h1>
            <p className="text-red-50 text-sm md:text-base mt-1 font-medium opacity-90">
              Donor Dashboard • Track, manage and control your blood requests.
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
        {filteredRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-237.5 w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200/60 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 pl-6 w-16 text-center">SL</th>
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Blood Group</th>
                  <th className="p-4">Status & Control</th>
                  <th className="p-4 text-center pr-6">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                {filteredRequests.map((item, index) => (
                  <tr
                    key={item._id}
                    className="hover:bg-red-50/30 transition-colors duration-200"
                  >
                    <td className="p-4 pl-6 text-center font-bold text-gray-400">
                      {index + 1}
                    </td>

                    <td className="p-4 font-bold text-gray-900 text-base">
                      {item.recipientName}
                    </td>

                    <td className="p-4 text-gray-600 max-w-xs">
                      <div className="flex gap-1.5 items-start">
                        <MapPin
                          size={15}
                          className="text-red-400 shrink-0 mt-0.5"
                        />
                        <span className="truncate capitalize font-medium text-gray-700">
                          {item?.address}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-gray-600">
                      <div className="flex items-center gap-1.5 font-medium text-gray-700">
                        <Clock size={14} className="text-gray-400" />
                        <span>{item.donationTime}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="bg-red-50 text-red-600 px-3.5 py-1.5 rounded-xl font-black text-xs tracking-wider border border-red-100 shadow-2xs">
                        {item.bloodGroup}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-2 items-start">
                        <span
                          className={`px-3 py-1 rounded-full capitalize text-xs font-bold border ${
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
                          <div className="flex gap-1.5 mt-0.5 animate-fade-in">
                            <button
                              onClick={() => handleMarkAsDone(item._id)}
                              className="flex items-center gap-1 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg transition-all shadow-xs font-semibold cursor-pointer"
                            >
                              <CheckCircle size={12} /> Done
                            </button>
                            <button
                              onClick={() => openCancelModal(item)}
                              className="flex items-center gap-1 text-[11px] bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded-lg transition-all shadow-xs font-semibold cursor-pointer"
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

                        {item.status === "pending" ? (
                          <Link
                            href={`/dashboard/donor/edit/${item._id}`}
                            className="p-2 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 hover:scale-105 active:scale-95 transition-all border border-amber-100"
                            title="Edit Request"
                          >
                            <Edit size={16} />
                          </Link>
                        ) : (
                          <button
                            disabled
                            title="Only pending requests can be edited"
                            className="p-2 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed opacity-40 border border-gray-100"
                          >
                            <Edit size={16} />
                          </button>
                        )}

                        {item.status === "pending" ||
                        item.status === "inprogress" ? (
                          <button
                            onClick={() => openDeleteModal(item)}
                            className="p-2 cursor-pointer rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 active:scale-95 transition-all border border-red-100"
                            title="Delete Request"
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <button
                            disabled
                            title="Completed or canceled requests cannot be deleted"
                            className="p-2 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed opacity-40 border border-gray-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 bg-gray-50/30 flex flex-col items-center justify-center gap-2">
            <AlertTriangle
              size={36}
              className="text-amber-400 animate-bounce"
            />
            <span className="font-bold text-gray-700 text-base mt-2">
              No {filter === "all" ? "" : filter} Donation Request Found
            </span>
            <span className="text-xs text-gray-400 max-w-xs">
              {filter === "all"
                ? "You haven't submitted any blood requests yet."
                : `Currently there are no blood donation requests marked as "${filter}".`}
            </span>
          </div>
        )}
      </div>

      {isDeleteModalOpen && requestToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border shadow-2xl space-y-6 transform scale-100 transition duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl shrink-0 border border-red-100">
                <Trash2 size={26} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  Delete Donation Request?
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Are you sure you want to delete this request permanently? This
                  action cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-sm space-y-3 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Recipient:</span>
                <span className="font-bold text-gray-900">
                  {requestToDelete.recipientName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Blood Group:</span>
                <span className="bg-red-100 text-red-600 px-3 py-0.5 rounded-full font-black text-xs">
                  {requestToDelete.bloodGroup}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-1">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setRequestToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer text-sm"
              >
                Close
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 active:bg-red-700 transition shadow-md shadow-red-500/20 cursor-pointer text-sm"
              >
                Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {isCancelModalOpen && requestToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border shadow-2xl space-y-6 transform scale-100 transition duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl shrink-0 border border-orange-100">
                <AlertTriangle size={26} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  Cancel Donation Request?
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Are you sure you want to cancel this request? This will update
                  the status to "canceled" without removing it.
                </p>
              </div>
            </div>

            <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-100 text-sm space-y-3 shadow-inner">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Recipient:</span>
                <span className="font-bold text-gray-900">
                  {requestToCancel.recipientName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Blood Group:</span>
                <span className="bg-orange-100 text-orange-600 px-3 py-0.5 rounded-full font-black text-xs">
                  {requestToCancel.bloodGroup}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-1">
              <button
                onClick={() => {
                  setIsCancelModalOpen(false);
                  setRequestToCancel(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer text-sm"
              >
                Close
              </button>
              <button
                onClick={handleCancelConfirm}
                className="px-5 py-2.5 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 active:bg-orange-700 transition shadow-md shadow-orange-500/20 cursor-pointer text-sm"
              >
                Yes, Cancel Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
