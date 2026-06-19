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
} from "lucide-react";

import { useSession } from "@/lib/auth-client";
import { getAllUsers } from "@/lib/api/users/allUsers";
import { updateUserStatus } from "@/lib/api/users/action";
import { toast } from "@heroui/react";

export default function AllUsersPage() {
  const { data: session } = useSession();
  const currentUserEmail = session?.user?.email;

  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data || []);
      } catch (error) {
        toast.error(error.message || "Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

      toast.success(`User status changed to ${newStatus}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const makeRole = async (id, role) => {
    try {
      await updateUserStatus({ role }, id);

      setUsers((prev) =>
        prev.map((user) =>
          (user._id || user.id) === id ? { ...user, role } : user,
        ),
      );

      toast.success(`Role changed to ${role} 🎉`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredUsers =
    filter === "all" ? users : users.filter((user) => user.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        <span className="ml-3 font-bold text-gray-600">Loading Users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-linear-to-r from-red-600 via-red-500 to-rose-500 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex gap-4 items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              All Users 👥
            </h1>
            <p className="text-red-100 text-sm mt-1 font-medium opacity-90">
              Admin Panel • Manage user accounts, block list, and assign roles.
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
            className="border border-gray-200 bg-gray-50/50 rounded-xl p-2 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="blocked">Blocked Only</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-200 text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-200/60 text-gray-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 pl-6">User Details</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">System Role</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-center pr-6">Management</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
              {filteredUsers.map((user) => {
                const isSelf =
                  currentUserEmail && user.email === currentUserEmail;

                return (
                  <tr
                    key={user._id || user.id}
                    className={`transition-colors duration-150 ${
                      isSelf
                        ? "bg-amber-50/30 hover:bg-amber-50/50"
                        : "hover:bg-red-50/20"
                    }`}
                  >
                    <td className="p-4 pl-6">
                      <div className="flex gap-3 items-center">
                        <div className="relative">
                          <img
                            src={
                              user.image ||
                              "https://img.heroui.chat/image/avatar?w=400&h=400&u=3"
                            }
                            alt={user.name}
                            className={`w-11 h-11 rounded-full object-cover border-2 ${
                              isSelf ? "border-amber-400" : "border-gray-100"
                            }`}
                          />
                          {isSelf && (
                            <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wide border-2 border-white shadow-xs">
                              You
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="font-bold text-gray-900 flex items-center gap-1.5 text-base">
                            {user.name}
                          </p>
                          <p className="text-xs text-red-500 font-bold tracking-wide">
                            🩸 Blood Group: {user.bloodGroup || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-gray-600">
                      {user.email}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs capitalize border border-red-100/60 shadow-2xs">
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
          className="p-2 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100 opacity-60 hover:text-amber-500 transition-colors"
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

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 p-1.5 animate-fade-in origin-top-right">
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
          </div>
        </>
      )}
    </div>
  );
}
