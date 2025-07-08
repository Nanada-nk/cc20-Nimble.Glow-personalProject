import { PencilIcon, UserX2Icon } from 'lucide-react';


const USER_TABLE_COLUMNS = [
  { key: 'id', label: 'ID', },
  { key: 'firstName', label: 'Username' },
  { key: 'lastName', label: 'Lastname' },
  { key: 'email', label: 'E-mail' },
  { key: 'mobile', label: 'Phone number' },
  { key: 'role', label: 'Role' },
  {
    key: 'enabled',
    label: 'Status',
    render: (user) => (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
        {user.enabled ? 'Active' : 'Disabled'}
      </span>
    )
  },
  {
    key: 'action',
    label: 'Action',
    render: (user, onDisableUser, onEditUser, currentUserRole) => (

      <div className="flex items-center space-x-2">
        {currentUserRole === "SUPERADMIN" && (
          <button 
          onClick={()=> onEditUser(user)}
          className='text-blue-600 hover:text-blue-900'
          title='Edit User'
          >
            <PencilIcon size={20} />
          </button>
        )}
        <button
          onClick={() => onDisableUser(user.id)}
          className={`text-red-600 hover:text-red-900 ${user.enabled ? '' : 'text-gray-400 cursor-not-allowed'}`}
          title={user.enabled ? 'Disable User' : 'User is Disabled'}
          disabled={!user.enabled}
        >
          <UserX2Icon size={20} />
        </button>
      </div>

    )
  },
];


function UserTable({ users, onDisableUser, onEditUser, currentUserRole }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>

            {USER_TABLE_COLUMNS.map(column => (
              <th key={column.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan={USER_TABLE_COLUMNS.length} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>

                {USER_TABLE_COLUMNS.map(column => (
                  <td key={`${user.id}-${column.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">

                    {column.render 
                    ? column.render(user, onDisableUser, onEditUser, currentUserRole) 
                    : user[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;