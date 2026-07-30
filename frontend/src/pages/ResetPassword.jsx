import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

const styles = {
    page:     { minHeight: '100vh', background: '#0E0E0F', color: '#FAFAFA', fontFamily: "'Geist', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
    card:     { background: '#1C1C1F', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 400 },
    logo:     { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 },
    logoMark: { width: 28, height: 28, borderRadius: 8, background: 'rgba(201,168,76,0.12)', border: '1px solid #C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    logoName: { fontSize: 15, fontWeight: 500 },
    title:    { fontSize: 22, fontWeight: 600, letterSpacing: '-.5px', marginBottom: 6 },
    subtitle: { fontSize: 13, color: 'rgba(250,250,250,0.4)', marginBottom: 24, lineHeight: 1.5 },
    label:    { fontSize: 11, fontFamily: 'monospace', color: 'rgba(250,250,250,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', display: 'block', marginBottom: 8 },
    input:    { width: '100%', background: '#111113', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '12px 14px', color: '#FAFAFA', fontSize: 14, fontFamily: "'Geist', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: 16 },
    btn:      { width: '100%', background: '#C9A84C', color: '#0E0E0F', padding: '13px 0', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none', fontFamily: "'Geist', sans-serif" },
    alert:    { borderRadius: 10, padding: '11px 14px', fontSize: 13, marginBottom: 16 },
    back:     { display: 'block', textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(250,250,250,0.4)', textDecoration: 'none' },
};

export default function ResetPassword() {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ password: '', password2: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await api.post('/auth/reset-password/', {
                uid,
                token,
                password: form.password,
                password2: form.password2
            });
            setSuccess('Password reset successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <div style={styles.logo}>
                    <div style={styles.logoMark}>
                        <i className="ti ti-bolt" style={{ fontSize: 14, color: '#C9A84C' }} />
                    </div>
                    <span style={styles.logoName}>VTU<span style={{ fontStyle: 'italic', color: '#E4C46B' }}>Pro</span></span>
                </div>

                <h1 style={styles.title}>Reset password</h1>
                <p style={styles.subtitle}>Enter your new password below.</p>

                {success && (
                    <div style={{ ...styles.alert, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E' }}>
                        {success} Redirecting to login...
                    </div>
                )}
                {error && (
                    <div style={{ ...styles.alert, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label style={styles.label}>New Password</label>
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Enter new password"
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                        required
                    />
                    <label style={styles.label}>Confirm Password</label>
                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Confirm new password"
                        value={form.password2}
                        onChange={e => setForm({ ...form, password2: e.target.value })}
                        required
                    />
                    <button type="submit" disabled={loading} style={{ ...styles.btn, opacity: loading ? 0.6 : 1 }}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>

                <Link to="/login" style={styles.back}>← Back to login</Link>
            </div>
        </div>
    );
}
