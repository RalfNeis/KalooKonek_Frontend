import { useState } from "react";
import { supabase } from "../supabaseClient";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const SYSAD_API_URL = `${API_BASE_URL}/sysad`;

export default function CreateAccount() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "staff",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      throw new Error(data.error || `${actionName} failed.`);
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (
      !form.email.trim() ||
      !form.password.trim() ||
      !form.first_name.trim() ||
      !form.last_name.trim() ||
      !form.role.trim()
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${SYSAD_API_URL}/users/create/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password.trim(),
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          role: form.role,
        }),
      });

      const result = await readJsonResponse(response, "Create account");

      setMessage(
        result.message ||
          `${form.role} account created successfully for ${form.email}.`
      );

      setForm({
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        role: "staff",
      });
    } catch (error) {
      console.error("Create account failed:", error);
      setErrorMessage(error.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
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
            maxWidth: 900,
            margin: "0 auto",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#111",
                margin: "0 0 4px",
              }}
            >
              Create Account
            </h1>

            <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
              Create new admin or staff accounts for the KalooKonek system.
            </p>
          </div>

          {message && (
            <div
              style={{
                background: "#e8f7ef",
                border: "1px solid #22aa66",
                color: "#1e8a53",
                padding: "12px 16px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              {message}
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
                marginBottom: 16,
              }}
            >
              {errorMessage}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #ebebeb",
              padding: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 22,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "#cc2222",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>

              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#111",
                  }}
                >
                  Account Information
                </h2>

                <p style={{ margin: 0, fontSize: 12, color: "#aaa" }}>
                  Fill in the required details below.
                </p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#aaa",
                    marginBottom: 6,
                    textTransform: "uppercase",
                  }}
                >
                  First Name
                </label>

                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#aaa",
                    marginBottom: 6,
                    textTransform: "uppercase",
                  }}
                >
                  Last Name
                </label>

                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "#aaa",
                  marginBottom: 6,
                  textTransform: "uppercase",
                }}
              >
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@email.com"
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 22,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#aaa",
                    marginBottom: 6,
                    textTransform: "uppercase",
                  }}
                >
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  style={inputStyle}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#aaa",
                    marginBottom: 6,
                    textTransform: "uppercase",
                  }}
                >
                  Role
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div
              style={{
                background: "#fafafa",
                border: "1px solid #eeeeee",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 22,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: "#777",
                  lineHeight: 1.5,
                }}
              >
                This will create an approved account in the backend and a
                Supabase login account. The user can sign in using the email and
                password you provide.
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: loading ? "#aaa" : "#cc2222",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "11px 22px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>

                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  border: "1.5px solid #e8e8e8",
  borderRadius: 8,
  fontSize: 13,
  outline: "none",
  background: "#fafafa",
  fontFamily: "'Outfit', sans-serif",
  boxSizing: "border-box",
  color: "#111",
};