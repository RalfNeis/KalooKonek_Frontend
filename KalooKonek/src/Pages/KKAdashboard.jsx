import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const NAV_ITEMS = ["DASHBOARD", "VERIFY USERS", "APPOINTMENTS", "ANNOUNCEMENTS", "LOGS"];

const styles = {
  page: { fontFamily: "'Outfit', sans-serif", background: "#f4f5f7", minHeight: "100vh", display: "flex", flexDirection: "column" },
  navbar: { background: "#fff", borderBottom: "1px solid #e8e8e8", display: "flex", alignItems: "center", padding: "0 24px", height: 56, gap: 32, position: "sticky", top: 0, zIndex: 100 },
  navBrand: { display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 14, letterSpacing: "0.05em", color: "#111", textTransform: "uppercase", flexShrink: 0 },
  navLogoBox: { width: 32, height: 32, background: "#cc2222", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" },
  navLinks: { display: "flex", alignItems: "center", gap: 4, flex: 1 },
  navRight: { display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" },
  main: { flex: 1, padding: "32px 32px 0", maxWidth: 1140, margin: "0 auto", width: "100%", boxSizing: "border-box" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 28 },
  card: { background: "#fff", borderRadius: 12, padding: "20px 24px", border: "1px solid #ebebeb", position: "relative", overflow: "hidden" },
  cardRed: { background: "#cc2222", borderRadius: 12, padding: "20px 24px", position: "relative", overflow: "hidden", color: "#fff" },
  tableWrap: { background: "#fff", borderRadius: 12, border: "1px solid #ebebeb", overflow: "hidden" },
  th: { fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", padding: "10px 16px", textAlign: "left", borderBottom: "1px solid #f0f0f0" },
  td: { padding: "12px 16px", fontSize: 13, color: "#333", verticalAlign: "middle" },
};

const NavLink = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", padding: "18px 12px", fontSize: 11.5, fontWeight: 700, letterSpacing: "0.07em", color: active ? "#cc2222" : "#888", borderBottom: active ? "2px solid #cc2222" : "2px solid transparent", fontFamily: "'Outfit', sans-serif", transition: "color 0.2s", whiteSpace: "nowrap" }}>
    {label}
  </button>
);

const StatCard = ({ count }) => (
  <div style={styles.card}>
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa", margin: "0 0 8px", textTransform: "uppercase" }}>Registered Seniors</p>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ fontSize: 34, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>
          {count?.toLocaleString() || 0}
        </p>
      </div>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e8e8e8" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    </div>
  </div>
);

const PendingCard = ({ count }) => (
  <div style={styles.cardRed}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)", margin: "0 0 8px", textTransform: "uppercase" }}>
          Pending Verification
        </p>
        <p style={{ fontSize: 40, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>{count || 0}</p>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "rgba(255,255,255,0.85)" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffcc00", display: "inline-block" }} />
          Requires your action
        </span>
      </div>
      <div style={{ position: "relative" }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#cc2222" strokeWidth="3">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
);

const AppointmentsCard = ({ count }) => (
  <div style={styles.card}>
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa", margin: "0 0 8px", textTransform: "uppercase" }}>
      Appointments Today
    </p>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <p style={{ fontSize: 34, fontWeight: 700, color: "#111", margin: "0 0 8px" }}>{count || 0}</p>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "#777" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Across Health Centers
        </span>
      </div>
    </div>
  </div>
);

const SystemStatusCard = () => (
  <div style={styles.card}>
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#aaa", margin: "0 0 16px", textTransform: "uppercase" }}>System Status</p>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: 40, height: 40 }}>
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="#e8f7ef" strokeWidth="4"/>
          <circle cx="20" cy="20" r="16" fill="none" stroke="#22aa66" strokeWidth="4" strokeDasharray="75 25" strokeLinecap="round" transform="rotate(-90 20 20)"/>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22aa66" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#111", margin: 0 }}>Operational</p>
        <p style={{ fontSize: 11, color: "#aaa", margin: "2px 0 0" }}>All services online</p>
      </div>
    </div>
  </div>
);

const Avatar = ({ initials, color = "#cc2222" }) => (
  <div style={{ width: 32, height: 32, borderRadius: "50%", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
    {initials}
  </div>
);

const ReviewBtn = ({ onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick} style={{ padding: "5px 14px", border: "1px solid #ddd", borderRadius: 6, background: hov ? "#f5f5f5" : "#fff", fontSize: 12, fontWeight: 600, color: "#333", cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "background 0.15s" }}>
      Review
    </button>
  );
};

const NeedsApprovalTable = ({ applicants = [] }) => {
  const navigate = useNavigate();
  return (
    <div style={styles.tableWrap}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cc2222" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#111" }}>Needs Approval</span>
        </div>
        <button onClick={() => navigate('/verify-users')} style={{ background: "none", border: "none", color: "#cc2222", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
          View All
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#fafafa" }}>
            <th style={styles.th}>Applicant</th><th style={styles.th}>Barangay</th><th style={styles.th}>Date Requested</th><th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {applicants.length > 0 ? (
            applicants.map((applicant, index) => (
              <tr key={applicant.id || index} style={{ borderBottom: index < applicants.length - 1 ? "1px solid #f5f5f5" : "none" }}>
                <td style={styles.td}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar initials={applicant.full_name?.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() || "??"} color={applicant.role === 'staff' ? "#cc2222" : "#888"} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#111" }}>{applicant.full_name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: "#aaa" }}>{applicant.email}</p>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={{ background: "#f0f0f0", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 600, color: "#555" }}>
                    {applicant.barangay || "N/A"}
                  </span>
                </td>
                <td style={{ ...styles.td, color: "#777" }}>
                  {applicant.created_at ? new Date(applicant.created_at).toLocaleDateString() : "Pending"}
                </td>
                <td style={styles.td}>
                  <ReviewBtn onClick={() => navigate('/verify-users')} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ ...styles.td, textAlign: 'center', padding: '40px', color: '#aaa' }}>No pending approval requests.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div style={{ height: applicants.length < 3 ? 120 : 20 }} />
    </div>
  );
};

const QuickAnnouncement = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  return (
    <div style={{ ...styles.card, padding: 20 }}>
      <p style={{ fontWeight: 700, fontSize: 14, color: "#111", margin: "0 0 16px" }}>Quick Announcement</p>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement Title..." style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 13, outline: "none", background: "#fafafa", fontFamily: "'Outfit', sans-serif", boxSizing: "border-box", marginBottom: 10, color: "#111" }} onFocus={e => e.target.style.borderColor = "#cc2222"} onBlur={e => e.target.style.borderColor = "#e8e8e8"} />
      <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e8e8e8", borderRadius: 8, fontSize: 13, outline: "none", background: "#fafafa", fontFamily: "'Outfit', sans-serif", boxSizing: "border-box", marginBottom: 14, color: category ? "#111" : "#aaa", appearance: "none" }}>
        <option value="" disabled>Select Category</option>
        <option value="health">Health</option>
        <option value="events">Events</option>
        <option value="emergency">Emergency</option>
        <option value="general">General</option>
      </select>
      <button style={{ width: "100%", padding: "11px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>Draft Post</button>
    </div>
  );
};

const SystemEvents = () => {
  const [expanded, setExpanded] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8);

        // FIX: Don't throw on error — gracefully show empty state
        // if the logs table doesn't exist yet or RLS blocks access.
        if (error) {
          console.warn("Could not fetch logs:", error.message);
          setLogs([]);
          return;
        }
        setLogs(data || []);
      } catch (err) {
        console.error("Failed to fetch mini logs:", err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentLogs();
  }, []);

  const displayLogs = expanded ? logs : logs.slice(0, 4);

  const getColor = (type) => {
    if (type === 'AUTH_FAIL') return '#e85555';
    if (type === 'UPDATE') return '#ffb74d';
    if (type === 'PUBLISH') return '#4facfe';
    return '#4caf82';
  };

  return (
    <div style={{ background: "#0f1623", borderRadius: 12, padding: "16px 20px", marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#4caf82", fontSize: 14, fontWeight: 700, fontFamily: "monospace" }}>_</span>
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>SYSTEM EVENTS</span>
        </div>
        <button onClick={() => setExpanded(!expanded)} style={{ background: "none", border: "none", color: "#aaa", fontSize: 11, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
          {expanded ? "Collapse" : "Expand"}
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {loading ? (
          <span style={{ fontSize: 11, color: "#888", fontFamily: "monospace" }}>&gt; Loading events...</span>
        ) : displayLogs.length === 0 ? (
          <span style={{ fontSize: 11, color: "#888", fontFamily: "monospace" }}>&gt; No recent events.</span>
        ) : (
          displayLogs.map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 11, color: getColor(e.event_type), fontFamily: "monospace", flexShrink: 0 }}>
                {new Date(e.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span style={{ 
                fontSize: 11, color: "rgba(255,255,255,0.65)", fontFamily: "monospace", 
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" 
              }}>
                {e.actor} {e.event_type}: {e.payload_details}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState({
    user: { full_name: "admin" },
    stats: { seniors: 0, pending: 0, appointments: 0 },
    applicants: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login'); 
          return;
        }

        // FIX 1: Check role BEFORE running any admin-only queries.
        // This prevents 401/406 errors for non-admin users who land here.
        const { data: profileData, error: profileError } = await supabase
          .from('accounts_userprofile')
          .select('role')
          .eq('supabase_uid', session.user.id)
          .single();

        if (profileError || !profileData || profileData.role !== 'admin') {
          // Not an admin — sign them out and redirect to login
          console.warn("Access denied: user is not an admin.", profileData?.role);
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }

        // 1. Get Logged In Admin's Name
        const { data: adminData } = await supabase
          .from('auth_user')
          .select('first_name')
          .eq('email', session.user.email)
          .single();

        // 2. Count Total Approved Seniors
        const { count: seniorsCount } = await supabase
          .from('accounts_userprofile')
          .select('*', { count: 'exact', head: true })
          .eq('is_approved', true);

        // 3. Count Pending Verifications
        const { count: pendingCount } = await supabase
          .from('accounts_userprofile')
          .select('*', { count: 'exact', head: true })
          .eq('is_approved', false);

        // 4. Count Total Appointments 
        const { count: appointmentsCount } = await supabase
          .from('sysadmin_appointmentrequest')
          .select('*', { count: 'exact', head: true });

        // 5. Fetch preview of up to 5 Pending Applicants
        const { data: pendingUsers } = await supabase
          .from('auth_user')
          .select(`
            id, first_name, last_name, email, date_joined,
            accounts_userprofile!inner(is_approved, barangay)
          `)
          .eq('accounts_userprofile.is_approved', false)
          .limit(5);

        const formattedApplicants = pendingUsers?.map(user => ({
          id: user.id,
          full_name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          barangay: Array.isArray(user.accounts_userprofile) 
            ? user.accounts_userprofile[0]?.barangay 
            : user.accounts_userprofile?.barangay,
          created_at: user.date_joined
        })) || [];

        // 6. Update the React State
        setData({
          user: { full_name: adminData?.first_name || "admin" },
          stats: { 
            seniors: seniorsCount || 0, 
            pending: pendingCount || 0, 
            appointments: appointmentsCount || 0 
          },
          applicants: formattedApplicants
        });

      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ 
        padding: 40, 
        textAlign: 'center', 
        fontFamily: "'Outfit', sans-serif", 
        color: "#111",
        fontWeight: 500
      }}>
        Loading KalooKonek...
      </div>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ ...styles.page, background: darkMode ? "#1a1a1a" : "#f4f5f7" }}>
        <main style={{ ...styles.main }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: darkMode ? "#fff" : "#111", margin: "0 0 4px" }}>
              Welcome back, {data.user.full_name}!
            </h1>
            <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Here is what's happening in KalooKonek today.</p>
            <button 
              onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }}
              style={{ padding: '10px', background: '#cc2222', color: 'white', cursor: 'pointer', marginTop: '10px', borderRadius: '6px', border: 'none', fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}
            >
              DEBUG: FORCE LOGOUT 
            </button>
          </div>

          <div style={styles.statsGrid}>
            <StatCard count={data.stats.seniors} />
            <PendingCard count={data.stats.pending} />
            <AppointmentsCard count={data.stats.appointments} />
            <SystemStatusCard />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, marginTop: 20, paddingBottom: 32 }}>
            <NeedsApprovalTable applicants={data.applicants} />
            <div>
              <QuickAnnouncement />
              <SystemEvents />
            </div>
          </div>
        </main>

        <footer style={{ borderTop: `1px solid ${darkMode ? "#333" : "#e8e8e8"}`, background: darkMode ? "#1e1e1e" : "#fff", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
