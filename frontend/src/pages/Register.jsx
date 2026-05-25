import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

@keyframes fadein  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes spin    { to { transform:rotate(360deg); } }
@keyframes shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
@keyframes floatdot { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

.rp-root {
  min-height: 100vh;
  background: #F8F7F4;
  font-family: 'Plus Jakarta Sans', sans-serif;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
}

.rp-left {
  background: #0F1923;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 48px 52px;
  position: relative;
  overflow: hidden;
}

.rp-deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,.07);
}
.rp-deco-ring-1 { width:420px;height:420px; top:-120px; left:-120px; }
.rp-deco-ring-2 { width:280px;height:280px; top:-20px; left:-20px; border-color:rgba(255,255,255,.05); }
.rp-deco-ring-3 { width:500px;height:500px; bottom:-200px; right:-200px; }

.rp-deco-dot { position:absolute; border-radius:50%; background:#F5A623; }
.rp-deco-dot-1 { width:10px;height:10px; top:180px; left:52px; animation:floatdot 3s ease-in-out infinite; }
.rp-deco-dot-2 { width:6px;height:6px; top:240px; left:76px; animation:floatdot 4s ease-in-out .5s infinite; opacity:.6; }
.rp-deco-dot-3 { width:8px;height:8px; bottom:180px; right:60px; animation:floatdot 3.5s ease-in-out 1s infinite; opacity:.4; }

.rp-left-top    { position:relative; z-index:1; }
.rp-left-bottom { position:relative; z-index:1; }

.rp-logo { display:inline-flex; align-items:center; gap:10px; margin-bottom:64px; }
.rp-logo-mark {
  width:38px; height:38px;
  background:#F5A623;
  border-radius:10px;
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0;
}
.rp-logo-name { font-size:17px; font-weight:700; color:#fff; letter-spacing:-.4px; }
.rp-logo-name span { color:#F5A623; }

.rp-left-headline {
  font-size:36px; font-weight:800; color:#fff;
  line-height:1.15; letter-spacing:-.8px; margin-bottom:16px;
}
.rp-left-headline em { font-style:normal; color:#F5A623; }
.rp-left-body { font-size:14px; color:rgba(255,255,255,.4); line-height:1.7; font-weight:300; max-width:300px; }

.rp-features { display:flex; flex-direction:column; gap:16px; margin-top:48px; }
.rp-feature { display:flex; align-items:center; gap:12px; font-size:13px; color:rgba(255,255,255,.55); }
.rp-feature-icon {
  width:32px; height:32px;
  background:rgba(245,166,35,.12);
  border-radius:8px;
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0; color:#F5A623;
}

.rp-quote { border-top:1px solid rgba(255,255,255,.08); padding-top:28px; }
.rp-quote-text { font-size:13px; color:rgba(255,255,255,.4); line-height:1.7; font-style:italic; font-weight:300; margin-bottom:12px; }
.rp-quote-author { display:flex; align-items:center; gap:10px; }
.rp-avatar {
  width:32px; height:32px; border-radius:50%;
  background:linear-gradient(135deg,#F5A623,#e05f20);
  display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:700; color:#fff;
}
.rp-author-name  { font-size:13px; font-weight:600; color:rgba(255,255,255,.7); }
.rp-author-title { font-size:11px; color:rgba(255,255,255,.3); }

.rp-right {
  display:flex; flex-direction:column; justify-content:center;
  padding:48px 56px; overflow-y:auto;
  animation:fadein .5s cubic-bezier(.22,.68,0,1.1) both;
}
.rp-right-inner { max-width:400px; width:100%; margin:0 auto; }

.rp-right-header { margin-bottom:28px; }
.rp-right-title { font-size:26px; font-weight:800; color:#0F1923; letter-spacing:-.6px; margin-bottom:6px; }
.rp-right-sub { font-size:14px; color:#8A8F98; }
.rp-right-sub a { color:#F5A623; font-weight:600; text-decoration:none; }
.rp-right-sub a:hover { text-decoration:underline; }

.rp-error {
  display:flex; align-items:flex-start; gap:10px;
  background:#FEF2F2; border:1px solid #FECACA;
  border-radius:10px; padding:12px 14px; margin-bottom:20px;
  font-size:13px; color:#DC2626;
  animation:shake .35s ease both;
}

.rp-steps { display:flex; align-items:center; gap:6px; margin-bottom:28px; }
.rp-step-dot { width:6px; height:6px; border-radius:50%; background:#E2E5EA; transition:all .2s; }
.rp-step-dot.active { width:20px; border-radius:3px; background:#F5A623; }
.rp-step-dot.done   { background:#F5A623; opacity:.4; }

.rp-section-label {
  font-size:10px; font-weight:700; letter-spacing:1.5px;
  text-transform:uppercase; color:#C2C7D0;
  margin-bottom:14px; margin-top:22px;
}
.rp-section-label:first-of-type { margin-top:0; }

.rp-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.rp-field { margin-bottom:14px; }
.rp-field:last-of-type { margin-bottom:0; }

.rp-label { display:block; font-size:12px; font-weight:600; color:#4B5260; margin-bottom:6px; letter-spacing:-.1px; }

.rp-input-wrap { position:relative; }
.rp-input-icon {
  position:absolute; left:12px; top:50%; transform:translateY(-50%);
  color:#C2C7D0; display:flex; align-items:center;
  pointer-events:none; transition:color .2s;
}
.rp-input-wrap:focus-within .rp-input-icon { color:#F5A623; }

.rp-input {
  width:100%; background:#fff; border:1.5px solid #E8EBF0;
  color:#0F1923; font-size:14px;
  font-family:'Plus Jakarta Sans',sans-serif; font-weight:400;
  padding:11px 12px 11px 38px; border-radius:10px; outline:none;
  transition:border-color .2s, box-shadow .2s;
}
.rp-input::placeholder { color:#C2C7D0; }
.rp-input:focus { border-color:#F5A623; box-shadow:0 0 0 3px rgba(245,166,35,.12); }
.rp-input.mismatch { border-color:#FCA5A5; box-shadow:0 0 0 3px rgba(252,165,165,.15); }

.rp-pw-toggle {
  position:absolute; right:12px; top:50%; transform:translateY(-50%);
  background:none; border:none; cursor:pointer;
  color:#C2C7D0; display:flex; align-items:center; padding:0; transition:color .2s;
}
.rp-pw-toggle:hover { color:#8A8F98; }

.rp-strength { display:flex; gap:4px; align-items:center; margin-top:7px; }
.rp-strength-bar { flex:1; height:3px; border-radius:99px; background:#F0F2F5; overflow:hidden; }
.rp-strength-fill { height:100%; border-radius:99px; transition:width .3s, background .3s; }
.rp-strength-label { font-size:11px; font-weight:600; min-width:40px; text-align:right; }

.rp-hint { font-size:11px; color:#F87171; margin-top:5px; }
.rp-divider { height:1px; background:#F0F2F5; margin:18px 0; }

.rp-btn {
  width:100%; background:#0F1923; color:#fff;
  font-size:14px; font-weight:700;
  font-family:'Plus Jakarta Sans',sans-serif; letter-spacing:-.1px;
  padding:14px; border-radius:10px; border:none; cursor:pointer;
  display:flex; align-items:center; justify-content:center; gap:8px;
  transition:background .2s, transform .15s, box-shadow .2s;
  margin-top:24px; position:relative; overflow:hidden;
}
.rp-btn:hover:not(:disabled) { background:#1a2a3a; transform:translateY(-1px); box-shadow:0 8px 20px rgba(15,25,35,.18); }
.rp-btn:active:not(:disabled) { transform:translateY(0); }
.rp-btn:disabled { opacity:.45; cursor:not-allowed; }
.rp-btn-accent { position:absolute; right:0; top:0; bottom:0; width:5px; background:#F5A623; }
.rp-spinner { width:16px; height:16px; border:2px solid rgba(255,255,255,.25); border-top-color:#fff; border-radius:50%; animation:spin .7s linear infinite; }

.rp-terms { text-align:center; font-size:11px; color:#B0B6C0; margin-top:16px; line-height:1.6; }
.rp-terms a { color:#8A8F98; text-decoration:underline; }

@media (max-width:860px) {
  .rp-root { grid-template-columns:1fr; }
  .rp-left { display:none; }
  .rp-right { padding:40px 24px; }
}
@media (max-width:420px) { .rp-row { grid-template-columns:1fr; } }
`;

function getStrength(pw) {
  if (!pw) return { score:0, label:'', color:'', pct:'0%' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [null,
    { label:'Weak',   color:'#EF4444', pct:'20%'  },
    { label:'Fair',   color:'#F97316', pct:'40%'  },
    { label:'Good',   color:'#EAB308', pct:'65%'  },
    { label:'Strong', color:'#22C55E', pct:'85%'  },
    { label:'Great',  color:'#F5A623', pct:'100%' },
  ];
  return { score:s, ...map[s] };
}

export default function Register() {
  const [form, setForm] = useState({ username:'', email:'', phone_number:'', password:'', password2:'' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.password2) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      await registerUser(form);
      navigate('/login');
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const first = Object.values(errors)[0];
        setError(Array.isArray(first) ? first[0] : first);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally { setLoading(false); }
  };

  const strength = getStrength(form.password);
  const mismatch = form.password2 && form.password !== form.password2;
  const step     = !form.username && !form.email ? 0 : (!form.password ? 1 : 2);

  const EyeOn  = () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1 7.5s2.5-4.5 6.5-4.5S14 7.5 14 7.5s-2.5 4.5-6.5 4.5S1 7.5 1 7.5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.4"/></svg>;
  const EyeOff = () => <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1 7.5s2.5-4.5 6.5-4.5S14 7.5 14 7.5s-2.5 4.5-6.5 4.5S1 7.5 1 7.5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.4"/><line x1="2" y1="13" x2="13" y2="2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>;

  return (
    <>
      <style>{css}</style>
      <div className="rp-root">

        {/* Left panel */}
        <div className="rp-left">
          <div className="rp-deco-ring rp-deco-ring-1"/>
          <div className="rp-deco-ring rp-deco-ring-2"/>
          <div className="rp-deco-ring rp-deco-ring-3"/>
          <div className="rp-deco-dot rp-deco-dot-1"/>
          <div className="rp-deco-dot rp-deco-dot-2"/>
          <div className="rp-deco-dot rp-deco-dot-3"/>

          <div className="rp-left-top">
            <div className="rp-logo">
              <div className="rp-logo-mark">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2L13 8H19L14.5 11.8L16.5 18L10 14.5L3.5 18L5.5 11.8L1 8H7L10 2Z" fill="#0F1923"/>
                </svg>
              </div>
              <span className="rp-logo-name">VTU<span>Express</span></span>
            </div>

            <h2 className="rp-left-headline">Everything you need.<br/><em>One dashboard.</em></h2>
            <p className="rp-left-body">Buy airtime, data, pay bills and manage your wallet — instantly, securely, 24/7.</p>

            <div className="rp-features">
              {[
                { icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>, text:'Instant airtime & data top-up' },
                { icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>, text:'Secure wallet & payments' },
                { icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 4.5v2.8l1.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>, text:'24/7 uptime, zero downtime' },
              ].map((f,i) => (
                <div className="rp-feature" key={i}>
                  <div className="rp-feature-icon">{f.icon}</div>
                  {f.text}
                </div>
              ))}
            </div>
          </div>

          <div className="rp-left-bottom">
            <div className="rp-quote">
              <p className="rp-quote-text">"VTUExpress saved me hours every month. I manage all my family's bills from one place now."</p>
              <div className="rp-quote-author">
                <div className="rp-avatar">AO</div>
                <div>
                  <div className="rp-author-name">Adetola Okafor</div>
                  <div className="rp-author-title">Small business owner, Lagos</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="rp-right">
          <div className="rp-right-inner">
            <div className="rp-right-header">
              <h1 className="rp-right-title">Create your account</h1>
              <p className="rp-right-sub">Already registered? <Link to="/login">Sign in here</Link></p>
            </div>

            <div className="rp-steps">
              {[0,1,2].map(i => (
                <div key={i} className={`rp-step-dot${step===i?' active':step>i?' done':''}`}/>
              ))}
            </div>

            {error && (
              <div className="rp-error">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{flexShrink:0,marginTop:1}}>
                  <circle cx="7.5" cy="7.5" r="6" stroke="#DC2626" strokeWidth="1.4"/>
                  <path d="M7.5 4.5v3M7.5 9.5v.5" stroke="#DC2626" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="rp-section-label">Personal info</div>

              <div className="rp-row">
                <div className="rp-field">
                  <label className="rp-label">Username</label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 12.5c0-2.5 2.5-4 5.5-4s5.5 1.5 5.5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                    </span>
                    <input type="text" name="username" value={form.username} onChange={handleChange}
                      className="rp-input" placeholder="johndoe" required autoComplete="username"/>
                  </div>
                </div>
                <div className="rp-field">
                  <label className="rp-label">Phone</label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="3.5" y="1" width="7" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="7" cy="10.5" r=".75" fill="currentColor"/></svg>
                    </span>
                    <input type="tel" name="phone_number" value={form.phone_number} onChange={handleChange}
                      className="rp-input" placeholder="08012345678" required/>
                  </div>
                </div>
              </div>

              <div className="rp-field">
                <label className="rp-label">Email address</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 3l5.5 5 5.5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  </span>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    className="rp-input" placeholder="you@example.com" required autoComplete="email"/>
                </div>
              </div>

              <div className="rp-divider"/>
              <div className="rp-section-label">Security</div>

              <div className="rp-field">
                <label className="rp-label">Password</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4.5 6V4a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                  </span>
                  <input type={showPw?'text':'password'} name="password" value={form.password}
                    onChange={handleChange} className="rp-input" placeholder="Min. 8 characters"
                    required style={{paddingRight:38}} autoComplete="new-password"/>
                  <button type="button" className="rp-pw-toggle" onClick={()=>setShowPw(v=>!v)} tabIndex={-1}>
                    {showPw ? <EyeOff/> : <EyeOn/>}
                  </button>
                </div>
                {form.password && (
                  <div className="rp-strength">
                    {[1,2,3,4,5].map(i=>(
                      <div className="rp-strength-bar" key={i}>
                        <div className="rp-strength-fill" style={{width:strength.score>=i?'100%':'0%',background:strength.color}}/>
                      </div>
                    ))}
                    <span className="rp-strength-label" style={{color:strength.color}}>{strength.label}</span>
                  </div>
                )}
              </div>

              <div className="rp-field" style={{marginBottom:0}}>
                <label className="rp-label">Confirm password</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="6" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4.5 6V4a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M5 9.5l1.5 1.5L9.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <input type={showPw2?'text':'password'} name="password2" value={form.password2}
                    onChange={handleChange} className={`rp-input${mismatch?' mismatch':''}`}
                    placeholder="Repeat password" required style={{paddingRight:38}} autoComplete="new-password"/>
                  <button type="button" className="rp-pw-toggle" onClick={()=>setShowPw2(v=>!v)} tabIndex={-1}>
                    {showPw2 ? <EyeOff/> : <EyeOn/>}
                  </button>
                </div>
                {mismatch && <p className="rp-hint">Passwords don't match</p>}
              </div>

              <button type="submit" disabled={loading} className="rp-btn">
                <div className="rp-btn-accent"/>
                {loading
                  ? <><div className="rp-spinner"/> Creating account…</>
                  : <>Create account <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></>
                }
              </button>
            </form>

            <p className="rp-terms">
              By signing up you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
