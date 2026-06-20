"use client";

import React, { useState } from "react";
import {
  Wallet,
  Mail,
  DollarSign,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

const FundingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;
  const ownerEmail = user?.email;

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
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="bg-linear-to-r from-red-500 to-rose-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Support BloodHero 💝
          </h1>
          <p className="text-red-100 mt-2 max-w-md">
            Your small contribution can save lives. Help us maintain our
            platform and extend our reach to more donors.
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 px-6 py-3 bg-white text-red-600 font-bold rounded-2xl shadow-md hover:bg-red-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Wallet size={20} />
            <span>Donate Now</span>
          </button>
        </div>
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
                  value={ownerEmail}
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
