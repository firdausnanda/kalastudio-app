import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';

export default function ActivityLogIndex({ auth, logs, filters }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedLog, setSelectedLog] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

    const openDetailModal = (log) => {
        setSelectedLog(log);
        setIsDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setIsDetailModalOpen(false);
        setSelectedLog(null);
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const formatSubjectType = (type) => {
        if (!type) return 'System';
        return type.split('\\').pop();
    };

    const getEventColor = (event) => {
        switch (event) {
            case 'created': return 'emerald';
            case 'updated': return 'blue';
            case 'deleted': return 'red';
            default: return 'slate';
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display transition-colors duration-300">
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Head title="Activity Log" />

            <div className="flex flex-grow relative overflow-hidden">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300 ease-in-out">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Activity Log</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Pantau seluruh aktivitas dan perubahan data dalam sistem.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="px-5 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{logs.total} Total Aktivitas</span>
                                </div>
                            </div>
                        </div>

                        {/* Search & Table Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
                            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="relative w-full md:w-96 group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">search</span>
                                    <input
                                        type="text"
                                        placeholder="Cari aktivitas..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (window.location.href = route('admin.activity-logs.index', { search: searchQuery }))}
                                        className="w-full pl-12 pr-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none outline-none focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-bold dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Waktu</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pelaku</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aksi</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Subjek</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {logs.data.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <span className="material-symbols-outlined text-4xl text-slate-200">history_toggle_off</span>
                                                        <p className="text-slate-400 font-bold text-sm">Tidak ada log aktivitas ditemukan.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            logs.data.map((log) => (
                                                <tr key={log.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                                                                {new Date(log.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-bold tracking-wider">
                                                                {new Date(log.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 font-black text-[10px]">
                                                                {log.causer ? getInitials(log.causer.name) : 'SYS'}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-slate-900 dark:text-white">{log.causer ? log.causer.name : 'System'}</p>
                                                                <p className="text-[9px] text-slate-400 font-bold tracking-tight">{log.causer ? log.causer.email : 'Automated Action'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-${getEventColor(log.event)}-500/10 text-${getEventColor(log.event)}-500`}>
                                                                {log.description}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                                                                {formatSubjectType(log.subject_type)}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 font-bold">
                                                                ID: {log.subject_id || '-'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-center">
                                                        <button
                                                            onClick={() => openDetailModal(log)}
                                                            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-95"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">visibility</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/10 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Halaman {logs.current_page} dari {logs.last_page}
                                </p>
                                <div className="flex gap-2">
                                    {logs.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`
                                                px-3 py-1.5 rounded-lg text-xs font-black transition-all
                                                ${link.active ? 'bg-red-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}
                                                ${!link.url ? 'opacity-30 cursor-not-allowed' : ''}
                                            `}
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

            {/* Detail Modal */}
            <Modal show={isDetailModalOpen} onClose={closeDetailModal} maxWidth="2xl">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Detail Aktivitas</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Informasi lengkap mengenai perubahan data.</p>
                        </div>
                        <button 
                            onClick={closeDetailModal}
                            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {selectedLog && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pelaku</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{selectedLog.causer ? selectedLog.causer.name : 'System'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Waktu</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">
                                        {new Date(selectedLog.created_at).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Data Perubahan (JSON)</p>
                                <pre className="text-[11px] font-mono p-4 bg-white dark:bg-slate-900 rounded-xl overflow-x-auto border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {JSON.stringify(selectedLog.properties, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                    <div className="mt-8">
                        <SecondaryButton onClick={closeDetailModal} className="w-full justify-center py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px]">
                            Tutup
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
