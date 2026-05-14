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

const API_BASE_URL = "http://127.0.0.1:8000";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const fetchUser = async (accessToken) => {
    try {
      if (!accessToken) {
        setUser(null);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/accounts/profile/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const text = await response.text();
      console.log("Profile status:", response.status);
      console.log("Profile response:", text);

      let data = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        console.error("Profile returned non-JSON:", text);
        setUser(null);
        return;
      }

      if (!response.ok) {
        console.error("Profile fetch failed:", data);
        setUser(null);
        return;
      }

      setUser(data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);

        if (session?.access_token) {
          await fetchUser(session.access_token);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setSession(null);
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);

        if (session?.access_token) {
          await fetchUser(session.access_token);
        } else {
          setUser(null);
        }

        setCheckingAuth(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (checkingAuth) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
      }}>
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
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