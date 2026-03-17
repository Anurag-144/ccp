import { useEffect, useRef } from "react";

const C = "#00B4D8";
const C2 = "#0077b6";
const DK = "#0a1628";
const ACCENT = "#d4f542";

const LAND_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .hs-land * { box-sizing: border-box; margin: 0; padding: 0; }
  .hs-land { font-family: 'DM Sans', sans-serif; background: #f5f7f0; color: ${DK}; overflow-x: hidden; }

  .hs-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 64px;
    background: rgba(245,247,240,.88); backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(0,0,0,.06);
  }
  .hs-nav-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; font-family: 'Fraunces', serif; font-weight: 700; font-size: 20px; color: ${DK}; }
  .hs-nav-logo-icon { width: 36px; height: 36px; border-radius: 9px; background: linear-gradient(135deg,${C},${C2}); display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .hs-nav-links { display: flex; align-items: center; gap: 32px; }
  .hs-nav-link { font-size: 14px; font-weight: 500; color: #4a5568; cursor: pointer; background: none; border: none; font-family: 'DM Sans', sans-serif; transition: color .18s; }
  .hs-nav-link:hover { color: ${DK}; }
  .hs-nav-cta { background: ${DK}; color: white; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px; padding: 9px 20px; border-radius: 8px; transition: all .18s; }
  .hs-nav-cta:hover { background: ${C2}; transform: translateY(-1px); }

  .hs-hero {
    min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 120px 24px 80px; position: relative;
    background: #f5f7f0; overflow: hidden;
  }
  .hs-hero::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,180,216,.12) 0%, transparent 70%),
      repeating-linear-gradient(0deg,transparent,transparent 59px,rgba(0,180,216,.04) 60px),
      repeating-linear-gradient(90deg,transparent,transparent 59px,rgba(0,180,216,.04) 60px);
  }
  .hs-hero-badge {
    display: inline-flex; align-items: center; gap: 7px;
    background: ${DK}; color: ${ACCENT};
    font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
    padding: 6px 14px; border-radius: 20px; margin-bottom: 32px;
    animation: landFadeUp .5s ease both;
  }
  .hs-hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: ${ACCENT}; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  .hs-hero-h1 {
    font-family: 'Fraunces', serif; font-weight: 900;
    font-size: clamp(42px,6.5vw,80px); line-height: 1.05; letter-spacing: -0.03em;
    color: ${DK}; max-width: 820px; margin-bottom: 24px;
    animation: landFadeUp .5s .1s ease both;
  }
  .hs-hero-h1 em { font-style: italic; color: ${C}; }
  .hs-hero-sub { font-size: 18px; color: #5a7090; line-height: 1.65; max-width: 500px; margin-bottom: 44px; animation: landFadeUp .5s .2s ease both; }
  .hs-hero-btns { display: flex; gap: 12px; align-items: center; justify-content: center; flex-wrap: wrap; margin-bottom: 72px; animation: landFadeUp .5s .3s ease both; }
  .hs-btn-primary { background: ${DK}; color: white; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px; padding: 14px 28px; border-radius: 10px; transition: all .2s; }
  .hs-btn-primary:hover { background: ${C2}; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,119,182,.25); }
  .hs-btn-secondary { background: white; color: ${DK}; border: 1.5px solid #d8e2ec; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px; padding: 14px 28px; border-radius: 10px; transition: all .2s; }
  .hs-btn-secondary:hover { border-color: ${C}; color: ${C}; transform: translateY(-2px); }

  .hs-mockup-wrap {
    width: 100%; max-width: 860px; background: white; border-radius: 20px;
    border: 1px solid #e2eaf2; overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,60,120,.12);
    animation: landFadeUp .6s .4s ease both; position: relative; z-index: 1;
  }
  .hs-mockup-bar { background: #f8fafc; border-bottom: 1px solid #edf2f7; padding: 12px 20px; display: flex; align-items: center; gap: 8px; }
  .hs-mockup-dot { width: 10px; height: 10px; border-radius: 50%; }
  .hs-mockup-body { padding: 24px; }
  .hs-mockup-greeting { font-size: 13px; color: #7a90a8; margin-bottom: 4px; }
  .hs-mockup-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; margin-bottom: 20px; }
  .hs-mockup-cards { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 20px; }
  .hs-mockup-card { background: #f8fafc; border-radius: 12px; border: 1px solid #edf2f7; padding: 16px; }
  .hs-mockup-card.accent { background: ${ACCENT}; border-color: transparent; }
  .hs-mockup-card-label { font-size: 11px; color: #9baab8; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; margin-bottom: 8px; }
  .hs-mockup-card-val { font-family: 'Fraunces', serif; font-size: 32px; font-weight: 900; color: ${DK}; }
  .hs-mockup-card-sub { font-size: 12px; color: #9baab8; margin-top: 2px; }
  .hs-mockup-bars { display: flex; align-items: flex-end; gap: 4px; height: 60px; }
  .hs-bar { flex: 1; border-radius: 3px 3px 0 0; background: linear-gradient(to top,${C},rgba(0,180,216,.3)); }

  .hs-features { padding: 100px 48px; max-width: 1200px; margin: 0 auto; }
  .hs-features-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: ${C}; margin-bottom: 16px; }
  .hs-features-h2 { font-family: 'Fraunces', serif; font-size: clamp(32px,4vw,52px); font-weight: 900; line-height: 1.1; letter-spacing: -0.02em; max-width: 560px; color: ${DK}; margin-bottom: 64px; }
  .hs-features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
  .hs-feat-card { background: white; border-radius: 16px; border: 1px solid #e2eaf2; padding: 32px; transition: all .25s; }
  .hs-feat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,60,120,.1); border-color: ${C}; }
  .hs-feat-icon { width: 48px; height: 48px; border-radius: 12px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
  .hs-feat-title { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; margin-bottom: 10px; color: ${DK}; }
  .hs-feat-desc { font-size: 14px; color: #5a7090; line-height: 1.7; }

  .hs-stats { background: ${DK}; color: white; padding: 72px 48px; display: grid; grid-template-columns: repeat(4,1fr); gap: 40px; }
  .hs-stat-item { text-align: center; }
  .hs-stat-num { font-family: 'Fraunces', serif; font-size: 52px; font-weight: 900; color: ${ACCENT}; letter-spacing: -0.03em; line-height: 1; margin-bottom: 8px; }
  .hs-stat-label { font-size: 14px; color: rgba(255,255,255,.6); }

  .hs-cta-section { padding: 100px 48px; text-align: center; background: linear-gradient(155deg,#e4f3f9 0%,#cce8f4 45%,#bde2f2 100%); position: relative; overflow: hidden; }
  .hs-cta-section::before { content:''; position:absolute; inset:0; pointer-events:none; background-image: repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(0,180,216,.06) 40px), repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(0,180,216,.06) 40px); }
  .hs-cta-h2 { font-family: 'Fraunces', serif; font-size: clamp(32px,4vw,52px); font-weight: 900; letter-spacing: -0.02em; color: ${DK}; max-width: 560px; margin: 0 auto 16px; line-height: 1.1; position: relative; }
  .hs-cta-sub { font-size: 17px; color: #4a6080; max-width: 420px; margin: 0 auto 40px; line-height: 1.65; position: relative; }
  .hs-cta-btns { display: flex; gap: 12px; justify-content: center; position: relative; }

  .hs-footer { background: ${DK}; color: rgba(255,255,255,.5); padding: 32px 48px; display: flex; align-items: center; justify-content: space-between; font-size: 13px; }
  .hs-footer-logo { font-family: 'Fraunces', serif; font-weight: 700; color: white; font-size: 16px; display: flex; align-items: center; gap: 8px; }

  @keyframes landFadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  .hs-reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
  .hs-reveal.visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 768px) {
    .hs-nav { padding: 0 20px; }
    .hs-nav-links { display: none; }
    .hs-features { padding: 60px 20px; }
    .hs-features-grid { grid-template-columns: 1fr; }
    .hs-mockup-cards { grid-template-columns: 1fr 1fr; }
    .hs-stats { grid-template-columns: repeat(2,1fr); padding: 48px 24px; }
    .hs-cta-section { padding: 60px 24px; }
    .hs-footer { flex-direction: column; gap: 12px; text-align: center; }
  }
`;

const BARS = [30, 45, 28, 55, 38, 62, 44, 70, 52, 65, 48, 75, 58, 80, 63, 72, 55, 85, 68, 90, 74, 88, 76, 95, 80, 78, 85, 92, 87, 100];

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function LandingPage({ setPage }) {
  const featRef = useReveal();
  const statsRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div className="hs-land">
      <style>{LAND_CSS}</style>

      <nav className="hs-nav">
        <div className="hs-nav-logo"><div className="hs-nav-logo-icon">💧</div>HydroScan</div>

        <button className="hs-nav-cta" onClick={() => setPage("assess")}>Get started →</button>
      </nav>

      <section className="hs-hero">
        <div className="hs-hero-badge"><span className="hs-hero-badge-dot" />Smart Water Management</div>
        <h1 className="hs-hero-h1">Rainwater insights,<br /><em>built for your building</em></h1>
        <p className="hs-hero-sub">Track harvest potential, reduce water costs, and accelerate sustainability — with clarity and confidence.</p>
        <div className="hs-hero-btns">
          <button className="hs-btn-primary" onClick={() => setPage("assess")}>→ Start assessment</button>
          <button className="hs-btn-secondary">Explore the platform</button>
        </div>

        <div className="hs-mockup-wrap">
          <div className="hs-mockup-bar">
            <div className="hs-mockup-dot" style={{ background: "#ff5f57" }} />
            <div className="hs-mockup-dot" style={{ background: "#febc2e" }} />
            <div className="hs-mockup-dot" style={{ background: "#28c840" }} />
            <div style={{ flex: 1, height: 20, background: "#f0f4f8", borderRadius: 6, marginLeft: 10 }} />
          </div>
          <div className="hs-mockup-body">
            <div className="hs-mockup-greeting">Good morning, Acme Properties</div>
            <div className="hs-mockup-title">Your daily water metrics are ready.</div>
            <div className="hs-mockup-cards">
              <div className="hs-mockup-card">
                <div className="hs-mockup-card-label">Annual Harvest</div>
                <div className="hs-mockup-card-val">4,820</div>
                <div className="hs-mockup-card-sub">Litres / Year</div>
              </div>
              <div className="hs-mockup-card accent">
                <div className="hs-mockup-card-label">Recharge Potential</div>
                <div className="hs-mockup-card-val">2,460</div>
                <div className="hs-mockup-card-sub">Litres / Year</div>
              </div>
              <div className="hs-mockup-card">
                <div className="hs-mockup-card-label">Roof Efficiency</div>
                <div className="hs-mockup-card-val">85%</div>
                <div className="hs-mockup-card-sub">RCC Coefficient</div>
              </div>
            </div>
            <div style={{ background: "#f8fafc", borderRadius: 12, border: "1px solid #edf2f7", padding: "16px 20px" }}>
              <div style={{ fontSize: 12, color: "#9baab8", fontWeight: 600, marginBottom: 12 }}>MONTHLY RAINFALL TREND</div>
              <div className="hs-mockup-bars">
                {BARS.map((h, i) => <div key={i} className="hs-bar" style={{ height: `${h}%`, opacity: 0.4 + (h / 160) }} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="hs-features">
        <div className="hs-reveal" ref={featRef}>
          <div className="hs-features-eyebrow">Platform capabilities</div>
          <h2 className="hs-features-h2">Everything you need to measure, model, and act on water</h2>
        </div>
        <div className="hs-features-grid">
          {[
            { icon: "🗺️", bg: "rgba(0,180,216,.1)", title: "GPS-based Assessment", desc: "Auto-detects your location and pulls IMD regional rainfall averages for accurate local calculations." },
            { icon: "🧮", bg: "rgba(212,245,66,.25)", title: "Smart Calculator", desc: "Input roof type, area, and soil — get harvest potential, recharge estimate, and a recommended structure." },
            { icon: "📄", bg: "rgba(0,119,182,.1)", title: "Instant PDF Reports", desc: "Download a full assessment report with methodology breakdown to share with engineers or clients." },
            { icon: "🌱", bg: "rgba(40,200,120,.1)", title: "Eco Impact Scoring", desc: "Understand your environmental footprint reduction when adopting rainwater harvesting systems." },
            { icon: "📊", bg: "rgba(0,180,216,.1)", title: "Trend Analytics", desc: "Track historical rainfall trends with IMD data to forecast future harvest potential accurately." },
            { icon: "🔐", bg: "rgba(212,245,66,.25)", title: "Secure Accounts", desc: "Save and revisit your assessments anytime. Your data is encrypted and never shared." },
          ].map(({ icon, bg, title, desc }) => (
            <div key={title} className="hs-feat-card">
              <div className="hs-feat-icon" style={{ background: bg }}>{icon}</div>
              <div className="hs-feat-title">{title}</div>
              <div className="hs-feat-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="hs-stats hs-reveal" ref={statsRef}>
        {[
          { num: "2.5M+", label: "Litres tracked across assessments" },
          { num: "98%", label: "Accuracy vs IMD ground data" },
          { num: "5", label: "Roof & soil type combinations" },
          { num: "Free", label: "Always free for individuals" },
        ].map(({ num, label }) => (
          <div key={label} className="hs-stat-item">
            <div className="hs-stat-num">{num}</div>
            <div className="hs-stat-label">{label}</div>
          </div>
        ))}
      </div>

      <section className="hs-cta-section hs-reveal" ref={ctaRef}>
        <h2 className="hs-cta-h2">Start your free water assessment today</h2>
        <p className="hs-cta-sub">Takes under 2 minutes. No credit card required.</p>
        <div className="hs-cta-btns">
          <button className="hs-btn-primary" onClick={() => setPage("assess")}>→ Run assessment</button>
          <button className="hs-btn-secondary">Learn more</button>
        </div>
      </section>

      <footer className="hs-footer">
        <div className="hs-footer-logo">💧 HydroScan</div>
        <div>© 2026 HydroScan · Rainfall data from IMD regional averages</div>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <span key={l} style={{ cursor: "pointer", transition: "color .18s" }}
              onMouseEnter={e => e.target.style.color = "white"}
              onMouseLeave={e => e.target.style.color = ""}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
