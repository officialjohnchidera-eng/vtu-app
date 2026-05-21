import { Link } from 'react-router-dom';
import { 
  Phone, 
  Wifi, 
  Zap, 
  Lock, 
  Tv, 
  BookOpen, 
  TrendingUp, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export default function Landing() {
    const features = [
        { 
            icon: <Phone className="w-6 h-6 text-yellow-500" />, 
            title: 'Instant Airtime Top-up', 
            desc: 'Get immediate value across MTN, Airtel, Glo, and 9mobile with zero delays.' 
        },
        { 
            icon: <Wifi className="w-6 h-6 text-emerald-500" />, 
            title: 'Cheap Data Bundles', 
            desc: 'Access SME, Gifting, and Corporate data bundles at heavy discounts from market rates.' 
        },
        { 
            icon: <Zap className="w-6 h-6 text-amber-500" />, 
            title: 'Electricity Bills', 
            desc: 'Pay for both prepaid and postpaid meters easily (IKEDC, EKEDC, AEDC, KEDCO, etc).' 
        },
        { 
            icon: <Tv className="w-6 h-6 text-indigo-500" />, 
            title: 'Cable TV Subscription', 
            desc: 'Renew your DStv, GOtv, and StarTimes packages instantly without missing your favorite shows.' 
        },
        { 
            icon: <BookOpen className="w-6 h-6 text-purple-500" />, 
            title: 'Exam Result Checkers', 
            desc: 'Purchase WAEC, NECO, and JAMB e-pins securely at affordable wholesale rates.' 
        },
        { 
            icon: <TrendingUp className="w-6 h-6 text-blue-600" />, 
            title: 'Reseller API & Margins', 
            desc: 'Want to make money? Start your own VTU business with our automated, fast backend API.' 
        },
    ];

    const steps = [
        { step: '01', title: 'Create a Free Account', desc: 'Sign up securely with just your basic details in under a minute.' },
        { step: '02', title: 'Fund Your Wallet', desc: 'Get a dedicated personal bank account automatically assigned to you for instant funding.' },
        { step: '03', title: 'Transact & Save', desc: 'Buy any product at cheaper rates and watch transactions deliver in split seconds.' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
                            <span className="text-white font-extrabold text-lg">V</span>
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900">
                            VTU<span className="text-emerald-600">Express</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-slate-600 hover:text-emerald-600 font-semibold transition">
                            Sign In
                        </Link>
                        <Link to="/register" className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-36 pb-24 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 relative overflow-hidden">
                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-300 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-8 border border-emerald-500/20">
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                        Fully Automated VTU Platform
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
                        Cheapest Data, Airtime & <br className="hidden md:inline" />
                        Bills Delivered <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Instantly</span>
                    </h1>

                    <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-3xl mx-auto leading-relaxed font-normal">
                        Empowering thousands of Nigerians and resellers with fast, reliable utility bills, 
                        cheap data bundles, and automatic wallet funding. Powered by trusted, bulletproof security.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/register" className="w-full sm:w-auto bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-400 transition transform hover:-translate-y-0.5 shadow-xl shadow-emerald-900/30">
                            Create Free Account
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto border border-slate-700 bg-slate-900/40 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition backdrop-blur-sm">
                            Developer API
                        </Link>
                    </div>

                    {/* Network Badges Showcase */}
                    <div className="mt-16 pt-8 border-t border-slate-800/60">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Supported Networks</p>
                        <div className="flex flex-wrap justify-center items-center gap-4">
                            <span className="bg-amber-400/10 border border-amber-400/20 text-amber-400 px-4 py-2 rounded-xl text-xs font-black tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span> MTN
                            </span>
                            <span className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-xs font-black tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span> AIRTEL
                            </span>
                            <span className="bg-lime-500/10 border border-lime-500/20 text-lime-400 px-4 py-2 rounded-xl text-xs font-black tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-lime-500"></span> GLO
                            </span>
                            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-black tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 9MOBILE
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Badges / Stats */}
            <section className="py-12 bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <Clock className="w-5 h-5" />
                            <p className="text-3xl font-extrabold text-slate-950">99.9%</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Automated Uptime</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <ShieldCheck className="w-5 h-5" />
                            <p className="text-3xl font-extrabold text-slate-950">₦0 Charge</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">On Wallet Funding</p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="flex items-center gap-2 text-emerald-600 mb-1">
                            <Lock className="w-5 h-5" />
                            <p className="text-3xl font-extrabold text-slate-950">PCIDSS</p>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Secure Payment Gateways</p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Services Built For Quick Value
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                            Whether you are a retail user purchasing data for personal consumption or a business tycoon running an API network, we serve you with speed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 border border-slate-100/80 group">
                                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-6 bg-white relative">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                            Start Transacting In 3 Steps
                        </h2>
                        <p className="text-slate-500 text-lg">No tedious configurations required.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {steps.map((s, i) => (
                            <div key={i} className="relative flex flex-col items-center text-center group">
                                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl font-black mb-6 border border-emerald-100 shadow-inner group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                                    {s.step}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{s.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-br from-emerald-900 to-slate-950 relative">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                        Never Run Out of Airtime or Data Again
                    </h2>
                    <p className="text-emerald-200/80 text-lg mb-8 max-w-xl mx-auto">
                        Join thousands of smart Nigerians choosing instant delivery and best profit margins.
                    </p>
                    <Link to="/register" className="inline-block bg-white text-slate-950 px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition transform hover:-translate-y-0.5 shadow-xl">
                        Create Your Account Now
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 px-6 py-12 border-t border-slate-900">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-sm">V</span>
                        </div>
                        <span className="font-extrabold text-white tracking-tight">VTUExpress</span>
                    </div>
                    <p className="text-xs text-slate-500">© 2026 VTUExpress. Fully licensed by NCC guidelines. Securely processed.</p>
                    <div className="flex gap-6 text-xs font-semibold">
                        <a href="#" className="hover:text-white transition">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition">Terms of Service</a>
                        <a href="#" className="hover:text-white transition">WhatsApp Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

```