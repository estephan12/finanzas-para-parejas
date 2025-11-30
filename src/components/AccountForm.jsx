import React, { useState } from 'react';
import { AccountService, ACCOUNT_TYPES, ACCOUNT_COLORS } from '../services/AccountService';
import { useGroup } from '../contexts/GroupContext';

export default function AccountForm({ onClose, editAccount }) {
    const { currentGroup } = useGroup();

    const [name, setName] = useState(editAccount?.name || '');
    const [type, setType] = useState(editAccount?.type || 'savings');
    const [balance, setBalance] = useState(editAccount?.balance || '');
    const [color, setColor] = useState(editAccount?.color || ACCOUNT_COLORS[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        if (!name || !balance) {
            return setError('Por favor completa los campos requeridos');
        }

        try {
            setError('');
            setLoading(true);

            if (editAccount) {
                await AccountService.updateAccount(currentGroup.id, editAccount.id, {
                    name,
                    type,
                    balance,
                    color
                });
            } else {
                await AccountService.addAccount(currentGroup.id, {
                    name,
                    type,
                    balance,
                    color,
                    icon: type === 'credit_card' ? '💳' : type === 'savings' ? '🏦' : type === 'checking' ? '💰' : '💵'
                });
            }

            // Reset form
            setName('');
            setBalance('');
            if (onClose) onClose();

        } catch (err) {
            setError('Error al guardar cuenta: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
                {editAccount ? 'Editar Cuenta' : 'Nueva Cuenta'}
            </h3>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nombre de la Cuenta</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field py-2"
                        placeholder="Ej. Cuenta de Ahorros BHD"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de Cuenta</label>
                    <select
                        required
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="input-field py-2"
                    >
                        {Object.entries(ACCOUNT_TYPES).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Balance Actual</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            className="input-field pl-7 py-2"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                    <div className="flex gap-2 flex-wrap">
                        {ACCOUNT_COLORS.map(c => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setColor(c)}
                                className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-gray-900' : 'border-gray-200'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-bold text-white shadow-md transition-all bg-teal-600 hover:bg-teal-700"
                >
                    {loading ? 'Guardando...' : editAccount ? 'Actualizar Cuenta' : 'Crear Cuenta'}
                </button>
            </form>
        </div>
    );
}
