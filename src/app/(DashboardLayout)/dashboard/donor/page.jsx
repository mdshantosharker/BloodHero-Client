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
  ArrowRight,
  PlusCircle,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { getAllRequest } from "@/lib/api/donor/server";
import { deleteMyRequests, doneRequest } from "@/lib/api/donor/action";

import { toast } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function DashboardHomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [requests, setRequests] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  const fetchRequests = async () => {
    if (!user?.email) return;
    const data = await getAllRequest(user.email);
    setRequests(data || []);
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

  const handleMarkAsDone = async (id) => {
    const res = await doneRequest(
      {
        status: "done",
      },
      id,
    );
    // console.log(res);
    router.refresh();
    toast.success("Request successfully marked as Done! 🎉");
  };

  return (
    <div className="space-y-8">
      <div className="bg-linear-to-r from-red-800 to-red-700 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
            🏠
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Welcome Back, {user?.name || "Donor"}! 👋
            </h1>
            <p className="text-red-100 mt-1">
              Ready to save lives today? Monitor your activities here.
            </p>
          </div>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-16 flex flex-col items-center text-center max-w-2xl mx-auto space-y-6 transform transition duration-300">
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

            <div className="bg-white rounded-3xl shadow-lg border p-5">
              <div className="overflow-x-auto">
                <table className="min-w-200 w-full">
                  <thead>
                    <tr className="border-b text-left text-gray-500 text-sm">
                      <th className="p-3">Recipient</th>
                      <th className="p-3">Location (Upazila, District)</th>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">Blood Group</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentRequests.map((item) => (
                      <tr
                        key={item._id}
                        className="border-b hover:bg-red-50/50 transition"
                      >
                        <td className="p-3 font-semibold text-gray-900">
                          {item.recipientName}
                        </td>

                        <td className="p-3">
                          <div className="flex gap-1 items-center text-gray-600 text-sm">
                            <MapPin size={15} className="text-gray-400" />
                            <span className="capitalize">
                              {item.recipientUpazila
                                ? `${item.recipientUpazila}, `
                                : ""}
                              {item.recipientDistrict || item.address}
                            </span>
                          </div>
                        </td>

                        <td className="p-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-gray-400" />
                            <span>
                              {item.donationDate || "Today"} |{" "}
                              {item.donationTime}
                            </span>
                          </div>
                        </td>

                        <td className="p-3">
                          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold text-sm">
                            {item.bloodGroup}
                          </span>
                        </td>

                        <td className="p-3">
                          <div className="flex flex-col gap-2 items-start">
                            <span
                              className={`px-3 py-0.5 rounded-full capitalize text-xs font-medium ${
                                item.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : item.status === "inprogress"
                                    ? "bg-blue-100 text-blue-700"
                                    : item.status === "done"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {item.status}
                            </span>

                            {item.status === "inprogress" && (
                              <div className="flex gap-1.5 mt-1">
                                <button
                                  onClick={() => handleMarkAsDone(item._id)}
                                  className="flex items-center gap-1 text-[11px] bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded-md transition cursor-pointer font-medium"
                                >
                                  <CheckCircle size={12} /> Done
                                </button>

                                <button
                                  onClick={() => openDeleteModal(item)}
                                  className="flex items-center gap-1 text-[11px] bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md transition cursor-pointer font-medium"
                                >
                                  <XCircle size={12} /> Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="p-3 text-center">
                          <div className="flex gap-2 justify-center">
                            <Link
                              href={`/donation-requests/${item._id}`}
                              className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                            >
                              <Eye size={16} />
                            </Link>

                            {item.status === "pending" ? (
                              <Link
                                href={`/dashboard/donor/edit/${item._id}`}
                                className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                              >
                                <Edit size={16} />
                              </Link>
                            ) : (
                              <button
                                disabled
                                title="Only pending requests can be edited"
                                className="p-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                              >
                                <Edit size={16} />
                              </button>
                            )}

                            {item.status === "pending" ||
                            item.status === "inprogress" ? (
                              <button
                                onClick={() => openDeleteModal(item)}
                                className="p-2 cursor-pointer rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                                title={
                                  item.status === "inprogress"
                                    ? "Cancel & Delete Request"
                                    : "Delete Request"
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            ) : (
                              <button
                                disabled
                                title="Completed requests cannot be deleted"
                                className="p-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
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

              <div className="mt-6 flex justify-center border-t pt-4">
                <Link
                  href="/dashboard/my-donation-requests"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 active:bg-red-200 transition text-sm group"
                >
                  View My All Requests
                  <ArrowRight
                    size={16}
                    className="transform group-hover:translate-x-1 transition"
                  />
                </Link>
              </div>
            </div>
          </div>
        )
      )}

      {isDeleteModalOpen && requestToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border shadow-2xl space-y-6 transform scale-100 transition duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl shrink-0">
                <AlertTriangle size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">
                  {requestToDelete.status === "inprogress"
                    ? "Cancel & Delete Request?"
                    : "Delete Donation Request?"}
                </h3>
                <p className="text-gray-500 text-sm">
                  Are you sure you want to{" "}
                  {requestToDelete.status === "inprogress"
                    ? "cancel and delete"
                    : "delete"}{" "}
                  this request? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Recipient Name:</span>
                <span className="font-semibold text-gray-900">
                  {requestToDelete.recipientName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Blood Group:</span>
                <span className="bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full font-bold text-xs">
                  {requestToDelete.bloodGroup}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setRequestToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer text-sm"
              >
                Close
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 active:bg-red-700 transition shadow-md shadow-red-500/20 cursor-pointer text-sm"
              >
                {requestToDelete.status === "inprogress"
                  ? "Yes, Cancel & Delete"
                  : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
