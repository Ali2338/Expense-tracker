import React, { useState } from 'react';
import { PlusCircle, Trash2, ArrowDownRight, Calendar, Tag, ShoppingBag } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

function ExpensePage({ expenseRecords, expenseChartData, onLogTransaction, onDeleteTransaction }) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState('');

  const submitForm = (e) => {
    e.preventDefault();
    onLogTransaction({ title, amount, category, date, type: 'EXPENSE' });
    setTitle(''); setAmount(''); setCategory('Food'); setDate('');
  };

  return (
    <div className="space-y-6 animate-fadeIn w-full box-border">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-rose-600 flex items-center gap-2">
          Expense Portal <ArrowDownRight size={24}/>
        </h2>
        <p className="text-slate-400 text-xs mt-0.5">Track, record, and monitor your daily spending and monthly bills.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start w-full">
        
        {/* Input Form Panel */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs w-full box-border">
          <h3 className="text-sm font-bold mb-4 text-slate-900 dark:text-white">Add Expense</h3>
          <form onSubmit={submitForm} className="space-y-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
              <div className="relative">
                <ShoppingBag className="absolute left-3.5 top-3 text-slate-400" size={16}/>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Groceries" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white focus:border-rose-500 transition-colors" required />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-slate-400 text-xs font-bold">₹</span>
                <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white focus:border-rose-500 transition-colors" required />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Category</label>
              <div className="relative">
                <Tag className="absolute left-3.5 top-3 text-slate-400" size={16}/>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white focus:border-rose-500 transition-colors cursor-pointer" required>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Bills">Bills</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 text-slate-400" size={16}/>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs outline-none text-slate-900 dark:text-white focus:border-rose-500 transition-colors" required />
              </div>
            </div>

            <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/10 active:scale-[0.99] transition-all"><PlusCircle size={14} /> Add Transaction</button>
          </form>
        </div>

        {/* Chart Summary Desk & Feed List */}
        <div className="lg:col-span-2 space-y-6 w-full box-border">
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs w-full overflow-hidden">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">Expense Categories</h3>
            <div className="w-full h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={expenseChartData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false}/>
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false}/>
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2.5} activeDot={{ r: 5 }} dot={{strokeWidth: 2}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* History Feed List */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xs max-h-[350px] overflow-y-auto space-y-2 w-full box-border">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Recent Expenses</h3>
            {expenseRecords.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No expenses logged yet.</p>
            ) : (
              expenseRecords.map(item => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100/70 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-950/80 transition-all group gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="p-2 bg-rose-100/50 dark:bg-rose-950/40 text-rose-600 rounded-lg text-xs font-bold shrink-0">-₹</div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate">{item.date} <span className="mx-0.5 sm:mx-1">•</span> <span className="uppercase font-bold text-[9px] text-slate-500">{item.category}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <span className="text-slate-900 dark:text-slate-100 font-extrabold text-xs sm:text-sm whitespace-nowrap">
                      -₹{parseFloat(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <button onClick={() => onDeleteTransaction(item.id)} className="text-slate-300 hover:text-rose-500 cursor-pointer p-1 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default ExpensePage;