import { useState, useEffect } from 'react';
import { usePage, Link, Head } from '@inertiajs/react';
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardSidebar from '@/Components/DashboardSidebar';
import DashboardFooter from '@/Components/DashboardFooter';

export default function BoosterPage({ boosters = [], userData = null }) {
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
  };

  const handleBoosterSelect = (booster) => {
    window.location.href = `/checkout?plan=${encodeURIComponent(booster.name)}&billing=one_time`;
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display transition-colors duration-300">
      <Head title="Token Booster - Kalastudio" />
      <DashboardHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="flex flex-grow relative overflow-hidden">
        <DashboardSidebar isSidebarOpen={isSidebarOpen} />

        <div
          className={`
            fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300
            ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          onClick={() => setIsSidebarOpen(false)}
        ></div>

        <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/10 mb-4">
                  <span className="material-symbols-outlined text-sm">rocket_launch</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Token Booster</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Kebutuhan <span className="text-primary">Extra</span> Token?</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Beli paket booster untuk meluncurkan lebih banyak AI Insights tanpa perlu upgrade paket utama.</p>
              </div>

              {userData && (
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center gap-6">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">database</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Token Saat Ini</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{userData.token_balance || 0}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Booster Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {boosters.map((booster, i) => {
                const priceObj = booster.prices?.find(p => p.billing_cycle === 'one_time');
                const price = priceObj ? priceObj.price : 0;
                let features = [];
                try {
                  features = typeof booster.features === 'string' ? JSON.parse(booster.features) : (booster.features || []);
                } catch (e) { console.error(e); }

                return (
                  <div
                    key={booster.id}
                    className="group relative bg-white dark:bg-slate-900 p-8 rounded-[48px] border border-slate-100 dark:border-slate-800 hover:border-primary transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 flex flex-col"
                  >
                    {/* Glass Decor */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors"></div>

                    <div className="relative z-10 flex-grow">
                      <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <span className="material-symbols-outlined text-2xl font-black">
                          {i === 0 ? 'bolt' : (i === 1 ? 'rocket_launch' : 'auto_awesome')}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{booster.name}</h3>
                      <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">{booster.description}</p>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-primary/11 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/10">
                          {new Intl.NumberFormat('id-ID').format(booster.token_amount)} AI Tokens
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 mb-8">
                        <span className="text-3xl font-black text-slate-900 dark:text-white">{formatPrice(price)}</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sekali Bayar</span>
                      </div>

                      <div className="space-y-4 mb-10">
                        {features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center border border-green-500/10">
                              <span className="material-symbols-outlined text-[12px] font-black">check</span>
                            </div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBoosterSelect(booster)}
                      className="w-full py-5 bg-slate-900 border-2 border-slate-900 dark:bg-white dark:border-white text-white dark:text-slate-900 rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary hover:border-primary hover:text-white dark:hover:bg-primary dark:hover:border-primary transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                    >
                      Beli Booster
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Info Section */}
            <div className="bg-primary/5 rounded-[40px] px-8 py-12 md:px-16 flex flex-col md:flex-row items-center gap-12 border border-primary/10">
              <div className="flex-shrink-0 relative">
                <div className="w-24 h-24 bg-primary rounded-full blur-2xl absolute inset-0 animate-pulse"></div>
                <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center relative z-10 shadow-2xl shadow-primary/30">
                  <span className="material-symbols-outlined text-4xl font-black">info</span>
                </div>
              </div>
              <div className="space-y-4 text-center md:text-left">
                <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Apa itu Token Booster?</h4>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  Token Booster adalah kuota tambahan AI Insights yang dapat Anda beli kapan saja. Token ini akan ditambahkan pada kuota token dari paket langganan Anda.
                </p>
                <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <span className="material-symbols-outlined text-primary text-sm">flash_on</span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Instant Activation</span>
                  </div>
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
