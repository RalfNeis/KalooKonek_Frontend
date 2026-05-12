import { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';

const EVENT_TYPES = {
  APPROVE: { label: "APPROVE", color: "#22aa66", bg: "rgba(34, 170, 102, 0.15)" },
  PUBLISH: { label: "PUBLISH", color: "#4facfe", bg: "rgba(79, 172, 254, 0.15)" },
  UPDATE:  { label: "UPDATE",  color: "#ffb74d", bg: "rgba(255, 183, 77, 0.15)" },
  AUTH_FAIL: { label: "AUTH_FAIL", color: "#ff4d4f", bg: "rgba(255, 77, 79, 0.15)" },
  SYSTEM: { label: "SYSTEM", color: "#aaa", bg: "rgba(255, 255, 255, 0.1)" }
};

const EventBadge = ({ type }) => {
  const t = EVENT_TYPES[type] || EVENT_TYPES.SYSTEM;
  return (
    <span style={{
      display: "inline-block",
      background: t.bg, color: t.color,
      border: `1px solid ${t.color}40`,
      borderRadius: 4, padding: "2px 8px",
      fontSize: 10, fontWeight: 700,
      letterSpacing: "0.08em", fontFamily: "'Fira Code', 'Courier New', monospace",
    }}>
      {t.label || type}
    </span>
  );
};

export default function Logs() {
  const [filterHov, setFilterHov] = useState(false);
  const [exportHov, setExportHov] = useState(false);
  const [search, setSearch] = useState("");
  
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Logs from Supabase
  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Adjust 'logs' to match your exact table name if it is different (e.g., 'django_admin_log')
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100); // Prevent terminal from getting too heavy

      if (error) {
        // If the table doesn't exist yet, we'll gracefully fallback
        console.error("Supabase error (Logs might not exist yet):", error.message);
        return;
      }

      setLogsData(data || []);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    // Optional: Set up real-time terminal subscription here later!
  }, []);

  // Filter functionality
  const filtered = logsData.filter(l =>
    (l.actor || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.event_type || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.payload_details || "").toLowerCase().includes(search.toLowerCase())
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
          flex: 1, padding: "32px 32px 0", maxWidth: 1140,
          margin: "0 auto", width: "100%", boxSizing: "border-box",
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

            {/* Buttons & Search */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input 
                type="text" 
                placeholder="grep logs..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "8px 14px", border: "1px solid #ddd", borderRadius: 8,
                  fontSize: 13, fontFamily: "'Fira Code', monospace", outline: "none",
                  background: "#fff", width: 200
                }}
              />
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

          {/* Terminal Window Design */}
          <div style={{
            background: "#0a0e17", /* Deep terminal black/blue */
            borderRadius: 12,
            border: "1px solid #1e293b",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}>
            {/* Terminal Top Bar */}
            <div style={{ 
              background: "#1e293b", padding: "8px 16px", display: "flex", alignItems: "center", gap: 6 
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
              <span style={{ marginLeft: 10, color: "#8b949e", fontSize: 11, fontFamily: "monospace" }}>root@kalookonek:~/logs</span>
            </div>

            <div style={{ padding: "16px 0", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e293b" }}>
                    {["TIMESTAMP (PST)", "EVENT", "ACTOR", "PAYLOAD"].map(h => (
                      <th key={h} style={{
                        fontSize: 11, fontWeight: 600, color: "#64748b",
                        letterSpacing: "0.08em", padding: "10px 24px", textAlign: "left",
                        fontFamily: "'Fira Code', 'Courier New', monospace"
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ fontFamily: "'Fira Code', 'Courier New', monospace" }}>
                  {loading ? (
                    <tr>
                      <td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#22aa66", fontSize: 13 }}>
                        &gt; Fetching system logs...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: 40, textAlign: "center", color: "#64748b", fontSize: 13 }}>
                        &gt; No log entries found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((log, i) => (
                      <tr key={log.id || i} style={{
                        transition: "background 0.1s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = "#131c2c"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        {/* Timestamp */}
                        <td style={{ padding: "12px 24px" }}>
                          <span style={{ fontSize: 12, color: "#8b949e", whiteSpace: "nowrap" }}>
                            {log.created_at ? new Date(log.created_at).toLocaleString() : "Unknown"}
                          </span>
                        </td>

                        {/* Event type */}
                        <td style={{ padding: "12px 24px" }}>
                          <EventBadge type={log.event_type} />
                        </td>

                        {/* Actor */}
                        <td style={{ padding: "12px 24px" }}>
                          <span style={{ fontSize: 13, color: "#e2e8f0" }}>
                            {log.actor || "SYSTEM"}
                          </span>
                        </td>

                        {/* Payload */}
                        <td style={{ padding: "12px 24px", fontSize: 13, color: "#4facfe" }}>
                          &gt; {log.payload_details || "N/A"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ height: 32 }} />
        </main>

        <footer style={{
          borderTop: "1px solid #e8e8e8", background: "#fff", padding: "14px 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 12, color: "#aaa" }}>© 2026 KalooKonek | Technological University of the Philippines</span>
        </footer>

      </div>
    </>
  );
}