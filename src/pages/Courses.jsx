import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { getCourses, addCourse, deleteCourse, getDepartments, addDepartment, deleteDepartment } from "../services/api";
import toast from "react-hot-toast";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [deptName, setDeptName] = useState("");
  const [addingCourse, setAddingCourse] = useState(false);
  const [addingDept, setAddingDept] = useState(false);

  async function fetchAll() {
    const [cRes, dRes] = await Promise.all([getCourses(), getDepartments()]);
    setCourses(cRes.data);
    setDepartments(dRes.data);
  }

  useEffect(() => { fetchAll(); }, []);

  async function handleAddCourse(e) {
    e.preventDefault();
    if (!courseName.trim()) { toast.error("Enter a course name!"); return; }
    const exists = courses.find((c) => c.name.toLowerCase() === courseName.toLowerCase());
    if (exists) { toast.error("Course already exists!"); return; }
    setAddingCourse(true);
    try {
      await addCourse({ name: courseName.trim() });
      toast.success("Course added!");
      setCourseName("");
      fetchAll();
    } catch {
      toast.error("Failed to add course.");
    } finally {
      setAddingCourse(false);
    }
  }

  async function handleAddDept(e) {
    e.preventDefault();
    if (!deptName.trim()) { toast.error("Enter a department name!"); return; }
    const exists = departments.find((d) => d.name.toLowerCase() === deptName.toLowerCase());
    if (exists) { toast.error("Department already exists!"); return; }
    setAddingDept(true);
    try {
      await addDepartment({ name: deptName.trim() });
      toast.success("Department added!");
      setDeptName("");
      fetchAll();
    } catch {
      toast.error("Failed to add department.");
    } finally {
      setAddingDept(false);
    }
  }

  async function handleDeleteCourse(id) {
    if (!window.confirm("Delete this course?")) return;
    await deleteCourse(id);
    toast.success("Course deleted!");
    fetchAll();
  }

  async function handleDeleteDept(id) {
    if (!window.confirm("Delete this department?")) return;
    await deleteDepartment(id);
    toast.success("Department deleted!");
    fetchAll();
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Courses & Departments</h2>
        <p className="text-sm text-slate-400 mt-1">Manage available courses and departments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      
        <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
         
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800 mb-3">Courses</h3>
            <form onSubmit={handleAddCourse} className="flex gap-2">
              <input
                type="text" placeholder="e.g. BCA"
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 flex-1 text-slate-800 placeholder-slate-400"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />
              <button type="submit" disabled={addingCourse}
                className="bg-slate-900 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition font-medium cursor-pointer">
                {addingCourse ? "..." : "Add"}
              </button>
            </form>
          </div>

         
          <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
            {courses.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-8">No courses added yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {courses.map((c, i) => (
                  <li key={c.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-5">{i + 1}</span>
                      <span className="text-sm font-medium text-slate-800">{c.name}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteCourse(c.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer transition"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

         
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-400">{courses.length} course{courses.length !== 1 ? "s" : ""} total</p>
          </div>
        </div>

      
        <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-base font-semibold text-slate-800 mb-3">Departments</h3>
            <form onSubmit={handleAddDept} className="flex gap-2">
              <input
                type="text" placeholder="e.g. Computer Applications"
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 flex-1 text-slate-800 placeholder-slate-400"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
              />
              <button type="submit" disabled={addingDept}
                className="bg-slate-900 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm transition font-medium cursor-pointer">
                {addingDept ? "..." : "Add"}
              </button>
            </form>
          </div>

        
          <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
            {departments.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-8">No departments added yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {departments.map((d, i) => (
                  <li key={d.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 w-5">{i + 1}</span>
                      <span className="text-sm font-medium text-slate-800">{d.name}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteDept(d.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium cursor-pointer transition"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-400">{departments.length} department{departments.length !== 1 ? "s" : ""} total</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}