export default function UsersTable({ users, onEdit, onDelete, onChangePassword }) {
  return (
    <div className="overflow-x-auto rounded-3xl bg-white shadow">
      <table className="w-full text-left">
        <thead className="bg-gray-100 text-sm text-gray-600">
          <tr>
            <th className="p-4">Usuario</th>
            <th className="p-4">Correo</th>
            <th className="p-4">Rol</th>
            <th className="p-4">Perfil adoptante</th>
            <th className="p-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-4 font-semibold text-gray-900">{user.name}</td>
              <td className="p-4 text-gray-700">{user.email}</td>
              <td className="p-4">
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                  {user.roleName}
                </span>
              </td>
              <td className="p-4 text-gray-700">
                {user.hasAdopterProfile ? "Sí" : "No"}
              </td>
              <td className="flex flex-wrap gap-2 p-4">
                <button
                  onClick={() => onEdit(user)}
                  className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => onChangePassword(user)}
                  className="rounded-xl bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Password
                </button>
                <button
                  onClick={() => onDelete(user)}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="p-6 text-center text-gray-500">
                No hay usuarios para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
