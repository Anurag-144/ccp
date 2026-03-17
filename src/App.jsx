import { useState, useEffect } from "react";
import LoginPage from "./Login";
import LandingPage from "./LandingPage";

function getRainfallForCoords(lat, lon) {
  if (lat > 28 && lon > 76 && lon < 80) return 650;
  if (lat > 22 && lat < 28 && lon > 72 && lon < 76) return 580;
  if (lat > 18 && lat < 22 && lon > 72 && lon < 80) return 900;
  if (lat > 12 && lat < 18 && lon > 74 && lon < 80) return 800;
  if (lat > 8 && lat < 12 && lon > 76 && lon < 80) return 1200;
  if (lat > 22 && lon > 80 && lon < 88) return 1100;
  if (lat > 25 && lon > 88 && lon < 97) return 1800;
  if (lat > 30 && lon > 76 && lon < 82) return 1100;
  return 800;
}

const ROOF_TYPES = {
  RCC: { label: "RCC (Concrete)", coeff: 0.85 },
  Tiles: { label: "Tiles", coeff: 0.80 },
  Metal: { label: "Metal Sheet", coeff: 0.90 },
  AC: { label: "Asbestos Cement", coeff: 0.85 },
  Thatch: { label: "Thatch", coeff: 0.60 },
};

// Standard hydrogeology recharge fractions
const SOIL_TYPES = {
  Sandy: { label: "Sandy", coeff: 0.60 },
  Loamy: { label: "Loamy", coeff: 0.50 },
  Clay: { label: "Clayey", coeff: 0.20 },
  Gravel: { label: "Gravel", coeff: 0.75 },
  Laterite: { label: "Laterite", coeff: 0.45 },
};

function getRecommendedStructure(area, soilKey) {
  if (area < 50) return soilKey === "Clay" ? "Rooftop Tank (Small)" : "Percolation Pit";
  if (area < 150) return soilKey === "Clay" ? "Storage Tank (Medium)" : "Recharge Well";
  if (area < 300) return "Storage Tank + Recharge Pit (Medium scale)";
  return "Storage Tank + Recharge Pit (Large scale)";
}

function calculate({ area, roofKey, soilKey, rainfall }) {
  const rC = ROOF_TYPES[roofKey].coeff;
  const sC = SOIL_TYPES[soilKey].coeff;
  const harvest = Math.round(area * (rainfall / 1000) * rC * 1000);
  const recharge = Math.round(harvest * sC);
  return { harvest, recharge };
}

