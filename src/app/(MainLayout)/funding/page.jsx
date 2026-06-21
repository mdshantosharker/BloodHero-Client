"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Mail,
  DollarSign,
  X,
  HeartHandshake,
  Calendar,
  Layers,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { paymentsHistory } from "@/lib/api/payments/history";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function FundingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;

  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalContributions, setTotalContributions] = useState(0);

  const { data: session } = useSession();
  const user = session?.user;
  const ownerEmail = user?.email;

  useEffect(() => {
    const historyData = async () => {
      setLoading(true);
      try {
        const res = await paymentsHistory(page);
        if (res && res.data) {
          setHistory(res.data);
          setTotalPages(res.totalPage || 1);
          setTotalContributions(res.totalData || 0);
        } else {
          setHistory(Array.isArray(res) ? res : []);
          setTotalPages(1);
          setTotalContributions(Array.isArray(res) ? res.length : 0);
        }
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    historyData();
  }, [page]);

  const totalDonationsAmount = history.reduce(
    (acc, item) => acc + (item.amount || 0),
    0,
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleAmountChange = (val) => {
    setAmount(val);
    if (!val) {
      setError("");
    } else if (isNaN(val) || Number(val) < 100) {
      setError("Minimum donation amount is ৳100 BDT");
    } else {
      setError("");
    }
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) < 100) {
      setError("Minimum donation amount is ৳100 BDT");
      return;
    }

    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          email: ownerEmail,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setError("Failed to initiate payment. Check your connection.");
    }
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <div className="relative min-h-screen bg-slate-50 p-6 md:p-8 select-none">
      <div className="space-y-8 max-w-5xl mx-auto relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          className="bg-red-700 rounded-3xl p-8 md:p-12 text-white shadow-md border border-red-800"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-md">
              <h1 className="text-3xl font-extrabold flex items-center gap-2 tracking-tight">
                Support BloodHero{" "}
                <Heart size={28} className="fill-white text-white shrink-0" />
              </h1>
              <p className="text-red-100 text-sm leading-relaxed">
                Your small contribution keeps our servers alive, funds emergency
                blood requests, and helps us expand our volunteer reach. Let's
                save lives together!
              </p>
            </div>

            <div className="shrink-0 flex items-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto px-8 py-4 bg-white text-red-600 font-bold text-base rounded-2xl transition-all duration-200 hover:bg-gray-100 shadow-sm flex items-center justify-center gap-3 cursor-pointer"
              >
                <Wallet size={18} />
                <span className="tracking-wide uppercase text-sm">
                  Donate Now
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Total Fund Raised
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                ৳{totalDonationsAmount.toLocaleString()}
              </h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <DollarSign size={24} />
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Total Contributions
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {totalContributions} Times
              </h3>
            </div>
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
              <HeartHandshake size={24} />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
          className="bg-white rounded-3xl shadow-xs border border-gray-200 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Layers size={18} className="text-red-500" />
              <span>Recent Contributions</span>
            </h2>
            <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-xl flex items-center gap-1">
              Live History
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="p-4 pl-6 w-16 text-center">SL</th>
                  <th className="p-4">Donor Information</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right pr-6">Amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-gray-700 text-sm bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12">
                      <div className="flex justify-center items-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-500"></div>
                        <span className="text-gray-500 font-medium">
                          Loading contributions...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-16 text-gray-400 bg-gray-50/30"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <HeartHandshake size={40} className="text-gray-300" />
                        <span className="font-bold text-gray-700 text-base">
                          No Donations Yet
                        </span>
                        <span className="text-xs text-gray-400">
                          Be the first one to support our platform!
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  history.map((item, index) => {
                    const serialNumber = (page - 1) * 5 + (index + 1);

                    return (
                      <tr
                        key={item._id || index}
                        className="hover:bg-gray-50/50 transition-colors duration-150"
                      >
                        <td className="p-4 pl-6 text-center font-bold text-gray-400">
                          {serialNumber}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">
                              {item.name || "Generous Donor"}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Mail size={12} />
                              {item.email || "anonymous@bloodhero.com"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-600 font-medium">
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Calendar size={14} />
                            <span>
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl font-bold text-sm border border-emerald-100 inline-flex items-center">
                            + ৳{item.amount || 0}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {!loading && totalPages > 1 && (
            <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
              <p className="text-xs font-semibold text-gray-500">
                Showing page{" "}
                <span className="text-gray-800 font-bold">{page}</span> of{" "}
                <span className="text-gray-800 font-bold">{totalPages}</span>
              </p>

              <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-gray-200">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-200/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>

                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePageChange(num)}
                    className={`w-9 h-9 text-xs font-bold rounded-xl transition-all ${
                      page === num
                        ? "bg-red-600 text-white font-extrabold"
                        : "text-gray-600 hover:bg-gray-100 bg-transparent"
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-200/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setIsModalOpen(false);
                setError("");
                setAmount("");
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-200 relative z-10 shadow-lg space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">
                  Make a Donation
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setError("");
                    setAmount("");
                  }}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handlePaySubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase">
                    Amount (BDT)
                  </label>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder="Enter amount (Min 100)"
                    className="w-full border border-gray-200 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/10"
                  />
                  {error && (
                    <p className="text-xs font-semibold text-red-500 mt-1">
                      {error}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <DollarSign size={16} />
                  Proceed to Pay
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
