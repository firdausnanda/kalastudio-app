import { Head, usePage } from '@inertiajs/react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import Hero from '@/Components/Hero';
import Features from '@/Components/Features';
import DetailedFeatures from '@/Components/DetailedFeatures';
import IndustryUseCases from '@/Components/IndustryUseCases';
import Testimonials from '@/Components/Testimonials';
import BottomCTA from '@/Components/BottomCTA';

export default function Welcome() {
    const { url } = usePage();
    const siteTitle = "KalaStudio - Pembukuan dengan WhatsApp & AI Otomatis untuk UMKM";
    const siteDescription = "Solusi pembukuan UMKM termudah. Catat transaksi via WhatsApp, pantau laporan keuangan real-time, dan optimalkan bisnis Anda dengan teknologi AI dari KalaStudio.";
    
    // Fallback untuk SSR - biasanya domain dikonfigurasi di APP_URL laravel
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://kalastudio.ai'; 
    const canonicalUrl = `${baseUrl}${url === '/' ? '' : url}`;

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "KalaStudio",
        "operatingSystem": "Web-based / WhatsApp",
        "applicationCategory": "BusinessApplication, AccountingApplication",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "120"
        },
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "IDR"
        },
        "description": siteDescription
    };

    return (
        <div className="bg-white text-slate-900 font-display transition-colors duration-300 dark:bg-slate-900">
            <Head>
                <title>{siteTitle}</title>
                <meta name="description" content={siteDescription} />
                <meta name="keywords" content="pembukuan umkm, pembukuan whatsapp, otomatisasi laporan keuangan, kalastudio, catat transaksi wa, ai pembukuan, finance assistant ai" />
                <link rel="canonical" href={canonicalUrl} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={siteTitle} />
                <meta property="og:description" content={siteDescription} />
                <meta property="og:image" content={`${canonicalUrl}/img/og-image.png`} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={canonicalUrl} />
                <meta property="twitter:title" content={siteTitle} />
                <meta property="twitter:description" content={siteDescription} />
                <meta property="twitter:image" content={`${canonicalUrl}/img/og-image.png`} />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Head>

            <Header />
            <main>
                <Hero />
                <Features />
                <DetailedFeatures />
                <IndustryUseCases />
                <Testimonials />
                <BottomCTA />
            </main>
            <Footer />
        </div>
    );
}
