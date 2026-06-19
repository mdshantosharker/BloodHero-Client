"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  MapPin,
  Clock,
  Calendar,
  Eye,
  AlertTriangle,
  Loader2,
  ChevronDown,
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

  const handleViewDetails = (requestId) => {
    if (!session?.user) {
      toast.error("Please login first to view details!");
      router.push("/login");
    }
  };

  const handleViewMore = () => {
    setVisibleCount(requests.length);
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-gray-50/50">
        <div className="relative flex items-center justify-center">
          <Loader2 className="animate-spin text-red-500 absolute" size={50} />
          <HeartPulse size={24} className="text-red-500 animate-pulse" />
        </div>
        <p className="text-gray-500 font-semibold text-sm tracking-wide">
          Fetching urgent blood requests...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="bg-linear-to-br from-red-600 via-red-500 to-orange-500 rounded-[2rem] p-8 md:p-12 text-white shadow-xl shadow-red-500/10 relative overflow-hidden border border-red-500/20">
        <div className="absolute right-0 bottom-0 opacity-15 translate-x-6 translate-y-6 pointer-events-none transition-transform duration-700 group-hover:scale-110">
          <HeartPulse size={320} />
        </div>
        <div className="max-w-2xl relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xl px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-white/10">
            <span className="w-2 h-2 rounded-full bg-red-200 animate-ping" />
            Live Requests
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
            Active Blood <br className="hidden sm:inline" />
            Donation Requests 🩸
          </h1>
          <p className="text-red-50/90 text-sm md:text-base font-medium leading-relaxed max-w-xl">
            Every drop is a heartbeat for someone in need. Review the urgent
            requirements below and step forward to save a life today.
          </p>
        </div>
      </div>

      {requests.length > 0 ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {requests.slice(0, visibleCount).map((item) => (
              <div
                key={item._id}
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
                            {item.donationTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Link href={`/donation-requests/${item._id}`}>
                  <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between gap-4">
                    <button
                      onClick={() => handleViewDetails(item._id)}
                      className="w-full bg-gray-900 group-hover:bg-red-500 text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-gray-900/5 group-hover:shadow-red-500/20"
                    >
                      <Eye
                        size={16}
                        className="group-hover:scale-110 transition-transform duration-300"
                      />
                      View Requirement
                    </button>
                  </div>
                </Link>
              </div>
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
        </div>
      ) : (
        <div className="text-center py-24 text-gray-400 bg-white rounded-[2rem] border border-dashed border-gray-200 shadow-xs flex flex-col items-center justify-center gap-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
            <AlertTriangle className="text-amber-500" size={28} />
          </div>
          <div className="space-y-1 px-6">
            <span className="font-bold text-gray-800 text-lg block">
              All Caught Up!
            </span>
            <span className="text-sm text-gray-400 block max-w-xs mx-auto">
              Right now, there are no urgent active or pending blood donation
              requests available.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
