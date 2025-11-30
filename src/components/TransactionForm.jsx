import React, { useState, useEffect } from 'react';
import { TransactionService, TRANSACTION_CATEGORIES } from '../services/TransactionService';
import { AccountService } from '../services/AccountService';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';

export default function TransactionForm({ onClose }) {
    const { currentGroup } = useGroup();
    const { currentUser } = useAuth();

    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isPrivate, setIsPrivate] = useState(false);
    const [accountId, setAccountId] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch accounts
    useEffect(() => {
        if (!currentGroup) return;
        const unsubscribe = AccountService.subscribeToAccounts(currentGroup.id, (data) => {
            setAccounts(data);
            if (data.length > 0 && !accountId) {
                setAccountId(data[0].id);
            }
        });
        return () => unsubscribe();
    }, [currentGroup]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!amount || !category || !date || !accountId) {
            return setError('Por favor completa los campos requeridos');
        }

        try {
            setError('');
            setLoading(true);

            await TransactionService.addTransaction(currentGroup.id, {
                type,
                amount,
                category,
                description,
                date,
                paidBy: currentUser.uid,
                private: isPrivate,
                accountId: accountId
            });

            // Reset form or close modal
            setAmount('');
            setDescription('');
            setCategory('');
            if (onClose) onClose();

        } catch (err) {
            setError('Error al guardar transacción: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nueva Transacción</h3>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Selector */}
                <div className="flex rounded-lg bg-gray-100 p-1">
                    <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${type === 'expense'
                            ? 'bg-white text-red-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Gasto
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${type === 'income'
                            ? 'bg-white text-green-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Ingreso
                    </button>
                </div>

                {/* Amount & Date */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Monto</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="input-field pl-7 py-2"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Fecha</label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="input-field py-2"
                        />
                    </div>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input-field py-2"
                    >
                        <option value="">Seleccionar...</option>
                        {TRANSACTION_CATEGORIES[type].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Account Selector */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Cuenta</label>
                    <select
                        required
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        className="input-field py-2"
                    >
                        {accounts.length === 0 ? (
                            <option value="">No hay cuentas disponibles</option>
                        ) : (
                            accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.icon} {acc.name}</option>
                            ))
                        )}
                    </select>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nota (Opcional)</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="input-field py-2"
                        placeholder="¿En qué gastaste?"
                    />
                </div>

                {/* Private Toggle */}
                <div className="flex items-center">
                    <input
                        id="private-tx"
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="private-tx" className="ml-2 block text-sm text-gray-700">
                        Marcar como privado <span className="text-xs text-gray-500">(Tu pareja solo verá el monto)</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-bold text-white shadow-md transition-all ${type === 'expense'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-green-500 hover:bg-green-600'
                        }`}
                >
                    {loading ? 'Guardando...' : `Guardar ${type === 'expense' ? 'Gasto' : 'Ingreso'}`}
                </button>
            </form>
        </div>
    );
}
