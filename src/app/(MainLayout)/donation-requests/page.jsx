"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HeartPulse,
  MapPin,
  Clock,
  Calendar,
  Eye,
  ChevronDown,
  Inbox,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { toast } from "@heroui/react";
import { getDonations } from "@/lib/api/users/allUsers";
import Link from "next/link";

export default function PublicBloodDonationRequestsPage() {
  const { data: session, isPending: authLoading } = useSession();
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const data = await getDonations();

      const pendingData = (data || []).filter(
        (item) => item.status === "pending",
      );
      setRequests(pendingData);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("Failed to fetch blood donation requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleViewMore = () => {
    setVisibleCount(requests.length);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-slate-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex items-center justify-center z-10">
          <div className="w-14 h-14 border-4 border-red-500 border-t-transparent rounded-full animate-spin absolute" />
          <HeartPulse size={24} className="text-red-500 animate-pulse" />
        </div>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest z-10 mt-2">
          Scanning urgent requirements...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 select-none relative overflow-hidden">
      <div className="absolute top-0 right-0 w-125 h-125 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-linear-to-br from-rose-700 via-red-900 to-slate-950 rounded-[2rem] p-8 md:p-12 text-white shadow-xl shadow-red-500/10 relative overflow-hidden border border-red-500/10"
        >
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-6 translate-y-6 pointer-events-none">
            <HeartPulse size={340} />
          </div>
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xl px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-white/10 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-red-200 animate-ping" />
              Live Feed
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Active Blood <br className="hidden sm:inline" />
              Donation Requests 🩸
            </h1>
            <p className="text-red-50/90 text-sm md:text-base font-medium leading-relaxed max-w-xl">
              Every drop is a heartbeat for someone in need. Review the urgent
              Requirements below and step forward to save a life today.
            </p>
          </div>
        </motion.div>

        <div className="relative min-h-75">
          <AnimatePresence mode="wait">
            {requests.length > 0 ? (
              <motion.div
                key="results-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {requests.slice(0, visibleCount).map((item, idx) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-2xl hover:shadow-red-500/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative group"
                    >
                      <div className="absolute top-6 right-6 z-10">
                        <span className="bg-red-50 text-red-600 font-black text-sm tracking-wider px-4 py-2.5 rounded-2xl border border-red-100 flex items-center justify-center min-w-14 shadow-sm group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 group-hover:scale-110 transition-all duration-300">
                          {item.bloodGroup}
                        </span>
                      </div>

                      <div className="space-y-5">
                        <div className="pr-16">
                          <span className="text-[10px] font-bold text-red-500/80 tracking-widest uppercase block mb-1">
                            Urgent Recipient
                          </span>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-1 capitalize">
                            {item.recipientName}
                          </h3>
                        </div>

                        <div className="bg-gray-50/70 group-hover:bg-red-50/20 rounded-2xl p-4 space-y-3.5 border border-gray-100/50 group-hover:border-red-100/30 transition-all duration-300">
                          <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-white rounded-lg shadow-xs border border-gray-100 text-red-500">
                              <MapPin size={15} />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                Location
                              </span>
                              <span className="text-sm font-semibold text-gray-700 line-clamp-1 capitalize">
                                {item.recipientUpazila
                                  ? `${item.recipientUpazila}, `
                                  : ""}
                                {item.recipientDistrict || item.address}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-start gap-2.5">
                              <div className="p-1.5 bg-white rounded-lg shadow-xs border border-gray-100 text-gray-400">
                                <Calendar size={14} />
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                  Required Date
                                </span>
                                <span className="text-xs font-bold text-gray-700">
                                  {item.donationDate || "Today"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                              <div className="p-1.5 bg-white rounded-lg shadow-xs border border-gray-100 text-gray-400">
                                <Clock size={14} />
                              </div>
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                  Schedule
                                </span>
                                <span className="text-xs font-bold text-gray-700">
                                  {item.donationTime || "N/A"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Link href={`/donation-requests/${item._id}`}>
                        <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between gap-4">
                          <button className="w-full bg-gray-900 group-hover:bg-red-500 text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-gray-900/5 group-hover:shadow-red-500/20">
                            <Eye
                              size={16}
                              className="group-hover:scale-110 transition-transform duration-300"
                            />
                            View Requirement
                          </button>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {requests.length > visibleCount && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={handleViewMore}
                      className="inline-flex items-center gap-2 bg-white hover:bg-red-50 text-gray-800 hover:text-red-600 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 border border-gray-200 hover:border-red-200 cursor-pointer shadow-xs hover:shadow-md"
                    >
                      View More Requests ({requests.length - visibleCount} left)
                      <ChevronDown size={16} className="animate-bounce" />
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 bg-linear-to-b from-white to-slate-50/50 rounded-[32px] border border-slate-200 p-8 shadow-sm relative overflow-hidden max-w-xl mx-auto"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-500/5 rounded-full blur-2xl animate-pulse" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100/50 shadow-inner">
                    <Inbox size={28} className="animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    All Caught Up!
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                    Right now, there are no urgent active or pending blood
                    donation requests available in the database.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
