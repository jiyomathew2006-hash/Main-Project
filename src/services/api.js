import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000"
});

export const getAdmins = () => API.get("/admins");
export const addAdmin = (data) => API.post("/admins", data);
export const updateAdmin = (id, data) => API.patch(`/admins/${id}`, data); // FIX: was missing
export const deleteAdmin = (id) => API.delete(`/admins/${id}`);

export const getTeachers = () => API.get("/teachers");
export const addTeacher = (data) => API.post("/teachers", data);
export const updateTeacher = (id, data) => API.patch(`/teachers/${id}`, data);
export const deleteTeacher = (id) => API.delete(`/teachers/${id}`);
export const getTeacherByEmail = (email) => API.get(`/teachers?email=${email}`);

export const getStudents = () => API.get("/students");
export const addStudent = (data) => API.post("/students", data);
export const updateStudent = (id, data) => API.patch(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);
export const getStudentById = (id) => API.get(`/students/${id}`);

export const getCourses = () => API.get("/courses");
export const addCourse = (data) => API.post("/courses", data);
export const deleteCourse = (id) => API.delete(`/courses/${id}`);

export const getDepartments = () => API.get("/departments");
export const addDepartment = (data) => API.post("/departments", data);
export const deleteDepartment = (id) => API.delete(`/departments/${id}`);