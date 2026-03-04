import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { label: "DASHBOARD", path: "/dashboard" },
  { label: "VERIFY USERS", path: "/verify-users" },
  { label: "APPOINTMENTS", path: "/appointments" },
  { label: "ANNOUNCEMENTS", path: "/announcements" },
  { label: "LOGS", path: "/logs" },
];

export default function Navbar({ darkMode, onToggleDark }) {
  return (
    <nav style={{
      background: darkMode ? "#1e1e1e" : "#fff",
      borderBottom: `1px solid ${darkMode ? "#333" : "#e8e8e8"}`,
      display: "flex", alignItems: "center",
      padding: "0 24px", height: 56, gap: 32,
      position: "sticky", top: 0, zIndex: 100,
      fontFamily: "'Outfit', sans-serif",
    }}>

      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, letterSpacing: "0.05em", flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, background: "#cc2222", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/>
            <rect x="11" y="1" width="6" height="6" rx="1.5" fill="white"/>
            <rect x="1" y="11" width="6" height="6" rx="1.5" fill="white"/>
            <rect x="11" y="11" width="6" height="6" rx="1.5" fill="white"/>
          </svg>
        </div>
        <span style={{ color: darkMode ? "#fff" : "#111" }}>Admin Console</span>
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              textDecoration: "none",
              background: "none", border: "none", cursor: "pointer",
              padding: "18px 12px", fontSize: 11.5, fontWeight: 700,
              letterSpacing: "0.07em",
              color: isActive ? "#cc2222" : "#888",
              borderBottom: isActive ? "2px solid #cc2222" : "2px solid transparent",
              fontFamily: "'Outfit', sans-serif",
              display: "inline-block",
              whiteSpace: "nowrap",
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
        <span style={{ fontSize: 10, fontWeight: 700, background: "#e8f0fe", color: "#3366cc", padding: "3px 8px", borderRadius: 99 }}>
          v2.0.0-beta
        </span>
        <button onClick={onToggleDark} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16 }}>
          {darkMode ? "☀️" : "🌙"}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#cc2222", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
            JD
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: darkMode ? "#fff" : "#111", lineHeight: 1.2 }}>Raphael</p>
            <p style={{ margin: 0, fontSize: 10, color: "#aaa", lineHeight: 1.2 }}>Admin</p>
          </div>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, background: "#cc2222", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
          Sign Out
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>

    </nav>
  );
}