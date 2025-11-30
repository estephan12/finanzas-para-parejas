import React, { createContext, useContext, useState, useCallback } from 'react';

const ErrorContext = createContext();

export function useError() {
    return useContext(ErrorContext);
}

export function ErrorProvider({ children }) {
    const [error, setError] = useState(null);

    const showError = useCallback((message) => {
        setError(message);
        setTimeout(() => {
            setError(null);
        }, 5000); // Hide after 5 seconds
    }, []);

    const value = {
        error,
        showError
    };

    return (
        <ErrorContext.Provider value={value}>
            {children}
        </ErrorContext.Provider>
    );
}
