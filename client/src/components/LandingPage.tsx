import React, { useState, useEffect } from 'react';
import { Wallet, PieChart, ArrowRightLeft, Check, Globe, Menu, X, ChevronRight, Star, Shield, TrendingUp, Smartphone, Lock } from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 transform -rotate-6">
                                <Wallet className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900 tracking-tight">
                                Taka<span className="text-emerald-500">Track</span>
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-emerald-500 transition-colors">Features</a>
                            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-emerald-500 transition-colors">Pricing</a>
                            <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-emerald-500 transition-colors">Testimonials</a>
                            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-emerald-500 transition-colors">About</a>
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={onGetStarted}
                                className="text-sm font-semibold text-slate-700 hover:text-emerald-500 transition-colors"
                            >
                                Log In
                            </button>
                            <button
                                onClick={onGetStarted}
                                className="px-6 py-2.5 rounded-full bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5"
                            >
                                Sign Up Free
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-4 md:hidden shadow-xl flex flex-col gap-4 animate-fade-in">
                        <a href="#features" className="text-base font-medium text-slate-600 py-2 px-4 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#pricing" className="text-base font-medium text-slate-600 py-2 px-4 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                        <a href="#testimonials" className="text-base font-medium text-slate-600 py-2 px-4 hover:bg-slate-50 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
                        <hr className="border-slate-100" />
                        <button onClick={onGetStarted} className="w-full py-3 text-center font-semibold text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">Log In</button>
                        <button onClick={onGetStarted} className="w-full py-3 text-center font-semibold text-white bg-emerald-500 rounded-lg shadow-md hover:bg-emerald-600 transition-colors">Sign Up Free</button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-emerald-50/50 rounded-full blur-3xl -z-10" />
                    <div className="absolute top-20 right-0 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl -z-10 animate-pulse-slow" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 animate-pulse-slow" />
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-left z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm mb-8 animate-fade-in">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">New Version 3.0 Live</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                                Money management <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                                    made simple & beautiful.
                                </span>
                            </h1>

                            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                                Track expenses, manage loans, and visualize your wealth with the most intuitive finance tracker.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <button
                                    onClick={onGetStarted}
                                    className="px-8 py-4 rounded-full bg-emerald-500 text-white font-bold text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                                >
                                    Get Started Free
                                    <ChevronRight size={20} />
                                </button>
                                <button className="px-8 py-4 rounded-full bg-white text-slate-700 font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 hover:shadow-lg">
                                    <Smartphone size={20} className="text-slate-400" />
                                    Download App
                                </button>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                        </div>
                                    ))}
                                    <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                                        +2k
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex text-yellow-400 gap-0.5">
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                        <Star size={14} fill="currentColor" />
                                    </div>
                                    <span className="font-medium">Loved by 10,000+ users</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative lg:h-[700px] flex items-center justify-center perspective-1000">
                            {/* App Mockup */}
                            <div className="relative w-[320px] sm:w-[360px] transform rotate-[-6deg] hover:rotate-0 transition-all duration-700 ease-out z-20">
                                <div className="relative bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden aspect-[9/19.5]">
                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-2xl z-20" />

                                    {/* Screen Content */}
                                    <div className="h-full w-full bg-slate-50 pt-14 px-5 pb-6 flex flex-col font-sans">
                                        {/* Header */}
                                        <div className="flex justify-between items-center mb-8">
                                            <div>
                                                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Total Balance</div>
                                                <div className="text-3xl font-bold text-slate-900">$24,500.00</div>
                                            </div>
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <Wallet size={20} className="text-emerald-600" />
                                            </div>
                                        </div>

                                        {/* Chart Area */}
                                        <div className="h-40 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl mb-8 p-5 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden">
                                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                                            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-black/10 rounded-full blur-xl" />

                                            <div className="flex justify-between mb-4 relative z-10">
                                                <span className="text-sm font-medium opacity-90">Weekly Spending</span>
                                                <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded-lg">+12%</span>
                                            </div>
                                            <div className="h-20 flex items-end gap-2 relative z-10">
                                                {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-white/30 rounded-t-md transition-all hover:bg-white/50 cursor-pointer" style={{ height: `${h}%` }} />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Recent Transactions */}
                                        <div className="flex-1 bg-white rounded-3xl p-1 shadow-sm border border-slate-100 overflow-hidden">
                                            <div className="flex justify-between items-center p-4 pb-2">
                                                <div className="text-base font-bold text-slate-900">Transactions</div>
                                                <div className="text-xs font-bold text-emerald-600 cursor-pointer">See All</div>
                                            </div>
                                            <div className="space-y-1">
                                                {[1, 2, 3, 4].map((i) => (
                                                    <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${i % 2 === 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-orange-50 text-orange-500'}`}>
                                                            {i % 2 === 0 ? <TrendingUp size={20} /> : <ArrowRightLeft size={20} />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-sm font-bold text-slate-900">{i % 2 === 0 ? 'Salary Deposit' : 'Grocery Store'}</div>
                                                            <div className="text-xs text-slate-400">Today, 10:00 AM</div>
                                                        </div>
                                                        <div className={`text-sm font-bold ${i % 2 === 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                                                            {i % 2 === 0 ? '+$4,500' : '-$124.50'}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute top-24 -right-16 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-float z-30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <Check size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Loan Repaid</div>
                                            <div className="text-sm font-bold text-slate-900">+$500.00</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-32 -left-12 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-float z-30" style={{ animationDelay: '1.5s' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Lock size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500">Secure Save</div>
                                            <div className="text-sm font-bold text-slate-900">Encrypted</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-emerald-600 font-bold tracking-wide uppercase text-sm mb-3">Features</h2>
                        <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Everything you need to grow</h3>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Powerful tools to help you manage your personal finances with ease and precision.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Wallet className="text-white" />}
                            color="bg-emerald-500"
                            title="Smart Wallets"
                            description="Manage multiple accounts including bank, cash, and credit cards in one unified view."
                        />
                        <FeatureCard
                            icon={<ArrowRightLeft className="text-white" />}
                            color="bg-blue-500"
                            title="Loan Tracking"
                            description="Keep track of money lent and borrowed. Never forget a debt again with automated reminders."
                        />
                        <FeatureCard
                            icon={<PieChart className="text-white" />}
                            color="bg-violet-500"
                            title="Visual Analytics"
                            description="Understand your spending habits with beautiful, interactive charts and reports."
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-emerald-600 font-bold tracking-wide uppercase text-sm mb-3">Pricing</h2>
                        <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Simple, transparent pricing</h3>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Start for free, upgrade when you need more power.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Plan */}
                        <PricingCard
                            title="Starter"
                            price="$0"
                            description="Perfect for getting started"
                            features={['2 Wallets', '50 Transactions/mo', 'Basic Analytics', 'Email Support']}
                            onGetStarted={onGetStarted}
                        />
                        {/* Pro Plan */}
                        <PricingCard
                            title="Pro"
                            price="$9"
                            description="For serious money managers"
                            features={['Unlimited Wallets', 'Unlimited Transactions', 'Advanced Analytics', 'Loan Tracking', 'Priority Support']}
                            isPopular
                            onGetStarted={onGetStarted}
                        />
                        {/* Enterprise Plan */}
                        <PricingCard
                            title="Business"
                            price="$29"
                            description="For small teams and businesses"
                            features={['Everything in Pro', 'Team Members', 'API Access', 'Custom Reports', 'Dedicated Manager']}
                            onGetStarted={onGetStarted}
                        />
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 bg-slate-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold mb-12 opacity-80">Trusted by modern finance teams</h2>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Stripe', 'Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((brand) => (
                            <span key={brand} className="text-2xl font-bold hover:opacity-100 transition-opacity cursor-default">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                    <Wallet className="text-white w-4 h-4" />
                                </div>
                                <span className="text-xl font-bold text-slate-900">TakaTrack</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                Making personal finance management accessible, smart, and stress-free for everyone.
                            </p>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 transition-colors cursor-pointer">
                                    <Globe size={16} />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-emerald-100 hover:text-emerald-600 transition-colors cursor-pointer">
                                    <Shield size={16} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
                            <ul className="space-y-4 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Security</a></li>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Updates</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
                            <ul className="space-y-4 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
                            <ul className="space-y-4 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-500">© 2025 Taka Track. All rights reserved.</p>
                        <div className="flex gap-2 items-center text-sm text-slate-500">
                            <span>Made with</span>
                            <Star size={12} className="text-emerald-500 fill-emerald-500" />
                            <span>for better finance</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) => (
    <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group">
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
);

const PricingCard = ({ title, price, description, features, isPopular, onGetStarted }: any) => (
    <div className={`p-8 rounded-3xl border ${isPopular ? 'border-emerald-500 bg-white ring-4 ring-emerald-500/10 shadow-xl' : 'border-slate-200 bg-white shadow-lg'} relative flex flex-col transition-transform hover:-translate-y-2 duration-300`}>
        {isPopular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wide rounded-full shadow-lg">
                Most Popular
            </div>
        )}
        <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-extrabold text-slate-900">{price}</span>
                <span className="text-slate-500">/month</span>
            </div>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
        <ul className="space-y-4 mb-8 flex-1">
            {features.map((feature: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-emerald-600" />
                    </div>
                    {feature}
                </li>
            ))}
        </ul>
        <button
            onClick={onGetStarted}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${isPopular
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
        >
            Choose {title}
        </button>
    </div>
);

export default LandingPage;
