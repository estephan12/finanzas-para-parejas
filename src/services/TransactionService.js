import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase.config';

// Transaction Data Model
// {
//   type: 'income' | 'expense',
//   amount: number,
//   category: string,
//   description: string,
//   date: timestamp,
//   paidBy: userId,
//   private: boolean,
//   createdAt: timestamp
// }

export const TRANSACTION_CATEGORIES = {
    income: ['Salario', 'Freelance', 'Regalo', 'Inversiones', 'Otros'],
    expense: [
        'Comida',
        'Transporte',
        'Vivienda',
        'Servicios',
        'Entretenimiento',
        'Salud',
        'Educación',
        'Ropa',
        'Deudas',
        'Ahorro',
        'Otros'
    ]
};

export const TransactionService = {
    // Add a new transaction
    addTransaction: async (groupId, transactionData) => {
        try {
            // Add transaction
            const docRef = await addDoc(collection(db, `groups/${groupId}/transactions`), {
                ...transactionData,
                amount: Number(transactionData.amount),
                date: new Date(transactionData.date),
                createdAt: serverTimestamp()
            });

            // Update account balance if accountId is provided
            if (transactionData.accountId) {
                const { AccountService } = await import('./AccountService');
                await AccountService.updateBalance(
                    groupId,
                    transactionData.accountId,
                    transactionData.amount,
                    transactionData.type === 'income'
                );
            }

            return docRef.id;
        } catch (error) {
            console.error("Error adding transaction:", error);
            throw error;
        }
    },

    // Update an existing transaction
    updateTransaction: async (groupId, transactionId, updates) => {
        try {
            const transactionRef = doc(db, `groups/${groupId}/transactions`, transactionId);
            await updateDoc(transactionRef, {
                ...updates,
                ...(updates.amount && { amount: Number(updates.amount) }),
                ...(updates.date && { date: new Date(updates.date) })
            });
        } catch (error) {
            console.error("Error updating transaction:", error);
            throw error;
        }
    },

    // Delete a transaction
    deleteTransaction: async (groupId, transactionId) => {
        try {
            const transactionRef = doc(db, `groups/${groupId}/transactions`, transactionId);

            // Get transaction data before deleting to reverse balance change
            const { getDoc } = await import('firebase/firestore');
            const transactionDoc = await getDoc(transactionRef);

            if (transactionDoc.exists()) {
                const txData = transactionDoc.data();

                // Reverse the balance change
                if (txData.accountId) {
                    const { AccountService } = await import('./AccountService');
                    await AccountService.updateBalance(
                        groupId,
                        txData.accountId,
                        txData.amount,
                        txData.type === 'expense' // Reverse: if it was expense, add back; if income, subtract
                    );
                }
            }

            await deleteDoc(transactionRef);
        } catch (error) {
            console.error("Error deleting transaction:", error);
            throw error;
        }
    },

    // Subscribe to real-time transaction updates
    subscribeToTransactions: (groupId, callback, limitCount = 50) => {
        const q = query(
            collection(db, `groups/${groupId}/transactions`),
            orderBy('date', 'desc'),
            limit(limitCount)
        );

        return onSnapshot(q, (snapshot) => {
            const transactions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convert Firestore timestamps to JS dates for easier handling in UI
                date: doc.data().date?.toDate ? doc.data().date.toDate() : new Date(doc.data().date),
                createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : null
            }));
            callback(transactions);
        });
    }
};
