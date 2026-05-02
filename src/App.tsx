import { useState, useEffect } from 'react'; 
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './features/Navbar';
import HeaderActions from './features/HeaderActions';
import CurrentPatient from './features/CurrentPatient';
import PatientDirectory from './features/PatientDirectory';
import Appointments from './features/Appointments';
import Settings from './features/Settings';
import Login from './features/KKALogin'; 
import "tailwindcss";

// --- THE BOUNCER (Protected Route) ---
const ProtectedRoute = ({ user, children }: { user: any; children: React.ReactNode }) => {
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>; 
};

// --- Dashboard Component ---
// Now focused only on Header actions and the Current Patient card
const Dashboard = ({ user, onSearch }: { 
  user: any; 
  onSearch: (val: string) => void 
}) => (
  <main className="max-w-6xl mx-auto px-6 space-y-8 mt-8">
    <HeaderActions 
      adminName={user?.adminId || user?.username || "Admin"} 
      onSearch={onSearch} 
    />
    <CurrentPatient />
  </main>
);

function AppContent() {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('kka_admin_session');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Token ${user.token}`;
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

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {!isLoginPage && user && (
        <Navbar 
          adminName={user?.adminId || user?.username || "Admin"} 
          onLogout={handleLogout} 
        />
      )}
      
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleLogin} />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={user}>
              <Dashboard 
                user={user} 
                onSearch={setSearchTerm} 
              />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/directory" 
          element={
            <ProtectedRoute user={user}>
              {/* Pass the search term to the Directory so the table works */}
              <PatientDirectory searchTerm={searchTerm} />
            </ProtectedRoute>
          } 
        />

        <Route path="/appointments" element={<ProtectedRoute user={user}><Appointments /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute user={user}><Settings /></ProtectedRoute>} /> 
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