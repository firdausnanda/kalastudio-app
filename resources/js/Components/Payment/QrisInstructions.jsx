import React from 'react';
import PaymentCountdown from './PaymentCountdown';

export default function QrisInstructions({ data, onExpire }) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg" alt="QRIS" className="h-10 mx-auto mb-4 object-contain" />
                <h3 className="text-xl font-black dark:text-white uppercase tracking-wider">Bayar dengan QRIS</h3>
                <p className="text-sm font-medium text-slate-500 mt-2">Scan kode QR di bawah menggunakan aplikasi pembayaran favorit Anda</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border-4 border-slate-100 shadow-inner flex items-center justify-center mx-auto max-w-[280px]">
                {data.qr_code_url ? (
                    <img src={data.qr_code_url} alt="QR Code" className="w-full h-auto rounded-xl" />
                ) : (
                    <div className="w-64 h-64 bg-slate-100 animate-pulse rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-300 text-5xl">qr_code_2</span>
                    </div>
                )}
            </div>

            <PaymentCountdown expiredAt={data.payment_expired_at} onExpire={onExpire} />

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border-2 border-blue-100 dark:border-blue-800/50">
                <h4 className="font-black text-blue-900 dark:text-blue-300 text-sm mb-3">Cara Membayar:</h4>
                <ol className="space-y-3 text-xs font-medium text-blue-700 dark:text-blue-400">
                    <li className="flex gap-2"><span>1.</span><span>Buka aplikasi pembayaran (GoPay, OVO, ShopeePay, m-Banking, dll)</span></li>
                    <li className="flex gap-2"><span>2.</span><span>Pilih fitur <strong>"Scan"</strong> atau <strong>"Bayar"</strong></span></li>
                    <li className="flex gap-2"><span>3.</span><span>Arahkan kamera ke kode QR di atas</span></li>
                    <li className="flex gap-2"><span>4.</span><span>Konfirmasi jumlah pembayaran dan selesaikan transaksi</span></li>
                </ol>
            </div>
        </div>
    );
}
