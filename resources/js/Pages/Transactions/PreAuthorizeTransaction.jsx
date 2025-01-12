import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function PreAuthorizeTransaction({ service }) {
    const [form, setForm] = useState({
        service_id: service.id,
        amount: service.price,
        name: '',
        number: '',
        expiry_month: '',
        expiry_year: '',
        cvv: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/transactions/preauthorize', form);
            if (response.data.success) {
                alert(`Transaction Created: ID ${response.data.transaction.id}`);
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            alert(`Exception: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Enter Card Details</h2>}
        >
            <Head title="Preauthorize Transaction" />
            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-semibold">Service: {service.name}</h3>
                        <p className="text-gray-600 mb-4">Amount: {service.price}</p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Cardholder Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    onChange={handleChange}
                                    className="mt-1 w-full border p-2"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Card Number</label>
                                <input
                                    type="text"
                                    name="number"
                                    onChange={handleChange}
                                    className="mt-1 w-full border p-2"
                                    required
                                />
                            </div>
                            <div className="flex gap-4 mb-4">
                                <div className="w-1/2">
                                    <label className="block text-gray-700">Expiry Month (MM)</label>
                                    <input
                                        type="text"
                                        name="expiry_month"
                                        onChange={handleChange}
                                        className="mt-1 w-full border p-2"
                                        required
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-gray-700">Expiry Year (YY)</label>
                                    <input
                                        type="text"
                                        name="expiry_year"
                                        onChange={handleChange}
                                        className="mt-1 w-full border p-2"
                                        min={25}
                                        max={35}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">CVV</label>
                                <input
                                    type="text"
                                    name="cvv"
                                    onChange={handleChange}
                                    className="mt-1 w-full border p-2"
                                    required
                                />
                            </div>
                            <button
                                disabled={loading}
                                className={`px-4 py-2 text-white rounded ${
                                    loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {loading ? 'Processing...' : 'Preauthorize'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
