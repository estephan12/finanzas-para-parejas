import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import { useTheme } from '../contexts/ThemeContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { Link } from 'react-router-dom';

export default function Settings() {
    const { currentUser, logout } = useAuth();
    const { currentGroup, leaveGroup } = useGroup();
    const { darkMode, toggleDarkMode } = useTheme();
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');
    const [currency, setCurrency] = useState('DOP');
    const [savingCurrency, setSavingCurrency] = useState(false);

    // Fetch member details
    useEffect(() => {
        async function fetchMembers() {
            if (!currentGroup?.members) return;

            setLoadingMembers(true);
            try {
                const memberPromises = currentGroup.members.map(uid =>
                    getDoc(doc(db, 'users', uid))
                );

                const memberDocs = await Promise.all(memberPromises);
                const memberData = memberDocs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setMembers(memberData);
            } catch (error) {
                console.error("Error fetching members:", error);
            } finally {
                setLoadingMembers(false);
            }
        }

        fetchMembers();
    }, [currentGroup]);

    // Fetch current user profile name
    useEffect(() => {
        async function fetchProfile() {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists() && userDoc.data().displayName) {
                    setDisplayName(userDoc.data().displayName);
                }
            }
        }
        fetchProfile();
    }, [currentUser]);

    // Fetch group currency
    useEffect(() => {
        if (currentGroup?.currency) {
            setCurrency(currentGroup.currency);
        }
    }, [currentGroup]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            await updateDoc(doc(db, 'users', currentUser.uid), {
                displayName: displayName
            });
            alert('Perfil actualizado correctamente');
        } catch (error) {
            console.error("Error updating profile:", error);
            alert('Error al actualizar perfil');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleUpdateCurrency = async (e) => {
        e.preventDefault();
        setSavingCurrency(true);
        try {
            await updateDoc(doc(db, 'groups', currentGroup.id), {
                currency: currency
            });
            alert('Moneda actualizada correctamente');
        } catch (error) {
            console.error("Error updating currency:", error);
            alert('Error al actualizar moneda');
        } finally {
            setSavingCurrency(false);
        }
    };

    const copyInviteCode = () => {
        if (currentGroup?.inviteCode) {
            navigator.clipboard.writeText(currentGroup.inviteCode);
            setCopySuccess('¡Copiado!');
            setTimeout(() => setCopySuccess(''), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                            <h1 className="text-xl font-bold text-gray-900">Configuración</h1>
                        </div>
                        <div className="flex items-center">
                            <button onClick={logout} className="text-sm text-red-600 font-medium hover:text-red-800">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

                {/* Profile Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Mi Perfil</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <input
                                type="email"
                                value={currentUser?.email || ''}
                                disabled
                                className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre para mostrar</label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Ej. Juan Pérez"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm input-field"
                                />
                                <button
                                    type="submit"
                                    disabled={savingProfile}
                                    className="mt-1 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
                                >
                                    {savingProfile ? '...' : 'Guardar'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Currency Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Moneda del Grupo</h2>
                    <form onSubmit={handleUpdateCurrency} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                            <div className="flex space-x-2">
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500 sm:text-sm input-field"
                                >
                                    <option value="DOP">Peso Dominicano (DOP)</option>
                                    <option value="USD">Dólar Estadounidense (USD)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                    <option value="MXN">Peso Mexicano (MXN)</option>
                                    <option value="COP">Peso Colombiano (COP)</option>
                                </select>
                                <button
                                    type="submit"
                                    disabled={savingCurrency}
                                    className="mt-1 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
                                >
                                    {savingCurrency ? '...' : 'Guardar'}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Esta moneda se aplicará a todo el grupo.</p>
                        </div>
                    </form>
                </div>

                {/* Dark Mode Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Apariencia</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Modo Oscuro</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Cambia entre tema claro y oscuro</p>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${darkMode ? 'bg-teal-600' : 'bg-gray-200'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Group Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Mi Grupo Familiar</h2>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Código de Invitación</label>
                        <div className="flex items-center space-x-2">
                            <div className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-lg tracking-wider text-gray-800 border border-gray-200">
                                {currentGroup?.inviteCode || '...'}
                            </div>
                            <button
                                onClick={copyInviteCode}
                                className="text-teal-600 hover:text-teal-800 font-medium text-sm"
                            >
                                {copySuccess || 'Copiar'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Comparte este código con tu pareja para que se una a este grupo.</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Miembros del Grupo</h3>
                        {loadingMembers ? (
                            <p className="text-sm text-gray-500">Cargando miembros...</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {members.map(member => (
                                    <li key={member.id} className="py-3 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold">
                                                {(member.displayName || member.email || '?')[0].toUpperCase()}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {member.displayName || 'Usuario sin nombre'}
                                                    {member.id === currentUser?.uid && <span className="text-gray-400 text-xs ml-2">(Tú)</span>}
                                                </p>
                                                <p className="text-xs text-gray-500">{member.email}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <button
                            onClick={async () => {
                                if (window.confirm('¿Estás seguro de que quieres salir del grupo? Tendrás que unirte de nuevo o crear uno nuevo.')) {
                                    try {
                                        await leaveGroup();
                                        window.location.href = '/group-setup';
                                    } catch (error) {
                                        console.error("Error leaving group", error);
                                        alert("Error al salir del grupo");
                                    }
                                }
                            }}
                            className="text-red-600 text-sm font-medium hover:text-red-800 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Salir del Grupo
                        </button>
                    </div>
                </div>

                {/* App Info */}
                <div className="text-center text-xs text-gray-400 pt-4">
                    <p>FinanzasParaParejas MVP v1.0.0</p>
                </div>

            </div>
        </div>
    );
}
