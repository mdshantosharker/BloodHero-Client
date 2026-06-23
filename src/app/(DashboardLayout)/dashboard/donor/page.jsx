"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  Edit,
  Trash2,
  Clock,
  MapPin,
  HeartPulse,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PlusCircle,
  ArrowRight,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { getAllRequest2 } from "@/lib/api/donor/server";
import { deleteMyRequests, doneRequest } from "@/lib/api/donor/action";

import { toast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardHomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState(null);

  const fetchRequests = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const data = await getAllRequest2(user.email);
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to load donation requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [user?.email]);

  const recentRequests = requests.slice(-3).reverse();

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
      await doneRequest({ status: "done" }, id);
      toast.success("Request successfully marked as Done! 🎉");
      fetchRequests();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative flex items-center justify-center">
          <div className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-red-400 opacity-75"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500 relative z-10"></div>
        </div>
        <span className="font-bold text-gray-600 text-sm tracking-wide animate-pulse">
          Loading Dashboard Content...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative pb-10 max-w-7xl mx-auto px-4 md:px-6">
      <div className="bg-linear-to-r from-red-900 via-red-800 to-orange-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
          <HeartPulse size={250} />
        </div>
        <div className="flex gap-5 items-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner shrink-0 text-2xl">
            🏠
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              Welcome Back, {user?.name || "Donor"}! 👋
            </h1>
            <p className="text-red-50 text-sm md:text-base mt-1 font-medium opacity-90">
              Ready to save lives today? Monitor your activities here.
            </p>
          </div>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-16 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 shadow-inner animate-pulse">
            <HeartPulse size={40} />
          </div>
          <div className="space-y-2 max-w-sm">
            <h3 className="text-xl font-bold text-gray-800">
              No Donation Requests Yet
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              You haven't created any blood donation requests yet. If you or
              someone you know needs blood support, create a request now.
            </p>
          </div>
          <Link
            href="/dashboard/create-donation-request"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-500 text-white font-semibold hover:bg-red-600 active:scale-95 transition shadow-lg shadow-red-500/20 text-sm cursor-pointer"
          >
            <PlusCircle size={18} />
            Create Blood Request
          </Link>
        </div>
      ) : (
        recentRequests.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <HeartPulse className="text-red-500" size={22} />
                Recent Donation Requests
              </h2>
              <span className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-semibold">
                Showing max 3 requests
              </span>
            </div>

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-200 w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/70 border-b border-gray-200/60 text-gray-500 text-xs uppercase tracking-wider font-bold">
                      <th className="p-4 pl-6">Recipient</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4">Blood Group</th>
                      <th className="p-4">Status & Control</th>
                      <th className="p-4 text-center pr-6">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
                    <AnimatePresence mode="popLayout">
                      {recentRequests.map((item, index) => (
                        <motion.tr
                          key={item._id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          className="hover:bg-red-50/30 transition-colors duration-150"
                        >
                          <td className="p-4 pl-6 font-bold text-gray-900 text-base">
                            {item.recipientName}
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
                            <div className="flex items-center gap-1.5 font-medium text-gray-700">
                              <Clock size={14} className="text-gray-400" />
                              <span>
                                {item.donationDate || "Today"} |{" "}
                                {item.donationTime}
                              </span>
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
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex justify-center sm:justify-end">
                <Link
                  href="/dashboard/my-donation-requests"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 hover:text-red-600 font-bold text-xs md:text-sm border shadow-2xs transition-all active:scale-95 group cursor-pointer"
                >
                  View My All Request
                  <ArrowRight
                    size={16}
                    className="text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        )
      )}

      <AnimatePresence>
        {isDeleteModalOpen && requestToDelete && (
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
                  Delete Request
                </h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete the blood donation request for{" "}
                  <span className="font-semibold text-gray-800">
                    {requestToDelete.recipientName}
                  </span>
                  ? This process cannot be reverted.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  No, Keep It
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-md shadow-red-600/20 cursor-pointer"
                >
                  Yes, Delete Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCancelModalOpen && requestToCancel && (
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
                  ?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsCancelModalOpen(false)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  No, Keep Active
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-md shadow-red-500/20 cursor-pointer"
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
