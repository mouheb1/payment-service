import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function LandingPage() {
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
                            <form className="max-w-md mx-auto">
                                <div className="mb-4">
                                    <label
                                        htmlFor="cardNumber"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="1234 5678 9012 3456"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="cardHolder"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Card Holder Name
                                    </label>
                                    <input
                                        type="text"
                                        id="cardHolder"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="flex gap-4 mb-4">
                                    <div className="w-1/2">
                                        <label
                                            htmlFor="expiryDate"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            id="expiryDate"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="MM/YY"
                                        />
                                    </div>
                                    <div className="w-1/2">
                                        <label
                                            htmlFor="cvv"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            id="cvv"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="123"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                                >
                                    Pay Now
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
