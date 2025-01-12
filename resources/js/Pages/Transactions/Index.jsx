import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function TransactionsIndex({ transactions }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Transactions</h2>}
        >
            <Head title="Transactions" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Service</th>
                                <th className="border px-4 py-2">Amount</th>
                                <th className="border px-4 py-2">Status</th>
                                <th className="border px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn) => (
                                <tr key={txn.id}>
                                    <td className="border px-4 py-2">{txn.id}</td>
                                    <td className="border px-4 py-2">{txn.service?.name}</td>
                                    <td className="border px-4 py-2">{txn.amount}</td>
                                    <td className="border px-4 py-2">{txn.status}</td>
                                    <td className="border px-4 py-2">
                                        {txn.status !== 'captured' && (
                                            <Link
                                                href={route('transactions.finalizeForm', { transactionId: txn.transaction_id })}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Finalize
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
