
import { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, Edit2, X, CreditCard, Banknote, Menu, BarChart3, ArrowRightLeft, TrendingUp, Download, FileText, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import axios from 'axios';
import './App.css';
import LandingPage from './components/LandingPage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

interface WalletType {
    id: string;
    name: string;
    type: string;
    balance: number;
}

interface Category {
    id: string;
    name: string;
    type: string;
    subCategories: SubCategory[];
}

interface SubCategory {
    id: string;
    name: string;
}

interface Transaction {
    id: string;
    amount: number;
    date: string;
    description: string;
    type: string;
    category: { id: string; name: string };
    subCategory?: { id: string; name: string };
    wallet: { id: string; name: string; type: string };
}

type Page = 'wallets' | 'transactions' | 'categories' | 'loans' | 'reports' | 'admin';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState('');
    const [role, setRole] = useState('USER');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<Page>('wallets');

    // Wallet state
    const [wallets, setWallets] = useState<WalletType[]>([]);
    const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
    const [editingWallet, setEditingWallet] = useState<WalletType | null>(null);
    const [walletForm, setWalletForm] = useState({
        name: '',
        type: 'BANK',
        balance: '0'
    });

    // Transaction state
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [transactionForm, setTransactionForm] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        type: 'EXPENSE',
        category_id: '',
        sub_category_id: '',
        wallet_id: ''
    });
    // const [stats, setStats] = useState({
    //     totalIncome: 0,
    //     totalExpense: 0,
    //     balance: 0
    // });

    // Category state
    // const [categoryType, setCategoryType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<Category | null>(null);
    const [categoryForm, setCategoryForm] = useState({ name: '', type: 'EXPENSE' });
    const [subCategoryForm, setSubCategoryForm] = useState({ name: '' });

    // Loan state
    const [loans, setLoans] = useState<any[]>([]);
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState<any>(null);
    const [loanForm, setLoanForm] = useState({
        amount: '',
        type: 'LENT', // LENT or BORROWED
        party_name: '',
        party_phone: '',
        party_email: '',
        date: new Date().toISOString().split('T')[0],
        wallet_id: '',
        description: ''
    });
    const [paymentForm, setPaymentForm] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        wallet_id: '',
        description: ''
    });

    // Reports state
    // const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
    // const [categoryStats, setCategoryStats] = useState<any[]>([]);

    // Admin state
    // const [adminStats, setAdminStats] = useState<any>(null);
    // const [users, setUsers] = useState<any[]>([]);


    useEffect(() => {
        if (isLoggedIn && token) {
            fetchWallets();
            fetchCategories();
            fetchTransactions();
            // fetchStats();
            fetchLoans();
            // fetchReports();
        }
    }, [isLoggedIn, token]);

    useEffect(() => {
        if (isLoggedIn && token && role === 'ADMIN' && currentPage === 'admin') {
            // fetchAdminData();
        }
    }, [isLoggedIn, token, role, currentPage]);

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSignupMode, setIsSignupMode] = useState(false);

    // Forgot Password state
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log('Auth attempt:', { isSignupMode, email, hasPassword: !!password, apiUrl: API_URL });

        try {
            if (isSignupMode) {
                // Signup
                console.log('Attempting signup...');
                const res = await axios.post(`${API_URL}/auth/register`, {
                    email,
                    password,
                    name: name || email.split('@')[0],
                    phone: phone || ''
                });
                console.log('Signup successful:', res.data);
                setToken(res.data.token);
                setRole(res.data.data.user.role);
                setIsLoggedIn(true);
            } else {
                // Login
                console.log('Attempting login to:', `${API_URL}/auth/login`);
                const res = await axios.post(`${API_URL}/auth/login`, { email, password });
                console.log('Login successful:', res.data);
                setToken(res.data.token);
                setRole(res.data.data.user.role);
                setIsLoggedIn(true);
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            console.error('Error response:', error.response?.data);

            let errorMessage = '';
            if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
                errorMessage = `Cannot connect to server at ${API_URL}. Please check:\n1. Backend server is running\n2. API URL is correct\n3. CORS is configured`;
            } else if (error.response) {
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            } else {
                errorMessage = error.message || `${isSignupMode ? 'Signup' : 'Login'} failed`;
            }

            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchWallets();
            fetchCategories();
            fetchTransactions();
            // fetchStats();
            fetchLoans();
            if (role === 'ADMIN') {
                // fetchAdminData();
            }
        }
    }, [isLoggedIn]);

    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const fetchWallets = async () => {
        try {
            const res = await axios.get(`${API_URL}/wallets`, config);
            setWallets(res.data.data.wallets);
        } catch (error) {
            console.error('Failed to fetch wallets:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_URL}/transaction-categories`, config);
            setCategories(res.data.data.categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchTransactions = async () => {
        try {
            const res = await axios.get(`${API_URL}/transactions`, config);
            setTransactions(res.data.data.transactions);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        }
    };

    // const fetchStats = async () => {
    //     try {
    //         const res = await axios.get(`${API_URL}/transactions/stats`, config);
    //         setStats(res.data.data);
    //     } catch (error) {
    //         console.error('Failed to fetch stats:', error);
    //     }
    // };

    const fetchLoans = async () => {
        try {
            const res = await axios.get(`${API_URL}/loans`, config);
            setLoans(res.data.data.loans);
        } catch (error) {
            console.error('Failed to fetch loans:', error);
        }
    };

    // const fetchAdminData = async () => {
    //     try {
    //         const statsRes = await axios.get(`${API_URL}/admin/stats`, config);
    //         setAdminStats(statsRes.data.data.stats);
    //         const usersRes = await axios.get(`${API_URL}/admin/users`, config);
    //         setUsers(usersRes.data.data.users);
    //     } catch (error) {
    //         console.error('Failed to fetch admin data:', error);
    //     }
    // };

    // const fetchReports = async () => {
    //     try {
    //         const monthlyRes = await axios.get(`${API_URL}/reports/monthly`, config);
    //         setMonthlyStats(monthlyRes.data.data.monthlyData);
    //
    //         const categoryRes = await axios.get(`${API_URL}/reports/category?type=EXPENSE`, config);
    //         setCategoryStats(categoryRes.data.data.stats);
    //     } catch (error) {
    //         console.error('Failed to fetch reports:', error);
    //     }
    // };

    // Export functions
    const handleExportCSV = async (type: 'transactions' | 'wallets' | 'loans' | 'categories') => {
        try {
            const response = await axios.get(`${API_URL}/export/csv/${type}`, {
                ...config,
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(`Failed to export ${type} CSV:`, error);
            alert(`Failed to export ${type} to CSV`);
        }
    };

    const handleExportPDF = async (type: 'transactions' | 'wallets' | 'loans' | 'financial-report') => {
        try {
            const response = await axios.get(`${API_URL}/export/pdf/${type}`, {
                ...config,
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${type}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(`Failed to export ${type} PDF:`, error);
            alert(`Failed to export ${type} to PDF`);
        }
    };

    // Forgot Password handlers
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/auth/forgot-password`, {
                emailOrPhone: forgotPasswordEmail
            });
            alert('Password reset request submitted. Please contact administrator for reset token.');
            setIsForgotPasswordModalOpen(false);
            setForgotPasswordEmail('');
            setIsResetPasswordModalOpen(true);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to request password reset');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/auth/reset-password`, {
                token: resetToken,
                newPassword
            });
            alert('Password reset successfully! You can now login with your new password.');
            setIsResetPasswordModalOpen(false);
            setResetToken('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };


    // const handleToggleUserStatus = async (userId: string) => {
    //     if (!confirm('Are you sure you want to change this user\'s status?')) return;
    //     try {
    //         await axios.patch(`${API_URL}/admin/users/${userId}/toggle-status`, {}, config);
    //         fetchAdminData();
    //     } catch (error: any) {
    //         alert('Failed: ' + (error.response?.data?.message || error.message));
    //     }
    // };

    // const handleDeleteUser = async (userId: string) => {
    //     if (!confirm('WARNING: This will delete the user and ALL their data. This cannot be undone. Continue?')) return;
    //     try {
    //         await axios.delete(`${API_URL}/admin/users/${userId}`, config);
    //         fetchAdminData();
    //     } catch (error: any) {
    //         alert('Failed: ' + (error.response?.data?.message || error.message));
    //     }
    // };

    const handleAddWallet = () => {
        setEditingWallet(null);
        setWalletForm({ name: '', type: 'BANK', balance: '0' });
        setIsWalletModalOpen(true);
    };

    // const handleEditWallet = (wallet: WalletType) => {
    //     setEditingWallet(wallet);
    //     setWalletForm({
    //         name: wallet.name,
    //         type: wallet.type,
    //         balance: wallet.balance.toString()
    //     });
    //     setIsWalletModalOpen(true);
    // };

    const handleSubmitWallet = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingWallet) {
                await axios.put(`${API_URL}/wallets/${editingWallet.id}`, {
                    name: walletForm.name,
                    type: walletForm.type,
                    balance: parseFloat(walletForm.balance)
                }, config);
                alert('Wallet updated!');
            } else {
                await axios.post(`${API_URL}/wallets`, {
                    name: walletForm.name,
                    type: walletForm.type,
                    balance: parseFloat(walletForm.balance)
                }, config);
                alert('Wallet created!');
            }
            setIsWalletModalOpen(false);
            fetchWallets();
        } catch (error: any) {
            alert('Failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // const handleDeleteWallet = async (id: string) => {
    //     if (!confirm('Delete this wallet?')) return;
    //     try {
    //         await axios.delete(`${API_URL}/wallets/${id}`, config);
    //         alert('Wallet deleted!');
    //         fetchWallets();
    //     } catch (error: any) {
    //         alert('Failed: ' + (error.response?.data?.message || error.message));
    //     }
    // };

    const handleAddTransaction = () => {
        setTransactionForm({
            amount: '',
            date: new Date().toISOString().split('T')[0],
            description: '',
            type: 'EXPENSE',
            category_id: '',
            sub_category_id: '',
            wallet_id: wallets[0]?.id || ''
        });
        setIsTransactionModalOpen(true);
    };

    const handleSubmitTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/transactions`, {
                amount: parseFloat(transactionForm.amount),
                date: new Date(transactionForm.date).toISOString(),
                description: transactionForm.description,
                type: transactionForm.type,
                category_id: transactionForm.category_id,
                sub_category_id: transactionForm.sub_category_id || undefined,
                wallet_id: transactionForm.wallet_id
            }, config);
            alert('Transaction created!');
            setIsTransactionModalOpen(false);
            fetchTransactions();
            fetchWallets();
            // fetchStats();
        } catch (error: any) {
            alert('Failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // const handleDeleteTransaction = async (id: string) => {
    //     if (!confirm('Delete this transaction?')) return;
    //     try {
    //         await axios.delete(`${API_URL}/transactions/${id}`, config);
    //         alert('Transaction deleted!');
    //         fetchTransactions();
    //         fetchWallets();
    //         fetchStats();
    //     } catch (error: any) {
    //         alert('Failed: ' + (error.response?.data?.message || error.message));
    //     }
    // };

    const handleAddCategory = () => {
        setEditingCategory(null);
        setCategoryForm({ name: '', type: 'EXPENSE' });
        setIsCategoryModalOpen(true);
    };

    // const handleEditCategory = (category: Category) => {
    //     setEditingCategory(category);
    //     setCategoryForm({ name: category.name, type: category.type });
    //     setIsCategoryModalOpen(true);
    // };

    const handleSubmitCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingCategory) {
                await axios.put(`${API_URL}/transaction-categories/${editingCategory.id}`, categoryForm, config);
            } else {
                await axios.post(`${API_URL}/transaction-categories`, categoryForm, config);
            }
            setIsCategoryModalOpen(false);
            fetchCategories();
        } catch (error: any) {
            alert('Failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Delete this category?')) return;
        try {
            await axios.delete(`${API_URL}/transaction-categories/${id}`, config);
            fetchCategories();
        } catch (error: any) {
            alert('Failed: ' + (error.response?.data?.message || error.message));
        }
    };

    // const handleAddSubCategory = (category: Category) => {
    //     setSelectedCategoryForSub(category);
    //     setSubCategoryForm({ name: '' });
    //     setIsSubCategoryModalOpen(true);
    // };

    const handleSubmitSubCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCategoryForSub) return;
        setLoading(true);
        try {
            await axios.post(`${API_URL}/transaction-categories/subcategories`, {
                category_id: selectedCategoryForSub.id,
                name: subCategoryForm.name
            }, config);
            setIsSubCategoryModalOpen(false);
            fetchCategories();
        } catch (error: any) {
            alert('Failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // const handleDeleteSubCategory = async (id: string) => {
    //     if (!confirm('Delete this subcategory?')) return;
    //     try {
    //         await axios.delete(`${API_URL}/transaction-categories/subcategories/${id}`, config);
    //         fetchCategories();
    //     } catch (error: any) {
    //         alert('Failed: ' + (error.response?.data?.message || error.message));
    //     }
    // };

    const handleAddLoan = () => {
        setLoanForm({
            amount: '',
            type: 'LENT',
            party_name: '',
            party_phone: '',
            party_email: '',
            date: new Date().toISOString().split('T')[0],
            wallet_id: wallets[0]?.id || '',
            description: ''
        });
        setIsLoanModalOpen(true);
    };

    const handleSubmitLoan = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/loans`, loanForm, config);
            setIsLoanModalOpen(false);
            fetchLoans();
            fetchWallets(); // Balance changes
        } catch (error: any) {
            alert('Failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleAddPayment = (loan: any) => {
        setSelectedLoan(loan);
        setPaymentForm({
            amount: '',
            date: new Date().toISOString().split('T')[0],
            wallet_id: wallets[0]?.id || '',
            description: ''
        });
        setIsPaymentModalOpen(true);
    };

    const handleSubmitPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLoan) return;
        setLoading(true);
        try {
            await axios.post(`${API_URL}/loans/${selectedLoan.id}/payments`, paymentForm, config);
            setIsPaymentModalOpen(false);
            fetchLoans();
            fetchWallets(); // Balance changes
        } catch (error: any) {
            alert('Failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const calculateWalletTotals = () => {
        const total = wallets.reduce((sum, w) => sum + Number(w.balance), 0);
        const bank = wallets.filter(w => w.type === 'BANK').reduce((sum, w) => sum + Number(w.balance), 0);
        const cash = wallets.filter(w => w.type === 'CASH').reduce((sum, w) => sum + Number(w.balance), 0);
        const credit = wallets.filter(w => w.type === 'CREDIT_CARD').reduce((sum, w) => sum + Number(w.balance), 0);
        return { total, bank, cash, credit };
    };

    // const getWalletIcon = (type: string) => {
    //     switch (type) {
    //         case 'BANK': return <Banknote size={24} />;
    //         case 'CASH': return <DollarSign size={24} />;
    //         case 'CREDIT_CARD': return <CreditCard size={24} />;
    //         default: return <Wallet size={24} />;
    //     }
    // };

    // const getWalletColor = (type: string) => {
    //     switch (type) {
    //         case 'BANK': return 'bg-blue-500/20 text-blue-400';
    //         case 'CASH': return 'bg-green-500/20 text-green-400';
    //         case 'CREDIT_CARD': return 'bg-purple-500/20 text-purple-400';
    //         default: return 'bg-gray-500/20 text-gray-400';
    //     }
    // };

    // const filteredCategories = categories.filter(c => c.type === transactionForm.type);
    // const selectedCategory = categories.find(c => c.id === transactionForm.category_id);

    if (!isLoggedIn) {
        if (!showLogin) {
            return <LandingPage onGetStarted={() => setShowLogin(true)} />;
        }

        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-md w-full mx-4 relative">
                    <button
                        onClick={() => setShowLogin(false)}
                        className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 text-sm transition-colors"
                    >
                        ← Back
                    </button>
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 transform -rotate-6">
                            <Wallet className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Taka Track</h1>
                    </div>

                    {/* Toggle between Login and Signup */}
                    <div className="flex gap-2 mb-6">
                        <button
                            onClick={() => setIsSignupMode(false)}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${!isSignupMode
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsSignupMode(true)}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${isSignupMode
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {isSignupMode && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-700">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 transition-all"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-700">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 transition-all"
                                        placeholder="+880 1234567890"
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 transition-all"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>
                        {!isSignupMode && (
                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={() => setIsForgotPasswordModalOpen(true)}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : (isSignupMode ? 'Create Account' : 'Login')}
                        </button>
                    </form>

                    {!isSignupMode && (
                        <p className="text-xs text-slate-400 text-center mt-6">
                            Demo: demo@example.com / demo123
                        </p>
                    )}
                </div>
            </div>
        );
    }

    const walletTotals = calculateWalletTotals();
    const colors = ['bg-emerald', 'bg-blue', 'bg-purple', 'bg-rose', 'bg-amber', 'bg-cyan', 'bg-indigo', 'bg-teal', 'bg-fuchsia', 'bg-orange', 'bg-red', 'bg-pink'];

    return (
        <div className="app-container">
            {/* Top Navigation */}
            <nav className="top-nav">
                <div className="nav-left">
                    <div className="logo-container">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                            <Wallet size={20} />
                        </div>
                        <span>Taka Track</span>
                    </div>

                    <div className="nav-links">
                        <a href="#" className={`nav-link ${currentPage === 'wallets' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentPage('wallets'); }}>Dashboard</a>
                        <a href="#" className={`nav-link ${currentPage === 'transactions' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentPage('transactions'); }}>Records</a>
                        <a href="#" className={`nav-link ${currentPage === 'categories' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentPage('categories'); }}>Categories</a>
                        <a href="#" className={`nav-link ${currentPage === 'loans' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentPage('loans'); }}>Loans</a>
                        <a href="#" className={`nav-link ${currentPage === 'reports' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentPage('reports'); }}>Analytics</a>
                        {role === 'ADMIN' && (
                            <a href="#" className={`nav-link ${currentPage === 'admin' ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); setCurrentPage('admin'); }}>Admin</a>
                        )}
                    </div>
                </div>

                <div className="nav-right">
                    <button className="btn-record" onClick={handleAddTransaction}>
                        <Plus size={16} />
                        Record
                    </button>

                    <div className="flex items-center gap-4">
                        <button className="text-muted hover:text-main relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="user-profile" onClick={() => {
                            if (confirm('Logout?')) {
                                setIsLoggedIn(false);
                                setToken('');
                                setEmail('');
                                setPassword('');
                                setName('');
                                setPhone('');
                            }
                        }}>
                            <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
                                {name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()}
                            </div>
                            <div className="user-info hidden md:flex">
                                <span className="user-name">{name || 'User'}</span>
                                <span className="user-role">Premium</span>
                            </div>
                        </div>
                    </div>

                    <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 bg-white p-4 lg:hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div className="logo-container">
                            <Wallet className="text-primary" />
                            <span>Taka Track</span>
                        </div>
                        <button onClick={() => setIsSidebarOpen(false)}>
                            <X size={24} />
                        </button>
                    </div>
                    <div className="flex flex-col gap-4">
                        <a href="#" className="text-lg font-medium p-2" onClick={() => { setCurrentPage('wallets'); setIsSidebarOpen(false); }}>Dashboard</a>
                        <a href="#" className="text-lg font-medium p-2" onClick={() => { setCurrentPage('transactions'); setIsSidebarOpen(false); }}>Records</a>
                        <a href="#" className="text-lg font-medium p-2" onClick={() => { setCurrentPage('categories'); setIsSidebarOpen(false); }}>Categories</a>
                        <a href="#" className="text-lg font-medium p-2" onClick={() => { setCurrentPage('loans'); setIsSidebarOpen(false); }}>Loans</a>
                        <a href="#" className="text-lg font-medium p-2" onClick={() => { setCurrentPage('reports'); setIsSidebarOpen(false); }}>Analytics</a>
                        <button className="btn-record justify-center mt-4" onClick={() => { setIsTransactionModalOpen(true); setIsSidebarOpen(false); }}>
                            <Plus size={16} /> Record Transaction
                        </button>
                    </div>
                </div>
            )}

            <main className="main-content animate-fade-in">
                {currentPage === 'wallets' && (
                    <>
                        {/* Wallet Cards Grid */}
                        <div className="dashboard-grid">
                            {wallets.map((wallet, index) => (
                                <div key={wallet.id} className={`wallet-card ${colors[index % colors.length]}`}>
                                    <div className="wallet-card-header">
                                        <div className="wallet-icon-wrapper">
                                            {wallet.type === 'BANK' ? <Banknote size={24} /> :
                                                wallet.type === 'MOBILE_BANKING' ? <CreditCard size={24} /> :
                                                    <Wallet size={24} />}
                                        </div>
                                        <div className="wallet-info">
                                            <h3>{wallet.name}</h3>
                                            <p>${wallet.balance.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="wallet-card-footer">
                                        {wallet.type.replace('_', ' ')}
                                    </div>
                                    {/* Decorative Circle */}
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                                </div>
                            ))}

                            <button className="add-account-card" onClick={handleAddWallet}>
                                <div className="flex flex-col items-center gap-2">
                                    <Plus size={24} />
                                    <span>+ Add Account</span>
                                </div>
                            </button>
                        </div>

                        {/* Dashboard Section with Gauges */}
                        <div className="dashboard-section">
                            <div className="section-header">
                                <h3 className="section-title">Dashboard</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                                        <button className="hover:text-primary"><ChevronLeft size={16} /></button>
                                        <span>This month</span>
                                        <button className="hover:text-primary"><ChevronRight size={16} /></button>
                                    </div>
                                    <button className="btn-record text-xs py-1.5 px-3" onClick={handleAddWallet}>
                                        <Plus size={14} /> Add Card
                                    </button>
                                </div>
                            </div>

                            <div className="gauges-grid">
                                {/* Balance Gauge */}
                                <div className="gauge-container">
                                    <div className="gauge">
                                        <div className="gauge-bg"></div>
                                        <div className="gauge-fill" style={{ transform: 'rotate(45deg)', borderColor: '#f59e0b' }}></div>
                                    </div>
                                    <div className="text-center mt-[-20px]">
                                        <p className="text-2xl font-bold text-amber-500">${walletTotals.total.toFixed(0)}</p>
                                        <p className="text-xs text-muted uppercase tracking-wider font-semibold">BALANCE</p>
                                    </div>
                                </div>

                                {/* Cash Flow Gauge */}
                                <div className="gauge-container">
                                    <div className="gauge">
                                        <div className="gauge-bg"></div>
                                        <div className="gauge-fill" style={{ transform: 'rotate(120deg)', borderColor: '#10b981' }}></div>
                                    </div>
                                    <div className="text-center mt-[-20px]">
                                        <p className="text-2xl font-bold text-emerald-500">${walletTotals.cash.toFixed(0)}</p>
                                        <p className="text-xs text-muted uppercase tracking-wider font-semibold">CASH FLOW</p>
                                    </div>
                                </div>

                                {/* Spending Gauge */}
                                <div className="gauge-container">
                                    <div className="gauge">
                                        <div className="gauge-bg"></div>
                                        <div className="gauge-fill" style={{ transform: 'rotate(90deg)', borderColor: '#ef4444' }}></div>
                                    </div>
                                    <div className="text-center mt-[-20px]">
                                        <p className="text-2xl font-bold text-red-500">${walletTotals.credit.toFixed(0)}</p>
                                        <p className="text-xs text-muted uppercase tracking-wider font-semibold">SPENDING</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {currentPage === 'transactions' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Transaction Records</h2>
                            <div className="flex gap-2">
                                <button className="btn-secondary" onClick={() => handleExportCSV('transactions')}><Download size={16} /> CSV</button>
                                <button className="btn-secondary" onClick={() => handleExportPDF('transactions')}><FileText size={16} /> PDF</button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {transactions.map((t) => (
                                <div key={t.id} className="transaction-item hover:bg-slate-50 p-4 rounded-lg border border-slate-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`icon-box ${t.type === 'INCOME' ? 'icon-income' : 'icon-expense'}`}>
                                            {t.type === 'INCOME' ? <TrendingUp size={20} /> : <ArrowRightLeft size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{t.description || 'No description'}</p>
                                            <p className="text-sm text-muted">{new Date(t.date).toLocaleDateString()} • {t.category?.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-bold ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {t.type === 'INCOME' ? '+' : '-'}${t.amount.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-muted">{t.wallet?.name}</p>
                                    </div>
                                </div>
                            ))}
                            {transactions.length === 0 && (
                                <div className="text-center py-12 text-muted">No transactions found</div>
                            )}
                        </div>
                    </div>
                )}

                {currentPage === 'categories' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Categories</h2>
                            <button className="btn-primary" onClick={handleAddCategory}>
                                <Plus size={16} /> Add Category
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map(cat => (
                                <div key={cat.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold">{cat.name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${cat.type === 'INCOME' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                            {cat.type}
                                        </span>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button onClick={() => { setEditingCategory(cat); setCategoryForm({ name: cat.name, type: cat.type }); setIsCategoryModalOpen(true); }} className="p-1 text-slate-400 hover:text-blue-500"><Edit2 size={16} /></button>
                                        <button onClick={() => handleDeleteCategory(cat.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        <button onClick={() => { setSelectedCategoryForSub(cat); setIsSubCategoryModalOpen(true); }} className="p-1 text-slate-400 hover:text-emerald-500 ml-auto"><Plus size={16} /></button>
                                    </div>
                                    {cat.subCategories && cat.subCategories.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-slate-100">
                                            <p className="text-xs text-muted mb-2">Subcategories:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {cat.subCategories.map(sub => (
                                                    <span key={sub.id} className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded border border-slate-200">{sub.name}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentPage === 'loans' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Loans Management</h2>
                            <button className="btn-primary" onClick={handleAddLoan}>
                                <Plus size={16} /> New Loan
                            </button>
                        </div>
                        <div className="space-y-4">
                            {loans.map(loan => (
                                <div key={loan.id} className="p-4 border border-slate-200 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-lg">{loan.party_name}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${loan.type === 'LENT' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'}`}>
                                                    {loan.type === 'LENT' ? 'You Lent' : 'You Borrowed'}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${loan.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                    {loan.status}
                                                </span>
                                            </div>
                                            <p className="text-2xl font-bold my-2">${loan.amount.toFixed(2)}</p>
                                            <div className="text-sm text-muted">
                                                Due: {new Date(loan.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <button className="btn-secondary text-xs" onClick={() => handleAddPayment(loan)}>Add Payment</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loans.length === 0 && <div className="text-center py-12 text-muted">No loans found</div>}
                        </div>
                    </div>
                )}

                {currentPage === 'reports' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center py-20">
                        <BarChart3 className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                        <h2 className="text-xl font-bold text-slate-700">Analytics Coming Soon</h2>
                        <p className="text-muted">Detailed reports and charts are under development.</p>
                    </div>
                )}

                {currentPage === 'admin' && role === 'ADMIN' && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h3 className="font-semibold mb-2">System Status</h3>
                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Database: Connected</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> API: Online</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Version: 3.0.0</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modals */}
                {/* Forgot Password Modal */}
                {isForgotPasswordModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-modal border border-glass rounded-lg max-w-md w-full p-6 animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Forgot Password</h3>
                                <button onClick={() => setIsForgotPasswordModalOpen(false)} className="text-muted hover:text-main">
                                    <X size={24} />
                                </button>
                            </div>

                            <p className="text-sm text-muted mb-4">
                                Enter your email or phone number. An administrator will provide you with a reset token.
                            </p>

                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email or Phone</label>
                                    <input
                                        type="text"
                                        value={forgotPasswordEmail}
                                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                        className="w-full glass-input"
                                        placeholder="email@example.com or phone number"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsForgotPasswordModalOpen(false)}
                                        className="flex-1 glass-button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 btn-primary justify-center"
                                    >
                                        {loading ? 'Submitting...' : 'Request Reset'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Reset Password Modal */}
                {isResetPasswordModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-modal border border-glass rounded-lg max-w-md w-full p-6 animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Reset Password</h3>
                                <button onClick={() => setIsResetPasswordModalOpen(false)} className="text-muted hover:text-main">
                                    <X size={24} />
                                </button>
                            </div>

                            <p className="text-sm text-muted mb-4">
                                Enter the reset token provided by the administrator and your new password.
                            </p>

                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Reset Token</label>
                                    <input
                                        type="text"
                                        value={resetToken}
                                        onChange={(e) => setResetToken(e.target.value)}
                                        className="w-full glass-input font-mono text-sm"
                                        placeholder="Enter token from administrator"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full glass-input"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full glass-input"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsResetPasswordModalOpen(false)}
                                        className="flex-1 glass-button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 btn-primary justify-center"
                                    >
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isWalletModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-modal border border-glass rounded-lg max-w-md w-full p-6 animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Add New Wallet</h3>
                                <button onClick={() => setIsWalletModalOpen(false)} className="text-muted hover:text-main">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitWallet} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Wallet Name</label>
                                    <input
                                        type="text"
                                        value={walletForm.name}
                                        onChange={(e) => setWalletForm({ ...walletForm, name: e.target.value })}
                                        className="w-full glass-input"
                                        placeholder="e.g. Main Bank Account"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Type</label>
                                    <select
                                        value={walletForm.type}
                                        onChange={(e) => setWalletForm({ ...walletForm, type: e.target.value })}
                                        className="w-full glass-input"
                                    >
                                        <option value="CASH">Cash</option>
                                        <option value="BANK">Bank Account</option>
                                        <option value="MOBILE_BANKING">Mobile Banking</option>
                                        <option value="CREDIT_CARD">Credit Card</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Initial Balance</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                                        <input
                                            type="number"
                                            value={walletForm.balance}
                                            onChange={(e) => setWalletForm({ ...walletForm, balance: e.target.value })}
                                            className="w-full pl-8 glass-input"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsWalletModalOpen(false)}
                                        className="flex-1 glass-btn glass-btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 glass-btn glass-btn-primary"
                                    >
                                        {loading ? 'Creating...' : 'Create Wallet'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isTransactionModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-modal border border-glass rounded-lg max-w-md w-full p-6 animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">New Transaction</h3>
                                <button onClick={() => setIsTransactionModalOpen(false)} className="text-muted hover:text-main">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitTransaction} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setTransactionForm({ ...transactionForm, type: 'EXPENSE' })}
                                        className={`flex-1 glass-btn ${transactionForm.type === 'EXPENSE' ? 'glass-btn-active' : 'glass-btn-secondary'}`}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTransactionForm({ ...transactionForm, type: 'INCOME' })}
                                        className={`flex-1 glass-btn ${transactionForm.type === 'INCOME' ? 'glass-btn-active' : 'glass-btn-secondary'}`}
                                    >
                                        Income
                                    </button>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                                        <input
                                            type="number"
                                            value={transactionForm.amount}
                                            onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                                            className="w-full pl-8 glass-input"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Wallet</label>
                                    <select
                                        value={transactionForm.wallet_id}
                                        onChange={(e) => setTransactionForm({ ...transactionForm, wallet_id: e.target.value })}
                                        className="w-full glass-input"
                                        required
                                    >
                                        <option value="">Select Wallet</option>
                                        {wallets.map(w => (
                                            <option key={w.id} value={w.id}>{w.name} (${w.balance})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <select
                                        value={transactionForm.category_id}
                                        onChange={(e) => setTransactionForm({ ...transactionForm, category_id: e.target.value })}
                                        className="w-full glass-input"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories
                                            .filter(c => c.type === transactionForm.type)
                                            .map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                                    <input
                                        type="text"
                                        value={transactionForm.description}
                                        onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                                        className="w-full glass-input"
                                        placeholder="Notes..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={transactionForm.date}
                                        onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                                        className="w-full glass-input"
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsTransactionModalOpen(false)}
                                        className="flex-1 glass-btn glass-btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 glass-btn glass-btn-primary"
                                    >
                                        {loading ? 'Adding...' : 'Add Transaction'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isCategoryModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-modal border border-glass rounded-lg max-w-md w-full p-6 animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                                <button onClick={() => setIsCategoryModalOpen(false)} className="text-muted hover:text-main">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitCategory} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={categoryForm.name}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                        className="w-full glass-input"
                                        placeholder="Category Name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Type</label>
                                    <select
                                        value={categoryForm.type}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value })}
                                        className="w-full glass-input"
                                    >
                                        <option value="EXPENSE">Expense</option>
                                        <option value="INCOME">Income</option>
                                    </select>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsCategoryModalOpen(false)}
                                        className="flex-1 glass-btn glass-btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 glass-btn glass-btn-primary"
                                    >
                                        {loading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isSubCategoryModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-modal border border-glass rounded-lg max-w-md w-full p-6 animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Add Subcategory</h3>
                                <button onClick={() => setIsSubCategoryModalOpen(false)} className="text-muted hover:text-main">
                                    <X size={24} />
                                </button>
                            </div>

                            <p className="text-sm text-muted mb-4">
                                Adding to: <span className="font-semibold text-slate-900">{selectedCategoryForSub?.name}</span>
                            </p>

                            <form onSubmit={handleSubmitSubCategory} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={subCategoryForm.name}
                                        onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                                        className="w-full glass-input"
                                        placeholder="Subcategory Name"
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsSubCategoryModalOpen(false)}
                                        className="flex-1 glass-btn glass-btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 glass-btn glass-btn-primary"
                                    >
                                        {loading ? 'Saving...' : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isLoanModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-modal border border-glass rounded-lg max-w-md w-full p-6 animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">New Loan</h3>
                                <button onClick={() => setIsLoanModalOpen(false)} className="text-muted hover:text-main">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitLoan} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">I am...</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setLoanForm({ ...loanForm, type: 'LENT' })}
                                            className={`flex-1 glass-btn ${loanForm.type === 'LENT' ? 'glass-btn-active' : 'glass-btn-secondary'}`}
                                        >
                                            Lending Money
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setLoanForm({ ...loanForm, type: 'BORROWED' })}
                                            className={`flex-1 glass-btn ${loanForm.type === 'BORROWED' ? 'glass-btn-active' : 'glass-btn-secondary'}`}
                                        >
                                            Borrowing Money
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                                        <input
                                            type="number"
                                            value={loanForm.amount}
                                            onChange={(e) => setLoanForm({ ...loanForm, amount: e.target.value })}
                                            className="w-full pl-8 glass-input"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Person / Party Name</label>
                                    <input
                                        type="text"
                                        value={loanForm.party_name}
                                        onChange={(e) => setLoanForm({ ...loanForm, party_name: e.target.value })}
                                        className="w-full glass-input"
                                        placeholder="e.g. John Doe"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Party Phone</label>
                                        <input
                                            type="tel"
                                            value={loanForm.party_phone}
                                            onChange={(e) => setLoanForm({ ...loanForm, party_phone: e.target.value })}
                                            className="w-full glass-input"
                                            placeholder="+1 234..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Party Email</label>
                                        <input
                                            type="email"
                                            value={loanForm.party_email}
                                            onChange={(e) => setLoanForm({ ...loanForm, party_email: e.target.value })}
                                            className="w-full glass-input"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={loanForm.date}
                                        onChange={(e) => setLoanForm({ ...loanForm, date: e.target.value })}
                                        className="w-full glass-input"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Wallet (for transaction)</label>
                                    <select
                                        value={loanForm.wallet_id}
                                        onChange={(e) => setLoanForm({ ...loanForm, wallet_id: e.target.value })}
                                        className="w-full glass-input"
                                        required
                                    >
                                        <option value="">Select Wallet</option>
                                        {wallets.map(w => (
                                            <option key={w.id} value={w.id}>{w.name} (${w.balance})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                                    <textarea
                                        value={loanForm.description}
                                        onChange={(e) => setLoanForm({ ...loanForm, description: e.target.value })}
                                        className="w-full glass-input"
                                        placeholder="Notes..."
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsLoanModalOpen(false)}
                                        className="flex-1 glass-btn glass-btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 glass-btn glass-btn-primary"
                                    >
                                        {loading ? 'Processing...' : 'Create Loan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {isPaymentModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-modal border border-glass rounded-lg max-w-md w-full p-6 animate-fade-in">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Add Payment</h3>
                                <button onClick={() => setIsPaymentModalOpen(false)} className="text-muted hover:text-main">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitPayment} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                                        <input
                                            type="number"
                                            value={paymentForm.amount}
                                            onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                            className="w-full pl-8 glass-input"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={paymentForm.date}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                                        className="w-full glass-input"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Wallet</label>
                                    <select
                                        value={paymentForm.wallet_id}
                                        onChange={(e) => setPaymentForm({ ...paymentForm, wallet_id: e.target.value })}
                                        className="w-full glass-input"
                                        required
                                    >
                                        <option value="">Select Wallet</option>
                                        {wallets.map(w => (
                                            <option key={w.id} value={w.id}>{w.name} (${w.balance})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsPaymentModalOpen(false)}
                                        className="flex-1 glass-btn glass-btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 glass-btn glass-btn-primary"
                                    >
                                        {loading ? 'Processing...' : 'Add Payment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
