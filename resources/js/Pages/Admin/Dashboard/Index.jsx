import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import DashboardFooter from '@/Components/DashboardFooter';

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

    const statCards = [
        { name: 'Total Pengguna', value: stats.total_users, icon: 'group', color: 'blue' },
        { name: 'Total Bisnis', value: stats.total_businesses, icon: 'business', color: 'emerald' },
        { name: 'WhatsApp Aktif', value: stats.total_whatsapps, icon: 'chat', color: 'green' },
    ];

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display transition-colors duration-300">
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Head title="Admin Dashboard" />

            <div className="flex flex-grow relative overflow-hidden">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300 ease-in-out">
                    <div className="max-w-6xl mx-auto space-y-10">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Admin Dashboard</h2>
                                <p className="text-slate-500 dark:text-slate-400">Ringkasan statistik seluruh platform Kalastudio.</p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {statCards.map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative group overflow-hidden">
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className={`w-16 h-16 rounded-3xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500 transform group-hover:scale-110 transition-all duration-500`}>
                                            <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.name}</p>
                                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">{stat.value}</h3>
                                        </div>
                                    </div>
                                    <div className={`absolute -right-4 -bottom-4 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Users Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                            <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">Pengguna Terbaru</h3>
                                <Link href="/admin/users" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Lihat Semua</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                            <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Nama</th>
                                            <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
                                            <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-widest">Terdaftar</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {recent_users.map((user) => (
                                            <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-8 py-6 text-sm font-black text-slate-900 dark:text-white capitalize">{user.name}</td>
                                                <td className="px-8 py-6 text-sm text-slate-500 dark:text-slate-400">{user.email}</td>
                                                <td className="px-8 py-6 text-sm text-slate-500 dark:text-slate-400">
                                                    {new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
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
