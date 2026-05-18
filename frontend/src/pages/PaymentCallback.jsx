import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyFunding } from '../services/api';

export default function PaymentCallback() {
    const [message, setMessage] = useState('Verifying your payment...');
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const reference = params.get('reference') || params.get('trxref');

        if (reference) {
            verifyFunding(reference)
                .then((response) => {
                    setSuccess(true);
                    setMessage(`Wallet funded successfully! ₦${response.data.amount} added.`);
                    setTimeout(() => navigate('/dashboard'), 3000);
                })
                .catch(() => {
                    setSuccess(false);
                    setMessage('Payment verification failed. Please contact support.');
                    setTimeout(() => navigate('/dashboard'), 3000);
                });
        } else {
            setMessage('No payment reference found.');
            setTimeout(() => navigate('/dashboard'), 3000);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
                {success === null && (
                    <div className="text-blue-600 text-xl animate-pulse">⏳ {message}</div>
                )}
                {success === true && (
                    <div>
                        <div className="text-6xl mb-4">✅</div>
                        <p className="text-green-600 text-xl font-semibold">{message}</p>
                        <p className="text-gray-500 mt-2 text-sm">Redirecting to dashboard...</p>
                    </div>
                )}
                {success === false && (
                    <div>
                        <div className="text-6xl mb-4">❌</div>
                        <p className="text-red-600 text-xl font-semibold">{message}</p>
                        <p className="text-gray-500 mt-2 text-sm">Redirecting to dashboard...</p>
                    </div>
                )}
            </div>
        </div>
    );
}