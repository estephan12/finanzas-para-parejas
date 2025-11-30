import React, { useEffect, useState, useMemo } from 'react';
import { BudgetService } from '../services/BudgetService';
import { TransactionService } from '../services/TransactionService';
import { useGroup } from '../contexts/GroupContext';

export default function BudgetList() {
    const { currentGroup } = useGroup();
    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentGroup) return;

        // Subscribe to Budgets
        const unsubscribeBudgets = BudgetService.subscribeToBudgets(currentGroup.id, (data) => {
            setBudgets(data);
        });

        // Subscribe to Transactions (to calculate spending)
        const unsubscribeTransactions = TransactionService.subscribeToTransactions(currentGroup.id, (data) => {
            setTransactions(data);
            setLoading(false);
        });

        return () => {
            unsubscribeBudgets();
            unsubscribeTransactions();
        };
    }, [currentGroup]);

    // Calculate spending per category for the current month
    const spendingByCategory = useMemo(() => {
        const spending = {};
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        transactions.forEach(tx => {
            const txDate = new Date(tx.date);
            if (
                tx.type === 'expense' &&
                txDate.getMonth() === currentMonth &&
                txDate.getFullYear() === currentYear
            ) {
                if (!spending[tx.category]) {
                    spending[tx.category] = 0;
                }
                spending[tx.category] += Number(tx.amount);
            }
        });
        return spending;
    }, [transactions]);

    if (loading) return <div className="text-center py-4 text-gray-500">Cargando presupuestos...</div>;

    if (budgets.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200">
                <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 3.666a2.02 2.02 0 00.174 1.108c.19.416.487.79.865 1.074.377.284.814.48 1.28.572M9 8.25a2.25 2.25 0 00-2.25 2.25v10.5m0 0h10.5m-10.5 0L21 18.75m-7.5-5.25a2.25 2.25 0 00-2.25 2.25v3m0 0h6m-6 0a2.25 2.25 0 002.25 2.25H18" />
                    </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Sin Presupuestos</h3>
                <p className="mt-1 text-sm text-gray-500">Define límites para controlar tus gastos.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgets.map(budget => {
                const spent = spendingByCategory[budget.category] || 0;
                const percentage = Math.min((spent / budget.limit) * 100, 100);
                const isOverBudget = spent > budget.limit;

                return (
                    <div key={budget.id} className="bg-white rounded-xl shadow-sm p-6 relative">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-900">{budget.category}</h3>
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${isOverBudget ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {isOverBudget ? 'Excedido' : 'En rango'}
                            </span>
                        </div>

                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-2xl font-bold text-gray-800">${spent.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Gastado este mes</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-600">Límite: ${budget.limit.toLocaleString()}</p>
                            </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                            <div
                                className={`h-2.5 rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-teal-500'}`}
                                style={{ width: `${percentage}%` }}
                            ></div>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                            {percentage.toFixed(0)}% del límite
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
