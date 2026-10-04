import React, { useState, useEffect } from 'react';
import { initialUsers } from '../../data/demoData';
import { FiTrash2, FiPlus } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pathway_users');
      if (stored) {
        setUsers(JSON.parse(stored));
      } else {
        setUsers(initialUsers);
      }
    } catch {
      setUsers(initialUsers);
    }
  }, []);

  const saveUsers = (newUsers) => {
    setUsers(newUsers);
    localStorage.setItem('pathway_users', JSON.stringify(newUsers));
  };

  const handleAdd = () => {
    const newUser = {
      id: `usr-${Math.random().toString(36).substring(2, 9)}`,
      name: `New User ${Math.floor(Math.random() * 1000)}`,
      email: `user${Math.floor(Math.random() * 1000)}@pathway.demo`,
      password: 'password123',
      role: 'patient',
      city: 'Harare',
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
  };

  const handleRemove = (id) => {
    saveUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-green-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-950 transition-colors"
        >
          <FiPlus size={16} /> Add User
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4 capitalize">{u.role}</td>
                  <td className="px-6 py-4">{u.city}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemove(u.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                      title="Remove User"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
