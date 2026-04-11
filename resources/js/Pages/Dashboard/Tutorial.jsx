import { useState, useEffect } from 'react';
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardSidebar from '@/Components/DashboardSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import { Head, Link } from '@inertiajs/react';

export default function Tutorial() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
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

  const steps = [
    {
      title: 'Buka WhatsApp KalaStudio',
      description: 'Gunakan nomor WhatsApp yang telah terdaftar di akun Anda untuk mulai mengirim pesan.',
      icon: 'chat',
      color: 'bg-blue-500',
    },
    {
      title: 'Kirim Pesan Suara (Voice Note)',
      description: 'Ceritakan transaksi Anda secara alami. Contoh: "Tadi beli bensin motor 20 ribu rupiah".',
      icon: 'mic',
      color: 'bg-primary',
    },
    {
      title: 'AI Memproses Otomatis',
      description: 'Sistem AI kami akan langsung mengenali nominal, kategori, dan deskripsi transaksi Anda.',
      icon: 'neurology',
      color: 'bg-purple-500',
    },
    {
      title: 'Selesai & Tercatat!',
      description: 'Transaksi Anda akan otomatis muncul di dashboard ini tanpa perlu mengetik manual.',
      icon: 'check_circle',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display transition-colors duration-300">
      <Head title="Tutorial Pencatatan - KalaStudio" />

      <DashboardHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex flex-grow relative overflow-hidden">
        <DashboardSidebar isSidebarOpen={isSidebarOpen} />

        {/* Overlay for mobile sidebar */}
        <div
          className={`
            fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300
            ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300 ease-in-out">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="mb-12 text-center md:text-left">
              <Link
                href={route('dashboard')}
                className="inline-flex items-center text-primary font-bold mb-4 hover:gap-2 transition-all gap-1"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Kembali ke Dashboard
              </Link>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Tutorial Pencatatan WhatsApp AI</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Mencatat keuangan semudah berbicara. Biarkan AI kami yang melakukan pekerjaan berat untuk Anda.</p>
            </div>

            {/* Steps Section */}
            <div className="grid gap-8 mb-16">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none flex flex-col md:flex-row gap-6 items-center md:items-start group hover:-translate-y-1 transition-all"
                >
                  <div className={`${step.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-current/20`}>
                    <span className="material-symbols-outlined text-3xl">{step.icon}</span>
                  </div>
                  <div className="text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                      <span className="text-xs font-black px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full w-fit mx-auto md:mx-0 uppercase tracking-widest">Langkah {index + 1}</span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">{step.title}</h3>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips Card */}
            <div className="bg-primary rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-primary/20 mb-16">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-[24px] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-5xl">lightbulb</span>
                </div>
                <div>
                  <h4 className="text-2xl font-black mb-2">Tips Pencatatan yang Sempurna</h4>
                  <ul className="text-white/80 space-y-2 font-medium">
                    <li className="flex items-center gap-2 justify-center md:justify-start">
                      <span className="material-symbols-outlined text-sm">stars</span>
                      Sebutkan nominal dengan jelas (contoh: "Duapuluh ribu")
                    </li>
                    <li className="flex items-center gap-2 justify-center md:justify-start">
                      <span className="material-symbols-outlined text-sm">stars</span>
                      Sebutkan kategori/item barangnya
                    </li>
                    <li className="flex items-center gap-2 justify-center md:justify-start">
                      <span className="material-symbols-outlined text-sm">stars</span>
                      Gunakan bahasa yang santai seperti berbicara pada teman
                    </li>
                  </ul>
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
