import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWallet, getTransactions } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const SERVICES = [
    { key: 'airtime',  label: 'Airtime',         desc: 'All networks',          icon: 'ti-device-mobile', color: '#22C55E',  bg: 'rgba(34,197,94,0.1)',     to: '/airtime',  live: true  },
    { key: 'data',     label: 'Data',             desc: 'Bundles & plans',       icon: 'ti-wifi',          color: '#C9A84C',  bg: 'rgba(201,168,76,0.12)',   to: '/data',     live: true  },
    { key: 'cable', label: 'Cable TV', desc: 'DSTV · GOTV · Startimes', icon: 'ti-device-tv', color: '#A78BFA', bg: 'rgba(139,92,246,0.12)', to: '/cable', live: true },
    { key: 'elect',    label: 'Electricity',      desc: 'Buy units / token',     icon: 'ti-plug',          color: '#FCD34D',  bg: 'rgba(251,191,36,0.1)',    to: null,        live: false },
    { key: 'result',   label: 'Result checker',   desc: 'WAEC · NECO · NABTEB',  icon: 'ti-certificate',  color: '#63A2FF',  bg: 'rgba(99,162,255,0.12)',   to: null,        live: false, isNew: true },
    { key: 'exampin',  label: 'Exam PIN',         desc: 'Scratch card PIN',      icon: 'ti-id-badge',      color: '#FB7185',  bg: 'rgba(251,113,133,0.12)', to: null,        live: false },
    { key: 'transfer', label: 'Transfer',         desc: 'Send to wallet',        icon: 'ti-send',          color: '#34D399',  bg: 'rgba(52,211,153,0.1)',    to: null,        live: false },
    { key: 'more',     label: 'More',             desc: 'Coming soon',           icon: 'ti-grid-dots',     color: 'rgba(250,250,250,0.28)', bg: 'rgba(255,255,255,0.06)', to: null, live: false },
];

const TX_ICON = {
    airtime:  { icon: 'ti-device-mobile', color: '#22C55E',  bg: 'rgba(34,197,94,0.1)'       },
    data:     { icon: 'ti-wifi',          color: '#C9A84C',  bg: 'rgba(201,168,76,0.12)'     },
    cable:    { icon: 'ti-device-tv',     color: '#A78BFA',  bg: 'rgba(139,92,246,0.12)'     },
    elect:    { icon: 'ti-plug',          color: '#FCD34D',  bg: 'rgba(251,191,36,0.1)'      },
    result:   { icon: 'ti-certificate',   color: '#63A2FF',  bg: 'rgba(99,162,255,0.12)'     },
};

