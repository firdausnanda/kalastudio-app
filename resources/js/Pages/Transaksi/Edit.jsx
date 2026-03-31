import { useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import Swal from 'sweetalert2';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { id } from 'date-fns/locale';
import DashboardHeader from '@/Components/DashboardHeader';
import DashboardSidebar from '@/Components/DashboardSidebar';
import DashboardFooter from '@/Components/DashboardFooter';

registerLocale('id', id);

export default function EditTransactionPage({ transaksi }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { data, setData, patch, processing, errors } = useForm({
    nominal: '',
    transaksi_at: new Date(),
    deskripsi: '',
    tipe: 'out',
  });

  // Ensure form is populated when props arrive
  useEffect(() => {
    if (transaksi) {
      setData({
        nominal: (transaksi.total || transaksi.nominal || '').toString(),
        transaksi_at: transaksi.transaksi_at ? new Date(transaksi.transaksi_at) : new Date(),
        deskripsi: transaksi.deskripsi || '',
        tipe: (transaksi.tipe === 'pengeluaran' || transaksi.tipe === 'out') ? 'out' : 'in',
      });
    }
  }, [transaksi]);

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

  const { flash } = usePage().props;

  useEffect(() => {
    if (flash.success) {
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: flash.success,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: (typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark') ? '#0f172a' : '#fff',
        color: (typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark') ? '#fff' : '#000',
        customClass: {
          popup: 'rounded-[32px] border border-slate-100 dark:border-slate-800'
        }
      });
    }
    if (flash.error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: flash.error,
        background: (typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark') ? '#0f172a' : '#fff',
        color: (typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark') ? '#fff' : '#000',
        customClass: {
          popup: 'rounded-[32px] border border-slate-100 dark:border-slate-800'
        }
      });
    }
  }, [flash]);

  const handleUpdate = (e) => {
    e.preventDefault();
    patch(route('transaksi.update', transaksi.id));
  };

  const formatRupiah = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('id-ID').format(value);
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value.replace(/\./g, '');
    if (!isNaN(rawValue) || rawValue === '') {
      setData('nominal', rawValue);
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
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb & Title */}
            <div className="mb-10">
              <Link href={route('transaksi.index')} className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors mb-4 uppercase tracking-widest">
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Kembali ke Daftar
              </Link>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">Edit Transaksi</h2>
              <p className="text-slate-500 dark:text-slate-400">Ubah detail transaksi yang sudah dicatat.</p>
            </div>

            <form onSubmit={handleUpdate} className="space-y-8">
              {/* Type Switcher */}
              <div className="bg-white dark:bg-slate-900 p-2 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex gap-2">
                <button
                  type="button"
                  onClick={() => setData('tipe', 'out')}
                  className={`flex-grow flex items-center justify-center gap-3 py-4 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all ${data.tipe === 'out' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <span className="material-symbols-outlined">remove_circle</span>
                  Pengeluaran
                </button>
                <button
                  type="button"
                  onClick={() => setData('tipe', 'in')}
                  className={`flex-grow flex items-center justify-center gap-3 py-4 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all ${data.tipe === 'in' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                >
                  <span className="material-symbols-outlined">add_circle</span>
                  Pemasukan
                </button>
              </div>

              {/* Main Form Fields */}
              <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-8">
                {/* Amount Input */}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Nominal Transaksi</label>
                  <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 group-focus-within:text-primary transition-colors">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      placeholder="0"
                      className="w-full pl-20 pr-8 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-[24px] outline-none focus:ring-4 focus:ring-primary/10 transition-all text-3xl font-black dark:text-white placeholder:text-slate-200 dark:placeholder:text-slate-700"
                      value={formatRupiah(data.nominal)}
                      onChange={handleAmountChange}
                    />
                  </div>
                  {errors.nominal && <div className="text-red-500 text-xs mt-2 font-bold ml-1">{errors.nominal}</div>}
                </div>

                <div className="grid md:grid-cols-1 gap-8">
                  {/* Date Input */}
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Tanggal</label>
                    <div className="relative custom-datepicker">
                      <DatePicker
                        selected={data.transaksi_at}
                        onChange={(date) => setData('transaksi_at', date)}
                        dateFormat="dd MMMM yyyy"
                        locale="id"
                        className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-[20px] outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold dark:text-white"
                        popperPlacement="bottom-end"
                        calendarClassName="premium-calendar"
                      />
                      <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">calendar_today</span>
                    </div>
                    {errors.transaksi_at && <div className="text-red-500 text-xs mt-2 font-bold ml-1">{errors.transaksi_at}</div>}
                  </div>
                </div>

                {/* Note Area */}
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">Catatan / Deskripsi</label>
                  <textarea
                    rows="3"
                    placeholder="Contoh: Beli keperluan toko..."
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-[20px] outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold dark:text-white placeholder:text-slate-300"
                    value={data.deskripsi}
                    onChange={(e) => setData('deskripsi', e.target.value)}
                  ></textarea>
                  {errors.deskripsi && <div className="text-red-500 text-xs mt-2 font-bold ml-1">{errors.deskripsi}</div>}
                </div>

                {/* Source Info */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl">{transaksi?.sumber_input === 'wa' ? 'auto_awesome' : 'edit_square'}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sumber Pencatatan</p>
                    <p className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase">{transaksi?.sumber_input === 'wa' ? 'WhatsApp AI' : (transaksi?.sumber_input || 'Manual')}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-grow py-5 bg-primary text-white rounded-[24px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:-translate-y-1 active:scale-95 transition-all text-sm disabled:opacity-50"
                >
                  {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
                </button>
                <Link
                  href={route('transaksi.index')}
                  className="px-10 py-5 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-[24px] font-black uppercase tracking-[0.2em] border border-slate-100 dark:border-slate-800 hover:bg-slate-50 transition-all text-sm"
                >
                  Batal
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>

      <DashboardFooter />
    </div>
  );
}
