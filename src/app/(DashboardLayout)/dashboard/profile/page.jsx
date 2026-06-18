"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Save,
  X,
  Mail,
  Droplet,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@heroui/react";
import { useSession } from "@/lib/auth-client";
import { UploadImage } from "@/utils/UploadImage";
import { updateProfile } from "@/lib/api/users/action";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  //   console.log(user);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData(user);
      setPreviewImage(user.image || "");
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    const localPreview = URL.createObjectURL(file);

    setPreviewImage(localPreview);

    toast.success("Image selected");
  };
  const handleCancel = () => {
    setFormData(user);
    setPreviewImage(user.image || "");
    setSelectedFile(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      let finalImage = formData.image;

      if (selectedFile) {
        const uploaded = await UploadImage(selectedFile);

        finalImage = uploaded?.url || uploaded;
      }

      const finalUpdatedData = {
        ...formData,
        image: finalImage,
      };

      const res = await updateProfile(finalUpdatedData, user?.id);

      //   console.log("FINAL PROFILE DATA:", res);

      setFormData(finalUpdatedData);
      setPreviewImage(finalImage);
      setSelectedFile(null);
      setIsEditing(false);

      toast.success("Profile saved successfully");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  if (!user || !formData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-pulse text-lg font-medium text-slate-500">
          Loading profile...
        </div>
      </div>
    );
  }

  const inputClasses =
    "mt-1.5 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 transition duration-200 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-60";

  const isBlocked = formData.status === "blocked";

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-red-500 to-rose-600 p-6 text-white shadow-lg shadow-red-500/10 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-center gap-5 sm:flex-row text-center sm:text-left">
              <div className="relative group">
                <img
                  src={
                    previewImage ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                  }
                  alt="Profile"
                  className="h-24 w-24 rounded-2xl border-4 border-white/20 object-cover shadow-md transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold md:text-3xl">
                  {formData.name}
                </h1>
                <p className="flex items-center justify-center sm:justify-start gap-2 text-white/90 text-sm font-medium">
                  <Mail size={14} />
                  {formData.email}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                  <span className="rounded-xl bg-black/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-inner">
                    {formData.role || "User"}
                  </span>

                  <span className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1 text-xs font-black text-red-600 shadow-md">
                    <Droplet size={12} className="fill-red-600" />
                    <span>Blood: {formData.bloodGroup || "N/A"}</span>
                  </span>

                  {isBlocked ? (
                    <span className="flex items-center gap-1.5 rounded-xl bg-rose-900 px-3 py-1 text-xs font-black uppercase tracking-wide text-rose-100 shadow-md border border-rose-500/30">
                      <span className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                      Blocked
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 rounded-xl bg-emerald-900 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-100 shadow-md border border-emerald-500/30">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      Active Donor
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-red-600 shadow-md transition duration-200 hover:bg-red-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Pencil size={15} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center rounded-xl bg-white/10 p-2.5 text-white transition duration-200 hover:bg-white/20"
                    title="Cancel"
                  >
                    <X size={20} />
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-red-600 shadow-md transition duration-200 hover:bg-red-50 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Save size={15} />
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {isBlocked ? (
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-800 shadow-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <h4 className="font-bold text-sm">Account Status: Suspended</h4>
              <p className="text-xs mt-0.5 text-red-700/90">
                Your account is currently blocked. You are not eligible to
                receive requests or donate blood at this moment. Please contact
                support for more details.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-800 shadow-sm">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <h4 className="font-bold text-sm">Donation Status: Available</h4>
              <p className="text-xs mt-0.5 text-emerald-700/90">
                Great news! Your profile is fully active. You are now visible to
                individuals searching for donors and eligible to accept blood
                donation requests.
              </p>
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
          <h2 className="mb-6 text-lg font-bold text-slate-800">
            Personal Information
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              change={handleChange}
              disabled={!isEditing}
              className={inputClasses}
            />

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <input
                value={formData.email}
                disabled={true}
                className={inputClasses}
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Blood Group
              </label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                disabled={!isEditing}
                className={inputClasses}
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
            </div>

            <Input
              label="District"
              name="district"
              value={formData.district}
              change={handleChange}
              disabled={!isEditing}
              className={inputClasses}
            />

            <Input
              label="Upazila"
              name="upazila"
              value={formData.upazila}
              change={handleChange}
              disabled={!isEditing}
              className={inputClasses}
            />

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <ImageIcon size={14} />
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                disabled={!isEditing}
                onChange={handleImageChange}
                className={`${inputClasses} file:mr-4 file:rounded-md file:border-0 file:bg-red-50 file:px-2.5 file:py-1 file:text-xs file:font-semibold file:text-red-600 hover:file:bg-red-100`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, change, disabled, className }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <input
        name={name}
        value={value || ""}
        onChange={change}
        disabled={disabled}
        className={className}
      />
    </div>
  );
}
