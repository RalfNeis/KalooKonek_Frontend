import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const SYSAD_API_URL = `${API_BASE_URL}/sysad`;

const styles = {
  page: {
    fontFamily: "'Outfit', sans-serif",
    background: "#f4f5f7",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
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
    fontSize: 11,
    fontWeight: 700,
    color: "#aaa",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "10px 16px",
    textAlign: "left",
    borderBottom: "1px solid #f0f0f0",
  },
  td: {
    padding: "14px 16px",
    fontSize: 13,
    color: "#333",
    verticalAlign: "middle",
  },
};

const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
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
        width: 30,
        height: 30,
        border: `1px solid ${
          hov ? (isApprove ? "#22aa66" : "#cc2222") : "#ddd"
        }`,
        borderRadius: 6,
        background: hov ? (isApprove ? "#e8f7ef" : "#fff0f0") : "#fff",
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.15s",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {isApprove ? (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke={hov ? "#22aa66" : "#aaa"}
          strokeWidth="2.5"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke={hov ? "#cc2222" : "#aaa"}
          strokeWidth="2.5"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </button>
  );
};

export default function VerifyUsers() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [darkMode] = useState(false);

  const getAuthHeaders = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    console.log("Supabase session:", session);

    if (error || !session?.access_token) {
      throw new Error("No active Supabase session. Please login again.");
    }

    return {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    };
  };

  const readJsonResponse = async (response, actionName) => {
    const text = await response.text();

    console.log(`${actionName} response status:`, response.status);
    console.log(`${actionName} raw response:`, text);

    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(`Backend returned non-JSON during ${actionName}.`);
    }

    if (!response.ok) {
      throw new Error(data.error || `${actionName} failed with status ${response.status}.`);
    }

    return data;
  };

  const fetchApplicants = async () => {
    console.log("✅ fetchApplicants started");

    setLoading(true);
    setErrorMessage("");

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${SYSAD_API_URL}/registration-requests/?status=pending`,
        {
          method: "GET",
          headers,
        }
      );

      const data = await readJsonResponse(response, "Fetch applicants");

      const formattedData = (data.registration_requests || []).map((user) => ({
        id: user.id,
        display_id: user.display_id,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        role: user.role || "user",
        barangay: user.barangay || "",
        is_approved: user.is_approved,
        date_joined: user.created_at,
      }));

      setApplicants(formattedData);
    } catch (error) {
      console.error("❌ Failed to fetch applicants:", error);
      setErrorMessage(error.message);
      setApplicants([]);
    } finally {
      console.log("✅ fetchApplicants finished");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this user?")) return;

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${SYSAD_API_URL}/registration-requests/${id}/approve/`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({}),
        }
      );

      const result = await readJsonResponse(response, "Approve user");

      alert(result.message || "User approved successfully!");
      fetchApplicants();
    } catch (err) {
      console.error("Approval failed:", err);
      alert(err.message || "Approval failed.");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this registration request?")) return;

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${SYSAD_API_URL}/registration-requests/${id}/reject/`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({}),
        }
      );

      const result = await readJsonResponse(response, "Reject user");

      alert(result.message || "User rejected successfully.");
      fetchApplicants();
    } catch (err) {
      console.error("Rejection failed:", err);
      alert(err.message || "Rejection failed.");
    }
  };

  const filtered = applicants.filter(
    (a) =>
      `${a.first_name || ""} ${a.last_name || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      `${a.email || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          ...styles.page,
          background: darkMode ? "#1a1a1a" : "#f4f5f7",
        }}
      >
        <main style={styles.main}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: darkMode ? "#fff" : "#111",
                  margin: "0 0 4px",
                }}
              >
                Registration Approvals
              </h1>

              <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
                Review applicant credentials and approve platform access.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or email..."
                style={{
                  padding: "8px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: 8,
                  fontSize: 13,
                  background: darkMode ? "#2a2a2a" : "#fff",
                  color: darkMode ? "#fff" : "#111",
                }}
              />
            </div>
          </div>

          <div
            style={{
              ...styles.tableWrap,
              background: darkMode ? "#1e1e1e" : "#fff",
            }}
          >
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
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: 40 }}>
                      Loading...
                    </td>
                  </tr>
                ) : errorMessage ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "#cc2222",
                        fontWeight: 600,
                      }}
                    >
                      {errorMessage}
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", padding: 40 }}>
                      No pending requests.
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: `1px solid ${
                          darkMode ? "#2a2a2a" : "#f5f5f5"
                        }`,
                      }}
                    >
                      <td style={styles.td}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              background: "#888",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {getInitials(user.first_name, user.last_name)}
                          </div>

                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: 600,
                                color: darkMode ? "#fff" : "#111",
                              }}
                            >
                              {user.first_name} {user.last_name}
                            </p>

                            <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td style={styles.td}>
                        <span style={{ textTransform: "capitalize" }}>
                          {user.role || "User"}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {user.date_joined
                          ? new Date(user.date_joined).toLocaleDateString()
                          : "Date Unknown"}
                      </td>

                      <td style={styles.td}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <ActionBtn
                            type="approve"
                            onClick={() => handleApprove(user.id)}
                          />
                          <ActionBtn
                            type="reject"
                            onClick={() => handleReject(user.id)}
                          />
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