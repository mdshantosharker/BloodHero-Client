"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Droplet,
  MapPin,
  Compass,
  Users,
  Calendar,
  Clock,
  Eye,
  ChevronDown,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { searchDonationRequests } from "@/lib/api/search/search";

export default function SearchPage() {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const [errors, setErrors] = useState({
    bloodGroup: "",
    district: "",
    upazila: "",
  });

  const upazilaData = {
    Dhaka: ["Dhanmondi", "Mirpur", "Uttara", "Savar", "Keraniganj"],
    Gazipur: ["Gazipur Sadar", "Tongi", "Kaliakair", "Sreepur"],
    Chattogram: ["Pahartali", "Panchlaish", "Hathazari", "Raozan"],
    Rajshahi: ["Boalia", "Motihar", "Paba", "Godagari"],
    Khulna: ["Sonadanga", "Dumuria", "Paikgacha"],
    Sylhet: ["Sylhet Sadar", "Beanibazar", "Golapganj"],
  };

  const handleInputChange = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const form = e.target;
    const bloodGroup = form.bloodGroup.value;
    const district = form.district.value;
    const upazila = form.upazila.value;

    const newErrors = {};
    if (!bloodGroup) newErrors.bloodGroup = "Please select a blood group";
    if (!district) newErrors.district = "Please select a district";
    if (!upazila) newErrors.upazila = "Please select an upazila";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setVisibleCount(6);

    try {
      const data = await searchDonationRequests({
        bloodGroup,
        district,
        upazila,
      });
      setDonors(data || []);
    } catch (error) {
      console.error("Error fetching donors:", error);
      setDonors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 select-none relative overflow-hidden">
      <div className="absolute top-0 right-0 w-125 h-125 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-red-100 mb-3 shadow-xs">
              <Droplet size={14} className="fill-red-500 text-red-500" /> Live
              Search Portal
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              Find Life-Saving <span className="text-red-500">Donors</span>
            </h1>
            <p className="text-slate-500 font-medium mt-3 max-w-md mx-auto text-sm md:text-base leading-relaxed">
              Search for available blood donors near your area instantly by
              filling the form below.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-[28px] border border-slate-200/80 p-6 md:p-8 shadow-[0_20px_50px_-20px_rgba(244,63,94,0.06)] mb-12"
        >
          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start"
          >
            <div className="group flex flex-col w-full">
              <label
                className={`text-xs font-black uppercase tracking-wider transition-colors ${errors.bloodGroup ? "text-red-500" : "text-slate-500 group-focus-within:text-red-500"}`}
              >
                Blood Group
              </label>
              <div className="relative mt-2">
                <div
                  className={`absolute left-4 top-3.5 pointer-events-none transition-colors ${errors.bloodGroup ? "text-red-400" : "text-slate-400 group-focus-within:text-red-500"}`}
                >
                  <Droplet size={18} />
                </div>
                <select
                  name="bloodGroup"
                  onChange={() => handleInputChange("bloodGroup")}
                  className={`w-full border bg-slate-50/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 appearance-none cursor-pointer ${
                    errors.bloodGroup
                      ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-red-400 focus:ring-red-500/10"
                  }`}
                >
                  <option value="">Select Blood Group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ),
                  )}
                </select>
                <div className="absolute right-4 top-5 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-slate-400 border-l-transparent border-r-transparent" />
              </div>
              {errors.bloodGroup && (
                <span className="text-red-500 text-[11px] font-semibold mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.bloodGroup}
                </span>
              )}
            </div>

            <div className="group flex flex-col w-full">
              <label
                className={`text-xs font-black uppercase tracking-wider transition-colors ${errors.district ? "text-red-500" : "text-slate-500 group-focus-within:text-red-500"}`}
              >
                District
              </label>
              <div className="relative mt-2">
                <div
                  className={`absolute left-4 top-3.5 pointer-events-none transition-colors ${errors.district ? "text-red-400" : "text-slate-400 group-focus-within:text-red-500"}`}
                >
                  <MapPin size={18} />
                </div>
                <select
                  name="district"
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    handleInputChange("district");
                    const upazilaSelect = e.target.form.elements.upazila;
                    if (upazilaSelect) upazilaSelect.value = "";
                  }}
                  className={`w-full border bg-slate-50/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 appearance-none cursor-pointer ${
                    errors.district
                      ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-red-400 focus:ring-red-500/10"
                  }`}
                >
                  <option value="">Select District</option>
                  {Object.keys(upazilaData).map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-5 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-slate-400 border-l-transparent border-r-transparent" />
              </div>
              {errors.district && (
                <span className="text-red-500 text-[11px] font-semibold mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.district}
                </span>
              )}
            </div>

            <div className="group flex flex-col w-full">
              <label
                className={`text-xs font-black uppercase tracking-wider transition-colors ${errors.upazila ? "text-red-500" : "text-slate-500 group-focus-within:text-red-500"}`}
              >
                Upazila
              </label>
              <div className="relative mt-2">
                <div
                  className={`absolute left-4 top-3.5 pointer-events-none transition-colors ${errors.upazila ? "text-red-400" : "text-slate-400 group-focus-within:text-red-500"}`}
                >
                  <Compass size={18} />
                </div>
                <select
                  name="upazila"
                  disabled={!selectedDistrict}
                  onChange={() => handleInputChange("upazila")}
                  className={`w-full border bg-slate-50/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all focus:bg-white focus:ring-4 appearance-none disabled:opacity-50 disabled:bg-slate-100 cursor-pointer ${
                    errors.upazila
                      ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-red-400 focus:ring-red-500/10"
                  }`}
                >
                  <option value="">Select Upazila</option>
                  {selectedDistrict &&
                    upazilaData[selectedDistrict].map((upazila) => (
                      <option key={upazila} value={upazila}>
                        {upazila}
                      </option>
                    ))}
                </select>
                <div className="absolute right-4 top-5 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-slate-400 border-l-transparent border-r-transparent" />
              </div>
              {errors.upazila && (
                <span className="text-red-500 text-[11px] font-semibold mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.upazila}
                </span>
              )}
            </div>

            <div className="w-full mt-5">
              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                disabled={isLoading}
                type="submit"
                className="w-full bg-linear-to-r from-red-500 to-rose-600 text-white py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-red-500/20 hover:shadow-red-500/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 h-12.5 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Search size={18} />
                    <span>Search Donors</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        <div className="relative min-h-75">
          <AnimatePresence mode="wait">
            {!hasSearched && (
              <motion.div
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-200/60 p-8 shadow-xs"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Ready to Search
                </h3>
                <p className="text-sm text-slate-400 mt-1.5 max-w-xs mx-auto">
                  Select your desired parameters above to track live matching
                  blood requests.
                </p>
              </motion.div>
            )}

            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24"
              >
                <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Scanning database...
                </p>
              </motion.div>
            )}

            {hasSearched && !isLoading && donors.length === 0 && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 bg-linear-to-b from-white to-slate-50/50 rounded-[32px] border border-slate-200 p-8 shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-500/5 rounded-full blur-2xl animate-pulse" />
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-red-100/50 shadow-inner">
                    <Inbox size={28} className="animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    No Match Found
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                    We couldn't find any urgent requests matching this specific
                    combination right now. Try expanding your zone or area.
                  </p>
                </div>
              </motion.div>
            )}

            {hasSearched && !isLoading && donors.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {donors.slice(0, visibleCount).map((item, idx) => (
                    <motion.div
                      key={item._id || idx}
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
                            {item.recipientName || item.requesterName}
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

                {donors.length > visibleCount && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={handleViewMore}
                      className="inline-flex items-center gap-2 bg-white hover:bg-red-50 text-gray-800 hover:text-red-600 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 border border-gray-200 hover:border-red-200 cursor-pointer shadow-xs hover:shadow-md"
                    >
                      View More Requests ({donors.length - visibleCount} left)
                      <ChevronDown size={16} className="animate-bounce" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
