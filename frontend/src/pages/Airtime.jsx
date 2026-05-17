import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { buyAirtime } from '../services/api';

export default function Airtime() {
    const [form, setForm] = useState({
        network: 'mtn',
        phone_number: '',
        amount: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const networks = [
        { value: 'mtn', label: 'MTN', color: 'bg-yellow-400' },
        { value: 'airtel', label: 'Airtel', color: 'bg-red-500' },
        { value: 'glo', label: 'Glo', color: 'bg-green-500' },
        { value: 'etisalat', label: '9mobile', color: 'bg-green-700' },
    ];

    const quickAmounts = [50, 100, 200, 500, 1000, 2000];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await buyAirtime(form);
            setSuccess(`₦${form.amount} airtime sent to ${form.phone_number} successfully!`);
            setForm({ ...form, phone_number: '', amount: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Transaction failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-blue-900 text-white px-6 py-4 flex items-center gap-4">
                <Link to="/dashboard" className="text-blue-200 hover:text-white">← Back</Link>
                <h1 className="text-xl font-bold">Buy Airtime</h1>
            </nav>

            <div className="max-w-md mx-auto p-6">
                <div className="bg-white rounded-2xl shadow-sm p-6">

                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Network Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Network
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {networks.map((net) => (
                                    <button
                                        key={net.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, network: net.value })}
                                        className={`py-3 rounded-xl text-sm font-semibold transition ${
                                            form.network === net.value
                                                ? `${net.color} text-white shadow-md`
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {net.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="phone_number"
                                value={form.phone_number}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="08012345678"
                                required
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount (₦)
                            </label>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {quickAmounts.map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => setForm({ ...form, amount: amt })}
                                        className={`py-2 rounded-lg text-sm font-medium transition ${
                                            form.amount == amt
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        ₦{amt}
                                    </button>
                                ))}
                            </div>
                            <input
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Or enter custom amount"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : `Buy Airtime`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}