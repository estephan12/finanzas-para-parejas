import React, { useEffect, useState } from 'react';
import { AccountService, ACCOUNT_TYPES } from '../services/AccountService';
import { useGroup } from '../contexts/GroupContext';

export default function AccountList({ onEdit }) {
    const { currentGroup } = useGroup();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentGroup) return;

        const unsubscribe = AccountService.subscribeToAccounts(currentGroup.id, (data) => {
            setAccounts(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentGroup]);

    const handleDelete = async (accountId) => {
        if (window.confirm('¿Estás seguro de eliminar esta cuenta?')) {
            try {
                await AccountService.deleteAccount(currentGroup.id, accountId);
            } catch (error) {
                alert('Error al eliminar cuenta');
            }
        }
    };

    const totalBalance = accounts.reduce((sum, acc) => sum + (Number(acc.balance) || 0), 0);

    if (loading) return <div className="text-center py-4 text-gray-500">Cargando cuentas...</div>;

    if (accounts.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200">
                <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Sin Cuentas</h3>
                <p className="mt-1 text-sm text-gray-500">Agrega tus cuentas bancarias y tarjetas.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Total Balance Card */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl p-6 text-white shadow-lg">
                <p className="text-sm opacity-90">Balance Total</p>
                <p className="text-3xl font-bold">${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-xs opacity-75 mt-1">{accounts.length} cuenta{accounts.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Account Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.map(account => (
                    <div
                        key={account.id}
                        className="bg-white rounded-xl shadow-sm p-4 border-l-4 hover:shadow-md transition-shadow"
                        style={{ borderLeftColor: account.color }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                                <span className="text-2xl">{account.icon}</span>
                                <div>
                                    <h3 className="font-bold text-gray-900">{account.name}</h3>
                                    <p className="text-xs text-gray-500">{ACCOUNT_TYPES[account.type]}</p>
                                </div>
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => onEdit && onEdit(account)}
                                    className="text-gray-400 hover:text-teal-600 p-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(account.id)}
                                    className="text-gray-400 hover:text-red-600 p-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="mt-3">
                            <p className="text-2xl font-bold text-gray-800">
                                ${Number(account.balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
