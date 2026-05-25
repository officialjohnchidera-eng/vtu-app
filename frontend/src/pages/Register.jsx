import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

const css = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

@keyframes gridpan {
  0%   { transform: translate(0, 0); }
  100% { transform: translate(60px, 60px); }
}
@keyframes floatin {
  0%   { opacity: 0; transform: translateY(28px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes fadein {
  from { opacity: 0; } to { opacity: 1; }
}
@keyframes pulse-ring {
  0%   { transform: scale(1);   opacity: .6; }
  100% { transform: scale(1.9); opacity: 0;  }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%,60% { transform: translateX(-6px); }
  40%,80% { transform: translateX(6px); }
}

.rp-root {
  min-height: 100vh;
  background: #080A0F;
  font-family: 'DM Sans', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

/* animated grid bg */
.rp-grid {
  position: absolute;
  inset: -80px;
  background-image:
    linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridpan 8s linear infinite;
  pointer-events: none;
}

/* glows */
.rp-glow-a {
  position: absolute;
  width: 600px; height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(250,185,30,.12) 0%, transparent 70%);
  top: -200px; right: -150px;
  pointer-events: none;
}
.rp-glow-b {
  position: absolute;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(100,160,255,.08) 0%, transparent 70%);
  bottom: -100px; left: -100px;
  pointer-events: none;
}

/* card */
.rp-card {
  position: relative;
  width: 100%;
  max-width: 460px;
  animation: floatin .55s cubic-bezier(.22,.68,0,1.2) both;
}

/* header */
.rp-header {
  margin-bottom: 36px;
  animation: floatin .55s .05s cubic-bezier(.22,.68,0,1.2) both;
}
.rp-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
}
.rp-logo-icon {
  width: 36px; height: 36px;
  background: #FAB91E;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.rp-logo-icon::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  background: #FAB91E;
  animation: pulse-ring 2s ease-out infinite;
}
.rp-logo-icon svg { position: relative; z-index: 1; }
.rp-logo-name {
  font-family: 'Syne', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #FAFAFA;
  letter-spacing: -.3px;
}
.rp-title {
  font-family: 'Syne', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #FAFAFA;
  letter-spacing: -1px;
  line-height: 1.1;
  margin-bottom: 8px;
}
.rp-title span { color: #FAB91E; }
.rp-subtitle {
  font-size: 14px;
  color: rgba(250,250,250,.38);
  font-weight: 300;
  letter-spacing: .1px;
}

/* form panel */
.rp-panel {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 24px;
  padding: 32px;
  backdrop-filter: blur(12px);
  animation: floatin .55s .1s cubic-bezier(.22,.68,0,1.2) both;
}

/* error */
.rp-error {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(239,68,68,.1);
  border: 1px solid rgba(239,68,68,.25);
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 24px;
  font-size: 13px;
  color: #F87171;
  animation: shake .35s ease both;
}
.rp-error svg { flex-shrink: 0; }

/* row layout for two fields side by side */
.rp-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* field */
.rp-field {
  margin-bottom: 16px;
}
.rp-field:last-of-type { margin-bottom: 0; }

.rp-label {
  display: block;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: rgba(250,250,250,.3);
  margin-bottom: 8px;
  font-family: 'DM Sans', sans-serif;
}

.rp-input-wrap {
  position: relative;
}
.rp-input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(250,250,250,.2);
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: color .2s;
}
.rp-input {
  width: 100%;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  color: #FAFAFA;
  font-size: 14px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 400;
  padding: 13px 14px 13px 42px;
  border-radius: 12px;
  outline: none;
  transition: border-color .2s, background .2s, box-shadow .2s;
}
.rp-input::placeholder { color: rgba(250,250,250,.18); }
.rp-input:focus {
  border-color: rgba(250,185,30,.5);
  background: rgba(250,185,30,.04);
  box-shadow: 0 0 0 3px rgba(250,185,30,.08);
}
.rp-input:focus + .rp-focus-line { transform: scaleX(1); }
.rp-input-wrap:focus-within .rp-input-icon { color: rgba(250,185,30,.6); }

/* password toggle */
.rp-pw-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(250,250,250,.25);
  display: flex;
  align-items: center;
  padding: 0;
  transition: color .2s;
}
.rp-pw-toggle:hover { color: rgba(250,250,250,.6); }