const C = "#00B4D8";
const DK = "#0a1628";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Sora:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Sora', sans-serif; background: #f0f4f8; color: ${DK}; }

  /* ──── FIX: force dark text in ALL inputs ──── */
  input, select, textarea {
    color: ${DK} !important;
    background: #f8fafc !important;
    font-family: 'Sora', sans-serif;
    -webkit-text-fill-color: ${DK} !important;
  }
  input::placeholder { color: #9baab8 !important; -webkit-text-fill-color: #9baab8 !important; }
  input:focus, select:focus {
    outline: none;
    border-color: ${C} !important;
    box-shadow: 0 0 0 3px rgba(0,180,216,.15) !important;
  }

  .btn { cursor:pointer; border:none; font-family:'Sora',sans-serif; font-weight:600; transition:all .18s; border-radius:10px; }
  .btn:hover  { filter:brightness(1.08); transform:translateY(-1px); }
  .btn:active { transform:translateY(0); }

  @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes toastIn { from{opacity:0;transform:translateX(50px)} to{opacity:1;transform:translateX(0)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  .fu0{animation:fadeUp .45s .00s ease both}
  .fu1{animation:fadeUp .45s .10s ease both}
  .fu2{animation:fadeUp .45s .20s ease both}
  .fu3{animation:fadeUp .45s .30s ease both}

  .hero {
    background: linear-gradient(155deg,#e4f3f9 0%,#cce8f4 45%,#bde2f2 100%);
    position:relative; overflow:hidden;
  }
  .hero::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background-image:
      repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(0,180,216,.06) 40px),
      repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(0,180,216,.06) 40px);
  }
  .card { background:white; border-radius:16px; border:1px solid #e2eaf2; }
  .snum {
    width:30px; height:30px; border-radius:50%; flex-shrink:0;
    background:rgba(0,180,216,.14); color:${C};
    display:flex; align-items:center; justify-content:center;
    font-weight:700; font-size:14px;
  }
  .bignum { font-family:'Nunito',sans-serif; font-weight:900; letter-spacing:-0.03em; }

  /* ──── Centred page shells ──── */
  .page        { min-height:calc(100vh - 64px); padding:44px 24px; }
  .page-inner  { max-width:700px;  margin:0 auto; width:100%; }
  .res-inner   { max-width:920px;  margin:0 auto; width:100%; }
`;

/* ─── Nav ──────────────────────────────────── */
function Nav({ page, setPage, user, onSignOut }) {
  return (
    <nav style={{ background: "white", borderBottom: "1px solid #e2eaf2", padding: "0 32px", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("home")}>
          <div style={{ width: 38, height: 38, background: `linear-gradient(135deg,${C},#0077b6)`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💧</div>
          <div>
            <div style={{ fontFamily: "Nunito", fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>HydroScan</div>
            <div style={{ fontSize: 10, color: "#999", marginTop: -1 }}>Rainwater Assessor</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button className="btn" onClick={() => setPage("home")}
            style={{ background: "none", color: page === "home" ? C : "#555", fontSize: 14, padding: "6px 4px" }}>Home</button>
          <button className="btn" onClick={() => setPage("assess")}
            style={{ background: page === "assess" ? C : "none", color: page === "assess" ? "white" : "#555", fontSize: 14, padding: "8px 18px" }}>
            New Assessment
          </button>
          {user && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, borderLeft: "1px solid #e2eaf2", paddingLeft: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg,${C},#0077b6)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 13 }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontSize: 13 }}>
                <div style={{ fontWeight: 600, color: DK, lineHeight: 1.2 }}>{user.name}</div>
                <div style={{ color: "#9baab8", fontSize: 11 }}>{user.email}</div>
              </div>
              <button className="btn" onClick={onSignOut}
                style={{ background: "#f0f4f8", color: "#5a7090", fontSize: 12, padding: "6px 12px", borderRadius: 8, marginLeft: 4 }}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ─── Home ─────────────────────────────────── */
function HomePage({ setPage }) {
  return (
    <div>
      <div className="hero" style={{ minHeight: "88vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "60px 24px" }}>
        <div className="fu0" style={{ background: "rgba(0,180,216,.12)", color: C, fontSize: 13, fontWeight: 600, padding: "6px 16px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: C, display: "inline-block" }} /> Smart Water Management
        </div>
        <h1 className="fu1" style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: "clamp(34px,5.5vw,62px)", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20 }}>
          Calculate Your<br /><span style={{ color: C }}>Rainwater Potential</span>
        </h1>
        <p className="fu2" style={{ color: "#4a6080", fontSize: 17, maxWidth: 480, lineHeight: 1.7, marginBottom: 40 }}>
          Discover how much water you can harvest and recharge. Get a professional on-spot assessment for your rooftop in seconds.
        </p>
        <div className="fu3" style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn" onClick={() => setPage("assess")}
            style={{ background: C, color: "white", padding: "14px 32px", fontSize: 16, display: "flex", alignItems: "center", gap: 8, borderRadius: 12 }}>
            Start Assessment →
          </button>
          <button className="btn" style={{ background: "white", color: DK, padding: "14px 28px", fontSize: 16, border: "1px solid #d0dce8", borderRadius: 12 }}>
            Learn More
          </button>
        </div>
      </div>

      <div style={{ background: "white", padding: "72px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
          {[
            { icon: "🌧️", accent: C, title: "Accurate Data", desc: "Uses local IMD rainfall data and specific coefficients based on your roof and soil type." },
            { icon: "📊", accent: C, title: "Instant Report", desc: "Get immediate calculations for harvest potential and recharge capacity in liters." },
            { icon: "🛡️", accent: "#f59e0b", title: "Expert Advice", desc: "Receive tailored recommendations on the best harvesting structure for your needs." },
          ].map(f => (
            <div key={f.title} className="card" style={{ padding: "32px 28px", transition: "all .2s" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,100,160,.1)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
              <div style={{ width: 48, height: 48, background: f.accent === C ? "rgba(0,180,216,.1)" : "rgba(245,158,11,.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 20 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{f.title}</div>
              <div style={{ color: "#6b7d94", fontSize: 14, lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Assess ───────────────────────────────── */
function AssessPage({ setPage, setResult }) {
  const [area, setArea] = useState("");
  const [roofKey, setRoofKey] = useState("RCC");
  const [soilKey, setSoilKey] = useState("Loamy");
  const [coords, setCoords] = useState("");
  const [gpsLoad, setGpsLoad] = useState(false);
  const [gpsMsg, setGpsMsg] = useState({ text: "", ok: false });
  const [loading, setLoading] = useState(false);

  function getGPS() {
    if (!navigator.geolocation) { setGpsMsg({ text: "Geolocation not supported.", ok: false }); return; }
    setGpsLoad(true); setGpsMsg({ text: "", ok: false });
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: la, longitude: lo } = pos.coords;
        setCoords(`${la.toFixed(6)}, ${lo.toFixed(6)}`);
        setGpsLoad(false);
        setGpsMsg({ text: "✓ Location captured — regional rainfall data will be used", ok: true });
      },
      () => { setGpsMsg({ text: "Unable to get location. Please enter manually.", ok: false }); setGpsLoad(false); }
    );
  }

  function handleSubmit() {
    const a = parseFloat(area);
    if (!a || a <= 0) { alert("Please enter a valid roof area greater than 0."); return; }
    setLoading(true);
    setTimeout(() => {
      let lat = 12.97, lon = 80.04;
      if (coords) {
        const p = coords.split(",").map(s => parseFloat(s.trim()));
        if (p.length === 2 && !isNaN(p[0]) && !isNaN(p[1])) { lat = p[0]; lon = p[1]; }
      }
      const rainfall = getRainfallForCoords(lat, lon);
      const { harvest, recharge } = calculate({ area: a, roofKey, soilKey, rainfall });
      const structure = getRecommendedStructure(a, soilKey);
      setResult({ area: a, roofKey, soilKey, rainfall, harvest, recharge, structure, coords: coords || `${lat.toFixed(6)}, ${lon.toFixed(6)}` });
      setLoading(false);
      setPage("result");
    }, 900);
  }

  const iStyle = { width: "100%", padding: "12px 16px", border: "1.5px solid #dde5ef", borderRadius: 10, fontSize: 15 };

  return (
    <div className="page">
      <div className="page-inner">
        {/* Cyan header banner */}
        <div className="fu0" style={{ background: `linear-gradient(135deg,${C},#0077b6)`, borderRadius: 18, padding: "34px 40px", marginBottom: 28, color: "white" }}>
          <h2 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 28, letterSpacing: "-0.02em", marginBottom: 8 }}>Assessment Details</h2>
          <p style={{ opacity: .85, fontSize: 15 }}>Enter your site parameters to calculate rainwater potential.</p>
        </div>

        <div className="card fu1" style={{ padding: "36px 40px" }}>

          {/* Section 1 */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div className="snum">1</div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Roof Dimensions</span>
            </div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#556070", display: "block", marginBottom: 8 }}>Total Roof Area (m²)</label>
            <div style={{ position: "relative" }}>
              <input type="number" min="0" placeholder="e.g. 120"
                value={area} onChange={e => setArea(e.target.value)}
                style={{ ...iStyle, paddingRight: 52 }} />
              <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "#9baab8", fontSize: 14, fontWeight: 600, pointerEvents: "none" }}>m²</span>
            </div>
          </div>

          {/* Section 2 */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div className="snum">2</div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Site Parameters</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#556070", display: "block", marginBottom: 8 }}>Roof Type ⓘ</label>
                <select value={roofKey} onChange={e => setRoofKey(e.target.value)} style={{ ...iStyle, cursor: "pointer", appearance: "none" }}>
                  {Object.entries(ROOF_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#556070", display: "block", marginBottom: 8 }}>Soil Type ⓘ</label>
                <select value={soilKey} onChange={e => setSoilKey(e.target.value)} style={{ ...iStyle, cursor: "pointer", appearance: "none" }}>
                  {Object.entries(SOIL_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <div className="snum">3</div>
              <span style={{ fontWeight: 700, fontSize: 16 }}>Location</span>
            </div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#556070", display: "block", marginBottom: 8 }}>Site Coordinates</label>
            <div style={{ display: "flex", gap: 10 }}>
              <input type="text" placeholder="Latitude, Longitude (e.g. 12.97, 80.04)"
                value={coords} onChange={e => setCoords(e.target.value)}
                style={{ ...iStyle, flex: 1 }} />
              <button className="btn" onClick={getGPS} disabled={gpsLoad}
                style={{ background: "rgba(0,180,216,.1)", color: C, padding: "12px 18px", fontSize: 14, display: "flex", alignItems: "center", gap: 6, flexShrink: 0, borderRadius: 10, border: `1.5px solid rgba(0,180,216,.3)` }}>
                {gpsLoad ? "📍…" : "📍 Get GPS"}
              </button>
            </div>
            {gpsMsg.text && <p style={{ color: gpsMsg.ok ? "#10b981" : "#e05050", fontSize: 12, marginTop: 7 }}>{gpsMsg.text}</p>}
          </div>

          {/* Submit */}
          <button className="btn" onClick={handleSubmit} disabled={loading}
            style={{ width: "100%", background: loading ? "#b0c4de" : `linear-gradient(135deg,${C},#0077b6)`, color: "white", padding: "15px", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, borderRadius: 12 }}>
            {loading
              ? <><span style={{ display: "inline-block", width: 18, height: 18, border: "2px solid rgba(255,255,255,.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin .8s linear infinite" }} /> Calculating…</>
              : "🧮 Calculate Potential"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Result ───────────────────────────────── */
function ResultPage({ result, setPage }) {
  const [toast, setToast] = useState(true);
  useEffect(() => { const t = setTimeout(() => setToast(false), 4000); return () => clearTimeout(t); }, []);

  function downloadPDF() {
    const w = window.open("", "_blank");
    w.document.write(`<!DOCTYPE html><html><head><title>HydroScan Report</title><style>
      body{font-family:'Segoe UI',sans-serif;max-width:720px;margin:40px auto;color:#0a1628;padding:0 20px}
      h1{color:#00B4D8;font-size:28px;margin-bottom:4px}
      .sub{color:#777;font-size:13px;margin-bottom:28px}
      .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:24px}
      .box{background:#f0f9ff;border-radius:12px;padding:18px}
      .lbl{font-size:11px;font-weight:700;color:#00B4D8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px}
      .num{font-size:30px;font-weight:900;color:#0a1628;letter-spacing:-0.03em}
      .unit{font-size:13px;color:#888;margin-top:2px}
      .rec{background:#00B4D8;color:white;border-radius:12px;padding:20px}
      .rec .lbl{color:rgba(255,255,255,.75)}
      .rec .num{font-size:18px;line-height:1.3}
      .rec .desc{font-size:12px;opacity:.85;margin-top:8px}
      h2{font-size:16px;margin:22px 0 10px}
      .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:14px}
      .row span{color:#888} .row strong{color:#0a1628}
      pre{background:#f8f8f8;border-left:4px solid #00B4D8;padding:12px 16px;font-size:13px;border-radius:0 6px 6px 0;margin:6px 0;line-height:1.8;white-space:pre-wrap}
      footer{color:#bbb;font-size:12px;text-align:center;margin-top:40px;padding-top:16px;border-top:1px solid #eee}
    </style></head><body>
    <h1>💧 HydroScan Assessment Report</h1>
    <p class="sub">📍 ${result.coords} &nbsp;|&nbsp; ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
    <div class="grid">
      <div class="box"><div class="lbl">Annual Harvest</div><div class="num">${result.harvest.toLocaleString()}</div><div class="unit">Liters / Year</div></div>
      <div class="box"><div class="lbl">Recharge Potential</div><div class="num">${result.recharge.toLocaleString()}</div><div class="unit">Liters / Year</div></div>
      <div class="rec"><div class="lbl">Recommended Structure</div><div class="num">${result.structure}</div><div class="desc">Based on ${result.area} m² roof &amp; ${SOIL_TYPES[result.soilKey].label} soil.</div></div>
    </div>
    <h2>Parameters Breakdown</h2>
    <div class="row"><span>Roof Type</span><strong>${ROOF_TYPES[result.roofKey].label}</strong></div>
    <div class="row"><span>Soil Type</span><strong>${SOIL_TYPES[result.soilKey].label}</strong></div>
    <div class="row"><span>Roof Area</span><strong>${result.area} m²</strong></div>
    <div class="row"><span>Rainfall (IMD Avg)</span><strong>${result.rainfall} mm</strong></div>
    <div class="row"><span>Roof Runoff Coefficient</span><strong>${ROOF_TYPES[result.roofKey].coeff}</strong></div>
    <div class="row"><span>Soil Recharge Coefficient</span><strong>${SOIL_TYPES[result.soilKey].coeff}</strong></div>
    <h2>Calculation Methodology</h2>
    <pre>Annual Harvest = Area × (Rainfall ÷ 1000) × Roof Coeff × 1000
  = ${result.area} × ${(result.rainfall / 1000).toFixed(3)} × ${ROOF_TYPES[result.roofKey].coeff} × 1000
  = ${result.harvest.toLocaleString()} L/Year

Recharge Potential = Harvest × Soil Coeff
  = ${result.harvest.toLocaleString()} × ${SOIL_TYPES[result.soilKey].coeff}
  = ${result.recharge.toLocaleString()} L/Year</pre>
    <footer>Generated by HydroScan • Rainfall data from IMD regional averages</footer>
    </body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 400);
  }

  return (
    <div className="page">
      <div className="res-inner">

        {/* Header */}
        <div className="fu0" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 26, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 32, letterSpacing: "-0.03em", marginBottom: 6 }}>Assessment Report</h2>
            <div style={{ color: "#6b7d94", fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>📍 {result.coords}</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn" onClick={downloadPDF}
              style={{ background: DK, color: "white", padding: "11px 20px", fontSize: 14, display: "flex", alignItems: "center", gap: 8, borderRadius: 10 }}>
              📄 Download PDF
            </button>
            <button className="btn"
              onClick={() => {
                if (navigator.share) navigator.share({ title: "HydroScan Report", text: `Harvest: ${result.harvest.toLocaleString()} L/yr, Recharge: ${result.recharge.toLocaleString()} L/yr` });
                else { navigator.clipboard.writeText(`HydroScan — Harvest: ${result.harvest.toLocaleString()} L/yr, Recharge: ${result.recharge.toLocaleString()} L/yr`); alert("Copied!"); }
              }}
              style={{ background: "white", color: DK, padding: "11px 20px", fontSize: 14, display: "flex", alignItems: "center", gap: 8, borderRadius: 10, border: "1px solid #dde5ef" }}>
              ↗ Share
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="fu1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.15fr", gap: 16, marginBottom: 20 }}>
          <div className="card" style={{ padding: "26px 24px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>Annual Harvest</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 4 }}>
              <div className="bignum" style={{ fontSize: 38 }}>{result.harvest.toLocaleString()}</div>
              <div style={{ fontSize: 24, opacity: .1, marginBottom: 3 }}>💧</div>
            </div>
            <div style={{ color: "#9baab8", fontSize: 13 }}>Liters / Year</div>
          </div>

          <div className="card" style={{ padding: "26px 24px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>Recharge Potential</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 4 }}>
              <div className="bignum" style={{ fontSize: 38 }}>{result.recharge.toLocaleString()}</div>
              <div style={{ fontSize: 24, opacity: .1, marginBottom: 3 }}>⬇️</div>
            </div>
            <div style={{ color: "#9baab8", fontSize: 13 }}>Liters / Year</div>
          </div>

          <div style={{ background: `linear-gradient(135deg,${C},#0077b6)`, borderRadius: 16, padding: "26px 24px", color: "white" }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: .75, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 12 }}>Recommended Structure</div>
            <div style={{ fontFamily: "Nunito", fontWeight: 900, fontSize: 19, lineHeight: 1.25, marginBottom: 10 }}>{result.structure}</div>
            <div style={{ height: 3, width: 38, background: "#f59e0b", borderRadius: 2, marginBottom: 10 }} />
            <div style={{ fontSize: 12, opacity: .82, lineHeight: 1.6 }}>
              Based on your specific roof area ({result.area}m²) and soil permeability ({SOIL_TYPES[result.soilKey].label}).
            </div>
          </div>
        </div>

        {/* Parameters */}
        <div className="card fu2" style={{ padding: "26px 30px", marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 18 }}>Parameters Breakdown</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderTop: "1px solid #edf2f7" }}>
            {[
              ["Roof Type", ROOF_TYPES[result.roofKey].label],
              ["Soil Type", SOIL_TYPES[result.soilKey].label],
              ["Roof Area", `${result.area} m²`],
              ["Rainfall (Avg)", `${result.rainfall} mm`],
            ].map(([k, v], i) => (
              <div key={k} style={{ padding: "14px 0 14px 20px", borderRight: i < 3 ? "1px solid #edf2f7" : "none" }}>
                <div style={{ fontSize: 12, color: "#9baab8", marginBottom: 5 }}>{k}</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="card fu3" style={{ padding: "26px 30px" }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Calculation Methodology</div>
          <div style={{ background: "#f8fafc", borderLeft: `4px solid ${C}`, borderRadius: "0 8px 8px 0", padding: "13px 18px", fontFamily: "monospace", fontSize: 13, color: "#334155", lineHeight: 1.85, marginBottom: 10 }}>
            Annual Harvest = Area × (Rainfall ÷ 1000) × Roof Coeff × 1000<br />
            &nbsp;&nbsp;= {result.area} × {(result.rainfall / 1000).toFixed(3)} × {ROOF_TYPES[result.roofKey].coeff} × 1000<br />
            &nbsp;&nbsp;= <strong style={{ color: C }}>{result.harvest.toLocaleString()} L/Year</strong>
          </div>
          <div style={{ background: "#f8fafc", borderLeft: "4px solid #0077b6", borderRadius: "0 8px 8px 0", padding: "13px 18px", fontFamily: "monospace", fontSize: 13, color: "#334155", lineHeight: 1.85 }}>
            Recharge Potential = Annual Harvest × Soil Coeff<br />
            &nbsp;&nbsp;= {result.harvest.toLocaleString()} × {SOIL_TYPES[result.soilKey].coeff}<br />
            &nbsp;&nbsp;= <strong style={{ color: "#0077b6" }}>{result.recharge.toLocaleString()} L/Year</strong>
          </div>
          <p style={{ color: "#9baab8", fontSize: 12, marginTop: 12 }}>* Rainfall data from IMD regional averages for the given coordinates.</p>
        </div>

        <div style={{ textAlign: "center", marginTop: 28 }}>
          <button className="btn" onClick={() => setPage("assess")}
            style={{ background: "white", color: DK, padding: "11px 24px", fontSize: 14, border: "1px solid #dde5ef", borderRadius: 10 }}>
            ← New Assessment
          </button>
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, background: "white", borderRadius: 12, padding: "16px 20px", boxShadow: "0 8px 30px rgba(0,0,0,.15)", border: "1px solid #e2eaf2", animation: "toastIn .4s ease both", minWidth: 260 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>✅ Assessment Complete</div>
          <div style={{ fontSize: 13, color: "#6b7d94" }}>Your rainwater potential has been calculated successfully.</div>
        </div>
      )}
    </div>
  );
}

/* ─── App ──────────────────────────────────── */
export default function App() {
  const [page, setPage]     = useState("home");
  const [result, setResult] = useState(null);
  const [user, setUser]     = useState(() => {
    try { return JSON.parse(localStorage.getItem("hs_user")); } catch { return null; }
  });

  function handleAuth(u) { setUser(u); }

  function handleSignOut() {
    localStorage.removeItem("hs_token");
    localStorage.removeItem("hs_user");
    setUser(null);
    setPage("home");
  }

  if (!user) return <LoginPage onAuth={handleAuth} />;

  return (
    <>
      <style>{CSS}</style>
      <Nav page={page} setPage={setPage} user={user} onSignOut={handleSignOut} />
      {page === "home"   && <LandingPage setPage={setPage} />}
      {page === "assess" && <AssessPage setPage={setPage} setResult={setResult} />}
      {page === "result" && result && <ResultPage result={result} setPage={setPage} />}
    </>
  );
}