import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../../components/layout/Navbar";
import { authApi } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";

export default function Register() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    accountType: "adoptar",
    phone: "",
    address: "",
    city: "",
    housingType: "casa",
    hasOtherPets: false,
  });

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (res) => {
      loginStore({
        token: res.data.token,
        user: res.data.user,
      });

      const role = res.data.user?.roleName?.toLowerCase();

      if (role === "publicador") {
        navigate("/publisher/pets");
        return;
      }

      navigate("/pets");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        "Error registrando usuario.";

      toast.error(message);
    },
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    mutation.mutate({
      name: form.name,
      email: form.email,
      password: form.password,
      accountType: form.accountType,
      phone: form.phone,
      address: form.address,
      city: form.city,
      housingType: form.housingType,
      hasOtherPets: form.hasOtherPets,
    });
  };

  const isAdopter = form.accountType === "adoptar";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />

      <main className="mx-auto flex max-w-2xl items-center px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-3xl bg-white p-8 shadow-xl"
        >
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Crear cuenta
          </h1>

          <p className="mt-2 text-center text-gray-500">
            Regístrate para adoptar o dar una mascota en adopción.
          </p>

          <div className="mt-8 grid gap-4">
            <div>
              <p className="mb-3 font-semibold text-gray-700">
                ¿Qué quieres hacer?
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                <label
                  className={`cursor-pointer rounded-2xl border p-4 ${
                    form.accountType === "adoptar"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="accountType"
                      value="adoptar"
                      checked={form.accountType === "adoptar"}
                      onChange={handleChange}
                      className="mt-1"
                    />

                    <div>
                      <span className="block font-bold text-gray-900">
                        Quiero adoptar
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        Se creará tu cuenta como adoptante.
                      </span>
                    </div>
                  </div>
                </label>

                <label
                  className={`cursor-pointer rounded-2xl border p-4 ${
                    form.accountType === "dar"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="accountType"
                      value="dar"
                      checked={form.accountType === "dar"}
                      onChange={handleChange}
                      className="mt-1"
                    />

                    <div>
                      <span className="block font-bold text-gray-900">
                        Quiero dar en adopción
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        Se creará tu cuenta como publicador.
                      </span>
                    </div>
                  </div>
                </label>
              </div>

              <p className="mt-2 text-sm font-semibold text-purple-700">
                Selección actual: {isAdopter ? "Adoptante" : "Publicador"}
              </p>
            </div>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre completo"
              className="rounded-xl border px-4 py-3 outline-none focus:border-purple-500"
              required
            />

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Correo electrónico"
              className="rounded-xl border px-4 py-3 outline-none focus:border-purple-500"
              required
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className="rounded-xl border px-4 py-3 outline-none focus:border-purple-500"
              required
              minLength={6}
            />

            {isAdopter && (
              <>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Teléfono"
                  className="rounded-xl border px-4 py-3 outline-none focus:border-purple-500"
                />

                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Dirección"
                  className="rounded-xl border px-4 py-3 outline-none focus:border-purple-500"
                />

                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Ciudad"
                  className="rounded-xl border px-4 py-3 outline-none focus:border-purple-500"
                />

                <select
                  name="housingType"
                  value={form.housingType}
                  onChange={handleChange}
                  className="rounded-xl border px-4 py-3 outline-none focus:border-purple-500"
                >
                  <option value="casa">Casa</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="otro">Otro</option>
                </select>

                <label className="flex items-center gap-2 text-gray-600">
                  <input
                    type="checkbox"
                    name="hasOtherPets"
                    checked={form.hasOtherPets}
                    onChange={handleChange}
                  />
                  Tengo otras mascotas
                </label>
              </>
            )}

            {!isAdopter && (
              <div className="rounded-2xl bg-purple-50 p-4 text-sm text-purple-800">
                Tu cuenta tendrá acceso al panel para publicar mascotas, revisar solicitudes recibidas y ver tu historial.
              </div>
            )}

            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-xl bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
            >
              {mutation.isPending ? "Registrando..." : "Registrarse"}
            </button>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="font-semibold text-purple-600">
              Inicia sesión
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