const styles = {
    page:       { minHeight: '100vh', background: '#0E0E0F', color: '#FAFAFA', fontFamily: "'Geist', sans-serif", fontSize: 14 },
    nav:        { background: '#161618', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 28px', height: 56 },
    logoWrap:   { display: 'flex', alignItems: 'center', gap: 10 },
    logoMark:   { width: 28, height: 28, borderRadius: 8, background: 'rgba(201,168,76,0.12)', border: '1px solid #C9A84C', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    logoName:   { fontSize: 15, fontWeight: 500, letterSpacing: '-.3px' },
    navR:       { display: 'flex', alignItems: 'center', gap: 16 },
    avatar:     { width: 32, height: 32, borderRadius: '50%', background: '#242428', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500, color: 'rgba(250,250,250,0.55)' },
    navName:    { fontSize: 13, color: 'rgba(250,250,250,0.55)', fontFamily: 'monospace' },
    navBtn:     { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(250,250,250,0.4)', fontSize: 12, fontFamily: 'monospace', padding: '6px 14px', borderRadius: 6, cursor: 'pointer' },
    body:       { maxWidth: 680, margin: '0 auto', padding: '28px 24px 48px' },

    wallet:     { background: '#1C1C1F', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 28, marginBottom: 20 },
    eyebrow:    { fontSize: 10, fontFamily: 'monospace', color: 'rgba(250,250,250,0.28)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 },
    balAmt:     { fontSize: 44, fontWeight: 300, letterSpacing: -3, lineHeight: 1, color: '#FAFAFA' },
    balSup:     { fontSize: 18, fontWeight: 400, verticalAlign: 'super', opacity: .6, marginRight: 1 },
    badge:      { display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: '5px 12px' },
    badgeDot:   { width: 6, height: 6, borderRadius: '50%', background: '#22C55E' },
    badgeTxt:   { fontSize: 11, fontFamily: 'monospace', color: '#22C55E' },
    divider:    { height: 1, background: 'rgba(255,255,255,0.06)', margin: '22px 0' },
    walletFoot: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    acctLbl:    { fontSize: 10, fontFamily: 'monospace', color: 'rgba(250,250,250,0.28)', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 3 },
    acctVal:    { fontSize: 13, fontFamily: 'monospace', color: 'rgba(250,250,250,0.55)' },
    fundBtn:    { display: 'flex', alignItems: 'center', gap: 8, background: '#C9A84C', color: '#0E0E0F', fontSize: 13, fontWeight: 600, padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: "'Geist', sans-serif", textDecoration: 'none' },

    stats:      { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 },
    stat:       { background: '#1C1C1F', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 18px' },
    statLbl:    { fontSize: 10, color: 'rgba(250,250,250,0.28)', fontFamily: 'monospace', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
    statVal:    { fontSize: 20, fontWeight: 500, letterSpacing: -.5 },
    statSub:    { fontSize: 11, color: 'rgba(250,250,250,0.28)', marginTop: 3, fontFamily: 'monospace' },

    secHead:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    secTitle:   { fontSize: 11, fontFamily: 'monospace', color: 'rgba(250,250,250,0.28)', letterSpacing: 2, textTransform: 'uppercase' },

    grid:       { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 },
    svc:        { background: '#1C1C1F', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px 12px 16px', cursor: 'pointer', textAlign: 'center', position: 'relative', textDecoration: 'none', color: 'inherit', display: 'block' },
    svcIco:     { width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
    svcName:    { fontSize: 12, fontWeight: 500, marginBottom: 2, letterSpacing: '-.2px' },
    svcDesc:    { fontSize: 10, color: 'rgba(250,250,250,0.28)', fontFamily: 'monospace' },
    svcNew:     { position: 'absolute', top: 10, right: 10, background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)', color: '#C9A84C', fontSize: 9, fontFamily: 'monospace', padding: '1px 6px', borderRadius: 4, letterSpacing: .5 },
    svcStatic:  { opacity: 0.55 },

    txWrap:     { background: '#1C1C1F', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden' },
    txHead:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    txTitle:    { fontSize: 14, fontWeight: 500, letterSpacing: '-.2px' },
    txLink:     { fontSize: 11, fontFamily: 'monospace', color: '#C9A84C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 },
    txRow:      { display: 'flex', alignItems: 'center', padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    txIco:      { width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: 13 },
    txName:     { fontSize: 13, fontWeight: 500, marginBottom: 2, textTransform: 'capitalize' },
    txMeta:     { fontSize: 11, color: 'rgba(250,250,250,0.28)', fontFamily: 'monospace' },
    txAmt:      { fontSize: 13, fontWeight: 500, fontFamily: 'monospace', marginBottom: 4, textAlign: 'right' },
    pillOk:     { display: 'inline-block', fontSize: 10, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 4, letterSpacing: .5, background: 'rgba(34,197,94,0.12)', color: '#22C55E' },
    pillFail:   { display: 'inline-block', fontSize: 10, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 4, letterSpacing: .5, background: 'rgba(239,68,68,0.1)', color: '#EF4444' },

    loading:    { minHeight: '100vh', background: '#0E0E0F', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    loadTxt:    { fontSize: 15, fontFamily: 'monospace', color: '#C9A84C', letterSpacing: 1 },

    empty:      { fontSize: 13, color: 'rgba(250,250,250,0.28)', textAlign: 'center', padding: '24px 0', fontFamily: 'monospace' },
};

function getInitials(username = '') {
    return username.slice(0, 2).toUpperCase();
}

function getTxStyle(type) {
    return TX_ICON[type] || TX_ICON.airtime;
}

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [walletRes, txRes] = await Promise.all([getWallet(), getTransactions()]);
            setWallet(walletRes.data);
            setTransactions(txRes.data.slice(0, 5));
        } catch (err) {
            if (err.response?.status === 401) { logout(); navigate('/login'); }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    if (loading) {
        return (
            <div style={styles.loading}>
                <span style={styles.loadTxt}>Loading...</span>
            </div>
        );
    }

    const totalSpent = transactions.reduce((s, t) => s + (t.status === 'success' ? Number(t.amount) : 0), 0);
    const successCount = transactions.filter(t => t.status === 'success').length;

    return (
        <div style={styles.page}>
            {/* Nav */}
            <nav style={styles.nav}>
                <div style={styles.logoWrap}>
                    <div style={styles.logoMark}>
                        <i className="ti ti-bolt" style={{ fontSize: 14, color: '#C9A84C' }} aria-hidden="true" />
                    </div>
                    <span style={styles.logoName}>
                        VTU<span style={{ fontStyle: 'italic', color: '#E4C46B' }}>Pro</span>
                    </span>
                </div>
                <div style={styles.navR}>
                    <div style={styles.avatar}>{getInitials(user?.username)}</div>
                    <span style={styles.navName}>@{user?.username}</span>
                    <button onClick={handleLogout} style={styles.navBtn}>Sign out</button>
                </div>
            </nav>

            <div style={styles.body}>
                {/* Wallet */}
                <div style={styles.wallet}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                        <div>
                            <div style={styles.eyebrow}>Wallet balance</div>
                            <div style={styles.balAmt}>
                                <sup style={styles.balSup}>₦</sup>
                                {Number(wallet?.balance).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div style={styles.badge}>
                            <div style={styles.badgeDot} />
                            <span style={styles.badgeTxt}>Active</span>
                        </div>
                    </div>
                    <div style={styles.divider} />
                    <div style={styles.walletFoot}>
                        <div>
                            <div style={styles.acctLbl}>Account</div>
                            <div style={styles.acctVal}>{user?.username?.toUpperCase()}</div>
                        </div>
                        <Link to="/fund" style={styles.fundBtn}>
                            <i className="ti ti-plus" style={{ fontSize: 15 }} aria-hidden="true" />
                            Fund wallet
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div style={styles.stats}>
                    <div style={styles.stat}>
                        <div style={styles.statLbl}>Recent spend</div>
                        <div style={styles.statVal}>₦{totalSpent.toLocaleString()}</div>
                        <div style={styles.statSub}>last 5 transactions</div>
                    </div>
                    <div style={styles.stat}>
                        <div style={styles.statLbl}>Success rate</div>
                        <div style={styles.statVal}>
                            {transactions.length ? Math.round((successCount / transactions.length) * 100) : 0}%
                        </div>
                        <div style={styles.statSub}>{successCount} of {transactions.length} ok</div>
                    </div>
                    <div style={styles.stat}>
                        <div style={styles.statLbl}>Services</div>
                        <div style={styles.statVal}>2 live</div>
                        <div style={styles.statSub}>6 coming soon</div>
                    </div>
                </div>

                {/* Services */}
                <div style={styles.secHead}>
                    <span style={styles.secTitle}>Services</span>
                </div>
                <div style={styles.grid}>
                    {SERVICES.map(svc => {
                        const inner = (
                            <>
                                <div style={{ ...styles.svcIco, background: svc.bg }}>
                                    <i className={`ti ${svc.icon}`} style={{ fontSize: 20, color: svc.color }} aria-hidden="true" />
                                </div>
                                <div style={styles.svcName}>{svc.label}</div>
                                <div style={styles.svcDesc}>{svc.desc}</div>
                                {svc.isNew && <span style={styles.svcNew}>New</span>}
                            </>
                        );
                        if (svc.live && svc.to) {
                            return (
                                <Link key={svc.key} to={svc.to} style={styles.svc}>
                                    {inner}
                                </Link>
                            );
                        }
                        return (
                            <div key={svc.key} style={{ ...styles.svc, ...styles.svcStatic, cursor: 'default' }}>
                                {inner}
                            </div>
                        );
                    })}
                </div>

                {/* Transactions */}
                <div style={styles.secHead}>
                    <span style={styles.secTitle}>Recent transactions</span>
                </div>
                <div style={styles.txWrap}>
                    <div style={styles.txHead}>
                        <span style={styles.txTitle}>History</span>
                        <Link to="/transactions" style={styles.txLink}>
                            View all <i className="ti ti-arrow-right" style={{ fontSize: 12 }} aria-hidden="true" />
                        </Link>
                    </div>

                    {transactions.length === 0 ? (
                        <p style={styles.empty}>No transactions yet</p>
                    ) : (
                        transactions.map((tx, i) => {
                            const t = getTxStyle(tx.type);
                            const isLast = i === transactions.length - 1;
                            return (
                                <div key={i} style={{ ...styles.txRow, borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ ...styles.txIco, background: t.bg }}>
                                        <i className={`ti ${t.icon}`} style={{ fontSize: 16, color: t.color }} aria-hidden="true" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={styles.txName}>{tx.type} — {tx.network?.toUpperCase()}</div>
                                        <div style={styles.txMeta}>{tx.phone_number}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={styles.txAmt}>–₦{Number(tx.amount).toLocaleString()}</div>
                                        <span style={tx.status === 'success' ? styles.pillOk : styles.pillFail}>
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}