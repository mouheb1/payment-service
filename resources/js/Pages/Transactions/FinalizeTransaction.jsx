import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function FinalizeTransaction({ transactionId }) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCapture = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`/transactions/${transactionId}/capture`, {
                amount: amount,
            });
            if (response.data.success) {
                alert('Transaction captured successfully');
            } else {
                alert('Error capturing: ' + response.data.message);
            }
        } catch (error) {
            alert('Capture error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Finalize Transaction</h2>}
        >
            <Head title="Finalize Transaction" />
            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 rounded shadow">
                        <p className="mb-4 text-gray-700">Transaction ID: {transactionId}</p>
                        <form onSubmit={handleCapture}>
                            <label className="block text-gray-700 mb-2">Final Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="border p-2 w-full mb-4"
                                required
                            />
                            <button
                                disabled={loading}
                                className={`px-4 py-2 rounded text-white ${
                                    loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
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
