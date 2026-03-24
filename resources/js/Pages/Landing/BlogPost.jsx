import { useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import BottomCTA from '@/Components/BottomCTA';
import 'quill/dist/quill.snow.css'; // For basic Quill formatting (ql-editor styling)

export default function BlogPost({ post }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white text-slate-900 font-display transition-colors duration-300 dark:bg-slate-900 min-h-screen flex flex-col">
      <Head>
        <title>{post.seo_title || post.title}</title>
        <meta head-key="description" name="description" content={post.seo_description || post.excerpt} />
      </Head>
      <Header />

      <main className="flex-grow pt-28 pb-20">
        <article className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href={route('blog')} className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-bold text-sm mb-10 transition-colors">
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Kembali ke Blog
            </Link>

            <div className="mb-10 text-center">
                {post.categories && post.categories.length > 0 && (
                    <span className="bg-primary/10 text-primary font-black text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-6 inline-block">
                        {post.categories.map(c => c.name).join(', ')}
                    </span>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight">{post.title}</h1>
                
                <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
                            <span className="material-symbols-outlined text-[20px]">person</span>
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{post.author.name}</span>
                    </div>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">calendar_today</span> 
                        {new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </div>

            {post.featured_image && (
                <div className="rounded-[32px] overflow-hidden shadow-2xl mb-16 h-[300px] md:h-[450px] lg:h-[550px] w-full border border-slate-100 dark:border-slate-800">
                    <img src={`/storage/${post.featured_image}`} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
                </div>
            )}

            {/* Content Container */}
            <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 lg:p-16 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none -mt-32 relative z-10 mx-4 sm:mx-0">
                <style dangerouslySetInnerHTML={{__html: `
                    .blog-content h1, .blog-content h2, .blog-content h3 { font-family: 'Outfit', sans-serif; font-weight: 900; color: inherit; margin-top: 1.5em; margin-bottom: 0.5em; line-height: 1.2; }
                    .blog-content p, .blog-content li { font-size: 1.125rem; line-height: 1.8; color: #475569; margin-bottom: 1.25em; font-family: 'Inter', sans-serif;}
                    .dark .blog-content p, .dark .blog-content li { color: #94a3b8; }
                    .blog-content a { color: #ef4444; font-weight: bold; text-decoration: underline; }
                    .blog-content img { border-radius: 1rem; margin: 2rem 0; width: 100%; object-fit: cover; }
                    .blog-content blockquote { border-left: 4px solid #ef4444; padding-left: 1.5rem; font-style: italic; color: #64748b; font-size: 1.25rem; margin: 2rem 0; background: #f8fafc; padding: 1.5rem; border-radius: 0 1rem 1rem 0; }
                    .dark .blog-content blockquote { background: #1e293b; color: #cbd5e1; }
                    .blog-content pre { padding: 1.5rem; border-radius: 1rem; margin: 1.5rem 0; overflow-x: auto; background: #1e293b !important; color: #f8fafc !important; }
                    .blog-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25em; }
                    .blog-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25em; }
                `}} />
                
                <div 
                    className="blog-content ql-editor px-0"
                    dangerouslySetInnerHTML={{ __html: post.content }} 
                />

                <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <span className="text-slate-500 font-bold mr-3">Bagikan Artikel:</span>
                        <div className="flex gap-2 inline-flex">
                            <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined text-[20px]">share</span>
                            </button>
                            <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-500 flex items-center justify-center transition-colors">
                                <span className="material-symbols-outlined text-[20px]">link</span>
                            </button>
                        </div>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-end">
                            {post.tags.map(tag => (
                                <span key={tag.id} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-lg text-xs font-bold border border-slate-100 dark:border-slate-800">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
      </main>

      <BottomCTA />
      <Footer />
    </div>
  );
}
