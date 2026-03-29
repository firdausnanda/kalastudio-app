import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function JobEdit({ job }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { data, setData, patch, processing, errors } = useForm({
        title: job.title || '',
        department: job.department || '',
        location: job.location || '',
        type: job.type || 'Full-time',
        description: job.description || '',
        requirements: job.requirements || '',
        is_active: job.is_active,
        is_featured: job.is_featured,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.career-jobs.update', job.id));
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display transition-colors">
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Head title={`Edit Lowongan - ${job.title}`} />

            <div className="flex flex-grow relative overflow-hidden">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('admin.career-jobs.index')}
                                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                            </Link>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Edit Lowongan</h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Perbarui informasi lowongan kerja {job.title}.</p>
                            </div>
                        </div>

                        <form onSubmit={submit} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl p-8 md:p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <InputLabel htmlFor="title" value="Judul Posisi" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-red-500/20 text-sm font-bold"
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.title} />
                                </div>

                                <div className="space-y-2">
                                    <InputLabel htmlFor="department" value="Departemen" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1" />
                                    <TextInput
                                        id="department"
                                        type="text"
                                        value={data.department}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-red-500/20 text-sm font-bold"
                                        onChange={(e) => setData('department', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.department} />
                                </div>

                                <div className="space-y-2">
                                    <InputLabel htmlFor="location" value="Lokasi" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1" />
                                    <TextInput
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-red-500/20 text-sm font-bold"
                                        onChange={(e) => setData('location', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.location} />
                                </div>

                                <div className="space-y-2">
                                    <InputLabel htmlFor="type" value="Tipe Pekerjaan" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1" />
                                    <select
                                        id="type"
                                        value={data.type}
                                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-red-500/20 text-sm font-bold dark:text-white"
                                        onChange={(e) => setData('type', e.target.value)}
                                        required
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Freelance">Freelance</option>
                                    </select>
                                    <InputError message={errors.type} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <InputLabel htmlFor="description" value="Deskripsi Pekerjaan" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1" />
                                <textarea
                                    id="description"
                                    value={data.description}
                                    rows="6"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium dark:text-white"
                                    onChange={(e) => setData('description', e.target.value)}
                                    required
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="space-y-2">
                                <InputLabel htmlFor="requirements" value="Persyaratan" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1" />
                                <textarea
                                    id="requirements"
                                    value={data.requirements}
                                    rows="6"
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-red-500/20 text-sm font-medium dark:text-white"
                                    onChange={(e) => setData('requirements', e.target.value)}
                                    required
                                />
                                <InputError message={errors.requirements} />
                            </div>

                            <div className="flex flex-wrap gap-8 py-4 border-y border-slate-50 dark:border-slate-800">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-12 h-6 rounded-full transition-colors ${data.is_active ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${data.is_active ? 'translate-x-6' : ''}`}></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-red-500 transition-colors transition-colors">Aktif (Publikasikan)</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="sr-only"
                                        />
                                        <div className={`w-12 h-6 rounded-full transition-colors ${data.is_featured ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${data.is_featured ? 'translate-x-6' : ''}`}></div>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-red-500 transition-colors">Featured</span>
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4">
                                <Link
                                    href={route('admin.career-jobs.index')}
                                    className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-xs transition-colors"
                                >
                                    Batal
                                </Link>
                                <PrimaryButton
                                    className="px-10 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-colors shadow-lg shadow-red-500/30"
                                    disabled={processing}
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
            <DashboardFooter />
        </div>
    );
}
