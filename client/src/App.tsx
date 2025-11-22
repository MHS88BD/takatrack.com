
import { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, Edit2, X, LogOut, CreditCard, Tag, Users, Banknote, Menu, BarChart3, DollarSign, ArrowRightLeft, Shield, TrendingUp, Activity, Lock, Unlock, Download, FileText } from 'lucide-react';
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
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });

  // Category state
  const [categoryType, setCategoryType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
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
  const [monthlyStats, setMonthlyStats] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);

  // Admin state
  const [adminStats, setAdminStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  const config = { headers: { Authorization: `Bearer ${token} ` } };

  useEffect(() => {
    if (isLoggedIn && token) {
      fetchWallets();
      fetchCategories();
      fetchTransactions();
      fetchStats();
      fetchLoans();
      fetchReports();
    }
  }, [isLoggedIn, token]);

  useEffect(() => {
    if (isLoggedIn && token && role === 'ADMIN' && currentPage === 'admin') {
      fetchAdminData();
    }
  }, [isLoggedIn, token, role, currentPage]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSignupMode, setIsSignupMode] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignupMode) {
        // Signup
        const res = await axios.post(`${API_URL}/auth/register`, {
          email,
          password,
          name: name || email.split('@')[0], // Use email prefix if name not provided
          phone: phone || ''
        });
        setToken(res.data.token);
        setRole(res.data.data.user.role);
        setIsLoggedIn(true);
      } else {
        // Login
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        setToken(res.data.token);
        setRole(res.data.data.user.role);
        setIsLoggedIn(true);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || `${isSignupMode ? 'Signup' : 'Login'} failed`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchWallets();
      fetchCategories();
      fetchTransactions();
      fetchStats();
      fetchLoans();
      if (role === 'ADMIN') {
        fetchAdminData();
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

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/transactions/stats`, config);
      setStats(res.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchLoans = async () => {
    try {
      const res = await axios.get(`${API_URL}/loans`, config);
      setLoans(res.data.data.loans);
    } catch (error) {
      console.error('Failed to fetch loans:', error);
    }
  };

  const fetchAdminData = async () => {
    try {
      const statsRes = await axios.get(`${API_URL}/admin/stats`, config);
      setAdminStats(statsRes.data.data.stats);
      const usersRes = await axios.get(`${API_URL}/admin/users`, config);
      setUsers(usersRes.data.data.users);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    }
  };

  const fetchReports = async () => {
    try {
      const monthlyRes = await axios.get(`${API_URL}/reports/monthly`, config);
      setMonthlyStats(monthlyRes.data.data.monthlyData);

      const categoryRes = await axios.get(`${API_URL}/reports/category?type=EXPENSE`, config);
      setCategoryStats(categoryRes.data.data.stats);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  };

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


  const handleToggleUserStatus = async (userId: string) => {
    if (!confirm('Are you sure you want to change this user\'s status?')) return;
    try {
      await axios.patch(`${API_URL}/admin/users/${userId}/toggle-status`, {}, config);
      fetchAdminData();
    } catch (error: any) {
      alert('Failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('WARNING: This will delete the user and ALL their data. This cannot be undone. Continue?')) return;
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`, config);
      fetchAdminData();
    } catch (error: any) {
      alert('Failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddWallet = () => {
    setEditingWallet(null);
    setWalletForm({ name: '', type: 'BANK', balance: '0' });
    setIsWalletModalOpen(true);
  };

  const handleEditWallet = (wallet: WalletType) => {
    setEditingWallet(wallet);
    setWalletForm({
      name: wallet.name,
      type: wallet.type,
      balance: wallet.balance.toString()
    });
    setIsWalletModalOpen(true);
  };

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

  const handleDeleteWallet = async (id: string) => {
    if (!confirm('Delete this wallet?')) return;
    try {
      await axios.delete(`${API_URL}/wallets/${id}`, config);
      alert('Wallet deleted!');
      fetchWallets();
    } catch (error: any) {
      alert('Failed: ' + (error.response?.data?.message || error.message));
    }
  };

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
      fetchStats();
    } catch (error: any) {
      alert('Failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;
    try {
      await axios.delete(`${API_URL}/transactions/${id}`, config);
      alert('Transaction deleted!');
      fetchTransactions();
      fetchWallets();
      fetchStats();
    } catch (error: any) {
      alert('Failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', type: categoryType });
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, type: category.type });
    setIsCategoryModalOpen(true);
  };

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

  const handleAddSubCategory = (category: Category) => {
    setSelectedCategoryForSub(category);
    setSubCategoryForm({ name: '' });
    setIsSubCategoryModalOpen(true);
  };

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

  const handleDeleteSubCategory = async (id: string) => {
    if (!confirm('Delete this subcategory?')) return;
    try {
      await axios.delete(`${API_URL}/transaction-categories/subcategories/${id}`, config);
      fetchCategories();
    } catch (error: any) {
      alert('Failed: ' + (error.response?.data?.message || error.message));
    }
  };

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

  const getWalletIcon = (type: string) => {
    switch (type) {
      case 'BANK': return <Banknote size={24} />;
      case 'CASH': return <DollarSign size={24} />;
      case 'CREDIT_CARD': return <CreditCard size={24} />;
      default: return <Wallet size={24} />;
    }
  };

  const getWalletColor = (type: string) => {
    switch (type) {
      case 'BANK': return 'bg-blue-500/20 text-blue-400';
      case 'CASH': return 'bg-green-500/20 text-green-400';
      case 'CREDIT_CARD': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredCategories = categories.filter(c => c.type === transactionForm.type);
  const selectedCategory = categories.find(c => c.id === transactionForm.category_id);

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

  return (
    <div className="app-container">
      <div className={`sidebar-overlay ${isSidebarOpen ? 'visible' : ''}`} onClick={() => setIsSidebarOpen(false)} />

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="logo-container">
          <div className="logo-text">
            <Wallet className="w-8 h-8 text-primary" />
            <span>Taka Track</span>
          </div>
        </div>

        <nav className="nav-links">
          <a
            href="#"
            className={`nav-item ${currentPage === 'wallets' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('wallets'); }}
          >
            <Wallet size={20} />
            <span>Wallets</span>
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'transactions' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('transactions'); }}
          >
            <ArrowRightLeft size={20} />
            <span>Transactions</span>
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'categories' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('categories'); }}
          >
            <Tag size={20} />
            <span>Categories</span>
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'loans' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('loans'); }}
          >
            <Banknote size={20} />
            <span>Loans</span>
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'reports' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('reports'); }}
          >
            <BarChart3 size={20} />
            <span>Reports</span>
          </a>

          {role === 'ADMIN' && (
            <a
              href="#"
              className={`nav-item ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setCurrentPage('admin'); }}
            >
              <Shield size={20} />
              <span>Admin Panel</span>
            </a>
          )}
        </nav>

        <div className="p-6 border-t border-slate-200">
          <button
            onClick={() => { setIsLoggedIn(false); setToken(''); }}
            className="flex items-center gap-2 text-xs text-red-500 hover:underline"
          >
            <LogOut size={14} />
            Logout ({email})
          </button>
        </div>
      </aside>

      <main className="main-content animate-fade-in">
        {currentPage === 'wallets' && (
          <>
            <header className="header">
              <div className="flex items-center gap-4">
                <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <Menu size={24} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold">Wallet Management</h2>
                  <p className="text-muted">Manage your accounts and balances</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => handleExportCSV('wallets')}>
                  <Download size={18} />
                  CSV
                </button>
                <button className="btn-secondary" onClick={() => handleExportPDF('wallets')}>
                  <FileText size={18} />
                  PDF
                </button>
                <button className="btn-primary" onClick={handleAddWallet}>
                  <Plus size={18} />
                  Add Wallet
                </button>
              </div>
            </header>

            <div className="stats-grid mb-6">
              <div className="stat-card">
                <h3 className="text-muted text-sm font-medium mb-2">Total Balance</h3>
                <div className="flex items-end justify-between">
                  <span className="stat-value">${walletTotals.total.toFixed(2)}</span>
                  <span className={`trend-badge ${walletTotals.total >= 0 ? 'trend-up' : 'trend-down'}`}>
                    {wallets.length} wallets
                  </span>
                </div>
              </div>
              <div className="stat-card">
                <h3 className="text-muted text-sm font-medium mb-2">Bank Accounts</h3>
                <span className="stat-value text-blue-400">${walletTotals.bank.toFixed(2)}</span>
              </div>
              <div className="stat-card">
                <h3 className="text-muted text-sm font-medium mb-2">Cash</h3>
                <span className="stat-value text-green-400">${walletTotals.cash.toFixed(2)}</span>
              </div>
              <div className="stat-card">
                <h3 className="text-muted text-sm font-medium mb-2">Credit Cards</h3>
                <span className="stat-value text-purple-400">${walletTotals.credit.toFixed(2)}</span>
              </div>
            </div>

            <div className="section-card">
              <h3 className="text-lg font-semibold mb-6">Your Wallets ({wallets.length})</h3>
              {wallets.length === 0 ? (
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 mx-auto mb-4 text-muted opacity-50" />
                  <p className="text-muted mb-4">No wallets yet</p>
                  <button className="btn-primary" onClick={handleAddWallet}>
                    <Plus size={18} />
                    Create Your First Wallet
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wallets.map((wallet) => (
                    <div key={wallet.id} className="wallet-card">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`wallet-icon ${getWalletColor(wallet.type)}`}>
                          {getWalletIcon(wallet.type)}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditWallet(wallet)}
                            className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} className="text-primary" />
                          </button>
                          <button
                            onClick={() => handleDeleteWallet(wallet.id)}
                            className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} className="text-danger" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-semibold text-lg mb-1">{wallet.name}</h4>
                      <p className="text-sm text-muted mb-3">{wallet.type.replace('_', ' ')}</p>
                      <div className="wallet-balance">
                        <span className={Number(wallet.balance) >= 0 ? 'text-success' : 'text-danger'}>
                          ${Number(wallet.balance).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {currentPage === 'transactions' && (
          <>
            <header className="header">
              <div className="flex items-center gap-4">
                <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <Menu size={24} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold">Transactions</h2>
                  <p className="text-muted">Track your income and expenses</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => handleExportCSV('transactions')}>
                  <Download size={18} />
                  CSV
                </button>
                <button className="btn-secondary" onClick={() => handleExportPDF('transactions')}>
                  <FileText size={18} />
                  PDF
                </button>
                <button className="btn-primary" onClick={handleAddTransaction}>
                  <Plus size={18} />
                  Add Transaction
                </button>
              </div>
            </header>

            <div className="stats-grid mb-6">
              <div className="stat-card">
                <h3 className="text-muted text-sm font-medium mb-2">Balance</h3>
                <span className={`stat-value ${stats.balance >= 0 ? 'text-success' : 'text-danger'}`}>
                  ${stats.balance.toFixed(2)}
                </span>
              </div>
              <div className="stat-card">
                <h3 className="text-muted text-sm font-medium mb-2">Total Income</h3>
                <span className="stat-value text-success">${stats.totalIncome.toFixed(2)}</span>
              </div>
              <div className="stat-card">
                <h3 className="text-muted text-sm font-medium mb-2">Total Expenses</h3>
                <span className="stat-value text-danger">${stats.totalExpense.toFixed(2)}</span>
              </div>
              <div className="stat-card">
                <h3 className="text-muted text-sm font-medium mb-2">Transactions</h3>
                <span className="stat-value">{transactions.length}</span>
              </div>
            </div>

            <div className="section-card">
              <h3 className="text-lg font-semibold mb-6">Recent Transactions ({transactions.length})</h3>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <ArrowRightLeft className="w-16 h-16 mx-auto mb-4 text-muted opacity-50" />
                  <p className="text-muted mb-4">No transactions yet</p>
                  <button className="btn-primary" onClick={handleAddTransaction}>
                    <Plus size={18} />
                    Add Your First Transaction
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="transaction-item">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`icon-box ${transaction.type === 'INCOME' ? 'icon-income' : 'icon-expense'}`}>
                          {transaction.type === 'INCOME' ? <TrendingUp size={20} /> : <CreditCard size={20} />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{transaction.description || transaction.category.name}</h4>
                          <p className="text-sm text-muted">
                            {transaction.category.name}
                            {transaction.subCategory && ` • ${transaction.subCategory.name}`}
                            {' • '}{transaction.wallet.name}
                            {' • '}{new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold text-lg ${transaction.type === 'INCOME' ? 'text-success' : 'text-main'}`}>
                          {transaction.type === 'INCOME' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="p-2 hover:bg-surface/50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} className="text-danger" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {currentPage === 'categories' && (
          <>
            <header className="header">
              <div className="flex items-center gap-4">
                <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <Menu size={24} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold">Categories</h2>
                  <p className="text-muted">Manage transaction categories</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => handleExportCSV('categories')}>
                  <Download size={18} />
                  CSV
                </button>
                <button className="btn-primary" onClick={handleAddCategory}>
                  <Plus size={18} />
                  Add Category
                </button>
              </div>
            </header>

            <div className="flex gap-4 mb-6">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${categoryType === 'EXPENSE' ? 'bg-primary text-white' : 'bg-surface text-muted hover:text-white'
                  }`}
                onClick={() => setCategoryType('EXPENSE')}
              >
                Expenses
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${categoryType === 'INCOME' ? 'bg-primary text-white' : 'bg-surface text-muted hover:text-white'
                  }`}
                onClick={() => setCategoryType('INCOME')}
              >
                Income
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.filter(c => c.type === categoryType).map((category) => (
                <div key={category.id} className="bg-card border border-glass rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${category.type === 'INCOME' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        <Tag size={20} />
                      </div>
                      <h4 className="font-semibold">{category.name}</h4>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="p-1.5 hover:bg-surface rounded-lg text-muted hover:text-primary transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1.5 hover:bg-surface rounded-lg text-muted hover:text-danger transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {category.subCategories.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between text-sm bg-surface/50 px-3 py-2 rounded-md group">
                        <span className="text-muted-foreground">{sub.name}</span>
                        <button
                          onClick={() => handleDeleteSubCategory(sub.id)}
                          className="text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddSubCategory(category)}
                      className="w-full py-2 text-xs text-primary hover:bg-surface rounded-md transition-colors flex items-center justify-center gap-1 border border-dashed border-primary/30"
                    >
                      <Plus size={12} /> Add Subcategory
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {currentPage === 'loans' && (
          <>
            <header className="header">
              <div className="flex items-center gap-4">
                <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <Menu size={24} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold">Loans</h2>
                  <p className="text-muted">Track money lent and borrowed</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => handleExportCSV('loans')}>
                  <Download size={18} />
                  CSV
                </button>
                <button className="btn-secondary" onClick={() => handleExportPDF('loans')}>
                  <FileText size={18} />
                  PDF
                </button>
                <button className="btn-primary" onClick={handleAddLoan}>
                  <Plus size={18} />
                  New Loan
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Loans */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-muted">Active Loans</h3>
                {loans.filter(l => l.status === 'ACTIVE').length === 0 ? (
                  <p className="text-muted opacity-50 italic">No active loans</p>
                ) : (
                  loans.filter(l => l.status === 'ACTIVE').map(loan => (
                    <div key={loan.id} className="bg-card border border-glass rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-lg">{loan.party.name}</h4>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${loan.type === 'LENT' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                            {loan.type === 'LENT' ? 'YOU LENT' : 'YOU BORROWED'}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            ${Number(loan.remaining_amount).toFixed(2)}
                          </div>
                          <div className="text-xs text-muted">
                            of ${Number(loan.amount).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="w-full bg-surface rounded-full h-2 mb-4">
                        <div
                          className={`h-2 rounded-full ${loan.type === 'LENT' ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${(Number(loan.total_paid) / Number(loan.amount)) * 100}%` }}
                        ></div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted">
                          {new Date(loan.date).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => handleAddPayment(loan)}
                          className="text-sm text-primary hover:underline"
                        >
                          Add Payment
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Completed Loans */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-muted">Completed Loans</h3>
                {loans.filter(l => l.status === 'PAID').length === 0 ? (
                  <p className="text-muted opacity-50 italic">No completed loans</p>
                ) : (
                  loans.filter(l => l.status === 'PAID').map(loan => (
                    <div key={loan.id} className="bg-card border border-glass rounded-lg p-4 opacity-75">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold">{loan.party.name}</h4>
                          <span className="text-xs bg-surface text-muted px-2 py-1 rounded">
                            {loan.type === 'LENT' ? 'LENT' : 'BORROWED'}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-success">PAID</div>
                          <div className="text-xs text-muted">
                            ${Number(loan.amount).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted">
                        Closed on {new Date(loan.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {currentPage === 'reports' && (
          <>
            <header className="header">
              <div className="flex items-center gap-4">
                <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <Menu size={24} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold">Reports</h2>
                  <p className="text-muted">Financial insights and analytics</p>
                </div>
              </div>
              <button className="btn-primary" onClick={() => handleExportPDF('financial-report')}>
                <FileText size={18} />
                Download Report
              </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Overview */}
              <div className="bg-card border border-glass rounded-lg p-6">
                <h3 className="text-lg font-bold mb-6">Monthly Overview</h3>
                <div className="h-64 flex items-end gap-2">
                  {monthlyStats.map((stat, index) => (
                    <div key={index} className="flex-1 flex flex-col justify-end gap-1 group relative">
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-surface border border-glass px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <div className="text-success">In: ${stat.income}</div>
                        <div className="text-danger">Out: ${stat.expense}</div>
                      </div>
                      <div
                        className="w-full bg-green-500/50 hover:bg-green-500 transition-colors rounded-t"
                        style={{ height: `${Math.max(4, (stat.income / 5000) * 100)}%` }}
                      ></div>
                      <div
                        className="w-full bg-red-500/50 hover:bg-red-500 transition-colors rounded-t"
                        style={{ height: `${Math.max(4, (stat.expense / 5000) * 100)}%` }}
                      ></div>
                      <div className="text-[10px] text-center text-muted mt-1">{stat.month}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expense by Category */}
              <div className="bg-card border border-glass rounded-lg p-6">
                <h3 className="text-lg font-bold mb-6">Expenses by Category</h3>
                <div className="space-y-4">
                  {categoryStats.map((stat, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{stat.name}</span>
                        <span className="font-bold">${stat.value.toFixed(2)}</span>
                      </div>
                      <div className="w-full bg-surface rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(stat.value / (categoryStats[0]?.value || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  {categoryStats.length === 0 && (
                    <p className="text-muted text-center py-10">No expense data available</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {currentPage === 'admin' && role === 'ADMIN' && (
          <>
            <header className="header">
              <div className="flex items-center gap-4">
                <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                  <Menu size={24} />
                </button>
                <div>
                  <h2 className="text-2xl font-bold">Admin Panel</h2>
                  <p className="text-muted">System overview and user management</p>
                </div>
              </div>
              <button className="btn-primary" onClick={fetchAdminData}>
                <Activity size={18} />
                Refresh Data
              </button>
            </header>

            {adminStats && (
              <div className="stats-grid mb-6">
                <div className="stat-card">
                  <h3 className="text-muted text-sm font-medium mb-2 flex items-center gap-2">
                    <Users size={16} />
                    Total Users
                  </h3>
                  <div className="flex items-end justify-between">
                    <span className="stat-value">{adminStats.totalUsers}</span>
                    <span className="trend-badge trend-up">
                      {adminStats.activeUsers} active
                    </span>
                  </div>
                </div>
                <div className="stat-card">
                  <h3 className="text-muted text-sm font-medium mb-2">Total Transactions</h3>
                  <span className="stat-value text-blue-400">{adminStats.totalTransactions}</span>
                </div>
                <div className="stat-card">
                  <h3 className="text-muted text-sm font-medium mb-2">Total Wallets</h3>
                  <span className="stat-value text-purple-400">{adminStats.totalWallets}</span>
                </div>
                <div className="stat-card">
                  <h3 className="text-muted text-sm font-medium mb-2">Total Parties</h3>
                  <span className="stat-value text-green-400">{adminStats.totalParties}</span>
                </div>
              </div>
            )}

            <div className="section-card">
              <h3 className="text-lg font-semibold mb-6">Registered Users ({users.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-glass">
                      <th className="pb-3 text-muted font-medium">User</th>
                      <th className="pb-3 text-muted font-medium">Role</th>
                      <th className="pb-3 text-muted font-medium">Status</th>
                      <th className="pb-3 text-muted font-medium">Joined</th>
                      <th className="pb-3 text-muted font-medium">Stats</th>
                      <th className="pb-3 text-muted font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-glass/50 last:border-0">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary font-bold">
                              {user.email[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{user.email}</div>
                              <div className="text-xs text-muted">ID: {user.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-muted">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2 text-xs text-muted">
                            <span title="Wallets" className="flex items-center gap-1">
                              <Wallet size={12} /> {user._count.wallets}
                            </span>
                            <span title="Transactions" className="flex items-center gap-1">
                              <ArrowRightLeft size={12} /> {user._count.transactions}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          {user.role !== 'ADMIN' && (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleToggleUserStatus(user.id)}
                                className={`p-2 rounded-lg transition-colors ${user.is_active
                                  ? 'hover:bg-red-500/20 text-red-400'
                                  : 'hover:bg-green-500/20 text-green-400'
                                  }`}
                                title={user.is_active ? "Deactivate User" : "Activate User"}
                              >
                                {user.is_active ? <Lock size={16} /> : <Unlock size={16} />}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                title="Delete User"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Category Modal */}
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
                  className="w-full px-4 py-2 bg-surface border border-glass rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Category Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={categoryForm.type}
                  onChange={(e) => setCategoryForm({ ...categoryForm, type: e.target.value })}
                  className="w-full px-4 py-2 bg-surface border border-glass rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-surface border border-glass rounded-lg hover:bg-surface/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary justify-center"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
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
              Adding to: <span className="font-semibold text-white">{selectedCategoryForSub?.name}</span>
            </p>

            <form onSubmit={handleSubmitSubCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={subCategoryForm.name}
                  onChange={(e) => setSubCategoryForm({ ...subCategoryForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-surface border border-glass rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Subcategory Name"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsSubCategoryModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-surface border border-glass rounded-lg hover:bg-surface/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary justify-center"
                >
                  {loading ? 'Saving...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loan Modal */}
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
                    className={`flex-1 glass-btn ${loanForm.type === 'LENT'
                      ? 'glass-btn-active'
                      : 'glass-btn-secondary'
                      }`}
                  >
                    Lending Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoanForm({ ...loanForm, type: 'BORROWED' })}
                    className={`flex-1 glass-btn ${loanForm.type === 'BORROWED'
                      ? 'glass-btn-active'
                      : 'glass-btn-secondary'
                      }`}
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
                    <option key={w.id} value={w.id} className="bg-dark">{w.name} (${Number(w.balance).toFixed(2)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <input
                  type="text"
                  value={loanForm.description}
                  onChange={(e) => setLoanForm({ ...loanForm, description: e.target.value })}
                  className="w-full glass-input"
                  placeholder="Notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsLoanModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-surface border border-glass rounded-lg hover:bg-surface/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary justify-center"
                >
                  {loading ? 'Creating...' : 'Create Loan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-modal border border-glass rounded-lg max-w-md w-full p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add Payment</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-muted hover:text-main">
                <X size={24} />
              </button>
            </div>

            <p className="text-sm text-muted mb-4">
              Recording payment for loan with: <span className="font-semibold text-white">{selectedLoan?.party.name}</span>
            </p>

            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
                  <input
                    type="number"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full pl-8 pr-4 py-2 bg-surface border border-glass rounded-lg focus:outline-none focus:border-primary"
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
                  className="w-full px-4 py-2 bg-surface border border-glass rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Wallet (for transaction)</label>
                <select
                  value={paymentForm.wallet_id}
                  onChange={(e) => setPaymentForm({ ...paymentForm, wallet_id: e.target.value })}
                  className="w-full px-4 py-2 bg-surface border border-glass rounded-lg focus:outline-none focus:border-primary"
                  required
                >
                  <option value="">Select Wallet</option>
                  {wallets.map(w => (
                    <option key={w.id} value={w.id}>{w.name} (${Number(w.balance).toFixed(2)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <input
                  type="text"
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                  className="w-full px-4 py-2 bg-surface border border-glass rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-surface border border-glass rounded-lg hover:bg-surface/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary justify-center"
                >
                  {loading ? 'Saving...' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-modal border border-glass rounded-lg max-w-md w-full p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{editingWallet ? 'Edit Wallet' : 'Add Wallet'}</h3>
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
                  className="w-full px-4 py-2 bg-surface border border-glass rounded-lg focus:outline-none focus:border-primary"
                  placeholder="e.g., Main Bank Account"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={walletForm.type}
                  onChange={(e) => setWalletForm({ ...walletForm, type: e.target.value })}
                  className="w-full px-4 py-2 bg-surface border border-glass rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="BANK">Bank Account</option>
                  <option value="CASH">Cash</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Initial Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={walletForm.balance}
                  onChange={(e) => setWalletForm({ ...walletForm, balance: e.target.value })}
                  className="w-full px-4 py-2 bg-surface border border-glass rounded-lg focus:outline-none focus:border-primary"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsWalletModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-surface border border-glass rounded-lg hover:bg-surface/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary justify-center"
                >
                  {loading ? 'Saving...' : (editingWallet ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-modal border border-glass rounded-lg max-w-md w-full p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Add Transaction</h3>
              <button onClick={() => setIsTransactionModalOpen(false)} className="text-muted hover:text-main">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={transactionForm.type}
                  onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value, category_id: '', sub_category_id: '' })}
                  className="w-full glass-input"
                >
                  <option value="EXPENSE" className="bg-dark">Expense</option>
                  <option value="INCOME" className="bg-dark">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Wallet</label>
                <select
                  value={transactionForm.wallet_id}
                  onChange={(e) => setTransactionForm({ ...transactionForm, wallet_id: e.target.value })}
                  className="w-full glass-input"
                  required
                >
                  <option value="">Select wallet</option>
                  {wallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id} className="bg-dark">
                      {wallet.name} (${Number(wallet.balance).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={transactionForm.category_id}
                  onChange={(e) => setTransactionForm({ ...transactionForm, category_id: e.target.value, sub_category_id: '' })}
                  className="w-full glass-input"
                  required
                >
                  <option value="">Select category</option>
                  {filteredCategories.map((category) => (
                    <option key={category.id} value={category.id} className="bg-dark">{category.name}</option>
                  ))}
                </select>
              </div>

              {selectedCategory && selectedCategory.subCategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Subcategory (Optional)</label>
                  <select
                    value={transactionForm.sub_category_id}
                    onChange={(e) => setTransactionForm({ ...transactionForm, sub_category_id: e.target.value })}
                    className="w-full glass-input"
                  >
                    <option value="">None</option>
                    {selectedCategory.subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id} className="bg-dark">{sub.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={transactionForm.amount}
                  onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                  className="w-full glass-input"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  value={transactionForm.description}
                  onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                  className="w-full glass-input"
                  placeholder="Enter description"
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
    </div>
  );
}

export default App;
