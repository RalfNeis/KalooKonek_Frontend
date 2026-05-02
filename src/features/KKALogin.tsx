import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 1. Define the possible pages
const PAGES = {
  SIGNIN: "signin",
  FORGOT: "forgot",
  REQUEST: "request",
} as const;

type PageType = typeof PAGES[keyof typeof PAGES];

// --- Sub-Components (Styled for KalooKonek) ---

const LeftPanel = ({ title, subtitle, description }: any) => (
  <div style={{
    background: "linear-gradient(135deg, #1a0a0a 0%, #2d1515 30%, #1a2040 70%, #0d1530 100%)",
    position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
    justifyContent: "space-between", padding: "40px", color: "white", width: "42%",
    minWidth: "420px", minHeight: "100vh", flexShrink: 0, boxSizing: "border-box",
  }}>
    <div style={{ position: "relative", zIndex: 1 }}>
      <div className="flex items-center gap-2 mb-16">
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 500 }}>
          KalooKonek <span style={{ color: "#e85555", fontWeight: 700 }}>Admin</span>
        </span>
      </div>
      <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 38, fontWeight: 700 }}>{title}</h1>
      {subtitle && <h2 style={{ fontSize: 38, fontWeight: 700 }}>{subtitle}</h2>}
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, marginTop: 20 }}>{description}</p>
    </div>
    <p style={{ opacity: 0.35, fontSize: 12 }}>© 2026 Technological University of the Philippines</p>
  </div>
);

const BadgePill = ({ text }: { text: string }) => (
  <div style={{ border: "1px solid #e85555", borderRadius: 999, padding: "4px 12px", marginBottom: 20, display: "inline-block" }}>
    <span style={{ color: "#e85555", fontSize: 10, fontWeight: 700 }}>{text}</span>
  </div>
);

const InputField = ({ label, id, type = "text", placeholder, value, onChange, rightLabel, onRightClick, disabled }: any) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <label htmlFor={id} style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>{label}</label>
      {rightLabel && (
        <button type="button" onClick={onRightClick} style={{ color: "#e85555", fontSize: 12, background: "none", border: "none", cursor: "pointer" }}>
          {rightLabel}
        </button>
      )}
    </div>
    <input
      id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled}
      style={{ width: "100%", padding: "10px", border: "1.5px solid #e8e8e8", borderRadius: 8, boxSizing: "border-box", backgroundColor: disabled ? "#f5f5f5" : "white" }}
    />
  </div>
);

const PrimaryButton = ({ children, onClick, type = "button", disabled }: any) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    style={{ 
      width: "100%", padding: "12px", background: disabled ? "#999" : "#cc2222", 
      color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer" 
    }}
  >
    {disabled ? "Authenticating..." : children}
  </button>
);

// --- Main Page Logic ---

export default function KKALogin({ onLoginSuccess }: { onLoginSuccess: (data: any) => void }) {
  const [page, setPage] = useState<PageType>(PAGES.SIGNIN);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call the Django Backend with the clean URL and trailing slash
      const response = await axios.post('http://127.0.0.1:8000/accounts/login/', {
          username: id,
          password: pw
      });

      // 2. Handle the response data
      if (response.data) {
        // Store the token in localStorage so other pages can use it for 'get_profile'
        const token = response.data.access_token || response.data.token;
        if (token) {
            localStorage.setItem("sb-access-token", token);
        }

        onLoginSuccess({ 
          adminId: id, 
          ...response.data 
        }); 
        
        navigate("/dashboard"); 
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      // Detailed error message from backend if available
      const errMsg = error.response?.data?.error || "Invalid Admin ID or Password. Please try again.";
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const leftPanelProps = {
    [PAGES.SIGNIN]: { title: "Barangay", subtitle: "Management Portal", description: "Secure access for barangay officials to verify users and manage appointments." },
    [PAGES.FORGOT]: { title: "Recovery", description: "Securely reset your admin credentials to regain access." },
    [PAGES.REQUEST]: { title: "Access", subtitle: "System", description: "Submit your credentials for verification to the IT Office." },
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      
      <LeftPanel {...leftPanelProps[page]} />

      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "40px", background: "#ffffff" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          
          {page === PAGES.SIGNIN && (
            <form onSubmit={handleSignIn}>
              <BadgePill text="AUTHORIZED PERSONNEL ONLY" />
              <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Admin Sign In</h2>
              <InputField 
                label="Admin ID" 
                id="adminId" 
                placeholder="2025-001" 
                value={id} 
                onChange={(e: any) => setId(e.target.value)} 
                disabled={loading}
              />
              <InputField 
                label="Password" 
                id="pw" 
                type="password" 
                placeholder="••••••••" 
                value={pw} 
                onChange={(e: any) => setPw(e.target.value)}
                rightLabel="Forgot password?"
                onRightClick={() => setPage(PAGES.FORGOT)}
                disabled={loading}
              />
              <PrimaryButton type="submit" disabled={loading}>Sign In</PrimaryButton>
              <p style={{ textAlign: "center", fontSize: 13, marginTop: 20 }}>
                Need admin access?{" "}
                <button type="button" onClick={() => setPage(PAGES.REQUEST)} style={{ color: "#e85555", border: "none", background: "none", fontWeight: 600, cursor: "pointer" }}>
                  Request Account
                </button>
              </p>
            </form>
          )}

          {page === PAGES.FORGOT && (
            <div>
              <BadgePill text="SECURITY PROTOCOL" />
              <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Reset Password</h2>
              <InputField label="Admin Email" id="email" placeholder="admin@tup.edu.ph" />
              <PrimaryButton onClick={() => alert("Reset link sent!")}>Send Reset Link</PrimaryButton>
              <button onClick={() => setPage(PAGES.SIGNIN)} style={{ marginTop: 20, width: "100%", background: "none", border: "none", color: "#777", cursor: "pointer" }}>
                Back to Login
              </button>
            </div>
          )}

          {page === PAGES.REQUEST && (
            <div>
              <BadgePill text="REGISTRATION" />
              <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 20 }}>Request Access</h2>
              <InputField label="Full Name" id="name" placeholder="Juan Dela Cruz" />
              <InputField label="Employee ID" id="emp" placeholder="EMP-2025" />
              <PrimaryButton onClick={() => alert("Request Submitted!")}>Submit Request</PrimaryButton>
              <button onClick={() => setPage(PAGES.SIGNIN)} style={{ marginTop: 20, width: "100%", background: "none", border: "none", color: "#777", cursor: "pointer" }}>
                Back to Login
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}