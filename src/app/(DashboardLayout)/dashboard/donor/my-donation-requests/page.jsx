"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// [ADD] Toast imported

import {
  Eye,
  Edit,
  Trash2,
  Clock,
  MapPin,
  Filter,
  HeartPulse,
  AlertTriangle, // [ADD] Icon for modal
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { getAllRequest } from "@/lib/api/donor/server";
import { deleteMyRequests } from "@/lib/api/donor/action";
import { toast } from "@heroui/react";

export default function MyDonationRequestsPage() {
  const { data: session } = useSession();
  const user = session?.user;

  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [request, setRequest] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState(null);

  const fetchRequests = async () => {
    if (!user?.email) return;
    const data = await getAllRequest(user.email);
    setRequest(data);
  };

  useEffect(() => {
    fetchRequests();
  }, [user?.email]);

  const requests = request;

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((item) => item.status === filter);

  const perPage = 3;

  const totalPage = Math.ceil(filteredRequests.length / perPage);

  const currentData = filteredRequests.slice(
    (page - 1) * perPage,
    page * perPage,
  );

  const openDeleteModal = (item) => {
    setRequestToDelete(item);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!requestToDelete) return;

    toast.promise(deleteMyRequests(requestToDelete._id), {
      loading: "Deleting request...",
      success: () => {
        setIsModalOpen(false);
        setRequestToDelete(null);
        fetchRequests();
        return `Successfully deleted request for ${requestToDelete.recipientName}!`;
      },
      error: "Failed to delete request. Try again.",
    });
  };

  return (
    <div className="space-y-8 relative">
      <div className="bg-linear-to-r from-red-500 to-red-600 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <HeartPulse size={35} />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              My Donation Requests 🩸
            </h1>

            <p className="text-red-100">Manage all your blood requests</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border p-5 flex flex-wrap gap-3 items-center">
        <Filter className="text-red-500" />

        {["all", "pending", "inprogress", "done", "canceled"].map((item) => (
          <button
            key={item}
            onClick={() => {
              setFilter(item);
              setPage(1);
            }}
            className={`px-5 py-2 rounded-full capitalize transition ${
              filter === item
                ? "bg-red-500 text-white"
                : "bg-red-50 text-red-600"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-lg border p-5">
        <div className="overflow-x-auto">
          <table className="min-w-237.5 w-full">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="p-3">Recipient</th>
                <th className="p-3">Location</th>
                <th className="p-3">Date</th>
                <th className="p-3">Blood</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {currentData.map((item) => (
                <tr
                  key={item._id}
                  className="border-b hover:bg-red-50 transition"
                >
                  <td className="p-3 font-semibold">{item.recipientName}</td>

                  <td className="p-3">
                    <div className="flex gap-1 items-center">
                      <MapPin size={15} />

                      {item?.address}
                    </div>
                  </td>

                  <td className="p-3">
                    <div className="text-sm">
                      <div className="flex items-center gap-1">
                        <Clock size={14} />

                        {item.donationTime}
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">
                      {item.bloodGroup}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full capitalize text-sm ${
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
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/donor/view/${item._id}`}
                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                      >
                        <Eye size={17} />
                      </Link>

                      {item.status === "pending" ? (
                        <Link
                          href={`/dashboard/donor/edit/${item._id}`}
                          className="p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition"
                        >
                          <Edit size={17} />
                        </Link>
                      ) : (
                        <button
                          disabled
                          title="Only pending requests can be edited"
                          className="p-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                        >
                          <Edit size={17} />
                        </button>
                      )}

                      {item.status === "pending" ? (
                        <button
                          onClick={() => openDeleteModal(item)}
                          className="p-2 cursor-pointer rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                        >
                          <Trash2 size={17} />
                        </button>
                      ) : (
                        <button
                          disabled
                          title="Only pending requests can be deleted"
                          className="p-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentData.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            No Donation Request Found
          </div>
        )}

        {totalPage > 1 && (
          <div className="flex justify-center gap-3 mt-6">
            {Array.from({ length: totalPage }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-full ${
                  page === i + 1
                    ? "bg-red-500 text-white"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && requestToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border shadow-2xl space-y-6 transform scale-100 transition duration-300">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl shrink-0">
                <AlertTriangle size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900">
                  Delete Donation Request?
                </h3>
                <p className="text-gray-500 text-sm">
                  Are you sure you want to delete this request? This action
                  cannot be undone.
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
              <div className="flex justify-between">
                <span className="text-gray-500">Location:</span>
                <span className="text-gray-700 font-medium line-clamp-1">
                  {requestToDelete.address}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setRequestToDelete(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 active:bg-red-700 transition shadow-md shadow-red-500/20 cursor-pointer text-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
