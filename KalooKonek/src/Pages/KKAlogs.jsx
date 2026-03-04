import { useState } from "react";

const EVENT_TYPES = {
  APPROVE: { label: "APPROVE", color: "#22aa66", bg: "#e8f7ef" },
  PUBLISH: { label: "PUBLISH", color: "#2255cc", bg: "#e8f0fe" },
  UPDATE:  { label: "UPDATE",  color: "#cc7700", bg: "#fff3e0" },
  AUTH_FAIL: { label: "AUTH_FAIL", color: "#cc2222", bg: "#fff0f0" },
};

const logs = [
  {
    timestamp: "2026-02-28 09:15:22",
    type: "APPROVE",
    actorInitial: "J",
    actorColor: "#2255cc",
    actor: "Admin_Juan",
    payload: <>Authorized registration ID: <span style={{ color: "#cc2222", fontWeight: 700, fontFamily: "monospace" }}>REQ-2025-001</span></>,
  },
  {
    timestamp: "2026-02-28 08:30:51",
    type: "PUBLISH",
    actorInitial: "J",
    actorColor: "#2255cc",
    actor: "Admin_Juan",
    payload: <>Created announcement: <span style={{ fontFamily: "monospace" }}>"Free Medical Mission Weekend"</span></>,
  },
  {
    timestamp: "2026-02-27 16:45:10",
    type: "UPDATE",
    actorInitial: "M",
    actorColor: "#888",
    actor: "Admin_Maria",
    payload: <>Mutated appointment status → <span style={{ color: "#cc7700", fontWeight: 700, fontFamily: "monospace" }}>RESCHEDULED</span> (Ref: APT-882)</>,
  },
  {
    timestamp: "2026-02-27 14:12:05",
    type: "AUTH_FAIL",
    actorInitial: "S",
    actorColor: "#333",
    actor: "SYSTEM",
    payload: <>Invalid login attempt detected from IP: <span style={{ color: "#cc2222", fontWeight: 700, fontFamily: "monospace" }}>192.168.1.45</span></>,
  },
];

const EventBadge = ({ type }) => {
  const t = EVENT_TYPES[type] || { label: type, color: "#888", bg: "#f0f0f0" };
  return (
    <span style={{
      display: "inline-block",
      background: t.bg, color: t.color,
      borderRadius: 4, padding: "2px 8px",
      fontSize: 10, fontWeight: 700,
      letterSpacing: "0.08em", fontFamily: "monospace",
    }}>
      {t.label}
    </span>
  );
};

const ActorChip = ({ initial, color, name }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
    <div style={{
      width: 24, height: 24, borderRadius: "50%",
      background: color, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 10, fontWeight: 700, flexShrink: 0,
    }}>
      {initial}
    </div>
    <span style={{ fontSize: 13, fontWeight: 600, color: "#333", fontFamily: "monospace" }}>{name}</span>
  </div>
);

export default function Logs() {
  const [filterHov, setFilterHov] = useState(false);
  const [exportHov, setExportHov] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = logs.filter(l =>
    l.actor.toLowerCase().includes(search.toLowerCase()) ||
    l.type.toLowerCase().includes(search.toLowerCase()) ||
    l.timestamp.includes(search)
  );

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

        <main style={{
          flex: 1,
          padding: "32px 32px 0",
          maxWidth: 1140,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>
                System Audit Log
              </h1>
              <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
                Immutable record of all administrative and system events.
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                onMouseEnter={() => setFilterHov(true)}
                onMouseLeave={() => setFilterHov(false)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", border: "1px solid #ddd",
                  borderRadius: 8, background: filterHov ? "#f5f5f5" : "#fff",
                  fontSize: 13, fontWeight: 600, color: "#555",
                  cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                  transition: "background 0.15s",
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filter
              </button>
              <button
                onMouseEnter={() => setExportHov(true)}
                onMouseLeave={() => setExportHov(false)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", border: "1px solid #ddd",
                  borderRadius: 8, background: exportHov ? "#f5f5f5" : "#fff",
                  fontSize: 13, fontWeight: 600, color: "#555",
                  cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                  transition: "background 0.15s",
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid #ebebeb", overflow: "hidden",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
                  {["TIMESTAMP (PST)", "EVENT TYPE", "ACTOR", "PAYLOAD DETAILS"].map(h => (
                    <th key={h} style={{
                      fontSize: 11, fontWeight: 700, color: "#aaa",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      padding: "10px 16px", textAlign: "left",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#aaa", fontSize: 13 }}>
                      No log entries found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((log, i) => (
                    <tr key={i} style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid #f5f5f5" : "none",
                      transition: "background 0.1s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                      onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                    >
                      {/* Timestamp */}
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{
                          fontSize: 12, fontFamily: "monospace",
                          color: "#888", whiteSpace: "nowrap",
                        }}>
                          {log.timestamp}
                        </span>
                      </td>

                      {/* Event type */}
                      <td style={{ padding: "14px 16px" }}>
                        <EventBadge type={log.type} />
                      </td>

                      {/* Actor */}
                      <td style={{ padding: "14px 16px" }}>
                        <ActorChip initial={log.actorInitial} color={log.actorColor} name={log.actor} />
                      </td>

                      {/* Payload */}
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#555", fontFamily: "monospace" }}>
                        {log.payload}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

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
