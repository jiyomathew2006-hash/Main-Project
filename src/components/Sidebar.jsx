import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";
import toast from "react-hot-toast";

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    toast.success("Logged out!");
    navigate("/login");
  }

  const currentPath = location.hash.replace(/^#/, "") || "/";

  const adminSections = [
    {
      title: "MENU",
      links: [
        { to: "/admin-dashboard", label: "Dashboard", icon: "🏠" },
        { to: "/students", label: "All Students", icon: "🎓" },
        { to: "/add-student", label: "Add Student", icon: "➕" },
      ],
    },
    {
      title: "ADMIN",
      links: [
        { to: "/teachers", label: "Manage Teachers", icon: "👨‍🏫" },
        { to: "/admins", label: "Manage Admins", icon: "🔑" },
        { to: "/courses", label: "Courses & Departments", icon: "📋" },
      ],
    },
    {
      title: "ACCOUNT",
      links: [
        { to: "/profile", label: "My Profile", icon: "👤" },
      ],
    },
  ];

  const teacherSections = [
    {
      title: "MENU",
      links: [
        { to: "/teacher-dashboard", label: "Dashboard", icon: "🏠" },
        { to: "/students", label: "Students", icon: "🎓" },
        { to: "/add-student", label: "Add Student", icon: "➕" },
      ],
    },
    {
      title: "ACCOUNT",
      links: [
        { to: "/profile", label: "My Profile", icon: "👤" },
      ],
    },
  ];

  const sections = user?.role === "admin" ? adminSections : teacherSections;

  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      
      <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between">
        <Link
          to={user?.role === "admin" ? "/admin-dashboard" : "/teacher-dashboard"}
          className="flex items-center gap-3 hover:opacity-80 transition"
          onClick={onClose}
        >
          <Logo size={34} />
          <div>
            <p className="text-sm font-bold text-white leading-none">Eduways</p>
            <p className="text-xs text-slate-400 mt-0.5 capitalize">{user?.role} Panel</p>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-5 overflow-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 px-2">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition font-medium ${
    
                    currentPath === link.to
                      ? "bg-white text-slate-900"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-700">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-sm bg-slate-700 hover:bg-red-600 text-white py-2 rounded-lg transition font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}