import { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';

export default function Announcements() {
  // Form State
  const [headline, setHeadline] = useState("");
  const [category, setCategory] = useState("Health & Wellness");
  const [priority, setPriority] = useState("Standard Information");
  const [content, setContent] = useState("");
  const [smsAlert, setSmsAlert] = useState(false);
  const [publishHov, setPublishHov] = useState(false);

  // Database State
  const [liveFeed, setLiveFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  // 1. Fetch Announcements from Database
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sysadmin_announcement')
        .select('*')
        .order('created_at', { ascending: false }); // Newest first

      if (error) throw error;
      setLiveFeed(data || []);
    } catch (error) {
      console.error("Failed to fetch announcements:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // 2. Publish New Announcement
  const handlePublish = async () => {
    if (!headline.trim() || !content.trim()) {
      alert("Please enter a headline and detailed content before publishing.");
      return;
    }

    setIsPublishing(true);
    try {
      // Try to get the currently logged-in admin's name
      const { data: { session } } = await supabase.auth.getSession();
      let authorName = "ADMIN";

      if (session) {
        const { data: adminData } = await supabase
          .from('auth_user')
          .select('first_name, last_name')
          .eq('email', session.user.email)
          .single();
        if (adminData) {
          authorName = `${adminData.first_name} ${adminData.last_name}`.toUpperCase();
        }
      }

      // Insert into the database
      const { error } = await supabase
        .from('sysadmin_announcement')
        .insert([
          {
            title: headline,
            category: category,
            priority: priority,
            content: content,
            author: authorName,
            // 'created_at' is handled automatically by Postgres
          }
        ]);

      if (error) throw error;

      alert("Announcement published successfully!");
      
      // Clear form inputs
      setHeadline("");
      setContent("");
      setSmsAlert(false);
      setCategory("Health & Wellness");
      setPriority("Standard Information");

      // Refresh the feed to show the new post
      fetchAnnouncements();
    } catch (error) {
      console.error("Error publishing announcement:", error.message);
      alert("Failed to publish announcement. Check console.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Helper functions for dynamic styling and dates
  const getTagStyle = (priorityStr, categoryStr) => {
    if (priorityStr === 'Urgent') return { color: '#cc2222', bg: '#fff0f0', border: '#cc2222', label: 'URGENT' };
    if (priorityStr === 'High Priority') return { color: '#b07d00', bg: '#fff8ec', border: '#f5c842', label: 'HIGH PRIORITY' };
    if (categoryStr === 'Health & Wellness') return { color: '#22aa66', bg: '#e8f7ef', border: '#22aa66', label: 'HEALTH' };
    if (categoryStr === 'Pension Update') return { color: '#1a56db', bg: '#eff6ff', border: '#1a56db', label: 'PENSION' };
    return { color: '#555', bg: '#f5f5f5', border: '#ccc', label: categoryStr?.toUpperCase() || 'INFO' }; 
  };

  const formatTime = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: "'Outfit', sans-serif", background: "#f4f5f7", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        <main style={{ flex: 1, padding: "32px 32px 0", maxWidth: 1140, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>

          {/* Page header */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111", margin: "0 0 4px" }}>Announcements Channel</h1>
            <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Broadcast important news and updates to the senior citizen portal.</p>
          </div>

          <div style={{ height: 3, marginBottom: 24, background: "linear-gradient(to right, #cc2222, #ff8c00)", borderRadius: 99 }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>

            {/* LEFT — Compose Notice */}
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cc2222" strokeWidth="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#111" }}>Compose Notice</span>
              </div>

              {/* Headline */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa", marginBottom: 6, textTransform: "uppercase" }}>Headline</label>
                <input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Enter an eye-catching title..." style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 13, outline: "none", background: "#fafafa", fontFamily: "'Outfit', sans-serif", boxSizing: "border-box", color: "#111" }} onFocus={e => e.target.style.borderColor = "#cc2222"} onBlur={e => e.target.style.borderColor = "#e8e8e8"} />
              </div>

              {/* Two dropdowns */}
              <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa", marginBottom: 6, textTransform: "uppercase" }}>Topic Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 13, outline: "none", background: "#fafafa", fontFamily: "'Outfit', sans-serif", boxSizing: "border-box", color: "#333", appearance: "none" }} onFocus={e => e.target.style.borderColor = "#cc2222"} onBlur={e => e.target.style.borderColor = "#e8e8e8"}>
                    <option>Health & Wellness</option>
                    <option>Pension Update</option>
                    <option>Events</option>
                    <option>Emergency</option>
                    <option>General</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa", marginBottom: 6, textTransform: "uppercase" }}>Priority Status</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 13, outline: "none", background: "#fafafa", fontFamily: "'Outfit', sans-serif", boxSizing: "border-box", color: "#333", appearance: "none" }} onFocus={e => e.target.style.borderColor = "#cc2222"} onBlur={e => e.target.style.borderColor = "#e8e8e8"}>
                    <option>Standard Information</option>
                    <option>Urgent</option>
                    <option>High Priority</option>
                  </select>
                </div>
              </div>

              {/* Detailed content */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa", marginBottom: 6, textTransform: "uppercase" }}>Detailed Content</label>
                <div style={{ display: "flex", gap: 4, padding: "6px 10px", border: "1.5px solid #e8e8e8", borderBottom: "none", borderRadius: "8px 8px 0 0", background: "#fafafa" }}>
                  {[{ label: "B", style: { fontWeight: 700 } }, { label: "I", style: { fontStyle: "italic" } }, { label: "≡", style: {} }].map((btn, i) => (
                    <button key={i} style={{ width: 26, height: 26, border: "1px solid #e0e0e0", borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 13, color: "#555", display: "flex", alignItems: "center", justifyContent: "center", ...btn.style }}>{btn.label}</button>
                  ))}
                </div>
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Type the full announcement details here..." rows={5} style={{ width: "100%", padding: "12px 14px", border: "1.5px solid #e8e8e8", borderTop: "none", borderRadius: "0 0 8px 8px", fontSize: 13, outline: "none", background: "#fafafa", fontFamily: "'Outfit', sans-serif", boxSizing: "border-box", color: "#111", resize: "vertical" }} onFocus={e => e.target.style.borderColor = "#cc2222"} onBlur={e => e.target.style.borderColor = "#e8e8e8"} />
              </div>

              {/* SMS Alert */}
              <div onClick={() => setSmsAlert(!smsAlert)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", border: "1px solid #e8e8e8", borderRadius: 8, background: "#fafafa", marginBottom: 20, cursor: "pointer" }}>
                <div style={{ width: 18, height: 18, border: `2px solid ${smsAlert ? "#cc2222" : "#ccc"}`, borderRadius: 4, background: smsAlert ? "#cc2222" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.15s" }}>
                  {smsAlert && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#333" }}>Push as SMS Alert</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>Sends a text message to all registered verified seniors.</p>
                </div>
              </div>

              {/* Publish button */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button onClick={handlePublish} disabled={isPublishing} onMouseEnter={() => setPublishHov(true)} onMouseLeave={() => setPublishHov(false)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", background: publishHov && !isPublishing ? "#b01c1c" : (isPublishing ? "#aaa" : "#cc2222"), color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: isPublishing ? "not-allowed" : "pointer", fontFamily: "'Outfit', sans-serif", transition: "background 0.15s" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  {isPublishing ? "Publishing..." : "Publish Announcement"}
                </button>
              </div>
            </div>

            {/* RIGHT — Live Feed */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#aaa", margin: "0 0 12px", textTransform: "uppercase" }}>Live Feed</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {loading ? (
                  <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", marginTop: 20 }}>Loading feed...</p>
                ) : liveFeed.length > 0 ? (
                  liveFeed.map((item) => {
                    const style = getTagStyle(item.priority, item.category);
                    return (
                      <div key={item.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid #ebebeb", borderLeft: `3px solid ${style.border}`, padding: "14px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: style.color, background: style.bg, padding: "2px 8px", borderRadius: 99, display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <span style={{ width: 5, height: 5, borderRadius: "50%", background: style.color, display: "inline-block" }} />
                            {style.label}
                          </span>
                          <span style={{ fontSize: 11, color: "#aaa", display: "flex", alignItems: "center", gap: 4 }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            {formatTime(item.created_at)}
                          </span>
                        </div>
                        <h4 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "#111" }}>{item.title}</h4>
                        <p style={{ margin: "0 0 10px", fontSize: 12, color: "#777", lineHeight: 1.5 }}>{item.content}</p>
                        <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#aaa" }}>BY {item.author || "ADMIN"}</p>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ fontSize: 13, color: "#aaa", textAlign: "center", marginTop: 20 }}>No announcements published yet.</p>
                )}
              </div>
            </div>

          </div>

          <div style={{ height: 32 }} />
        </main>

        <footer style={{ borderTop: "1px solid #e8e8e8", background: "#fff", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#aaa" }}>© 2026 KalooKonek | Technological University of the Philippines</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["PRIVACY", "TERMS", "SUPPORT"].map(l => (
              <button key={l} style={{ background: "none", border: "none", fontSize: 11, fontWeight: 700, color: "#aaa", cursor: "pointer", letterSpacing: "0.05em", fontFamily: "'Outfit', sans-serif" }}>{l}</button>
            ))}
          </div>
        </footer>

      </div>
    </>
  );
}