"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HeartPulse,
  Mail,
  User,
  Lock,
  ImageUp,
  Eye,
  EyeOff,
} from "lucide-react";
import { UploadImage } from "@/utils/UploadImage";
import { authClient } from "@/lib/auth-client";
import { toast } from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  const { data: session } = authClient.useSession();
  // let user = session?.user;
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});

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

    // user = session?.user;

    if (data) {
      toast.success("Registration Successfully");
      if (callbackUrl) {
        router.push(`/login?callbackUrl=${callbackUrl}`);
      } else {
        router.push("/login");
      }
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white">
            <HeartPulse size={35} />
          </div>

          <h1 className="text-3xl font-bold text-red-600 mt-4">
            Join BloodHero
          </h1>

          <p className="text-gray-500 mt-2">
            Create your donor account and save lives
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
          <div>
            <label>Name</label>

            <div className="relative mt-2">
              <User className="absolute left-3 top-3 text-gray-400" />

              <input
                name="name"
                className="w-full border rounded-xl py-3 pl-10"
                placeholder="Your name"
              />
            </div>

            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label>Email</label>

            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3 text-gray-400" />

              <input
                name="email"
                type="email"
                className="w-full border rounded-xl py-3 pl-10"
                placeholder="Email address"
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label>Avatar</label>

            <label className="mt-2 flex gap-3 border rounded-xl p-3 cursor-pointer">
              <ImageUp />
              Upload Image
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>

            {preview && (
              <img
                src={preview}
                alt="avatar"
                className="mt-3 w-16 h-16 rounded-full object-cover"
              />
            )}

            {errors.avatar && (
              <p className="text-red-500 text-sm">{errors.avatar}</p>
            )}
          </div>

          <div>
            <label>Blood Group</label>

            <select
              name="bloodGroup"
              className="mt-2 w-full border rounded-xl p-3"
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

            {errors.bloodGroup && (
              <p className="text-red-500 text-sm">{errors.bloodGroup}</p>
            )}
          </div>

          <div>
            <label>District</label>

            <select
              name="district"
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="mt-2 w-full border rounded-xl p-3"
            >
              <option value="">Select District</option>

              {Object.keys(upazilaData).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {errors.district && (
              <p className="text-red-500 text-sm">{errors.district}</p>
            )}
          </div>

          <div>
            <label>Upazila</label>

            <select
              name="upazila"
              disabled={!selectedDistrict}
              className="mt-2 w-full border rounded-xl p-3 disabled:bg-gray-100"
            >
              <option value="">Select Upazila</option>

              {selectedDistrict &&
                upazilaData[selectedDistrict].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>

            {errors.upazila && (
              <p className="text-red-500 text-sm">{errors.upazila}</p>
            )}
          </div>

          <div>
            <label>Password</label>

            <div className="relative mt-2">
              <Lock className="absolute left-3 top-3" />

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="w-full border rounded-xl py-3 pl-10 pr-12"
                placeholder="Password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div>
            <label>Confirm Password</label>

            <div className="relative mt-2">
              <Lock className="absolute left-3 top-3" />

              <input
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                className="w-full border rounded-xl py-3 pl-10 pr-12"
                placeholder="Confirm password"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.confirm_password && (
              <p className="text-red-500 text-sm">{errors.confirm_password}</p>
            )}
          </div>

          <button className="md:col-span-2 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition">
            Create Donor Account
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Already have account?
          <Link
            href={callbackUrl ? `/login?callbackUrl=${callbackUrl}` : "/login"}
            className="text-red-500 ml-2 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
