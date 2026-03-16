import { usePage, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function SubscriptionInfo({ className = '' }) {
    const { userDataExternal } = usePage().props;
    const userData = userDataExternal?.data || userDataExternal;

    const [isLoading, setIsLoading] = useState(true);
    const [benefitsData, setBenefitsData] = useState({});

    const plan = userData?.plan || 'Free';
    const tokens = userData?.token_balance ?? 0;
    const isActive = true; // Assuming active if we have data

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('/api/packages');
                const result = await response.json();

                if (result.success && result.data) {
                    const mappedBenefits = {};
                    result.data.forEach(pkg => {
                        let features = [];
                        try {
                            features = typeof pkg.features === 'string' ? JSON.parse(pkg.features) : (pkg.features || []);
                        } catch (e) {
                            console.error('Error parsing features for', pkg.name, e);
                        }
                        mappedBenefits[pkg.name] = features;
                    });

                    // Add Professional fallback if not in API but expected
                    if (!mappedBenefits['Professional']) {
                        mappedBenefits['Professional'] = ['Semua fitur Business', 'Multi-user Access', 'API Integration', 'Custom Branding'];
                    }

                    // Fallback for Free/Starter if mapping issues
                    if (!mappedBenefits['Free'] && mappedBenefits['Starter']) {
                        mappedBenefits['Free'] = ['15 Token', 'Hingga 15 Transaksi / Bulan', 'Laporan Laba Rugi Dasar', 'Dukungan Whatsapp'];
                    }

                    setBenefitsData(mappedBenefits);
                }
            } catch (error) {
                console.error('Failed to fetch packages:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPackages();
    }, []);

    const currentBenefits = benefitsData[plan] || benefitsData['Free'] || ['Memuat manfaat...'];

    return (
        <section className={className}>
            <header className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">payments</span>
                    Status Langganan
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Detail paket dan sisa kuota AI Anda.
                </p>
            </header>

            <div className="space-y-6">
                {/* Plan Card */}
                <div className="p-6 bg-gradient-to-br from-primary/10 to-amber-500/10 dark:from-primary/20 dark:to-amber-500/20 border border-primary/20 rounded-[32px] relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Paket Saat Ini</p>
                                <h3 className="text-2xl font-black bg-gradient-to-r from-primary to-amber-600 bg-clip-text text-transparent capitalize">
                                    {plan} Plan
                                </h3>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${isActive ? 'bg-green-500/20 text-green-600 border border-green-500/20' : 'bg-red-500/20 text-red-600 border border-red-500/20'}`}>
                                {isActive ? 'Aktif' : 'Expired'}
                            </span>
                        </div>

                        <div className="flex items-center gap-4 py-4 border-y border-primary/10 mb-4">
                            <div className="flex-grow">
                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Sisa AI Token</p>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-amber-500 text-xl font-black">bolt</span>
                                    <span className="text-lg font-black text-slate-900 dark:text-white">{tokens}</span>
                                    <span className="text-xs font-bold text-slate-500 italic">Tersedia</span>
                                </div>
                            </div>
                            <Link
                                href="/langganan"
                                className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all active:scale-95"
                                title="Isi Ulang Token"
                            >
                                <span className="material-symbols-outlined text-primary">add_circle</span>
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-400 animate-pulse py-2">
                                <span className="material-symbols-outlined text-sm">sync</span>
                                Memperbarui manfaat paket...
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {currentBenefits.map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                                        <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <Link
                    href="/langganan"
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-sm font-black text-center block hover:opacity-90 transition-all shadow-xl shadow-slate-200 dark:shadow-none uppercase tracking-widest"
                >
                    Tingkatkan Paket Langganan
                </Link>
            </div>
        </section>
    );
}
