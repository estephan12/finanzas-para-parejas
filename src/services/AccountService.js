import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase.config';

// Account Data Model
// {
//   name: string,
//   type: 'savings' | 'checking' | 'credit_card' | 'cash',
//   balance: number,
//   color: string,
//   icon: string,
//   createdAt: timestamp
// }

export const ACCOUNT_TYPES = {
    savings: 'Ahorro',
    checking: 'Corriente',
    credit_card: 'Tarjeta de Crédito',
    cash: 'Efectivo'
};

export const ACCOUNT_COLORS = [
    '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B',
    '#EF4444', '#EC4899', '#14B8A6', '#6366F1'
];

export const AccountService = {
    // Add a new account
    addAccount: async (groupId, accountData) => {
        try {
            const docRef = await addDoc(collection(db, `groups/${groupId}/accounts`), {
                ...accountData,
                balance: Number(accountData.balance) || 0,
                createdAt: serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding account:", error);
            throw error;
        }
    },

    // Update an existing account
    updateAccount: async (groupId, accountId, updates) => {
        try {
            const accountRef = doc(db, `groups/${groupId}/accounts`, accountId);
            await updateDoc(accountRef, {
                ...updates,
                ...(updates.balance !== undefined && { balance: Number(updates.balance) })
            });
        } catch (error) {
            console.error("Error updating account:", error);
            throw error;
        }
    },

    // Delete an account
    deleteAccount: async (groupId, accountId) => {
        try {
            const accountRef = doc(db, `groups/${groupId}/accounts`, accountId);
            await deleteDoc(accountRef);
        } catch (error) {
            console.error("Error deleting account:", error);
            throw error;
        }
    },

    // Subscribe to real-time account updates
    subscribeToAccounts: (groupId, callback) => {
        const q = query(
            collection(db, `groups/${groupId}/accounts`),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const accounts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : null
            }));
            callback(accounts);
        });
    },

    // Update account balance (for transaction integration)
    updateBalance: async (groupId, accountId, amount, isIncome) => {
        try {
            const accountRef = doc(db, `groups/${groupId}/accounts`, accountId);
            const increment = isIncome ? Number(amount) : -Number(amount);

            // We'll need to get current balance first, then update
            // This is a simplified version - in production, use Firestore transactions
            const accountDoc = await getDoc(accountRef);
            if (accountDoc.exists()) {
                const currentBalance = accountDoc.data().balance || 0;
                await updateDoc(accountRef, {
                    balance: currentBalance + increment
                });
            }
        } catch (error) {
            console.error("Error updating account balance:", error);
            throw error;
        }
    }
};
