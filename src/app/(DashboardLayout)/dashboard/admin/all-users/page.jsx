"use client";

import { useEffect, useState } from "react";
import {
  MoreVertical,
  UserRound,
  UserCog,
  User,
  Ban,
  CheckCircle,
  Filter,
  ShieldAlert,
  Users,
  Inbox,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { getAllUsers } from "@/lib/api/users/allUsers";
import { updateUserStatus } from "@/lib/api/users/action";
import { toast } from "@heroui/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AllUsersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;

  const { data: session } = useSession();
  const currentUserEmail = session?.user?.email;

  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUsers(page);

        if (response && response.data) {
          setUsers(response.data);
          setTotalPages(response.totalPage || 1);
        } else {
          setUsers([]);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const changeStatus = async (id) => {
    const targetUser = users.find((user) => (user._id || user.id) === id);
    if (!targetUser) return;

    const newStatus = targetUser.status === "active" ? "blocked" : "active";

    try {
      await updateUserStatus({ status: newStatus }, id);

      setUsers((prev) =>
        prev.map((user) =>
          (user._id || user.id) === id ? { ...user, status: newStatus } : user,
        ),
      );

      if (newStatus === "blocked") {
        toast.success(`Successfully blocked ${targetUser.name}! 🚫`);
      } else {
        toast.success(`Successfully unblocked ${targetUser.name}! ✅`);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const makeRole = async (id, role) => {
    const targetUser = users.find((user) => (user._id || user.id) === id);
    if (!targetUser) return;

    try {
      await updateUserStatus({ role }, id);

      setUsers((prev) =>
        prev.map((user) =>
          (user._id || user.id) === id ? { ...user, role } : user,
        ),
      );

      const roleNames = {
        admin: "an Admin",
        volunteer: "a Volunteer",
        donor: "a Donor",
      };
      toast.success(`${targetUser.name} is now ${roleNames[role] || role}! 🎉`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredUsers =
    filter === "all" ? users : users.filter((user) => user.status === filter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative flex items-center justify-center">
          <div className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-red-400 opacity-75"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500 relative z-10"></div>
        </div>
        <span className="font-bold text-gray-600 text-sm tracking-wide animate-pulse">
          Loading Users Directory...
        </span>
      </div>
    );
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="space-y-6 pb-10 max-w-7xl mx-auto px-4 md:px-6">
     
      <div className="bg-linear-to-r from-red-600 via-red-500 to-rose-500 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-6 translate-y-6 pointer-events-none">
          <Users size={200} />
        </div>
        <div className="flex gap-4 items-center relative z-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
              All Users 👥
            </h1>
            <p className="text-red-100 text-sm mt-1 font-medium opacity-90">
              Admin Panel • Manage user accounts, block list, and assign
              platform roles.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-4 justify-between items-center shadow-xs">
        <div className="flex items-center gap-2 font-bold text-gray-800 text-sm md:text-base">
          <Filter size={18} className="text-red-500" />
          <h2>Users Directory ({filteredUsers.length})</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Status:
          </span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-200 bg-gray-50/50 rounded-xl p-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/60 text-gray-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 pl-6 w-16 text-center">SL</th>
                <th className="p-4">User Details</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">System Role</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-center pr-6">Management</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
              <AnimatePresence mode="popLayout">
                {filteredUsers.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    key="empty-state"
                  >
                    <td colSpan="6" className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="p-4 bg-gray-50 rounded-full text-gray-400 border border-gray-100">
                          <Inbox size={40} className="stroke-[1.5]" />
                        </div>
                        <div className="max-w-xs">
                          <p className="text-base font-bold text-gray-800">
                            No {filter !== "all" ? filter : ""} users found
                          </p>
                          <p className="text-xs text-gray-400 font-medium mt-1">
                            {filter === "all"
                              ? "There are currently no users registered in the system."
                              : `There are no accounts matching the "${filter}" status filter right now.`}
                          </p>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  filteredUsers.map((user, index) => {
                    const isSelf =
                      currentUserEmail && user.email === currentUserEmail;
                    const userId = user._id || user.id;

                    const serialNumber = (page - 1) * 3 + (index + 1);

                    return (
                      <motion.tr
                        key={userId}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className={`transition-colors duration-150 ${
                          isSelf
                            ? "bg-amber-50/40 hover:bg-amber-50/60"
                            : "hover:bg-red-50/20"
                        }`}
                      >
                        <td className="p-4 pl-6 text-center font-bold text-gray-400">
                          {serialNumber}
                        </td>

                        <td className="p-4">
                          <div className="flex gap-3 items-center">
                            <div className="relative">
                              <img
                                src={
                                  user.image ||
                                  "https://img.heroui.chat/image/avatar?w=400&h=400&u=3"
                                }
                                alt={user.name}
                                className={`w-11 h-11 rounded-full object-cover border-2 ${
                                  isSelf
                                    ? "border-amber-400"
                                    : "border-gray-100"
                                }`}
                              />
                              {isSelf && (
                                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wide border-2 border-white shadow-xs">
                                  You
                                </span>
                              )}
                            </div>

                            <div>
                              <p className="font-bold text-gray-900 text-base">
                                {user.name}
                              </p>
                              <p className="text-xs text-red-500 font-bold tracking-wide mt-0.5">
                                Subscribed Blood: {user.bloodGroup || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-medium text-gray-600">
                          {user.email}
                        </td>

                        <td className="p-4">
                          <span
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs capitalize border shadow-2xs ${
                              user.role === "admin"
                                ? "bg-purple-50 text-purple-700 border-purple-100"
                                : user.role === "volunteer"
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : "bg-red-50 text-red-600 border-red-100"
                            }`}
                          >
                            {user.role || "donor"}
                          </span>
                        </td>

                        <td className="p-4">
                          {user.status === "active" ? (
                            <span className="inline-flex gap-1.5 items-center bg-emerald-50 text-emerald-700 font-bold text-xs px-2.5 py-1 rounded-full border border-emerald-200">
                              <CheckCircle size={14} />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex gap-1.5 items-center bg-red-50 text-red-600 font-bold text-xs px-2.5 py-1 rounded-full border border-red-200">
                              <Ban size={14} />
                              Blocked
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-center pr-6">
                          <ActionMenu
                            user={user}
                            changeStatus={changeStatus}
                            makeRole={makeRole}
                            isSelf={isSelf}
                          />
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
            <p className="text-xs font-semibold text-gray-500">
              Showing page{" "}
              <span className="text-gray-800 font-bold">{page}</span> of{" "}
              <span className="text-gray-800 font-bold">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-2xs">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-200/60 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <ChevronLeft size={16} />
              </button>

              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => handlePageChange(num)}
                  className={`w-9 h-9 text-xs font-bold rounded-xl transition-all active:scale-95 ${
                    page === num
                      ? "bg-linear-to-r from-red-600 to-rose-500 text-white shadow-md shadow-red-500/20 font-extrabold"
                      : "text-gray-600 hover:bg-gray-100 bg-transparent"
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-200/60 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionMenu({ user, changeStatus, makeRole, isSelf }) {
  const [open, setOpen] = useState(false);

  if (isSelf) {
    return (
      <div className="flex justify-center">
        <button
          disabled
          title="You cannot modify your own administrative account rights or status."
          className="p-2 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100 opacity-60 transition-colors"
        >
          <ShieldAlert size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all cursor-pointer border border-transparent hover:border-gray-200/60"
      >
        <MoreVertical size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-1.5 origin-top-right"
            >
              <button
                onClick={() => {
                  changeStatus(user._id || user.id);
                  setOpen(false);
                }}
                className="w-full flex gap-3 items-center p-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                {user.status === "active" ? (
                  <>
                    <Ban size={16} />
                    Block Account
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Unblock Account
                  </>
                )}
              </button>

              <div className="h-px bg-gray-100 my-1" />

              <button
                onClick={() => {
                  makeRole(user._id || user.id, "donor");
                  setOpen(false);
                }}
                className="w-full flex gap-3 items-center p-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                <User size={16} />
                Make Donor
              </button>

              <button
                onClick={() => {
                  makeRole(user._id || user.id, "volunteer");
                  setOpen(false);
                }}
                className="w-full flex gap-3 items-center p-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                <UserRound size={16} />
                Make Volunteer
              </button>

              <button
                onClick={() => {
                  makeRole(user._id || user.id, "admin");
                  setOpen(false);
                }}
                className="w-full flex gap-3 items-center p-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 text-gray-700 hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                <UserCog size={16} />
                Make Admin
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
