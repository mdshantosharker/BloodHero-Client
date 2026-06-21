"use client";

import { useState, useEffect } from "react";
import {
  HeartPulse,
  User,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Clock,
  MessageSquare,
  Phone,
  AlertTriangle,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { toast } from "@heroui/react";
import { createDonation } from "@/lib/api/donor/action";
import { useRouter } from "next/navigation";

export default function CreateDonationRequest() {
  const router = useRouter();
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  const [district, setDistrict] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = mounted ? session?.user : null;

  const isBlocked = user?.status === "blocked";

  const upazilaData = {
    Dhaka: ["Dhanmondi", "Mirpur", "Uttara", "Savar", "Keraniganj"],
    Gazipur: ["Gazipur Sadar", "Tongi", "Kaliakair", "Sreepur"],
    Chattogram: ["Pahartali", "Panchlaish", "Hathazari"],
    Rajshahi: ["Boalia", "Motihar", "Paba"],
  };

  const hospitalData = {
    Dhaka: [
      "Dhaka Medical College Hospital",
      "Sir Salimullah Medical College",
      "Square Hospital",
      "Evercare Hospital",
      "Ibn Sina Hospital",
    ],
    Gazipur: [
      "Shaheed Tajuddin Ahmad Medical College",
      "Ahsania Mission Cancer & General Hospital",
      "Tongi Government Hospital",
    ],
    Chattogram: [
      "Chittagong Medical College Hospital",
      "Chattogram General Hospital",
      "Imperial Hospital",
    ],
    Rajshahi: [
      "Rajshahi Medical College Hospital",
      "Christian Mission Hospital",
      "Popular Diagnostic Center",
    ],
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      toast.error("Blocked user cannot create request");
      return;
    }

    const form = e.target;

    if (
      !form.recipientPhone.value ||
      !form.district.value ||
      !form.upazila.value ||
      !form.hospital.value ||
      !form.bloodGroup.value ||
      !form.date.value ||
      !form.time.value
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const rawTime = form.time.value;
    let formattedTime = rawTime;

    if (rawTime) {
      const [hoursStr, minutesStr] = rawTime.split(":");
      let hours = parseInt(hoursStr, 10);
      const minutes = minutesStr;
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12;

      const formattedHours = hours < 10 ? `0${hours}` : hours;
      formattedTime = `${formattedHours}:${minutes} ${ampm}`;
    }

    const data = {
      requesterName: user?.name,
      requesterEmail: user?.email,
      recipientName: form.recipientName.value,
      recipientPhone: form.recipientPhone.value,
      recipientDistrict: form.district.value,
      recipientUpazila: form.upazila.value,
      hospital: form.hospital.value,
      address: form.address.value,
      bloodGroup: form.bloodGroup.value,
      donationDate: form.date.value,
      donationTime: formattedTime,
      message: form.message.value,
      status: "pending",
    };

    const res = await createDonation({ ...data });
    console.log(res);
    if (res.insertedId) {
      toast.success("Donation Request Created Successfully!");
      router.push("/dashboard/my-donation-requests");
    }
    form.reset();
    setDistrict("");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-10 flex items-center justify-center">
      <div className="w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="relative overflow-hidden bg-linear-to-br from-red-800 to-rose-700 p-6 sm:p-10 text-white">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner">
              <HeartPulse size={40} className="animate-pulse text-white" />
            </div>

            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Create Donation Request
              </h1>
              <p className="text-red-100/90 text-sm font-medium">
                Your request could connect the right hero to save a life.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={submitHandler}
          className="p-6 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Input
            label="Requester Name"
            value={user?.name || ""}
            icon={<User size={18} />}
            readOnly
          />

          <Input
            label="Requester Email"
            value={user?.email || ""}
            icon={<Mail size={18} />}
            readOnly
          />

          <div className="border-t border-dashed border-slate-200 md:col-span-2 my-2" />

          <Input
            name="recipientName"
            label="Recipient Name"
            placeholder="Enter patient's name"
            icon={<User size={18} />}
            required
            disabled={isBlocked}
          />

          <Select
            label="Blood Group Required"
            name="bloodGroup"
            options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
            required
            disabled={isBlocked}
          />

          <Input
            name="recipientPhone"
            type="tel"
            label="Contact Number"
            placeholder="e.g. 017XXXXXXXX"
            icon={<Phone size={18} />}
            required
            disabled={isBlocked}
          />

          <Select
            label="Recipient District"
            name="district"
            onChange={(e) => setDistrict(e.target.value)}
            options={Object.keys(upazilaData)}
            required
            disabled={isBlocked}
          />

          <Select
            label="Recipient Upazila"
            name="upazila"
            disabled={!district || isBlocked}
            options={district ? upazilaData[district] : []}
            required
          />

          <Select
            label="Hospital Name"
            name="hospital"
            disabled={!district || isBlocked}
            options={district ? hospitalData[district] : []}
            required
          />

          <div>
            <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">
              Donation Date <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Calendar size={18} />
              </div>
              <input
                name="date"
                type="date"
                required
                disabled={isBlocked}
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 bg-slate-50 text-sm font-medium text-slate-800 outline-none transition duration-200 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 cursor-pointer disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">
              Donation Time <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-2">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Clock size={18} />
              </div>
              <input
                name="time"
                type="time"
                required
                disabled={isBlocked}
                className="w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 bg-slate-50 text-sm font-medium text-slate-800 outline-none transition duration-200 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 cursor-pointer disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <Input
              name="address"
              label="Full Address Details"
              placeholder="e.g. Ward No 4, Floor 3, Bed 12"
              icon={<MapPin size={18} />}
              disabled={isBlocked}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">
              Request Message
            </label>
            <div className="relative mt-2">
              <MessageSquare
                className="absolute left-4 top-4 text-slate-400"
                size={18}
              />
              <textarea
                name="message"
                rows="4"
                disabled={isBlocked}
                placeholder="Briefly describe the medical condition or emergency reasons to encourage donors..."
                className="w-full rounded-xl border border-slate-200 p-4 pl-12 bg-slate-50 text-sm font-medium text-slate-800 outline-none transition duration-200 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10 resize-none disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {isBlocked && (
            <div className="md:col-span-2 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
              <AlertTriangle
                className="text-red-500 shrink-0 mt-0.5"
                size={18}
              />
              <div>
                <p className="font-bold">Your account is currently blocked!</p>
                <p className="text-red-600/90 text-xs mt-0.5">
                  You are unable to create any new blood requests. Please
                  contact the administrator as soon as possible to resolve the
                  issue.
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isBlocked}
            className={`md:col-span-2 mt-2 py-4 rounded-xl text-white font-bold text-base transition duration-200 
              ${
                isBlocked
                  ? "bg-slate-300 border border-slate-200 cursor-not-allowed text-slate-500 shadow-none"
                  : "bg-linear-to-r from-red-500 to-rose-600 shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 active:scale-[0.99] cursor-pointer"
              }`}
          >
            {isBlocked
              ? "Request Disabled (Account Blocked)"
              : "Create Donation Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, icon, ...props }) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative mt-2">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>

        <input
          {...props}
          className={`
            w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 bg-slate-50 text-sm font-medium text-slate-800 outline-none transition duration-200 
            ${props.readOnly ? "opacity-65 bg-slate-100 cursor-not-allowed border-slate-200/60" : ""}
            ${props.disabled ? "opacity-50 bg-slate-100 cursor-not-allowed border-slate-200/60" : "focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"}
          `}
        />
      </div>
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700 tracking-wide uppercase">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative mt-2">
        {props.name === "hospital" ? (
          <Building2
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        ) : props.name === "bloodGroup" ? (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 font-bold text-base pointer-events-none">
            🩸
          </span>
        ) : (
          <MapPin
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        )}

        <select
          {...props}
          className={`
            w-full rounded-xl border border-slate-200 py-3.5 pl-12 pr-4 bg-slate-50 text-sm font-medium text-slate-800 outline-none transition duration-200 appearance-none cursor-pointer
            ${props.disabled ? "opacity-50 bg-slate-100 cursor-not-allowed" : "focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"}
          `}
        >
          <option value="">Select {label}</option>
          {options.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
          ▼
        </div>
      </div>
    </div>
  );
}
