import { useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import BottomCTA from '@/Components/BottomCTA';
import Swal from 'sweetalert2';

export default function JobDetail({ job }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
    name: '',
    email: '',
    phone: '',
    resume: null,
    cover_letter: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('karier.apply', job.id), {
      onSuccess: () => {
        reset();
        Swal.fire({
          title: 'Berhasil Terkirim!',
          text: 'Aplikasi Anda telah kami terima dan akan segera ditinjau oleh tim rekruitmen kami.',
          icon: 'success',
          confirmButtonColor: '#ef4444',
          borderRadius: '24px',
        });
      },
      forceFormData: true,
    });
  };

  return (
    <div className="bg-white text-slate-900 font-display transition-colors duration-300 dark:bg-slate-900 min-h-screen flex flex-col">
      <Head title={`${job.title} - Karier Kalastudio`} />
      <Header />

      <main className="flex-grow pt-32 pb-24 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-10 overflow-x-auto whitespace-nowrap pb-2">
            <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <Link href={route('karier')} className="hover:text-primary transition-colors">Karier</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-slate-900 dark:text-white truncate">{job.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content - Details */}
            <div className="lg:col-span-2 space-y-12">
              <section>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-black uppercase tracking-widest">
                    {job.department}
                  </span>
                  <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
                    {job.type}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                  {job.title}
                </h1>
                <div className="flex items-center text-slate-500 dark:text-slate-400 font-bold gap-6">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">location_on</span>
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">schedule</span>
                    Tayang {new Date(job.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Deskripsi Pekerjaan</h3>
                <div className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Persyaratan</h3>
                <div className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </div>
              </section>
            </div>

            {/* Right Side - Application Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <div className="bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Lamar Posisi Ini</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">Lengkapi formulir di bawah untuk mengirimkan lamaran Anda.</p>

                  <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-1">
                      <label htmlFor="name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                      <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold dark:text-white shadow-sm"
                        placeholder="Masukkan nama lengkap..."
                        required
                      />
                      {errors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.name}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Email</label>
                      <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold dark:text-white shadow-sm"
                        placeholder="email@perusahaan.com"
                        required
                      />
                      {errors.email && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="phone" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
                      <input
                        id="phone"
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold dark:text-white shadow-sm"
                        placeholder="0812xxxx"
                        required
                      />
                      {errors.phone && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.phone}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="resume" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CV / Resume (PDF)</label>
                      <div className="relative group/file">
                        <input
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setData('resume', e.target.files[0])}
                          className="sr-only"
                          required
                        />
                        <label 
                          htmlFor="resume" 
                          className="flex items-center gap-3 w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-slate-400 group-hover/file:text-primary transition-colors">upload_file</span>
                          <span className="text-xs font-bold text-slate-500 group-hover/file:text-primary transition-colors truncate">
                            {data.resume ? data.resume.name : 'Pilih file resume...'}
                          </span>
                        </label>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1 ml-1 font-medium italic">*Maksimal 2MB (PDF, DOC, DOCX)</p>
                      {errors.resume && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-1 ml-1">{errors.resume}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="cover_letter" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pesan Tambahan</label>
                      <textarea
                        id="cover_letter"
                        rows="4"
                        value={data.cover_letter}
                        onChange={(e) => setData('cover_letter', e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium dark:text-white shadow-sm resize-none"
                        placeholder="Ada hal lain yang ingin Anda sampaikan?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full py-5 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/40 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {processing ? 'Mengirim Lamaran...' : 'Kirim Lamaran'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomCTA />
      <Footer />
    </div>
  );
}
