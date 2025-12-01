import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransactionList({ transactions = [], loading = false }) {
    const { currentUser } = useAuth();

    if (loading) return <div className="text-center py-4 text-gray-500">Cargando movimientos...</div>;

    if (transactions.length === 0) {
        return (
            <div className="text-center py-8 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500">No hay movimientos aún.</p>
                <p className="text-sm text-gray-400">¡Agrega tu primer gasto o ingreso!</p>
            </div>
        );
    }

    const itemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 }
    };

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Movimientos Recientes</h3>
            <AnimatePresence>
                {transactions.map(tx => {
                    const isExpense = tx.type === 'expense';
                    const isPrivate = tx.private && tx.paidBy !== currentUser.uid;

                    return (
                        <motion.div
                            key={tx.id}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ duration: 0.3 }}
                            className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center"
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-full ${isExpense ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    {isExpense ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {isPrivate ? 'Movimiento Privado' : tx.category}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(tx.date).toLocaleDateString()} • {isPrivate ? 'Oculto' : (tx.description || 'Sin nota')}
                                    </p>
                                </div>
                            </div>
                            <span className={`font-bold ${isExpense ? 'text-red-600' : 'text-green-600'}`}>
                                {isExpense ? '-' : '+'}${tx.amount.toLocaleString()}
                            </span>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
