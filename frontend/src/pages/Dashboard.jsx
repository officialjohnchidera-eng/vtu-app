import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getWallet, getTransactions } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [wallet, setWallet] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [walletRes, txRes] = await Promise.all([
                getWallet(),
                getTransactions()
            ]);
            setWallet(walletRes.data);
            setTransactions(txRes.data.slice(0, 5));
        } catch (err) {
            if (err.response?.status === 401) {
                logout();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-blue-600 text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">VTU App</h1>
                <div className="flex items-center gap-4">
                    <span className="text-blue-200">Hello, {user?.username}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto p-6">
                {/* Wallet Card */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-600 rounded-2xl p-6 text-white mb-6">
                    <p className="text-blue-200 text-sm">Wallet Balance</p>
                    <h2 className="text-4xl font-bold mt-1">
                        ₦{Number(wallet?.balance).toLocaleString()}
                    </h2>
                    <div className="mt-4">
                        <Link
                            to="/fund"
                            className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-50 transition"
                        >
                            Fund Wallet
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Link
                        to="/airtime"
                        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center"
                    >
                        <div className="text-4xl mb-2">📱</div>
                        <h3 className="font-semibold text-gray-800">Buy Airtime</h3>
                        <p className="text-gray-500 text-sm mt-1">All networks</p>
                    </Link>

                    <Link
                        to="/data"
                        className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition text-center"
                    >
                        <div className="text-4xl mb-2">🌐</div>
                        <h3 className="font-semibold text-gray-800">Buy Data</h3>
                        <p className="text-gray-500 text-sm mt-1">All networks</p>
                    </Link>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
                        <Link to="/transactions" className="text-blue-600 text-sm hover:underline">
                            View all
                        </Link>
                    </div>

                    {transactions.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No transactions yet</p>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((tx, index) => (
                                <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${tx.type === 'airtime' ? 'bg-green-500' : 'bg-blue-500'}`}>
                                            {tx.type === 'airtime' ? '📱' : '🌐'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 capitalize">{tx.type} - {tx.network.toUpperCase()}</p>
                                            <p className="text-gray-500 text-sm">{tx.phone_number}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">₦{Number(tx.amount).toLocaleString()}</p>
                                        <p className={`text-xs ${tx.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                            {tx.status}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}