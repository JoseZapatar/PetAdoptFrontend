import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
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

      navigate("/pets");
    },
    onError: (error) => {
      alert(error.response?.data || "Error registrando usuario.");
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate({
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      address: form.address,
      city: form.city,
      housingType: form.housingType,
      hasOtherPets: form.hasOtherPets,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto flex max-w-2xl items-center px-6 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-3xl bg-white p-8 shadow-xl"
        >
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Crear cuenta
          </h1>

          <p className="mt-2 text-center text-gray-500">
            Regístrate para enviar solicitudes de adopción.
          </p>

          <div className="mt-8 grid gap-4">
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
            />

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

            <button
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