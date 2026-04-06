import { Head, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Features from '@/Components/Features';
import DetailedFeatures from '@/Components/DetailedFeatures';
import Footer from '@/Components/Footer';
import BottomCTA from '@/Components/BottomCTA';
import { useEffect } from 'react';

export default function FeaturesPage() {
  const { url } = usePage();
  const siteTitle = "Fitur KalaStudio - Otomatisasi Keuangan via WhatsApp & AI";
  const siteDescription = "Kelola seluruh siklus keuangan bisnis Anda hanya melalui WhatsApp. Cepat, akurat, dan didukung teknologi AI mutakhir. Laporan harian, mingguan, dan analisis tren dalam satu chat.";
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kalastudio.ai';
  const canonicalUrl = `${baseUrl}${url}`;

  // Ensure we start at the top of the page when navigating here
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
        {/* Page Header Section */}
        <section className="bg-slate-50 dark:bg-slate-800/50 py-16 md:py-24 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
              Fitur Cerdas <span className="text-primary">AI Powered</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
              Kelola seluruh siklus keuangan bisnis Anda hanya melalui WhatsApp. Cepat, akurat, dan didukung teknologi AI mutakhir.
            </p>
          </div>
        </section>

        {/* Existing Feature Components */}
        <Features />

        <div className="py-12">
          <DetailedFeatures />
        </div>

        {/* Extra Bottom CTA specifically for this page */}
        <BottomCTA />
      </main>

      <Footer />
    </div>
  );
}
