import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import Spinner from "../components/Spinner";
import { getTeachers, addTeacher, updateTeacher, deleteTeacher } from "../services/api";
import toast from "react-hot-toast";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "" });
  const [adding, setAdding] = useState(false);

  async function fetchTeachers() {
    const res = await getTeachers();
    setTeachers(res.data);
    setLoading(false);
  }

  useEffect(() => { fetchTeachers(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.name || !form.email) { toast.error("Fill all fields!"); return; }
    const exists = teachers.find((t) => t.email === form.email);
    if (exists) { toast.error("Teacher email already exists!"); return; }
    setAdding(true);
    try {
      await addTeacher({ ...form, password: "", allowed: true, role: "teacher" });
      toast.success("Teacher added!");
      setForm({ name: "", email: "" });
      fetchTeachers();
    } catch {
      toast.error("Failed to add teacher.");
    } finally {
      setAdding(false);
    }
  }

  async function toggleAllow(teacher) {
    await updateTeacher(teacher.id, { allowed: !teacher.allowed });
    toast.success(`Teacher ${teacher.allowed ? "blocked" : "unblocked"}!`);
    fetchTeachers();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this teacher?")) return;
    await deleteTeacher(id);
    toast.success("Teacher deleted!");
    fetchTeachers();
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Manage Teachers</h2>
        <p className="text-sm text-slate-400 mt-1">Add and manage teacher accounts</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
        <h3 className="text-base font-semibold text-slate-800 mb-3">Add New Teacher</h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text" placeholder="Teacher Name"
            className="border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 flex-1 text-slate-800 placeholder-slate-400"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email" placeholder="Teacher Email"
            className="border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 flex-1 text-slate-800 placeholder-slate-400"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <button
            type="submit" disabled={adding}
            className="bg-slate-900 hover:bg-slate-700 text-white px-5 py-2.5 rounded-lg transition font-medium text-sm"
          >
            {adding ? "Adding..." : "Add Teacher"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        {loading ? <Spinner /> : teachers.length === 0 ? (
          <p className="text-center py-10 text-slate-400 text-sm">No teachers added yet.</p>
        ) : (
          <table className="w-full text-sm min-w-[520px]">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Registered</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map((t, i) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{t.name}</td>
                  <td className="px-4 py-3 text-slate-600">{t.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      t.allowed
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}>
                      {t.allowed ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {t.password ? "✅ Yes" : "⏳ Pending"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => toggleAllow(t)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium text-white transition ${
                          t.allowed
                            ? "bg-amber-500 hover:bg-amber-600"
                            : "bg-emerald-500 hover:bg-emerald-600"
                        }`}
                      >
                        {t.allowed ? "Block" : "Allow"}
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="px-3 py-1 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
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