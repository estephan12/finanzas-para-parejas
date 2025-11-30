import React, { useEffect, useState } from 'react';
import { GoalService } from '../services/GoalService';
import { useGroup } from '../contexts/GroupContext';

export default function GoalList() {
    const { currentGroup } = useGroup();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentGroup) return;

        const unsubscribe = GoalService.subscribeToGoals(currentGroup.id, (data) => {
            setGoals(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentGroup]);

    if (loading) return <div className="text-center py-4 text-gray-500">Cargando metas...</div>;

    if (goals.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border-2 border-dashed border-gray-200">
                <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay metas definidas</h3>
                <p className="mt-1 text-sm text-gray-500">Comienza a planificar tu futuro hoy.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map(goal => {
                const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));

                return (
                    <div key={goal.id} className="bg-white rounded-xl shadow-sm p-6 relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{goal.name}</h3>
                                <p className="text-sm text-gray-500">
                                    Meta: ${goal.targetAmount.toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {daysLeft > 0 ? `${daysLeft} días restantes` : 'Vencida'}
                            </div>
                        </div>

                        <div className="mb-2 flex justify-between text-sm font-medium">
                            <span className="text-gray-700">${goal.currentAmount.toLocaleString()}</span>
                            <span className="text-gray-500">{progress.toFixed(0)}%</span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                                + Agregar Fondos
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
