import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    collection,
    addDoc,
    setDoc,
    doc,
    getDoc,
    query,
    where,
    getDocs,
    updateDoc,
    arrayUnion,
    serverTimestamp,
    deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { useAuth } from './AuthContext';
import { useError } from './ErrorContext';

const GroupContext = createContext();

export function useGroup() {
    return useContext(GroupContext);
}

export function GroupProvider({ children }) {
    const { currentUser } = useAuth();
    const { showError } = useError();
    const [currentGroup, setCurrentGroup] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user's group on load
    useEffect(() => {
        async function fetchUserGroup() {
            if (!currentUser) {
                setLoading(false);
                return;
            }

            try {
                // Check if user has a group in their profile
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists() && userDoc.data().groupId) {
                    const groupId = userDoc.data().groupId;
                    const groupDocRef = doc(db, 'groups', groupId);
                    const groupDoc = await getDoc(groupDocRef);

                    if (groupDoc.exists()) {
                        setCurrentGroup({ id: groupDoc.id, ...groupDoc.data() });
                    }
                }
            } catch (err) {
                console.error("Error fetching group:", err);
                showError("Error al cargar la información del grupo.");
            } finally {
                setLoading(false);
            }
        }

        fetchUserGroup();
    }, [currentUser]);

    // Create a new group
    async function createGroup(groupName) {
        if (!currentUser) throw new Error("No usuario autenticado");

        const groupData = {
            name: groupName,
            members: [currentUser.uid],
            createdBy: currentUser.uid,
            createdAt: serverTimestamp(),
            inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
            currency: 'DOP'
        };

        try {
            // 1. Create group document
            const groupRef = await addDoc(collection(db, 'groups'), groupData);

            // 2. Update user profile with groupId
            await setDoc(doc(db, 'users', currentUser.uid), {
                email: currentUser.email,
                groupId: groupRef.id,
                joinedAt: serverTimestamp()
            }, { merge: true });

            setCurrentGroup({ id: groupRef.id, ...groupData });
            return groupRef.id;
        } catch (err) {
            console.error("Error creating group:", err);
            throw err;
        }
    }

    // Join an existing group
    async function joinGroup(inviteCode) {
        if (!currentUser) throw new Error("No usuario autenticado");

        try {
            // 1. Find group by invite code
            const q = query(collection(db, 'groups'), where('inviteCode', '==', inviteCode.toUpperCase()));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                throw new Error("Código de invitación inválido");
            }

            const groupDoc = querySnapshot.docs[0];
            const groupId = groupDoc.id;

            // 2. Add user to group members
            await updateDoc(doc(db, 'groups', groupId), {
                members: arrayUnion(currentUser.uid)
            });

            // 3. Update user profile
            await setDoc(doc(db, 'users', currentUser.uid), {
                email: currentUser.email,
                groupId: groupId,
                joinedAt: serverTimestamp()
            }, { merge: true });

            setCurrentGroup({ id: groupId, ...groupDoc.data() });
            return groupId;
        } catch (err) {
            console.error("Error joining group:", err);
            throw err;
        }
    }

    // Leave current group
    async function leaveGroup() {
        if (!currentUser || !currentGroup) return;

        if (currentGroup.members.length === 1) {
            throw new Error("You are the last member. Please delete the group instead.");
        }

        try {
            const groupId = currentGroup.id;

            // 1. Remove user from group members
            await updateDoc(doc(db, 'groups', groupId), {
                members: currentGroup.members.filter(id => id !== currentUser.uid)
            });

            // 2. Remove groupId from user profile
            await updateDoc(doc(db, 'users', currentUser.uid), {
                groupId: null
            });

            setCurrentGroup(null);
        } catch (err) {
            console.error("Error leaving group:", err);
            throw err;
        }
    }

    // Delete current group
    async function deleteGroup() {
        if (!currentUser || !currentGroup) return;

        if (currentGroup.createdBy !== currentUser.uid) {
            throw new Error("Only the group creator can delete the group.");
        }

        try {
            const groupId = currentGroup.id;

            // 1. Delete the group document
            await deleteDoc(doc(db, 'groups', groupId));

            // 2. Update user profile
            await updateDoc(doc(db, 'users', currentUser.uid), {
                groupId: null
            });

            setCurrentGroup(null);
        } catch (err) {
            console.error("Error deleting group:", err);
            throw err;
        }
    }

    const value = {
        currentGroup,
        createGroup,
        joinGroup,
        leaveGroup,
        deleteGroup,
        loading
    };

    return (
        <GroupContext.Provider value={value}>
            {!loading && children}
        </GroupContext.Provider>
    );
}
