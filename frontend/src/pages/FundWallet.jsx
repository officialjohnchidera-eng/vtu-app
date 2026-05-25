import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fundWallet } from '../services/api';
import { useAuth } from '../context/AuthContext';

const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap');
@keyframes fadein { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
.fw-page { min-height:100vh; background:#0E0E0F; color:#FAFAFA; font-family:'Geist',sans-serif; font-size:14px; }
.fw-nav { background:#161618; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; align-items:center; gap:16px; padding:0 28px; height:56px; }
.fw-back { display:flex; align-items:center; gap:6px; color:rgba(250,250,250,0.4); font-size:13px; font-family:monospace; text-decoration:none; transition:.15s; }
.fw-back:hover { color:rgba(250,250,250,0.8); }
.fw-nav-title { font-size:15px; font-weight:500; letter-spacing:-.3px; }
.fw-body { max-width:440px; margin:0 auto; padding:32px 24px 48px; animation:fadein .3s ease; }
.fw-card { background:#1C1C1F; border:1px solid rgba(255,255,255,0.1); border-radius:20px; padding:28px; }
.fw-label { font-size:10px; font-family:monospace; color:rgba(250,250,250,0.3); letter-spacing:2px; text-transform:uppercase; margin-bottom:14px; }
.fw-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:14px; }
.fw-quick { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); color:rgba(250,250,250,0.6); font-size:13px; font-family:monospace; padding:12px 8px; border-radius:10px; cursor:pointer; transition:.15s; }
.fw-quick:hover { border-color:rgba(201,168,76,0.35); color:#E4C46B; background:rgba(201,168,76,0.06); }
.fw-quick.active { background:rgba(201,168,76,0.12); border-color:#C9A84C; color:#E4C46B; }
.fw-input { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); color:#FAFAFA; font-size:15px; font-family:monospace; padding:14px 16px; border-radius:10px; outline:none; transition:.15s; box-sizing:border-box; }
.fw-input::placeholder { color:rgba(250,250,250,0.2); }
.fw-input:focus { border-color:rgba(201,168,76,0.5); background:rgba(201,168,76,0.04); }
.fw-divider { height:1px; background:rgba(255,255,255,0.06); margin:22px 0; }
.fw-info { display:flex; align-items:flex-start; gap:10px; background:rgba(99,162,255,0.07); border:1px solid rgba(99,162,255,0.15); border-radius:10px; padding:14px; margin-bottom:22px; }
.fw-info i { font-size:16px; color:#63A2FF; flex-shrink:0; margin-top:1px; }
.fw-info-txt { font-size:12px; color:rgba(250,250,250,0.45); line-height:1.6; }
.fw-error { display:flex; align-items:center; gap:8px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); border-radius:10px; padding:12px 14px; margin-bottom:20px; font-size:13px; color:#EF4444; }
.fw-error i { font-size:15px; flex-shrink:0; }
.fw-btn { width:100%; background:#C9A84C; color:#0E0E0F; font-size:14px; font-weight:600; font-family:'Geist',sans-serif; padding:14px; border-radius:10px; border:none; cursor:pointer; transition:.15s; letter-spacing:-.2px; display:flex; align-items:center; justify-content:center; gap:8px; }
.fw-btn:hover:not(:disabled) { background:#E4C46B; }
.fw-btn:disabled { opacity:.4; cursor:not-allowed; }
.fw-btn i { font-size:16px; }
@keyframes spin { to { transform:rotate(360deg); } }
.spin { animation:spin .9s linear infinite; }
`;

export default function FundWallet() {
    const [amount, setAmount]   = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fundWallet({ amount: Number(amount) });
            const { payment_url, reference } = response.data;
            localStorage.setItem('payment_reference', reference);
            const newWindow = window.open('', '_blank');
            if (newWindow) { newWindow.location.href = payment_url; }
            else { window.location.href = payment_url; }
        } catch (err) {
            const errorData = err.response?.data;
            
            // Log user out seamlessly if their token expired
            if (errorData?.code === "token_not_valid" || err.response?.status === 401) {
                logout();
                navigate('/login');
                return;
            }
            
            // Display normal error if it's something else
            setError(errorData?.error || 'Could not initialize payment. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const displayAmt = Number(amount);

    return (
        <>
            <style>{css}</style>
            <div className="fw-page">
                <nav className="fw-nav">
                    <Link to="/dashboard" className="fw-back">
                        <i className="ti ti-arrow-left" aria-hidden="true" />
                        Back
                    </Link>
                    <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 16 }}>|</span>
                    <span className="fw-nav-title">Fund wallet</span>
                </nav>

                <div className="fw-body">
                    <div className="fw-card">
                        {error && (
                            <div className="fw-error">
                                <i className="ti ti-alert-circle" aria-hidden="true" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="fw-label">Quick select</div>
                            <div className="fw-grid">
                                {quickAmounts.map(amt => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setAmount(amt)}
                                        className={`fw-quick${amount == amt ? ' active' : ''}`}
                                    >
                                        ₦{amt.toLocaleString()}
                                    </button>
                                ))}
                            </div>

                            <input
                                type="number"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                className="fw-input"
                                placeholder="Or enter custom amount"
                                required
                                min="1"
                            />

                            <div className="fw-divider" />

                            <div className="fw-info">
                                <i className="ti ti-lock" aria-hidden="true" />
                                <span className="fw-info-txt">
                                    You'll be redirected to Paystack to complete payment securely. Your wallet will be credited instantly after confirmation.
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !amount}
                                className="fw-btn"
                            >
                                {loading
                                    ? <><i className="ti ti-loader-2 spin" aria-hidden="true" /> Initializing…</>
                                    : <><i className="ti ti-credit-card" aria-hidden="true" /> Pay ₦{displayAmt ? displayAmt.toLocaleString() : '0'}</>
                                }
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}