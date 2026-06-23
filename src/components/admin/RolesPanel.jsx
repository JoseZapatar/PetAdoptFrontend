import { useState } from "react";

export default function RolesPanel({ roles, isSaving, onCreate, onUpdate, onDelete }) {
  const [name, setName] = useState("");
  const [editingRole, setEditingRole] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanName = name.trim();
    if (!cleanName) return;

    if (editingRole) {
      onUpdate(editingRole.id, cleanName, () => {
        setEditingRole(null);
        setName("");
      });
      return;
    }

    onCreate(cleanName, () => setName(""));
  };

  const startEdit = (role) => {
    setEditingRole(role);
    setName(role.name);
  };

  const cancelEdit = () => {
    setEditingRole(null);
    setName("");
  };

  return (
    <section className="rounded-3xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold text-gray-900">Roles</h2>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
          placeholder="Nombre del rol"
          required
        />
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
        >
          {editingRole ? "Actualizar" : "Crear"}
        </button>
        {editingRole && (
          <button
            type="button"
            onClick={cancelEdit}
            className="rounded-xl bg-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-300"
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="mt-6 space-y-3">
        {roles.map((role) => (
          <div
            key={role.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 p-4"
          >
            <div>
              <p className="font-semibold text-gray-900">{role.name}</p>
              <p className="text-xs text-gray-500">ID: {role.id}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(role)}
                className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete(role)}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
