import React, { useState } from 'react';
import { BudgetService } from '../services/BudgetService';
import { useGroup } from '../contexts/GroupContext';

const CATEGORIES = [
    'Comida', 'Transporte', 'Vivienda', 'Servicios',
    'Entretenimiento', 'Salud', 'Educación', 'Ropa',
    'Ahorro', 'Deudas', 'Otros'
];

export default function BudgetForm({ onClose }) {
    const { currentGroup } = useGroup();

    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        if (!category || !limit) {
            return setError('Por favor completa los campos requeridos');
        }

        try {
            setError('');
            setLoading(true);

            await BudgetService.addBudget(currentGroup.id, {
                category,
                limit
            });

            // Reset form
            setCategory('');
            setLimit('');
            if (onClose) onClose();

        } catch (err) {
            setError('Error al guardar presupuesto: ' + err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nuevo Presupuesto Mensual</h3>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
                    <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input-field py-2"
                    >
                        <option value="">Selecciona una categoría</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Límite Mensual</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={limit}
                            onChange={(e) => setLimit(e.target.value)}
                            className="input-field pl-7 py-2"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg font-bold text-white shadow-md transition-all bg-teal-600 hover:bg-teal-700"
                >
                    {loading ? 'Guardando...' : 'Crear Presupuesto'}
                </button>
            </form>
        </div>
    );
}
