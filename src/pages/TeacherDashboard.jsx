import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Spinner from "../components/Spinner";
import { getStudents } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudents().then((res) => {
      setStudents(res.data);
      setLoading(false);
    });
  }, []);

  const total = students.length;
  const recent = [...students]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Teacher Dashboard</h2>
        <p className="text-sm text-slate-400 mt-1">Welcome back, {user?.name}</p>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 sm:p-5">
              <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">Total Students</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-800">{total}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-slate-800">Recently Added Students</h3>
                <p className="text-xs text-slate-400 mt-0.5">Last 5 students added</p>
              </div>
              <Link to="/students" className="text-xs text-slate-500 hover:text-slate-800 font-medium underline underline-offset-2 transition">
                View all →
              </Link>
            </div>

            {recent.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-10">No students added yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recent.map((s) => (
                  <li key={s.id} className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs sm:text-sm font-bold text-slate-600 shrink-0">
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{s.name}</p>
                        <p className="text-xs text-slate-400 truncate">{s.email}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium text-slate-600">{s.course}</p>
                      <p className="text-xs text-slate-400">{s.department}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-400">{total} student{total !== 1 ? "s" : ""} total</p>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}