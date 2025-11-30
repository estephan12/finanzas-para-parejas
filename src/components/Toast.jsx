import React from 'react';
import { useError } from '../contexts/ErrorContext';

export default function Toast() {
    const { error } = useError();

    if (!error) {
        return null;
    }

    return (
        <div className="fixed bottom-5 right-5 bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg">
            {error}
        </div>
    );
}
