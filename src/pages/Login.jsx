import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAdmins, getTeacherByEmail } from "../services/api";
import PasswordInput from "../components/PasswordInput";
import Logo from "../components/Logo";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const adminsRes = await getAdmins();
      const admin = adminsRes.data.find(
        (a) => a.email === form.email && a.password === form.password
      );
      if (admin) {
        login(admin);
        toast.success("Welcome Admin!");
        navigate("/admin-dashboard");
        return;
      }
      const teacherRes = await getTeacherByEmail(form.email);
      const teacher = teacherRes.data[0];
      if (!teacher) { toast.error("Email not found!"); return; }
      if (teacher.password !== form.password) { toast.error("Wrong password!"); return; }
      if (!teacher.allowed) { toast.error("Your account is blocked by admin!"); return; }
      login(teacher);
      toast.success("Welcome Teacher!");
      navigate("/teacher-dashboard");
    } catch {
      toast.error("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* Intro section — shown on top on mobile, left side on desktop */}
      <div className="w-full lg:w-1/2 bg-slate-900 flex flex-col justify-center items-start px-8 sm:px-16 py-10 lg:py-12">
        <div className="flex items-center gap-4 mb-6 lg:mb-8">
          <Logo size={48} />
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">Eduways</h1>
        </div>
        <p className="text-slate-400 text-base sm:text-lg mb-6 lg:mb-8 leading-relaxed max-w-md">
          A simple and powerful student management system for admins and teachers.
        </p>
        <div className="space-y-4 w-full max-w-md">
          {[
            "Manage students, teachers and courses",
            "Track active and blocked accounts",
            "Role-based access for admin and teachers",
          ].map((text) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white shrink-0">✓</div>
              <p className="text-slate-300 text-sm">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-slate-700 w-full max-w-md">
          <p className="text-slate-500 text-xs">© 2025 Eduways. All rights reserved.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-slate-50 px-6 sm:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
              <p className="text-sm text-slate-400 mt-1">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email" required
                  placeholder="you@example.com"
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <PasswordInput
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-lg transition text-sm"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-sm text-center text-slate-400 mt-6">
              New Teacher?{" "}
              <Link to="/register" className="text-slate-700 hover:text-slate-900 font-medium underline underline-offset-2">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}