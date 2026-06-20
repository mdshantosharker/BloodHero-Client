"use client";

import React, { useEffect, useState } from "react";
import {
  Wallet,
  Mail,
  DollarSign,
  X,
  CheckCircle,
  AlertCircle,
  HeartHandshake,
  Calendar,
  Layers,
  Heart,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { paymentsHistory } from "@/lib/api/payments/history";

const FundingPage = () => {
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;
  const ownerEmail = user?.email;

  useEffect(() => {
    const historyData = async () => {
      const res = await paymentsHistory();
      setHistory(res || []);
    };
    historyData();
  }, []);

  const totalDonationsAmount = history.reduce(
    (acc, item) => acc + (item.amount || 0),
    0,
  );

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
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      <div className="bg-linear-to-r from-red-600 via-rose-600 to-red-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-red-400/20">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-12 -bottom-5 opacity-10 pointer-events-none hidden md:block">
          <HeartHandshake size={220} />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-md">
            <h1 className="text-3xl font-extrabold flex items-center gap-2 tracking-tight">
              Support BloodHero{" "}
              <Heart
                size={28}
                className="fill-white text-white animate-pulse shrink-0"
              />
            </h1>
            <p className="text-red-50/90 text-sm leading-relaxed">
              Your small contribution keeps our servers alive, funds emergency
              blood requests, and helps us expand our volunteer reach. Let's
              save lives together!
            </p>
          </div>

          <div className="shrink-0 flex items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="group relative w-full md:w-auto px-8 py-4 bg-white text-red-600 font-black text-base rounded-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_10px_25px_-5px_rgba(255,255,255,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(255,255,255,0.6)] flex items-center justify-center gap-3 cursor-pointer overflow-hidden border-2 border-white"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-linear-to-r from-white/0 via-white/30 to-white/0 skew-x-[-25deg] translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out" />

              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shadow-xs group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                <Wallet size={18} className="animate-bounce" />
              </div>
              <span className="tracking-wide uppercase text-sm">
                Donate Now
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Fund Raised
            </p>
            <h3 className="text-2xl font-black text-gray-800">
              ৳{totalDonationsAmount.toLocaleString()}
            </h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Contributions
            </p>
            <h3 className="text-2xl font-black text-gray-800">
              {history.length} Times
            </h3>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
            <HeartHandshake size={24} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Layers size={18} className="text-red-500" />
            <span>Recent Contributions</span>
          </h2>
          <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
            Live History
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200/60 text-gray-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 pl-6 w-16 text-center">SL</th>
                <th className="p-4">Donor Information</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right pr-6">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
              {history.map((item, index) => (
                <tr
                  key={item._id || index}
                  className="hover:bg-red-50/20 transition-colors duration-200"
                >
                  <td className="p-4 pl-6 text-center font-bold text-gray-400">
                    {index + 1}
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
                    <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-xl font-bold text-sm border border-emerald-100 inline-flex items-center gap-0.5">
                      + ৳{item.amount || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {history.length === 0 && (
          <div className="text-center py-16 text-gray-400 bg-gray-50/30 flex flex-col items-center justify-center gap-2">
            <HeartHandshake size={40} className="text-gray-300 animate-pulse" />
            <span className="font-bold text-gray-700 text-base">
              No Donations Yet
            </span>
            <span className="text-xs text-gray-400">
              Be the first one to support our platform!
            </span>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-gray-100 shadow-2xl space-y-6 transform scale-100 transition duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Wallet className="text-red-500" size={24} />
                Make a Donation
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setError("");
                  setAmount("");
                }}
                disabled={loading}
                className="p-1.5 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <Mail size={16} className="text-gray-400" />
                  Owner Email
                </label>
                <input
                  type="email"
                  value={ownerEmail || ""}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-500 font-medium text-sm focus:outline-hidden cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                  <DollarSign size={16} className="text-gray-400" />
                  Enter Amount (BDT)
                </label>
                <input
                  type="number"
                  placeholder="Min 100 BDT"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  required
                  min="100"
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-xl bg-white border text-gray-800 font-semibold text-sm focus:ring-2 focus:ring-red-100 focus:outline-hidden transition disabled:opacity-50 ${
                    error
                      ? "border-red-500 focus:border-red-500 focus:ring-red-50"
                      : "border-gray-200 focus:border-red-500"
                  }`}
                />

                {error && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1 animate-pulse">
                    <AlertCircle size={14} />
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setIsModalOpen(false);
                    setError("");
                    setAmount("");
                  }}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 active:bg-gray-100 transition cursor-pointer text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !!error}
                  className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 active:bg-red-700 transition shadow-md shadow-red-500/20 cursor-pointer text-sm flex items-center gap-1.5 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  <CheckCircle size={16} />
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundingPage;
