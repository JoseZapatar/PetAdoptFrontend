export default function UserForm({
  form,
  roles,
  isEditing,
  isSaving,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit} className="rounded-3xl bg-white p-6 shadow">
      <h2 className="text-xl font-bold text-gray-900">
        {isEditing ? "Editar usuario" : "Crear usuario"}
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Nombre</span>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
            placeholder="Nombre del usuario"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Correo</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
            placeholder="correo@ejemplo.com"
            required
          />
        </label>

        {!isEditing && (
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Contraseña</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </label>
        )}

        <label className="block">
          <span className="text-sm font-semibold text-gray-700">Rol</span>
          <select
            name="roleId"
            value={form.roleId}
            onChange={onChange}
            className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
            required
          >
            <option value="">Seleccionar rol</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
        >
          {isSaving ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear usuario"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-300"
          >
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
}
