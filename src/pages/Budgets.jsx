import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BudgetForm from '../components/BudgetForm';
import BudgetList from '../components/BudgetList';

export default function Budgets() {
    const [showAddModal, setShowAddModal] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <h1 className="text-xl font-bold text-gray-900">Presupuestos</h1>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Mobile Add Button */}
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="w-full btn-primary flex items-center justify-center space-x-2 bg-teal-600"
                        >
                            <span>+ Nuevo Presupuesto</span>
                        </button>
                    </div>

                    {/* Desktop Form */}
                    <div className="hidden lg:block">
                        <BudgetForm />
                    </div>

                    {/* Mobile Modal */}
                    {showAddModal && (
                        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-50 p-4">
                            <div className="w-full max-w-md bg-white rounded-xl overflow-hidden">
                                <div className="flex justify-end p-2">
                                    <button onClick={() => setShowAddModal(false)} className="text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <BudgetForm onClose={() => setShowAddModal(false)} />
                            </div>
                        </div>
                    )}

                    {/* Budgets List */}
                    <div className="lg:col-span-2">
                        <BudgetList />
                    </div>
                </div>
            </div>
        </div>
    );
}
