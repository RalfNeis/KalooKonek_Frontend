import { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';

const NAV_ITEMS = ["DASHBOARD", "VERIFY USERS", "APPOINTMENTS", "ANNOUNCEMENTS", "LOGS"];

const styles = {
  page: {
    fontFamily: "'Outfit', sans-serif",
    background: "#f4f5f7",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  navbar: {
    background: "#fff",
    borderBottom: "1px solid #e8e8e8",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    height: 56,
    gap: 32,
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navBrand: {
    display: "flex", alignItems: "center", gap: 8,
    fontWeight: 700, fontSize: 14, letterSpacing: "0.05em",
    color: "#111", textTransform: "uppercase", flexShrink: 0,
  },
  navLogoBox: {
    width: 32, height: 32, background: "#cc2222",
    borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
  },
  navLinks: {
    display: "flex", alignItems: "center", gap: 4, flex: 1,
  },
  navRight: {
    display: "flex", alignItems: "center", gap: 12, marginLeft: "auto",
  },
  main: {
    flex: 1,
    padding: "32px 32px 0",
    maxWidth: 1140,
    margin: "0 auto",
    width: "100%",
    boxSizing: "border-box",
  },
  tableWrap: {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #ebebeb",
    overflow: "hidden",
    marginTop: 24,
  },
  th: {
    fontSize: 11, fontWeight: 700, color: "#aaa",
    letterSpacing: "0.08em", textTransform: "uppercase",
    padding: "10px 16px", textAlign: "left",
    borderBottom: "1px solid #f0f0f0",
  },
  td: {
    padding: "14px 16px", fontSize: 13,
    color: "#333", verticalAlign: "middle",
  },
};

const NavLink = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    background: "none", border: "none", cursor: "pointer",
    padding: "18px 12px", fontSize: 11.5, fontWeight: 700,
    letterSpacing: "0.07em", color: active ? "#cc2222" : "#888",
    borderBottom: active ? "2px solid #cc2222" : "2px solid transparent",
    fontFamily: "'Outfit', sans-serif", transition: "color 0.2s",
    whiteSpace: "nowrap",
  }}>
    {label}
  </button>
);

const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};

const Avatar = ({ initials, color = "#888" }) => (
  <div style={{
    width: 34, height: 34, borderRadius: "50%",
    background: color, color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, flexShrink: 0,
  }}>
    {initials}
  </div>
);

const PendingBadge = () => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    background: "#fff8ec", border: "1px solid #f5c842",
    color: "#b07d00", borderRadius: 99,
    padding: "3px 10px", fontSize: 11, fontWeight: 600,
  }}>
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f5c842", display: "inline-block" }} />
    Pending Review
  </span>
);

const ViewOscaBtn = () => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 12px", border: "1px solid #ddd", borderRadius: 6,
        background: hov ? "#f5f5f5" : "#fff",
        fontSize: 12, fontWeight: 600, color: "#333",
        cursor: "pointer", fontFamily: "'Outfit', sans-serif",
        transition: "background 0.15s",
      }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#cc2222" strokeWidth="2.5">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
      View OSCA ID
    </button>
  );
};

const ActionBtn = ({ type, onClick, disabled }) => {
  const [hov, setHov] = useState(false);
  const isApprove = type === "approve";
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 30, height: 30, border: `1px solid ${hov ? (isApprove ? "#22aa66" : "#cc2222") : "#ddd"}`,
        borderRadius: 6, background: hov ? (isApprove ? "#e8f7ef" : "#fff0f0") : "#fff",
        cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s", opacity: disabled ? 0.5 : 1,
      }}>
      {isApprove ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={hov ? "#22aa66" : "#aaa"} strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={hov ? "#cc2222" : "#aaa"} strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      )}
    </button>
  );
};

export default function VerifyUsers() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // 1. Fetch data from Backend
  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error("No active Supabase session.");
        return;
      }
      const response = await fetch('http://localhost:8000/admin/registration-requests/', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Accept': 'application/json',
        }
      });

      const rawText = await response.text();
      console.log("📡 Status:", response.status);
      console.log("📄 Raw response (first 300 chars):", rawText.substring(0, 300));

      if (!response.ok) {
        console.error("❌ Backend error:", response.status, rawText);
        return;
      }

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        console.error("❌ Django returned HTML instead of JSON. The URL is probably wrong, unauthenticated, or being redirected. Full response:", rawText);
        return;
      }

      setApplicants(data.registration_requests || []);
    } catch (error) {
      console.error("Failed to fetch applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  // 2. Handle Approval Logic
  const handleApprove = async (id) => {
    if (!window.confirm("Approve this user and send Supabase invite?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`http://localhost:8000/admin/registration-requests/${id}/approve/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        }
      });
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const errorText = await response.text();
      console.error("Non-JSON response (approve):", errorText);
      alert("Server error: unexpected response. Check console for details.");
      return;
    }
    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      fetchApplicants(); // Refresh the list automatically
    } else {
      alert(result.error || "Approval failed.");
    }
  } catch (err) {
    console.error("Approval failed:", err);
    alert("Network error during approval. Check console.");
  }
};

  // 3. Handle Rejection Logic
  const handleReject = async (id) => {
    if (!window.confirm("Reject and delete this request?")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`http://localhost:8000/admin/registration-requests/${id}/reject/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
        }
      });
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok) {
      const errorText = contentType.includes("application/json")
        ? (await response.json()).error
        : await response.text();
      console.error("Rejection error:", errorText);
      alert("Rejection failed. Check console for details.");
      return;
    }
    fetchApplicants(); // Refresh the list
  } catch (err) {
    console.error("Rejection failed:", err);
    alert("Network error during rejection. Check console.");
  }
};

  const filtered = applicants.filter(a =>
    `${a.first_name} ${a.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ ...styles.page, background: darkMode ? "#1a1a1a" : "#f4f5f7" }}>
        <main style={styles.main}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: darkMode ? "#fff" : "#111", margin: "0 0 4px" }}>
                Registration Approvals
              </h1>
              <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
                Review applicant credentials and approve platform access.
              </p>
            </div>
            
            {/* Search Input */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name or email..."
                style={{
                  padding: "8px 12px", border: "1px solid #e0e0e0", borderRadius: 8, fontSize: 13,
                  background: darkMode ? "#2a2a2a" : "#fff", color: darkMode ? "#fff" : "#111",
                }}
              />
            </div>
          </div>

          <div style={{ ...styles.tableWrap, background: darkMode ? "#1e1e1e" : "#fff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: darkMode ? "#252525" : "#fafafa" }}>
                  <th style={styles.th}>Applicant Profile</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Applied Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ textAlign: "center", padding: 40 }}>Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: "center", padding: 40 }}>No pending requests.</td></tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user.id} style={{ borderBottom: `1px solid ${darkMode ? "#2a2a2a" : "#f5f5f5"}` }}>
                      <td style={styles.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#888", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                            {getInitials(user.first_name, user.last_name)}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: darkMode ? "#fff" : "#111" }}>{user.first_name} {user.last_name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
                      </td>
                      <td style={styles.td}>
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <ActionBtn type="approve" onClick={() => handleApprove(user.id)} />
                          <ActionBtn type="reject" onClick={() => handleReject(user.id)} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}
