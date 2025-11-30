import React, { useState, useMemo } from 'react';

export default function DebtStrategy({ debts }) {
    const [extraPayment, setExtraPayment] = useState(0);
    const [strategy, setStrategy] = useState('snowball'); // 'snowball' or 'avalanche'

    const calculation = useMemo(() => {
        if (!debts.length) return null;

        // Deep copy debts to avoid mutating original state during simulation
        let currentDebts = debts.map(d => ({ ...d, simulatedBalance: d.currentBalance }));
        let totalInterestPaid = 0;
        let months = 0;
        let monthlyLog = [];

        // Sort based on strategy
        // Snowball: Lowest balance first
        // Avalanche: Highest interest rate first
        const sortDebts = (debtsList) => {
            return debtsList.sort((a, b) => {
                if (strategy === 'snowball') {
                    return a.simulatedBalance - b.simulatedBalance;
                } else {
                    return b.interestRate - a.interestRate;
                }
            });
        };

        while (currentDebts.some(d => d.simulatedBalance > 0) && months < 360) { // Cap at 30 years
            months++;
            let availableExtra = Number(extraPayment);

            // 1. Charge Interest
            currentDebts.forEach(d => {
                if (d.simulatedBalance > 0) {
                    const monthlyInterest = (d.simulatedBalance * (d.interestRate / 100)) / 12;
                    d.simulatedBalance += monthlyInterest;
                    totalInterestPaid += monthlyInterest;
                }
            });

            // 2. Pay Minimums
            currentDebts.forEach(d => {
                if (d.simulatedBalance > 0) {
                    const payment = Math.min(d.simulatedBalance, d.minimumPayment);
                    d.simulatedBalance -= payment;
                    // If minimum payment was more than balance, add remainder to available extra (simplified)
                }
            });

            // 3. Pay Extra to Priority Debt
            currentDebts = sortDebts(currentDebts);

            for (let d of currentDebts) {
                if (d.simulatedBalance > 0 && availableExtra > 0) {
                    const payment = Math.min(d.simulatedBalance, availableExtra);
                    d.simulatedBalance -= payment;
                    availableExtra -= payment;
                }
            }
        }

        return { months, totalInterestPaid };
    }, [debts, extraPayment, strategy]);

    if (!debts.length) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <span className="bg-purple-100 p-2 rounded-lg text-purple-600 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                        </svg>
                    </span>
                    Simulador de Pago Acelerado
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ¿Cuánto extra puedes pagar al mes?
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                            <input
                                type="number"
                                value={extraPayment}
                                onChange={(e) => setExtraPayment(Number(e.target.value))}
                                className="input-field pl-7 py-2"
                                placeholder="0.00"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Este monto se sumará a tus pagos mínimos.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estrategia
                        </label>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setStrategy('snowball')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${strategy === 'snowball'
                                        ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                ❄️ Bola de Nieve
                                <span className="block text-xs font-normal opacity-75">Menor saldo primero</span>
                            </button>
                            <button
                                onClick={() => setStrategy('avalanche')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${strategy === 'avalanche'
                                        ? 'bg-orange-100 text-orange-700 border-2 border-orange-200'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                🏔️ Avalancha
                                <span className="block text-xs font-normal opacity-75">Mayor interés primero</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center">
                    {calculation && (
                        <>
                            <div className="text-center mb-6">
                                <p className="text-sm text-gray-500 mb-1">Serás libre de deudas en</p>
                                <p className="text-4xl font-extrabold text-gray-900">
                                    {Math.floor(calculation.months / 12) > 0 && `${Math.floor(calculation.months / 12)} años y `}
                                    {calculation.months % 12} meses
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Intereses Totales Estimados:</span>
                                    <span className="font-bold text-red-600">
                                        ${calculation.totalInterestPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                                {extraPayment > 0 && (
                                    <div className="bg-green-100 text-green-800 p-3 rounded-lg text-xs text-center">
                                        ¡Estás acelerando tu libertad financiera! 🚀
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
