"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartPulse, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  let user = session?.user;

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const newErrors = {};

    if (!form.email.value.trim()) {
      newErrors.email = "Email is required";
    }

    if (!form.password.value) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const { data, error } = await authClient.signIn.email({
      email: form.email.value,
      password: form.password.value,
    });
    user = session?.user;
    if (data) {
      toast.success("Login Successfully");
      router.push(`/dashboard/${user?.role}`);
      console.log(user?.role);
    }

    if (error) {
      toast.danger(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white">
            <HeartPulse size={35} />
          </div>

          <h1 className="text-3xl font-bold text-red-600 mt-4">Welcome Back</h1>

          <p className="text-gray-500 mt-2">Login to continue saving lives</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label>Email</label>

            <div className="relative mt-2">
              <Mail className="absolute left-3 top-3 text-gray-400" />

              <input
                name="email"
                type="email"
                placeholder="Email address"
                className="w-full border rounded-xl py-3 pl-10 outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label>Password</label>

            <div className="relative mt-2">
              <Lock className="absolute left-3 top-3 text-gray-400" />

              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full border rounded-xl py-3 pl-10 pr-12 outline-none focus:ring-2 focus:ring-red-400"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button className="w-full cursor-pointer bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition">
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Don't have account?
          <Link
            href="/registration"
            className="text-red-500 ml-2 font-semibold"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
