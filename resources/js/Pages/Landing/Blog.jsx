import { useEffect } from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import BottomCTA from '@/Components/BottomCTA';

import { Link } from '@inertiajs/react';

export default function BlogPage({ featuredPost, posts }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white text-slate-900 font-display transition-colors duration-300 dark:bg-slate-900 min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Blog Hero */}
        <section className="py-20 bg-slate-50 dark:bg-slate-800/30 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
              Wawasan & <span className="text-primary">Edukasi Bisnis</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
              Temukan tips praktis, panduan teknologi, dan kabar terbaru dari industri UMKM untuk membantu bisnis Anda melaju lebih kencang.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-16 -mt-12 relative z-10 px-4">
            <div className="max-w-7xl mx-auto">
              <Link href={`/blog/${featuredPost.slug}`} className="bg-white dark:bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row hover:shadow-primary/5 transition-all duration-500 block relative group">
                <div className="lg:w-1/2 h-64 lg:h-auto relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {featuredPost.featured_image ? (
                    <img
                      src={`/storage/${featuredPost.featured_image}`}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl text-slate-300">image</span>
                    </div>
                  )}
                </div>
                <div className="lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                  <span className="text-primary font-black text-xs uppercase tracking-widest mb-4">Artikel Pilihan</span>
                  <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight dark:text-white group-hover:text-primary transition-colors">{featuredPost.title}</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-lg line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-bold flex items-center gap-2">
                      Baca Selengkapnya
                      <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1.5">arrow_forward</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Blog Feed */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 text-center md:text-left">
              <div>
                <h2 className="text-3xl font-black mb-2 dark:text-white">Terbitan Terbaru</h2>
                <p className="text-slate-500">Artikel edukasi harian untuk kemajuan usaha Anda.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.data.length > 0 ? posts.data.map((post) => (
                <Link href={`/blog/${post.slug}`} key={post.id} className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer block">
                  <div className="relative h-56 overflow-hidden bg-slate-50 dark:bg-slate-800/50">
                    {post.featured_image ? (
                      <img
                        src={`/storage/${post.featured_image}`}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <span className="material-symbols-outlined text-4xl">article</span>
                      </div>
                    )}
                    {post.categories && post.categories.length > 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-primary shadow-sm">
                          {post.categories[0].name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-bold mb-4">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {new Date(post.published_at || post.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <h3 className="dark:text-white text-xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              )) : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-slate-500 font-bold">Belum ada artikel yang diterbitkan saat ini.</p>
                </div>
              )}
            </div>

            {posts.next_page_url && (
              <div className="mt-20 text-center">
                <Link href={posts.next_page_url} className="dark:text-white border-2 border-slate-200 dark:border-slate-800 hover:border-primary px-10 py-4 rounded-xl font-bold transition-all duration-300 hover:-translate-y-1 inline-block">
                  Tampilkan Lebih Banyak
                </Link>
              </div>
            )}
          </div>
        </section>

        <BottomCTA />
      </main>

      <Footer />
    </div>
  );
}
