import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buyData, getDataBundles } from '../services/api';

export default function Data() {
    const [form, setForm] = useState({
        network: 'mtn',
        phone_number: '',
        variation_code: ''
    });
    const [bundles, setBundles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bundleLoading, setBundleLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const networks = [
        { value: 'mtn', label: 'MTN', color: 'bg-yellow-400' },
        { value: 'airtel', label: 'Airtel', color: 'bg-red-500' },
        { value: 'glo', label: 'Glo', color: 'bg-green-500' },
        { value: 'etisalat', label: '9mobile', color: 'bg-green-700' },
    ];

    useEffect(() => {
        fetchBundles(form.network);
    }, [form.network]);

    const fetchBundles = async (network) => {
        setBundleLoading(true);
        setBundles([]);
        setForm(prev => ({ ...prev, variation_code: '' }));
        try {
            const response = await getDataBundles(network);
            const variations = response.data?.content?.varations || 
                               response.data?.content?.variations || [];
            setBundles(variations);
        } catch (err) {
            setError('Could not load bundles');
        } finally {
            setBundleLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await buyData(form);
            setSuccess(`Data bundle purchased successfully for ${form.phone_number}!`);
            setForm({ ...form, phone_number: '', variation_code: '' });
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
                <h1 className="text-xl font-bold">Buy Data</h1>
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
                                onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="08012345678"
                                required
                            />
                        </div>

                        {/* Data Bundles */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Bundle
                            </label>
                            {bundleLoading ? (
                                <p className="text-gray-500 text-sm">Loading bundles...</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                    {bundles.map((bundle) => (
                                        <button
                                            key={bundle.variation_code}
                                            type="button"
                                            onClick={() => setForm({ ...form, variation_code: bundle.variation_code })}
                                            className={`p-3 rounded-xl text-left text-sm transition border ${
                                                form.variation_code === bundle.variation_code
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <p className="font-semibold">₦{Number(bundle.variation_amount).toLocaleString()}</p>
                                            <p className="text-xs text-gray-500 mt-1">{bundle.name}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !form.variation_code}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : 'Buy Data'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}