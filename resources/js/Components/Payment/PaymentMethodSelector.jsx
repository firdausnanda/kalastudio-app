import React from 'react';

const banks = [
    { id: 'bni', name: 'BNI', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Bank_BNI_Logo.png' },
    { id: 'bsi', name: 'BSI', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Bank_Syariah_Indonesia.svg' },
    { id: 'bri', name: 'BRI', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/68/BANK_BRI_logo.svg' },
    { id: 'mandiri', name: 'Mandiri', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg' },
];

export default function PaymentMethodSelector({ selectedMethod, selectedBank, onMethodChange, onBankChange }) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-black text-slate-800 dark:text-white">Pilih Metode Pembayaran</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bank Transfer Option */}
                <button
                    type="button"
                    onClick={() => onMethodChange('bank_transfer')}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${selectedMethod === 'bank_transfer'
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                        }`}
                >
                    <span className="material-symbols-outlined text-3xl text-primary">account_balance</span>
                    <span className="font-bold text-sm dark:text-white">Transfer Bank</span>
                </button>

                {/* QRIS Option */}
                <button
                    type="button"
                    onClick={() => onMethodChange('qris')}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${selectedMethod === 'qris'
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                        }`}
                >
                    <span className="material-symbols-outlined text-3xl text-primary">qr_code_2</span>
                    <span className="font-bold text-sm dark:text-white">QRIS</span>
                </button>

                {/* GoPay Option */}
                <button
                    type="button"
                    onClick={() => onMethodChange('gopay')}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${selectedMethod === 'gopay'
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                        }`}
                >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg" alt="GoPay" className="h-8 object-contain" />
                    <span className="font-bold text-sm dark:text-white">GoPay</span>
                </button>
            </div>

            {/* Bank Selection (Only if Bank Transfer is selected) */}
            {selectedMethod === 'bank_transfer' && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-bold text-slate-500 mb-4">Pilih Bank:</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {banks.map((bank) => (
                            <button
                                key={bank.id}
                                type="button"
                                onClick={() => onBankChange(bank.id)}
                                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selectedBank === bank.id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                                    }`}
                            >
                                <img src={bank.logo} alt={bank.name} className="h-6 object-contain" />
                                <span className="text-[10px] font-black dark:text-slate-300 uppercase">{bank.name} VA</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
