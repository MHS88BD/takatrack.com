import React from 'react';
import { Wallet, PieChart, ArrowRightLeft, ChevronRight, Globe } from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    return (
        <div className="min-h-screen bg-dark text-main font-sans selection:bg-primary/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[30%] h-[30%] bg-success/10 rounded-full blur-[100px]" />
            </div>

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-dark/60 backdrop-blur-xl border-b border-glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <Wallet className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 tracking-tight">
                                Taka Track
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="hidden md:block text-sm font-medium text-muted hover:text-main transition-colors">Features</button>
                            <button className="hidden md:block text-sm font-medium text-muted hover:text-main transition-colors">Testimonials</button>
                            <button
                                onClick={onGetStarted}
                                className="px-6 py-2.5 rounded-full bg-surface border border-glass hover:bg-white/5 transition-all text-sm font-semibold backdrop-blur-md"
                            >
                                Log In
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                        </span>
                        <span className="text-sm font-medium text-gray-300">The Future of Personal Finance</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-tight">
                        Financial Freedom <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient">
                            Starts Here
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                        Experience the next generation of financial tracking.
                        Seamlessly manage wallets, loans, and expenses with
                        <span className="text-white font-medium"> unparalleled clarity</span>.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={onGetStarted}
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary hover:bg-blue-600 text-white font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-xl shadow-primary/30 ring-4 ring-primary/20"
                        >
                            Get Started Now
                            <ChevronRight size={20} />
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all backdrop-blur-md flex items-center justify-center gap-2">
                            <Globe size={20} className="text-muted" />
                            Live Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats / Trust Section */}
            <section className="py-10 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-12 md:gap-24 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {['Stripe', 'Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((brand) => (
                        <span key={brand} className="text-xl font-bold text-white/40 hover:text-white transition-colors cursor-default">{brand}</span>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-32 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need</h2>
                        <p className="text-xl text-muted max-w-2xl mx-auto">Powerful features wrapped in a stunning interface.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Wallet className="text-primary" size={32} />}
                            title="Smart Wallets"
                            description="Connect multiple accounts and track cash flow in real-time with intelligent categorization."
                        />
                        <FeatureCard
                            icon={<ArrowRightLeft className="text-accent" size={32} />}
                            title="Loan Tracking"
                            description="Never lose track of debts. Manage money lent and borrowed with automated reminders."
                        />
                        <FeatureCard
                            icon={<PieChart className="text-success" size={32} />}
                            title="Deep Analytics"
                            description="Visualize your spending habits with interactive charts and actionable insights."
                        />
                    </div>
                </div>
            </section>

            {/* App Preview Section (3D Tilt Effect) */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-3xl bg-gradient-to-b from-white/10 to-transparent p-1">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-20" />
                        <div className="relative bg-dark rounded-[22px] overflow-hidden border border-white/10 shadow-2xl">
                            {/* Mockup Header */}
                            <div className="h-12 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                                <div className="ml-4 px-3 py-1 rounded-md bg-black/20 text-xs text-muted font-mono">takatrack.dupno.com</div>
                            </div>

                            {/* Mockup Content */}
                            <div className="aspect-[16/9] bg-dark relative flex items-center justify-center group">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity duration-700" />

                                <div className="relative z-10 text-center p-8 backdrop-blur-sm rounded-3xl border border-white/10 bg-black/40">
                                    <h3 className="text-4xl font-bold mb-2">Dashboard Preview</h3>
                                    <p className="text-muted">Experience the power of Taka Track</p>
                                    <button onClick={onGetStarted} className="mt-6 px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-blue-600 transition-colors">
                                        Launch App
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-black/40 backdrop-blur-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                            <Wallet className="text-white w-4 h-4" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Taka Track</span>
                    </div>
                    <div className="text-muted text-sm">
                        © 2025 Taka Track. Crafted for financial freedom.
                    </div>
                    <div className="flex gap-8 text-muted text-sm font-medium">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:-translate-y-2 group backdrop-blur-sm">
        <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/5 w-fit group-hover:scale-110 transition-transform group-hover:bg-white/10">
            {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="text-muted leading-relaxed text-lg">{description}</p>
    </div>
);

export default LandingPage;
