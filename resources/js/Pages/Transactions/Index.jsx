import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

export default function TransactionsIndex({ transactions }) {
    const [selectedTransaction, setSelectedTransaction] = useState(null); // State for selected transaction details

    const openDetailsModal = (transaction) => {
        setSelectedTransaction(transaction); // Set the selected transaction
    };

    const closeDetailsModal = () => {
        setSelectedTransaction(null); // Clear the selected transaction
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
                    {/* Transactions Table */}
                    <table className="min-w-full border border-gray-300 mb-6 p-4 bg-white shadow rounded">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Service</th>
                                <th className="border px-4 py-2">Amount</th>
                                <th className="border px-4 py-2">
                                    Final Amount
                                </th>
                                <th className="border px-4 py-2">Status</th>
                                <th className="border px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((txn) => (
                                <tr key={txn.id}>
                                    <td className="border px-4 py-2">
                                        {txn.id}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {txn.service?.name}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {txn.amount}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {txn.final_amount ?? "N/A"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {txn.status}
                                    </td>
                                    <td className="border px-4 py-2 flex space-x-2">
                                        {txn.status?.toLowerCase() !==
                                        "captured" ? (
                                            <Link
                                                href={route(
                                                    "transactions.finalizeForm",
                                                    {
                                                        transactionId:
                                                            txn.transaction_id,
                                                    }
                                                )}
                                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                Finalize
                                            </Link>
                                        ) : (
                                            <button
                                                disabled
                                                className="px-4 py-2 bg-gray-600 text-white rounded"
                                            >
                                                Finalize
                                            </button>
                                        )}
                                        <button
                                            onClick={() =>
                                                openDetailsModal(txn)
                                            }
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction Details Modal */}
            {selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md w-1/2">
                        <h3 className="text-lg font-semibold mb-4">
                            Transaction Details
                        </h3>
                        <div className="mb-4">
                            <strong>ID:</strong> {selectedTransaction.id}
                        </div>
                        <div className="mb-4">
                            <strong>Transaction ID:</strong> {selectedTransaction.transaction_id}
                        </div>
                        <div className="mb-4">
                            <strong>Service:</strong>{" "}
                            {selectedTransaction.service?.name ?? "N/A"}
                        </div>
                        <div className="mb-4">
                            <strong>Amount:</strong>{" "}
                            {selectedTransaction.amount}
                        </div>
                        <div className="mb-4">
                            <strong>Final Amount:</strong>{" "}
                            {selectedTransaction.final_amount ?? "N/A"}
                        </div>
                        <div className="mb-4">
                            <strong>Status:</strong>{" "}
                            {selectedTransaction.status}
                        </div>
                        <div className="mb-4">
                            <strong>Currency:</strong>{" "}
                            {selectedTransaction.currency}
                        </div>
                        <div className="mb-4">
                            <strong>Country:</strong>{" "}
                            {selectedTransaction.country ?? "N/A"}
                        </div>
                        <div className="mb-4">
                            <strong>Reference:</strong>{" "}
                            {selectedTransaction.reference}
                        </div>
                        <div className="mb-4">
                            <strong>Merchant ID:</strong>{" "}
                            {selectedTransaction.merchant_id ?? "N/A"}
                        </div>
                        <div className="mb-4">
                            <strong>Payer ID:</strong>{" "}
                            {selectedTransaction.payer_id ?? "N/A"}
                        </div>
                        <div className="mb-4">
                            <strong>Created At:</strong>{" "}
                            {new Date(
                                selectedTransaction.created_at
                            ).toLocaleString()}
                        </div>
                        <div className="mb-4">
                            <strong>Updated At:</strong>{" "}
                            {new Date(
                                selectedTransaction.updated_at
                            ).toLocaleString()}
                        </div>
                        <div className="mb-4">
                            <strong>Service Description:</strong>{" "}
                            {selectedTransaction.service?.description ?? "N/A"}
                        </div>
                        <button
                            onClick={closeDetailsModal}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
