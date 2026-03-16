import { useState, useEffect } from 'react';
import { usePage, Link } from '@inertiajs/react';
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardSidebar from '@/Components/DashboardSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import Modal from '@/Components/Modal';

export default function SubscriptionPage({ transactions = [], currentPackage = null }) {
  const { userDataExternal } = usePage().props;
  const userData = userDataExternal?.data || userDataExternal;
  const currentPlanName = userData?.plan || 'Free';

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const activePlan = plans.find(p => p.isCurrent) || (currentPackage ? {
    ...currentPackage,
    price: typeof currentPackage.price === 'number'
      ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(currentPackage.price)
      : currentPackage.price,
    period: '/bulan',
    isCurrent: true
  } : null);

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
    fetchPlans();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/packages');
      const result = await response.json();

      if (result.success && result.data) {
        const mappedPlans = result.data.map(pkg => {
          const monthlyPrice = pkg.prices.find(p => p.billing_cycle === 'monthly')?.price || 0;

          let features = [];
          try {
            features = typeof pkg.features === 'string' ? JSON.parse(pkg.features) : (pkg.features || []);
          } catch (e) {
            console.error('Error parsing features for', pkg.name, e);
          }

          return {
            name: pkg.name,
            price: monthlyPrice === 0 ? 'Gratis' : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(monthlyPrice),
            period: '/bulan',
            features: features,
            description: pkg.description,
            tokens: pkg.token_amount,
            rawPrices: pkg.prices,
            buttonText: pkg.name.toLowerCase() === currentPlanName.toLowerCase() ? 'Paket Aktif' : 'Pilih ' + pkg.name,
            isCurrent: pkg.name.toLowerCase() === currentPlanName.toLowerCase(),
            popular: pkg.name === 'Business',
            color: pkg.name === 'Starter' ? 'bg-blue-500' : (pkg.name === 'Business' ? 'bg-primary' : 'bg-amber-500'),
          };
        });

        // Add Professional plan fallback if not in API
        if (!mappedPlans.find(p => p.name === 'Professional')) {
          mappedPlans.push({
            name: 'Professional',
            price: 'Custom',
            period: '/bulan',
            features: ['Unlimited Token', 'Fitur Custom', 'Multi User Access', 'API Access', '24/7 VIP Support'],
            buttonText: 'Hubungi Kami',
            isCurrent: currentPlanName === 'Professional',
            color: 'bg-amber-500',
          });
        }

        // Add Free plan fallback if it's the current plan but not in API
        if (currentPlanName === 'Free' && !mappedPlans.find(p => p.name === 'Free')) {
          mappedPlans.unshift({
            name: 'Free',
            price: 'Gratis',
            period: '/selamanya',
            features: ['Akses Dasar', '1 Proyek Aktif', '100 AI Tokens', 'Support Komunitas'],
            description: 'Nikmati fitur dasar Kalastudio untuk memulai bisnis Anda secara gratis.',
            tokens: 100,
            isCurrent: true,
            color: 'bg-slate-400',
            buttonText: 'Paket Aktif'
          });
        }

        setPlans(mappedPlans);
      }
    } catch (error) {
      console.error('Failed to fetch packages:', error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display transition-colors duration-300">
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
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Kelola Langganan</h2>
              <p className="text-slate-500 dark:text-slate-400">Pilih paket terbaik untuk pertumbuhan bisnis Anda.</p>
            </div>

            {/* Current Plan Status Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col lg:flex-row items-stretch">
              <div className="flex-grow p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner">
                    <span className="material-symbols-outlined text-primary text-4xl">verified</span>
                  </div>
                </div>

                <div className="flex-grow space-y-4 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {currentPlanName} Plan
                    </h3>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Langganan Aktif</span>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                    Bisnis Anda saat ini menggunakan paket <span className="text-slate-900 dark:text-white font-bold uppercase">{currentPlanName}</span>.
                    Tingkatkan paket langganan anda agar memiliki akses penuh ke fitur optimasi AI dan analitik performa tingkat lanjut.
                  </p>

                  <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      <span className="text-[10px] font-black uppercase tracking-wider">AI Integrated</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="material-symbols-outlined text-sm">support_agent</span>
                      <span className="text-[10px] font-black uppercase tracking-wider">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-800/30 lg:w-80 p-8 flex flex-col justify-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-4 bg-primary text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all text-center"
                >
                  Tingkatkan Paket
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(true)}
                  className="w-full py-4 text-slate-500 dark:text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Detail & Fitur
                </button>
              </div>
            </div>

            {/* Pricing Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl">
                <span className="material-symbols-outlined animate-spin text-primary text-5xl mb-4">refresh</span>
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Menyinkronkan Paket...</p>
              </div>
            ) : (
              <section id='pricing' className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan, i) => (
                  <div
                    key={i}
                    className={`bg-white dark:bg-slate-900 p-8 rounded-[40px] border transition-all flex flex-col hover:scale-[1.02] ${plan.isCurrent ? 'border-primary ring-4 ring-primary/5 shadow-2xl shadow-primary/10' : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
                  >
                    {plan.popular && (
                      <div className="self-start mb-6 px-4 py-1.5 bg-primary text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">Paling Populer</div>
                    )}
                    <h4 className={`text-sm font-black uppercase tracking-[0.2em] mb-4 ${plan.isCurrent ? 'text-primary' : 'text-slate-400'}`}>{plan.name}</h4>
                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                      <span className="text-sm font-bold text-slate-400">{plan.period}</span>
                    </div>

                    <div className="space-y-4 mb-10 flex-grow">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${plan.isCurrent ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                      {plan.buttonText}
                    </button>
                  </div>
                ))}
              </section>
            )}

            {/* Billing History Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
              <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Riwayat Pembayaran</h3>
                <button className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Download Semua PDF</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30">
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">No. Invois</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tanggal</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nominal</th>
                      <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {transactions.length > 0 ? (
                      transactions.map((bill, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-8 py-5 font-black text-xs text-slate-900 dark:text-white uppercase tracking-tight">#{bill.xendit_invoice_id || bill.id}</td>
                          <td className="px-8 py-5 font-bold text-xs text-slate-600 dark:text-slate-400">
                            {new Date(bill.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </td>
                          <td className="px-8 py-5 font-black text-xs text-slate-900 dark:text-white">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(bill.grand_total)}
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase ${bill.status === 'PAID' || bill.status === 'SETTLED'
                              ? 'bg-green-500/10 text-green-600 border-green-500/10'
                              : 'bg-amber-500/10 text-amber-600 border-amber-500/10'
                              }`}>
                              {bill.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-center">
                            {bill.xendit_invoice_url && (
                              <a
                                href={bill.xendit_invoice_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"
                                title="Lihat Invois"
                              >
                                <span className="material-symbols-outlined">launch</span>
                              </a>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center">
                          <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined text-slate-200 text-6xl mb-4">receipt_long</span>
                            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Belum ada riwayat pembayaran</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <DashboardFooter />

      <Modal show={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} maxWidth="2xl">
        <div className="bg-white dark:bg-slate-900 relative overflow-hidden flex flex-col md:flex-row">
          {/* Left panel: Plan Highlight */}
          <div className="md:w-1/3 bg-slate-50 dark:bg-slate-800/50 p-8 md:p-10 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 flex flex-col">
            <div className="relative mb-8">
              <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-3xl">workspace_premium</span>
              </div>
            </div>

            <div className="flex-grow">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                {activePlan?.name}
              </h3>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Active Plan</span>
              </div>
            </div>
          </div>

          {/* Right panel: Details & Features */}
          <div className="flex-grow p-8 md:p-10 relative">
            <button
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {activePlan ? (
              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Deskripsi Paket</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                    {activePlan.description || "Nikmati seluruh fitur eksklusif dan optimasi AI untuk pertumbuhan bisnis Anda yang lebih cepat."}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-6">Fitur Unggulan</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    {activePlan.features?.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center border border-green-500/10 flex-shrink-0">
                          <span className="material-symbols-outlined text-[12px] font-black">check</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {activePlan.rawPrices && activePlan.rawPrices.length > 0 && (
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Opsi Harga</h4>
                    <div className="space-y-2">
                      {activePlan.rawPrices.map((price, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                          <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase italic">
                            {price.billing_cycle === 'monthly' ? 'Bulanan' : 'Tahunan'}
                          </span>
                          <span className="text-sm font-black text-slate-900 dark:text-white">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-10">
                <span className="material-symbols-outlined text-slate-200 text-6xl mb-4">inventory_2</span>
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Informasi paket tidak tersedia</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