/* divider */
.rp-divider {
  height: 1px;
  background: rgba(255,255,255,.07);
  margin: 24px 0;
}

/* strength bar */
.rp-strength {
  margin-top: 8px;
  display: flex;
  gap: 4px;
  align-items: center;
}
.rp-strength-bar {
  flex: 1;
  height: 3px;
  border-radius: 99px;
  background: rgba(255,255,255,.08);
  overflow: hidden;
}
.rp-strength-fill {
  height: 100%;
  border-radius: 99px;
  transition: width .3s ease, background .3s ease;
}
.rp-strength-label {
  font-size: 11px;
  color: rgba(250,250,250,.3);
  min-width: 44px;
  text-align: right;
}

/* submit */
.rp-btn {
  width: 100%;
  background: #FAB91E;
  color: #080A0F;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Syne', sans-serif;
  letter-spacing: .3px;
  padding: 15px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background .2s, transform .15s, box-shadow .2s;
  margin-top: 28px;
  position: relative;
  overflow: hidden;
}
.rp-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,.15) 0%, transparent 60%);
  pointer-events: none;
}
.rp-btn:hover:not(:disabled) {
  background: #FFC83A;
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(250,185,30,.3);
}
.rp-btn:active:not(:disabled) { transform: translateY(0); }
.rp-btn:disabled { opacity: .45; cursor: not-allowed; }
.rp-btn-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(8,10,15,.3);
  border-top-color: #080A0F;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

/* footer */
.rp-footer {
  text-align: center;
  margin-top: 24px;
  font-size: 13px;
  color: rgba(250,250,250,.3);
  animation: fadein .6s .3s both;
}
.rp-footer a {
  color: #FAB91E;
  font-weight: 500;
  text-decoration: none;
  transition: opacity .15s;
}
.rp-footer a:hover { opacity: .75; }

/* terms */
.rp-terms {
  text-align: center;
  font-size: 11px;
  color: rgba(250,250,250,.2);
  margin-top: 16px;
  line-height: 1.6;
  animation: fadein .6s .35s both;
}
.rp-terms a { color: rgba(250,250,250,.35); text-decoration: underline; }

