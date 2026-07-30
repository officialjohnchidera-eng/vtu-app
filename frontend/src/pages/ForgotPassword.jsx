import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { forgotPassword } from '../services/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await forgotPassword({ email });
            setSuccess('Password reset link sent! Check your email.');
            setEmail('');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans antialiased text-slate-800 relative overflow-hidden">

            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <div className="absolute top-8 left-8">
                <Link to="/login" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition" />
                    Back to login
                </Link>
            </div>

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex w-12 h-12 bg-emerald-600 rounded-2xl items-center justify-center shadow-lg shadow-emerald-100 mb-4">
                        <span className="text-white font-black text-xl">V</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">Forgot Password?</h1>
                    <p className="text-slate-500 text-sm mt-1">Enter your email and we'll send you a reset link.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                    {success && (
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-3.5 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 p-3.5 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                    <Mail className="w-5 h-5" />
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    disabled={loading}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition placeholder:text-slate-400 disabled:opacity-60"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-500 mt-6 text-sm font-medium">
                    Remembered it?{' '}
                    <Link to="/login" className="text-emerald-600 font-bold hover:underline">
                        Back to login
                    </Link>
                </p>
            </div>
        </div>
    );
}
