/* =========================================================
   RaktSetu — data layer (talks to the Express + MongoDB API)
   All data functions are now async and return Promises.
   Only the login session still lives in localStorage.
   ========================================================= */

const RS = (function () {
  // If the page is served by the backend (port 5000) use relative URLs,
  // otherwise (Live Server / file://) call the backend directly.
  const API = location.port === "5000" ? "/api" : "http://localhost:5000/api";
  const SESSION_KEY = "raktsetu_session";

  const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const CAN_DONATE_TO = {
    "O-":  ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    "O+":  ["O+", "A+", "B+", "AB+"],
    "A-":  ["A-", "A+", "AB-", "AB+"],
    "A+":  ["A+", "AB+"],
    "B-":  ["B-", "B+", "AB-", "AB+"],
    "B+":  ["B+", "AB+"],
    "AB-": ["AB-", "AB+"],
    "AB+": ["AB+"],
  };

  const CITIES = [
    "Tirunelveli", "Chennai", "Madurai", "Coimbatore", "Trichy", "Nagercoil", "Tuticorin"
  ];

  async function http(path, options) {
    const res = await fetch(API + path, Object.assign({
      headers: { "Content-Type": "application/json" },
    }, options));
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body.error || "Request failed (" + res.status + ")");
    return body;
  }

  function qs(params) {
    const p = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "" && v !== false) p.append(k, v);
    });
    const s = p.toString();
    return s ? "?" + s : "";
  }

  // ---------- Donors ----------
  const getDonors = () => http("/donors");
  const addDonor = (donor) => http("/donors", { method: "POST", body: JSON.stringify(donor) });
  const findDonors = ({ bloodGroup, city, onlyAvailable } = {}) =>
    http("/donors" + qs({ bloodGroup, city, onlyAvailable }));
  const compatibleDonorsFor = (bloodGroup, city) =>
    http("/donors/compatible" + qs({ bloodGroup, city }));

  // ---------- Requests ----------
  const getRequests = () => http("/requests");
  const addRequest = (data) => http("/requests", { method: "POST", body: JSON.stringify(data) });
  const updateRequestStatus = (id, status) =>
    http("/requests/" + id, { method: "PATCH", body: JSON.stringify({ status }) });

  // ---------- Stock ----------
  const getStock = () => http("/stock");
  const adjustStock = (group, delta) =>
    http("/stock/" + encodeURIComponent(group), { method: "PATCH", body: JSON.stringify({ delta }) });

  // ---------- Contact ----------
  const sendContact = (data) => http("/contact", { method: "POST", body: JSON.stringify(data) });

  // ---------- Session (browser only) ----------
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) { return null; }
  }
  function setSession(session) { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
  function clearSession() { localStorage.removeItem(SESSION_KEY); }

  function timeAgo(ts) {
    const diff = Math.max(0, Date.now() - ts);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return mins + " min ago";
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + " hr ago";
    const days = Math.floor(hrs / 24);
    return days + " day" + (days > 1 ? "s" : "") + " ago";
  }

  return {
    BLOOD_GROUPS, CAN_DONATE_TO, CITIES,
    getDonors, addDonor, findDonors, compatibleDonorsFor,
    getRequests, addRequest, updateRequestStatus,
    getStock, adjustStock, sendContact,
    getSession, setSession, clearSession,
    timeAgo,
  };
})();
