import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyFunding } from '../services/api';

const s = {
    page:    { minHeight: '100vh', background: '#0E0E0F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Geist', sans-serif" },
    card:    { background: '#1C1C1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '48px 40px', maxWidth: 420, width: '100%', textAlign: 'center' },
    iconWrap:{ width: 64, height: 64, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' },
    title:   { fontSize: 18, fontWeight: 500, letterSpacing: '-.3px', marginBottom: 8 },
    sub:     { fontSize: 13, fontFamily: 'monospace', color: 'rgba(250,250,250,0.35)', marginTop: 20, letterSpacing: .5 },
    bar:     { height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 28, overflow: 'hidden' },
    fill:    { height: '100%', borderRadius: 2, animation: 'shrink 3s linear forwards' },
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500&family=Geist+Mono:wght@400&display=swap');
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shrink { from { width: 100%; } to { width: 0%; } }
@keyframes fadein { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
.cb-card { animation: fadein .3s ease; }
.cb-spin { animation: spin 1s linear infinite; }
`;

export default function PaymentCallback() {
    const [message, setMessage] = useState('');
    const [amount, setAmount]   = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const params    = new URLSearchParams(window.location.search);
        const reference = params.get('reference') || params.get('trxref');

        if (reference) {
            verifyFunding(reference)
                .then((res) => {
                    setSuccess(true);
                    setAmount(res.data.amount);
                    setMessage('Payment confirmed');
                    setTimeout(() => navigate('/dashboard'), 3000);
                })
                .catch(() => {
                    setSuccess(false);
                    setMessage('Verification failed');
                    setTimeout(() => navigate('/dashboard'), 3000);
                });
        } else {
            setSuccess(false);
            setMessage('No payment reference found');
            setTimeout(() => navigate('/dashboard'), 3000);
        }
    }, []);

    const states = {
        null: {
            iconBg:   'rgba(201,168,76,0.12)',
            iconColor:'#C9A84C',
            icon:     'ti-loader-2',
            spin:     true,
            heading:  'Verifying payment',
            detail:   'Please wait while we confirm your transaction…',
            barColor: '#C9A84C',
        },
        true: {
            iconBg:   'rgba(34,197,94,0.12)',
            iconColor:'#22C55E',
            icon:     'ti-circle-check',
            spin:     false,
            heading:  message || 'Payment confirmed',
            detail:   amount ? `₦${Number(amount).toLocaleString()} has been added to your wallet.` : 'Your wallet has been funded.',
            barColor: '#22C55E',
        },
        false: {
            iconBg:   'rgba(239,68,68,0.1)',
            iconColor:'#EF4444',
            icon:     'ti-circle-x',
            spin:     false,
            heading:  message || 'Payment failed',
            detail:   'Please contact support if you were charged.',
            barColor: '#EF4444',
        },
    };

    const st = states[String(success)] ?? states['null'];

    return (
        <div style={s.page}>
            <style>{css}</style>
            <div style={s.card} className="cb-card">
                <div style={{ ...s.iconWrap, background: st.iconBg }}>
                    <i
                        className={`ti ${st.icon} ${st.spin ? 'cb-spin' : ''}`}
                        style={{ fontSize: 28, color: st.iconColor }}
                        aria-hidden="true"
                    />
                </div>

                <div style={s.title}>{st.heading}</div>
                <div style={{ fontSize: 13, color: 'rgba(250,250,250,0.45)', lineHeight: 1.6 }}>
                    {st.detail}
                </div>

                {success !== null && (
                    <>
                        <div style={s.sub}>Redirecting to dashboard…</div>
                        <div style={s.bar}>
                            <div style={{ ...s.fill, background: st.barColor }} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
