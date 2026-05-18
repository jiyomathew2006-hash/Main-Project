import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Spinner from "../components/Spinner";
import { getStudents, deleteStudent } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const PER_PAGE = 5;

export default function Students() {
  const { user } = useAuth();
  const isAdmin = user.role === "admin";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);

  async function fetchStudents() {
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch {
      toast.error("Failed to load students.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStudents(); }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this student?")) return;
    await deleteStudent(id);
    toast.success("Student deleted!");
    fetchStudents();
  }

  const courses = [...new Set(students.map((s) => s.course))];
  const departments = [...new Set(students.map((s) => s.department))];

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchCourse = filterCourse ? s.course === filterCourse : true;
    const matchDept = filterDept ? s.department === filterDept : true;
    return matchSearch && matchCourse && matchDept;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const activeFiltersCount = [filterCourse, filterDept].filter(Boolean).length;

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">All Students</h2>
          <p className="text-sm text-slate-400 mt-1">{filtered.length} student{filtered.length !== 1 ? "s" : ""} found</p>
        </div>
        <Link
          to="/add-student"
          className="bg-slate-900 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm transition font-medium text-center"
        >
          + Add Student
        </Link>
      </div>

      <div className="flex gap-3 flex-wrap mb-4 items-center">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 flex-1 min-w-[150px] text-slate-800 placeholder-slate-400"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white hover:bg-slate-50 text-slate-700 font-medium transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filter
            {activeFiltersCount > 0 && (
              <span className="bg-slate-900 text-white text-xs rounded-full px-2 py-0.5">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {showFilter && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-10 p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Filter By</p>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Course</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 cursor-pointer bg-white"
                    value={filterCourse}
                    onChange={(e) => { setFilterCourse(e.target.value); setPage(1); }}
                  >
                    <option value="">All Courses</option>
                    {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                    <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800 cursor-pointer bg-white"
                    value={filterDept}
                    onChange={(e) => { setFilterDept(e.target.value); setPage(1); }}
                  >
                    <option value="">All Departments</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                    <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setFilterCourse(""); setFilterDept(""); setPage(1); setShowFilter(false); }}
                className="w-full text-xs text-red-500 hover:text-red-700 font-medium pt-1 cursor-pointer"
              >
                ✕ Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        {loading ? <Spinner /> : paginated.length === 0 ? (
          <p className="text-center py-10 text-slate-400 text-sm">No students found.</p>
        ) : (
          <table className="w-full text-sm min-w-[500px]">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3 text-left">Department</th>
                {isAdmin && <th className="px-4 py-3 text-left">Added By</th>}
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map((s, i) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3 text-slate-400">{(page - 1) * PER_PAGE + i + 1}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{s.name}</td>
                  <td className="px-4 py-3 text-slate-600">{s.course}</td>
                  <td className="px-4 py-3 text-slate-600">{s.department}</td>
                  {isAdmin && <td className="px-4 py-3 text-slate-400 text-xs">{s.createdBy}</td>}
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <Link
                        to={`/edit-student/${s.id}`}
                        className="px-3 py-1 rounded-lg text-xs font-medium text-white bg-slate-700 hover:bg-slate-900 transition"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(s.id)}
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-sm text-slate-700 font-medium transition"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                page === i + 1 ? "bg-slate-900 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-sm text-slate-700 font-medium transition"
          >
            Next
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}