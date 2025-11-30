import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';

export default function PrivateRoute({ children, requireGroup = true }) {
    const { currentUser } = useAuth();
    const { currentGroup, loading } = useGroup();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    // If the route requires a group (default) and the user doesn't have one, redirect to setup
    if (requireGroup && !currentGroup) {
        return <Navigate to="/group-setup" />;
    }

    // If the user is already in a group and tries to access group-setup, redirect to dashboard
    if (!requireGroup && currentGroup) {
        return <Navigate to="/dashboard" />;
    }

    return children;
}
