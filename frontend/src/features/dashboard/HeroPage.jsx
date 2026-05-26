import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { 
  LayoutDashboard, BarChart3, Download, ShieldAlert, 
  ShieldCheck, CheckCircle2, ArrowUpRight, ArrowDownRight, Lock 
} from 'lucide-react';

function HeroPage({ onNavigate }) {
  const [hasBreachedBudget, setHasBreachedBudget] = useState(false);
  const [activeBudgetsCount, setActiveBudgetsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBudgetStatuses = async () => {
      try {
        const [expensesRes, budgetsRes] = await Promise.all([
          API.get('/expenses/'),
          API.get('/budgets/')
        ]);

        const transactions = expensesRes.data || [];
        const budgets = budgetsRes.data || [];
        setActiveBudgetsCount(budgets.length);

        const expenseRecords = transactions.filter(t => t.type === 'EXPENSE');
        const map = expenseRecords.reduce((acc, curr) => {
          acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
          return acc;
        }, {});

        const breached = budgets.some(b => {
          const spent = map[b.category] || 0;
          return spent >= parseFloat(b.limit);
        });

        setHasBreachedBudget(breached);
      } catch (err) {
        console.error("Failed auditing welcome screen baseline parameters:", err);
      } finally {
        setLoading(false);
      }
    };

    checkBudgetStatuses();
  }, []);

  return (
    <div className="space-y-8 md:space-y-12 py-2 box-border animate-fadeIn w-full">
      
      {/* Upper Jumbotron Frame */}
      <div className="text-center space-y-4 max-w-2xl mx-auto px-2">
        <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-blue-200/30 dark:border-blue-800/30">
          Account Overview
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
          Welcome to the Future of Accounting Control.
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
          LedgerFlow syncs your transaction logs with real-time analytics, giving you complete clarity over your personal investments and daily spending.
        </p>
        <button 
          onClick={() => onNavigate('dashboard')} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg hover:shadow-blue-600/20 cursor-pointer inline-flex items-center gap-2 active:scale-98"
        >
          Initialize Core Dashboard <LayoutDashboard size={16}/>
        </button>
      </div>

      <hr className="border-slate-100 dark:border-slate-900/50 w-1/4 mx-auto" />

      {/* Feature Display Grid Matrix */}
      <div className="space-y-4 w-full">
        <div className="flex flex-col px-1">
          <h2 className="text-xs font-black tracking-widest uppercase text-slate-400">Feature Modules</h2>
          <p className="text-[11px] text-slate-400/80">Explore active account tracking tools and services available in your workspace</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
          <div onClick={() => onNavigate('dashboard')} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3 shadow-xs hover:border-blue-500/40 transition-all duration-300 cursor-pointer group">
            <div className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 p-3 rounded-xl w-fit group-hover:scale-105 transition-transform"><BarChart3 size={22}/></div>
            <h3 className="text-base font-black text-slate-800 dark:text-white">Executive Summary Charts</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Isolate allocation pipelines via modular Pie configurations, tracking flow differences and timeline variations across real-time screens.</p>
          </div>

          <div onClick={() => onNavigate('budgets')} className={`p-6 rounded-2xl border transition-all duration-300 space-y-3 shadow-xs cursor-pointer group relative overflow-hidden ${loading ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80' : hasBreachedBudget ? 'bg-rose-50/10 dark:bg-rose-950/5 border-rose-200 dark:border-rose-900/50 hover:border-rose-500' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 hover:border-emerald-500/40'}`}>
            {loading ? (
              <div className="h-6 w-6 bg-slate-200 animate-pulse rounded-lg"></div>
            ) : hasBreachedBudget ? (
              <>
                <div className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 p-3 rounded-xl w-fit border border-rose-100 dark:border-rose-900/30 animate-pulse"><ShieldAlert size={22}/></div>
                <h3 className="text-base font-black text-rose-600 dark:text-rose-400">Budget Limit Tracker</h3>
                <p className="text-slate-400 text-xs leading-relaxed"><span className="text-rose-500 font-bold">Over Limit Alert!</span> You have exceeded your active budget caps. Click here to review your allowances.</p>
              </>
            ) : (
              <>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 p-3 rounded-xl w-fit border border-emerald-100/50 dark:border-emerald-900/20"><ShieldCheck size={22}/></div>
                <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-1.5">Budget Limit Tracker <CheckCircle2 size={14} className="text-emerald-500"/></h3>
                <p className="text-slate-400 text-xs leading-relaxed">All spending is safely within your limits. Your ({activeBudgetsCount}) active category budgets are healthy and on track.</p>
              </>
            )}
          </div>

          <div onClick={() => onNavigate('income')} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3 shadow-xs hover:border-emerald-500/40 transition-all duration-300 cursor-pointer group">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 p-3 rounded-xl w-fit group-hover:scale-105 transition-transform"><ArrowUpRight size={22}/></div>
            <h3 className="text-base font-black text-slate-800 dark:text-white">My Earnings</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Log salary payments, freelancing invoices, and returns with flexible tags and custom categories.</p>
          </div>

          <div onClick={() => onNavigate('expense')} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3 shadow-xs hover:border-rose-500/40 transition-all duration-300 cursor-pointer group">
            <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 p-3 rounded-xl w-fit group-hover:scale-105 transition-transform"><ArrowDownRight size={22}/></div>
            <h3 className="text-base font-black text-slate-800 dark:text-white">My Spending</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Log daily shopping habits, monthly utility bills, and casual cash spending to map your leaks instantly.</p>
          </div>

          <div onClick={() => onNavigate('dashboard')} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3 shadow-xs hover:border-purple-500/40 transition-all duration-300 group cursor-pointer">
            <div className="bg-purple-50 dark:bg-purple-950/20 text-purple-600 p-3 rounded-xl w-fit group-hover:scale-105 transition-transform"><Download size={22}/></div>
            <h3 className="text-base font-black text-slate-800 dark:text-white">Export Reports</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Download your entire accounting history into clean, organized Excel spreadsheets with a single click.</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3 shadow-xs hover:border-indigo-500/40 transition-all duration-300 group">
            <div className="bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl w-fit group-hover:scale-105 transition-transform"><Lock size={22}/></div>
            <h3 className="text-base font-black text-slate-800 dark:text-white">Data Privacy</h3>
            <p className="text-slate-400 text-xs leading-relaxed">Your financial data is 100% secure and private. Your numbers are fully encrypted and visible only to you.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default HeroPage;