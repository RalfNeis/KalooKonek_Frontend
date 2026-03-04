import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import KKALogin from "./pages/KKALogin";
import AdminDashboard from "./pages/KKAdashboard";
import VerifyUsers from "./pages/KKAverifyusers";
import Appointments from "./pages/KKAappointments";
import Announcements from "./pages/KKAannouncements";
import Logs from "./pages/KKAlogs";


export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <BrowserRouter>
      <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<KKALogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/verify-users" element={<VerifyUsers />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </BrowserRouter>
  );
}