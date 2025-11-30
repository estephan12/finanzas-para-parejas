import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase.config';

// Debt Data Model
// {
//   name: string,
//   totalAmount: number, // Original debt amount
//   currentBalance: number, // What is currently owed
//   interestRate: number, // Annual interest rate %
//   minimumPayment: number,
//   dueDate: number, // Day of month (1-31)
//   createdAt: timestamp
// }

export const DebtService = {
    // Add a new debt
    addDebt: async (groupId, debtData) => {
        try {
            const docRef = await addDoc(collection(db, `groups/${groupId}/debts`), {
                ...debtData,
                totalAmount: Number(debtData.totalAmount),
                currentBalance: Number(debtData.currentBalance),
                interestRate: Number(debtData.interestRate || 0),
                minimumPayment: Number(debtData.minimumPayment || 0),
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding debt:", error);
            throw error;
        }
    },

    // Update an existing debt (e.g., making a payment)
    updateDebt: async (groupId, debtId, updates) => {
        try {
            const debtRef = doc(db, `groups/${groupId}/debts`, debtId);
            await updateDoc(debtRef, {
                ...updates,
                ...(updates.currentBalance !== undefined && { currentBalance: Number(updates.currentBalance) }),
                ...(updates.interestRate !== undefined && { interestRate: Number(updates.interestRate) }),
                ...(updates.minimumPayment !== undefined && { minimumPayment: Number(updates.minimumPayment) })
            });
        } catch (error) {
            console.error("Error updating debt:", error);
            throw error;
        }
    },

    // Delete a debt
    deleteDebt: async (groupId, debtId) => {
        try {
            const debtRef = doc(db, `groups/${groupId}/debts`, debtId);
            await deleteDoc(debtRef);
        } catch (error) {
            console.error("Error deleting debt:", error);
            throw error;
        }
    },

    // Subscribe to real-time debt updates
    subscribeToDebts: (groupId, callback) => {
        const q = query(
            collection(db, `groups/${groupId}/debts`),
            orderBy('currentBalance', 'desc') // Default: highest debt first
        );

        return onSnapshot(q, (snapshot) => {
            const debts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : null
            }));
            callback(debts);
        });
    }
};
