import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './features/Navbar';
import HeaderActions from './features/HeaderActions';
import Dashboard from './features/Dashboard';
import PatientDirectory from './features/PatientDirectory';
import Appointments from './features/Appointments';
import Settings from './features/Settings';
import Login from './features/KKALogin';
import Consultation from './features/Consultation';
import QRScanner from './features/Qrscanner';
import "tailwindcss";

const ProtectedRoute = ({ user, children }: { user: any; children: React.ReactNode }) => {
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const DashboardWrapper = ({ user, onSearch, searchTerm }: {
  user: any;
  onSearch: (val: string) => void;
  searchTerm: string;
}) => {
  const [showQRScanner, setShowQRScanner] = useState(false);
  // Shared selected-patient state so QRScanner result flows into Dashboard
  const [qrPatient, setQrPatient] = useState<any>(null);

  return (
    <main className="max-w-6xl mx-auto px-6 space-y-8 mt-8">
      {/* Camera QR Scanner modal — triggered by the big red card */}
      {showQRScanner && (
        <QRScanner
          mode="modal"
          onClose={() => setShowQRScanner(false)}
          onPatientFound={(p) => {
            setQrPatient(p);        // pass result down to Dashboard
            setShowQRScanner(false);
          }}
        />
      )}

      <HeaderActions
        adminName={user?.full_name || user?.username || "Admin"}
        onSearch={onSearch}
        onScanQR={() => setShowQRScanner(true)} // ← wires the big red button
      />

      <Dashboard
        externalSearchTerm={searchTerm}
        qrPatient={qrPatient}           // ← Dashboard consumes this
        onQrPatientConsumed={() => setQrPatient(null)}
      />
    </main>
  );
};

function AppContent() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('kka_admin_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [user]);

  const handleLogin = (userData: any) => {
    localStorage.setItem('kka_admin_session', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('kka_admin_session');
    setUser(null);
  };

  const handleProfileUpdate = (first_name: string, last_name: string, profile_picture: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        first_name,
        last_name,
        profile_picture,
        full_name: `${first_name} ${last_name}`.trim() || user.username
      };
      localStorage.setItem('kka_admin_session', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {!isLoginPage && user && (
        <Navbar
          adminName={user?.full_name || "Admin"}
          profilePicture={user?.profile_picture}
          onLogout={handleLogout}
        />
      )}

      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <DashboardWrapper
                user={user}
                onSearch={setSearchTerm}
                searchTerm={searchTerm}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/directory"
          element={
            <ProtectedRoute user={user}>
              <PatientDirectory searchTerm={searchTerm} />
            </ProtectedRoute>
          }
        />

        <Route path="/appointments" element={<ProtectedRoute user={user}><Appointments /></ProtectedRoute>} />
        <Route path="/consultation/:id" element={<ProtectedRoute user={user}><Consultation /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute user={user}><Settings onProfileUpdate={handleProfileUpdate} /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {!isLoginPage && (
        <footer className="mt-12 text-center text-[10px] text-gray-400 border-t border-gray-100 pt-8">
          © 2026 KalooKonek | Technological University of the Philippines
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}