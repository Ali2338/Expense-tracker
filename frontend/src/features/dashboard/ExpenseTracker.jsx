import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { 
  Sun, Moon, LogOut, Wallet, LayoutDashboard, 
  ArrowUpRight, ArrowDownRight, Compass, ShieldAlert, 
  Menu, X 
} from 'lucide-react';
import BudgetManager from './BudgetManager';

// Subpage Component Imports
import HeroPage from './HeroPage';
import CentralDashboard from './CentralDashboard';
import IncomePage from './IncomePage';
import ExpensePage from './ExpensePage';

function ExpenseTracker({ onLogout }) {
  const { isDark, toggleTheme } = useTheme();
  const [currentView, setCurrentView] = useState('hero'); 
  const [transactions, setTransactions] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/expenses/');
      setTransactions(res.data);
    } catch (err) {
      if (err.response?.status === 401) onLogout();
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleLogTransaction = async (data) => {
    try {
      const payload = {
        title: data.title ? data.title.trim() : 'Untitled Transaction',
        amount: parseFloat(data.amount) && !isNaN(data.amount) ? parseFloat(data.amount) : 0.00,
        type: (data.type || 'EXPENSE').toUpperCase(), 
        category: data.category || (data.type === 'INCOME' ? 'Salary' : 'Food'),
        date: data.date || new Date().toISOString().split('T')[0] 
      };

      await API.post('/expenses/', payload);
      fetchTransactions();
    } catch (err) {
      console.error("Failed executing entry log:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/expenses/${id}/`);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const response = await API.get('/expenses/export_excel/', { responseType: 'blob' });
      const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `LedgerFlow_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
    } catch (err) {
      console.error("Excel stream error:", err);
    }
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false); 
  };

  const incomeRecords = transactions.filter(t => t.type === 'INCOME');
  const expenseRecords = transactions.filter(t => t.type === 'EXPENSE');

  const totalIncome = incomeRecords.reduce((sum, r) => sum + parseFloat(r.amount), 0);
  const totalExpense = expenseRecords.reduce((sum, r) => sum + parseFloat(r.amount), 0);
  const netBalance = totalIncome - totalExpense;

  const mapCategories = (records) => {
    const map = records.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
      return acc;
    }, {});
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  };

  const expensePieData = mapCategories(expenseRecords);
  const incomePieData = mapCategories(incomeRecords);
  const mainTimelineData = transactions.map(t => ({
    date: t.date,
    Amount: parseFloat(t.amount),
    Type: t.type
  })).reverse();

  const navItems = [
    { id: 'hero', name: 'App Overview Tour', icon: <Compass size={18} />, colorClass: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' },
    { id: 'dashboard', name: 'Central Dashboard', icon: <LayoutDashboard size={18} />, colorClass: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' },
    { id: 'income', name: 'Income Management', icon: <ArrowUpRight size={18} />, colorClass: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' },
    { id: 'expense', name: 'Expense Management', icon: <ArrowDownRight size={18} />, colorClass: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600' },
    { id: 'budgets', name: 'Budget Boundaries', icon: <ShieldAlert size={18} />, colorClass: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400' },
  ];

  const renderNavButtons = () => (
    <nav className="space-y-1 w-full">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigation(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all active:scale-[0.98] ${
            currentView === item.id ? item.colorClass : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          {item.icon} <span className="truncate">{item.name}</span>
        </button>
      ))}
    </nav>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen w-full max-w-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 overflow-hidden">

      {/* 📱 PORTABLE TOP HEADER BAR */}
      <header className="md:hidden w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-40 flex items-center justify-between box-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-xs"><Wallet size={18} /></div>
          <span className="font-bold tracking-tight">LedgerFlow</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 outline-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* 🖥️ DESKTOP SIDEBAR PANEL LAYOUT */}
      {/* 👑 FLOATING SIDEBAR UPGRADE: Reduced height using calc, added subtle margin alignments, and soft rounded curves */}
      <aside className="w-64 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 flex flex-col justify-between hidden md:flex h-[calc(100vh-2rem)] my-4 ml-4 rounded-2xl shadow-xs box-border shrink-0 z-30 sticky top-4">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-xs"><Wallet size={20} /></div>
            <span className="font-bold text-lg tracking-tight">LedgerFlow</span>
          </div>
          {renderNavButtons()}
        </div>

        <div className="space-y-2">
          <button onClick={toggleTheme} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span>Interface Theme</span>
            {isDark ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} />}
          </button>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-rose-600 cursor-pointer transition-colors">
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* 📱 MOBILE DRAWERS SLIDING OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex flex-col w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full p-5 shadow-2xl border-r border-slate-200 dark:border-slate-800 overlay-container animate-slideRight box-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="bg-blue-600 p-2 rounded-xl text-white"><Wallet size={18} /></div>
                <span className="font-bold tracking-tight">LedgerFlow</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 transition-all cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">{renderNavButtons()}</div>

            <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <button onClick={toggleTheme} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span>Interface Theme</span>
                {isDark ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} />}
              </button>
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-rose-600 transition-colors">
                <LogOut size={18} /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🖥️ DYNAMIC WORKSPACE CANVAS */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full relative box-border h-full overflow-y-auto">
        {currentView === 'hero' && <HeroPage onNavigate={handleNavigation} />}
        {currentView === 'budgets' && <BudgetManager expensePieData={expensePieData} onBudgetChange={fetchTransactions} />}
        {currentView === 'dashboard' && <CentralDashboard totalIncome={totalIncome} totalExpense={totalExpense} netBalance={netBalance} mainTimelineData={mainTimelineData} expensePieData={expensePieData} incomePieData={incomePieData} handleDownloadExcel={handleDownloadExcel} isDark={isDark} />}
        {currentView === 'income' && <IncomePage incomeRecords={incomeRecords} incomeChartData={incomePieData} onLogTransaction={handleLogTransaction} onDeleteTransaction={handleDelete} />}
        {currentView === 'expense' && <ExpensePage expenseRecords={expenseRecords} expenseChartData={expensePieData} onLogTransaction={handleLogTransaction} onDeleteTransaction={handleDelete} />}
      </main>
    </div>
  );
}

export default ExpenseTracker;