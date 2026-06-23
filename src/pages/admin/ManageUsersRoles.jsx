import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../../components/layout/Navbar";
import UserForm from "../../components/admin/UserForm";
import UsersTable from "../../components/admin/UsersTable";
import RolesPanel from "../../components/admin/RolesPanel";
import { usersApi } from "../../api/usersApi";
import { rolesApi } from "../../api/rolesApi";

const emptyUserForm = {
  name: "",
  email: "",
  password: "",
  roleId: "",
};

function getErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.title) return data.title;

  return fallback;
}

function ConfirmModal({ open, title, message, confirmText = "Confirmar", onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="mt-3 text-gray-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordModal({ open, user, password, onChange, onSubmit, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-gray-900">Cambiar contraseña</h2>
        <p className="mt-2 text-gray-600">
          Nueva contraseña para <span className="font-semibold">{user?.name}</span>
        </p>

        <input
          type="password"
          value={password}
          onChange={(event) => onChange(event.target.value)}
          className="mt-5 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
          placeholder="Nueva contraseña"
          autoFocus
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded-xl bg-purple-600 px-4 py-2 font-semibold text-white hover:bg-purple-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ManageUsersRoles() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [roleId, setRoleId] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState(emptyUserForm);

  const [confirmModal, setConfirmModal] = useState(null);
  const [passwordUser, setPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const usersParams = useMemo(() => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (roleId) params.roleId = roleId;
    return params;
  }, [search, roleId]);

  const rolesQuery = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const res = await rolesApi.getAll();
      return res.data;
    },
  });

  const usersQuery = useQuery({
    queryKey: ["admin-users", usersParams],
    queryFn: async () => {
      const res = await usersApi.getAll(usersParams);
      return res.data;
    },
  });

  const refreshUsers = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-users"] });
  };

  const refreshRoles = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
  };

  const saveUserMutation = useMutation({
    mutationFn: (payload) => {
      if (editingUser) {
        return usersApi.update(editingUser.id, {
          name: payload.name,
          email: payload.email,
          roleId: Number(payload.roleId),
        });
      }

      return usersApi.create({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        roleId: Number(payload.roleId),
      });
    },
    onSuccess: () => {
      toast.success(editingUser ? "Usuario actualizado correctamente." : "Usuario creado correctamente.");
      setEditingUser(null);
      setUserForm(emptyUserForm);
      refreshUsers();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error guardando usuario."));
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => usersApi.delete(id),
    onSuccess: () => {
      toast.success("Usuario eliminado correctamente.");
      refreshUsers();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error eliminando usuario."));
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ id, newPassword }) => usersApi.changePassword(id, { newPassword }),
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente.");
      setPasswordUser(null);
      setNewPassword("");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error actualizando contraseña."));
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: (name) => rolesApi.create({ name }),
    onSuccess: () => {
      toast.success("Rol creado correctamente.");
      refreshRoles();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error creando rol."));
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, name }) => rolesApi.update(id, { name }),
    onSuccess: () => {
      toast.success("Rol actualizado correctamente.");
      refreshRoles();
      refreshUsers();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error actualizando rol."));
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id) => rolesApi.delete(id),
    onSuccess: () => {
      toast.success("Rol eliminado correctamente.");
      refreshRoles();
      refreshUsers();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error eliminando rol."));
    },
  });

  const handleUserFormChange = (event) => {
    const { name, value } = event.target;
    setUserForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmitUser = (event) => {
    event.preventDefault();
    saveUserMutation.mutate(userForm);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      password: "",
      roleId: String(user.roleId),
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setUserForm(emptyUserForm);
  };

  const handleDeleteUser = (user) => {
    setConfirmModal({
      title: "Eliminar usuario",
      message: `¿Seguro que querés eliminar al usuario ${user.name}?`,
      confirmText: "Eliminar",
      onConfirm: () => {
        deleteUserMutation.mutate(user.id);
        setConfirmModal(null);
      },
    });
  };

  const handleChangePassword = (user) => {
    setPasswordUser(user);
    setNewPassword("");
  };

  const handleSubmitPassword = (event) => {
    event.preventDefault();

    if (newPassword.length < 6) {
      toast.error("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    changePasswordMutation.mutate({
      id: passwordUser.id,
      newPassword,
    });
  };

  const handleCreateRole = (name, resetForm) => {
    createRoleMutation.mutate(name, {
      onSuccess: () => resetForm?.(),
    });
  };

  const handleUpdateRole = (id, name, resetForm) => {
    updateRoleMutation.mutate(
      { id, name },
      {
        onSuccess: () => resetForm?.(),
      }
    );
  };

  const handleDeleteRole = (role) => {
    setConfirmModal({
      title: "Eliminar rol",
      message: `¿Seguro que querés eliminar el rol ${role.name}?`,
      confirmText: "Eliminar",
      onConfirm: () => {
        deleteRoleMutation.mutate(role.id);
        setConfirmModal(null);
      },
    });
  };

  const roles = rolesQuery.data ?? [];
  const users = usersQuery.data ?? [];
  const isLoading = rolesQuery.isLoading || usersQuery.isLoading;
  const hasError = rolesQuery.error || usersQuery.error;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <ToastContainer position="top-right" autoClose={2500} />

      <ConfirmModal
        open={!!confirmModal}
        title={confirmModal?.title}
        message={confirmModal?.message}
        confirmText={confirmModal?.confirmText}
        onConfirm={confirmModal?.onConfirm}
        onCancel={() => setConfirmModal(null)}
      />

      <PasswordModal
        open={!!passwordUser}
        user={passwordUser}
        password={newPassword}
        onChange={setNewPassword}
        onSubmit={handleSubmitPassword}
        onCancel={() => {
          setPasswordUser(null);
          setNewPassword("");
        }}
      />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-purple-600">Panel administrador</p>
            <h1 className="text-4xl font-bold text-gray-900">Usuarios y roles</h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Gestiona usuarios, asigna roles y crea nuevos roles para el sistema.
            </p>
          </div>
        </div>

        {hasError && (
          <div className="mt-6 rounded-2xl bg-red-100 p-4 font-semibold text-red-700">
            Error cargando usuarios o roles. Revisa que tu usuario tenga permisos de Admin.
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="space-y-8">
            <UserForm
              form={userForm}
              roles={roles}
              isEditing={!!editingUser}
              isSaving={saveUserMutation.isPending}
              onChange={handleUserFormChange}
              onSubmit={handleSubmitUser}
              onCancel={handleCancelEdit}
            />

            <div className="rounded-3xl bg-white p-6 shadow">
              <h2 className="text-xl font-bold text-gray-900">Filtros</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                  placeholder="Buscar por nombre o correo"
                />

                <select
                  value={roleId}
                  onChange={(event) => setRoleId(event.target.value)}
                  className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                >
                  <option value="">Todos los roles</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isLoading ? (
              <p className="rounded-3xl bg-white p-6 shadow">Cargando usuarios...</p>
            ) : (
              <UsersTable
                users={users}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onChangePassword={handleChangePassword}
              />
            )}
          </section>

          <RolesPanel
            roles={roles}
            isSaving={
              createRoleMutation.isPending ||
              updateRoleMutation.isPending ||
              deleteRoleMutation.isPending
            }
            onCreate={handleCreateRole}
            onUpdate={handleUpdateRole}
            onDelete={handleDeleteRole}
          />
        </div>
      </main>
    </div>
  );
}