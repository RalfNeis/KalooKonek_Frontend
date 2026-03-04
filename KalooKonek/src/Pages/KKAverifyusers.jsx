import { useState } from "react";

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

const ActionBtn = ({ type }) => {
  const [hov, setHov] = useState(false);
  const isApprove = type === "approve";
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 30, height: 30, border: `1px solid ${hov ? (isApprove ? "#22aa66" : "#cc2222") : "#ddd"}`,
        borderRadius: 6, background: hov ? (isApprove ? "#e8f7ef" : "#fff0f0") : "#fff",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}>
      {isApprove ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={hov ? "#22aa66" : "#aaa"} strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={hov ? "#cc2222" : "#aaa"} strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      )}
    </button>
  );
};

export default function VerifyUsers() {
  const [activeNav, setActiveNav] = useState("VERIFY USERS");
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");

  const applicants = [
    { initials: "RG", color: "#888", name: "Russel Gallanosa", barangay: "Brgy. 171", date: "Oct 24, 2025", ago: "2 days ago" },
    { initials: "NG", color: "#c0784a", name: "Neo Gariando", barangay: "Brgy. 172", date: "Oct 23, 2025", ago: "3 days ago" },
  ];

  const filtered = applicants.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ ...styles.page, background: darkMode ? "#1a1a1a" : "#f4f5f7" }}>

        {/* MAIN */}
        <main style={styles.main}>

          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: darkMode ? "#fff" : "#111", margin: "0 0 4px" }}>
                Registration Approvals
              </h1>
              <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
                Review applicant credentials and approve platform access.
              </p>
            </div>

            {/* Search + Filter */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search name or ID..."
                  style={{
                    padding: "8px 12px 8px 30px",
                    border: "1px solid #e0e0e0", borderRadius: 8,
                    fontSize: 13, outline: "none",
                    background: darkMode ? "#2a2a2a" : "#fff",
                    color: darkMode ? "#fff" : "#111",
                    fontFamily: "'Outfit', sans-serif", width: 200,
                  }}
                  onFocus={e => e.target.style.borderColor = "#cc2222"}
                  onBlur={e => e.target.style.borderColor = "#e0e0e0"}
                />
              </div>

              {/* Filter icon button */}
              <button style={{
                width: 36, height: 36, border: "1px solid #e0e0e0",
                borderRadius: 8, background: darkMode ? "#2a2a2a" : "#fff",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{ ...styles.tableWrap, borderColor: darkMode ? "#333" : "#ebebeb", background: darkMode ? "#1e1e1e" : "#fff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: darkMode ? "#252525" : "#fafafa" }}>
                  <th style={styles.th}>Applicant Profile</th>
                  <th style={styles.th}>Submitted ID</th>
                  <th style={styles.th}>Applied Date</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ ...styles.td, textAlign: "center", color: "#aaa", padding: 40 }}>
                      No applicants found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((a, i) => (
                    <tr key={i} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${darkMode ? "#2a2a2a" : "#f5f5f5"}` : "none" }}>

                      {/* Applicant */}
                      <td style={styles.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar initials={a.initials} color={a.color} />
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: darkMode ? "#fff" : "#111" }}>{a.name}</p>
                            <p style={{ margin: 0, fontSize: 11, color: "#aaa", display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                <circle cx="12" cy="10" r="3"/>
                              </svg>
                              {a.barangay}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* OSCA ID */}
                      <td style={styles.td}><ViewOscaBtn /></td>

                      {/* Date */}
                      <td style={styles.td}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: darkMode ? "#ddd" : "#111" }}>{a.date}</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#aaa", marginTop: 2 }}>{a.ago}</p>
                      </td>

                      {/* Status */}
                      <td style={styles.td}><PendingBadge /></td>

                      {/* Actions */}
                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <ActionBtn type="approve" />
                          <ActionBtn type="reject" />
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Footer row */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 16px", borderTop: `1px solid ${darkMode ? "#2a2a2a" : "#f0f0f0"}`,
            }}>
              <span style={{ fontSize: 12, color: "#aaa" }}>Showing 2 of 45 pending requests</span>
              <div style={{ display: "flex", gap: 8 }}>
                {["Previous", "Next"].map(label => (
                  <button key={label} style={{
                    padding: "6px 14px", border: "1px solid #ddd",
                    borderRadius: 6, background: "#fff", fontSize: 12,
                    fontWeight: 600, color: "#555", cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif",
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ height: 32 }} />
        </main>

        {/* FOOTER */}
        <footer style={{
          borderTop: `1px solid ${darkMode ? "#333" : "#e8e8e8"}`,
          background: darkMode ? "#1e1e1e" : "#fff",
          padding: "14px 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 12, color: "#aaa" }}>© 2026 KalooKonek | Technological University of the Philippines</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["PRIVACY", "TERMS", "SUPPORT"].map(l => (
              <button key={l} style={{
                background: "none", border: "none", fontSize: 11, fontWeight: 700,
                color: "#aaa", cursor: "pointer", letterSpacing: "0.05em",
                fontFamily: "'Outfit', sans-serif",
              }}>{l}</button>
            ))}
          </div>
        </footer>

      </div>
    </>
  );
}
