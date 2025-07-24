import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../api/adminService';
import { useAuth } from '../../contexts/AuthContext'; // Corrected import to use useAuth hook

interface User {
  user_id: string;
  username: string;
  share_link_id: string;
  profile_picture_url: string;
  custom_name: string;
  is_admin: boolean;
}

const AdminDashboardPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { token } = useAuth(); // Using useAuth hook to get token

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError('Authentication token not found. Please log in as admin.');
        setLoading(false);
        navigate('/admin/login');
        return;
      }
      try {
        const fetchedUsers = await adminService.getAllUsers(token);
        setUsers(fetchedUsers);
      } catch (err: any) {
        setError(err || 'Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, navigate]);

  if (loading) {
    return <div className="text-center mt-8">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h2>
        <h3 className="text-xl font-semibold mb-4">All Users</h3>
        {users.length === 0 ? (
          <p className="text-center">No users found.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user.user_id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-md shadow-sm cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => navigate(`/admin/users/${user.user_id}/messages`)}
              >
                <div className="flex items-center space-x-4">
                  {user.profile_picture_url && (
                    <img
                      src={user.profile_picture_url}
                      alt={`${user.username}'s profile`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-lg">{user.custom_name || user.username}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                    <p className="text-xs text-gray-400">ID: {user.user_id}</p>
                    <p className="text-xs text-gray-400">Share Link ID: {user.share_link_id}</p>
                  </div>
                </div>
                {user.is_admin && (
                  <span className="bg-blue-200 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Admin</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage; 