import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Navbar from "./components/Navbar";
import KKALogin from "./pages/KKALogin";
import AdminDashboard from "./pages/KKAdashboard";
import VerifyUsers from "./pages/KKAverifyusers";
import Appointments from "./pages/KKAappointments";
import Announcements from "./pages/KKAannouncements";
import Logs from "./pages/KKAlogs";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null); // 👈 ADD THIS

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUser(session.access_token); // 👈 ADD THIS
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUser(session.access_token); // 👈 ADD THIS
      else setUser(null); // 👈 Clear user on logout
    });

    return () => subscription.unsubscribe();
  }, []);

  // 👇 ADD THIS FUNCTION — fetches name/role from Django
  const fetchUser = async (token) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/accounts/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user); // { full_name, role, display_id, ... }
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  return (
    <BrowserRouter>
      {/* 👇 Pass user into Navbar */}
      {session && (
        <Navbar
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(!darkMode)}
          user={user}
        />
      )}

      <Routes>
        <Route path="/login" element={!session ? <KKALogin /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={session ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/verify-users" element={session ? <VerifyUsers /> : <Navigate to="/login" />} />
        <Route path="/appointments" element={session ? <Appointments /> : <Navigate to="/login" />} />
        <Route path="/announcements" element={session ? <Announcements /> : <Navigate to="/login" />} />
        <Route path="/logs" element={session ? <Logs /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}