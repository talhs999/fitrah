"use client";

import { useState } from "react";
import { Search, Filter, Trash2, Shield, User } from "lucide-react";
import { deleteCustomer } from "./actions";

export default function CustomersClient({ users }: { users: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.email?.toLowerCase().includes(term) ||
      user.user_metadata?.full_name?.toLowerCase().includes(term)
    );
  });

  const handleDelete = async (id: string, email: string) => {
    if (confirm(`Are you sure you want to delete ${email}? This action cannot be undone.`)) {
      setIsDeleting(id);
      try {
        const res = await deleteCustomer(id);
        if (res && res.success === false) {
          alert(`Failed to delete user: ${res.error}. (Tip: If they have orders, you cannot delete them without deleting their orders first)`);
        }
      } catch (err: any) {
        alert(`Failed to delete user: ${err.message}`);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 border border-black/10 rounded-sm">
        <div>
          <h1 className="font-serif text-3xl text-brand-black mb-1">Customers</h1>
          <p className="font-sans text-sm text-brand-muted">Manage registered users and admins</p>
        </div>
        <div className="bg-black/5 px-4 py-2 rounded-md font-sans text-xs uppercase tracking-widest font-semibold text-brand-black">
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-white border border-black/10 rounded-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-black/10 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#faf9f6] border border-black/10 rounded-md font-sans text-sm focus:outline-none focus:border-brand-black transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 text-brand-muted hover:text-brand-black font-sans text-sm transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-black/5 text-brand-muted text-xs uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-semibold">User / Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Joined On</th>
                <th className="px-6 py-4 font-semibold">Last Sign In</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-brand-muted">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user: any) => {
                  const isAdmin = user.email === "admin@fitrah.com";
                  return (
                    <tr key={user.id} className="hover:bg-black/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-brand-muted">
                            {isAdmin ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="text-brand-black font-medium">{user.user_metadata?.full_name || "N/A"}</div>
                            <div className="text-brand-muted text-[11px] mt-0.5">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-sm text-[9px] uppercase tracking-widest font-bold ${isAdmin ? "bg-black text-white" : "bg-black/5 text-brand-muted"}`}>
                          {isAdmin ? "Admin" : "Customer"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-brand-muted">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-brand-muted">
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : "Never"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(user.id, user.email)}
                          disabled={isDeleting === user.id || isAdmin}
                          title={isAdmin ? "Cannot delete the main admin account" : "Delete user"}
                          className="p-2 text-brand-muted hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
