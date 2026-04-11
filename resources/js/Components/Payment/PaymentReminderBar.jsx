import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function PaymentReminderBar() {
    const { props } = usePage();
    const pendingTransaction = props.pendingTransaction;

    if (!pendingTransaction) return null;

    // Handle both camelCase and snake_case from Eloquent serialization
    const packagePriceData = pendingTransaction.packagePrice || pendingTransaction.package_price;
    const packageName = packagePriceData?.package?.name || 'Paket';
    const billingCycle = packagePriceData?.billing_cycle || 'monthly';

    // Map billing cycle to query param
    const billingParam = billingCycle === 'annually' || billingCycle === 'annual' ? 'annual' : billingCycle;

    // Safely generate checkout URL
    let checkoutUrl = '#';
    try {
        checkoutUrl = route('payment.pending', {
            transaction: pendingTransaction.id
        });
    } catch (e) {
        checkoutUrl = `/payment/pending/${pendingTransaction.id}`;
    }

    const calculateTimeLeft = (expiredAt) => {
        if (!expiredAt) return null;
        const difference = +new Date(expiredAt) - +new Date();

        if (difference <= 0) {
            return 'EXPIRED';
        }

        const hours = Math.floor((difference / (1000 * 60 * 60)));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(pendingTransaction.payment_expired_at));

    useEffect(() => {
        const timer = setInterval(() => {
            const result = calculateTimeLeft(pendingTransaction.payment_expired_at);
            setTimeLeft(result);
            if (result === 'EXPIRED') clearInterval(timer);
        }, 1000);

        return () => clearInterval(timer);
    }, [pendingTransaction.payment_expired_at]);

    if (timeLeft === 'EXPIRED') return null;

    return (
        <div className="relative group overflow-hidden border-b border-primary/10 dark:border-white/5 shadow-sm">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-indigo-50/95 dark:bg-slate-900/95 backdrop-blur-xl z-[-1]"></div>

            {/* Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-30 dark:opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                                <span className="material-symbols-outlined text-primary text-xl animate-pulse">
                                    priority_high
                                </span>
                            </div>
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-white dark:border-slate-900 animate-ping"></div>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-0.5 leading-none">Pemberitahuan</span>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-200">
                                Selesaikan aktivasi paket <span className="text-primary">{packageName}</span> Anda.
                            </p>
                        </div>
                    </div>

                    {timeLeft && (
                        <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-800/50 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner">
                            <span className="material-symbols-outlined text-[14px] text-primary">timer</span>
                            <div className="flex flex-col leading-none">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Berakhir dalam</span>
                                <span className="text-xs font-black font-mono text-primary tracking-wider">
                                    {timeLeft}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <Link
                    href={checkoutUrl}
                    className="group/btn relative flex-shrink-0 flex items-center gap-2.5 bg-primary hover:bg-primary/90 text-white px-7 py-3 rounded-2xl text-[11px] font-black transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/40 active:scale-95"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        BAYAR SEKARANG
                        <span className="material-symbols-outlined text-[16px] group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                    </span>
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/10 to-transparent pointer-events-none rounded-b-2xl"></div>
                </Link>
            </div>

            {/* Background decorative glow */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        </div>
    );
}
