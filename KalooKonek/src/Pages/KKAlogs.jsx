import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const SYSAD_API_URL = `${API_BASE_URL}/sysad`;

const EVENT_TYPES = {
  ADDITION: {
    label: "ADD",
    color: "#22aa66",
    bg: "rgba(34, 170, 102, 0.15)",
  },
  CHANGE: {
    label: "UPDATE",
    color: "#ffb74d",
    bg: "rgba(255, 183, 77, 0.15)",
  },
  DELETION: {
    label: "DELETE",
    color: "#ff4d4f",
    bg: "rgba(255, 77, 79, 0.15)",
  },
  SYSTEM: {
    label: "SYSTEM",
    color: "#aaa",
    bg: "rgba(255, 255, 255, 0.1)",
  },
};

const EventBadge = ({ type }) => {
  const normalizedType = String(type || "SYSTEM").toUpperCase();
  const t = EVENT_TYPES[normalizedType] || EVENT_TYPES.SYSTEM;

  return (
    <span
      style={{
        display: "inline-block",
        background: t.bg,
        color: t.color,
        border: `1px solid ${t.color}40`,
        borderRadius: 4,
        padding: "2px 8px",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.08em",
        fontFamily: "'Fira Code', 'Courier New', monospace",
      }}
    >
      {t.label}
    </span>
  );
};

export default function Logs() {
  const [exportHov, setExportHov] = useState(false);
  const [search, setSearch] = useState("");
  const [logsData, setLogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getAuthHeaders = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session?.access_token) {
      throw new Error("No active Supabase session. Please log in again.");
    }

    return {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    };
  };

  const readJsonResponse = async (response, actionName) => {
    const text = await response.text();

    console.log(`${actionName} status:`, response.status);
    console.log(`${actionName} response:`, text);

    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Backend returned non-JSON during ${actionName}.`);
    }

    if (!response.ok) {
      throw new Error(
        data.error || `${actionName} failed with status ${response.status}.`
      );
    }

    return data;
  };

  const fetchLogs = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${SYSAD_API_URL}/logs/`, {
        method: "GET",
        headers,
      });

      const data = await readJsonResponse(response, "Fetch logs");

      const formattedLogs = (data.logs || []).map((log) => ({
        id: log.id,
        action_time: log.action_time,
        action_flag: log.action_flag || "System",
        user: log.user || "SYSTEM",
        content_type: log.content_type || "System",
        object_repr: log.object_repr || "N/A",
        user_id: log.user_id,
      }));

      setLogsData(formattedLogs);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
      setErrorMessage(err.message || "Failed to fetch logs.");
      setLogsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logsData.filter((log) => {
    const searchValue = search.toLowerCase();

    return (
      `${log.user || ""}`.toLowerCase().includes(searchValue) ||
      `${log.action_flag || ""}`.toLowerCase().includes(searchValue) ||
      `${log.content_type || ""}`.toLowerCase().includes(searchValue) ||
      `${log.object_repr || ""}`.toLowerCase().includes(searchValue)
    );
  });

  const exportCSV = () => {
    const headers = ["Timestamp", "Event", "Actor", "Content Type", "Object"];
    const rows = filtered.map((log) => [
      log.action_time ? new Date(log.action_time).toLocaleString() : "Unknown",
      log.action_flag || "System",
      log.user || "SYSTEM",
      log.content_type || "System",
      log.object_repr || "N/A",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "kalookonek_logs.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          background: "#f4f5f7",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <main
          style={{
            flex: 1,
            padding: "32px 32px 0",
            maxWidth: 1140,
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 24,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#111",
                  margin: "0 0 4px",
                }}
              >
                System Audit Log
              </h1>

              <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
                Record of administrative and system events from Django logs.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="text"
                placeholder="grep logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: "8px 14px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  fontSize: 13,
                  fontFamily: "'Fira Code', monospace",
                  outline: "none",
                  background: "#fff",
                  width: 200,
                }}
              />

              <button
                onClick={fetchLogs}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  background: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#555",
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Refresh
              </button>

              <button
                onClick={exportCSV}
                onMouseEnter={() => setExportHov(true)}
                onMouseLeave={() => setExportHov(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  background: exportHov ? "#f5f5f5" : "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#555",
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                Export CSV
              </button>
            </div>
          </div>

          {errorMessage && (
            <div
              style={{
                background: "#fff0f0",
                border: "1px solid #cc2222",
                color: "#cc2222",
                padding: "12px 16px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              {errorMessage}
            </div>
          )}

          <div
            style={{
              background: "#0a0e17",
              borderRadius: 12,
              border: "1px solid #1e293b",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                background: "#1e293b",
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ff5f56",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#ffbd2e",
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#27c93f",
                }}
              />

              <span
                style={{
                  marginLeft: 10,
                  color: "#8b949e",
                  fontSize: 11,
                  fontFamily: "monospace",
                }}
              >
                root@kalookonek:~/django-admin-logs
              </span>
            </div>

            <div style={{ padding: "16px 0", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #1e293b" }}>
                    {["TIMESTAMP", "EVENT", "ACTOR", "CONTENT TYPE", "OBJECT"].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#64748b",
                            letterSpacing: "0.08em",
                            padding: "10px 24px",
                            textAlign: "left",
                            fontFamily:
                              "'Fira Code', 'Courier New', monospace",
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody
                  style={{
                    fontFamily: "'Fira Code', 'Courier New', monospace",
                  }}
                >
                  {loading ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          padding: 40,
                          textAlign: "center",
                          color: "#22aa66",
                          fontSize: 13,
                        }}
                      >
                        &gt; Fetching system logs...
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        style={{
                          padding: 40,
                          textAlign: "center",
                          color: "#64748b",
                          fontSize: 13,
                        }}
                      >
                        &gt; No log entries found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((log, i) => (
                      <tr
                        key={log.id || i}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#131c2c")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <td style={{ padding: "12px 24px" }}>
                          <span
                            style={{
                              fontSize: 12,
                              color: "#8b949e",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {log.action_time
                              ? new Date(log.action_time).toLocaleString()
                              : "Unknown"}
                          </span>
                        </td>

                        <td style={{ padding: "12px 24px" }}>
                          <EventBadge type={log.action_flag} />
                        </td>

                        <td style={{ padding: "12px 24px" }}>
                          <span style={{ fontSize: 13, color: "#e2e8f0" }}>
                            {log.user || "SYSTEM"}
                          </span>
                        </td>

                        <td style={{ padding: "12px 24px" }}>
                          <span style={{ fontSize: 13, color: "#94a3b8" }}>
                            {log.content_type || "System"}
                          </span>
                        </td>

                        <td
                          style={{
                            padding: "12px 24px",
                            fontSize: 13,
                            color: "#4facfe",
                          }}
                        >
                          &gt; {log.object_repr || "N/A"}
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

        <footer
          style={{
            borderTop: "1px solid #e8e8e8",
            background: "#fff",
            padding: "14px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "#aaa" }}>
            © 2026 KalooKonek | Technological University of the Philippines
          </span>
        </footer>
      </div>
    </>
  );
}