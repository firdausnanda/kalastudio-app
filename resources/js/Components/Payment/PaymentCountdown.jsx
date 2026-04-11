import React, { useState, useEffect } from 'react';

export default function PaymentCountdown({ expiredAt, onExpire }) {
    const [timeLeft, setTimeLeft] = useState('');
    const [status, setStatus] = useState('normal'); // normal, warning, danger

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +new Date(expiredAt) - +new Date();
            
            if (difference <= 0) {
                if (onExpire) onExpire();
                return 'EXPIRED';
            }

            const hours = Math.floor((difference / (1000 * 60 * 60)));
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            // Set status based on remaining time (minutes)
            const totalMinutes = difference / (1000 * 60);
            if (totalMinutes < 1) setStatus('danger');
            else if (totalMinutes < 5) setStatus('warning');
            else setStatus('normal');

            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        const timer = setInterval(() => {
            const result = calculateTimeLeft();
            setTimeLeft(result);
            if (result === 'EXPIRED') clearInterval(timer);
        }, 1000);

        // Initial call
        setTimeLeft(calculateTimeLeft());

        return () => clearInterval(timer);
    }, [expiredAt, onExpire]);

    const getStatusColor = () => {
        if (status === 'danger') return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800';
        if (status === 'warning') return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800';
        return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800';
    };

    return (
        <div className={`mt-4 p-4 rounded-2xl border-2 flex items-center justify-between ${getStatusColor()}`}>
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl">schedule</span>
                <span className="text-sm font-bold">Batas Waktu Pembayaran</span>
            </div>
            <div className="text-xl font-black font-mono">
                {timeLeft}
            </div>
        </div>
    );
}
