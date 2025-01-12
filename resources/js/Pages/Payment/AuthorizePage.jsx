import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function AuthorizePage({ services }) {
    const [serviceId, setServiceId] = useState('');
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState(null);

    const handleAuthorize = async (e) => {
        e.preventDefault();
        if (!serviceId) {
            alert('Please select a service');
            return;
        }
        setLoading(true);

        try {
            const response = await window.axios.post('/payment/authorize', {
                service_id: serviceId,
            });
            setTransaction(response.data.transaction);
            alert('Authorized successfully!');
        } catch (error) {
            console.error(error);
            alert('Authorization failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Authorize Payment</h2>}
        >
            <Head title="Authorize Payment" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="p-6 bg-white shadow sm:rounded-lg">
                        <h3 className="mb-4 text-lg font-semibold text-gray-800">
                            Select a service to authorize
                        </h3>
                        <form onSubmit={handleAuthorize}>
                            <select
                                className="border rounded p-2"
                                value={serviceId}
                                onChange={(e) => setServiceId(e.target.value)}
                            >
                                <option value="">-- Select Service --</option>
                                {services.map((service) => (
                                    <option value={service.id} key={service.id}>
                                        {service.name} - ${service.price}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`ml-4 px-4 py-2 text-white rounded ${
                                    loading
                                        ? 'bg-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {loading ? 'Authorizing...' : 'Authorize'}
                            </button>
                        </form>

                        {transaction && (
                            <div className="mt-6">
                                <p className="font-bold">Transaction Details:</p>
                                <p>ID: {transaction.id}</p>
                                <p>Status: {transaction.status}</p>
                                <p>Authorization ID: {transaction.authorization_id}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
