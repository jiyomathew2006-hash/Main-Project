import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import { updateTeacher, updateAdmin } from "../services/api";
import PasswordInput from "../components/PasswordInput";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, login } = useAuth();
  const isAdmin = user?.role === "admin";

  const [nameForm, setNameForm] = useState({ name: user?.name || "" });
  const [passForm, setPassForm] = useState({ current: "", newPass: "", confirm: "" });
  const [savingName, setSavingName] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  async function handleNameUpdate(e) {
    e.preventDefault();
    if (!nameForm.name.trim()) { toast.error("Name cannot be empty!"); return; }
    setSavingName(true);
    try {
      if (isAdmin) {
        await updateAdmin(user.id, { name: nameForm.name });
      } else {
        await updateTeacher(user.id, { name: nameForm.name });
      }
      login({ ...user, name: nameForm.name });
      toast.success("Name updated!");
    } catch {
      toast.error("Failed to update name.");
    } finally {
      setSavingName(false);
    }
  }

  async function handlePasswordUpdate(e) {
    e.preventDefault();
    if (passForm.current !== user.password) { toast.error("Current password is wrong!"); return; }
    if (passForm.newPass !== passForm.confirm) { toast.error("Passwords don't match!"); return; }
    if (passForm.newPass.length < 4) { toast.error("Password too short!"); return; }
    setSavingPass(true);
    try {
      if (isAdmin) {
        await updateAdmin(user.id, { password: passForm.newPass });
      } else {
        await updateTeacher(user.id, { password: passForm.newPass });
      }
      login({ ...user, password: passForm.newPass });
      toast.success("Password updated!");
      setPassForm({ current: "", newPass: "", confirm: "" });
    } catch {
      toast.error("Failed to update password.");
    } finally {
      setSavingPass(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">My Profile</h2>
        <p className="text-sm text-slate-400 mt-1">Manage your account settings</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 max-w-3xl mb-6 flex items-center gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-900 flex items-center justify-center text-lg sm:text-xl font-bold text-white shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm sm:text-base font-semibold text-slate-800">{user?.name}</p>
          <p className="text-xs sm:text-sm text-slate-400 truncate">{user?.email}</p>
          <span className="inline-block mt-1 text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize">
            {user?.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl">

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-1">Update Name</h3>
          <p className="text-xs text-slate-400 mb-4">Email cannot be changed.</p>
          <form onSubmit={handleNameUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email" disabled value={user?.email}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-400 cursor-not-allowed text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text" required
                placeholder="Enter your name"
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                value={nameForm.name}
                onChange={(e) => setNameForm({ name: e.target.value })}
              />
            </div>
            <button type="submit" disabled={savingName}
              className="w-full bg-slate-900 hover:bg-slate-700 text-white py-2.5 rounded-lg transition font-medium text-sm">
              {savingName ? "Saving..." : "Update Name"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-slate-800 mb-1">Change Password</h3>
          <p className="text-xs text-slate-400 mb-4">Enter your current password to update it.</p>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
              <PasswordInput
                value={passForm.current}
                onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <PasswordInput
                value={passForm.newPass}
                onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
              <PasswordInput
                value={passForm.confirm}
                onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
              />
            </div>
            <button type="submit" disabled={savingPass}
              className="w-full bg-slate-900 hover:bg-slate-700 text-white py-2.5 rounded-lg transition font-medium text-sm">
              {savingPass ? "Saving..." : "Change Password"}
            </button>
          </form>
        </div>

      </div>
    </DashboardLayout>
  );
}