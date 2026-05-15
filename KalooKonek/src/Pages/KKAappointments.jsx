import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const SYSAD_API_URL = `${API_BASE_URL}/sysad`;

const PendingBadge = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: "#fff8ec",
      border: "1px solid #f5c842",
      color: "#b07d00",
      borderRadius: 99,
      padding: "3px 10px",
      fontSize: 11,
      fontWeight: 600,
    }}
  >
    PENDING
  </span>
);

const ScheduledBadge = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: "#e8f7ef",
      border: "1px solid #22aa66",
      color: "#1e8a53",
      borderRadius: 99,
      padding: "3px 10px",
      fontSize: 11,
      fontWeight: 600,
    }}
  >
    APPROVED
  </span>
);

const RejectedBadge = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: "#fff0f0",
      border: "1px solid #cc2222",
      color: "#cc2222",
      borderRadius: 99,
      padding: "3px 10px",
      fontSize: 11,
      fontWeight: 600,
    }}
  >
    REJECTED
  </span>
);

const AppointmentCard = ({ data, onApprove, onReject }) => {
  const [approveHov, setApproveHov] = useState(false);
  const [rejectHov, setRejectHov] = useState(false);

  const isPending = data.status === "PENDING";

  const renderBadge = () => {
    if (data.status === "APPROVED") return <ScheduledBadge />;
    if (data.status === "REJECTED") return <RejectedBadge />;
    return <PendingBadge />;
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #ebebeb",
        padding: "20px 24px",
        flex: "1 1 400px",
        maxWidth: 520,
        borderLeft: `4px solid ${
          data.status === "APPROVED"
            ? "#22aa66"
            : data.status === "REJECTED"
            ? "#cc2222"
            : "#f5c842"
        }`,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
          marginBottom: 16,
        }}
      >
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              fontWeight: 700,
              color: "#aaa",
              letterSpacing: "0.1em",
            }}
          >
            {data.month}
          </p>

          <p
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: "#111",
              lineHeight: 1,
            }}
          >
            {data.day}
          </p>
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <h3
              style={{
                margin: "0 0 4px",
                fontSize: 16,
                fontWeight: 700,
                color: "#111",
              }}
            >
              {data.title}
            </h3>

            {renderBadge()}
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "#888",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#cc2222",
                display: "inline-block",
              }}
            />
            {data.name}
            <span style={{ color: "#ccc" }}>·</span>
            <span style={{ color: "#aaa" }}>{data.displayId}</span>
          </p>
        </div>
      </div>

      <div
        style={{
          background: "#fafafa",
          borderRadius: 8,
          border: "1px solid #f0f0f0",
          padding: "12px 14px",
          marginBottom: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#555",
          }}
        >
          <span style={{ color: "#aaa", fontWeight: 600 }}>Req Time:</span>
          <span>{data.reqTime}</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            fontSize: 13,
            color: "#555",
          }}
        >
          <span style={{ color: "#aaa", fontWeight: 600 }}>Reason:</span>
          <span>{data.reason}</span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "#555",
          }}
        >
          <span style={{ color: "#aaa", fontWeight: 600 }}>Location:</span>
          <span>{data.location}</span>
        </div>
      </div>

      {isPending && (
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => onApprove(data.rawId)}
            onMouseEnter={() => setApproveHov(true)}
            onMouseLeave={() => setApproveHov(false)}
            style={{
              flex: 1,
              padding: "10px",
              background: approveHov ? "#111" : "#0f1623",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Approve Slot
          </button>

          <button
            onClick={() => onReject(data.rawId)}
            onMouseEnter={() => setRejectHov(true)}
            onMouseLeave={() => setRejectHov(false)}
            style={{
              flex: 1,
              padding: "10px",
              background: rejectHov ? "#fff0f0" : "#fff",
              color: "#cc2222",
              border: "1px solid #cc2222",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Reject Request
          </button>
        </div>
      )}
    </div>
  );
};

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("requests");
  const [appointments, setAppointments] = useState([]);
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

  const fetchAppointments = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${SYSAD_API_URL}/appointment-requests/`, {
        method: "GET",
        headers,
      });

      const data = await readJsonResponse(response, "Fetch appointments");

      const formattedData = (data.appointment_requests || []).map((item) => {
        const appointmentDate = new Date(item.requested_date || new Date());

        return {
          rawId: item.id,
          month: appointmentDate
            .toLocaleString("default", { month: "short" })
            .toUpperCase(),
          day: appointmentDate.getDate().toString(),
          title: "General Checkup",
          name: item.patient_name || "Unknown Patient",
          displayId: `#APT-${String(item.id).padStart(4, "0")}`,
          reqTime: item.requested_time || "TBA",
          reason: item.reason || "No reason provided.",
          location: "Health Center",
          status: item.status || "PENDING",
          createdAt: item.created_at,
        };
      });

      setAppointments(formattedData);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setErrorMessage(err.message);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateAppointmentStatus = async (id, status) => {
    const action = status === "APPROVED" ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this appointment?`)) {
      return;
    }

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${SYSAD_API_URL}/appointment-requests/${id}/`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ status }),
        }
      );

      const result = await readJsonResponse(response, `${action} appointment`);

      alert(result.message || `Appointment ${action}d successfully.`);
      fetchAppointments();
    } catch (err) {
      console.error(`${action} failed:`, err);
      alert(err.message || `Failed to ${action} appointment.`);
    }
  };

  const pendingAppointments = appointments.filter(
    (a) => a.status === "PENDING"
  );

  const scheduledAppointments = appointments.filter(
    (a) => a.status === "APPROVED"
  );

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
              marginBottom: 28,
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
                Health Center Appointments
              </h1>

              <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
                Manage and schedule incoming checkup requests.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                border: "1px solid #e0e0e0",
                borderRadius: 8,
                overflow: "hidden",
                background: "#fff",
              }}
            >
              <button
                onClick={() => setActiveTab("requests")}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  background: activeTab === "requests" ? "#fff" : "#fafafa",
                  color: activeTab === "requests" ? "#cc2222" : "#888",
                  borderRight: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                REQUESTS
                <span
                  style={{
                    background: "#cc2222",
                    color: "#fff",
                    borderRadius: 99,
                    padding: "1px 6px",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {pendingAppointments.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("scheduled")}
                style={{
                  padding: "8px 16px",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  background: activeTab === "scheduled" ? "#fff" : "#fafafa",
                  color: activeTab === "scheduled" ? "#cc2222" : "#888",
                }}
              >
                SCHEDULED
                <span
                  style={{
                    marginLeft: 6,
                    background: "#e8f7ef",
                    color: "#22aa66",
                    borderRadius: 99,
                    padding: "1px 6px",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                >
                  {scheduledAppointments.length}
                </span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div
              style={{
                width: "100%",
                background: "#fff0f0",
                borderRadius: 12,
                border: "1px solid #cc2222",
                padding: 16,
                marginBottom: 20,
                textAlign: "center",
                color: "#cc2222",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {errorMessage}
            </div>
          )}

          {loading ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "#aaa",
                fontSize: 14,
              }}
            >
              Loading appointments...
            </div>
          ) : activeTab === "requests" ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {pendingAppointments.length > 0 ? (
                pendingAppointments.map((a) => (
                  <AppointmentCard
                    key={a.rawId}
                    data={a}
                    onApprove={(id) => updateAppointmentStatus(id, "APPROVED")}
                    onReject={(id) => updateAppointmentStatus(id, "REJECTED")}
                  />
                ))
              ) : (
                <div
                  style={{
                    width: "100%",
                    background: "#fff",
                    borderRadius: 12,
                    border: "1px solid #ebebeb",
                    padding: 40,
                    textAlign: "center",
                    color: "#aaa",
                    fontSize: 14,
                  }}
                >
                  No pending appointment requests.
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {scheduledAppointments.length > 0 ? (
                scheduledAppointments.map((a) => (
                  <AppointmentCard key={a.rawId} data={a} />
                ))
              ) : (
                <div
                  style={{
                    width: "100%",
                    background: "#fff",
                    borderRadius: 12,
                    border: "1px solid #ebebeb",
                    padding: 40,
                    textAlign: "center",
                    color: "#aaa",
                    fontSize: 14,
                  }}
                >
                  No scheduled appointments yet.
                </div>
              )}
            </div>
          )}

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

          <div style={{ display: "flex", gap: 20 }}>
            {["PRIVACY", "TERMS", "SUPPORT"].map((label) => (
              <button
                key={label}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#aaa",
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}