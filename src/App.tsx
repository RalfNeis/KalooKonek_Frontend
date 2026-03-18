import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './features/Navbar';
import HeaderActions from './features/HeaderActions';
import CurrentPatient from './features/CurrentPatient';
import PatientTable from './features/PatientTable';
import PatientDirectory from './features/PatientDirectory';
import Appointments from './features/Appointments'; // Importing your new page
import Settings from './features/Settings'; // New import
import "tailwindcss";

// A wrapper for the Dashboard layout
const Dashboard = () => (
  <main className="max-w-6xl mx-auto px-6 space-y-8 mt-8">
    <HeaderActions />
    <CurrentPatient />
    <div className="space-y-4 pt-4">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
        Recent Patients Today
      </h2>
      <PatientTable />
    </div>
  </main>
);

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8FAFC] pb-12">
        <Navbar />
        
        <Routes>
          {/* Redirect empty path to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/directory" element={<PatientDirectory />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/settings" element={<Settings />} /> 
        </Routes>

        <footer className="mt-12 text-center text-[10px] text-gray-400 border-t border-gray-100 pt-8">
          © 2026 KalooKonek | Technological University of the Philippines
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;