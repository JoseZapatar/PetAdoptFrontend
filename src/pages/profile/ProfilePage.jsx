import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../../components/layout/Navbar";
import { accountApi } from "../../api/accountApi";
import { useAuthStore } from "../../store/authStore";

const emptyRoleForm = {
  accountType: "adoptar",
  phone: "",
  address: "",
  city: "",
  housingType: "casa",
  hasOtherPets: false,
};

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function getRoleName(user) {
  return user?.roleName?.toLowerCase();
}

function getAccountTypeFromRole(roleName) {
  const role = roleName?.toLowerCase();
  return role === "publicador" ? "dar" : "adoptar";
}

function getErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.title) return data.title;

  return fallback;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const loginStore = useAuthStore((state) => state.login);

  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [roleForm, setRoleForm] = useState(emptyRoleForm);

  const profileQuery = useQuery({
    queryKey: ["account-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const res = await accountApi.getProfile();
      return res.data;
    },
  });

  useEffect(() => {
    if (!profileQuery.data) return;

    const profileUser = profileQuery.data.user;
    const adopter = profileQuery.data.adopter;

    setProfileForm({
      name: profileUser.name ?? "",
      email: profileUser.email ?? "",
    });

    setRoleForm({
      accountType: getAccountTypeFromRole(profileUser.roleName),
      phone: adopter?.phone ?? "",
      address: adopter?.address ?? "",
      city: adopter?.city ?? "",
      housingType: adopter?.housingType ?? "casa",
      hasOtherPets: adopter?.hasOtherPets ?? false,
    });
  }, [profileQuery.data]);

  const updateProfileMutation = useMutation({
    mutationFn: accountApi.updateProfile,
    onSuccess: (res) => {
      loginStore({ token: res.data.token, user: res.data.user });
      toast.success("Datos actualizados correctamente.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error actualizando datos."));
    },
  });

  const passwordMutation = useMutation({
    mutationFn: accountApi.changePassword,
    onSuccess: () => {
      toast.success("Contraseña actualizada correctamente.");
      setPasswordForm(emptyPasswordForm);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error cambiando contraseña."));
    },
  });

  const roleMutation = useMutation({
    mutationFn: accountApi.switchRole,
    onSuccess: (res) => {
      loginStore({ token: res.data.token, user: res.data.user });
      toast.success("Tipo de cuenta actualizado correctamente.");

      if (roleForm.accountType === "dar") {
        navigate("/publisher/pets");
        return;
      }

      navigate("/pets");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error cambiando tipo de cuenta."));
    },
  });

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  };

  const handleRoleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setRoleForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    updateProfileMutation.mutate(profileForm);
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (passwordForm.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("La confirmación de contraseña no coincide.");
      return;
    }

    passwordMutation.mutate({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
  };

  const handleRoleSubmit = (event) => {
    event.preventDefault();
    roleMutation.mutate(roleForm);
  };

  if (!user) return null;

  const currentRole = getRoleName(profileQuery.data?.user ?? user);
  const isAdmin = currentRole === "admin" || currentRole === "administrador";
  const isAdopter = roleForm.accountType === "adoptar";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold text-purple-600">Mi cuenta</p>
          <h1 className="text-4xl font-bold text-gray-900">Perfil de usuario</h1>
          <p className="mt-2 text-gray-600">
            Actualiza tus datos, cambia tu contraseña o modifica tu tipo de cuenta.
          </p>
        </div>

        {profileQuery.isLoading ? (
          <div className="rounded-3xl bg-white p-8 shadow">Cargando perfil...</div>
        ) : (
          <div className="grid gap-8">
            <form onSubmit={handleProfileSubmit} className="rounded-3xl bg-white p-8 shadow">
              <h2 className="text-2xl font-bold text-gray-900">Datos personales</h2>
              <p className="mt-1 text-gray-500">
                Estos datos se usan para identificar tu cuenta dentro del sistema.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <input
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  placeholder="Nombre de usuario"
                  className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                  required
                />

                <input
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  placeholder="Correo electrónico"
                  className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
              >
                {updateProfileMutation.isPending ? "Guardando..." : "Guardar datos"}
              </button>
            </form>

            <form onSubmit={handlePasswordSubmit} className="rounded-3xl bg-white p-8 shadow">
              <h2 className="text-2xl font-bold text-gray-900">Cambiar contraseña</h2>
              <p className="mt-1 text-gray-500">
                Para seguridad, primero confirma tu contraseña actual.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <input
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Contraseña actual"
                  className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                  required
                />

                <input
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Nueva contraseña"
                  className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                  required
                  minLength={6}
                />

                <input
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirmar contraseña"
                  className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={passwordMutation.isPending}
                className="mt-6 rounded-xl bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-black disabled:opacity-60"
              >
                {passwordMutation.isPending ? "Actualizando..." : "Cambiar contraseña"}
              </button>
            </form>

            <form onSubmit={handleRoleSubmit} className="rounded-3xl bg-white p-8 shadow">
              <h2 className="text-2xl font-bold text-gray-900">Tipo de cuenta</h2>
              <p className="mt-1 text-gray-500">
                Puedes cambiar entre adoptante y publicador. Los administradores no pueden cambiar su rol desde aquí.
              </p>

              {isAdmin ? (
                <div className="mt-6 rounded-2xl bg-yellow-50 p-4 font-semibold text-yellow-800">
                  Tu cuenta es administradora. Este rol no se cambia desde el perfil.
                </div>
              ) : (
                <>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <label
                      className={`cursor-pointer rounded-2xl border p-5 ${
                        roleForm.accountType === "adoptar"
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="accountType"
                        value="adoptar"
                        checked={roleForm.accountType === "adoptar"}
                        onChange={handleRoleChange}
                        className="mr-2"
                      />
                      <span className="font-bold text-gray-900">Adoptante</span>
                      <p className="mt-2 text-sm text-gray-500">
                        Puedes enviar solicitudes de adopción y ver tu historial.
                      </p>
                    </label>

                    <label
                      className={`cursor-pointer rounded-2xl border p-5 ${
                        roleForm.accountType === "dar"
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="accountType"
                        value="dar"
                        checked={roleForm.accountType === "dar"}
                        onChange={handleRoleChange}
                        className="mr-2"
                      />
                      <span className="font-bold text-gray-900">Publicador</span>
                      <p className="mt-2 text-sm text-gray-500">
                        Puedes publicar mascotas, recibir solicitudes y revisar historial.
                      </p>
                    </label>
                  </div>

                  {isAdopter && (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <input
                        name="phone"
                        value={roleForm.phone}
                        onChange={handleRoleChange}
                        placeholder="Teléfono"
                        className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                      />

                      <input
                        name="city"
                        value={roleForm.city}
                        onChange={handleRoleChange}
                        placeholder="Ciudad"
                        className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                      />

                      <input
                        name="address"
                        value={roleForm.address}
                        onChange={handleRoleChange}
                        placeholder="Dirección"
                        className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                      />

                      <select
                        name="housingType"
                        value={roleForm.housingType}
                        onChange={handleRoleChange}
                        className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                      >
                        <option value="casa">Casa</option>
                        <option value="apartamento">Apartamento</option>
                        <option value="otro">Otro</option>
                      </select>

                      <label className="flex items-center gap-2 text-gray-600 md:col-span-2">
                        <input
                          type="checkbox"
                          name="hasOtherPets"
                          checked={roleForm.hasOtherPets}
                          onChange={handleRoleChange}
                        />
                        Tengo otras mascotas
                      </label>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={roleMutation.isPending}
                    className="mt-6 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
                  >
                    {roleMutation.isPending ? "Actualizando..." : "Cambiar tipo de cuenta"}
                  </button>
                </>
              )}
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
