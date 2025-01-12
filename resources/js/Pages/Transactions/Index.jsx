import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Transactions({ transactions }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Transactions
                </h2>
            }
        >
            <Head title="Transactions" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <table className="min-w-full border-collapse border border-gray-200">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-200 px-4 py-2 text-left text-gray-800">
                                            ID
                                        </th>
                                        <th className="border border-gray-200 px-4 py-2 text-left text-gray-800">
                                            Service
                                        </th>
                                        <th className="border border-gray-200 px-4 py-2 text-left text-gray-800">
                                            Amount
                                        </th>
                                        <th className="border border-gray-200 px-4 py-2 text-left text-gray-800">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.id}>
                                            <td className="border border-gray-200 px-4 py-2">
                                                {transaction.id}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2">
                                                {transaction.service?.name || 'N/A'}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2">
                                                ${transaction.amount.toFixed(2)}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2">
                                                {transaction.status}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
