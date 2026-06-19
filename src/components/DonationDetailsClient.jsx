"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  MapPin,
  Clock,
  Calendar,
  User,
  Mail,
  Phone,
  Droplet,
  Building,
  FileText,
  Loader2,
  X,
  CheckCircle,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { toast } from "@heroui/react";
import { doneRequest, inProgress } from "@/lib/api/donor/action";

export default function DonationDetailsClient({ initialData, requestId }) {
  const { data: session, isPending: authLoading } = useSession();
  const router = useRouter();

  const [request, setRequest] = useState(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !session?.user) {
      toast.error("Please login first to view request details! 🔒");
      router.push("/login");
    }
  }, [session, authLoading, router]);

  const handleConfirmDonation = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      await doneRequest({ status: "inprogress" }, requestId);

      toast.success("Thank you! You have accepted this blood request. 🎉");
      setIsModalOpen(false);

      setRequest((prev) => ({ ...prev, status: "inprogress" }));
    } catch (error) {
      console.error("Error updating donation status:", error);
      toast.error("Failed to confirm donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-red-500" size={40} />
        <p className="text-gray-500 font-medium">Verifying authorization...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-sm font-bold text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <span
          className={`px-4 py-1.5 rounded-full capitalize text-xs font-black border ${
            request.status === "pending"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-blue-50 text-blue-700 border-blue-200"
          }`}
        >
          • Status: {request.status}
        </span>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-gray-200/40 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100 shrink-0 shadow-xs">
              <User size={30} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">
                Patient Name
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 capitalize mt-0.5">
                {request.recipientName}
              </h1>
            </div>
          </div>

          <div className="bg-linear-to-br from-red-600 to-red-500 text-white font-black text-2xl px-6 py-4 rounded-2xl shadow-md shadow-red-500/20 tracking-wider">
            {request.bloodGroup}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Schedule & Venue
            </h3>
            <div className="bg-gray-50/70 rounded-2xl p-5 border border-gray-100/50 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Required Date
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {request.donationDate || "Today"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Donation Time
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {request.donationTime}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Hospital Name
                  </p>
                  <p className="text-sm font-bold text-gray-800 capitalize">
                    {request?.hospital || "Not Specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Location & Contact
            </h3>
            <div className="bg-gray-50/70 rounded-2xl p-5 border border-gray-100/50 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Full Address
                  </p>
                  <p className="text-sm font-bold text-gray-800 capitalize">
                    {request.recipientUpazila
                      ? `${request.recipientUpazila}, `
                      : ""}
                    {request.recipientDistrict || request.address}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Contact Number
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {request.recipientPhoneNumber || "Provided on accept"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-red-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    Requester Email
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {request.requesterEmail || "no-email@system.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {request.medicalReason && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Medical Reason
            </h3>
            <div className="bg-red-50/10 border border-red-100/50 rounded-2xl p-5 flex gap-3">
              <FileText className="text-red-400 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                {request.medicalReason}
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 text-center">
          {request.status === "pending" ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2.5 bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-xl font-black text-base shadow-lg shadow-red-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <Droplet size={20} className="animate-pulse" />I Want to Donate ❤️
            </button>
          ) : (
            <div className="bg-gray-100 text-gray-500 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm border border-gray-200">
              <CheckCircle size={16} /> This request is currently{" "}
              {request.status}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity duration-300"
          />

          <div className="bg-white rounded-[2rem] w-full max-w-md p-6 relative z-10 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-red-500">
                <HeartPulse size={22} className="animate-pulse" />
                <h3 className="font-black text-lg text-gray-900">
                  Confirm Match
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleConfirmDonation} className="space-y-5 pt-5">
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Review your profile details below. Confirming will instantly
                shift this application status from{" "}
                <span className="text-amber-600 font-bold">pending</span> to{" "}
                <span className="text-blue-600 font-bold">inprogress</span>.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Donor Name
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={session?.user?.name || "Anonymous Donor"}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-gray-600 focus:outline-hidden cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Donor Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 text-gray-400" size={16} />
                  <input
                    type="email"
                    value={session?.user?.email || ""}
                    readOnly
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm font-semibold text-gray-600 focus:outline-hidden cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold text-sm border border-gray-200 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 bg-red-500 hover:bg-red-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-red-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Confirm Match
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
