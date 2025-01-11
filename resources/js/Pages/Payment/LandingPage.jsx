import { useState } from "react";
import { Head } from "@inertiajs/react";
import axios from "axios";

export default function LandingPage() {
    const [formData, setFormData] = useState({
        card_number: "",
        expiry_month: "",
        expiry_year: "",
        cvv: "",
        cardholder_name: "",
        amount: 0,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post("/payment/process", formData);
            setMessage(response.data.message);
        } catch (error) {
            setMessage(
                error.response?.data?.message || "An error occurred during payment."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Head title="Payment" />
            <h1 className="text-2xl font-semibold mb-4">Make a Payment</h1>
            {message && <p className="mb-4 text-center">{message}</p>}
            <form onSubmit={handlePayment} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Card Number</label>
                    <input
                        type="text"
                        name="card_number"
                        value={formData.card_number}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div className="flex space-x-4">
                    <div>
                        <label className="block text-sm font-medium">Expiry Month</label>
                        <input
                            type="number"
                            name="expiry_month"
                            value={formData.expiry_month}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Expiry Year</label>
                        <input
                            type="number"
                            name="expiry_year"
                            value={formData.expiry_year}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium">CVV</label>
                    <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Cardholder Name</label>
                    <input
                        type="text"
                        name="cardholder_name"
                        value={formData.cardholder_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 text-white rounded-md"
                >
                    {loading ? "Processing..." : "Pay Now"}
                </button>
            </form>
        </div>
    );
}
