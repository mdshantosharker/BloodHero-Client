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
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { toast } from "@heroui/react";

export default function CreateDonationRequest() {
  const { data: session } = useSession();

  const [mounted, setMounted] = useState(false);
  const [district, setDistrict] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = mounted ? session?.user : null;

  const upazilaData = {
    Dhaka: ["Dhanmondi", "Mirpur", "Uttara", "Savar", "Keraniganj"],
    Gazipur: ["Gazipur Sadar", "Tongi", "Kaliakair", "Sreepur"],
    Chattogram: ["Pahartali", "Panchlaish", "Hathazari"],
    Rajshahi: ["Boalia", "Motihar", "Paba"],
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (user?.status === "blocked") {
      toast.error("Blocked user cannot create request");
      return;
    }

    const form = e.target;

    const data = {
      requesterName: user?.name,

      requesterEmail: user?.email,

      recipientName: form.recipientName.value,

      recipientDistrict: form.district.value,

      recipientUpazila: form.upazila.value,

      hospital: form.hospital.value,

      address: form.address.value,

      bloodGroup: form.bloodGroup.value,

      donationDate: form.date.value,

      donationTime: form.time.value,

      message: form.message.value,

      status: "pending",
    };

    console.log(data);

    toast.success("Donation Request Created");

    form.reset();

    setDistrict("");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#fff5f5] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff5f5] p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-[30px] shadow-xl overflow-hidden">
        {/* header */}

        <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 sm:p-10 text-white">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center">
              <HeartPulse size={45} />
            </div>

            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold">Create Donation Request</h1>

              <p className="text-red-100 mt-1">Every drop can save a life</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={submitHandler}
          className="p-5 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Input
            label="Requester Name"
            value={user?.name || ""}
            icon={<User />}
            readOnly
          />

          <Input
            label="Requester Email"
            value={user?.email || ""}
            icon={<Mail />}
            readOnly
          />

          <Input name="recipientName" label="Recipient Name" icon={<User />} />

          <Select
            label="Recipient District"
            name="district"
            onChange={(e) => setDistrict(e.target.value)}
            options={Object.keys(upazilaData)}
          />

          <Select
            label="Recipient Upazila"
            name="upazila"
            disabled={!district}
            options={district ? upazilaData[district] : []}
          />

          <Input name="hospital" label="Hospital Name" icon={<Building2 />} />

          <Input name="address" label="Full Address" icon={<MapPin />} />

          <Select
            label="Blood Group"
            name="bloodGroup"
            options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
          />

          <Input
            name="date"
            type="date"
            label="Donation Date"
            icon={<Calendar />}
          />

          <Input
            name="time"
            type="time"
            label="Donation Time"
            icon={<Clock />}
          />

          <div className="lg:col-span-2">
            <label className="font-bold text-gray-700">Request Message</label>

            <div className="relative mt-2">
              <MessageSquare className="absolute left-4 top-4 text-gray-400" />

              <textarea
                name="message"
                rows="5"
                placeholder="Explain why you need blood..."
                className="
                w-full
                rounded-2xl
                border
                bg-gray-50
                p-4
                pl-12
                outline-none
                focus:ring-2
                focus:ring-red-300
                "
              />
            </div>
          </div>

          <button
            className="
            lg:col-span-2
            py-4
            rounded-2xl
            bg-gradient-to-r
            from-red-500
            to-rose-600
            text-white
            font-bold
            text-lg
            shadow-lg
            hover:scale-[1.02]
            transition
            "
          >
            Create Donation Request
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, icon, ...props }) {
  return (
    <div>
      <label className="font-semibold text-gray-700">{label}</label>

      <div className="relative mt-2">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>

        <input
          {...props}
          className={`
w-full
rounded-2xl
border
py-3.5
pl-12
bg-gray-50
outline-none
focus:bg-white
focus:ring-2
focus:ring-red-300
${props.readOnly ? "opacity-70 cursor-not-allowed" : ""}
`}
        />
      </div>
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="font-semibold text-gray-700">{label}</label>

      <select
        {...props}
        className="
w-full
mt-2
rounded-2xl
border
bg-gray-50
p-3.5
outline-none
focus:ring-2
focus:ring-red-300
"
      >
        <option value="">Select {label}</option>

        {options.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}
