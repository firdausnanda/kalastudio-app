import { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import Swal from 'sweetalert2';

export default function PostIndex({ auth, posts }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDelete = (post) => {
        Swal.fire({
            title: 'Hapus Artikel?',
            text: `Artikel "${post.title}" akan dihapus permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Hapus',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.blog-posts.destroy', post.id), {
                    preserveScroll: true,
                    onSuccess: () => Swal.fire('Terhapus!', 'Artikel telah berhasil dihapus.', 'success')
                });
            }
        });
    };

    const filteredPosts = posts.data.filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display">
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Head title="Manajemen Artikel" />

            <div className="flex flex-grow relative overflow-hidden">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Artikel Blog</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Kelola artikel untuk dipublikasikan di blog Anda.</p>
                            </div>
                            <Link
                                href={route('admin.blog-posts.create')}
                                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-colors shadow-lg shadow-red-500/30 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                Tulis Artikel
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                            <div className="p-8 border-b border-slate-50 dark:border-slate-800">
                                <div className="relative w-full md:w-96 group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors">search</span>
                                    <input
                                        type="text"
                                        placeholder="Cari artikel..."
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
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Judul & Penulis</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kategori</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {filteredPosts.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-20 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <span className="material-symbols-outlined text-4xl text-slate-200">article</span>
                                                        <p className="text-slate-400 font-bold text-sm">Tidak ada artikel ditemukan.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredPosts.map((post) => (
                                                <tr key={post.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20">
                                                    <td className="px-8 py-6">
                                                        <p className="text-sm font-black text-slate-900 dark:text-white max-w-sm truncate">{post.title}</p>
                                                        <p className="text-xs text-slate-400 font-medium">Oleh {post.author.name}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-black tracking-wider uppercase">
                                                            {post.categories && post.categories.length > 0 ? post.categories.map(c => c.name).join(', ') : 'Uncategorized'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase ${
                                                            post.status === 'published' ? 'bg-emerald-100 text-emerald-600' :
                                                            post.status === 'draft' ? 'bg-amber-100 text-amber-600' :
                                                            'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            {post.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center justify-center gap-3">
                                                            <Link
                                                                href={route('admin.blog-posts.edit', post.id)}
                                                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                                                            >
                                                                <span className="material-symbols-outlined">edit</span>
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(post)}
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
                                    Halaman {posts.current_page} dari {posts.last_page}
                                </p>
                                <div className="flex gap-2">
                                    {posts.links.map((link, i) => (
                                        <Link key={i} href={link.url || '#'} className={`px-3 py-1.5 rounded-lg text-xs font-black ${link.active ? 'bg-red-500 text-white' : 'bg-white text-slate-500'} ${!link.url ? 'opacity-30' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <DashboardFooter />
        </div>
    );
}
