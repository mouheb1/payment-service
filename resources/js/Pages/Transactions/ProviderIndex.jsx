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
            { ...filterParams, page: parseInt(currentPage) + 1, page_size: pageSize },
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
                                    <th className="border px-4 py-2">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((txn) => (
                                    <tr key={txn.id}>
                                        <td className="border px-4 py-2">
                                            {txn.id}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {txn.amount / 100}
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
        </AuthenticatedLayout>
    );
}
