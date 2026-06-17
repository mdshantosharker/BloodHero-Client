"use client";

import { useEffect, useState } from "react";
import {
  MoreVertical,
  UserRound,
  UserCog,
  Ban,
  CheckCircle,
} from "lucide-react";

import { getAllUsers } from "@/lib/api/users/allUsers";
import { updateUserStatus } from "@/lib/api/users/action";
import { toast } from "@heroui/react";

export default function AllUsersPage() {
  const [filter, setFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const changeStatus = async (id) => {
    const currentUser = users.find((user) => (user._id || user.id) === id);

    const newStatus = currentUser.status === "active" ? "blocked" : "active";

    try {
      await updateUserStatus(
        {
          status: newStatus,
        },
        id,
      );

      setUsers((prev) =>
        prev.map((user) =>
          (user._id || user.id) === id
            ? {
                ...user,
                status: newStatus,
              }
            : user,
        ),
      );

      toast.success(`Role changed to ${newStatus}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const makeRole = async (id, role) => {
    try {
      await updateUserStatus(
        {
          role,
        },
        id,
      );

      setUsers((prev) =>
        prev.map((user) =>
          (user._id || user.id) === id
            ? {
                ...user,
                role,
              }
            : user,
        ),
      );

      toast.success(`Role changed to ${role}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const filteredUsers =
    filter === "all" ? users : users.filter((user) => user.status === filter);

  if (loading) {
    return <div className="p-10 font-bold">Loading Users...</div>;
  }

  return (
    <div className="space-y-6">
      <div
        className="
bg-linear-to-r from-red-500 to-rose-600
rounded-3xl p-6 text-white shadow-lg
"
      >
        <h1 className="text-3xl font-bold">All Users</h1>

        <p className="text-red-100">Manage users and permissions</p>
      </div>

      <div
        className="
bg-white rounded-2xl border p-4
flex justify-between items-center
"
      >
        <h2 className="font-bold">Users List</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-xl p-2"
        >
          <option value="all">All</option>

          <option value="active">Active</option>

          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div
        className="
bg-white rounded-3xl border shadow
overflow-x-auto
"
      >
        <table className="w-full min-w-200">
          <thead className="bg-red-50">
            <tr>
              <th className="p-4 text-left">User</th>

              <th className="p-4">Email</th>

              <th className="p-4">Role</th>

              <th className="p-4">Status</th>

              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id || user.id} className="border-t">
                <td className="p-4 flex gap-3 items-center">
                  <img
                    src={
                      user.image ||
                      "https://img.heroui.chat/image/avatar?w=400&h=400&u=3"
                    }
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-semibold">{user.name}</p>

                    <p className="text-sm text-red-500">
                      Blood: {user.bloodGroup || "N/A"}
                    </p>
                  </div>
                </td>

                <td className="p-4">{user.email}</td>

                <td className="p-4">
                  <span
                    className="
px-3 py-1 rounded-full
bg-red-50 text-red-600
font-semibold
"
                  >
                    {user.role}
                  </span>
                </td>

                <td className="p-4">
                  {user.status === "active" ? (
                    <span
                      className="
flex gap-2 items-center
text-green-600 font-semibold
"
                    >
                      <CheckCircle size={17} />
                      Active
                    </span>
                  ) : (
                    <span
                      className="
flex gap-2 items-center
text-red-500 font-semibold
"
                    >
                      <Ban size={17} />
                      Blocked
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <ActionMenu
                    user={user}
                    changeStatus={changeStatus}
                    makeRole={makeRole}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionMenu({ user, changeStatus, makeRole }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="
p-2 rounded-xl
hover:bg-gray-100
transition
"
      >
        <MoreVertical />
      </button>

      {open && (
        <div
          className="
absolute right-0
top-full mt-3
w-56
bg-white
border
rounded-2xl
shadow-2xl
z-999
p-2
animate-in
"
        >
          <button
            onClick={() => {
              changeStatus(user._id || user.id);
              setOpen(false);
            }}
            className="
w-full flex gap-3 items-center
p-3 rounded-xl
hover:bg-red-50
"
          >
            {user.status === "active" ? (
              <>
                <Ban size={18} />
                Block
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Unblock
              </>
            )}
          </button>

          <button
            onClick={() => {
              makeRole(user._id || user.id, "volunteer");

              setOpen(false);
            }}
            className="
w-full flex gap-3
p-3 rounded-xl
hover:bg-red-50
"
          >
            <UserRound size={18} />
            Make Volunteer
          </button>

          <button
            onClick={() => {
              makeRole(user._id || user.id, "admin");

              setOpen(false);
            }}
            className="
w-full flex gap-3
p-3 rounded-xl
hover:bg-red-50
"
          >
            <UserCog size={18} />
            Make Admin
          </button>
        </div>
      )}
    </div>
  );
}
