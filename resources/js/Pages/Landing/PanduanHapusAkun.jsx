import { useEffect } from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import BottomCTA from '@/Components/BottomCTA';
import { Head, usePage } from '@inertiajs/react';

export default function PanduanHapusAkunPage() {
  const { url } = usePage();

  const siteTitle = "Panduan Hapus Akun KalaStudio";
  const siteDescription = "Langkah-langkah untuk menghapus akun dan data Anda secara permanen dari sistem KalaStudio.";
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kalastudio.ai';
  const canonicalUrl = `${baseUrl}${url}`;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white text-slate-900 font-display transition-colors duration-300 dark:bg-slate-900 min-h-screen flex flex-col">
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
      </Head>
      <Header />

      <main className="flex-grow">
        {/* Help Center Hero */}
        <section className="bg-slate-50 dark:bg-slate-800/30 py-20 px-4 transition-colors duration-300">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
              Panduan <span className="text-primary">Hapus Akun</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Pelajari cara menghapus akun dan data bisnis Anda secara permanen dari KalaStudio.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-10 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-primary/5">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Langkah-langkah Menghapus Akun</h2>
              
              <ol className="space-y-6 text-slate-600 dark:text-slate-400 list-decimal pl-6">
                <li className="pl-2">
                  <strong className="text-slate-900 dark:text-white block mb-2">Login ke Akun Anda</strong>
                  Silakan login ke dashboard KalaStudio menggunakan email dan password Anda.
                </li>
                <li className="pl-2">
                  <strong className="text-slate-900 dark:text-white block mb-2">Akses Menu Profil</strong>
                  Setelah berhasil login, klik pada nama atau avatar Anda di pojok kanan atas, kemudian pilih menu <strong>Profil</strong>.
                </li>
                <li className="pl-2">
                  <strong className="text-slate-900 dark:text-white block mb-2">Cari Bagian Hapus Akun</strong>
                  Scroll ke bagian paling bawah pada halaman pengaturan Profil Anda. Anda akan menemukan bagian <strong>Hapus Akun (Delete Account)</strong>.
                </li>
                <li className="pl-2">
                  <strong className="text-slate-900 dark:text-white block mb-2">Konfirmasi Penghapusan</strong>
                  Klik tombol <strong>Hapus Akun</strong>. Sistem akan meminta Anda memasukkan password sebagai konfirmasi akhir untuk memastikan bahwa tindakan ini benar-benar dilakukan oleh Anda.
                </li>
              </ol>

              <div className="mt-12 bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
                <h3 className="text-red-700 dark:text-red-400 font-bold flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined">warning</span>
                  Peringatan Penting
                </h3>
                <ul className="list-disc pl-5 text-red-600 dark:text-red-300 space-y-2 text-sm">
                  <li>Tindakan ini <strong>bersifat permanen dan tidak dapat dibatalkan</strong>.</li>
                  <li>Semua data profil bisnis, riwayat transaksi, laporan keuangan, dan integrasi WhatsApp Anda akan <strong>dihapus secara permanen</strong> dari server kami.</li>
                  <li>Pastikan Anda telah mengunduh (export) semua laporan penting sebelum melakukan penghapusan akun.</li>
                </ul>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-lg mb-4 text-slate-900 dark:text-white">Butuh Bantuan Lain?</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Jika Anda mengalami kesulitan saat menghapus akun atau memiliki pertanyaan lain mengenai data Anda, silakan hubungi tim dukungan kami.
                </p>
                <a href="/kontak" className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                  <span className="material-symbols-outlined">support_agent</span>
                  Hubungi Customer Support
                </a>
              </div>
            </div>
          </div>
        </section>

        <BottomCTA />
      </main>

      <Footer />
    </div>
  );
}
