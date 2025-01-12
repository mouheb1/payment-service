import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CapturePage({ transaction }) {
    const [finalAmount, setFinalAmount] = useState(transaction.amount || 0);
    const [loading, setLoading] = useState(false);

    const handleCapture = async (e) => {
        e.preventDefault();
        if (!finalAmount) {
            alert('Please enter a final amount.');
            return;
        }
        setLoading(true);

        try {
            const response = await window.axios.post(`/payment/${transaction.id}/capture`, {
                final_amount: finalAmount,
            });
            alert('Capture successful!');
            console.log(response.data);
        } catch (error) {
            console.error(error);
            alert('Capture failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Capture Payment</h2>}
        >
            <Head title="Capture Payment" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-6 bg-white shadow sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            Finalize Payment for Transaction #{transaction.id}
                        </h3>
                        <form onSubmit={handleCapture}>
                            <label className="block mb-2 text-gray-600">
                                Final Amount
                                <input
                                    type="number"
                                    step="0.01"
                                    className="block w-full mt-1 border rounded p-2"
                                    value={finalAmount}
                                    onChange={(e) => setFinalAmount(e.target.value)}
                                />
                            </label>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`mt-4 px-4 py-2 text-white rounded ${
                                    loading
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {loading ? 'Capturing...' : 'Capture'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
