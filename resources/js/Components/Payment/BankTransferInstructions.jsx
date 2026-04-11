import React, { useState } from 'react';
import PaymentCountdown from './PaymentCountdown';

export default function BankTransferInstructions({ data, onExpire }) {
    const [activeTab, setActiveTab] = useState('atm');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(data.va_number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const bankLogos = {
        bca: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg',
        bni: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Bank_BNI_Logo.png',
        bri: 'https://upload.wikimedia.org/wikipedia/commons/6/68/BANK_BRI_logo.svg',
        mandiri: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg',
    };

    // Instruction content based on bank and method
    const getInstructions = () => {
        const bank = data.payment_bank;
        if (bank === 'bca') {
            return {
                atm: [
                    'Masukkan Kartu ATM & PIN',
                    'Pilih Menu Transaksi Lainnya',
                    'Pilih Menu Transfer',
                    'Pilih Ke Rekening BCA Virtual Account',
                    `Masukkan Nomor Virtual Account: ${data.va_number}`,
                    'Masukkan jumlah pembayaran yang sesuai',
                    'Ikuti instruksi untuk menyelesaikan transaksi'
                ],
                mobile: [
                    'Login ke m-BCA',
                    'Pilih m-Transfer',
                    'Pilih BCA Virtual Account',
                    `Masukkan Nomor Virtual Account: ${data.va_number}`,
                    'Masukkan PIN m-BCA',
                    'Ikuti instruksi untuk menyelesaikan transaksi'
                ],
                internet: [
                    'Login ke KlikBCA',
                    'Pilih Transfer Dana',
                    'Pilih Transfer ke BCA Virtual Account',
                    `Masukkan Nomor Virtual Account: ${data.va_number}`,
                    'Masukkan jumlah yang harus dibayar',
                    'Ikuti instruksi untuk menyelesaikan transaksi'
                ]
            };
        }
        if (bank === 'mandiri') {
            return {
                atm: [
                    'Masukkan Kartu ATM & PIN',
                    'Pilih menu Bayar/Beli',
                    'Pilih Multi Payment',
                    `Masukkan Kode Perusahaan: ${data.qr_code_url}`, // biller_code stored in qr_code_url for mandiri
                    `Masukkan Nomor Virtual Account (Kode Bayar): ${data.va_number}`,
                    'Pilih item pembayaran yang sesuai',
                    'Konfirmasi dan selesaikan pembayaran'
                ],
                mobile: [
                    'Login ke aplikasi Livin\' by Mandiri',
                    'Pilih menu Bayar',
                    'Cari penyedia jasa (Livin\' / KalaStudio)',
                    `Masukkan Nomor Virtual Account: ${data.va_number}`,
                    'Masukkan PIN mandiri',
                    'Konfirmasi dan selesaikan pembayaran'
                ],
                internet: [
                    'Login ke Mandiri Online',
                    'Pilih menu Bayar',
                    'Pilih Multi Payment',
                    `Masukkan Nomor Virtual Account: ${data.va_number}`,
                    'Konfirmasi dan selesaikan pembayaran'
                ]
            };
        }
        // Fallback or other banks (general instructions)
        return {
            atm: [
                'Masukkan Kartu ATM & PIN',
                'Pilih menu Transfer',
                'Pilih Virtual Account',
                `Masukkan Nomor Virtual Account: ${data.va_number}`,
                'Konfirmasi data dan selesaikan bayar'
            ],
            mobile: [
                'Login ke App Mobile Banking',
                'Pilih menu Transfer / Pembayaran',
                'Pilih Virtual Account',
                `Masukkan Nomor Virtual Account: ${data.va_number}`,
                'Masukkan PIN dan selesaikan bayar'
            ],
            internet: [
                'Login ke Internet Banking',
                'Pilih menu Transfer Virtual Account',
                `Masukkan Nomor Virtual Account: ${data.va_number}`,
                'Selesaikan instruksi pembayaran'
            ]
        };
    };

    const instructions = getInstructions();

    return (
        <div className="space-y-6">
            <div className="text-center">
                <img src={bankLogos[data.payment_bank]} alt={data.payment_bank} className="h-12 mx-auto mb-4 object-contain" />
                <h3 className="text-xl font-black dark:text-white uppercase">{data.payment_bank} Virtual Account</h3>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 space-y-4">
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Nomor Virtual Account</p>
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-2xl font-mono font-black text-primary tracking-wider">{data.va_number}</span>
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-1 text-primary font-bold text-xs bg-primary/10 px-3 py-2 rounded-xl hover:bg-primary/20 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
                            {copied ? 'Tersalin' : 'Salin'}
                        </button>
                    </div>
                </div>

                {data.payment_bank === 'mandiri' && (
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Kode Perusahaan</p>
                        <p className="text-lg font-black dark:text-white tracking-widest">{data.qr_code_url}</p>
                    </div>
                )}
            </div>

            <PaymentCountdown expiredAt={data.payment_expired_at} onExpire={onExpire} />

            <div className="space-y-4">
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('atm')}
                        className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${activeTab === 'atm' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}
                    >
                        ATM
                    </button>
                    <button
                        onClick={() => setActiveTab('mobile')}
                        className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${activeTab === 'mobile' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}
                    >
                        MOBILE
                    </button>
                    <button
                        onClick={() => setActiveTab('internet')}
                        className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${activeTab === 'internet' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500'}`}
                    >
                        INTERNET
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800">
                    <ul className="space-y-4">
                        {instructions[activeTab].map((step, index) => (
                            <li key={index} className="flex gap-4 items-start">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                    {index + 1}
                                </span>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                    {step}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
