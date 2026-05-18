import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getTeacherByEmail, updateTeacher } from "../services/api";
import PasswordInput from "../components/PasswordInput";
import Logo from "../components/Logo";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords don't match!"); return;
    }
    setLoading(true);
    try {
      const res = await getTeacherByEmail(form.email);
      const teacher = res.data[0];
      if (!teacher) { toast.error("Your email is not registered by admin!"); return; }
      if (teacher.password) { toast.error("Account already exists! Please login."); return; }
      if (!teacher.allowed) { toast.error("Your account is blocked by admin!"); return; }
      await updateTeacher(teacher.id, { password: form.password });
      toast.success("Registered! Please login.");
      navigate("/login");
    } catch {
      toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      <div className="w-full lg:w-1/2 bg-slate-900 flex flex-col justify-center items-start px-8 sm:px-16 py-10 lg:py-12">
        <div className="flex items-center gap-4 mb-6 lg:mb-8">
          <Logo size={48} />
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">Eduways</h1>
        </div>
        <p className="text-slate-400 text-base sm:text-lg mb-6 lg:mb-8 leading-relaxed max-w-md">
          Create your teacher account and start managing your students efficiently.
        </p>
        <div className="space-y-4 w-full max-w-md">
          {[
            "Admin must add your email first",
            "Set your own secure password",
            "Login and manage your students",
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

      {/* Register form — below intro on mobile, right side on desktop */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-slate-50 px-6 sm:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-slate-800">Create account</h2>
              <p className="text-sm text-slate-400 mt-1">Register as a teacher to get started</p>
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                <PasswordInput
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-slate-900 hover:bg-slate-700 text-white font-semibold py-2.5 rounded-lg transition text-sm"
              >
                {loading ? "Registering..." : "Create Account"}
              </button>
            </form>

            <p className="text-sm text-center text-slate-400 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-slate-700 hover:text-slate-900 font-medium underline underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}