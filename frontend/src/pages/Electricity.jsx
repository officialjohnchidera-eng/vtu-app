import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: 'https://vtu-app-production.up.railway.app/api/v1' });
api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const DISCOS = [
    { value: 'ikeja-electric',        label: 'Ikeja Electric',     short: 'IKEDC' },
    { value: 'eko-electric',          label: 'Eko Electric',       short: 'EKEDC' },
    { value: 'abuja-electric',        label: 'Abuja Electric',     short: 'AEDC'  },
    { value: 'kano-electric',         label: 'Kano Electric',      short: 'KEDCO' },
    { value: 'portharcourt-electric', label: 'Port Harcourt',      short: 'PHED'  },
    { value: 'jos-electric',          label: 'Jos Electric',       short: 'JED'   },
    { value: 'ibadan-electric',       label: 'Ibadan Electric',    short: 'IBEDC' },
    { value: 'kaduna-electric',       label: 'Kaduna Electric',    short: 'KAEDCO'},
    { value: 'enugu-electric',        label: 'Enugu Electric',     short: 'EEDC'  },
    { value: 'benin-electric',        label: 'Benin Electric',     short: 'BEDC'  },
    { value: 'aba-electric',          label: 'Aba Electric',       short: 'ABEDC' },
    { value: 'yola-electric',         label: 'Yola Electric',      short: 'YEDC'  },
];

