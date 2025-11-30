import React, { useEffect, useState } from 'react';
import { DebtService } from '../services/DebtService';
import { useGroup } from '../contexts/GroupContext';

export default function DebtList() {
    const { currentGroup } = useGroup();
    const [debts, setDebts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentGroup) return;

        const unsubscribe = DebtService.subscribeToDebts(currentGroup.id, (data) => {
            setDebts(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentGroup]);

    if (loading) return <div className="text-center py-4 text-gray-500">Cargando deudas...</div>;

    if (debts.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200">
                <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">¡Libre de deudas!</h3>
                <p className="mt-1 text-sm text-gray-500">O agrega una para empezar a planificar su pago.</p>
            </div>
        );
    }

    const totalDebt = debts.reduce((acc, debt) => acc + debt.currentBalance, 0);

    return (
        <div className="space-y-6">
            {/* Total Debt Summary */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex justify-between items-center">
                <div>
                    <p className="text-sm text-orange-800 font-medium">Deuda Total</p>
                    <p className="text-2xl font-bold text-orange-900">${totalDebt.toLocaleString()}</p>
                </div>
                <div className="bg-orange-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {debts.map(debt => {
                    const progress = debt.totalAmount > 0
                        ? ((debt.totalAmount - debt.currentBalance) / debt.totalAmount) * 100
                        : 0;

                    return (
                        <div key={debt.id} className="bg-white rounded-xl shadow-sm p-6 relative">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{debt.name}</h3>
                                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                    {debt.interestRate}% Interés
                                </span>
                            </div>

                            <p className="text-2xl font-bold text-gray-800 mb-1">
                                ${debt.currentBalance.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mb-4">
                                Pago mínimo: ${debt.minimumPayment.toLocaleString()}
                            </p>

                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                                <div
                                    className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Pagado: ${(debt.totalAmount - debt.currentBalance).toLocaleString()}</span>
                                <span>{progress.toFixed(0)}%</span>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button className="text-sm text-orange-600 hover:text-orange-800 font-medium">
                                    Registrar Pago
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
