import React, { useState } from 'react';
import { DebtService } from '../services/DebtService';
import { useGroup } from '../contexts/GroupContext';

export default function DebtForm({ onClose }) {
    const { currentGroup } = useGroup();

    const [name, setName] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [currentBalance, setCurrentBalance] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [minimumPayment, setMinimumPayment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        if (!name || !currentBalance) {
            return setError('Por favor completa los campos requeridos');
        }

        try {
            setError('');
            setLoading(true);

            await DebtService.addDebt(currentGroup.id, {
                name,
                totalAmount: totalAmount || currentBalance, // If total not known, assume current
                currentBalance,
                interestRate,
                minimumPayment
            });

            // Reset form
            setName('');
            setTotalAmount('');
            setCurrentBalance('');
            setInterestRate('');
            setMinimumPayment('');
            if (onClose) onClose();

        } catch (err) {
            setError('Error al guardar deuda: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Registrar Deuda</h3>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nombre (ej. Préstamo Banco)</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field py-2"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Saldo Actual</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={currentBalance}
                                onChange={(e) => setCurrentBalance(e.target.value)}
                                className="input-field pl-7 py-2"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Monto Original (Opcional)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                                className="input-field pl-7 py-2"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Tasa Interés Anual (%)</label>
                        <input
                            type="number"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(e.target.value)}
                            className="input-field py-2"
                            placeholder="Ej. 18.5"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Pago Mínimo Mensual</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={minimumPayment}
                                onChange={(e) => setMinimumPayment(e.target.value)}
                                className="input-field pl-7 py-2"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-bold text-white shadow-md transition-all bg-orange-500 hover:bg-orange-600"
                >
                    {loading ? 'Guardando...' : 'Registrar Deuda'}
                </button>
            </form>
        </div>
    );
}
