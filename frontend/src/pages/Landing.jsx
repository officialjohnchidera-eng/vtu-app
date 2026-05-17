import { Link } from 'react-router-dom';

export default function Landing() {
    const features = [
        { icon: '📱', title: 'Buy Airtime', desc: 'Instant airtime for all networks — MTN, Airtel, Glo, 9mobile' },
        { icon: '🌐', title: 'Buy Data', desc: 'Affordable data bundles for all Nigerian networks' },
        { icon: '⚡', title: 'Instant Delivery', desc: 'Transactions processed in seconds, 24/7' },
        { icon: '🔒', title: 'Secure Payments', desc: 'Powered by Paystack — Nigeria\'s most trusted payment gateway' },
        { icon: '💰', title: 'Best Rates', desc: 'Competitive prices on all airtime and data purchases' },
        { icon: '📊', title: 'Transaction History', desc: 'Track all your purchases in one place' },
    ];

    const networks = ['MTN', 'Airtel', 'Glo', '9mobile'];

    const steps = [
        { step: '01', title: 'Create Account', desc: 'Sign up in less than 2 minutes' },
        { step: '02', title: 'Fund Wallet', desc: 'Add money securely via Paystack' },
        { step: '03', title: 'Buy & Enjoy', desc: 'Purchase airtime or data instantly' },
    ];

    return (
        <div className="min-h-screen bg-white">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">Sub</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900"><span className="text-blue-600"></span></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
                            Sign In
                        </Link>
                        <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full opacity-10 translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-blue-800/50 text-blue-200 px-4 py-2 rounded-full text-sm mb-6 border border-blue-700">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Fast • Reliable • Secure
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                        Buy Airtime & Data
                        <span className="text-blue-300"> Instantly</span>
                    </h1>

                    <p className="text-blue-200 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                        The fastest and most reliable platform to purchase airtime and data for all Nigerian networks. 
                        Top up in seconds, anytime, anywhere.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg">
                            Start For Free →
                        </Link>
                        <Link to="/login" className="border-2 border-blue-400 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition">
                            Sign In
                        </Link>
                    </div>

                    {/* Network badges */}
                    <div className="flex justify-center gap-3 mt-12">
                        {networks.map((n) => (
                            <span key={n} className="bg-blue-800/50 text-blue-200 px-4 py-2 rounded-lg text-sm font-medium border border-blue-700">
                                {n}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-blue-600">
                <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
                    <div>
                        <p className="text-4xl font-bold text-white">10K+</p>
                        <p className="text-blue-200 mt-1">Happy Users</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-white">99.9%</p>
                        <p className="text-blue-200 mt-1">Uptime</p>
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-white">4</p>
                        <p className="text-blue-200 mt-1">Networks Supported</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
                        <p className="text-gray-500 text-lg max-w-xl mx-auto">
                            A complete platform for all your airtime and data needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition border border-gray-100">
                                <div className="text-4xl mb-4">{f.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-gray-500 text-lg">Get started in 3 simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    {s.step}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                                <p className="text-gray-500">{s.desc}</p>
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute mt-8 text-gray-300 text-2xl">→</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-br from-blue-950 to-blue-700">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
                    <p className="text-blue-200 text-lg mb-8">
                        Join thousands of Nigerians buying airtime and data at the best rates.
                    </p>
                    <Link to="/register" className="bg-white text-blue-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg">
                        Create Free Account →
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 px-6 py-8">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                            <span className="text-white font-bold text-xs">V</span>
                        </div>
                        <span className="font-bold text-white">VTUApp</span>
                    </div>
                    <p className="text-sm">© 2026 VTUApp. All rights reserved.</p>
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="hover:text-white transition">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition">Terms of Service</a>
                        <a href="#" className="hover:text-white transition">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}