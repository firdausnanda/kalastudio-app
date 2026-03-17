'use client';

import { useState, useEffect } from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';


export default function Checkout({ planName, billingCycle, package: pkg }) {
    const { auth } = usePage().props;
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState(auth?.user?.email || '');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState({});

    // Pricing logic derived from database package data
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

    const handlePayment = async () => {
        if (isCustom) {
            window.location.href = 'mailto:sales@kalastudio.com';
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            // Total amount to be charged
            let totalAmount = currentPrice;
            if (billingCycle === 'annual') totalAmount = currentPrice * 12;


            const response = await axios.post('/payment/create-invoice', {
                plan_name: planName,
                billing_cycle: billingCycle,
                amount: totalAmount,
                email: email,
                name: name,
                password: password,
                password_confirmation: passwordConfirmation,
            });


            if (response.data.invoice_url) {
                window.location.href = response.data.invoice_url;
            } else {
                alert('Terjadi kesalahan saat membuat invoice.');
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
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                            Selesaikan <span className="text-primary">Pembayaran</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            {auth.user ? 'Detail pesanan Anda sudah siap.' : 'Daftar dan aktifkan akun premium Anda.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-12 gap-8 items-start">
                        {/* Order Summary */}
                        <div className="md:col-span-12 lg:col-span-5 bg-white dark:bg-slate-900 p-8 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-xl">
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
                                        {formatPrice(billingCycle === 'annual' ? currentPrice * 12 : currentPrice)}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex items-start gap-3 mb-6">
                                <span className="material-symbols-outlined text-blue-500">info</span>
                                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                                    Pembayaran akan diproses secara aman melalui Xendit. Anda akan diarahkan ke halaman invoice resmi.
                                </p>
                            </div>
                        </div>

                        {/* Customer Info & Action */}
                        <div className="md:col-span-12 lg:col-span-7 bg-white dark:bg-slate-900 p-8 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-xl">
                            <h2 className="text-xl font-black mb-6 dark:text-white">Informasi Pelanggan</h2>
                            <div className="space-y-6">
                                {!auth.user && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                Nama Lengkap
                                            </label>
                                            <input 
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none transition-all font-medium ${errors.name ? 'border-red-500' : 'border-slate-100 dark:border-slate-800 focus:border-primary'}`}
                                                placeholder="Nama Anda"
                                                required
                                            />
                                            {errors.name && <p className="text-red-500 text-xs mt-1 font-bold">{errors.name[0]}</p>}
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                        Email Konfirmasi
                                    </label>
                                    <input 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none transition-all font-medium ${errors.email ? 'border-red-500' : 'border-slate-100 dark:border-slate-800 focus:border-primary'}`}
                                        placeholder="nama@email.com"
                                        required
                                        disabled={!!auth.user}
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email[0]}</p>}
                                </div>

                                {!auth.user && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                Kata Sandi
                                            </label>
                                            <input 
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={`w-full px-4 py-3 rounded-xl border-2 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none transition-all font-medium ${errors.password ? 'border-red-500' : 'border-slate-100 dark:border-slate-800 focus:border-primary'}`}
                                                placeholder="••••••••"
                                                required
                                            />
                                            {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password[0]}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                                Konfirmasi Kata Sandi
                                            </label>
                                            <input 
                                                type="password"
                                                value={passwordConfirmation}
                                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 dark:text-white focus:border-primary outline-none transition-all font-medium"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                    </>
                                )}

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
                                        <>
                                            <div className="w-6 h-6 border-4 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            {isCustom ? 'Hubungi Sales' : auth.user ? 'Bayar Sekarang' : 'Daftar & Bayar'}
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </>
                                    )}
                                </button>

                                {!auth.user && (
                                    <>
                                        <div className="relative my-4">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                                            </div>
                                            <div className="relative flex justify-center text-xs uppercase">
                                                <span className="bg-white dark:bg-slate-900 px-4 text-slate-500 font-bold tracking-widest">Atau</span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                const currentUrl = encodeURIComponent(window.location.href);
                                                window.location.href = `/auth/google?redirect=${currentUrl}`;
                                            }}
                                            className="w-full border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:scale-[0.98]"
                                        >
                                            <img
                                                alt="Google Logo"
                                                className="w-5 h-5"
                                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                            />
                                            Daftar dengan Google
                                        </button>
                                    </>
                                )}



                                <p className="text-center text-xs text-slate-400 font-medium">
                                    Dengan melanjutkan, Anda menyetujui <a href="/syarat-ketentuan" className="text-primary hover:underline">Syarat & Ketentuan</a> kami.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
