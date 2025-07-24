import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
// authService is not needed directly in DashboardPage if user data comes from context
// import authService from '../api/authService'; 

const DashboardPage = () => {
    const { user, logout, loading } = useAuth(); // Also get loading state from AuthContext
    console.log('DashboardPage - User from AuthContext:', user); // ADDED LOG
    const [shareLink, setShareLink] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    useEffect(() => {
        // Derive shareLink directly from the user object provided by AuthContext
        if (user && user.share_link_id) { // Corrected to share_link_id
            setShareLink(`${window.location.origin}/send/${user.share_link_id}`); // Corrected to share_link_id
        } else {
            setShareLink(''); // Clear shareLink if user logs out or share_link_id is missing
            console.log('DashboardPage - User or share link not available from context.', user); 
        }
    }, [user]); // Re-run when the user object from context changes

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareLink).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            setCopySuccess('Failed to copy.');
        });
    };

    if (loading) {
        return <p>Loading user data...</p>; 
    }

    if (!user) {
        // This case should ideally lead to a redirect by a protected route component
        // but for now, we can show a message or redirect manually if not authenticated.
        return <p>Please log in to view your dashboard.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Welcome, {user.username}!</h2>
                <p className="text-gray-600 mb-6">This is your dashboard.</p>

                {shareLink && (
                    <div className="mb-6">
                        <p className="text-lg font-medium text-gray-700">Your Share Link:</p>
                        <div className="flex items-center justify-center space-x-2 mt-2">
                            <input
                                type="text"
                                readOnly
                                value={shareLink}
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={(e) => (e.target as HTMLInputElement).select()} // Cast e.target to HTMLInputElement
                            />
                            <button
                                onClick={handleCopyLink}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                {copySuccess || 'Copy'}
                            </button>
                        </div>
                        {copySuccess && <p className="text-sm text-green-500 mt-2">{copySuccess}</p>}
                    </div>
                )}

                <button
                    onClick={logout}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default DashboardPage; 