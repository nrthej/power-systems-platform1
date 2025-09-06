import React from 'react';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { DataTable } from '@/components/ui/DataTable';

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  status: string;
  lastLogin: string;
  avatar: string;
}

interface UsersTableProps {
  users: User[];
  selectedUsers: number[];
  onUserSelect: (userId: number) => void;
  onSelectAll: (selected: boolean) => void;
}

export function UsersTable({ users, selectedUsers, onUserSelect, onSelectAll }: UsersTableProps) {
  const columns = [
    { key: 'user', label: 'User' },
    { key: 'email', label: 'Email' },
    { key: 'roles', label: 'Roles' },
    { key: 'status', label: 'Status' },
    { key: 'lastLogin', label: 'Last Login' },
    { key: 'actions', label: 'Actions' }
  ];

  const renderRow = (user: User) => (
    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
      <td className="p-4">
        <input
          type="checkbox"
          checked={selectedUsers.includes(user.id)}
          onChange={() => onUserSelect(user.id)}
          className="rounded border-slate-300"
        />
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-semibold">{user.avatar}</span>
          </div>
          <p className="text-sm font-medium text-slate-900">{user.name}</p>
        </div>
      </td>
      <td className="p-4 text-sm text-slate-600">{user.email}</td>
      <td className="p-4">
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
            >
              {role}
            </span>
          ))}
        </div>
      </td>
      <td className="p-4">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            user.status === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {user.status}
        </span>
      </td>
      <td className="p-4 text-sm text-slate-600">{user.lastLogin}</td>
      <td className="p-4">
        <div className="flex items-center space-x-1">
          <button className="p-1 text-slate-400 hover:text-blue-600 transition-colors rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded">
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors rounded">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <DataTable
      columns={columns}
      data={users}
      renderRow={renderRow}
      selectedItems={selectedUsers}
      onSelectAll={onSelectAll}
    />
  );
}