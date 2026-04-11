import React, { useEffect, useState } from 'react';
import PaymentCountdown from './PaymentCountdown';

export default function GopayInstructions({ data, onExpire }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));
    }, []);

    return (
        <div className="space-y-6">
            <div className="text-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg" alt="GoPay" className="h-12 mx-auto mb-4 object-contain" />
                <h3 className="text-xl font-black dark:text-white uppercase tracking-wider">Bayar dengan GoPay</h3>
            </div>

            {isMobile ? (
                <div className="space-y-6">
                    <a 
                        href={data.va_number} // Deeplink stored in va_number
                        className="w-full py-5 bg-[#00AED6] hover:bg-[#0096B8] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span className="material-symbols-outlined">open_in_new</span>
                        BUKA APLIKASI GOPAY
                    </a>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-slate-900 px-4 text-slate-500 font-bold tracking-widest">Atau scan QR</span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-3xl border-4 border-slate-100 shadow-inner flex items-center justify-center mx-auto max-w-[200px]">
                        <img src={data.qr_code_url} alt="QR Code" className="w-full h-auto rounded-xl" />
                    </div>
                </div>
            ) : (
                <div className="space-y-6 text-center">
                    <div className="bg-white p-4 rounded-3xl border-4 border-slate-100 shadow-inner flex items-center justify-center mx-auto max-w-[280px]">
                        <img src={data.qr_code_url} alt="QR Code" className="w-full h-auto rounded-xl" />
                    </div>
                    <p className="text-sm font-bold text-slate-500">Scan kode QR di atas dengan aplikasi Gojek Anda</p>
                </div>
            )}

            <PaymentCountdown expiredAt={data.payment_expired_at} onExpire={onExpire} />

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800">
                <h4 className="font-black dark:text-white text-sm mb-3">Cara Membayar:</h4>
                <ol className="space-y-3 text-xs font-medium text-slate-600 dark:text-slate-400">
                    {isMobile ? (
                        <>
                            <li className="flex gap-2"><span>1.</span><span>Klik tombol <strong>"Buka Aplikasi GoPay"</strong> di atas</span></li>
                            <li className="flex gap-2"><span>2.</span><span>Anda akan diarahkan ke aplikasi Gojek / GoPay</span></li>
                            <li className="flex gap-2"><span>3.</span><span>Konfirmasi jumlah pembayaran dan klik <strong>"Bayar"</strong></span></li>
                        </>
                    ) : (
                        <>
                            <li className="flex gap-2"><span>1.</span><span>Buka aplikasi Gojek di smartphone Anda</span></li>
                            <li className="flex gap-2"><span>2.</span><span>Klik menu <strong>"Bayar"</strong></span></li>
                            <li className="flex gap-2"><span>3.</span><span>Arahkan kamera ke kode QR di layar desktop ini</span></li>
                            <li className="flex gap-2"><span>4.</span><span>Konfirmasi jumlah pembayaran dan klik <strong>"Bayar"</strong></span></li>
                        </>
                    )}
                </ol>
            </div>
        </div>
    );
}
