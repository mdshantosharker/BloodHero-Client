"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardMobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Header Button */}

      <div className="md:hidden fixed top-4 left-4 right-4 z-40 flex justify-between items-center bg-white rounded-2xl shadow-lg border border-red-100 px-4 py-3">
        <div>
          <h2 className="font-bold text-red-600 text-lg">BloodHero</h2>

          <p className="text-xs text-gray-500">Dashboard</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="w-11 h-11 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-md active:scale-95 transition"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Drawer */}

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
          />

          <div className="fixed left-0 top-0 bottom-0 w-full  z-60 shadow-2xl p-4 md:hidden">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"
            >
              <X size={22} />
            </button>

            <DashboardSidebar />
          </div>
        </>
      )}
    </>
  );
}
