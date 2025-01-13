import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";

export default function ProviderIndex({
    transactions,
    currentPage,
    pageSize,
    filters,
}) {
    const [filterParams, setFilterParams] = useState({
        id: filters?.id || "",
        type: filters?.type || "",
        channel: filters?.channel || "",
        amount: filters?.amount || "",
        status: filters?.status || "",
    });

    const [loading, setLoading] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const handleFilterChange = (e) => {
        setFilterParams({ ...filterParams, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        router.get(
            "/provider-transactions",
            { ...filterParams, page: 1, page_size: pageSize },
            { preserveScroll: true }
        );
    };

    const fetchNextPage = () => {
        setLoading(true);
        router.get(
            "/provider-transactions",
            {
                ...filterParams,
                page: parseInt(currentPage) + 1,
                page_size: pageSize,
            },
            {
                preserveScroll: true,
                replace: true, // Ensures clean state transition.
            }
        );
        setLoading(false);
    };

    const fetchPreviousPage = () => {
        if (currentPage > 1) {
            setLoading(true);
            router.get(
                "/provider-transactions",
                { ...filterParams, page: currentPage - 1, page_size: pageSize },
                {
                    preserveScroll: true,
                    replace: true, // Ensures clean state transition.
                }
            );
            setLoading(false);
        }
    };

    const viewTransactionDetails = async (transactionId) => {
        setLoading(true);

        try {
            const response = await axios.get(`/provider-transactions/details`, {
                params: { id: transactionId },
            });

            // Assuming the response includes the transaction as `response.data.transaction`
            setSelectedTransaction(response.data.transaction);
        } catch (error) {
            console.error("Error fetching transaction details:", error);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => setSelectedTransaction(null);

    const hasTransactions = transactions && transactions.length > 0;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Provider Transactions
                </h2>
            }
        >
            <Head title="Provider Transactions" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Filter Section */}
                    <div className="mb-6 p-4 bg-white shadow rounded">
                        <h3 className="text-lg font-semibold mb-4">Filters</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            <div>
                                <label className="block text-gray-700">
                                    Transaction ID
                                </label>
                                <input
                                    type="text"
                                    name="id"
                                    value={filterParams.id}
                                    onChange={handleFilterChange}
                                    className="mt-1 w-full border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">
                                    Type
                                </label>
                                <select
                                    name="type"
                                    value={filterParams.type}
                                    onChange={handleFilterChange}
                                    className="mt-1 w-full border-gray-300 rounded"
                                >
                                    <option value="">All</option>
                                    <option value="SALE">SALE</option>
                                    <option value="REFUND">REFUND</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">
                                    Channel
                                </label>
                                <select
                                    name="channel"
                                    value={filterParams.channel}
                                    onChange={handleFilterChange}
                                    className="mt-1 w-full border-gray-300 rounded"
                                >
                                    <option value="">All</option>
                                    <option value="CNP">CNP</option>
                                    <option value="CP">CP</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={filterParams.amount}
                                    onChange={handleFilterChange}
                                    className="mt-1 w-full border-gray-300 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={filterParams.status}
                                    onChange={handleFilterChange}
                                    className="mt-1 w-full border-gray-300 rounded"
                                >
                                    <option value="">All</option>
                                    <option value="CAPTURED">CAPTURED</option>
                                    <option value="REVERSED">REVERSED</option>
                                    <option value="DECLINED">DECLINED</option>
                                    <option value="FUNDED">FUNDED</option>
                                    <option value="FAILED">FAILED</option>
                                    <option value="REJECTED">REJECTED</option>
                                    <option value="FOR_REVIEW">
                                        FOR REVIEW
                                    </option>
                                    <option value="INITIATED">INITIATED</option>
                                    <option value="PENDING">PENDING</option>
                                    <option value="PREAUTHORIZED">
                                        PREAUTHORIZED
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={applyFilters}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    {hasTransactions ? (
                        <table className="min-w-full border border-gray-300 mb-6 p-4 bg-white shadow rounded">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">ID</th>
                                    <th className="border px-4 py-2">Amount</th>
                                    <th className="border px-4 py-2">
                                        Currency
                                    </th>
                                    <th className="border px-4 py-2">Status</th>
                                    <th className="border px-4 py-2">
                                        Created
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn) => (
                                    <tr key={txn.id}>
                                        <td className="border px-4 py-2">
                                            {txn.id}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {txn.amount}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {txn.currency}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {txn.status}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {new Date(
                                                txn.time_created
                                            ).toLocaleString()}
                                        </td>
                                        <td className="border px-4 py-2">
                                            <button
                                                onClick={() =>
                                                    viewTransactionDetails(
                                                        txn.id,
                                                        "provider"
                                                    )
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
                    ) : (
                        <div className="text-center text-gray-600">
                            No transactions found.
                        </div>
                    )}

                    {/* Pagination Controls */}
                    <div className="mt-4 flex items-center justify-between">
                        <button
                            className={`px-4 py-2 text-white rounded ${
                                currentPage === 1
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                            onClick={fetchPreviousPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>Page {currentPage}</span>
                        <button
                            className={`px-4 py-2 text-white rounded ${
                                transactions.length < pageSize
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                            onClick={fetchNextPage}
                            disabled={transactions.length < pageSize}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Transaction Details Modal */}
            {selectedTransaction && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-3/4 overflow-y-auto max-h-screen">
                        <h3 className="text-lg font-semibold mb-4">
                            Transaction Details
                        </h3>

                        <div className="space-y-6">
                            {/* General Information */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">
                                    General Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <strong>ID:</strong>{" "}
                                        {selectedTransaction.id}
                                    </div>
                                    <div>
                                        <strong>Status:</strong>{" "}
                                        {selectedTransaction.status}
                                    </div>
                                    <div>
                                        <strong>Type:</strong>{" "}
                                        {selectedTransaction.type}
                                    </div>
                                    <div>
                                        <strong>Created At:</strong>{" "}
                                        {new Date(
                                            selectedTransaction.time_created
                                        ).toLocaleString()}
                                    </div>
                                    <div>
                                        <strong>Last Updated:</strong>{" "}
                                        {selectedTransaction.time_last_updated ||
                                            "N/A"}
                                    </div>
                                    <div>
                                        <strong>Country:</strong>{" "}
                                        {selectedTransaction.country || "N/A"}
                                    </div>
                                    <div>
                                        <strong>Language:</strong>{" "}
                                        {selectedTransaction.language || "N/A"}
                                    </div>
                                    <div>
                                        <strong>IP Address:</strong>{" "}
                                        {selectedTransaction.ip_address ||
                                            "N/A"}
                                    </div>
                                </div>
                            </div>

                            {/* Merchant Information */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">
                                    Merchant Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <strong>Merchant ID:</strong>{" "}
                                        {selectedTransaction.merchant_id}
                                    </div>
                                    <div>
                                        <strong>Merchant Name:</strong>{" "}
                                        {selectedTransaction.merchant_name}
                                    </div>
                                    <div>
                                        <strong>Account ID:</strong>{" "}
                                        {selectedTransaction.account_id}
                                    </div>
                                    <div>
                                        <strong>Account Name:</strong>{" "}
                                        {selectedTransaction.account_name}
                                    </div>
                                    <div>
                                        <strong>Channel:</strong>{" "}
                                        {selectedTransaction.channel}
                                    </div>
                                    <div>
                                        <strong>Batch ID:</strong>{" "}
                                        {selectedTransaction.batch_id}
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">
                                    Payment Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <strong>Amount:</strong>{" "}
                                        {selectedTransaction.amount}
                                    </div>
                                    <div>
                                        <strong>Currency:</strong>{" "}
                                        {selectedTransaction.currency}
                                    </div>
                                    <div>
                                        <strong>Reference:</strong>{" "}
                                        {selectedTransaction.reference}
                                    </div>
                                    <div>
                                        <strong>Description:</strong>{" "}
                                        {selectedTransaction.description ||
                                            "N/A"}
                                    </div>
                                </div>
                            </div>

                            {/* Card Details */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">
                                    Card Details
                                </h4>
                                {selectedTransaction.payment_method?.card ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <strong>Card Brand:</strong>{" "}
                                            {
                                                selectedTransaction
                                                    .payment_method.card.brand
                                            }
                                        </div>
                                        <div>
                                            <strong>Auth Code:</strong>{" "}
                                            {
                                                selectedTransaction
                                                    .payment_method.card
                                                    .authcode
                                            }
                                        </div>
                                        <div>
                                            <strong>Masked Number:</strong>{" "}
                                            {
                                                selectedTransaction
                                                    .payment_method.card
                                                    .masked_number_first6last4
                                            }
                                        </div>
                                        <div>
                                            <strong>Funding Type:</strong>{" "}
                                            {
                                                selectedTransaction
                                                    .payment_method.card.funding
                                            }
                                        </div>
                                        <div>
                                            <strong>CVV Result:</strong>{" "}
                                            {selectedTransaction.payment_method
                                                .card.cvv_result || "N/A"}
                                        </div>
                                        <div>
                                            <strong>AVS Address Result:</strong>{" "}
                                            {selectedTransaction.payment_method
                                                .card.avs_address_result ||
                                                "N/A"}
                                        </div>
                                    </div>
                                ) : (
                                    <div>No card details available.</div>
                                )}
                            </div>

                            {/* Risk Assessment */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">
                                    Risk Assessment
                                </h4>
                                {selectedTransaction.risk_assessment ? (
                                    <div>
                                        <div>
                                            <strong>Risk Mode:</strong>{" "}
                                            {
                                                selectedTransaction
                                                    .risk_assessment.mode
                                            }
                                        </div>
                                        <div>
                                            <strong>Risk Result:</strong>{" "}
                                            {
                                                selectedTransaction
                                                    .risk_assessment.result
                                            }
                                        </div>
                                        <h5 className="font-semibold mt-2">
                                            Rules:
                                        </h5>
                                        <ul className="list-disc pl-5">
                                            {selectedTransaction.risk_assessment.rules.map(
                                                (rule, index) => (
                                                    <li key={index}>
                                                        <strong>
                                                            {rule.description}:
                                                        </strong>{" "}
                                                        {rule.result}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                ) : (
                                    <div>
                                        No risk assessment details available.
                                    </div>
                                )}
                            </div>

                            {/* System Details */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">
                                    System Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <strong>MID:</strong>{" "}
                                        {selectedTransaction.system?.mid}
                                    </div>
                                    <div>
                                        <strong>TID:</strong>{" "}
                                        {selectedTransaction.system?.tid}
                                    </div>
                                    <div>
                                        <strong>Name:</strong>{" "}
                                        {selectedTransaction.system?.name}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">
                                    Action Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <strong>Action ID:</strong>{" "}
                                        {selectedTransaction.action?.id}
                                    </div>
                                    <div>
                                        <strong>Type:</strong>{" "}
                                        {selectedTransaction.action?.type}
                                    </div>
                                    <div>
                                        <strong>Result Code:</strong>{" "}
                                        {
                                            selectedTransaction.action
                                                ?.result_code
                                        }
                                    </div>
                                    <div>
                                        <strong>Created At:</strong>{" "}
                                        {new Date(
                                            selectedTransaction.action?.time_created
                                        ).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={closeModal}
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
