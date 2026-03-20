import { useState, useEffect } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Select from 'react-select';
import Swal from 'sweetalert2';

export default function UserIndex({ auth, users, roles }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const roleForm = useForm({
        role: '',
    });

    const passwordForm = useForm({
        password: '',
        password_confirmation: '',
    });

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

    const openEditModal = (user) => {
        setSelectedUser(user);
        roleForm.setData('role', user.roles[0]?.name || 'user');
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedUser(null);
        roleForm.reset();
    };

    const openPasswordModal = (user) => {
        setSelectedUser(user);
        setIsPasswordModalOpen(true);
    };

    const closePasswordModal = () => {
        setIsPasswordModalOpen(false);
        setSelectedUser(null);
        passwordForm.reset();
    };

    const submitRoleUpdate = (e) => {
        e.preventDefault();
        roleForm.patch(route('admin.users.update', selectedUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Role user berhasil diperbarui.',
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#fff',
                    color: '#0f172a',
                    iconColor: '#ef4444',
                });
            },
        });
    };

    const submitPasswordUpdate = (e) => {
        e.preventDefault();
        passwordForm.patch(route('admin.users.password', selectedUser.id), {
            preserveScroll: true,
            onSuccess: () => {
                closePasswordModal();
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Password user berhasil diperbarui.',
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#fff',
                    color: '#0f172a',
                    iconColor: '#ef4444',
                });
            },
        });
    };

    const handleImpersonate = (user) => {
        Swal.fire({
            title: 'Impersonate User?',
            text: `Anda akan masuk sebagai ${user.name}.`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Masuk',
            cancelButtonText: 'Batal',
            borderRadius: '24px',
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = route('impersonate', { id: user.id });
            }
        });
    };

    const handleDeleteUser = (user) => {
        Swal.fire({
            title: 'Hapus Pengguna?',
            text: `Akun ${user.name} akan dihapus permanen dari sistem.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus Akun',
            cancelButtonText: 'Batal',
            borderRadius: '24px',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.users.destroy', user.id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: 'Terhapus!',
                            text: 'Pengguna telah berhasil dihapus.',
                            icon: 'success',
                            confirmButtonColor: '#ef4444',
                            borderRadius: '24px',
                        });
                    }
                });
            }
        });
    };

    const filteredUsers = users.data.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const roleOptions = roles.map(role => ({
        value: role.name,
        label: role.name.charAt(0).toUpperCase() + role.name.slice(1)
    }));

    const customSelectStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: 'transparent',
            border: state.isFocused ? '2px solid #ef4444' : '1px solid #e2e8f0',
            borderRadius: '12px',
            minHeight: '45px',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#ef4444',
            }
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#ef4444' : state.isFocused ? '#fee2e2' : 'transparent',
            color: state.isSelected ? 'white' : '#1e293b',
            fontSize: '14px',
            fontWeight: '600',
            '&:active': {
                backgroundColor: '#ef4444',
            }
        }),
        singleValue: (base) => ({
            ...base,
            color: '#1e293b',
        }),
        menu: (base) => ({
            ...base,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
            border: '1px solid #f1f5f9',
            zIndex: 9999,
        })
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const adminCount = users.data.filter(u => u.roles.some(r => r.name === 'admin')).length;
    const userCount = users.data.length - adminCount;

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display transition-colors duration-300">
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Head title="Manajemen User" />

            <div className="flex flex-grow relative overflow-hidden">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300 ease-in-out">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Manajemen User</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Pantau dan kelola seluruh basis pengguna Kalastudio.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="px-5 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{users.total} Total User</span>
                                </div>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Administrator', count: adminCount, icon: 'shield_person', color: 'red' },
                                { label: 'Reguler User', count: userCount, icon: 'person', color: 'slate' },
                                { label: 'Baru (Bulan Ini)', count: 0, icon: 'person_add', color: 'blue' },
                                { label: 'Aktif Hari Ini', count: users.data.length, icon: 'bolt', color: 'amber' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500`}>
                                            <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                            <h4 className="text-xl font-black text-slate-900 dark:text-white">{stat.count}</h4>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Search & Table Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
                            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="relative w-full md:w-96 group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">search</span>
                                    <input
                                        type="text"
                                        placeholder="Cari nama atau email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border-none outline-none focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-bold dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-800/20">
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Informasi Pengguna</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status & Role</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Terdaftar Pada</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Tindakan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <span className="material-symbols-outlined text-4xl text-slate-200">person_off</span>
                                                        <p className="text-slate-400 font-bold text-sm">Tidak ada data pengguna ditemukan.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <tr key={user.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all group">
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                                                                {getInitials(user.name)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-slate-900 dark:text-white capitalize">{user.name}</p>
                                                                <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Aktif</span>
                                                            </div>
                                                            <div className={`
                                                                inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest
                                                                ${user.roles[0]?.name === 'admin' ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-500'}
                                                            `}>
                                                                {user.roles[0]?.name || 'user'}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                                            <span className="text-sm font-bold tabular-nums">
                                                                {new Date(user.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button
                                                                onClick={() => openEditModal(user)}
                                                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all active:scale-95 group/btn"
                                                                title="Ubah Role"
                                                            >
                                                                <span className="material-symbols-outlined text-xl group-hover/btn:rotate-12 transition-transform">edit</span>
                                                            </button>
                                                            <button
                                                                onClick={() => openPasswordModal(user)}
                                                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all active:scale-95 group/btn"
                                                                title="Reset Password"
                                                            >
                                                                <span className="material-symbols-outlined text-xl group-hover/btn:rotate-12 transition-transform">lock_reset</span>
                                                            </button>
                                                            {!user.roles.some(r => r.name === 'admin') && user.id !== auth.user.id && (
                                                                <button
                                                                    onClick={() => handleImpersonate(user)}
                                                                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all active:scale-95 group/btn"
                                                                    title="Impersonate"
                                                                >
                                                                    <span className="material-symbols-outlined text-xl group-hover/btn:rotate-12 transition-transform">account_circle</span>
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDeleteUser(user)}
                                                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all active:scale-95 group/btn"
                                                                title="Hapus Akun Pengguna"
                                                                disabled={(user.roles.some(r => r.name === 'admin') && user.id === 1) || user.id === auth.user.id}
                                                            >
                                                                <span className="material-symbols-outlined text-xl group-hover/btn:rotate-12 transition-transform">delete_forever</span>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Aesthetic */}
                            <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/10 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    Halaman {users.current_page} dari {users.last_page}
                                </p>
                                <div className="flex gap-2">
                                    {users.links.map((link, i) => (
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

            {/* Edit Role Modal */}
            <Modal show={isEditModalOpen} onClose={closeEditModal} maxWidth="md">
                <form onSubmit={submitRoleUpdate} className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight text-center">Ubah Peran Pengguna</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Tentukan hak akses untuk {selectedUser?.name}.</p>
                        </div>
                        <button 
                            type="button" 
                            onClick={closeEditModal}
                            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white font-black">
                                {selectedUser && getInitials(selectedUser.name)}
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white">{selectedUser?.name}</p>
                                <p className="text-xs text-slate-500">{selectedUser?.email}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Pilih Role Baru</label>
                            <Select
                                options={roleOptions}
                                styles={customSelectStyles}
                                value={roleOptions.find(opt => opt.value === roleForm.data.role)}
                                onChange={(opt) => roleForm.setData('role', opt.value)}
                                isSearchable={false}
                                placeholder="Pilih Role..."
                            />
                            {roleForm.errors.role && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 ml-1">{roleForm.errors.role}</p>}
                        </div>

                        <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl">
                            <div className="flex gap-3">
                                <span className="material-symbols-outlined text-amber-500 text-xl">info</span>
                                <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold leading-relaxed">
                                    Perubahan role akan langsung berdampak pada hak akses fitur dan konfigurasi pengguna tersebut di sistem.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-10">
                        <SecondaryButton 
                            type="button" 
                            onClick={closeEditModal} 
                            className="flex-1 justify-center py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] border-slate-200"
                        >
                            Batal
                        </SecondaryButton>
                        <PrimaryButton 
                            type="submit" 
                            className="flex-1 justify-center py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] bg-red-500 hover:bg-red-600 active:bg-red-700 shadow-xl shadow-red-500/20" 
                            disabled={roleForm.processing}
                        >
                            {roleForm.processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Reset Password Modal */}
            <Modal show={isPasswordModalOpen} onClose={closePasswordModal} maxWidth="md">
                <form onSubmit={submitPasswordUpdate} className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Reset Password</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Ubah password untuk {selectedUser?.name}.</p>
                        </div>
                        <button 
                            type="button" 
                            onClick={closePasswordModal}
                            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all shadow-sm"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white font-black">
                                {selectedUser && getInitials(selectedUser.name)}
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-900 dark:text-white">{selectedUser?.name}</p>
                                <p className="text-xs text-slate-500">{selectedUser?.email}</p>
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password Baru" className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={passwordForm.data.password}
                                className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-bold"
                                autoComplete="new-password"
                                onChange={(e) => passwordForm.setData('password', e.target.value)}
                                placeholder="Masukkan password baru..."
                            />
                            <InputError message={passwordForm.errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password Baru" className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={passwordForm.data.password_confirmation}
                                className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-bold"
                                autoComplete="new-password"
                                onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                placeholder="Konfirmasi password baru..."
                            />
                            <InputError message={passwordForm.errors.password_confirmation} className="mt-2" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-10">
                        <SecondaryButton 
                            type="button" 
                            onClick={closePasswordModal} 
                            className="flex-1 justify-center py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] border-slate-200"
                        >
                            Batal
                        </SecondaryButton>
                        <PrimaryButton 
                            type="submit" 
                            className="flex-1 justify-center py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] bg-red-500 hover:bg-red-600 active:bg-red-700 shadow-xl shadow-red-500/20" 
                            disabled={passwordForm.processing}
                        >
                            {passwordForm.processing ? 'Memproses...' : 'Reset Password'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
