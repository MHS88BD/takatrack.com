import React, { useState, useEffect } from 'react';
import { Wallet, PieChart, ArrowRightLeft, Check, Globe, Menu, X, ChevronRight, Star, Shield } from 'lucide-react';

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
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Wallet className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900 tracking-tight">
                                Taka<span className="text-blue-600">Track</span>
                            </span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
                            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
                            <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Testimonials</a>
                            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About</a>
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={onGetStarted}
                                className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                            >
                                Log In
                            </button>
                            <button
                                onClick={onGetStarted}
                                className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-0.5"
                            >
                                Sign Up Free
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-slate-600"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border-b border-slate-100 p-4 md:hidden shadow-xl flex flex-col gap-4 animate-fade-in">
                        <a href="#features" className="text-base font-medium text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#pricing" className="text-base font-medium text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                        <a href="#testimonials" className="text-base font-medium text-slate-600 py-2" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
                        <hr className="border-slate-100" />
                        <button onClick={onGetStarted} className="w-full py-3 text-center font-semibold text-slate-700 bg-slate-50 rounded-lg">Log In</button>
                        <button onClick={onGetStarted} className="w-full py-3 text-center font-semibold text-white bg-blue-600 rounded-lg shadow-md">Sign Up Free</button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-left z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">New Version 2.0</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                                Master your money <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                                    without the stress.
                                </span>
                            </h1>

                            <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-lg">
                                The smart way to track expenses, manage loans, and grow your wealth. Join thousands of users achieving financial freedom today.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={onGetStarted}
                                    className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center justify-center gap-2"
                                >
                                    Get Started Now
                                    <ChevronRight size={20} />
                                </button>
                                <button className="px-8 py-4 rounded-full bg-white text-slate-700 font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                    <Globe size={20} className="text-slate-400" />
                                    Live Demo
                                </button>
                            </div>

                            <div className="mt-10 flex items-center gap-4 text-sm text-slate-500">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex text-yellow-400">
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                        <Star size={12} fill="currentColor" />
                                    </div>
                                    <span>Loved by 10,000+ users</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative lg:h-[600px] flex items-center justify-center">
                            {/* Abstract Background Shapes */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-blue-50 to-violet-50 rounded-full blur-3xl -z-10" />

                            {/* App Mockup */}
                            <div className="relative w-full max-w-md mx-auto transform rotate-[-5deg] hover:rotate-0 transition-all duration-700">
                                <div className="relative bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden aspect-[9/19]">
                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-20" />

                                    {/* Screen Content */}
                                    <div className="h-full w-full bg-slate-50 pt-12 px-4 pb-4 flex flex-col">
                                        {/* Header */}
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <div className="text-xs text-slate-400">Total Balance</div>
                                                <div className="text-2xl font-bold text-slate-900">$24,500.00</div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Wallet size={16} className="text-blue-600" />
                                            </div>
                                        </div>

                                        {/* Chart Area */}
                                        <div className="h-32 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl mb-6 p-4 text-white shadow-lg shadow-blue-500/20">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-xs opacity-80">Spending</span>
                                                <span className="text-xs font-bold">+12%</span>
                                            </div>
                                            <div className="h-16 flex items-end gap-2">
                                                {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                                    <div key={i} className="flex-1 bg-white/20 rounded-t-sm" style={{ height: `${h}%` }} />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Recent Transactions */}
                                        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                                            <div className="text-sm font-bold text-slate-900 mb-4">Recent Activity</div>
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex items-center gap-3 mb-4 last:mb-0">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i === 1 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                                        {i === 1 ? <ArrowRightLeft size={18} /> : <Wallet size={18} />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-medium text-slate-900">{i === 1 ? 'Netflix Subscription' : 'Salary Deposit'}</div>
                                                        <div className="text-xs text-slate-400">Today, 10:00 AM</div>
                                                    </div>
                                                    <div className={`text-sm font-bold ${i === 1 ? 'text-slate-900' : 'text-green-600'}`}>
                                                        {i === 1 ? '-$14.99' : '+$4,500'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute top-20 -right-12 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-float">
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-2">Features</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to grow</h3>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Powerful tools to help you manage your personal finances with ease and precision.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Wallet className="text-blue-600" />}
                            title="Smart Wallets"
                            description="Manage multiple accounts including bank, cash, and credit cards in one unified view."
                        />
                        <FeatureCard
                            icon={<ArrowRightLeft className="text-violet-600" />}
                            title="Loan Tracking"
                            description="Keep track of money lent and borrowed. Never forget a debt again with automated reminders."
                        />
                        <FeatureCard
                            icon={<PieChart className="text-green-600" />}
                            title="Visual Analytics"
                            description="Understand your spending habits with beautiful, interactive charts and reports."
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-2">Pricing</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h3>
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
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold mb-12 opacity-80">Trusted by modern finance teams</h2>
                    <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale">
                        {['Stripe', 'Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((brand) => (
                            <span key={brand} className="text-2xl font-bold hover:opacity-100 transition-opacity cursor-default">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Wallet className="text-white w-4 h-4" />
                                </div>
                                <span className="text-xl font-bold text-slate-900">TakaTrack</span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Making personal finance management accessible, smart, and stress-free for everyone.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-blue-600">Features</a></li>
                                <li><a href="#" className="hover:text-blue-600">Pricing</a></li>
                                <li><a href="#" className="hover:text-blue-600">Security</a></li>
                                <li><a href="#" className="hover:text-blue-600">Updates</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Company</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                                <li><a href="#" className="hover:text-blue-600">Careers</a></li>
                                <li><a href="#" className="hover:text-blue-600">Blog</a></li>
                                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li><a href="#" className="hover:text-blue-600">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-blue-600">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-blue-600">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-slate-500">© 2025 Taka Track. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Globe size={20} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
                            <Shield size={20} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all group">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
);

const PricingCard = ({ title, price, description, features, isPopular, onGetStarted }: any) => (
    <div className={`p-8 rounded-3xl border ${isPopular ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-100' : 'border-slate-200 bg-white'} relative flex flex-col`}>
        {isPopular && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wide rounded-full">
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
                    <Check size={16} className="text-blue-600 flex-shrink-0" />
                    {feature}
                </li>
            ))}
        </ul>
        <button
            onClick={onGetStarted}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${isPopular
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
        >
            Choose {title}
        </button>
    </div>
);

export default LandingPage;
