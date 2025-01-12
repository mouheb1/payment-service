import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import axios from 'axios';

export default function LandingPage() {
    const [loading, setLoading] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState(null);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/payment/process');
            setPaymentUrl(response.data.url);
        } catch (error) {
            console.error(error);
            alert('Payment failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Payment
                </h2>
            }
        >
            <Head title="Payment" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h1 className="text-lg font-semibold text-gray-800 mb-4">
                                Make a Payment
                            </h1>
                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                className={`mt-4 w-full rounded px-4 py-2 text-white ${
                                    loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {loading ? 'Processing...' : 'Pay Now'}
                            </button>
                            {paymentUrl && (
                                <div className="mt-6">
                                    <p className="text-sm text-gray-600">
                                        Click the link below to complete your payment:
                                    </p>
                                    <a
                                        href={paymentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-block text-blue-600 underline hover:text-blue-800"
                                    >
                                        Complete Payment
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
