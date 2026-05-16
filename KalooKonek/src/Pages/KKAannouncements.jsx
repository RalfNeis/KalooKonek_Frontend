import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const SYSAD_API_URL = `${API_BASE_URL}/sysad`;

export default function Announcements() {
  const [headline, setHeadline] = useState("");
  const [category, setCategory] = useState("Health & Wellness");
  const [priority, setPriority] = useState("Standard Information");
  const [content, setContent] = useState("");
  const [smsAlert, setSmsAlert] = useState(false);
  const [publishHov, setPublishHov] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [liveFeed, setLiveFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
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
    console.log(`${actionName} content-type:`, response.headers.get("content-type"));
    console.log(`${actionName} raw response:`, text);

    let data = {};

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(
        `Backend returned non-JSON during ${actionName}. Status: ${response.status}. Check console raw response.`
      );
    }

    if (!response.ok) {
      throw new Error(data.error || `${actionName} failed with status ${response.status}.`);
    }

    return data;
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${SYSAD_API_URL}/announcements/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await readJsonResponse(response, "Fetch announcements");

      const formattedFeed = (data.announcements || []).map((item) => ({
        id: item.id,
        title: item.title || "",
        body: item.body || "",
        category: item.category || "General",
        priority: item.priority || "Standard Information",
        author: item.author || "Unknown",
        is_published: item.is_published,
        created_at: item.created_at || item.published_at,
      }));

      setLiveFeed(formattedFeed);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
      setErrorMessage(error.message);
      setLiveFeed([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handlePublish = async () => {
    if (!headline.trim() || !content.trim()) {
      alert("Please enter a headline and detailed content before publishing.");
      return;
    }

    setIsPublishing(true);
    setErrorMessage("");

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${SYSAD_API_URL}/announcements/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: headline.trim(),
          body: content.trim(),
          category,
          priority,
          is_published: true,
        }),
      });

      const result = await readJsonResponse(response, "Publish announcement");

      alert(result.message || "Announcement published successfully!");

      setHeadline("");
      setContent("");
      setSmsAlert(false);
      setCategory("Health & Wellness");
      setPriority("Standard Information");

      fetchAnnouncements();
    } catch (error) {
      console.error("Error publishing announcement:", error);
      alert(error.message || "Failed to publish announcement.");
      setErrorMessage(error.message);
    } finally {
      setIsPublishing(false);
    }
  };

