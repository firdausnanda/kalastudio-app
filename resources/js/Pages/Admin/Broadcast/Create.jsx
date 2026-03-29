import { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminHeader from '@/Components/Admin/AdminHeader';
import AdminSidebar from '@/Components/Admin/AdminSidebar';
import DashboardFooter from '@/Components/DashboardFooter';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Swal from 'sweetalert2';
import Select from 'react-select';

export default function BroadcastCreate({ auth, roles }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        message: '',
        type: 'whatsapp',
        target_role: '',
    });

    // Format roles for react-select
    const roleOptions = [
        { value: '', label: 'Semua Pengguna' },
        ...roles.map(role => ({ value: role.name, label: role.name }))
    ];

    // Custom styles for react-select
    const selectStyles = {
        control: (base, state) => ({
            ...base,
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: state.isFocused ? '0 0 0 2px rgba(239, 68, 68, 0.2)' : 'none',
            borderRadius: '1rem',
            padding: '4px 8px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
        }),
        menu: (base) => ({
            ...base,
            backgroundColor: 'white',
            borderRadius: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            padding: '8px',
            border: '1px solid #f1f5f9',
            zIndex: 50,
        }),
        option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? '#ef4444' : state.isFocused ? '#fef2f2' : 'transparent',
            color: state.isSelected ? 'white' : '#64748b',
            borderRadius: '0.75rem',
            padding: '10px 16px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:active': {
                backgroundColor: '#ef4444',
                color: 'white',
            }
        }),
        singleValue: (base) => ({
            ...base,
            color: '#0f172a',
        })
    };

    useEffect(() => {
        const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const submit = (e) => {
        e.preventDefault();
        
        Swal.fire({
            title: 'Kirim Broadcast?',
            text: "Pesan akan dikirim ke semua target yang dipilih.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#red-500',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Ya, Kirim Sekarang',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                post(route('admin.broadcasts.store'), {
                    onSuccess: () => {
                        reset();
                        Swal.fire({
                            icon: 'success',
                            title: 'Diproses',
                            text: 'Broadcast telah masuk antrean pengiriman.',
                            timer: 3000,
                            showConfirmButton: false
                        });
                    },
                });
            }
        });
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen flex flex-col font-display text-slate-900 dark:text-white transition-all">
            <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Head title="Buat Broadcast" />

            <div className="flex flex-grow relative overflow-hidden">
                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <main className="flex-grow p-4 md:p-8 lg:p-10 transition-all duration-300">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="flex items-center gap-4">
                            <Link 
                                href={route('admin.broadcasts.index')}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-50 transition-all shadow-sm group"
                            >
                                <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                            </Link>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight">Buat Broadcast</h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">Susun pesan yang ingin Anda kirimkan.</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
                            <form onSubmit={submit} className="p-8 md:p-12 space-y-8 text-left">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Type Selection */}
                                    <div className="space-y-4 text-left">
                                        <InputLabel value="Tipe Pengiriman" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1" />
                                        <div className="grid grid-cols-2 gap-4">
                                            {['whatsapp', 'email'].map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setData('type', type)}
                                                    className={`px-4 py-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                                                        data.type === type 
                                                            ? 'border-red-500 bg-red-50/50 text-red-500 dark:bg-red-500/10' 
                                                            : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 text-slate-400 hover:border-slate-200'
                                                    }`}
                                                >
                                                    <span className="material-symbols-outlined text-2xl">
                                                        {type === 'whatsapp' ? 'chat' : 'mail'}
                                                    </span>
                                                    <span className="text-xs font-black uppercase tracking-widest">{type}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <InputError message={errors.type} />
                                    </div>

                                    {/* Target Selection with React Select */}
                                    <div className="space-y-4 text-left">
                                        <InputLabel value="Target Pengguna (Role)" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1" />
                                        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl">
                                            <Select
                                                value={roleOptions.find(opt => opt.value === data.target_role)}
                                                onChange={opt => setData('target_role', opt.value)}
                                                options={roleOptions}
                                                styles={selectStyles}
                                                placeholder="Pilih target..."
                                                isSearchable={false}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                            />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium px-1 italic">*Tentukan target pengiriman berdasakan peran.</p>
                                        <InputError message={errors.target_role} />
                                    </div>
                                </div>

                                {/* Subject field for Email */}
                                {data.type !== 'whatsapp' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <InputLabel value="Subjek Pesan" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1" />
                                        <TextInput
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-red-500/20 text-sm font-bold transition-all"
                                            value={data.subject}
                                            onChange={e => setData('subject', e.target.value)}
                                            placeholder="Masukkan subjek email..."
                                            required={data.type !== 'whatsapp'}
                                        />
                                        <InputError message={errors.subject} />
                                    </div>
                                )}

                                {/* Message Content */}
                                <div className="space-y-4">
                                    <InputLabel value="Isi Pesan" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1" />
                                    <div className="relative group">
                                        <textarea
                                            className="w-full px-5 py-5 rounded-3xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-red-500/20 text-sm font-bold min-h-[250px] transition-all scrollbar-hide"
                                            value={data.message}
                                            onChange={e => setData('message', e.target.value)}
                                            placeholder="Tuliskan pesan Anda di sini..."
                                            required
                                        ></textarea>
                                        <div className="absolute top-4 right-4 text-[10px] font-black tracking-widest uppercase text-slate-300 pointer-events-none group-focus-within:text-red-500/30 transition-colors">
                                            {data.message.length} Karakter
                                        </div>
                                    </div>
                                    <InputError message={errors.message} />
                                </div>

                                <div className="flex flex-col md:flex-row items-center gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                                    <SecondaryButton
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="w-full md:w-auto px-10 py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] border-slate-200"
                                    >
                                        Batal
                                    </SecondaryButton>
                                    <PrimaryButton
                                        type="submit"
                                        className="w-full md:flex-1 justify-center py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] bg-red-500 hover:bg-red-600 shadow-2xl shadow-red-500/30 transition-all active:scale-[0.98]"
                                        disabled={processing}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-lg">send</span>
                                            {processing ? 'Sedang Mengirim...' : 'Kirim Broadcast Sekarang'}
                                        </div>
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>

                        {/* Tip Box */}
                        <div className="bg-amber-50 dark:bg-amber-500/5 p-6 rounded-3xl border border-amber-100 dark:border-amber-500/10 flex gap-5 items-start">
                            <div className="w-10 h-10 rounded-xl bg-amber-500 flex-shrink-0 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                                <span className="material-symbols-outlined">lightbulb</span>
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Tips Broadcast</h4>
                                <p className="text-sm text-amber-600/80 dark:text-amber-500/60 font-medium">Gunakan pesan yang padat dan informatif. Untuk WhatsApp, hindari pesan yang terlalu panjang agar mudah dibaca oleh target pengguna.</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <DashboardFooter />
        </div>
    );
}
