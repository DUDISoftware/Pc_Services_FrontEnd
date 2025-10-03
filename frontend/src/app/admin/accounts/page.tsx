"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";

type Profile = {
  username: string;
  password: string;
  role: string;
};

type User = {
  _id: string;
  username: string;
  role: string;
};

export default function ProfilePage() {
  const [tab, setTab] = useState<"create" | "list">("create");

  const [profile, setProfile] = useState<Profile>({
    username: "",
    password: "",
    role: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await userService.getAllUsers(); // Implement this in service
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    if (tab === "list") fetchUsers();
  }, [tab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await userService.createAccount(profile);
      setSuccess("Account created successfully.");
      setProfile({ username: "", password: "", role: "" });
    } catch {
      setError("Failed to create account.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch {
      alert("Xoá thất bại");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("create")}
          className={`px-4 py-2 rounded ${
            tab === "create" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Tạo tài khoản mới
        </button>
        <button
          onClick={() => setTab("list")}
          className={`px-4 py-2 rounded ${
            tab === "list" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Quản lý tài khoản
        </button>
      </div>

      {/* Form tạo tài khoản */}
      {tab === "create" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label htmlFor="role" className="block mb-1 font-medium">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={profile.role}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={saving}
          >
            {saving ? "Saving..." : "Tạo tài khoản"}
          </button>
          {error && <div className="text-red-600 mt-2">{error}</div>}
          {success && <div className="text-green-600 mt-2">{success}</div>}
        </form>
      )}

      {/* Bảng tài khoản */}
      {tab === "list" && (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full table-auto text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Remove</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    Không có tài khoản nào.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleRemove(user._id)}
                        className="text-red-600 hover:underline"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
