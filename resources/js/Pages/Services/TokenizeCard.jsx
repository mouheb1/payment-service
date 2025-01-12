import React, { useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function TokenizeCard() {
  const [cardData, setCardData] = useState({
    number: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
  });
  const [loading, setLoading] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState('');

  const handleChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handleTokenize = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/transactions/tokenize', cardData);
      if (response.data.success) {
        setPaymentMethodId(response.data.payment_method_id);
        alert('Card tokenized successfully!');
      } else {
        alert('Tokenization failed: ' + response.data.message);
      }
    } catch (error) {
      alert('Tokenization error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Tokenize Card
        </h2>
      }
    >
      <Head title="Tokenize Card" />
      <div className="py-12">
        <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded shadow">
            <form onSubmit={handleTokenize}>
              <div className="mb-4">
                <label className="block text-gray-700">Card Number</label>
                <input
                  type="text"
                  name="number"
                  value={cardData.number}
                  onChange={handleChange}
                  className="mt-1 w-full border p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Expiry Month (MM)</label>
                <input
                  type="text"
                  name="expiry_month"
                  value={cardData.expiry_month}
                  onChange={handleChange}
                  className="mt-1 w-full border p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Expiry Year (YY or YYYY)</label>
                <input
                  type="text"
                  name="expiry_year"
                  value={cardData.expiry_year}
                  onChange={handleChange}
                  className="mt-1 w-full border p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={cardData.cvv}
                  onChange={handleChange}
                  className="mt-1 w-full border p-2"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 text-white rounded ${
                  loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Tokenizing...' : 'Tokenize Card'}
              </button>
            </form>

            {paymentMethodId && (
              <div className="mt-4 p-4 border border-green-300 rounded bg-green-50">
                <p className="text-green-700">Payment Method ID: {paymentMethodId}</p>
                <p>Use this ID to create transactions without storing card details again.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
