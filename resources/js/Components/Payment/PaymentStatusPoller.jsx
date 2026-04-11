import React, { useEffect } from 'react';
import axios from 'axios';

export default function PaymentStatusPoller({ transactionId, interval = 5000, onSuccess, onExpire }) {
    useEffect(() => {
        if (!transactionId) return;

        const checkStatus = async () => {
            try {
                const response = await axios.get(`/payment/status/${transactionId}`);
                
                if (response.data.status === 'PAID') {
                    if (onSuccess) onSuccess();
                } else if (response.data.status === 'EXPIRED' || response.data.expired) {
                    if (onExpire) onExpire();
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        };

        const timer = setInterval(checkStatus, interval);

        // Initial check
        checkStatus();

        return () => clearInterval(timer);
    }, [transactionId, interval, onSuccess, onExpire]);

    return null; // Invisible component
}
