import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroup } from '../contexts/GroupContext';
import { useAuth } from '../contexts/AuthContext';

export default function GroupSetup() {
    const [isJoining, setIsJoining] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { createGroup, joinGroup } = useGroup();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    async function handleCreate(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await createGroup(groupName);
            navigate('/dashboard');
        } catch (err) {
            setError('Error al crear grupo: ' + err.message);
        }
        setLoading(false);
    }

    async function handleJoin(e) {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await joinGroup(inviteCode);
            navigate('/dashboard');
        } catch (err) {
            setError('Error al unirse al grupo: ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Bienvenido, {currentUser?.displayName || 'Usuario'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Para comenzar, necesitas ser parte de un grupo financiero.
                    </p>
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}

                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        onClick={() => setIsJoining(false)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${!isJoining ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Crear Nuevo
                    </button>
                    <button
                        onClick={() => setIsJoining(true)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${isJoining ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Unirse a Existente
                    </button>
                </div>

                {!isJoining ? (
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div>
                            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
                                Nombre del Grupo (ej. Familia Pérez)
                            </label>
                            <input
                                id="groupName"
                                type="text"
                                required
                                className="input-field mt-1"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                placeholder="Ingresa un nombre para tu grupo"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex justify-center"
                        >
                            {loading ? 'Creando...' : 'Crear Grupo'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleJoin} className="space-y-6">
                        <div>
                            <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700">
                                Código de Invitación
                            </label>
                            <input
                                id="inviteCode"
                                type="text"
                                required
                                className="input-field mt-1 uppercase"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                placeholder="Ingresa el código de 6 caracteres"
                                maxLength={6}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-secondary flex justify-center"
                        >
                            {loading ? 'Uniéndose...' : 'Unirse al Grupo'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
