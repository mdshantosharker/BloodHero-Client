"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Droplet,
  MapPin,
  Compass,
  Users,
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

  console.log(donors);

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
                className="space-y-12"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <Users className="text-red-500" size={22} />
                    Matching Donors Found ({donors.length})
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {donors.slice(0, visibleCount).map((item, idx) => (
                    <motion.div
                      key={item._id?.$oid || item.id || idx}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="bg-white rounded-[24px] border border-slate-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(244,63,94,0.08)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-red-500/10 to-transparent rounded-bl-full pointer-events-none transition-all duration-300 group-hover:scale-110" />

                      <div>
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center gap-3.5">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-xs group-hover:border-red-200 transition-colors duration-300"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://ui-avatars.com/api/?name=" +
                                    (item.name || "Donor");
                                }}
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200/60 flex items-center justify-center font-bold text-slate-700 text-xl border border-white shadow-inner">
                                {item.name
                                  ? item.name.charAt(0).toUpperCase()
                                  : "D"}
                              </div>
                            )}

                            <div>
                              <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-red-500 transition-colors duration-200 line-clamp-1 capitalize">
                                {item.name || "Anonymous Donor"}
                              </h3>

                              {item.status === "active" ? (
                                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mt-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
                                  Active Donor
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mt-1">
                                  Inactive
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="bg-red-50 text-red-600 font-black text-base tracking-wide px-4 py-2 rounded-xl border border-red-100/80 flex items-center justify-center min-w-13.5 shadow-xs group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 group-hover:scale-105 transition-all duration-300">
                            {item.bloodGroup || "N/A"}
                          </span>
                        </div>

                        <div className="space-y-3 bg-slate-50/60 group-hover:bg-red-50/10 rounded-2xl p-4 border border-slate-100 group-hover:border-red-100/30 transition-all duration-300">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-100 text-red-500">
                              <MapPin size={14} />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Donor's Area
                              </span>
                              <span className="text-xs font-bold text-slate-700 capitalize">
                                {item.upazila ? `${item.upazila}, ` : ""}
                                {item.district || "Unknown District"}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-100 text-slate-400">
                              <Inbox size={14} />
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Email Address
                              </span>
                              <span className="text-xs font-semibold text-slate-600 line-clamp-1">
                                {item.email || "No email available"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-5 mt-5 border-t border-slate-100/80 grid grid-cols-2 gap-3">
                        <a
                          href={`mailto:${item.email || ""}`}
                          className="w-full"
                        >
                          <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl font-bold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer">
                            <Inbox size={14} />
                            <span>Send Email</span>
                          </button>
                        </a>

                        <a href={`tel:${item.phone || "#"}`} className="w-full">
                          <button className="w-full bg-linear-to-r from-red-500 to-rose-600 text-white py-3 px-4 rounded-xl font-bold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-red-500/10 hover:shadow-red-500/20 hover:opacity-95 cursor-pointer">
                            <span>Call Donor</span>
                          </button>
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {donors.length > visibleCount && (
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={handleViewMore}
                      className="inline-flex items-center gap-2 bg-white hover:bg-red-50 text-slate-800 hover:text-red-600 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 border border-slate-200 hover:border-red-200 cursor-pointer shadow-xs hover:shadow-md"
                    >
                      View More Donors ({donors.length - visibleCount} left)
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
