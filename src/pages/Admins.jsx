import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import Spinner from "../components/Spinner";
import { getAdmins, addAdmin, deleteAdmin } from "../services/api";
import toast from "react-hot-toast";

export default function Admins() {
  const { user } = useAuth();                            
  const isSuperAdmin = user?.email === "admin@gmail.com"; 

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "" });
  const [adding, setAdding] = useState(false);

  async function fetchAdmins() {
    const res = await getAdmins();
    setAdmins(res.data);
    setLoading(false);
  }

  useEffect(() => { fetchAdmins(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!isSuperAdmin) { toast.error("Only the main admin can add admins!"); return; }
    if (!form.name || !form.email) { toast.error("Fill all fields!"); return; }
    const exists = admins.find((a) => a.email === form.email);
    if (exists) { toast.error("Admin email already exists!"); return; }
    setAdding(true);
    try {
      await addAdmin({ ...form, password: "", role: "admin", allowed: true });
      toast.success("Admin email added! They can now register.");
      setForm({ name: "", email: "" });
      fetchAdmins();
    } catch {
      toast.error("Failed to add admin.");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id) {
    if (!isSuperAdmin) { toast.error("Only the main admin can delete admins!"); return; }
    if (admins.length === 1) { toast.error("Cannot delete the last admin!"); return; }
    if (!window.confirm("Delete this admin?")) return;
    await deleteAdmin(id);
    toast.success("Admin deleted!");
    fetchAdmins();
  }

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Admins</h2>

      {isSuperAdmin && (
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <h3 className="text-lg font-semibold mb-1">Add New Admin</h3>
          <p className="text-sm text-gray-500 mb-3">
            They will register their own password at the register page.
          </p>
          <form onSubmit={handleAdd} className="flex gap-3 flex-wrap">
            <input
              type="text" placeholder="Admin Name"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 flex-1 min-w-[150px]"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email" placeholder="Admin Email"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 flex-1 min-w-[150px]"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <button
              type="submit" disabled={adding}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
            >
              {adding ? "Adding..." : "Add Admin"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-auto">
        {loading ? <Spinner /> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Registered</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map((a, i) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{a.name}</td>
                  <td className="px-4 py-3 text-gray-600">{a.email}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {a.password ? "✅ Yes" : "⏳ Pending"}
                  </td>
                  <td className="px-4 py-3">
                    {isSuperAdmin ? (
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="px-3 py-1 rounded text-xs font-medium text-white bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">No permission</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}