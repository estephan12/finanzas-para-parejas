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

// Goal Data Model
// {
//   name: string,
//   targetAmount: number,
//   currentAmount: number,
//   deadline: date,
//   icon: string,
//   color: string,
//   createdAt: timestamp
// }

export const GoalService = {
    // Add a new goal
    addGoal: async (groupId, goalData) => {
        try {
            const docRef = await addDoc(collection(db, `groups/${groupId}/goals`), {
                ...goalData,
                targetAmount: Number(goalData.targetAmount),
                currentAmount: Number(goalData.currentAmount || 0),
                deadline: new Date(goalData.deadline),
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding goal:", error);
            throw error;
        }
    },

    // Update an existing goal (e.g., adding money to it)
    updateGoal: async (groupId, goalId, updates) => {
        try {
            const goalRef = doc(db, `groups/${groupId}/goals`, goalId);
            await updateDoc(goalRef, {
                ...updates,
                ...(updates.targetAmount && { targetAmount: Number(updates.targetAmount) }),
                ...(updates.currentAmount !== undefined && { currentAmount: Number(updates.currentAmount) }),
                ...(updates.deadline && { deadline: new Date(updates.deadline) })
            });
        } catch (error) {
            console.error("Error updating goal:", error);
            throw error;
        }
    },

    // Delete a goal
    deleteGoal: async (groupId, goalId) => {
        try {
            const goalRef = doc(db, `groups/${groupId}/goals`, goalId);
            await deleteDoc(goalRef);
        } catch (error) {
            console.error("Error deleting goal:", error);
            throw error;
        }
    },

    // Subscribe to real-time goal updates
    subscribeToGoals: (groupId, callback) => {
        const q = query(
            collection(db, `groups/${groupId}/goals`),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const goals = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                deadline: doc.data().deadline?.toDate ? doc.data().deadline.toDate() : new Date(doc.data().deadline),
                createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : null
            }));
            callback(goals);
        });
    }
};
