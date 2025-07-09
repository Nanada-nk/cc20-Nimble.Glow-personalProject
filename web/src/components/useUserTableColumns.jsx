import { PencilIcon, UserX2Icon } from 'lucide-react';


function useUserTableColumns({ currentUserRole, onEditUser, onDisableUser }) {
  
  const baseColumns = [
    { name: 'ID', selector: row => row.id, sortable: true, width: '80px' },
    { name: 'Username', selector: row => row.firstName, sortable: true },
    { name: 'Lastname', selector: row => row.lastName, sortable: true },
    { name: 'E-mail', selector: row => row.email, sortable: true},
    { name: 'Phone Number', selector: row => row.mobile },
    { name: 'Role', selector: row => row.role, sortable: true },
    {
      name: 'Status',
      sortable: true,
      selector: row => row.enabled,
      cell: row => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.enabled ? 'Active' : 'Disabled'}
        </span>
      ),
    },
  ];

  const actionColumn = {
    name: 'Action',
    cell: row => (
      <div className="flex items-center space-x-2">

        <button onClick={() => onEditUser(row)} className='text-blue-600 hover:text-blue-900' title='Edit User'>
          <PencilIcon size={20} />
        </button>
        <button onClick={() => onDisableUser(row)} className={`text-red-600 hover:text-red-900 ${!row.enabled && 'cursor-not-allowed'}`} title='Disable User' disabled={!row.enabled}>
          <UserX2Icon size={20} className={!row.enabled && 'text-gray-400'} />
        </button>
      </div>
    )
  };


  const columns = [
    ...baseColumns,
    ...(currentUserRole === 'SUPERADMIN' ? [actionColumn] : [])
  ];


  return columns
}
export default useUserTableColumns