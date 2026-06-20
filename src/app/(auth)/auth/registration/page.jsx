"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HeartPulse,
  Mail,
  User,
  Lock,
  ImageUp,
  Eye,
  EyeOff,
  Droplet,
  MapPin,
  Compass,
  ArrowRight,
} from "lucide-react";

import { toast } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { UploadImage } from "@/utils/UploadImage";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const upazilaData = {
    Dhaka: ["Dhanmondi", "Mirpur", "Uttara", "Savar", "Keraniganj"],
    Gazipur: ["Gazipur Sadar", "Tongi", "Kaliakair", "Sreepur"],
    Chattogram: ["Pahartali", "Panchlaish", "Hathazari", "Raozan"],
    Rajshahi: ["Boalia", "Motihar", "Paba", "Godagari"],
    Khulna: ["Sonadanga", "Dumuria", "Paikgacha"],
    Sylhet: ["Sylhet Sadar", "Beanibazar", "Golapganj"],
  };

  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    if (!image) return;
    setAvatar(image);
    setPreview(URL.createObjectURL(image));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newErrors = {};

    if (!form.name.value.trim()) newErrors.name = "Name is required";
    if (!form.email.value.trim()) newErrors.email = "Email is required";
    if (!avatar) newErrors.avatar = "Avatar is required";
    if (!form.bloodGroup.value)
      newErrors.bloodGroup = "Blood group is required";
    if (!form.district.value) newErrors.district = "District is required";
    if (!form.upazila.value) newErrors.upazila = "Upazila is required";
    if (!form.password.value) newErrors.password = "Password is required";
    if (!form.confirm_password.value)
      newErrors.confirm_password = "Confirm password is required";

    if (
      form.password.value &&
      form.confirm_password.value &&
      form.password.value !== form.confirm_password.value
    ) {
      newErrors.confirm_password = "Password does not match";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const image = await UploadImage(avatar);

      const userInfo = {
        name: form.name.value,
        email: form.email.value,
        image: image.url,
        bloodGroup: form.bloodGroup.value,
        district: form.district.value,
        upazila: form.upazila.value,
        password: form.password.value,
      };

      const { data, error } = await authClient.signUp.email({
        ...userInfo,
      });

      if (data) {
        toast.success("Registration Successfully");
        if (callbackUrl) {
          router.push(`/auth/login?callbackUrl=${callbackUrl}`);
        } else {
          router.push("/auth/login");
        }
      }

      if (error) {
        toast.error(error.message);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex items-center justify-center px-5 py-16 overflow-hidden select-none">
      <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-175 h-175 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        animate={{
          borderRadius: [
            "42% 58% 70% 30% / 45% 45% 55% 55%",
            "70% 30% 52% 48% / 60% 40% 60% 40%",
            "42% 58% 70% 30% / 45% 45% 55% 55%",
          ],
          y: [0, -15, 0],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 right-16 w-40 h-40 bg-linear-to-br from-red-500/5 to-rose-500/20 border border-red-500/10 hidden lg:block"
      />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", duration: 0.7, bounce: 0.2 }}
        className="w-full max-w-3xl bg-white/80 backdrop-blur-xl rounded-[32px] shadow-[0_25px_60px_-15px_rgba(244,63,94,0.08)] border border-slate-200/60 p-8 md:p-12 relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            whileHover={{ scale: 1.08, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="mx-auto w-16 h-16 rounded-2xl bg-linear-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30 cursor-pointer"
          >
            <HeartPulse size={32} className="animate-pulse" />
          </motion.div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 mt-5">
            Join BloodHero
          </h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1.5">
            Create your donor account and save lives
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="group">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-red-500">
              Full Name
            </label>
            <div className="relative mt-2">
              <div className="absolute left-4 top-3.5 text-slate-400 transition-colors group-focus-within:text-red-500 pointer-events-none">
                <User size={18} />
              </div>
              <input
                name="name"
                placeholder="Your name"
                className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all duration-200 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 placeholder:text-slate-400"
              />
            </div>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-xs font-bold mt-1.5 ml-1"
              >
                {errors.name}
              </motion.p>
            )}
          </div>

          <div className="group">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-red-500">
              Email Address
            </label>
            <div className="relative mt-2">
              <div className="absolute left-4 top-3.5 text-slate-400 transition-colors group-focus-within:text-red-500 pointer-events-none">
                <Mail size={18} />
              </div>
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all duration-200 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 placeholder:text-slate-400"
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-xs font-bold mt-1.5 ml-1"
              >
                {errors.email}
              </motion.p>
            )}
          </div>

          <div className="group">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-red-500">
              Avatar Image
            </label>
            <div className="flex items-center gap-4 mt-2">
              <label className="flex flex-1 items-center justify-center gap-2 border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-red-50/30 hover:border-red-300 rounded-2xl p-3.5 cursor-pointer text-sm font-bold text-slate-500 hover:text-red-500 transition-all">
                <ImageUp size={18} />
                <span>Upload Image</span>
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
              {preview && (
                <motion.img
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={preview}
                  alt="avatar"
                  className="w-12 h-12 rounded-2xl object-cover ring-4 ring-red-500/10 border border-slate-200"
                />
              )}
            </div>
            {errors.avatar && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-xs font-bold mt-1.5 ml-1"
              >
                {errors.avatar}
              </motion.p>
            )}
          </div>

          <div className="group">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-red-500">
              Blood Group
            </label>
            <div className="relative mt-2">
              <div className="absolute left-4 top-3.5 text-slate-400 transition-colors group-focus-within:text-red-500 pointer-events-none">
                <Droplet size={18} />
              </div>
              <select
                name="bloodGroup"
                className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all duration-200 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 appearance-none"
              >
                <option value="">Select Blood Group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>
              <div className="absolute right-4 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-slate-400 border-l-transparent border-r-transparent" />
            </div>
            {errors.bloodGroup && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-xs font-bold mt-1.5 ml-1"
              >
                {errors.bloodGroup}
              </motion.p>
            )}
          </div>

          <div className="group">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-red-500">
              District
            </label>
            <div className="relative mt-2">
              <div className="absolute left-4 top-3.5 text-slate-400 transition-colors group-focus-within:text-red-500 pointer-events-none">
                <MapPin size={18} />
              </div>
              <select
                name="district"
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all duration-200 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 appearance-none"
              >
                <option value="">Select District</option>
                {Object.keys(upazilaData).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-slate-400 border-l-transparent border-r-transparent" />
            </div>
            {errors.district && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-xs font-bold mt-1.5 ml-1"
              >
                {errors.district}
              </motion.p>
            )}
          </div>

          <div className="group">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-red-500">
              Upazila
            </label>
            <div className="relative mt-2">
              <div className="absolute left-4 top-3.5 text-slate-400 transition-colors group-focus-within:text-red-500 pointer-events-none">
                <Compass size={18} />
              </div>
              <select
                name="upazila"
                disabled={!selectedDistrict}
                className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition-all duration-200 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 appearance-none disabled:opacity-50 disabled:bg-slate-100"
              >
                <option value="">Select Upazila</option>
                {selectedDistrict &&
                  upazilaData[selectedDistrict].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
              <div className="absolute right-4 top-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-t-slate-400 border-l-transparent border-r-transparent" />
            </div>
            {errors.upazila && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-xs font-bold mt-1.5 ml-1"
              >
                {errors.upazila}
              </motion.p>
            )}
          </div>

          <div className="group">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-red-500">
              Password
            </label>
            <div className="relative mt-2">
              <div className="absolute left-4 top-3.5 text-slate-400 transition-colors group-focus-within:text-red-500 pointer-events-none">
                <Lock size={18} />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl py-3.5 pl-12 pr-12 text-sm font-medium text-slate-800 outline-none transition-all duration-200 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-xs font-bold mt-1.5 ml-1"
              >
                {errors.password}
              </motion.p>
            )}
          </div>

          <div className="group">
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-red-500">
              Confirm Password
            </label>
            <div className="relative mt-2">
              <div className="absolute left-4 top-3.5 text-slate-400 transition-colors group-focus-within:text-red-500 pointer-events-none">
                <Lock size={18} />
              </div>
              <input
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full border border-slate-200 bg-slate-50/50 rounded-2xl py-3.5 pl-12 pr-12 text-sm font-medium text-slate-800 outline-none transition-all duration-200 focus:border-red-400 focus:bg-white focus:ring-4 focus:ring-red-500/10 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirm_password && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-500 text-xs font-bold mt-1.5 ml-1"
              >
                {errors.confirm_password}
              </motion.p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.01, y: -1 }}
            whileTap={{ scale: 0.99 }}
            disabled={isLoading}
            className="md:col-span-2 w-full cursor-pointer bg-linear-to-r from-red-500 to-rose-600 text-white py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-red-500/20 hover:shadow-red-500/30 hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Donor Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center mt-8 text-sm font-bold text-slate-400">
          Already have account?
          <Link
            href={
              callbackUrl
                ? `/auth/login?callbackUrl=${callbackUrl}`
                : "/auth/login"
            }
            className="text-red-500 hover:text-red-600 ml-1.5 transition-colors inline-flex items-center gap-0.5 group"
          >
            Login
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">
              →
            </span>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
