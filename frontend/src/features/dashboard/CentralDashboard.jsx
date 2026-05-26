import React from 'react';
import { ArrowUpRight, ArrowDownRight, Download, TrendingUp, Activity, Wallet, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, AreaChart, Area } from 'recharts';

function CentralDashboard({ totalIncome, totalExpense, netBalance, mainTimelineData, expensePieData, incomePieData, handleDownloadExcel, isDark }) {
  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn w-full box-border">
      
      {/* Action Header Card Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-slate-900/50 dark:to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl border border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            My Financial Hub <Activity className="text-blue-400 animate-pulse" size={20}/>
          </h2>
          <p className="text-slate-400 text-xs mt-1">A complete view of your money, active budgets, and recent spending habits.</p>
        </div>
        <button 
          onClick={handleDownloadExcel} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20 active:scale-95 w-full sm:w-fit"
        >
          <Download size={14}/> Export Financial Statement
        </button>
      </div>

      {/* Metrics Layout Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        
        {/* Income Card */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between shadow-xs relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Total Income</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-500 mt-1">
              ₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl text-emerald-600 border border-emerald-100/50 dark:border-emerald-900/50 shrink-0"><ArrowUpRight size={22}/></div>
        </div>

        {/* Expense Card */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between shadow-xs relative overflow-hidden group hover:border-rose-500/30 transition-all">
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Total Expenses</p>
            <p className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-500 mt-1">
              -₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl text-rose-600 border border-rose-100/50 dark:border-rose-900/50 shrink-0"><ArrowDownRight size={22}/></div>
        </div>

        {/* Net Balance Card */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-between shadow-xs relative overflow-hidden group hover:border-blue-500/30 transition-all col-span-1 sm:col-span-2 md:col-span-1">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/10 transition-all"></div>
          <div>
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Net Balance</p>
            <p className={`text-2xl sm:text-3xl font-black mt-1 ${netBalance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-amber-500'}`}>
              {netBalance < 0 ? '-' : ''}₹{Math.abs(netBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl text-blue-600 border border-blue-100/50 dark:border-blue-900/50 shrink-0"><Wallet size={22}/></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        
        {/* Chart 1: Income vs Expenses Bar Chart */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs w-full overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-blue-500" />
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Income vs Expenses</h3>
          </div>
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{name: 'Cash Flow', Income: totalIncome, Expense: totalExpense}]} barGap={8}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false}/>
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false}/>
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={isDark ? { background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' } : { borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}/>
                <Legend verticalAlign="top" height={36} iconType="circle"/>
                <Bar dataKey="Income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={50} />
                <Bar dataKey="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Spending Timeline Chart */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs w-full overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-indigo-500" />
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Spending History</h3>
          </div>
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mainTimelineData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false}/>
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false}/>
                <Tooltip contentStyle={isDark ? { background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' } : { borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}/>
                <Area type="monotone" dataKey="Amount" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Expense Categories Pie Chart */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs w-full overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon size={16} className="text-rose-500" />
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Expense Breakdown</h3>
          </div>
          <div className="w-full h-64 sm:h-72 flex items-center justify-center">
            {expensePieData.length === 0 ? (
              <p className="text-xs text-slate-400">Log your expenses to view your category spending breakdown.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expensePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={35} paddingAngle={4} label={{ fontSize: 10 }} line={false}>
                    {expensePieData.map((e, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={isDark ? { background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' } : { borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}/>
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11 }}/>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Chart 4: Income Sources Donut Chart */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800/60 shadow-xs w-full overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <PieIcon size={16} className="text-emerald-500" />
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Income Sources</h3>
          </div>
          <div className="w-full h-64 sm:h-72 flex items-center justify-center">
            {incomePieData.length === 0 ? (
              <p className="text-xs text-slate-400">Log your incoming deposits to track your revenue distribution.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={incomePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4} label={{ fontSize: 10 }} line={false}>
                    {incomePieData.map((e, i) => <Cell key={i} fill={PIE_COLORS[(i + 2) % PIE_COLORS.length]}/>)}
                  </Pie>
                  <Tooltip contentStyle={isDark ? { background: '#0f172a', border: '1px solid #334155', borderRadius: '12px' } : { borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}/>
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 11 }}/>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default CentralDashboard;