const styles = {
    page:     { minHeight: '100vh', background: '#0E0E0F', color: '#FAFAFA', fontFamily: "'Geist', sans-serif", fontSize: 14 },
    nav:      { background: '#161618', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', height: 56 },
    back:     { color: 'rgba(250,250,250,0.4)', textDecoration: 'none', fontSize: 13, fontFamily: 'monospace' },
    navTitle: { fontSize: 15, fontWeight: 500 },
    body:     { maxWidth: 480, margin: '0 auto', padding: '28px 24px 48px' },
    card:     { background: '#1C1C1F', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 16 },
    label:    { fontSize: 10, fontFamily: 'monospace', color: 'rgba(250,250,250,0.28)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 10, display: 'block' },
    select:   { width: '100%', background: '#111113', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', color: '#FAFAFA', fontSize: 14, fontFamily: "'Geist', sans-serif", outline: 'none', boxSizing: 'border-box' },
    meterRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 },
    typeBtn:  { padding: '12px 8px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#FAFAFA', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Geist', sans-serif" },
    input:    { width: '100%', background: '#111113', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', color: '#FAFAFA', fontSize: 14, fontFamily: "'Geist', sans-serif", outline: 'none', boxSizing: 'border-box' },
    verifyBtn:{ marginTop: 10, width: '100%', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#FCD34D', padding: '11px 0', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Geist', sans-serif" },
    custBox:  { marginTop: 12, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: 10, padding: '10px 14px' },
    custName: { fontSize: 13, color: '#22C55E', fontWeight: 500 },
    custSub:  { fontSize: 11, color: 'rgba(250,250,250,0.28)', fontFamily: 'monospace', marginTop: 2 },
    amtGrid:  { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 10 },
    amtBtn:   { padding: '12px 8px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#FAFAFA', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: "'Geist', sans-serif' " },
    submitBtn:{ width: '100%', background: '#FCD34D', color: '#0E0E0F', padding: '13px 0', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: "'Geist', sans-serif", marginTop: 4 },
    alert:    { borderRadius: 10, padding: '11px 14px', fontSize: 13, marginBottom: 14 },
};

const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 10000, 20000];

export default function Electricity() {
    const [disco, setDisco] = useState('ikeja-electric');
    const [meterType, setMeterType] = useState('prepaid');
    const [meterNumber, setMeterNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [customer, setCustomer] = useState(null);
    const [verifying, setVerifying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleVerify = async () => {
        if (!meterNumber) return;
        setVerifying(true);
        setCustomer(null);
        setError('');
        try {
            const r = await api.post('/vtu/electricity/verify/', {
                meter_number: meterNumber,
                disco,
                meter_type: meterType
            });
            if (r.data?.content && !r.data?.content?.WrongBillersCode) {
                setCustomer(r.data.content);
            } else {
                setError('Meter number not found. Please check and try again.');
            }
        } catch {
            setError('Could not verify meter number.');
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async () => {
        if (!amount || !meterNumber || !phone) return;
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const r = await api.post('/vtu/electricity/', {
                meter_number: meterNumber,
                disco,
                meter_type: meterType,
                amount: Number(amount),
                phone
            });
            setSuccess(`Electricity purchase successful! Token: ${r.data.token || 'Check your meter'}`);
            setMeterNumber('');
            setCustomer(null);
            setAmount('');
            setPhone('');
        } catch (err) {
            setError(err.response?.data?.error || 'Transaction failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <nav style={styles.nav}>
                <Link to="/dashboard" style={styles.back}>← Back</Link>
                <span style={styles.navTitle}>Electricity</span>
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

                {/* DISCO */}
                <div style={styles.card}>
                    <span style={styles.label}>Select Distribution Company</span>
                    <select
                        value={disco}
                        onChange={e => { setDisco(e.target.value); setCustomer(null); }}
                        style={styles.select}
                    >
                        {DISCOS.map(d => (
                            <option key={d.value} value={d.value}>{d.label} ({d.short})</option>
                        ))}
                    </select>
                </div>

                {/* Meter Type */}
                <div style={styles.card}>
                    <span style={styles.label}>Meter Type</span>
                    <div style={styles.meterRow}>
                        {['prepaid', 'postpaid'].map(type => (
                            <button
                                key={type}
                                onClick={() => { setMeterType(type); setCustomer(null); }}
                                style={{
                                    ...styles.typeBtn,
                                    background: meterType === type ? 'rgba(251,191,36,0.1)' : 'transparent',
                                    border: `1px solid ${meterType === type ? '#FCD34D' : 'rgba(255,255,255,0.08)'}`,
                                    color: meterType === type ? '#FCD34D' : '#FAFAFA',
                                }}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Meter Number */}
                <div style={styles.card}>
                    <span style={styles.label}>Meter Number</span>
                    <input
                        style={styles.input}
                        placeholder="Enter meter number"
                        value={meterNumber}
                        onChange={e => { setMeterNumber(e.target.value); setCustomer(null); }}
                    />
                    <button onClick={handleVerify} disabled={verifying || !meterNumber} style={styles.verifyBtn}>
                        {verifying ? 'Verifying...' : 'Verify Meter'}
                    </button>
                    {customer && (
                        <div style={styles.custBox}>
                            <div style={styles.custName}>{customer.Customer_Name || customer.name}</div>
                            <div style={styles.custSub}>{customer.Customer_Address || customer.address || disco.toUpperCase()}</div>
                        </div>
                    )}
                </div>

                {/* Amount */}
                <div style={styles.card}>
                    <span style={styles.label}>Amount (₦)</span>
                    <div style={styles.amtGrid}>
                        {QUICK_AMOUNTS.map(amt => (
                            <button
                                key={amt}
                                onClick={() => setAmount(amt)}
                                style={{
                                    ...styles.amtBtn,
                                    background: amount == amt ? 'rgba(251,191,36,0.1)' : 'transparent',
                                    border: `1px solid ${amount == amt ? '#FCD34D' : 'rgba(255,255,255,0.08)'}`,
                                    color: amount == amt ? '#FCD34D' : '#FAFAFA',
                                }}
                            >
                                ₦{amt.toLocaleString()}
                            </button>
                        ))}
                    </div>
                    <input
                        style={{ ...styles.input, marginTop: 8 }}
                        type="number"
                        placeholder="Or enter custom amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>

                {/* Phone */}
                <div style={styles.card}>
                    <span style={styles.label}>Phone Number</span>
                    <input
                        style={styles.input}
                        placeholder="08012345678"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading || !amount || !meterNumber || !phone}
                    style={{ ...styles.submitBtn, opacity: (!amount || !meterNumber || !phone) ? 0.4 : 1 }}
                >
                    {loading ? 'Processing...' : amount ? `Buy ₦${Number(amount).toLocaleString()} Units` : 'Enter amount'}
                </button>
            </div>
        </div>
    );
}