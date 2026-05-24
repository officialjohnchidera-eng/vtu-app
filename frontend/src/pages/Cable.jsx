import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'https://vtu-app-production.up.railway.app/api/v1' });
api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const PROVIDERS = [
    { value: 'dstv',      label: 'DSTV',      color: '#0066CC', bg: 'rgba(0,102,204,0.12)'   },
    { value: 'gotv',      label: 'GOtv',      color: '#E8A020', bg: 'rgba(232,160,32,0.12)'  },
    { value: 'startimes', label: 'Startimes', color: '#E02020', bg: 'rgba(224,32,32,0.12)'   },
];

const styles = {
    page:     { minHeight: '100vh', background: '#0E0E0F', color: '#FAFAFA', fontFamily: "'Geist', sans-serif", fontSize: 14 },
    nav:      { background: '#161618', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', height: 56 },
    back:     { color: 'rgba(250,250,250,0.4)', textDecoration: 'none', fontSize: 13, fontFamily: 'monospace' },
    navTitle: { fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' },
    body:     { maxWidth: 480, margin: '0 auto', padding: '28px 24px 48px' },
    card:     { background: '#1C1C1F', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 16 },
    label:    { fontSize: 10, fontFamily: 'monospace', color: 'rgba(250,250,250,0.28)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, display: 'block' },
    provGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 },
    provBtn:  { padding: '14px 8px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#FAFAFA', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Geist', sans-serif" },
    input:    { width: '100%', background: '#111113', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', color: '#FAFAFA', fontSize: 14, fontFamily: "'Geist', sans-serif", outline: 'none', boxSizing: 'border-box' },
    verifyBtn:{ marginTop: 10, width: '100%', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C', padding: '11px 0', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Geist', sans-serif" },
    custBox:  { marginTop: 12, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 10, padding: '10px 14px' },
    custName: { fontSize: 13, color: '#22C55E', fontWeight: 500 },
    custSub:  { fontSize: 11, color: 'rgba(250,250,250,0.28)', fontFamily: 'monospace', marginTop: 2 },
    planGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxHeight: 280, overflowY: 'auto' },
    planBtn:  { padding: '12px 10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#FAFAFA', fontSize: 11, cursor: 'pointer', textAlign: 'left', fontFamily: "'Geist', sans-serif" },
    planAmt:  { fontSize: 14, fontWeight: 600, fontFamily: 'monospace', color: '#C9A84C', display: 'block', marginBottom: 3 },
    planName: { fontSize: 10, color: 'rgba(250,250,250,0.4)', lineHeight: 1.3 },
    submitBtn:{ width: '100%', background: '#C9A84C', color: '#0E0E0F', padding: '13px 0', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: "'Geist', sans-serif", marginTop: 4 },
    alert:    { borderRadius: 10, padding: '11px 14px', fontSize: 13, marginBottom: 14 },
};

export default function Cable() {
    const [provider, setProvider] = useState('dstv');
    const [smartcard, setSmartcard] = useState('');
    const [customer, setCustomer] = useState(null);
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        setPlans([]);
        setSelectedPlan(null);
        setCustomer(null);
        api.get(`/vtu/cable/plans/${provider}/`)
            .then(r => {
                const v = r.data?.content?.varations || r.data?.content?.variations || [];
                setPlans(v);
            })
            .catch(() => {});
    }, [provider]);

    const handleVerify = async () => {
        if (!smartcard) return;
        setVerifying(true);
        setCustomer(null);
        setError('');
        try {
            const r = await api.post('/vtu/cable/verify/', { smartcard_number: smartcard, provider });
            if (r.data?.content?.Customer_Name) {
                setCustomer(r.data.content);
            } else {
                setError('Smartcard not found. Please check the number.');
            }
        } catch {
            setError('Could not verify smartcard.');
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPlan || !smartcard || !customer) return;
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await api.post('/vtu/cable/', {
                smartcard_number: smartcard,
                provider,
                variation_code: selectedPlan.variation_code,
            });
            setSuccess(`${provider.toUpperCase()} subscription successful for ${customer.Customer_Name}!`);
            setSmartcard('');
            setCustomer(null);
            setSelectedPlan(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Transaction failed.');
        } finally {
            setLoading(false);
        }
    };

    const activeProvider = PROVIDERS.find(p => p.value === provider);

    return (
        <div style={styles.page}>
            <nav style={styles.nav}>
                <Link to="/dashboard" style={styles.back}>← Back</Link>
                <span style={styles.navTitle}>Cable TV</span>
            </nav>

            <div style={styles.body}>
                {success && (
                    <div style={{ ...styles.alert, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E' }}>
                        {success}
                    </div>
                )}
                {error && (
                    <div style={{ ...styles.alert, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
                        {error}
                    </div>
                )}

                {/* Provider */}
                <div style={styles.card}>
                    <span style={styles.label}>Select Provider</span>
                    <div style={styles.provGrid}>
                        {PROVIDERS.map(p => (
                            <button
                                key={p.value}
                                onClick={() => setProvider(p.value)}
                                style={{
                                    ...styles.provBtn,
                                    background: provider === p.value ? p.bg : 'transparent',
                                    border: `1px solid ${provider === p.value ? p.color : 'rgba(255,255,255,0.08)'}`,
                                    color: provider === p.value ? p.color : '#FAFAFA',
                                }}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Smartcard */}
                <div style={styles.card}>
                    <span style={styles.label}>Smartcard / IUC Number</span>
                    <input
                        style={styles.input}
                        placeholder="Enter smartcard number"
                        value={smartcard}
                        onChange={e => { setSmartcard(e.target.value); setCustomer(null); }}
                    />
                    <button onClick={handleVerify} disabled={verifying || !smartcard} style={styles.verifyBtn}>
                        {verifying ? 'Verifying...' : 'Verify Smartcard'}
                    </button>
                    {customer && (
                        <div style={styles.custBox}>
                            <div style={styles.custName}>{customer.Customer_Name}</div>
                            <div style={styles.custSub}>{customer.Current_Bouquet || provider.toUpperCase()}</div>
                        </div>
                    )}
                </div>

                {/* Plans */}
                <div style={styles.card}>
                    <span style={styles.label}>Select Plan</span>
                    {plans.length === 0 ? (
                        <p style={{ color: 'rgba(250,250,250,0.28)', fontSize: 12, fontFamily: 'monospace' }}>Loading plans...</p>
                    ) : (
                        <div style={styles.planGrid}>
                            {plans.map(plan => (
                                <button
                                    key={plan.variation_code}
                                    onClick={() => setSelectedPlan(plan)}
                                    style={{
                                        ...styles.planBtn,
                                        background: selectedPlan?.variation_code === plan.variation_code
                                            ? `rgba(${activeProvider?.color === '#0066CC' ? '0,102,204' : activeProvider?.color === '#E8A020' ? '232,160,32' : '224,32,32'},0.12)`
                                            : 'transparent',
                                        border: `1px solid ${selectedPlan?.variation_code === plan.variation_code ? activeProvider?.color : 'rgba(255,255,255,0.08)'}`,
                                    }}
                                >
                                    <span style={styles.planAmt}>₦{Number(plan.variation_amount).toLocaleString()}</span>
                                    <span style={styles.planName}>{plan.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading || !selectedPlan || !customer}
                    style={{ ...styles.submitBtn, opacity: (!selectedPlan || !customer) ? 0.4 : 1 }}
                >
                    {loading ? 'Processing...' : selectedPlan ? `Subscribe ₦${Number(selectedPlan.variation_amount).toLocaleString()}` : 'Select a plan'}
                </button>
            </div>
        </div>
    );
}