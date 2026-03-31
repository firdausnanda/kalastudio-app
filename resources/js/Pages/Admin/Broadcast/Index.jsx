import { useState, useEffect } from 'react';
import { Head, router, Link, useForm } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Select from 'react-select';
import Swal from 'sweetalert2';

export default function BroadcastIndex({ auth, broadcasts, roles }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        message: '',
        type: 'whatsapp',
        target_role: '',
    });

    // Format roles for react-select
    const roleOptions = [
        { value: '', label: 'Semua Pengguna' },
        ...roles.map(role => ({ value: role.name, label: role.name.charAt(0).toUpperCase() + role.name.slice(1) }))
    ];

    // Custom styles for react-select
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            border: 'none',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none',
            borderRadius: '1rem',
            padding: '4px 8px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            backgroundColor: '#f8fafc',
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            padding: '8px',
            border: '1px solid #f1f5f9',
            zIndex: 50,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#ef4444' : state.isFocused ? '#fef2f2' : 'transparent',
            color: state.isSelected ? 'white' : '#64748b',
            borderRadius: '0.75rem',
            padding: '10px 16px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:active': {
                backgroundColor: '#ef4444',
                color: 'white',
            }
        }),
    };

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.broadcasts.store'), {
            onSuccess: () => {
                closeCreateModal();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Broadcast telah masuk antrean pengiriman.',
                    timer: 3000,
                    showConfirmButton: false,
                    borderRadius: '24px',
                });
            },
        });
    };

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
            borderRadius: '24px',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.broadcasts.destroy', broadcast.id), {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire({
                        title: 'Terhapus!',
                        text: 'Riwayat telah berhasil dihapus.',
                        icon: 'success',
                        borderRadius: '24px',
                    })
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
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display">
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Head title="Manajemen Broadcast" />

            <div className="flex flex-grow relative overflow-hidden">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Portal Broadcast</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Monitoring dan kirim pesan massal ke seluruh basis pengguna.</p>
                            </div>
                            <button
                                onClick={openCreateModal}
                                className="px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-red-500/30 flex items-center gap-3 group active:scale-95"
                            >
                                <span className="material-symbols-outlined text-lg transition-transform group-hover:rotate-12">campaign</span>
                                Buat Broadcast Baru
                            </button>
                        </div>

                        {/* Broadcast Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Pesan & Tipe</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Progress</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {broadcasts.data.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4 opacity-40">
                                                    <span className="material-symbols-outlined text-6xl">campaign</span>
                                                    <p className="text-slate-400 font-black text-sm uppercase tracking-widest">Belum ada riwayat broadcast.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        broadcasts.data.map((broadcast) => (
                                            <tr key={broadcast.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group">
                                                <td className="px-8 py-6">
                                                    <div className="max-w-xs space-y-2">
                                                        <p className="text-sm font-black text-slate-900 dark:text-white truncate" title={broadcast.message}>
                                                            {broadcast.message}
                                                        </p>
                                                        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${broadcast.type === 'whatsapp' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                                            }`}>
                                                            <span className="material-symbols-outlined text-[14px]">
                                                                {broadcast.type === 'whatsapp' ? 'chat' : 'mail'}
                                                            </span>
                                                            {broadcast.type}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 capitalize bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                                                        {broadcast.target_role || 'Semua Pengguna'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    {getStatusBadge(broadcast.status)}
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="w-32">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                {broadcast.sent_count}/{broadcast.total_count}
                                                            </span>
                                                            <span className="text-[10px] font-bold text-red-500">
                                                                {broadcast.total_count > 0 ? Math.round((broadcast.sent_count / broadcast.total_count) * 100) : 0}%
                                                            </span>
                                                        </div>
                                                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                                            <div
                                                                className={`h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-1000 ${broadcast.status === 'sending' ? 'animate-pulse bg-shimmer' : ''}`}
                                                                style={{ width: `${broadcast.total_count > 0 ? (broadcast.sent_count / broadcast.total_count) * 100 : 0}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <Link
                                                            href={route('admin.broadcasts.show', broadcast.id)}
                                                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:border-red-500/20 hover:shadow-lg transition-all active:scale-90"
                                                            title="Detail"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">visibility</span>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(broadcast)}
                                                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-red-500 hover:border-red-500/20 hover:shadow-lg transition-all active:scale-90"
                                                            title="Hapus"
                                                        >
                                                            <span className="material-symbols-outlined text-xl">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/10 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic">
                                    Menampilkan Halaman {broadcasts.current_page} dari {broadcasts.last_page}
                                </p>
                                <div className="flex gap-2">
                                    {broadcasts.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${link.active
                                                    ? 'bg-red-500 text-white shadow-xl shadow-red-500/20'
                                                    : 'bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
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

            {/* Premium Creation Modal */}
            <Modal show={isCreateModalOpen} onClose={closeCreateModal} maxWidth="2xl">
                <form onSubmit={submit} className="p-8 md:p-12 bg-white dark:bg-slate-900 border-none">
                    <div className="flex items-center justify-between mb-12">
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Kirim Broadcast</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium">Susun dan arahkan pesan massal Anda.</p>
                        </div>
                        <button
                            type="button"
                            onClick={closeCreateModal}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all group"
                        >
                            <span className="material-symbols-outlined transition-transform group-hover:rotate-90">close</span>
                        </button>
                    </div>

                    <div className="space-y-10">
                        {/* Type & Target Switchers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <InputLabel value="Platform Pengiriman" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" />
                                <div className="grid grid-cols-2 gap-4 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                    {['whatsapp', 'email'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setData('type', type)}
                                            className={`px-4 py-3 rounded-2xl flex items-center justify-center gap-3 transition-all ${data.type === type
                                                    ? 'bg-white dark:bg-slate-700 text-red-500 shadow-xl shadow-slate-200/50 dark:shadow-none font-black ring-1 ring-slate-100 dark:ring-slate-600'
                                                    : 'text-slate-400 font-bold hover:text-slate-600'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                {type === 'whatsapp' ? 'chat' : 'mail'}
                                            </span>
                                            <span className="text-[10px] uppercase tracking-widest">{type}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <InputLabel value="Target Role" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" />
                                <Select
                                    value={roleOptions.find(opt => opt.value === data.target_role)}
                                    onChange={opt => setData('target_role', opt.value)}
                                    options={roleOptions}
                                    styles={selectStyles}
                                    placeholder="Tentukan target..."
                                    isSearchable={false}
                                />
                                <InputError message={errors.target_role} />
                            </div>
                        </div>

                        {/* Conditional Subject */}
                        {data.type !== 'whatsapp' && (
                            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                <InputLabel value="Subjek Email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" />
                                <TextInput
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-red-500/20 text-sm font-bold transition-all"
                                    value={data.subject}
                                    onChange={e => setData('subject', e.target.value)}
                                    placeholder="Masukkan subjek yang menarik..."
                                    required={data.type !== 'whatsapp'}
                                />
                                <InputError message={errors.subject} />
                            </div>
                        )}

                        {/* Content Area */}
                        <div className="space-y-4">
                            <InputLabel value="Draft Pesan" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1" />
                            <div className="relative group">
                                <textarea
                                    className="w-full px-7 py-7 rounded-[32px] bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-red-500/20 text-sm font-bold min-h-[220px] transition-all scrollbar-hide outline-none"
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    placeholder="Tuliskan pesan Anda di sini..."
                                    required
                                ></textarea>
                                <div className="absolute top-6 right-6 text-[9px] font-black tracking-[0.2em] uppercase text-slate-300 pointer-events-none group-focus-within:text-red-500 transition-colors">
                                    {data.message.length} Karakter
                                </div>
                            </div>
                            <InputError message={errors.message} />
                        </div>

                        {/* Modal Footer Buttons */}
                        <div className="flex flex-col md:flex-row items-center gap-4 pt-8 border-t border-slate-50 dark:border-slate-800">
                            <SecondaryButton
                                type="button"
                                onClick={closeCreateModal}
                                className="w-full md:w-auto px-12 py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] border-slate-100 hover:bg-slate-50"
                            >
                                Tutup
                            </SecondaryButton>
                            <PrimaryButton
                                type="submit"
                                className="w-full md:flex-1 justify-center py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-2xl shadow-red-500/30 transition-all active:scale-95"
                                disabled={processing}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-lg">send</span>
                                    {processing ? 'Sedang Memproses...' : 'Eksekusi Broadcast'}
                                </div>
                            </PrimaryButton>
                        </div>
                    </div>
                </form>
            </Modal>

            <style jsx>{`
                .active-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .7; } }
                .bg-shimmer {
                    background-image: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
            `}</style>
        </div>
    );
}
