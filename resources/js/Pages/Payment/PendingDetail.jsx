import { useState } from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';
import { Head, router } from '@inertiajs/react';

// Payment Components
import BankTransferInstructions from '@/Components/Payment/BankTransferInstructions';
import QrisInstructions from '@/Components/Payment/QrisInstructions';
import GopayInstructions from '@/Components/Payment/GopayInstructions';
import PaymentStatusPoller from '@/Components/Payment/PaymentStatusPoller';

export default function PendingDetail({ transaction }) {
    const initialStep = (transaction.status === 'SETTLED' || transaction.status === 'PAID') 
        ? 'success' 
        : (transaction.status === 'EXPIRED' || transaction.status === 'CANCELLED')
            ? 'expired'
            : 'instructions';

    const [step, setStep] = useState(initialStep); // instructions, success, expired
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    
    const handleCancelOrder = () => {
        setIsCancelling(true);
        router.post(
            route('payment.cancel', { transaction: transaction.id }),
            {},
            { onFinish: () => setIsCancelling(false) }
        );
    };

    
    // Handle both camelCase and snake_case from Eloquent serialization
    const packagePriceData = transaction.packagePrice || transaction.package_price;
    const packageName = packagePriceData?.package?.name || 'Paket';
    const amount = transaction.grand_total;
    
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            maximumFractionDigits: 0 
        }).format(price);
    };

    return (
        <div className="bg-white text-slate-900 font-display transition-colors duration-300 dark:bg-slate-900 min-h-screen flex flex-col">
            <Head title={`Banyar - ${packageName}`} />
            <Header />

            <main className="flex-grow py-20 bg-slate-50 dark:bg-slate-800/30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Steps */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
                            {step === 'instructions' && <><span className="text-primary">Instruksi</span> Pembayaran</>}
                            {step === 'success' && <>Pembayaran <span className="text-emerald-500">Berhasil!</span></>}
                            {step === 'expired' && <>Waktu Pembayaran <span className="text-red-500">Habis</span></>}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400">
                            {step === 'instructions' && 'Segera selesaikan pembayaran sebelum batas waktu berakhir.'}
                            {step === 'success' && 'Terima kasih! Akun Anda sedang diaktifkan.'}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-12 gap-8 items-start">
                        
                        {/* LEFT COLUMN: Order Summary */}
                        {step !== 'success' && (
                            <div className="md:col-span-12 lg:col-span-5 space-y-6">
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-xl">
                                    <h2 className="text-xl font-black mb-6 dark:text-white">Ringkasan Pesanan</h2>
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Paket</span>
                                            <span className="font-black text-slate-900 dark:text-white">{packageName}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 font-medium">Siklus Tagihan</span>
                                            <span className="font-black text-slate-900 dark:text-white capitalize">
                                                {packagePriceData?.billing_cycle === 'annually' ? 'Tahunan' : 'Bulanan'}
                                            </span>
                                        </div>

                                        <hr className="border-slate-100 dark:border-slate-800" />
                                        <div className="flex justify-between items-center font-black text-lg">
                                            <span className="text-slate-900 dark:text-white">Total Harga</span>
                                            <span className="text-primary">
                                                {formatPrice(amount)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex items-start gap-3">
                                        <span className="material-symbols-outlined text-blue-500">info</span>
                                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-medium">
                                            Anda melihat instruksi untuk transaksi yang belum diselesaikan.
                                        </p>
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => router.visit('/dashboard')}
                                    className="w-full py-4 px-6 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined">arrow_back</span>
                                    Kembali ke Dashboard
                                </button>
                                
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="w-full py-4 px-6 border-2 border-red-100 dark:border-red-900/30 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">cancel</span>
                                    Batalkan Pesanan
                                </button>

                            </div>
                        )}

                        {/* RIGHT COLUMN: Action Column */}
                        <div className={`${step === 'success' ? 'md:col-span-12 max-w-2xl mx-auto' : 'md:col-span-12 lg:col-span-7'}`}>
                            
                            {/* STEP: INSTRUCTIONS */}
                            {step === 'instructions' && (
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border-2 border-slate-100 dark:border-slate-800 shadow-xl">
                                    {transaction.payment_method === 'bank_transfer' && (
                                        <BankTransferInstructions data={transaction} onExpire={() => setStep('expired')} />
                                    )}
                                    {transaction.payment_method === 'qris' && (
                                        <QrisInstructions data={transaction} onExpire={() => setStep('expired')} />
                                    )}
                                    {transaction.payment_method === 'gopay' && (
                                        <GopayInstructions data={transaction} onExpire={() => setStep('expired')} />
                                    )}

                                    <PaymentStatusPoller 
                                        transactionId={transaction.id}
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
                                        Selamat! Paket <span className="text-primary font-black">{packageName}</span> Anda telah aktif.
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
                                            onClick={() => router.visit('/harga')}
                                            className="px-8 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black rounded-2xl shadow-xl transition-all hover:scale-105"
                                        >
                                            Pilih Paket Lagi
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Cancel Confirmation Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowCancelModal(false)}
                        />

                        {/* Modal Card */}
                        <div className="relative z-10 bg-white dark:bg-slate-900 rounded-[32px] border-2 border-red-100 dark:border-red-900/30 shadow-2xl p-10 max-w-md w-full text-center space-y-6 animate-slide-up">

                            {/* Icon */}
                            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                                <span className="material-symbols-outlined text-5xl text-red-500">cancel</span>
                            </div>

                            {/* Text */}
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                                    Batalkan Pesanan?
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                    Transaksi paket <span className="font-bold text-slate-700 dark:text-slate-200">{packageName}</span> akan dibatalkan secara permanen.
                                    Virtual Account / QRIS Anda akan langsung dinonaktifkan.
                                </p>
                            </div>

                            {/* Warning Box */}
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-4 text-left flex items-start gap-3">
                                <span className="material-symbols-outlined text-red-500 text-sm mt-0.5">warning</span>
                                <p className="text-xs text-red-700 dark:text-red-300 font-medium leading-relaxed">
                                    Tindakan ini tidak dapat diurungkan. Anda perlu membuat transaksi baru jika ingin berlangganan.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 py-3.5 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                >
                                    Tidak, Kembali
                                </button>
                                <button
                                    onClick={handleCancelOrder}
                                    disabled={isCancelling}
                                    className="flex-1 py-3.5 bg-gradient-to-br from-red-500 to-red-600 text-white font-black rounded-2xl shadow-lg shadow-red-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isCancelling
                                        ? <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> Membatalkan...</>
                                        : <><span className="material-symbols-outlined text-sm">cancel</span> Ya, Batalkan</>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>


            <Footer />
        </div>
    );
}
