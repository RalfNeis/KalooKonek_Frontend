import { useState } from "react";

const PAGES = {
  SIGNIN: "signin",
  FORGOT: "forgot",
  REQUEST: "request",
};

const LeftPanel = ({ title, subtitle, description }) => (
  <div style={{
    background: "linear-gradient(135deg, #1a0a0a 0%, #2d1515 30%, #1a2040 70%, #0d1530 100%)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "40px",
    color: "white",
    width: "42%",
    minWidth: "420px",
    minHeight: "100vh",
    flexShrink: 0,
    boxSizing: "border-box",
  }}>
    {/* Blurred orbs */}
    <div style={{
      position: "absolute", top: "20%", left: "10%", width: 220, height: 220,
      background: "radial-gradient(circle, rgba(180,30,30,0.45) 0%, transparent 70%)",
      filter: "blur(40px)", borderRadius: "50%",
    }} />
    <div style={{
      position: "absolute", bottom: "25%", right: "5%", width: 180, height: 180,
      background: "radial-gradient(circle, rgba(30,50,160,0.4) 0%, transparent 70%)",
      filter: "blur(35px)", borderRadius: "50%",
    }} />

    <div style={{ position: "relative", zIndex: 1 }}>
      {/* Logo */}
      <div className="flex items-center gap-2 mb-16">
        <div style={{
          width: 36, height: 36, background: "rgba(255,255,255,0.12)",
          borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(10px)",
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="11" y="1" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="1" y="11" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
            <rect x="11" y="11" width="6" height="6" rx="1.5" fill="white" opacity="0.9"/>
          </svg>
        </div>
        <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 500, letterSpacing: "0.02em" }}>
          KalooKonek <span style={{ color: "#e85555", fontWeight: 700 }}>Admin</span>
        </span>
      </div>

      {/* Main text */}
      <h1 style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 38, fontWeight: 700,
        lineHeight: 1.15, letterSpacing: "-0.01em", marginBottom: 20,
      }}>
        {title}
      </h1>
      {subtitle && (
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 38, fontWeight: 700, lineHeight: 1.15, marginBottom: 20 }}>
          {subtitle}
        </h2>
      )}
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.65, maxWidth: 320, fontFamily: "'Outfit', sans-serif" }}>
        {description}
      </p>
    </div>

    <p style={{ position: "relative", zIndex: 1, color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>
      © 2025 Technological University of the Philippines
    </p>
  </div>
);

const BadgePill = ({ icon, text }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 6,
    border: "1px solid #e85555", borderRadius: 999,
    padding: "4px 12px", marginBottom: 20,
  }}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e85555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
    <span style={{ color: "#e85555", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", fontFamily: "'Outfit', sans-serif" }}>
      {text}
    </span>
  </div>
);

const InputField = ({ label, id, type = "text", placeholder, rightLabel, onRightClick, value, onChange }) => (
  <div style={{ marginBottom: 18 }}>
    <div className="flex justify-between items-center" style={{ marginBottom: 6 }}>
      <label htmlFor={id} style={{ fontSize: 13, fontWeight: 500, color: "#333", fontFamily: "'Outfit', sans-serif" }}>
        {label}
      </label>
      {rightLabel && (
        <button onClick={onRightClick} style={{ fontSize: 12, color: "#e85555", background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
          {rightLabel}
        </button>
      )}
    </div>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%", padding: "10px 14px", border: "1.5px solid #e8e8e8",
        borderRadius: 8, fontSize: 14, outline: "none", background: "#fafafa",
        fontFamily: "'Outfit', sans-serif", boxSizing: "border-box",
        transition: "border-color 0.2s",
      }}
      onFocus={e => e.target.style.borderColor = "#e85555"}
      onBlur={e => e.target.style.borderColor = "#e8e8e8"}
    />
  </div>
);

const PrimaryButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%", padding: "12px", background: "#cc2222",
      color: "white", border: "none", borderRadius: 8, fontSize: 15,
      fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
      letterSpacing: "0.01em", transition: "background 0.2s",
    }}
    onMouseEnter={e => e.target.style.background = "#b01c1c"}
    onMouseLeave={e => e.target.style.background = "#cc2222"}
  >
    {children}
  </button>
);

const SignInPage = ({ onForgot, onRequest }) => {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  return (
    <div>
      <BadgePill text="AUTHORIZED PERSONNEL ONLY" />
      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6, color: "#111" }}>Admin Sign In</h2>
      <p style={{ fontSize: 13, color: "#777", marginBottom: 28, fontFamily: "'Outfit', sans-serif" }}>
        Enter your administrative credentials to access the dashboard.
      </p>
      <InputField label="Admin ID / Email" id="adminId" placeholder="e.g. 2025-001" value={id} onChange={e => setId(e.target.value)} />
      <InputField label="Password" id="password" type="password" placeholder="••••••••" rightLabel="Forgot password?" onRightClick={onForgot} value={pw} onChange={e => setPw(e.target.value)} />
      <div style={{ marginTop: 8, marginBottom: 20 }}>
        <PrimaryButton>Sign In</PrimaryButton>
      </div>
      <p style={{ textAlign: "center", fontSize: 13, color: "#777", fontFamily: "'Outfit', sans-serif" }}>
        Need admin access?{" "}
        <button onClick={onRequest} style={{ color: "#e85555", background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600 }}>
          Request Account
        </button>
      </p>
    </div>
  );
};

