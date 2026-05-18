import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Teachers from "./pages/Teachers";
import TeacherDashboard from "./pages/TeacherDashboard";
import Students from "./pages/Students";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";
import Courses from "./pages/Courses";
import Profile from "./pages/Profile";
import Admins from "./pages/Admins"; // FIX: was missing

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* FIX: use `roles` consistently (array form) for all protected routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/teachers" element={
            <ProtectedRoute roles={["admin"]}><Teachers /></ProtectedRoute>
          } />
          <Route path="/admins" element={
            <ProtectedRoute roles={["admin"]}><Admins /></ProtectedRoute>
          } />
          <Route path="/courses" element={
            <ProtectedRoute roles={["admin"]}><Courses /></ProtectedRoute>
          } />
          <Route path="/students" element={
            <ProtectedRoute roles={["admin", "teacher"]}><Students /></ProtectedRoute>
          } />
          <Route path="/add-student" element={
            <ProtectedRoute roles={["admin", "teacher"]}><AddStudent /></ProtectedRoute>
          } />
          <Route path="/edit-student/:id" element={
            <ProtectedRoute roles={["admin", "teacher"]}><EditStudent /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute roles={["admin", "teacher"]}><Profile /></ProtectedRoute>
          } />
          <Route path="/teacher-dashboard" element={
            <ProtectedRoute roles={["teacher"]}><TeacherDashboard /></ProtectedRoute>
          } />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}