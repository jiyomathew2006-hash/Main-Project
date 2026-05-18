import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { addStudent, getCourses, getDepartments } from "../services/api";
import { useAuth } from "../context/AuthContext";
import CustomSelect from "../components/CustomSelect";
import toast from "react-hot-toast";

export default function AddStudent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "", age: "", course: "", department: "", email: "", phone: "",
  });

  useEffect(() => {
    getCourses().then((res) => setCourses(res.data));
    getDepartments().then((res) => setDepartments(res.data));
  }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await addStudent({
        ...form,
        age: Number(form.age),
        blocked: false,
        createdBy: user.email,
        createdAt: new Date().toISOString(),
      });
      toast.success("Student added!");
      navigate("/students");
    } catch {
      toast.error("Failed to add student.");
    } finally {
      setLoading(false);
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
        <h2 className="text-2xl font-bold text-slate-800">Add New Student</h2>
        <p className="text-sm text-slate-400 mt-1">Fill in the details to add a new student</p>
      </div>

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
            <CustomSelect
              name="course"
              value={form.course}
              onChange={change}
              placeholder="Select Course"
              required
              options={courses.map((c) => ({ value: c.name, label: c.name }))}
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
            <CustomSelect
              name="department"
              value={form.department}
              onChange={change}
              placeholder="Select Department"
              required
              options={departments.map((d) => ({ value: d.name, label: d.name }))}
            />
          </div>

          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="bg-slate-900 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg transition font-medium text-sm cursor-pointer">
              {loading ? "Adding..." : "Add Student"}
            </button>
            <button type="button" onClick={() => navigate("/students")}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2.5 rounded-lg transition font-medium text-sm cursor-pointer">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}