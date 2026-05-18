import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Spinner from "../components/Spinner";
import { getStudentById, updateStudent, getCourses, getDepartments } from "../services/api";
import toast from "react-hot-toast";

export default function EditStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "", age: "", course: "", department: "", email: "", phone: "",
  });

  useEffect(() => {
    Promise.all([
      getStudentById(id),
      getCourses(),
      getDepartments(),
    ]).then(([studentRes, coursesRes, deptsRes]) => {
      const { name, age, course, department, email, phone } = studentRes.data;
      setForm({ name, age, course, department, email, phone });
      setCourses(coursesRes.data);
      setDepartments(deptsRes.data);
      setLoading(false);
    });
  }, [id]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStudent(id, { ...form, age: Number(form.age) });
      toast.success("Student updated!");
      navigate("/students");
    } catch {
      toast.error("Update failed.");
    } finally {
      setSaving(false);
    }
  }

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "e.g. Arjun Kumar" },
    { name: "age", label: "Age", type: "number", placeholder: "e.g. 20" },
    { name: "email", label: "Email", type: "email", placeholder: "e.g. arjun@gmail.com" },
    { name: "phone", label: "Phone", type: "text", placeholder: "e.g. 9876543210" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Edit Student</h2>
        <p className="text-sm text-slate-400 mt-1">Update the student's information</p>
      </div>

      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 max-w-2xl">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{f.label}</label>
                <input
                  type={f.type} name={f.name} required
                  placeholder={f.placeholder}
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                  value={form[f.name]}
                  onChange={change}
                />
              </div>
            ))}

           
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Course</label>
              <div className="relative">
                <select
                  name="course" required
                  className="w-full appearance-none border border-slate-300 rounded-lg px-4 py-2.5 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer bg-white text-sm"
                  value={form.course}
                  onChange={change}
                >
                  <option value="" disabled hidden>Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
              <div className="relative">
                <select
                  name="department" required
                  className="w-full appearance-none border border-slate-300 rounded-lg px-4 py-2.5 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer bg-white text-sm"
                  value={form.department}
                  onChange={change}
                >
                  <option value="" disabled hidden>Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="bg-slate-900 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg transition font-medium text-sm cursor-pointer">
                {saving ? "Saving..." : "Update Student"}
              </button>
              <button type="button" onClick={() => navigate("/students")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-lg transition font-medium text-sm cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
}