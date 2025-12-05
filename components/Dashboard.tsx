
import React, { useState } from 'react';
import { Product, Sale } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { DollarSign, Package, AlertTriangle, Activity, Sparkles, Loader2, TrendingUp } from 'lucide-react';
import { analyzeInventoryTrends } from '../services/geminiService';

interface DashboardProps {
  products: Product[];
  sales: Sale[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308'];

const Dashboard: React.FC<DashboardProps> = ({ products, sales }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const totalItems = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockItems = products.filter(p => p.stock <= p.minStock);
  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
  
  // Prepare Category Data
  const categoryMap = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.stock;
    return acc;
  }, {} as Record<string, number>);
  
  const categoryData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  // Prepare Top Selling Products (by Revenue)
  const productRevenueMap = sales.reduce((acc, s) => {
    acc[s.productName] = (acc[s.productName] || 0) + s.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const topSellingData = Object.keys(productRevenueMap)
    .map(key => ({
      name: key.length > 15 ? key.substring(0, 15) + '...' : key,
      value: productRevenueMap[key]
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const handleGetInsights = async () => {
    setLoadingInsight(true);
    try {
        const result = await analyzeInventoryTrends(products);
        setInsight(result);
    } catch (e) {
        setInsight("Failed to load insights.");
    } finally {
        setLoadingInsight(false);
    }
  };

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time inventory metrics and sales analytics.</p>
        </div>
        <button 
            onClick={handleGetInsights}
            disabled={loadingInsight}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
        >
            {loadingInsight ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {loadingInsight ? 'Analyzing...' : 'Ask AI Analyst'}
        </button>
      </div>

      {insight && (
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border border-indigo-100 dark:border-slate-700 p-6 rounded-xl shadow-sm">
              <div className="flex items-start gap-4">
                  <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-lg text-indigo-600 dark:text-indigo-300">
                      <Sparkles size={24} />
                  </div>
                  <div>
                      <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">AI Inventory Analyst Says:</h3>
                      <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                          {insight}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Items in Stock</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalItems}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Low Stock Alerts</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">{lowStockItems.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Inventory Value</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">${totalInventoryValue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-96">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Stock by Category</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 h-96">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Top Selling Products (Revenue)</h3>
          {topSellingData.length > 0 ? (
            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={topSellingData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                <p>No sales data yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
