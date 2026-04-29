import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Invoice({ transaction }) {
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const packagePrice = transaction.package_price || transaction.packagePrice;
    const packageName = packagePrice?.package?.name || 'Booster/Topup';
    const billingCycle = packagePrice?.billing_cycle || 'One Time';
    const subtotal = transaction.subtotal || transaction.grand_total;
    const grandTotal = transaction.grand_total;
    const discount = transaction.discount_amount || 0;

    const formattedDate = new Date(transaction.created_at).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display transition-colors duration-300 print:bg-white print:p-0">
            <style>
                {`
                @media print {
                    @page {
                        margin: 10px;
                        size: auto;
                    }
                    body {
                        background-color: white !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .dark {
                        color-scheme: light !important;
                    }
                    /* Force light mode text colors on print */
                    .dark p, .dark h1, .dark h2, .dark h3, .dark span, .dark th, .dark td {
                        color: #0f172a !important; /* slate-900 */
                    }
                    .dark .text-slate-400, .dark .text-slate-500 {
                        color: #64748b !important; /* slate-500 */
                    }
                    .dark .text-primary {
                        color: #0d6efd !important; /* Force a blue color if var(--primary) is not found */
                    }
                    .bg-white {
                        background-color: white !important;
                    }
                    .bg-slate-50 {
                        background-color: #f8fafc !important;
                    }
                    .border {
                        border-width: 1px !important;
                        border-color: #f1f5f9 !important; /* slate-100 */
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .shadow-2xl {
                        box-shadow: none !important;
                    }
                }
                `}
            </style>
            <Head title={`Invoice #${transaction.reference_id || transaction.id}`} />

            {/* Top Bar - Hidden on print */}
            <div className="max-w-4xl mx-auto pt-8 px-4 flex justify-between items-center print:hidden">
                <Link
                    href={route('langganan.index')}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Kembali
                </Link>
                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-lg">print</span>
                        Cetak Invoice
                    </button>
                </div>
            </div>

            {/* Invoice Card */}
            <div className="max-w-4xl mx-auto my-6 md:my-12 px-4 print:my-0 print:px-0 transition-all">
                <div className="bg-white dark:bg-slate-900 rounded-[32px] md:rounded-[40px] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 p-6 md:p-16 relative overflow-hidden print:rounded-none print:shadow-none print:border-none print:p-0">

                    {/* Visual Decor - Hidden on print */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-[200px] z-0 print:hidden"></div>

                    <div className="relative z-10 flex flex-col gap-12 md:gap-16">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-16">
                            <div className="space-y-6 w-full md:w-auto">
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <img
                                        src="/img/logo.png"
                                        alt="KalaStudio Logo"
                                        className="h-10 md:h-12 w-auto object-contain"
                                    />
                                </div>
                                <div className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest flex flex-col gap-1 text-center md:text-left">
                                    <span>Kala Studio HQ</span>
                                    <span>Trenggalek, Indonesia</span>
                                    <span>team@kalastudioai.com</span>
                                </div>
                            </div>

                            <div className="text-center md:text-right space-y-2 w-full md:w-auto border-t md:border-t-0 pt-8 md:pt-0 border-slate-100 dark:border-slate-800">
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Invoice</h1>
                                <div className="flex flex-col md:items-end gap-1">
                                    <span className="text-primary font-black text-sm">#{transaction.reference_id || transaction.id}</span>
                                    <span className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest">Diterbitkan: {formattedDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 border-t border-b border-slate-100 dark:border-slate-800 py-10 md:py-12">
                            <div className="text-center md:text-left">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Ditagih Kepada</h3>
                                <div className="space-y-1">
                                    <p className="text-lg md:text-xl font-black text-slate-900 dark:text-white">{transaction.user?.name}</p>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{transaction.user?.email}</p>
                                </div>
                            </div>
                            <div className="text-center md:text-right">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Metode Pembayaran</h3>
                                <div className="space-y-1">
                                    <p className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight italic">
                                        {transaction.payment_method?.replace('_', ' ') || 'Midtrans'}
                                    </p>
                                    <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-sm font-medium uppercase tracking-widest">
                                        {transaction.payment_bank || transaction.va_number || 'Lunas'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="space-y-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b-2 border-slate-900 dark:border-white">
                                            <th className="py-4 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400">Deskripsi Paket</th>
                                            <th className="py-4 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-center">Durasi</th>
                                            <th className="py-4 font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 text-right">Harga</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        <tr>
                                            <td className="py-6 md:py-8">
                                                <div className="space-y-1">
                                                    <p className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Paket {packageName}</p>
                                                    <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs font-medium">Akses penuh ke fitur premium dan optimasi AI.</p>
                                                </div>
                                            </td>
                                            <td className="py-8 text-center">
                                                <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                                                    {billingCycle === 'annually' ? '1 Tahun' : (billingCycle === 'monthly' ? '1 Bulan' : 'Sekali Bayar')}
                                                </span>
                                            </td>
                                            <td className="py-8 text-right font-black text-lg text-slate-900 dark:text-white">
                                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(subtotal)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Calculation Section */}
                            <div className="flex justify-end pt-8">
                                <div className="w-full md:w-80 space-y-4">
                                    <div className="flex justify-between items-center text-xs md:text-sm font-bold text-slate-500">
                                        <span className="uppercase tracking-widest text-[9px] md:text-[10px]">Subtotal</span>
                                        <span>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(subtotal)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between items-center text-xs md:text-sm font-bold text-green-500">
                                            <span className="uppercase tracking-widest text-[9px] md:text-[10px]">Diskon</span>
                                            <span>-{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(discount)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-xs md:text-sm font-bold text-slate-500">
                                        <span className="uppercase tracking-widest text-[9px] md:text-[10px]">Pajak (0%)</span>
                                        <span>Rp0</span>
                                    </div>
                                    <div className="pt-4 border-t-2 border-slate-900 dark:border-white flex justify-between items-center">
                                        <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-900 dark:text-white shrink-0">Total</span>
                                        <span className="text-2xl md:text-3xl font-black text-primary">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(grandTotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div className="pt-16 border-t border-slate-100 dark:border-slate-800 text-center space-y-4">
                            <p className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest">Terima kasih atas kepercayaan Anda!</p>
                            <p className="text-slate-400 text-xs font-medium max-w-lg mx-auto leading-relaxed">
                                Jika Anda memiliki pertanyaan mengenai invoice ini, silakan hubungi tim support kami melalui
                                <span className="text-primary font-bold ml-1">team@kalastudioai.com</span>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer for Digital Receipt */}
            <div className="max-w-4xl mx-auto pb-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest print:hidden">
                Ini adalah invoice resmi yang dihasilkan secara otomatis oleh sistem Kala Studio.
            </div>
        </div>
    );
}
