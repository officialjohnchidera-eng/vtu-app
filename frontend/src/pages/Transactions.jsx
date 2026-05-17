import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTransactions } from '../services/api';

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await getTransactions();
            setTransactions(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-blue-900 text-white px-6 py-4 flex items-center gap-4">
                <Link to="/dashboard" className="text-blue-200 hover:text-white">← Back</Link>
                <h1 className="text-xl font-bold">Transaction History</h1>
            </nav>

            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    {loading ? (
                        <p className="text-center text-gray-500 py-8">Loading...</p>
                    ) : transactions.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No transactions yet</p>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((tx, index) => (
                                <div key={index} className="flex justify-between items-center py-4 border-b last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                                            tx.type === 'airtime' ? 'bg-green-100' : 'bg-blue-100'
                                        }`}>
                                            {tx.type === 'airtime' ? '📱' : '🌐'}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 capitalize">
                                                {tx.type} - {tx.network.toUpperCase()}
                                            </p>
                                            <p className="text-gray-500 text-sm">{tx.phone_number}</p>
                                            <p className="text-gray-400 text-xs">
                                                {new Date(tx.created_at).toLocaleDateString('en-NG', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">
                                            ₦{Number(tx.amount).toLocaleString()}
                                        </p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            tx.status === 'success'
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-red-100 text-red-600'
                                        }`}>
                                            {tx.status}
                                        </span>
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