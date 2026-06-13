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
import PatientHistory from './features/PatientHistory';
import "tailwindcss";

const ProtectedRoute = ({ user, children }: { user: any; children: React.ReactNode }) => {
  if (!user) return <Navigate to="/staff/login" replace />;
  return <>{children}</>; 
};

const DashboardWrapper = ({ user, onSearch, searchTerm }: { 
  user: any; 
  onSearch: (val: string) => void;
  searchTerm: string;
}) => (
  <main className="max-w-6xl mx-auto px-6 space-y-8 mt-8">
    <HeaderActions 
      adminName={user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.username || "Staff"} 
      onSearch={onSearch} 
    />
    <Dashboard externalSearchTerm={searchTerm} /> 
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

  const isLoginPage = location.pathname === '/staff/login';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {!isLoginPage && user && (
        <Navbar 
          adminName={user?.full_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.username || "Staff"} 
          onLogout={handleLogout} 
        />
      )}
      
      <Routes>
        <Route path="/staff/login" element={<Login onLoginSuccess={handleLogin} />} />
        
        <Route 
          path="/staff/dashboard" 
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
          path="/staff/directory" 
          element={
            <ProtectedRoute user={user}>
              <PatientDirectory searchTerm={searchTerm} />
            </ProtectedRoute>
          } 
        />

        <Route path="/staff/appointments" element={<ProtectedRoute user={user}><Appointments /></ProtectedRoute>} />
        
        <Route 
          path="/staff/consultation/:id" 
          element={<ProtectedRoute user={user}><Consultation /></ProtectedRoute>} 
        />
        
        <Route 
          path="/staff/patient-history/:id" 
          element={<ProtectedRoute user={user}><PatientHistory /></ProtectedRoute>} 
        />

        <Route path="/staff/settings" element={<ProtectedRoute user={user}><Settings /></ProtectedRoute>} /> 
        <Route path="/" element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/staff/login" replace />} />
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