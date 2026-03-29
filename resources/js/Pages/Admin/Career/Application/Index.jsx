import { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import Swal from 'sweetalert2';
import Modal from '@/Components/Modal';

export default function ApplicationIndex({ auth, applications }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDelete = (app) => {
        Swal.fire({
            title: 'Hapus Aplikasi?',
            text: `Data aplikasi dari "${app.name}" akan dihapus permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.career-applications.destroy', app.id), {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire('Terhapus!', 'Aplikasi telah berhasil dihapus.', 'success')
                });
            }
        });
    };

    const handleUpdateStatus = (app, status) => {
        router.patch(route('admin.career-applications.update', app.id), {
            status: status
        }, {
            preserveScroll: true,
            onSuccess: () => {
                if (selectedApplication?.id === app.id) {
                    setSelectedApplication({ ...app, status: status });
                }
                Swal.fire('Berhasil!', `Status aplikasi telah diubah menjadi ${status}.`, 'success');
            }
        });
    };

    const openViewModal = (app) => {
        setSelectedApplication(app);
        setIsViewModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedApplication(null);
    };

    const filteredApplications = applications.data.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.career.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-600';
            case 'reviewed': return 'bg-blue-100 text-blue-600';
            case 'accepted': return 'bg-emerald-100 text-emerald-600';
            case 'rejected': return 'bg-rose-100 text-rose-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display">
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Head title="Manajemen Pelamar Kerja" />

            <div className="flex flex-grow relative overflow-hidden">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Pelamar Kerja</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Pantau dan kelola seluruh aplikasi lamaran kerja yang masuk.</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                            <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                                <div className="relative w-full md:w-96 group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">search</span>
                                    <input
                                        type="text"
                                        placeholder="Cari nama, email, atau posisi..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none outline-none focus:ring-2 focus:ring-red-500/20 text-sm font-bold dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pelamar</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Posisi Dilamar</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {filteredApplications.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <span className="material-symbols-outlined text-4xl text-slate-200">person_search</span>
                                                        <p className="text-slate-400 font-bold text-sm">Tidak ada aplikasi ditemukan.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredApplications.map((app) => (
                                                <tr key={app.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group">
                                                    <td className="px-8 py-6">
                                                        <p className="text-sm font-black text-slate-900 dark:text-white capitalize">{app.name}</p>
                                                        <p className="text-xs text-slate-400 font-medium">{app.email}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{app.career?.title}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                                            {new Date(app.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase inline-block ${getStatusColor(app.status)}`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button
                                                                onClick={() => openViewModal(app)}
                                                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                                title="Lihat Detail"
                                                            >
                                                                <span className="material-symbols-outlined">visibility</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(app)}
                                                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                                title="Hapus"
                                                            >
                                                                <span className="material-symbols-outlined">delete</span>
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
                                    Halaman {applications.current_page} dari {applications.last_page}
                                </p>
                                <div className="flex gap-2">
                                    {applications.links.map((link, i) => (
                                        <Link key={i} href={link.url || '#'} className={`px-3 py-1.5 rounded-lg text-xs font-black ${link.active ? 'bg-red-500 text-white' : 'bg-white text-slate-500'} ${!link.url ? 'opacity-30' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <DashboardFooter />

            <Modal show={isViewModalOpen} onClose={closeViewModal} maxWidth="2xl">
                {selectedApplication && (
                    <div className="p-8 md:p-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Detail Pelamar</h2>
                                <p className="text-slate-500 font-medium">Informasi lengkap aplikasi lamaran kerja.</p>
                            </div>
                            <button onClick={closeViewModal} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Nama Lengkap</label>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">{selectedApplication.name}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email</label>
                                    <p className="text-slate-700 dark:text-slate-300 font-bold">{selectedApplication.email}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Nomor WhatsApp</label>
                                    <p className="text-slate-700 dark:text-slate-300 font-bold">{selectedApplication.phone}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Posisi yang Dilamar</label>
                                    <p className="text-red-500 font-black">{selectedApplication.career?.title}</p>
                                    <p className="text-xs text-slate-400">{selectedApplication.career?.department}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Resume / CV</label>
                                    <a 
                                        href={`/storage/${selectedApplication.resume_path}`} 
                                        target="_blank" 
                                        className="inline-flex items-center gap-2 px-5 py-3 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                                    >
                                        <span className="material-symbols-outlined text-lg">description</span>
                                        Buka Resume
                                    </a>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Dokumen Pendukung / Pesan</label>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl italic">
                                        "{selectedApplication.cover_letter || 'Tidak ada pesan tambahan.'}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Update Status Aplikasi</label>
                                <div className="flex flex-wrap gap-2">
                                    {['pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleUpdateStatus(selectedApplication, status)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                selectedApplication.status === status 
                                                ? getStatusColor(status) + ' ring-2 ring-offset-2 ring-slate-200'
                                                : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100'
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={closeViewModal}
                                className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors"
                            >
                                Selesai
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
