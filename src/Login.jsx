import { useState } from "react";

const C = "#00B4D8";
const DK = "#0a1628";

const LOGIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Sora:wght@400;500;600;700&display=swap');

  .auth-wrap {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(155deg,#e4f3f9 0%,#cce8f4 45%,#bde2f2 100%);
    position: relative; overflow: hidden;
    font-family: 'Sora', sans-serif; padding: 24px;
  }
  .auth-wrap::before {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background-image:
      repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(0,180,216,.06) 40px),
      repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(0,180,216,.06) 40px);
  }
  .auth-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.35; pointer-events: none; }
  .auth-card {
    background: white; border-radius: 24px; border: 1px solid #e2eaf2;
    padding: 44px 44px 40px; width: 100%; max-width: 440px;
    position: relative; z-index: 1;
    box-shadow: 0 20px 60px rgba(0,100,160,.12), 0 2px 8px rgba(0,0,0,.04);
  }
  .auth-logo { display: flex; align-items: center; gap: 10px; justify-content: center; margin-bottom: 32px; }
  .auth-logo-icon {
    width: 44px; height: 44px; background: linear-gradient(135deg, ${C}, #0077b6);
    border-radius: 12px; display: flex; align-items: center; justify-content: center;
    font-size: 22px; box-shadow: 0 4px 16px rgba(0,180,216,.3);
  }
  .auth-logo-text { font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 22px; color: ${DK}; letter-spacing: -0.02em; }
  .auth-logo-sub  { font-size: 11px; color: #999; margin-top: -2px; }
  .auth-tabs { display: flex; background: #f0f4f8; border-radius: 12px; padding: 4px; margin-bottom: 32px; gap: 2px; }
  .auth-tab {
    flex: 1; padding: 10px; border: none; border-radius: 9px;
    font-family: 'Sora', sans-serif; font-weight: 600; font-size: 14px;
    cursor: pointer; transition: all .2s; background: transparent; color: #7a90a8;
  }
  .auth-tab.active { background: white; color: ${DK}; box-shadow: 0 2px 8px rgba(0,0,0,.09); }
  .auth-label { display: block; font-size: 12.5px; font-weight: 600; color: #5a7090; margin-bottom: 7px; letter-spacing: .015em; }
  .auth-input {
    width: 100%; padding: 12px 15px; border: 1.5px solid #dde5ef; border-radius: 10px;
    font-size: 14.5px; font-family: 'Sora', sans-serif; color: ${DK};
    background: #f8fafc; transition: border-color .18s, box-shadow .18s;
    outline: none; margin-bottom: 18px; -webkit-text-fill-color: ${DK};
  }
  .auth-input:focus { border-color: ${C}; box-shadow: 0 0 0 3px rgba(0,180,216,.14); background: white; }
  .auth-input::placeholder { color: #9baab8; -webkit-text-fill-color: #9baab8; }
  .auth-btn {
    width: 100%; padding: 13px;
    background: linear-gradient(135deg, ${C}, #0077b6);
    color: white; border: none; border-radius: 11px;
    font-family: 'Sora', sans-serif; font-weight: 700; font-size: 15px;
    cursor: pointer; transition: all .2s; box-shadow: 0 4px 18px rgba(0,180,216,.35);
    margin-top: 4px; letter-spacing: .01em;
  }
  .auth-btn:hover  { filter: brightness(1.07); transform: translateY(-1px); }
  .auth-btn:active { transform: translateY(0); }
  .auth-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  .auth-divider {
    display: flex; align-items: center; gap: 12px; margin: 22px 0;
    color: #b8c9d9; font-size: 12px; font-weight: 600; letter-spacing: .05em;
  }
  .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: #e8eef5; }
  .auth-error {
    background: #fef2f2; border: 1px solid #fecaca; border-radius: 9px;
    padding: 11px 14px; font-size: 13px; color: #b91c1c; margin-bottom: 16px;
    display: flex; align-items: center; gap: 7px;
  }
  .auth-success {
    background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 9px;
    padding: 11px 14px; font-size: 13px; color: #166534; margin-bottom: 16px;
    display: flex; align-items: center; gap: 7px;
  }
  .auth-foot { text-align: center; margin-top: 22px; font-size: 12.5px; color: #9baab8; line-height: 1.7; }
  @keyframes authFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  .auth-anim { animation: authFadeUp .4s ease both; }
  .pw-wrap { position: relative; }
  .pw-toggle {
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    background: none; border: none; cursor: pointer; color: #9baab8;
    font-size: 16px; padding: 2px; margin-top: -9px; line-height: 1;
  }
`;

const API = "https://ccp-production-c1e5.up.railway.app";

export default function LoginPage({ onAuth }) {
  const [tab, setTab]       = useState("signin");
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState("");

  function reset() { setError(""); setSuccess(""); }

  async function handleSubmit() {
    reset();
    if (!email || !password) { setError("Please fill in all required fields."); return; }
    if (tab === "signup" && !name) { setError("Please enter your name."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const endpoint = tab === "signin" ? "/api/signin" : "/api/signup";
      const body = tab === "signin" ? { email, password } : { name, email, password };
      const res = await fetch(`${API}${endpoint}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      if (tab === "signup") {
        setSuccess("Account created! Please sign in.");
        setTab("signin"); setName(""); setPassword("");
      } else {
        localStorage.setItem("hs_token", data.token);
        localStorage.setItem("hs_user", JSON.stringify(data.user));
        onAuth(data.user);
      }
    } catch {
      setError("Cannot reach server. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) { if (e.key === "Enter") handleSubmit(); }

  return (
    <>
      <style>{LOGIN_CSS}</style>
      <div className="auth-wrap">
        <div className="auth-blob" style={{ width:300, height:300, background:C, top:-80, left:-60 }} />
        <div className="auth-blob" style={{ width:200, height:200, background:"#0077b6", bottom:-60, right:-40 }} />
        <div className="auth-card auth-anim">
          <div className="auth-logo">
            <div className="auth-logo-icon">💧</div>
            <div>
              <div className="auth-logo-text">HydroScan</div>
              <div className="auth-logo-sub">Rainwater Assessor</div>
            </div>
          </div>
          <div className="auth-tabs">
            <button className={`auth-tab${tab==="signin"?" active":""}`} onClick={()=>{setTab("signin");reset();}}>Sign In</button>
            <button className={`auth-tab${tab==="signup"?" active":""}`} onClick={()=>{setTab("signup");reset();}}>New User</button>
          </div>
          {error   && <div className="auth-error">⚠️ {error}</div>}
          {success && <div className="auth-success">✅ {success}</div>}
          {tab === "signup" && (
            <div>
              <label className="auth-label">Full Name</label>
              <input className="auth-input" type="text" placeholder="Jane Smith"
                value={name} onChange={e=>setName(e.target.value)} onKeyDown={handleKey} />
            </div>
          )}
          <label className="auth-label">Email Address</label>
          <input className="auth-input" type="email" placeholder="you@example.com"
            value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={handleKey} />
          <label className="auth-label">Password</label>
          <div className="pw-wrap">
            <input className="auth-input" type={showPw?"text":"password"}
              placeholder={tab==="signup"?"Min. 6 characters":"Your password"}
              value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={handleKey}
              style={{ paddingRight: 42 }} />
            <button className="pw-toggle" onClick={()=>setShowPw(p=>!p)} tabIndex={-1}>
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
          <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Please wait…" : tab==="signin" ? "Sign In →" : "Create Account →"}
          </button>
          <div className="auth-divider">or</div>
          <div className="auth-foot">
            {tab==="signin"
              ? <>New to HydroScan? <span style={{color:C,fontWeight:600,cursor:"pointer"}} onClick={()=>{setTab("signup");reset();}}>Create a free account</span></>
              : <>Already have an account? <span style={{color:C,fontWeight:600,cursor:"pointer"}} onClick={()=>{setTab("signin");reset();}}>Sign in</span></>}
            <br /><span style={{fontSize:11,opacity:.65}}>Your data is stored securely and never shared.</span>
          </div>
        </div>
      </div>
    </>
  );
}
