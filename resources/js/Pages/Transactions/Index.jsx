import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Transactions({ transactions }) {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Success':
                return 'text-green-600';
            case 'Pending':
                return 'text-yellow-600';
            case 'Failed':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

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
                                        <th className="border border-gray-200 px-4 py-2 text-left text-gray-800">
                                            Date
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
                                            <td
                                                className={`border border-gray-200 px-4 py-2 ${getStatusClass(
                                                    transaction.status,
                                                )}`}
                                            >
                                                {transaction.status}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-2">
                                                {transaction.created_at}
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