@media (max-width: 480px) {
  .rp-row { grid-template-columns: 1fr; }
  .rp-panel { padding: 24px 20px; }
  .rp-title { font-size: 26px; }
}
`;

function getStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score: 1, label: 'Weak',   color: '#EF4444', pct: '20%'  };
  if (score <= 2) return { score: 2, label: 'Fair',   color: '#F97316', pct: '40%'  };
  if (score <= 3) return { score: 3, label: 'Good',   color: '#EAB308', pct: '65%'  };
  if (score <= 4) return { score: 4, label: 'Strong', color: '#22C55E', pct: '85%'  };
  return                { score: 5, label: 'Great',  color: '#FAB91E', pct: '100%' };
}

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', phone_number: '', password: '', password2: ''
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await registerUser(form);
      navigate('/login');
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        const firstError = Object.values(errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(form.password);

  return (
    <>
      <style>{css}</style>
      <div className="rp-root">
        <div className="rp-grid" />
        <div className="rp-glow-a" />
        <div className="rp-glow-b" />

        <div className="rp-card">
          {/* Header */}
          <div className="rp-header">
            <div className="rp-logo">
              <div className="rp-logo-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2L11.5 7H16L12.5 10.5L14 15.5L9 12.5L4 15.5L5.5 10.5L2 7H6.5L9 2Z" fill="#080A0F"/>
                </svg>
              </div>
              <span className="rp-logo-name">VTU App</span>
            </div>
            <h1 className="rp-title">Create your<br/><span>account.</span></h1>
            <p className="rp-subtitle">Join thousands managing airtime, data & bills in one place.</p>
          </div>

          {/* Form panel */}
          <div className="rp-panel">
            {error && (
              <div className="rp-error">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#F87171" strokeWidth="1.5"/>
                  <path d="M8 5v3.5M8 10.5v.5" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Row: username + phone */}
              <div className="rp-row">
                <div className="rp-field">
                  <label className="rp-label">Username</label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <circle cx="7.5" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
                        <path d="M1.5 13.5C1.5 11 4.2 9 7.5 9C10.8 9 13.5 11 13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      className="rp-input"
                      placeholder="e.g. johndoe"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="rp-field">
                  <label className="rp-label">Phone</label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <rect x="4" y="1" width="7" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                        <circle cx="7.5" cy="11.5" r=".75" fill="currentColor"/>
                      </svg>
                    </span>
                    <input
                      type="tel"
                      name="phone_number"
                      value={form.phone_number}
                      onChange={handleChange}
                      className="rp-input"
                      placeholder="08012345678"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="rp-field">
                <label className="rp-label">Email address</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M1.5 3.5L7.5 8.5L13.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="rp-input"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="rp-divider" />

              {/* Password */}
              <div className="rp-field">
                <label className="rp-label">Password</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <rect x="2.5" y="6" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      <circle cx="7.5" cy="10" r="1" fill="currentColor"/>
                    </svg>
                  </span>
                  <input
                    type={showPw ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="rp-input"
                    placeholder="Min. 8 characters"
                    required
                    style={{ paddingRight: '42px' }}
                    autoComplete="new-password"
                  />
                  <button type="button" className="rp-pw-toggle" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                    {showPw
                      ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/><line x1="2" y1="14" x2="14" y2="2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                    }
                  </button>
                </div>
                {form.password && (
                  <div className="rp-strength">
                    {[1,2,3,4,5].map(i => (
                      <div className="rp-strength-bar" key={i}>
                        <div className="rp-strength-fill" style={{
                          width: strength.score >= i ? '100%' : '0%',
                          background: strength.color
                        }}/>
                      </div>
                    ))}
                    <span className="rp-strength-label" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="rp-field" style={{ marginBottom: 0 }}>
                <label className="rp-label">Confirm password</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <rect x="2.5" y="6" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M5 6V4.5a2.5 2.5 0 015 0V6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                      <path d="M5.5 10l1.5 1.5L10 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <input
                    type={showPw2 ? 'text' : 'password'}
                    name="password2"
                    value={form.password2}
                    onChange={handleChange}
                    className="rp-input"
                    placeholder="Repeat your password"
                    required
                    style={{
                      paddingRight: '42px',
                      borderColor: form.password2 && form.password !== form.password2
                        ? 'rgba(239,68,68,.5)' : undefined
                    }}
                    autoComplete="new-password"
                  />
                  <button type="button" className="rp-pw-toggle" onClick={() => setShowPw2(v => !v)} tabIndex={-1}>
                    {showPw2
                      ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/><line x1="2" y1="14" x2="14" y2="2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
                    }
                  </button>
                </div>
                {form.password2 && form.password !== form.password2 && (
                  <p style={{ fontSize: 11, color: '#F87171', marginTop: 6 }}>Passwords don't match</p>
                )}
              </div>

              <button type="submit" disabled={loading} className="rp-btn">
                {loading
                  ? <><div className="rp-btn-spinner" /> Creating account…</>
                  : <>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="#080A0F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Create account
                    </>
                }
              </button>
            </form>
          </div>

          <p className="rp-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>

          <p className="rp-terms">
            By creating an account you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </>
  );
}