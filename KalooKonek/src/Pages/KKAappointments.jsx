import { useState } from "react";

const appointments = [
  {
    month: "NOV",
    day: "12",
    title: "General Checkup",
    name: "Raphael Nikko Espiritu",
    id: "#2025-001",
    reqTime: "9:00 AM - 10:00 AM",
    location: "Brgy. 172 Health Center",
  },
  {
    month: "NOV",
    day: "15",
    title: "OSCA ID Renewal",
    name: "Maria Clara Santos",
    id: "#2024-088",
    reqTime: "1:00 PM - 2:00 PM",
    location: "OSCA Main Office",
  },
];

const PendingBadge = () => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    background: "#fff8ec", border: "1px solid #f5c842",
    color: "#b07d00", borderRadius: 99,
    padding: "3px 10px", fontSize: 11, fontWeight: 600,
  }}>
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f5c842" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    PENDING
  </span>
);

const AppointmentCard = ({ data }) => {
  const [approveHov, setApproveHov] = useState(false);
  const [proposeHov, setProposeHov] = useState(false);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: "1px solid #ebebeb",
      padding: "20px 24px",
      flex: "1 1 400px",
      maxWidth: 520,
      borderLeft: "4px solid #f5c842",
    }}>
      {/* Header */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
        {/* Date */}
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.1em" }}>{data.month}</p>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#111", lineHeight: 1 }}>{data.day}</p>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#111" }}>{data.title}</h3>
            <PendingBadge />
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#cc2222", display: "inline-block" }} />
            {data.name}
            <span style={{ color: "#ccc" }}>·</span>
            <span style={{ color: "#aaa" }}>{data.id}</span>
          </p>
        </div>
      </div>

      {/* Details box */}
      <div style={{
        background: "#fafafa", borderRadius: 8,
        border: "1px solid #f0f0f0", padding: "12px 14px",
        marginBottom: 16, display: "flex", flexDirection: "column", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#555" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span style={{ color: "#aaa", fontWeight: 600 }}>Req Time:</span>
          <span>{data.reqTime}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#555" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span style={{ color: "#aaa", fontWeight: 600 }}>Location:</span>
          <span>{data.location}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onMouseEnter={() => setApproveHov(true)}
          onMouseLeave={() => setApproveHov(false)}
          style={{
            flex: 1, padding: "10px",
            background: approveHov ? "#111" : "#0f1623",
            color: "#fff", border: "none", borderRadius: 8,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Outfit', sans-serif", transition: "background 0.15s",
          }}>
          Approve Slot
        </button>
        <button
          onMouseEnter={() => setProposeHov(true)}
          onMouseLeave={() => setProposeHov(false)}
          style={{
            flex: 1, padding: "10px",
            background: proposeHov ? "#f5f5f5" : "#fff",
            color: "#333", border: "1px solid #ddd", borderRadius: 8,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Outfit', sans-serif", transition: "background 0.15s",
          }}>
          Propose New Time
        </button>
      </div>
    </div>
  );
};

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#f4f5f7",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>

        {/* MAIN */}
        <main style={{
          flex: 1,
          padding: "32px 32px 0",
          maxWidth: 1140,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}>

          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>
                Health Center Appointments
              </h1>
              <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
                Manage and schedule incoming checkup requests.
              </p>
            </div>

            {/* Tabs */}
            <div style={{
              display: "flex", border: "1px solid #e0e0e0",
              borderRadius: 8, overflow: "hidden", background: "#fff",
            }}>
              <button
                onClick={() => setActiveTab("requests")}
                style={{
                  padding: "8px 16px", border: "none", cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.05em",
                  background: activeTab === "requests" ? "#fff" : "#fafafa",
                  color: activeTab === "requests" ? "#cc2222" : "#888",
                  borderRight: "1px solid #e0e0e0",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                REQUESTS
                <span style={{
                  background: "#cc2222", color: "#fff",
                  borderRadius: 99, padding: "1px 6px", fontSize: 10, fontWeight: 700,
                }}>2</span>
              </button>
              <button
                onClick={() => setActiveTab("scheduled")}
                style={{
                  padding: "8px 16px", border: "none", cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700,
                  letterSpacing: "0.05em",
                  background: activeTab === "scheduled" ? "#fff" : "#fafafa",
                  color: activeTab === "scheduled" ? "#cc2222" : "#888",
                }}>
                SCHEDULED
              </button>
            </div>
          </div>

          {/* Cards */}
          {activeTab === "requests" ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {appointments.map((a, i) => (
                <AppointmentCard key={i} data={a} />
              ))}
            </div>
          ) : (
            <div style={{
              background: "#fff", borderRadius: 12, border: "1px solid #ebebeb",
              padding: 40, textAlign: "center", color: "#aaa", fontSize: 14,
            }}>
              No scheduled appointments yet.
            </div>
          )}

          <div style={{ height: 32 }} />
        </main>

        {/* FOOTER */}
        <footer style={{
          borderTop: "1px solid #e8e8e8",
          background: "#fff",
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
