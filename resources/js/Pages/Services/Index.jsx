import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Services({ services }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Services
                </h2>
            }
        >
            <Head title="Services" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 shadow hover:shadow-md"
                                    >
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            {service.name}
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {service.description}
                                        </p>
                                        <p className="mt-4 text-lg font-medium text-gray-800">
                                            ${service.price.toFixed(2)}
                                        </p>
                                        <button className="mt-4 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                            Buy Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
