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

// Budget Data Model
// {
//   category: string,
//   limit: number,
//   period: string, // 'monthly' (default)
//   createdAt: timestamp
// }

export const BudgetService = {
    // Add a new budget
    addBudget: async (groupId, budgetData) => {
        try {
            const docRef = await addDoc(collection(db, `groups/${groupId}/budgets`), {
                ...budgetData,
                limit: Number(budgetData.limit),
                period: 'monthly',
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding budget:", error);
            throw error;
        }
    },

    // Update an existing budget
    updateBudget: async (groupId, budgetId, updates) => {
        try {
            const budgetRef = doc(db, `groups/${groupId}/budgets`, budgetId);
            await updateDoc(budgetRef, {
                ...updates,
                ...(updates.limit !== undefined && { limit: Number(updates.limit) })
            });
        } catch (error) {
            console.error("Error updating budget:", error);
            throw error;
        }
    },

    // Delete a budget
    deleteBudget: async (groupId, budgetId) => {
        try {
            const budgetRef = doc(db, `groups/${groupId}/budgets`, budgetId);
            await deleteDoc(budgetRef);
        } catch (error) {
            console.error("Error deleting budget:", error);
            throw error;
        }
    },

    // Subscribe to real-time budget updates
    subscribeToBudgets: (groupId, callback) => {
        const q = query(
            collection(db, `groups/${groupId}/budgets`),
            orderBy('category', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const budgets = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : null
            }));
            callback(budgets);
        });
    }
};
