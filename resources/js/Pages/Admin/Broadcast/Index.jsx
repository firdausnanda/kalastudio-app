import { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import Swal from 'sweetalert2';

export default function BroadcastIndex({ auth, broadcasts }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDelete = (broadcast) => {
        Swal.fire({
            title: 'Hapus Riwayat?',
            text: `Riwayat broadcast ini akan dihapus.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.broadcasts.destroy', broadcast.id), {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire('Terhapus!', 'Riwayat telah berhasil dihapus.', 'success')
                });
            }
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20',
            sending: 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 active-pulse',
            completed: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20',
            failed: 'bg-red-50 text-red-600 dark:bg-red-500/10 border-red-100 dark:border-red-500/20',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display">
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Head title="Broadcast Message" />

            <div className="flex flex-grow relative overflow-hidden">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Broadcast</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Kirim pesan massal ke pengguna Anda.</p>
                            </div>
                            <Link
                                href={route('admin.broadcasts.create')}
                                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-colors shadow-lg shadow-red-500/30 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">campaign</span>
                                Buat Broadcast
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pesan & Tipe</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Progress</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {broadcasts.data.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <span className="material-symbols-outlined text-4xl text-slate-200">campaign</span>
                                                        <p className="text-slate-400 font-bold text-sm">Belum ada riwayat broadcast.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            broadcasts.data.map((broadcast) => (
                                                <tr key={broadcast.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <div className="max-w-xs overflow-hidden">
                                                            <p className="text-sm font-black text-slate-900 dark:text-white truncate" title={broadcast.message}>
                                                                {broadcast.message}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                                                                <span className="material-symbols-outlined text-xs">
                                                                    {broadcast.type === 'whatsapp' ? 'chat' : broadcast.type === 'email' ? 'mail' : 'send'}
                                                                </span>
                                                                {broadcast.type}
                                                            </p>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                            {broadcast.target_role || 'Semua Pengguna'}
                                                        </p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        {getStatusBadge(broadcast.status)}
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="w-32">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                    {broadcast.sent_count}/{broadcast.total_count}
                                                                </span>
                                                                <span className="text-[10px] font-black text-red-500">
                                                                    {broadcast.total_count > 0 ? Math.round((broadcast.sent_count / broadcast.total_count) * 100) : 0}%
                                                                </span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                <div 
                                                                    className={`h-full bg-red-500 transition-all duration-500 ${broadcast.status === 'sending' ? 'animate-pulse' : ''}`}
                                                                    style={{ width: `${broadcast.total_count > 0 ? (broadcast.sent_count / broadcast.total_count) * 100 : 0}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <Link
                                                                href={route('admin.broadcasts.show', broadcast.id)}
                                                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-black"
                                                            >
                                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(broadcast)}
                                                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                                            >
                                                                <span className="material-symbols-outlined text-lg">delete</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="px-8 py-6 bg-slate-50/50 flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Halaman {broadcasts.current_page} dari {broadcasts.last_page}
                                </p>
                                <div className="flex gap-2">
                                    {broadcasts.links.map((link, i) => (
                                        <Link 
                                            key={i} 
                                            href={link.url || '#'} 
                                            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                                                link.active 
                                                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20' 
                                                    : 'bg-white text-slate-500 hover:bg-slate-50'
                                            } ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}`} 
                                            dangerouslySetInnerHTML={{ __html: link.label }} 
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <DashboardFooter />
            <style jsx>{`
                .active-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: .7; }
                }
            `}</style>
        </div>
    );
}
