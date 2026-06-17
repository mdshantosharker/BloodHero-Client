"use client";

import { useState } from "react";
import {
  MoreVertical,
  UserRound,
  UserCog,
  Ban,
  CheckCircle,
} from "lucide-react";

export default function AllUsersPage() {
  const [filter, setFilter] = useState("all");

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Rahim Hasan",
      email: "rahim@gmail.com",
      role: "donor",
      status: "active",
      image: "https://img.heroui.chat/image/avatar?w=400&h=400&u=3",
    },

    {
      id: 2,
      name: "Karim Ahmed",
      email: "karim@gmail.com",
      role: "volunteer",
      status: "blocked",
      image: "https://img.heroui.chat/image/avatar?w=400&h=400&u=3",
    },

    {
      id: 3,
      name: "Admin User",
      email: "admin@gmail.com",
      role: "admin",
      status: "active",
      image: "https://img.heroui.chat/image/avatar?w=400&h=400&u=3",
    },
  ]);

  const changeStatus = (id) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "blocked" : "active",
            }
          : user,
      ),
    );
  };

  const makeRole = (id, role) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? {
              ...user,
              role,
            }
          : user,
      ),
    );
  };

  const filteredUsers =
    filter === "all" ? users : users.filter((user) => user.status === filter);

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-red-500 to-rose-600 rounded-3xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">All Users</h1>

        <p className="text-red-100 mt-1">Manage users and permissions</p>
      </div>

      <div className="bg-white rounded-2xl border p-4 flex justify-between items-center">
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

      <div className="bg-white rounded-3xl border shadow overflow-x-auto">
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
              <tr key={user.id} className="border-t">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={user.image}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </td>

                <td className="p-4 text-gray-600">{user.email}</td>

                <td className="p-4">
                  <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 font-semibold">
                    {user.role}
                  </span>
                </td>

                <td className="p-4">
                  {user.status === "active" ? (
                    <span className="flex gap-2 items-center text-green-600 font-semibold">
                      <CheckCircle size={17} />
                      Active
                    </span>
                  ) : (
                    <span className="flex gap-2 items-center text-red-500 font-semibold">
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
        className="p-2 rounded-xl hover:bg-gray-100"
      >
        <MoreVertical />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border rounded-2xl shadow-xl z-50 p-2">
          <button
            onClick={() => changeStatus(user.id)}
            className="w-full flex gap-2 p-3 rounded-xl hover:bg-red-50"
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
            onClick={() => makeRole(user.id, "volunteer")}
            className="w-full flex gap-2 p-3 rounded-xl hover:bg-red-50"
          >
            <UserRound size={18} />
            Make Volunteer
          </button>

          <button
            onClick={() => makeRole(user.id, "admin")}
            className="w-full flex gap-2 p-3 rounded-xl hover:bg-red-50"
          >
            <UserCog size={18} />
            Make Admin
          </button>
        </div>
      )}
    </div>
  );
}
