"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Trash2,
  Clock,
  MapPin,
  Filter,
  HeartPulse,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { doneRequest } from "@/lib/api/donor/action";
import { toast } from "@heroui/react";
import { getDonations2 } from "@/lib/api/users/allUsers";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AllBloodDonationRequestsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;

  const { data: session } = useSession();
  const user = session?.user;

  const [filter, setFilter] = useState("all");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);

  const fetchAllRequests = async () => {
    setLoading(true);
    try {
      const response = await getDonations2(page);

      if (response && response.data) {
        setRequests(response.data || []);
        setTotalPages(response.totalPage || 1);
      } else {
        setRequests(response || []);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("Failed to fetch donation requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((item) => item.status === filter);

  const openCancelModal = (item) => {
    setRequestToCancel(item);
    setIsModalOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!requestToCancel) return;

    toast.promise(doneRequest({ status: "canceled" }, requestToCancel._id), {
      loading: "Canceling request...",
      success: () => {
        setIsModalOpen(false);
        setRequestToCancel(null);
        fetchAllRequests();
        return `Successfully canceled request for ${requestToCancel.recipientName}!`;
      },
      error: "Failed to cancel request. Try again.",
    });
  };

  const handleMarkAsDone = async (id) => {
    try {
      await doneRequest({ status: "done" }, id);
      toast.success("Request successfully marked as Done! 🎉");

      setRequests((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: "done" } : item,
        ),
      );
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative flex items-center justify-center">
          <div className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-red-400 opacity-75"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500 relative z-10"></div>
        </div>
        <span className="font-bold text-gray-600 text-sm tracking-wide animate-pulse">
          Loading Blood Donation Requests Directory...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative pb-10 max-w-7xl mx-auto px-4 md:px-6">
      <div className="bg-linear-to-r from-red-900 via-red-800 to-orange-700 rounded-3xl p-10 md:p-8 text-white shadow-xl relative overflow-hidden">
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
              Admin Dashboard • Full global access to manage, monitor, and
              process all user blood requests.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xs border p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2.5 text-gray-800 font-bold px-1 text-sm md:text-base">
          <Filter className="text-red-500" size={18} />
          <span>Filter Requests ({filteredRequests.length}):</span>
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
                <th className="p-4 pl-6 w-16 text-center">SL</th>
                <th className="p-4">Recipient Info</th>
                <th className="p-4">Location (Address)</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Status & Control</th>
                <th className="p-4 text-center pr-6">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
              <AnimatePresence mode="popLayout">
                {filteredRequests.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    key="empty-state"
                  >
                    <td colSpan="7" className="p-12 text-center">
                      <div className="text-center py-4 text-gray-400 bg-transparent flex flex-col items-center justify-center gap-2">
                        <AlertTriangle
                          size={36}
                          className="text-amber-400 animate-bounce"
                        />
                        <span className="font-bold text-gray-700 text-base">
                          No Blood Donation Requests Found
                        </span>
                        <span className="text-xs text-gray-400">
                          Try changing your filters or add new requests
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredRequests.map((item, index) => {
                    const itemsPerPage = 10;
                    const serialNumber =
                      (page - 1) * itemsPerPage + (index + 1);

                    return (
                      <motion.tr
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="hover:bg-red-50/30 transition-colors duration-150"
                      >
                        <td className="p-4 pl-6 text-center font-bold text-gray-400">
                          {serialNumber}
                        </td>

                        <td className="p-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-bold text-gray-900 text-base">
                              {item.recipientName}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                              <Mail
                                size={12}
                                className="shrink-0 text-gray-400"
                              />
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

                        <td className="p-4">
                          <span className="bg-red-50 text-red-600 px-3.5 py-1.5 rounded-xl font-black text-xs tracking-wider border border-red-100 shadow-2xs">
                            {item.bloodGroup}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-col gap-2 items-start ml-4">
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

                            {item.status === "pending" ||
                            item.status === "inprogress" ? (
                              <button
                                onClick={() => openCancelModal(item)}
                                className="p-2 cursor-pointer rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 active:scale-95 transition-all border border-red-100"
                                title="Cancel Request"
                              >
                                <Trash2 size={16} />
                              </button>
                            ) : (
                              <button
                                disabled
                                title="Completed or canceled requests cannot be changed"
                                className="p-2 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed opacity-40 border border-gray-100"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
            <p className="text-xs font-semibold text-gray-500">
              Showing page{" "}
              <span className="text-gray-800 font-bold">{page}</span> of{" "}
              <span className="text-gray-800 font-bold">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-2xs">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-200/60 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`w-9 h-9 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer ${
                    page === num
                      ? "bg-linear-to-r from-red-600 to-rose-500 text-white shadow-md shadow-red-500/20 font-extrabold"
                      : "text-gray-600 hover:bg-gray-100 bg-transparent"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-200/60 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && requestToCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border shadow-2xl space-y-6"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="p-3 bg-red-50 rounded-full text-red-500 border border-red-100">
                  <AlertTriangle size={30} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Cancel Request
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to cancel the blood donation request for{" "}
                  <span className="font-semibold text-gray-800">
                    {requestToCancel.recipientName}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  No, Keep
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md shadow-red-600/20 cursor-pointer"
                >
                  Yes, Cancel Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
