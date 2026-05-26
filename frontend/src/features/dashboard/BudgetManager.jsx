import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { ShieldCheck, Sliders, AlertTriangle, Sparkles } from 'lucide-react';

const MASTER_CATEGORIES = ['Food', 'Travel', 'Entertainment', 'Bills', 'Other'];

function BudgetManager({ expensePieData, onBudgetChange }) {
  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState('');
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBudgets = async () => {
    try {
      const res = await API.get('/budgets/');
      setBudgets(res.data);
      if (onBudgetChange) onBudgetChange(); 
    } catch (err) {
      console.error("Failed fetching limits tracker configuration matrices:", err);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const existing = budgets.find(b => b.category.toLowerCase() === category.toLowerCase());
      
      if (existing) {
        await API.put(`/budgets/${existing.id}/`, { category, limit: parseFloat(limit) });
      } else {
        await API.post('/budgets/', { category, limit: parseFloat(limit) });
      }
      setLimit('');
      fetchBudgets();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full box-border">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        
        {/* Form Limit Creator Panel */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs w-full box-border">
          <h3 className="text-sm font-black mb-3 flex items-center gap-2 text-slate-800 dark:text-white">
            Set Budget <Sliders size={16} className="text-blue-500"/>
          </h3>
          <form onSubmit={handleSetBudget} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white focus:border-blue-500 transition-colors cursor-pointer">
                {MASTER_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Monthly Limit (₹)</label>
              <input type="number" step="0.01" value={limit} onChange={e => setLimit(e.target.value)} placeholder="e.g. 15,000.00" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white focus:border-blue-500 transition-colors" required />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/10 active:scale-98 transition-all disabled:opacity-50">
              <ShieldCheck size={14}/> {isLoading ? 'Processing...' : 'Save Budget'}
            </button>
          </form>
        </div>

        {/* Progress Metrics Workspace Display */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs space-y-4 w-full box-border">
          <h3 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
            Budget Progress <Sparkles size={14} className="text-amber-500"/>
          </h3>
          
          <div className="space-y-4 w-full">
            {MASTER_CATEGORIES.map(catName => {
              const expenseMatch = expensePieData.find(e => e.name.toLowerCase() === catName.toLowerCase());
              const totalSpent = expenseMatch ? parseFloat(expenseMatch.value) : 0;

              const budgetMatch = budgets.find(b => b.category.toLowerCase() === catName.toLowerCase());
              const budgetLimit = budgetMatch ? parseFloat(budgetMatch.limit) : 0;
              const percentUsed = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;

              let trackProgressColor = "bg-emerald-500";
              let containerBorderHighlight = "border-slate-100 dark:border-slate-800/80";
              let animationsGlowModifier = "";

              if (percentUsed >= 100) {
                trackProgressColor = "bg-rose-600";
                containerBorderHighlight = "border-rose-500/40 dark:border-rose-900/50 bg-rose-50/5";
                animationsGlowModifier = "animate-pulse shadow-[0_0_12px_rgba(225,29,72,0.4)]";
              } else if (percentUsed >= 75) {
                trackProgressColor = "bg-amber-500";
              }

              return (
                <div key={catName} className={`p-4 rounded-xl border ${containerBorderHighlight} transition-all duration-300 w-full box-border`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between text-xs font-bold mb-2 gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-800 dark:text-slate-200">{catName}</span>
                      {percentUsed >= 100 && <AlertTriangle size={14} className="text-rose-500 animate-bounce" />}
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 text-xs break-all sm:break-normal">
                      ₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span className="text-slate-300 dark:text-slate-700">/</span> {budgetLimit > 0 ? `₹${budgetLimit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : 'No Limit'}
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-800">
                    <div className={`h-full transition-all duration-500 ${trackProgressColor} ${animationsGlowModifier}`} style={{ width: `${Math.min(percentUsed, 100)}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 text-[10px] font-semibold text-slate-400">
                    <span>{budgetLimit > 0 ? `${percentUsed.toFixed(1)}% Spent` : '0.0% Spent'}</span>
                    <span className="truncate max-w-[150px] sm:max-w-none">
                      {budgetLimit > 0 ? (
                        percentUsed >= 100 ? 'Budget Exceeded!' : `₹${Math.max(0, budgetLimit - totalSpent).toLocaleString('en-IN', { minimumFractionDigits: 2 })} Remaining`
                      ) : (
                        'No limit configured'
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default BudgetManager;