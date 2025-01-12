import React, { useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CreateTransaction({ services }) {
  const [serviceId, setServiceId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/transactions/create', {
        service_id: serviceId,
        amount: amount,
        payment_method_id: paymentMethodId,
      });
      if (response.data.success) {
        alert('Transaction created: ' + response.data.transaction.id);
      } else {
        alert('Error creating transaction: ' + response.data.message);
      }
    } catch (error) {
      alert('Create transaction error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Create Transaction
        </h2>
      }
    >
      <Head title="Create Transaction" />
      <div className="py-12">
        <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded shadow">
            <form onSubmit={handleCreateTransaction}>
              <div className="mb-4">
                <label className="block text-gray-700">Select Service</label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="mt-1 w-full border p-2"
                  required
                >
                  <option value="">-- Choose Service --</option>
                  {services.map((svc) => (
                    <option key={svc.id} value={svc.id}>
                      {svc.name} - ${svc.price}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full border p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Payment Method ID</label>
                <input
                  type="text"
                  value={paymentMethodId}
                  onChange={(e) => setPaymentMethodId(e.target.value)}
                  className="mt-1 w-full border p-2"
                  placeholder="PMT_xxxx"
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
                {loading ? 'Creating...' : 'Create Transaction'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
