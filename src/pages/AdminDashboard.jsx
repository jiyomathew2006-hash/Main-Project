import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Spinner from "../components/Spinner";
import { getTeachers, getStudents } from "../services/api";

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTeachers(), getStudents()])
      .then(([tRes, sRes]) => {
        setTeachers(tRes.data);
        setStudents(sRes.data);
      })
      .catch(() => {
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalTeachers = teachers.length;
  const activeTeachers = teachers.filter((t) => t.allowed).length;
  const blockedTeachers = teachers.filter((t) => !t.allowed).length;
  const totalStudents = students.length;

  return (
    <DashboardLayout>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Admin Dashboard</h2>
        <p className="text-sm text-slate-400 mt-1">Overview of your institution</p>
      </div>

      {loading ? <Spinner /> : (
        <div className="space-y-6 sm:space-y-8">

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Teachers</p>
              <Link to="/teachers" className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 transition">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 sm:p-5">
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">Total Teachers</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800">{totalTeachers}</p>
              </div>
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 sm:p-5">
                <p className="text-xs sm:text-sm font-medium text-emerald-700 mb-2">Active Teachers</p>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-800">{activeTeachers}</p>
              </div>
              <div className="rounded-xl border border-red-100 bg-red-50 p-4 sm:p-5">
                <p className="text-xs sm:text-sm font-medium text-red-600 mb-2">Blocked Teachers</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-800">{blockedTeachers}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Students</p>
              <Link to="/students" className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2 transition">
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-100 p-4 sm:p-5">
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-2">Total Students</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800">{totalStudents}</p>
              </div>
            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
}