'use client';

import { useState } from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';

// Payment Components
import PaymentMethodSelector from '@/Components/Payment/PaymentMethodSelector';
import BankTransferInstructions from '@/Components/Payment/BankTransferInstructions';
import QrisInstructions from '@/Components/Payment/QrisInstructions';
import GopayInstructions from '@/Components/Payment/GopayInstructions';
import PaymentStatusPoller from '@/Components/Payment/PaymentStatusPoller';

export default function Checkout({ planName, billingCycle, package: pkg }) {
    const { auth } = usePage().props;
    const [loading, setLoading] = useState(false);
    
    // User Info State
    const [name, setName] = useState('');
    const [email, setEmail] = useState(auth?.user?.email || '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});

    // Payment State
    const [step, setStep] = useState('form'); // form, instructions, success, expired
    const [selectedMethod, setSelectedMethod] = useState('bank_transfer');
    const [selectedBank, setSelectedBank] = useState('bca');
    const [paymentData, setPaymentData] = useState(null);

    // Pricing logic
    const getDynamicPrice = () => {
        if (planName === 'Professional' || (!pkg && planName !== 'Starter' && planName !== 'Free')) return 'Custom';
        if (!pkg) return 0;

        let cycle = 'monthly';
        if (billingCycle === 'annual') cycle = 'annually';
        else if (billingCycle === 'one_time') cycle = 'one_time';

        const priceObj = pkg.prices?.find(p => p.billing_cycle === cycle);
        return priceObj ? parseFloat(priceObj.price) : 0;
    };

    const currentPrice = getDynamicPrice();
    const isCustom = currentPrice === 'Custom';
    const totalAmount = billingCycle === 'annual' ? currentPrice * 12 : currentPrice;

    const handlePayment = async () => {
        if (isCustom) {
            window.location.href = 'mailto:sales@kalastudio.com';
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const response = await axios.post('/payment/create-invoice', {
                plan_name: planName,
                billing_cycle: billingCycle,
                amount: totalAmount,
                email: email,
                name: name,
                password: password,
                password_confirmation: passwordConfirmation,
                payment_method: selectedMethod,
                bank: selectedBank,
            });

            if (response.data.transaction_id) {
                setPaymentData(response.data);
                setStep('instructions');
            } else {
                alert('Terjadi kesalahan saat menyiapkan pembayaran.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                alert('Gagal menghubungkan ke sistem pembayaran.');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        if (price === 'Custom') return 'Custom';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
    };

    return (
        <div className="bg-white text-slate-900 font-display transition-colors duration-300 dark:bg-slate-900 min-h-screen flex flex-col">
            <Head title={`Checkout - ${planName}`} />
            <Header />

            <main className="flex-grow py-20 bg-slate-50 dark:bg-slate-800/30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Steps */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                            {step === 'form' && <>Selesaikan <span className="text-primary">Pembayaran</span></>}
                            {step === 'instructions' && <><span className="text-primary">Instruksi</span> Pembayaran</>}
                            {step === 'success' && <>Pembayaran <span className="text-emerald-500">Berhasil!</span></>}
                            {step === 'expired' && <>Waktu Pembayaran <span className="text-red-500">Habis</span></>}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            {step === 'form' && (auth.user ? 'Detail pesanan Anda sudah siap.' : 'Daftar dan aktifkan akun premium Anda.')}
                            {step === 'instructions' && 'Segera selesaikan pembayaran sebelum batas waktu berakhir.'}
                            {step === 'success' && 'Terima kasih! Akun Anda sedang diaktifkan.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-12 gap-8 items-start">
                        
                        {/* LEFT COLUMN: Order Summary (Visible in most steps) */}
                        {step !== 'success' && (
                            <div className="md:col-span-12 lg:col-span-5 space-y-6">
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-xl">
                                    <h2 className="text-xl font-black mb-6 dark:text-white">Ringkasan Pesanan</h2>
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Paket</span>
                                            <span className="font-black text-slate-900 dark:text-white">{planName}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Siklus Tagihan</span>
                                            <span className="font-black text-slate-900 dark:text-white capitalize">
                                                {billingCycle === 'annual' ? 'Tahunan' : (billingCycle === 'one_time' ? 'Sekali Bayar' : 'Bulanan')}
                                            </span>
                                        </div>

                                        <hr className="border-slate-100 dark:border-slate-800" />
                                        <div className="flex justify-between items-center font-black text-lg">
                                            <span className="text-slate-900 dark:text-white">Total Harga</span>
                                            <span className="text-primary">
                                                {formatPrice(totalAmount)}
                                            </span>
                                        </div>
                                    </div>

                                    {step === 'form' && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex items-start gap-3">
                                            <span className="material-symbols-outlined text-blue-500">info</span>
                                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                                                Pilih metode pembayaran yang paling nyaman bagi Anda. Transaksi diproses secara aman.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* RIGHT COLUMN: Action Column */}
                        <div className={`${step === 'success' ? 'md:col-span-12 max-w-2xl mx-auto' : 'md:col-span-12 lg:col-span-7'}`}>
                            
                            {/* STEP: FORM */}
                            {step === 'form' && (
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
                                    {/* Customer Info */}
                                    <section className="space-y-6">
                                        <h2 className="text-xl font-black dark:text-white">Informasi Pelanggan</h2>
                                        
                                        {!auth.user && (
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Lengkap</label>
                                                <input 
                                                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                                                    className={`w-full px-4 py-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none transition-all font-medium ${errors.name ? 'border-red-500' : 'border-slate-100 dark:border-slate-800 focus:border-primary'}`}
                                                    placeholder="Nama Anda" required
                                                />
                                                {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name[0]}</p>}
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Konfirmasi</label>
                                            <input 
                                                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none transition-all font-medium ${errors.email ? 'border-red-500' : 'border-slate-100 dark:border-slate-800 focus:border-primary'}`}
                                                placeholder="nama@email.com" required disabled={!!auth.user}
                                            />
                                            {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email[0]}</p>}
                                        </div>

                                        {!auth.user && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kata Sandi</label>
                                                    <input 
                                                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                                        className={`w-full px-4 py-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none transition-all font-medium ${errors.password ? 'border-red-500' : 'border-slate-100 dark:border-slate-800 focus:border-primary'}`}
                                                        placeholder="••••••••" required
                                                    />
                                                    {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password[0]}</p>}
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Konfirmasi</label>
                                                    <input 
                                                        type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-white focus:border-primary outline-none transition-all font-medium"
                                                        placeholder="••••••••" required
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </section>

                                    {/* Payment Method Selector */}
                                    <PaymentMethodSelector 
                                        selectedMethod={selectedMethod}
                                        selectedBank={selectedBank}
                                        onMethodChange={setSelectedMethod}
                                        onBankChange={setSelectedBank}
                                    />

                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className={`w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                                            loading 
                                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                                            : 'bg-primary text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:scale-[1.02]'
                                        }`}
                                    >
                                        {loading ? (
                                            <><div className="w-6 h-6 border-4 border-slate-400 border-t-transparent rounded-full animate-spin"></div>Memproses...</>
                                        ) : (
                                            <>{isCustom ? 'Hubungi Sales' : auth.user ? 'Bayar Sekarang' : 'Daftar & Bayar'}<span className="material-symbols-outlined">arrow_forward</span></>
                                        )}
                                    </button>

                                    {!auth.user && (
                                        <div className="space-y-4">
                                            <div className="relative">
                                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
                                                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-4 text-slate-500 font-bold tracking-widest">Atau</span></div>
                                            </div>
                                            <button
                                                onClick={() => window.location.href = `/auth/google?redirect=${encodeURIComponent(window.location.href)}`}
                                                className="w-full border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
                                            >
                                                <img alt="Google" className="w-5 h-5" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" />
                                                Daftar dengan Google
                                            </button>
                                        </div>
                                    )}

                                    <p className="text-center text-xs text-slate-400 font-medium">
                                        Dengan melanjutkan, Anda menyetujui <a href="/syarat-ketentuan" className="text-primary hover:underline">Syarat & Ketentuan</a> kami.
                                    </p>
                                </div>
                            )}

                            {/* STEP: INSTRUCTIONS */}
                            {step === 'instructions' && paymentData && (
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-xl">
                                    {paymentData.payment_method === 'bank_transfer' && (
                                        <BankTransferInstructions data={paymentData} onExpire={() => setStep('expired')} />
                                    )}
                                    {paymentData.payment_method === 'qris' && (
                                        <QrisInstructions data={paymentData} onExpire={() => setStep('expired')} />
                                    )}
                                    {paymentData.payment_method === 'gopay' && (
                                        <GopayInstructions data={paymentData} onExpire={() => setStep('expired')} />
                                    )}

                                    <PaymentStatusPoller 
                                        transactionId={paymentData.transaction_id}
                                        onSuccess={() => setStep('success')}
                                        onExpire={() => setStep('expired')}
                                    />
                                </div>
                            )}

                            {/* STEP: SUCCESS */}
                            {step === 'success' && (
                                <div className="bg-white dark:bg-slate-900 p-12 rounded-[40px] border-2 border-emerald-100 dark:border-emerald-900/30 shadow-2xl text-center space-y-6">
                                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="material-symbols-outlined text-6xl text-emerald-500">check_circle</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white">Pembayaran Berhasil!</h2>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                                        Selamat! Paket <span className="text-primary font-black">{planName}</span> Anda telah aktif. Anda akan segera diarahkan ke halaman langganan.
                                    </p>
                                    <div className="pt-8">
                                        <button 
                                            onClick={() => router.visit('/langganan')}
                                            className="px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 transition-all"
                                        >
                                            Ke Halaman Langganan
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 animate-pulse">Mengarahkan dalam 3 detik...</p>
                                    {/* Auto redirect */}
                                    {setTimeout(() => router.visit('/langganan'), 3500) && null}
                                </div>
                            )}

                            {/* STEP: EXPIRED */}
                            {step === 'expired' && (
                                <div className="bg-white dark:bg-slate-900 p-12 rounded-[40px] border-2 border-red-100 dark:border-red-900/30 shadow-2xl text-center space-y-6">
                                    <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="material-symbols-outlined text-6xl text-red-500">error</span>
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white">Waktu Bayar Habis</h2>
                                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                                        Maaf, batas waktu pembayaran Anda telah berakhir. Silakan buat transaksi baru.
                                    </p>
                                    <div className="pt-8">
                                        <button 
                                            onClick={() => setStep('form')}
                                            className="px-8 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black rounded-2xl shadow-xl transition-all hover:scale-105"
                                        >
                                            Coba Lagi
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
