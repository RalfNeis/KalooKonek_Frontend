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
import CreateAccount from "./pages/KKAcreateaccount";
import AccountManagement from "./pages/KKAaccountmanagement";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const buildFallbackUser = (sessionUser) => {
    return {
      full_name:
        sessionUser?.user_metadata?.full_name ||
        sessionUser?.user_metadata?.name ||
        sessionUser?.email ||
        "Guest",
      email: sessionUser?.email || "",
      role: sessionUser?.user_metadata?.role || "admin",
    };
  };

  const fetchUserProfile = async (currentSession) => {
    if (!currentSession?.access_token) {
      setUser(null);
      return;
    }

    // Temporary fallback so navbar has a name even if Django profile fails
    setUser(buildFallbackUser(currentSession.user));

    try {
      const response = await fetch(`${API_BASE_URL}/accounts/profile/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentSession.access_token}`,
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
        console.warn("Profile returned non-JSON response.");
        return;
      }

      if (!response.ok) {
        console.warn("Profile fetch failed, using fallback user:", data);
        return;
      }

      const normalizedUser = {
        ...data,
        full_name:
          data.full_name ||
          `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
          data.name ||
          data.email ||
          currentSession.user?.email ||
          "Guest",
        email: data.email || currentSession.user?.email || "",
        role: data.role || currentSession.user?.user_metadata?.role || "admin",
      };

      setUser(normalizedUser);
    } catch (error) {
      console.warn("Profile fetch failed, using fallback user:", error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setSession(session);

        if (session) {
          await fetchUserProfile(session);
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);

      if (newSession) {
        await fetchUserProfile(newSession);
      } else {
        setUser(null);
      }

      setCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
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
        <Route
          path="/login"
          element={!session ? <KKALogin /> : <Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard"
          element={session ? <AdminDashboard /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/verify-users"
          element={session ? <VerifyUsers /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/appointments"
          element={session ? <Appointments /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/announcements"
          element={session ? <Announcements /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/logs"
          element={session ? <Logs /> : <Navigate to="/login" replace />}
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/create-account"
          element={session ? <CreateAccount /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/accounts"
          element={session ? <AccountManagement /> : <Navigate to="/login" replace />}
        />
        
        </Routes>

        
    </BrowserRouter>
  );
}