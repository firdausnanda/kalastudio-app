import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import DashboardFooter from '@/Components/DashboardFooter';

export default function BroadcastShow({ auth, broadcast }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getStatusInfo = (status) => {
        const info = {
            pending: { color: 'amber', icon: 'pending', label: 'Menunggu' },
            sending: { color: 'blue', icon: 'send', label: 'Sedang Dikirim' },
            completed: { color: 'emerald', icon: 'check_circle', label: 'Selesai' },
            failed: { color: 'red', icon: 'error', label: 'Gagal' },
        };
        return info[status] || info.pending;
    };

    const status = getStatusInfo(broadcast.status);

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display transition-all">
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Head title={`Broadcast Detail - #${broadcast.id}`} />

            <div className="flex flex-grow relative overflow-hidden">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="flex items-center gap-6">
                            <Link 
                                href={route('admin.broadcasts.index')}
                                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-50 transition-all shadow-sm group"
                            >
                                <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                            </Link>
                            <div className="flex-grow">
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-3xl font-black tracking-tight">Detail Broadcast</h1>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-${status.color}-50 text-${status.color}-500 dark:bg-${status.color}-500/10 border border-${status.color}-100 dark:border-${status.color}-500/20`}>
                                        {status.label}
                                    </span>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Laporan pengiriman pesan untuk broadcast ID #{broadcast.id}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Stats Cards */}
                            {[
                                { label: 'Tipe', value: broadcast.type, icon: broadcast.type === 'whatsapp' ? 'chat' : 'mail', color: 'blue' },
                                { label: 'Terkirim', value: `${broadcast.sent_count}/${broadcast.total_count}`, icon: 'how_to_reg', color: 'emerald' },
                                { label: 'Tanggal', value: new Date(broadcast.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), icon: 'event', color: 'slate' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500 flex items-center justify-center shadow-sm`}>
                                        <span className="material-symbols-outlined">{stat.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white capitalize">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden divide-y divide-slate-50 dark:divide-slate-800/50">
                            {/* Broadcast Info Header */}
                            <div className="p-8 md:p-10">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">person</span>
                                    Informasi Broadcast
                                </h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pengirim</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{broadcast.creator?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Role</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{broadcast.target_role || 'Semua Pengguna'}</p>
                                        </div>
                                    </div>
                                    {broadcast.subject && (
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subjek</p>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{broadcast.subject}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="p-8 md:p-10 bg-slate-50/30 dark:bg-slate-800/10">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">subject</span>
                                    Isi Pesan
                                </h3>
                                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-inner">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                        {broadcast.message}
                                    </p>
                                </div>
                            </div>

                            {/* Error Details if Failed */}
                            {broadcast.status === 'failed' && broadcast.error_message && (
                                <div className="p-8 md:p-10 bg-red-50/30 dark:bg-red-500/5">
                                    <h3 className="text-xs font-black text-red-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">error</span>
                                        Detail Kesalahan
                                    </h3>
                                    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-red-100 dark:border-red-500/20">
                                        <p className="text-xs font-bold text-red-600 dark:text-red-400">{broadcast.error_message}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
            <DashboardFooter />
        </div>
    );
}