const ForgotPage = ({ onBack }) => {
  const [email, setEmail] = useState("");

  return (
    <div>
      <BadgePill text="SECURITY PROTOCOL" />
      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6, color: "#111" }}>Reset Password</h2>
      <p style={{ fontSize: 13, color: "#777", marginBottom: 28, fontFamily: "'Outfit', sans-serif" }}>
        Enter your registered official email address and we'll send you instructions to reset your password.
      </p>
      <InputField label="Official Admin Email" id="adminEmail" placeholder="admin@caloocan.gov.ph" value={email} onChange={e => setEmail(e.target.value)} />
      <div style={{ marginTop: 8, marginBottom: 20 }}>
        <PrimaryButton>Send Reset Link</PrimaryButton>
      </div>
      <p style={{ textAlign: "center", fontSize: 13, color: "#777", fontFamily: "'Outfit', sans-serif" }}>
        Remembered your password?{" "}
        <button onClick={onBack} style={{ color: "#e85555", background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600 }}>
          Return to Sign In
        </button>
      </p>
    </div>
  );
};

const SelectField = ({ label, id, options, placeholder }) => (
  <div style={{ marginBottom: 18 }}>
    <label htmlFor={id} style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#333", marginBottom: 6, fontFamily: "'Outfit', sans-serif" }}>
      {label}
    </label>
    <select
      id={id}
      defaultValue=""
      style={{
        width: "100%", padding: "10px 14px", border: "1.5px solid #e8e8e8",
        borderRadius: 8, fontSize: 14, outline: "none", background: "#fafafa",
        fontFamily: "'Outfit', sans-serif", boxSizing: "border-box", color: "#999",
        appearance: "none",
      }}
      onFocus={e => e.target.style.borderColor = "#e85555"}
      onBlur={e => { e.target.style.borderColor = "#e8e8e8"; }}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const RequestPage = ({ onSignIn }) => {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", empId: "" });

  return (
    <div>
      <BadgePill text="REGISTRATION" />
      <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 6, color: "#111" }}>Request Access</h2>
      <p style={{ fontSize: 13, color: "#777", marginBottom: 28, fontFamily: "'Outfit', sans-serif" }}>
        Fill out the form below. Approval usually takes 1–2 business days.
      </p>
      <div className="flex gap-3">
        <div style={{ flex: 1 }}>
          <InputField label="First Name" id="firstName" placeholder="Juan" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
        </div>
        <div style={{ flex: 1 }}>
          <InputField label="Last Name" id="lastName" placeholder="Dela Cruz" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
        </div>
      </div>
      <InputField label="Official Email Address" id="reqEmail" placeholder="name@caloocan.gov.ph" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <InputField label="Employee / Government ID Number" id="empId" placeholder="e.g. EMP-2025-XXXX" value={form.empId} onChange={e => setForm({ ...form, empId: e.target.value })} />
      <SelectField label="Assigned Barangay" id="barangay" placeholder="Select your Barangay" options={["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5"]} />
      <SelectField label="Role / Position" id="role" placeholder="Select your Role" options={["Barangay Captain", "Secretary", "Treasurer", "Health Worker", "IT Staff"]} />
      <div style={{ marginTop: 8, marginBottom: 20 }}>
        <PrimaryButton>Submit Request</PrimaryButton>
      </div>
      <p style={{ textAlign: "center", fontSize: 13, color: "#777", fontFamily: "'Outfit', sans-serif" }}>
        Already have an account?{" "}
        <button onClick={onSignIn} style={{ color: "#e85555", background: "none", border: "none", cursor: "pointer", fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600 }}>
          Sign In
        </button>
      </p>
    </div>
  );
};

export default function KKALogin() {
  const [page, setPage] = useState(PAGES.SIGNIN);
  const [darkMode, setDarkMode] = useState(false);

  const leftPanelProps = {
    [PAGES.SIGNIN]: {
      title: "Barangay",
      subtitle: "Management Portal",
      description: "Secure access for barangay officials to verify users, manage appointments, and distribute announcements to senior citizens",
    },
    [PAGES.FORGOT]: {
      title: "Account Recovery",
      description: "Securely reset your admin credentials to regain access to the Barangay Management Portal.",
    },
    [PAGES.REQUEST]: {
      title: "Request System",
      subtitle: "Access",
      description: "Submit your credentials to the IT Office for verification. Once approved, you will gain access to the Barangay Management Portal.",
    },
  };

  const props = leftPanelProps[page];

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ display: "flex", minHeight: "100vh", background: darkMode ? "#1a1a1a" : "#fff" }}>
        <LeftPanel {...props} />

        {/* Right panel */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", justifyContent: "center",
          alignItems: "center", padding: "40px 20px",
          background: darkMode ? "#1e1e1e" : "#ffffff",
        }}>
          <div style={{ width: "100%", maxWidth: 460 }}>
            {page === PAGES.SIGNIN && (
              <SignInPage
                onForgot={() => setPage(PAGES.FORGOT)}
                onRequest={() => setPage(PAGES.REQUEST)}
              />
            )}
            {page === PAGES.FORGOT && (
              <ForgotPage onBack={() => setPage(PAGES.SIGNIN)} />
            )}
            {page === PAGES.REQUEST && (
              <RequestPage onSignIn={() => setPage(PAGES.SIGNIN)} />
            )}

            {/* Switch Theme */}
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: darkMode ? "#333" : "#f5f5f5", border: "none",
                  borderRadius: 999, padding: "6px 14px", cursor: "pointer",
                  fontSize: 12, color: darkMode ? "#ccc" : "#555",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {darkMode ? "☀️" : "🌙"} Switch Theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
