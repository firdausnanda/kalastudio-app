import { useState, useEffect } from 'react';
import { usePage, useForm, router } from '@inertiajs/react';
import axios from 'axios';
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardSidebar from '@/Components/DashboardSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import Modal from '@/Components/Modal';

export default function IntegrasiPage({ accounts = [], businesses = [] }) {
  const { flash = {} } = usePage().props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [activeConnectingId, setActiveConnectingId] = useState(null);
  const [pollingStatus, setPollingStatus] = useState(false);

  const { data, setData, post, patch, delete: destroy, processing, errors, reset } = useForm({
    phone_number: '',
    label: '',
    business_id: '',
    new_business_name: '',
  });

  const { data: editData, setData: setEditData, patch: updateAccount, processing: updating } = useForm({
    label: '',
    is_primary: false,
    receive_notifications: true,
    external_account_id: ''
  });

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

  const fetchQrCode = async (id) => {
    let attempts = 0;
    const maxAttempts = 5;
    const delay = 3000;

    while (attempts < maxAttempts) {
      attempts++;
      console.log(`Fetching QR Code attempt ${attempts}...`);

      try {
        const res = await axios.get(route('integrasi.qrcode', id));
        const qrData = res.data?.data?.qr || res.data?.qr;

        if (qrData) {
          setQrCodeData(qrData);
          setLoadingQr(false);
          return true;
        }
      } catch (err) {
        console.error('Error fetching QR:', err);
      }

      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.error('QR Code not found after max attempts');
    setLoadingQr(false);
    return false;
  };

  const startPollingStatus = async (id) => {
    setPollingStatus(true);
    let attempts = 0;
    const maxAttempts = 30;
    const delay = 5000;

    while (attempts < maxAttempts) {
      if (!isQrModalOpen) break;

      attempts++;
      try {
        const res = await axios.get(route('integrasi.status', id));
        const status = res.data?.wa_status || res.data?.data?.wa_status || res.data?.response?.wa_status;

        console.log(`Polling status attempt ${attempts}:`, status);

        if (status === 'connected') {
          setIsQrModalOpen(false);
          setQrCodeData(null);
          setLoadingQr(false);
          setPollingStatus(false);

          router.reload({
            only: ['accounts'],
            preserveScroll: true
          });
          return;
        }
      } catch (err) {
        console.error('Error polling status:', err);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
    setPollingStatus(false);
  };

  const handleConnect = async (id) => {
    setLoadingQr(true);
    setQrCodeData(null);
    setIsQrModalOpen(true);
    setActiveConnectingId(id);

    try {
      await axios.post(route('integrasi.connect', id));
      const hasQr = await fetchQrCode(id);
      if (hasQr) {
        startPollingStatus(id);
      }
    } catch (err) {
      console.error('Error connecting:', err);
      setLoadingQr(false);
    }
  };

  const handleShowQr = (id) => {
    setLoadingQr(true);
    setQrCodeData(null);
    setIsQrModalOpen(true);
    setActiveConnectingId(id);
    fetchQrCode(id).then(hasQr => {
      if (hasQr) {
        startPollingStatus(id);
      }
    });
  };

  const handleDisconnect = (id) => {
    if (confirm('Apakah Anda yakin ingin memutuskan integrasi WhatsApp ini?')) {
      router.post(route('integrasi.disconnect', id));
    }
  };

  const handleReconnect = (id) => {
    router.post(route('integrasi.reconnect', id));
  };

  const handleAddAccount = (e) => {
    e.preventDefault();
    post(route('integrasi.store'), {
      onSuccess: (page) => {
        if (!page.props.flash.error) {
          setIsAddModalOpen(false);
          reset();
        }
      }
    });
  };

  const handleOpenEdit = (account) => {
    if (!account.local_data) return;

    setSelectedAccount(account.local_data);

    setEditData({
      label: account.local_data.label,
      is_primary: account.local_data.is_primary,
      receive_notifications: account.local_data.receive_notifications,
      external_account_id: account.account_id
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAccount = (e) => {
    e.preventDefault();
    updateAccount(route('integrasi.update', selectedAccount.id), {
      onSuccess: (page) => {
        if (!page.props.flash.error) {
          setIsEditModalOpen(false);
        }
      }
    });
  };

  const togglePrimary = (account) => {
    if (!account.local_data || account.local_data.is_primary) return;
    router.patch(route('integrasi.update', account.local_data.id), {
      is_primary: true
    }, {
      preserveScroll: true
    });
  };

  const toggleNotifications = (account) => {
    if (!account.local_data) return;
    router.patch(route('integrasi.update', account.local_data.id), {
      receive_notifications: !account.local_data.receive_notifications
    }, {
      preserveScroll: true
    });
  };

  const handleDeleteAccount = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus integrasi WhatsApp ini?')) {
      destroy(route('integrasi.destroy', id), {
        preserveScroll: true
      });
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Integrasi WhatsApp</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mt-3">
                  Kelola koneksi multi-akun WhatsApp untuk operasional bisnis Anda.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-xl">add</span>
                Tambah Akun
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {accounts?.length > 0 ? accounts.map((account) => {
                const { wa_status, nama_tenant, nomor_bot } = account.accounts;
                const localData = account.local_data;
                const isConnected = wa_status === 'connected';
                const isWaiting = wa_status === 'waiting_qr';
                const isNeedsReconnect = wa_status === 'reconnect';

                const statusConfig = {
                  connected: { color: 'emerald', icon: 'verified', label: 'Terhubung' },
                  waiting_qr: { color: 'indigo', icon: 'qr_code_scanner', label: 'Menunggu Scan' },
                  disconnected: { color: 'rose', icon: 'link_off', label: 'Terputus' },
                  reconnect: { color: 'amber', icon: 'sync_problem', label: 'Butuh Rekoneksi' }
                };

                const config = statusConfig[wa_status] || statusConfig.disconnected;

                return (
                  <div
                    key={account.account_id}
                    className={`group relative flex flex-col bg-white dark:bg-slate-900 rounded-[32px] border transition-all duration-500 hover:translate-y-[-4px] ${isConnected
                      ? 'border-emerald-500/20 shadow-xl shadow-emerald-500/5'
                      : 'border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none'
                      }`}
                  >
                    <div className="p-8 flex-grow">
                      <div className="flex justify-between items-start mb-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${isConnected
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary'
                          }`}>
                          <span className="material-symbols-outlined text-3xl">
                            {config.icon}
                          </span>
                        </div>

                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-colors ${isConnected
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20'
                          : isWaiting
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20'
                            : isNeedsReconnect
                              ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20'
                              : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full animate-pulse bg-current`}></span>
                          {config.label}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">
                          {localData?.label || nama_tenant}
                        </h3>
                        <div className="flex items-center gap-2.5 text-slate-400 dark:text-slate-500 font-bold tracking-wider">
                          <span className="material-symbols-outlined text-lg">phone</span>
                          <p className="text-sm">+{nomor_bot}</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-8 pb-8">
                      <div className="pt-8 border-t border-slate-50 dark:border-slate-800/50 space-y-3">
                        {wa_status === 'disconnected' && (
                          <button
                            onClick={() => handleConnect(account.account_id)}
                            className="w-full py-4 bg-slate-900 dark:bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-primary dark:hover:bg-primary/90 transition-all shadow-xl shadow-slate-900/10 dark:shadow-primary/20 active:scale-[0.98]"
                          >
                            Hubungkan Sekarang
                          </button>
                        )}

                        {wa_status === 'connected' && (
                          <button
                            onClick={() => handleDisconnect(account.account_id)}
                            className="w-full py-4 bg-rose-50 text-rose-500 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-rose-100 transition-all active:scale-[0.98]"
                          >
                            Putuskan Koneksi
                          </button>
                        )}

                        {wa_status === 'waiting_qr' && (
                          <button
                            onClick={() => handleShowQr(account.account_id)}
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98]"
                          >
                            Tampilkan QR Code
                          </button>
                        )}

                        {wa_status === 'reconnect' && (
                          <button
                            onClick={() => handleReconnect(account.account_id)}
                            className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 active:scale-[0.98]"
                          >
                            Hubungkan Ulang
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEdit(account)}
                          className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 dark:hover:bg-slate-700 dark:hover:text-slate-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                          <span className="material-symbols-outlined text-base">settings</span>
                          Pengaturan Akun
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-100 dark:border-slate-800">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[32px] flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-slate-300 text-4xl">mobile_off</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Belum Ada Akun</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 mb-8">Daftarkan akun WhatsApp Anda untuk memulai integrasi.</p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[28px] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-2xl active:scale-[0.97]"
                  >
                    <span className="material-symbols-outlined text-xl">add</span>
                    Tambah Akun Sekarang
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <DashboardFooter />

      {/* Add Account Modal */}
      <Modal show={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} maxWidth="lg">
        <form onSubmit={handleAddAccount} className="p-10 md:p-12 space-y-10 dark:bg-slate-900 rounded-[40px] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

          <div className="relative text-center space-y-3">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Tambah Akun WhatsApp</h3>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">
              Hubungkan akun baru untuk mengelola pesan bisnis Anda melalui platform kami.
            </p>
          </div>

          {flash.error && (
            <div className="relative bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-rose-500 text-sm">error</span>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{flash.error}</p>
              </div>
            </div>
          )}

          <div className="space-y-6 relative">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nama Tenant / Label</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">label</span>
                <input
                  type="text"
                  value={data.label}
                  onChange={e => setData('label', e.target.value)}
                  placeholder="Contoh: Tenant A"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[24px] py-4 pl-14 pr-6 font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-0 focus:border-primary transition-all shadow-inner"
                  required
                />
              </div>
              {errors.label && <p className="text-rose-500 text-[9px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.label}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nomor WhatsApp</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">phone</span>
                <input
                  type="text"
                  value={data.phone_number}
                  onChange={e => setData('phone_number', e.target.value)}
                  placeholder="628123456789"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[24px] py-4 pl-14 pr-6 font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-0 focus:border-primary transition-all shadow-inner"
                  required
                />
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 ml-1">Gunakan kode negara (Contoh: 62 untuk Indonesia)</p>
              {errors.phone_number && <p className="text-rose-500 text-[9px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.phone_number}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Alokasi Bisnis</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">business_center</span>
                <select
                  value={data.business_id}
                  onChange={e => {
                    setData('business_id', e.target.value);
                    if (e.target.value !== 'new') setData('new_business_name', '');
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[24px] py-4 pl-14 pr-12 font-bold text-slate-900 dark:text-white focus:ring-0 focus:border-primary transition-all shadow-inner appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Pilih Bisnis Anda</option>
                  {businesses.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                  <option value="new" className="text-primary font-black">+ --- Tambah Bisnis Baru ---</option>
                </select>
                <span className="absolute right-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 pointer-events-none">expand_more</span>
              </div>
              {errors.business_id && <p className="text-rose-500 text-[9px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.business_id}</p>}
            </div>

            {data.business_id === 'new' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nama Bisnis Baru</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">add_business</span>
                  <input
                    type="text"
                    value={data.new_business_name}
                    onChange={e => setData('new_business_name', e.target.value)}
                    placeholder="Contoh: Digital Agency Sejahtera"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[24px] py-4 pl-14 pr-6 font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-0 focus:border-primary transition-all shadow-inner"
                    required
                  />
                </div>
                {errors.new_business_name && <p className="text-rose-500 text-[9px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.new_business_name}</p>}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 relative">
            <button
              type="submit"
              disabled={processing}
              className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[28px] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-2xl active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {processing && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {processing ? 'Mendaftarkan...' : 'Daftarkan Akun Baru'}
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="w-full py-4 bg-transparent text-slate-400 dark:text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-600 dark:hover:text-slate-300 transition-all font-bold"
            >
              Batalkan
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Account Modal */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="lg">
        <form onSubmit={handleUpdateAccount} className="p-10 md:p-12 space-y-10 dark:bg-slate-900 rounded-[40px] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

          <div className="relative text-center space-y-3">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Edit Akun WhatsApp</h3>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] max-w-xs mx-auto leading-relaxed">
              Perbarui konfigurasi dan pengaturan notifikasi untuk akun ini.
            </p>
          </div>

          {flash.error && (
            <div className="relative bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-rose-500 text-sm">error</span>
                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{flash.error}</p>
              </div>
            </div>
          )}

          <div className="space-y-8 relative">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Nama Tenant / Label</label>
              <div className="relative group">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 group-focus-within:text-primary transition-colors">label</span>
                <input
                  type="text"
                  value={editData.label}
                  onChange={e => setEditData('label', e.target.value)}
                  placeholder="Contoh: CS Utama"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-[24px] py-4 pl-14 pr-6 font-bold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:ring-0 focus:border-primary transition-all shadow-inner"
                  required
                />
              </div>
              {errors.label && <p className="text-rose-500 text-[9px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.label}</p>}
            </div>

            <div className="flex flex-col gap-6">
              <label className="flex items-center gap-4 group cursor-pointer p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={editData.is_primary}
                    onChange={e => setEditData('is_primary', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-emerald-500 transition-all shadow-inner"></div>
                  <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-7 transition-all shadow-md"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest group-hover:text-emerald-500 transition-colors">Akun Utama</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Prioritaskan untuk pengiriman pesan default</span>
                </div>
              </label>

              <label className="flex items-center gap-4 group cursor-pointer p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={editData.receive_notifications}
                    onChange={e => setEditData('receive_notifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-primary transition-all shadow-inner"></div>
                  <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-7 transition-all shadow-md"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest group-hover:text-primary transition-colors">Notifikasi Aktif</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Terima pemberitahuan aktivitas untuk akun ini</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4 relative">
            <button
              type="submit"
              disabled={updating}
              className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[28px] font-black text-[12px] uppercase tracking-[0.3em] hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-2xl active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {updating && <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin"></div>}
              {updating ? 'Memperbarui...' : 'Simpan Perubahan'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="w-full py-4 bg-transparent text-slate-400 dark:text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:text-slate-600 dark:hover:text-slate-300 transition-all font-bold"
            >
              Batalkan
            </button>
          </div>
        </form>
      </Modal>

      {/* QR Code Modal (Existing) */}
      <Modal show={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} maxWidth="2xl">
        <div className="dark:bg-slate-900 rounded-[40px] overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 relative h-full">
            {/* Left Side: Instructions & Actions */}
            <div className="p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800/50">
              <div className="space-y-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-4">Tautkan <br /> Perangkat</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">WhatsApp Multi-Device Beta</p>
                </div>

                <div className="space-y-6">
                  {[
                    { step: '01', text: 'Buka WhatsApp di telepon Anda' },
                    { step: '02', text: 'Ketuk Menu atau Pengaturan dan pilih Perangkat Tertaut' },
                    { step: '03', text: 'Ketuk Tautkan Perangkat' },
                    { step: '04', text: 'Arahkan telepon Anda ke layar ini untuk memindai kode' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start group">
                      <span className="text-xs font-black text-slate-300 dark:text-slate-700 group-hover:text-primary transition-colors">{item.step}</span>
                      <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed uppercase tracking-wide">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 space-y-3">
                <button
                  onClick={() => setIsQrModalOpen(false)}
                  className="w-full py-5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-3xl font-black text-[12px] uppercase tracking-[0.3em] hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-xl active:scale-[0.97]"
                >
                  Selesai
                </button>
                <button
                  onClick={() => setIsQrModalOpen(false)}
                  className="w-full py-3 text-slate-400 hover:text-rose-500 font-bold text-[10px] uppercase tracking-widest transition-colors"
                >
                  Batalkan Koneksi
                </button>
              </div>
            </div>

            {/* Right Side: QR Code & Tips */}
            <div className="p-8 md:p-12 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col items-center justify-center space-y-8">
              <div className="relative group w-full max-w-[280px]">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-indigo-500/20 rounded-[56px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative bg-white dark:bg-slate-900 rounded-[48px] p-6 shadow-2xl border border-white dark:border-slate-800 transition-transform duration-500 group-hover:scale-[1.02]">
                  {loadingQr ? (
                    <div className="aspect-square flex flex-col items-center justify-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest animate-pulse text-center px-4">Mengamankan Sesi Kode...</p>
                    </div>
                  ) : qrCodeData ? (
                    <img src={qrCodeData} alt="WhatsApp QR Code" className="w-full h-full object-contain animate-in fade-in zoom-in duration-700" />
                  ) : (
                    <div className="aspect-square flex flex-col items-center justify-center text-center p-6 space-y-4">
                      <span className="material-symbols-outlined text-rose-500 text-4xl">warning</span>
                      <p className="text-[10px] font-bold text-slate-400 leading-tight">Gagal memuat QR Code.</p>
                      <button onClick={() => fetchQrCode(activeConnectingId)} className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Coba Lagi</button>
                    </div>
                  )}
                </div>

                {qrCodeData && !loadingQr && (
                  <button
                    onClick={() => fetchQrCode(activeConnectingId)}
                    className="absolute -bottom-4 right-4 w-12 h-12 bg-primary text-white rounded-2xl shadow-lg border-4 border-white dark:border-slate-900 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-xl">refresh</span>
                  </button>
                )}
              </div>

              <div className="w-full max-w-[280px] space-y-4">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Menunggu Pemindaian Kode...</span>
                </div>

                <div className="p-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                  <span className="material-symbols-outlined text-slate-400 text-lg mt-0.5">info</span>
                  <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed uppercase tracking-wide">
                    Pastikan telepon tetap terhubung internet dan gunakan versi WhatsApp terbaru.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
