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
import Swal from 'sweetalert2';

export default function CategoryIndex({ auth, categories }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const form = useForm({
        name: '',
        description: '',
    });

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const openCreateModal = () => {
        form.reset();
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        form.reset();
        form.clearErrors();
    };

    const openEditModal = (category) => {
        setSelectedCategory(category);
        form.setData({
            name: category.name,
            description: category.description || '',
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedCategory(null);
        form.reset();
        form.clearErrors();
    };

    const submitCreate = (e) => {
        e.preventDefault();
        form.post(route('admin.blog-categories.store'), {
            preserveScroll: true,
            onSuccess: () => {
                closeCreateModal();
                Swal.fire({
                    icon: 'success', title: 'Berhasil', text: 'Kategori blog berhasil ditambahkan.',
                    timer: 2000, showConfirmButton: false
                });
            },
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        form.put(route('admin.blog-categories.update', selectedCategory.id), {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                Swal.fire({
                    icon: 'success', title: 'Berhasil', text: 'Kategori blog berhasil diperbarui.',
                    timer: 2000, showConfirmButton: false
                });
            },
        });
    };

    const handleDelete = (category) => {
        Swal.fire({
            title: 'Hapus Kategori?',
            text: `Kategori "${category.name}" akan dihapus permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.blog-categories.destroy', category.id), {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire('Terhapus!', 'Kategori telah berhasil dihapus.', 'success')
                });
            }
        });
    };

    const filteredCategories = categories.data.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display">
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Head title="Kategori Blog" />

            <div className="flex flex-grow relative overflow-hidden">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Kategori Blog</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Kelola kategori untuk artikel blog Anda.</p>
                            </div>
                            <button
                                onClick={openCreateModal}
                                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-colors shadow-lg shadow-red-500/30 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                Tambah Kategori
                            </button>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                            <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                                <div className="relative w-full md:w-96 group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">search</span>
                                    <input
                                        type="text"
                                        placeholder="Cari kategori..."
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
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nama & Slug</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deskripsi</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {filteredCategories.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <span className="material-symbols-outlined text-4xl text-slate-200">category</span>
                                                        <p className="text-slate-400 font-bold text-sm">Tidak ada kategori ditemukan.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredCategories.map((cat) => (
                                                <tr key={cat.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20">
                                                    <td className="px-8 py-6">
                                                        <p className="text-sm font-black text-slate-900 dark:text-white">{cat.name}</p>
                                                        <p className="text-xs text-slate-400 font-medium">/{cat.slug}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm truncate whitespace-normal line-clamp-2">
                                                            {cat.description || '-'}
                                                        </p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <button
                                                                onClick={() => openEditModal(cat)}
                                                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                                                            >
                                                                <span className="material-symbols-outlined">edit</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(cat)}
                                                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50"
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
                                    Halaman {categories.current_page} dari {categories.last_page}
                                </p>
                                <div className="flex gap-2">
                                    {categories.links.map((link, i) => (
                                        <Link key={i} href={link.url || '#'} className={`px-3 py-1.5 rounded-lg text-xs font-black ${link.active ? 'bg-red-500 text-white' : 'bg-white text-slate-500'} ${!link.url ? 'opacity-30' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <DashboardFooter />

            <Modal show={isCreateModalOpen} onClose={closeCreateModal}>
                <form onSubmit={submitCreate} className="p-8">
                    <h2 className="text-2xl font-black mb-6">Tambah Kategori</h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Nama Kategori" />
                            <TextInput
                                className="w-full mt-1"
                                value={form.data.name}
                                onChange={e => form.setData('name', e.target.value)}
                            />
                            <InputError message={form.errors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Deskripsi" />
                            <textarea
                                className="w-full mt-1 px-4 py-2 border-slate-200 rounded-xl focus:border-red-500 focus:ring-red-500/20"
                                value={form.data.description}
                                onChange={e => form.setData('description', e.target.value)}
                                rows="3"
                            ></textarea>
                            <InputError message={form.errors.description} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-8 flex gap-3">
                        <SecondaryButton onClick={closeCreateModal} className="w-full justify-center">Batal</SecondaryButton>
                        <PrimaryButton disabled={form.processing} className="w-full justify-center">Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            <Modal show={isEditModalOpen} onClose={closeEditModal}>
                <form onSubmit={submitEdit} className="p-8">
                    <h2 className="text-2xl font-black mb-6">Edit Kategori</h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Nama Kategori" />
                            <TextInput
                                className="w-full mt-1"
                                value={form.data.name}
                                onChange={e => form.setData('name', e.target.value)}
                            />
                            <InputError message={form.errors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel value="Deskripsi" />
                            <textarea
                                className="w-full mt-1 px-4 py-2 border-slate-200 rounded-xl focus:border-red-500 focus:ring-red-500/20"
                                value={form.data.description}
                                onChange={e => form.setData('description', e.target.value)}
                                rows="3"
                            ></textarea>
                            <InputError message={form.errors.description} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-8 flex gap-3">
                        <SecondaryButton onClick={closeEditModal} className="w-full justify-center">Batal</SecondaryButton>
                        <PrimaryButton disabled={form.processing} className="w-full justify-center">Simpan Perubahan</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
