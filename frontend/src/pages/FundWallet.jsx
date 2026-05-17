import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fundWallet } from '../services/api';

export default function FundWallet() {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await fundWallet({ amount });
            const { payment_url, reference } = response.data;
            
            localStorage.setItem('payment_reference', reference);

            const newWindow = window.open('', '_blank');
            if (newWindow) {
                newWindow.location.href = payment_url;
            } else {
                window.location.href = payment_url;
            }

        } catch (err) {
            setError(err.response?.data?.error || 'Could not initialize payment. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-blue-900 text-white px-6 py-4 flex items-center gap-4">
                <Link to="/dashboard" className="text-blue-200 hover:text-white">← Back</Link>
                <h1 className="text-xl font-bold">Fund Wallet</h1>
            </nav>

            <div className="max-w-md mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Amount (₦)
                            </label>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {quickAmounts.map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setAmount(amt)}
                                        className={`py-3 rounded-xl text-sm font-semibold transition ${
                                            amount == amt
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        ₦{amt.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Or enter custom amount"
                                required
                            />
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                            <p>💳 You will be redirected to Paystack to complete your payment securely.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !amount}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Initializing...' : `Fund ₦${Number(amount).toLocaleString() || '0'}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}