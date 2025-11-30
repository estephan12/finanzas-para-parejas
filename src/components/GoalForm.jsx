import React, { useState } from 'react';
import { GoalService } from '../services/GoalService';
import { useGroup } from '../contexts/GroupContext';

export default function GoalForm({ onClose }) {
    const { currentGroup } = useGroup();

    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [currentAmount, setCurrentAmount] = useState('');
    const [deadline, setDeadline] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        if (!name || !targetAmount || !deadline) {
            return setError('Por favor completa los campos requeridos');
        }

        try {
            setError('');
            setLoading(true);

            await GoalService.addGoal(currentGroup.id, {
                name,
                targetAmount,
                currentAmount: currentAmount || 0,
                deadline,
                color: 'bg-purple-500' // Default color for now
            });

            // Reset form
            setName('');
            setTargetAmount('');
            setCurrentAmount('');
            setDeadline('');
            if (onClose) onClose();

        } catch (err) {
            setError('Error al guardar meta: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nueva Meta de Ahorro</h3>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nombre de la Meta</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field py-2"
                        placeholder="Ej. Boda, Casa Nueva..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Monto Objetivo</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={targetAmount}
                                onChange={(e) => setTargetAmount(e.target.value)}
                                className="input-field pl-7 py-2"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Ahorro Inicial</label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={currentAmount}
                                onChange={(e) => setCurrentAmount(e.target.value)}
                                className="input-field pl-7 py-2"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Límite</label>
                    <input
                        type="date"
                        required
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="input-field py-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-bold text-white shadow-md transition-all bg-purple-600 hover:bg-purple-700"
                >
                    {loading ? 'Guardando...' : 'Crear Meta'}
                </button>
            </form>
        </div>
    );
}
