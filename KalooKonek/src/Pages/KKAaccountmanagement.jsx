import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

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
  card: {
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
    padding: "12px 16px",
    textAlign: "left",
    borderBottom: "1px solid #f0f0f0",
    background: "#fafafa",
  },
  td: {
    padding: "14px 16px",
    fontSize: 13,
    color: "#333",
    verticalAlign: "middle",
    borderBottom: "1px solid #f5f5f5",
  },
};

const inputStyle = {
  padding: "8px 12px",
  border: "1px solid #e0e0e0",
  borderRadius: 8,
  fontSize: 13,
  background: "#fff",
  color: "#111",
  fontFamily: "'Outfit', sans-serif",
  outline: "none",
};

const badgeStyle = (active) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  borderRadius: 99,
  padding: "4px 10px",
  fontSize: 11,
  fontWeight: 700,
  background: active ? "#e8f7ef" : "#fff0f0",
  border: `1px solid ${active ? "#22aa66" : "#cc2222"}`,
  color: active ? "#1e8a53" : "#cc2222",
});

export default function AccountManagement() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      throw new Error(data.error || `${actionName} failed with status ${response.status}.`);
    }

    return data;
  };

  const fetchAccounts = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${SYSAD_API_URL}/users/`, {
        method: "GET",
        headers,
      });

      const data = await readJsonResponse(response, "Fetch accounts");

      const adminStaffOnly = (data.users || [])
        .filter((user) => ["admin", "staff"].includes(String(user.role).toLowerCase()))
        .map((user) => ({
          display_id: user.display_id,
          name: user.name || "Unnamed Account",
          email: user.email || "",
          role: String(user.role || "staff").toLowerCase(),
          is_active: Boolean(user.is_active),
        }));

      setAccounts(adminStaffOnly);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
      setErrorMessage(error.message);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const updateAccount = async (account, updates) => {
    setSavingId(account.display_id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${SYSAD_API_URL}/users/${account.display_id}/`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          role: updates.role ?? account.role,
          is_active: updates.is_active ?? account.is_active,
        }),
      });

      const data = await readJsonResponse(response, "Update account");

      setSuccessMessage(data.message || "Account updated successfully.");
      await fetchAccounts();
    } catch (error) {
      console.error("Update account failed:", error);
      setErrorMessage(error.message || "Failed to update account.");
    } finally {
      setSavingId("");
    }
  };

  const handleRoleChange = async (account, newRole) => {
    if (account.role === newRole) return;

    const confirmChange = window.confirm(
      `Change ${account.name}'s role from ${account.role} to ${newRole}?`
    );

    if (!confirmChange) return;

    await updateAccount(account, { role: newRole });
  };

  const handleToggleActive = async (account) => {
    const newStatus = !account.is_active;

    const confirmChange = window.confirm(
      `${newStatus ? "Activate" : "Deactivate"} ${account.name}'s account?`
    );

    if (!confirmChange) return;

    await updateAccount(account, { is_active: newStatus });
  };

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      `${account.name} ${account.email} ${account.display_id}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all" || account.role === roleFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && account.is_active) ||
      (statusFilter === "inactive" && !account.is_active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={styles.page}>
        <main style={styles.main}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
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
                Account Management
              </h1>

              <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
                Manage admin and staff accounts, roles, and account status.
              </p>
            </div>

            <button
              onClick={() => navigate("/create-account")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#cc2222",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
              Create Account
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 24,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, or ID..."
              style={{ ...inputStyle, minWidth: 260 }}
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Deactivated</option>
            </select>

            <button
              onClick={fetchAccounts}
              disabled={loading}
              style={{
                padding: "9px 14px",
                border: "1px solid #ddd",
                borderRadius: 8,
                background: "#fff",
                color: "#333",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Refresh
            </button>
          </div>

          {successMessage && (
            <div
              style={{
                background: "#e8f7ef",
                border: "1px solid #22aa66",
                color: "#1e8a53",
                padding: "12px 16px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                marginTop: 16,
              }}
            >
              {successMessage}
            </div>
          )}

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
                marginTop: 16,
              }}
            >
              {errorMessage}
            </div>
          )}

          <div style={styles.card}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={styles.th}>Account</th>
                  <th style={styles.th}>Display ID</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", padding: 40 }}>
                      Loading accounts...
                    </td>
                  </tr>
                ) : filteredAccounts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        padding: 40,
                        color: "#aaa",
                      }}
                    >
                      No admin or staff accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((account) => (
                    <tr key={account.display_id}>
                      <td style={styles.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: "50%",
                              background: "#cc2222",
                              color: "#fff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {account.name
                              .split(" ")
                              .filter(Boolean)
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase() || "??"}
                          </div>

                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: 700,
                                color: "#111",
                              }}
                            >
                              {account.name}
                            </p>
                            <p
                              style={{
                                margin: 0,
                                fontSize: 11,
                                color: "#aaa",
                              }}
                            >
                              {account.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td style={styles.td}>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#777",
                          }}
                        >
                          {account.display_id}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <select
                          value={account.role}
                          disabled={savingId === account.display_id}
                          onChange={(e) => handleRoleChange(account, e.target.value)}
                          style={{
                            ...inputStyle,
                            textTransform: "capitalize",
                            minWidth: 110,
                            cursor:
                              savingId === account.display_id
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          <option value="admin">Admin</option>
                          <option value="staff">Staff</option>
                        </select>
                      </td>

                      <td style={styles.td}>
                        <span style={badgeStyle(account.is_active)}>
                          <span
                            style={{
                              width: 7,
                              height: 7,
                              borderRadius: "50%",
                              background: account.is_active ? "#22aa66" : "#cc2222",
                              display: "inline-block",
                            }}
                          />
                          {account.is_active ? "Active" : "Deactivated"}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <button
                          disabled={savingId === account.display_id}
                          onClick={() => handleToggleActive(account)}
                          style={{
                            padding: "8px 12px",
                            border: `1px solid ${
                              account.is_active ? "#cc2222" : "#22aa66"
                            }`,
                            borderRadius: 8,
                            background: account.is_active ? "#fff0f0" : "#e8f7ef",
                            color: account.is_active ? "#cc2222" : "#1e8a53",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor:
                              savingId === account.display_id
                                ? "not-allowed"
                                : "pointer",
                            fontFamily: "'Outfit', sans-serif",
                          }}
                        >
                          {savingId === account.display_id
                            ? "Saving..."
                            : account.is_active
                            ? "Deactivate"
                            : "Activate"}
                        </button>
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