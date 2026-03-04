import { useState } from "react";

const liveFeed = [
  {
    tag: "URGENT",
    tagColor: "#cc2222",
    tagBg: "#fff0f0",
    time: "Today, 8:00 AM",
    title: "Free Medical Mission Weekend",
    body: "The Barangay Health Center will be conducting free checkups, blood sugar testing, and medicine distribution this coming weekend. Please...",
    author: "ADMIN JUAN",
    borderColor: "#cc2222",
  },
  {
    tag: "PENSION UPDATE",
    tagColor: "#1a56db",
    tagBg: "#eff6ff",
    time: "Yesterday",
    title: "Q3 Social Pension Payout Schedule",
    body: "The DSWD Social Pension payout schedule has been released for the 3rd quarter. Please check the barangay hall bulletin for your designated bat...",
    author: "ADMIN MARIA",
    borderColor: "#1a56db",
  },
];

export default function Announcements() {
  const [headline, setHeadline] = useState("");
  const [category, setCategory] = useState("Health & Wellness");
  const [priority, setPriority] = useState("Standard Information");
  const [content, setContent] = useState("");
  const [smsAlert, setSmsAlert] = useState(false);
  const [publishHov, setPublishHov] = useState(false);

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

          {/* Page header */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>
              Announcements Channel
            </h1>
            <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>
              Broadcast important news and updates to the senior citizen portal.
            </p>
          </div>

          {/* Red-orange divider */}
          <div style={{
            height: 3, marginBottom: 24,
            background: "linear-gradient(to right, #cc2222, #ff8c00)",
            borderRadius: 99,
          }} />

          {/* Two column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>

            {/* LEFT — Compose Notice */}
            <div style={{
              background: "#fff", borderRadius: 12,
              border: "1px solid #ebebeb", padding: "24px",
            }}>
              {/* Card title */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cc2222" strokeWidth="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>Compose Notice</span>
              </div>

              {/* Headline */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa", marginBottom: 6, textTransform: "uppercase" }}>
                  Headline
                </label>
                <input
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  placeholder="Enter an eye-catching title..."
                  style={{
                    width: "100%", padding: "10px 14px",
                    border: "1.5px solid #e8e8e8", borderRadius: 8,
                    fontSize: 13, outline: "none", background: "#fafafa",
                    fontFamily: "'Outfit', sans-serif", boxSizing: "border-box", color: "#111",
                  }}
                  onFocus={e => e.target.style.borderColor = "#cc2222"}
                  onBlur={e => e.target.style.borderColor = "#e8e8e8"}
                />
              </div>

              {/* Two dropdowns */}
              <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa", marginBottom: 6, textTransform: "uppercase" }}>
                    Topic Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 14px",
                      border: "1.5px solid #e8e8e8", borderRadius: 8,
                      fontSize: 13, outline: "none", background: "#fafafa",
                      fontFamily: "'Outfit', sans-serif", boxSizing: "border-box",
                      color: "#333", appearance: "none",
                    }}
                    onFocus={e => e.target.style.borderColor = "#cc2222"}
                    onBlur={e => e.target.style.borderColor = "#e8e8e8"}
                  >
                    <option>Health & Wellness</option>
                    <option>Pension Update</option>
                    <option>Events</option>
                    <option>Emergency</option>
                    <option>General</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa", marginBottom: 6, textTransform: "uppercase" }}>
                    Priority Status
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    style={{
                      width: "100%", padding: "10px 14px",
                      border: "1.5px solid #e8e8e8", borderRadius: 8,
                      fontSize: 13, outline: "none", background: "#fafafa",
                      fontFamily: "'Outfit', sans-serif", boxSizing: "border-box",
                      color: "#333", appearance: "none",
                    }}
                    onFocus={e => e.target.style.borderColor = "#cc2222"}
                    onBlur={e => e.target.style.borderColor = "#e8e8e8"}
                  >
                    <option>Standard Information</option>
                    <option>Urgent</option>
                    <option>High Priority</option>
                  </select>
                </div>
              </div>

              {/* Detailed content */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa", marginBottom: 6, textTransform: "uppercase" }}>
                  Detailed Content
                </label>

                {/* Toolbar */}
                <div style={{
                  display: "flex", gap: 4, padding: "6px 10px",
                  border: "1.5px solid #e8e8e8", borderBottom: "none",
                  borderRadius: "8px 8px 0 0", background: "#fafafa",
                }}>
                  {[
                    { label: "B", style: { fontWeight: 700 } },
                    { label: "I", style: { fontStyle: "italic" } },
                    { label: "≡", style: {} },
                  ].map((btn, i) => (
                    <button key={i} style={{
                      width: 26, height: 26, border: "1px solid #e0e0e0",
                      borderRadius: 4, background: "#fff", cursor: "pointer",
                      fontSize: 13, color: "#555", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      ...btn.style,
                    }}>{btn.label}</button>
                  ))}
                  <button style={{
                    width: 26, height: 26, border: "1px solid #e0e0e0",
                    borderRadius: 4, background: "#fff", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                    </svg>
                  </button>
                </div>

                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Type the full announcement details here..."
                  rows={5}
                  style={{
                    width: "100%", padding: "12px 14px",
                    border: "1.5px solid #e8e8e8", borderTop: "none",
                    borderRadius: "0 0 8px 8px",
                    fontSize: 13, outline: "none", background: "#fafafa",
                    fontFamily: "'Outfit', sans-serif", boxSizing: "border-box",
                    color: "#111", resize: "vertical",
                  }}
                  onFocus={e => e.target.style.borderColor = "#cc2222"}
                  onBlur={e => e.target.style.borderColor = "#e8e8e8"}
                />
              </div>

              {/* SMS Alert checkbox */}
              <div
                onClick={() => setSmsAlert(!smsAlert)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 16px", border: "1px solid #e8e8e8",
                  borderRadius: 8, background: "#fafafa", marginBottom: 20,
                  cursor: "pointer",
                }}>
                <div style={{
                  width: 18, height: 18, border: `2px solid ${smsAlert ? "#cc2222" : "#ccc"}`,
                  borderRadius: 4, background: smsAlert ? "#cc2222" : "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.15s",
                }}>
                  {smsAlert && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#333" }}>Push as SMS Alert</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>Sends a text message to all registered verified seniors.</p>
                </div>
              </div>

              {/* Publish button */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onMouseEnter={() => setPublishHov(true)}
                  onMouseLeave={() => setPublishHov(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "11px 24px",
                    background: publishHov ? "#b01c1c" : "#cc2222",
                    color: "#fff", border: "none", borderRadius: 8,
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    fontFamily: "'Outfit', sans-serif", transition: "background 0.15s",
                  }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Publish Announcement
                </button>
              </div>
            </div>

            {/* RIGHT — Live Feed */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#aaa", margin: "0 0 12px", textTransform: "uppercase" }}>
                Live Feed
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {liveFeed.map((item, i) => (
                  <div key={i} style={{
                    background: "#fff", borderRadius: 10,
                    border: "1px solid #ebebeb",
                    borderLeft: `3px solid ${item.borderColor}`,
                    padding: "14px 16px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
                        color: item.tagColor, background: item.tagBg,
                        padding: "2px 8px", borderRadius: 99,
                        display: "inline-flex", alignItems: "center", gap: 4,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: item.tagColor, display: "inline-block" }} />
                        {item.tag}
                      </span>
                      <span style={{ fontSize: 11, color: "#aaa", display: "flex", alignItems: "center", gap: 4 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {item.time}
                      </span>
                    </div>
                    <h4 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "#111" }}>{item.title}</h4>
                    <p style={{ margin: "0 0 10px", fontSize: 12, color: "#777", lineHeight: 1.5 }}>{item.body}</p>
                    <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#aaa" }}>
                      BY {item.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>

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
