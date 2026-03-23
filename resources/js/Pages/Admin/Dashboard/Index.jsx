import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';

export default function AdminDashboard({ stats, recent_users }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Use real transaction data from backend
    const chartData = stats.monthly_transactions?.length > 0 
        ? stats.monthly_transactions.map(item => ({
            name: item.month,
            total: parseFloat(item.total)
        }))
        : [
            { name: 'Jan', total: 0 },
            { name: 'Feb', total: 0 },
            { name: 'Mar', total: 0 },
            { name: 'Apr', total: 0 },
            { name: 'May', total: 0 },
        ];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);
    };

    const statCards = [
        { 
            name: 'Total Pengguna', 
            value: stats.total_users, 
            growth: stats.users_growth,
            icon: 'group', 
            color: 'from-blue-600 to-indigo-600',
            bgColor: 'bg-blue-500/10',
            textColor: 'text-blue-600'
        },
        { 
            name: 'Total Bisnis', 
            value: stats.total_businesses, 
            growth: stats.businesses_growth,
            icon: 'business', 
            color: 'from-emerald-500 to-teal-600',
            bgColor: 'bg-emerald-500/10',
            textColor: 'text-emerald-600'
        },
        { 
            name: 'Transaksi Bulan Ini', 
            value: formatCurrency(stats.total_monthly_paid ?? 0), 
            growth: stats.paid_growth,
            icon: 'payments', 
            color: 'from-amber-500 to-orange-600',
            bgColor: 'bg-amber-500/10',
            textColor: 'text-amber-600'
        },
    ];

    return (
        <div className="bg-[#f8fafc] dark:bg-[#020617] min-h-screen flex flex-col font-display transition-colors duration-500 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10 -translate-x-1/4 translate-y-1/4"></div>

            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Head title="Admin Dashboard" />

            <div className="flex flex-grow relative">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main className={`flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-0' : ''}`}>
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Admin Dashboard</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Selamat datang kembali! Berikut ringkasan platform Kalastudio hari ini.</p>
                            </div>
                            <div className="flex gap-3">
                                <button className="px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                                    Unduh Laporan
                                </button>
                                <button className="px-5 py-2.5 bg-primary text-white rounded-2xl text-sm font-bold hover:shadow-lg hover:shadow-primary/30 transition-all">
                                    Pengaturan Global
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {statCards.map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900/50 backdrop-blur-sm p-7 rounded-[32px] border border-slate-100 dark:border-slate-800/50 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-none transition-all duration-500 group relative overflow-hidden">
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className={`w-14 h-14 rounded-2xl ${stat.bgColor} flex items-center justify-center ${stat.textColor} transform group-hover:scale-110 transition-all duration-500 group-hover:rotate-3`}>
                                            <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.name}</p>
                                            <div className="flex items-baseline gap-2">
                                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                                                    {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                                                </h3>
                                                <span className={`text-xs font-bold ${stat.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                    {stat.growth >= 0 ? '+' : ''}{stat.growth}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Gradient Accent */}
                                    <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${stat.color} group-hover:w-full transition-all duration-700`}></div>
                                </div>
                            ))}
                        </div>

                        {/* Middle Section: Chart and Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Chart Card */}
                            <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 backdrop-blur-sm p-8 rounded-[40px] border border-slate-100 dark:border-slate-800/50 shadow-sm relative overflow-hidden group">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Statistik Transaksi</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total transaksi PAID 6 bulan terakhir</p>
                                    </div>
                                    <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold py-2 px-4 focus:ring-2 focus:ring-primary/20 transition-all">
                                        <option>Januari - Mei</option>
                                        <option>Juni - Desember</option>
                                    </select>
                                </div>
                                <div className="h-[300px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis 
                                                dataKey="name" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                                                dx={-10}
                                            />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: '#1e293b', 
                                                    border: 'none', 
                                                    borderRadius: '16px', 
                                                    color: '#fff',
                                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                                }}
                                                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                                labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '10px' }}
                                                formatter={(value) => formatCurrency(value)}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="total" 
                                                stroke="#6366f1" 
                                                strokeWidth={4}
                                                fillOpacity={1} 
                                                fill="url(#colorUsers)" 
                                                animationDuration={2000}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Recent Activity / Side Card */}
                            <div className="bg-primary p-8 rounded-[40px] shadow-2xl shadow-primary/20 relative overflow-hidden flex flex-col justify-between group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-x-[-20%] -translate-y-[20%] blur-3xl group-hover:scale-125 transition-all duration-700"></div>
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6">
                                        <span className="material-symbols-outlined">rocket_launch</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white leading-tight mb-2">Upgrade Bisnis Anda</h3>
                                    <p className="text-white/70 text-sm font-medium leading-relaxed">Kelola semua integrasi WhatsApp dalam satu dashboard terpusat yang aman dan andal.</p>
                                </div>
                                <div className="relative z-10 pt-8">
                                    <Link href="/admin/users" className="inline-flex items-center gap-2 text-white font-bold group/btn">
                                        Kelola Pengguna
                                        <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Recent Users Section */}
                        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-[40px] border border-slate-100 dark:border-slate-800/50 shadow-sm overflow-hidden">
                            <div className="px-8 py-7 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Pengguna Terbaru</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monitoring registrasi akun baru</p>
                                </div>
                                <Link 
                                    href="/admin/users" 
                                    className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
                                >
                                    Lihat Semua
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-800/10">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profil & Nama</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Terdaftar Pada</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {recent_users.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-black text-xs border border-white dark:border-slate-600 shadow-sm">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <span className="text-sm font-black text-slate-900 dark:text-white capitalize block">{user.name}</span>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID: #{user.id}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{user.email}</span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="text-sm text-slate-500 dark:text-slate-500 font-medium">
                                                        {new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                                        Aktif
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <DashboardFooter />
        </div>
    );
}
