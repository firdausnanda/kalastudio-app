import { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Select from 'react-select';

export default function PostEdit({ auth, post, categories, tags }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const editorRef = useRef(null);
    const quillInstance = useRef(null);
    const fileInputRef = useRef(null);

    const { data, setData, post: postForm, processing, errors, transform } = useForm({
        _method: 'PUT',
        title: post.title || '',
        categories: post.categories ? post.categories.map(c => c.id) : [],
        excerpt: post.excerpt || '',
        content: post.content || '',
        status: post.status || 'draft',
        featured_image: null,
        tags: post.tags ? post.tags.map(t => t.id) : [],
        seo_title: post.seo_title || '',
        seo_description: post.seo_description || '',
    });

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (editorRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: 'Mulai menulis cerita Anda...',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['link', 'image', 'video'],
                        ['clean']
                    ]
                }
            });

            // Set initial content
            if (post.content) {
                const delta = quillInstance.current.clipboard.convert({ html: post.content });
                quillInstance.current.setContents(delta, 'silent');
            }

            quillInstance.current.on('text-change', () => {
                setData('content', quillInstance.current.root.innerHTML);
            });
        }
    }, [post.content]);

    const submit = (e) => {
        e.preventDefault();

        transform((currentData) => {
            let processedData = { ...currentData };
            
            if (!processedData.excerpt || processedData.excerpt.trim() === '') {
                const textContent = quillInstance.current ? quillInstance.current.getText() : '';
                const trimmedText = textContent.trim();
                processedData.excerpt = trimmedText.substring(0, 160) + (trimmedText.length > 160 ? '...' : '');
            }

            if (!processedData.seo_title || processedData.seo_title.trim() === '') {
                processedData.seo_title = processedData.title;
            }

            if (!processedData.seo_description || processedData.seo_description.trim() === '') {
                processedData.seo_description = processedData.excerpt;
            }

            return processedData;
        });

        postForm(route('admin.blog-posts.update', post.id), {
            forceFormData: true
        });
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('featured_image', e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const customSelectStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: 'transparent',
            border: state.isFocused ? '2px solid #ef4444' : '1px solid #e2e8f0',
            borderRadius: '0.75rem',
            padding: '2px',
            boxShadow: 'none',
            '&:hover': { borderColor: '#ef4444' }
        }),
    };

    const tagOptions = tags.map(tag => ({ value: tag.id, label: tag.name }));
    const categoryOptions = categories.map(cat => ({ value: cat.id, label: cat.name }));

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display selection:bg-red-500/30">
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Head title="Edit Artikel Blog" />

            <div className="flex flex-grow relative overflow-hidden">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300 overflow-y-auto">
                    <form onSubmit={submit} className="max-w-[1400px] mx-auto">
                        <div className="flex items-center justify-between gap-4 mb-8">
                            <div className="flex items-center gap-4">
                                <Link 
                                    href={route('admin.blog-posts.index')} 
                                    className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:text-red-500 transition-colors"
                                >
                                    <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                                </Link>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Edit Artikel</h2>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <Link 
                                    href={route('admin.blog-posts.index')} 
                                    className="px-6 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm tracking-wide hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </Link>
                                <button 
                                    type="submit" 
                                    disabled={processing} 
                                    className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-red-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-lg">save</span>
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Editor Column (Left) */}
                            <div className="lg:col-span-8 space-y-6">
                                <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none">
                                    <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={e => setData('title', e.target.value)}
                                            placeholder="Tulis Judul Artikel Disini..."
                                            className="w-full text-4xl font-black text-slate-900 dark:text-white bg-transparent border-none outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 focus:ring-0 px-0"
                                        />
                                        <InputError message={errors.title} className="mt-2" />
                                    </div>

                                    <div className="mb-6">
                                        <InputLabel value="Ringkasan Singkat (Excerpt)" className="mb-2 text-slate-400 font-bold" />
                                        <textarea
                                            value={data.excerpt}
                                            onChange={e => setData('excerpt', e.target.value)}
                                            placeholder="Tambahkan sedikit ringkasan yang menarik agar pembaca penasaran..."
                                            className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-red-500/20 transition-all text-slate-600 dark:text-slate-300 resize-none"
                                            rows="3"
                                        ></textarea>
                                        <InputError message={errors.excerpt} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel value="Isi Artikel" className="mb-2 text-slate-400 font-bold" />
                                        <div className="bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 pb-12 focus-within:ring-2 focus-within:ring-red-500/50 transition-all">
                                            <div ref={editorRef} className="min-h-[400px] border-none text-slate-700 dark:text-slate-300 text-base" />
                                        </div>
                                        <InputError message={errors.content} className="mt-2" />
                                    </div>
                                </div>
                            </div>

                            {/* Settings Column (Right) */}
                            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 h-max">
                                {/* Card: Organization */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/20 dark:shadow-none">
                                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-lg">category</span>
                                        </div>
                                        <h3 className="font-black text-slate-900 dark:text-white">Organisasi</h3>
                                    </div>
                                    
                                    <div className="space-y-5">
                                        <div>
                                            <InputLabel value="Status Publikasi" className="mb-1.5" />
                                            <Select
                                                styles={customSelectStyles}
                                                options={[
                                                    { value: 'draft', label: 'Draft' },
                                                    { value: 'published', label: 'Published' },
                                                ]}
                                                value={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }].find(o => o.value === data.status)}
                                                onChange={opt => setData('status', opt.value)}
                                            />
                                            <InputError message={errors.status} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel value="Kategori" className="mb-1.5" />
                                            <Select
                                                isMulti
                                                styles={customSelectStyles}
                                                options={categoryOptions}
                                                value={categoryOptions.filter(c => data.categories.includes(c.value))}
                                                onChange={opts => setData('categories', opts.map(o => o.value))}
                                                placeholder="Pilih beberapa kategori..."
                                            />
                                            <InputError message={errors.categories} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel value="Tags" className="mb-1.5" />
                                            <Select
                                                isMulti
                                                styles={customSelectStyles}
                                                options={tagOptions}
                                                value={tagOptions.filter(t => data.tags.includes(t.value))}
                                                onChange={opts => setData('tags', opts.map(o => o.value))}
                                                placeholder="Tambahkan tag..."
                                            />
                                            <InputError message={errors.tags} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Card: Media */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/20 dark:shadow-none">
                                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-lg">image</span>
                                        </div>
                                        <h3 className="font-black text-slate-900 dark:text-white">Media Cover</h3>
                                    </div>
                                    
                                    <div 
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="mt-2 flex flex-col justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-2xl hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all group relative cursor-pointer overflow-hidden"
                                    >
                                        {post.featured_image && !data.featured_image && (
                                            <div className="mb-4 flex justify-center w-full">
                                                <img src={`/storage/${post.featured_image}`} alt="Current Cover" className="h-32 w-full object-cover rounded-xl shadow-md" />
                                            </div>
                                        )}
                                        <div className="space-y-1 text-center relative z-10 w-full">
                                            <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-red-500 transition-colors mb-2">add_photo_alternate</span>
                                            <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                                                <span className="relative cursor-pointer bg-transparent rounded-md font-bold text-red-500 hover:text-red-600">
                                                    Ganti Cover
                                                    <input 
                                                        ref={fileInputRef}
                                                        type="file" 
                                                        className="sr-only" 
                                                        accept="image/*"
                                                        onChange={e => setData('featured_image', e.target.files[0])}
                                                    />
                                                </span>
                                                <p className="pl-1">atau drag and drop</p>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2">
                                                {data.featured_image ? data.featured_image.name : 'Abaikan jika tidak ingin mengubah cover'}
                                            </p>
                                        </div>
                                    </div>
                                    <InputError message={errors.featured_image} className="mt-2" />
                                </div>

                                {/* Card: SEO */}
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/20 dark:shadow-none">
                                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-lg">travel_explore</span>
                                        </div>
                                        <h3 className="font-black text-slate-900 dark:text-white">SEO Meta Data</h3>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel value="SEO Title" className="mb-1" />
                                            <TextInput
                                                className="w-full text-sm py-2 px-4 rounded-xl"
                                                value={data.seo_title}
                                                onChange={e => setData('seo_title', e.target.value)}
                                                placeholder="Judul khusus mesin pencari..."
                                            />
                                        </div>
                                        <div>
                                            <InputLabel value="SEO Description" className="mb-1" />
                                            <textarea
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500/20 text-sm resize-none"
                                                rows="3"
                                                value={data.seo_description}
                                                onChange={e => setData('seo_description', e.target.value)}
                                                placeholder="Deskripsi Meta..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
            <DashboardFooter />
        </div>
    );
}