const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this announcement?"
  );

  if (!confirmDelete) return;

  setErrorMessage("");

  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${SYSAD_API_URL}/announcements/${id}/`, {
      method: "DELETE",
      headers,
    });

    const result = await readJsonResponse(response, "Delete announcement");

    alert(result.message || "Announcement deleted successfully!");
    fetchAnnouncements();
  } catch (error) {
    console.error("Error deleting announcement:", error);
    alert(error.message || "Failed to delete announcement.");
    setErrorMessage(error.message);
  }
};

  const getTagStyle = (priorityStr, categoryStr) => {
    if (priorityStr === "Urgent") {
      return {
        color: "#cc2222",
        bg: "#fff0f0",
        border: "#cc2222",
        label: "URGENT",
      };
    }

    if (priorityStr === "High Priority") {
      return {
        color: "#b07d00",
        bg: "#fff8ec",
        border: "#f5c842",
        label: "HIGH PRIORITY",
      };
    }

    if (categoryStr === "Health & Wellness") {
      return {
        color: "#22aa66",
        bg: "#e8f7ef",
        border: "#22aa66",
        label: "HEALTH",
      };
    }

    if (categoryStr === "Pension Update") {
      return {
        color: "#1a56db",
        bg: "#eff6ff",
        border: "#1a56db",
        label: "PENSION",
      };
    }

    if (categoryStr === "Events") {
      return {
        color: "#7c3aed",
        bg: "#f3e8ff",
        border: "#7c3aed",
        label: "EVENTS",
      };
    }

    if (categoryStr === "Emergency") {
      return {
        color: "#cc2222",
        bg: "#fff0f0",
        border: "#cc2222",
        label: "EMERGENCY",
      };
    }

    return {
      color: "#555",
      bg: "#f5f5f5",
      border: "#ccc",
      label: categoryStr?.toUpperCase() || "INFO",
    };
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Unknown";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredFeed = liveFeed.filter((item) => {
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;

    const matchesPriority =
      priorityFilter === "All" || item.priority === priorityFilter;

    return matchesCategory && matchesPriority;
  });

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
          <div style={{ marginBottom: 20 }}>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#111",
                margin: "0 0 4px",
              }}
            >
              Announcements Channel
            </h1>

            <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
              Broadcast important news and updates to the senior citizen portal.
            </p>
          </div>

          <div
            style={{
              height: 3,
              marginBottom: 24,
              background: "linear-gradient(to right, #cc2222, #ff8c00)",
              borderRadius: 99,
            }}
          />

          {errorMessage && (
            <div
              style={{
                background: "#fff0f0",
                border: "1px solid #cc2222",
                color: "#cc2222",
                padding: "10px 14px",
                borderRadius: 8,
                fontSize: 13,
                marginBottom: 16,
                fontWeight: 600,
              }}
            >
              {errorMessage}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 320px",
              gap: 24,
            }}
          >
            <div
              style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid #ebebeb",
                padding: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 20,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#cc2222"
                  strokeWidth="2.5"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>

                <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>
                  Compose Notice
                </span>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Headline</label>

                <input
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Enter an eye-catching title..."
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Topic Category</label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={inputStyle}
                  >
                    <option>Health & Wellness</option>
                    <option>Pension Update</option>
                    <option>Events</option>
                    <option>Emergency</option>
                    <option>General</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Priority Status</label>

                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={inputStyle}
                  >
                    <option>Standard Information</option>
                    <option>Urgent</option>
                    <option>High Priority</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Detailed Content</label>

                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type the full announcement details here..."
                  rows={7}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: 1.5,
                  }}
                />
              </div>

              <div
                onClick={() => setSmsAlert(!smsAlert)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  border: "1px solid #e8e8e8",
                  borderRadius: 8,
                  background: "#fafafa",
                  marginBottom: 20,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    border: `2px solid ${smsAlert ? "#cc2222" : "#ccc"}`,
                    borderRadius: 4,
                    background: smsAlert ? "#cc2222" : "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {smsAlert && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>

                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#333",
                    }}
                  >
                    Push as SMS Alert
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>
                    Sends a text message to all registered verified seniors.
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  onMouseEnter={() => setPublishHov(true)}
                  onMouseLeave={() => setPublishHov(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "11px 24px",
                    background:
                      publishHov && !isPublishing
                        ? "#b01c1c"
                        : isPublishing
                        ? "#aaa"
                        : "#cc2222",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: isPublishing ? "not-allowed" : "pointer",
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
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>

                  {isPublishing ? "Publishing..." : "Publish Announcement"}
                </button>
              </div>
            </div>

            <div>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  color: "#aaa",
                  margin: "0 0 12px",
                  textTransform: "uppercase",
                }}
              >
                Live Feed
              </p>

              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={filterSelectStyle}
                >
                  <option>All</option>
                  <option>Health & Wellness</option>
                  <option>Pension Update</option>
                  <option>Events</option>
                  <option>Emergency</option>
                  <option>General</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  style={filterSelectStyle}
                >
                  <option>All</option>
                  <option>Standard Information</option>
                  <option>Urgent</option>
                  <option>High Priority</option>
                </select>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {loading ? (
                  <p
                    style={{
                      fontSize: 13,
                      color: "#aaa",
                      textAlign: "center",
                      marginTop: 20,
                    }}
                  >
                    Loading feed...
                  </p>
                ) : filteredFeed.length > 0 ? (
                  filteredFeed.map((item) => {
                    const tagStyle = getTagStyle(item.priority, item.category);

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: "#fff",
                          borderRadius: 10,
                          border: "1px solid #ebebeb",
                          borderLeft: `3px solid ${tagStyle.border}`,
                          padding: "14px 16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              color: tagStyle.color,
                              background: tagStyle.bg,
                              padding: "2px 8px",
                              borderRadius: 99,
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <span
                              style={{
                                width: 5,
                                height: 5,
                                borderRadius: "50%",
                                background: tagStyle.color,
                                display: "inline-block",
                              }}
                            />
                            {tagStyle.label}
                          </span>

                          <span style={{ fontSize: 11, color: "#aaa" }}>
                            {formatTime(item.created_at)}
                          </span>
                        </div>

                        <h4
                          style={{
                            margin: "0 0 6px",
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#111",
                          }}
                        >
                          {item.title}
                        </h4>

                        <p
                          style={{
                            margin: "0 0 8px",
                            fontSize: 12,
                            color: "#777",
                            lineHeight: 1.5,
                          }}
                        >
                          {item.body}
                        </p>

                        <p
                          style={{
                            margin: "0 0 4px",
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "#aaa",
                          }}
                        >
                          CATEGORY: {item.category} · PRIORITY: {item.priority}
                        </p>

                        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  }}
>
  <p
    style={{
      margin: 0,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.08em",
      color: "#aaa",
    }}
  >
    BY {item.author || "ADMIN"}
  </p>

  <button
    onClick={() => handleDelete(item.id)}
    style={{
      background: "#fff0f0",
      border: "1px solid #cc2222",
      color: "#cc2222",
      borderRadius: 6,
      padding: "5px 9px",
      fontSize: 11,
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "'Outfit', sans-serif",
    }}
  >
    Delete
  </button>
</div>
                      </div>
                    );
                  })
                ) : (
                  <p
                    style={{
                      fontSize: 13,
                      color: "#aaa",
                      textAlign: "center",
                      marginTop: 20,
                    }}
                  >
                    No announcements match the selected filters.
                  </p>
                )}
              </div>
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

          <div style={{ display: "flex", gap: 20 }}>
            {["PRIVACY", "TERMS", "SUPPORT"].map((l) => (
              <button
                key={l}
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
                {l}
              </button>
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.1em",
  color: "#aaa",
  marginBottom: 6,
  textTransform: "uppercase",
};

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

const filterSelectStyle = {
  flex: 1,
  padding: "8px 10px",
  border: "1px solid #ddd",
  borderRadius: 8,
  fontSize: 12,
  fontFamily: "'Outfit', sans-serif",
  background: "#fff",
  color: "#333",
};