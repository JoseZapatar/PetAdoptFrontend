import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import Navbar from "../../components/layout/Navbar";

export default function Login() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (res) => {
      const token = res.data.token;
      const user = res.data.user ?? res.data;

      loginStore({ token, user });
      navigate("/");
    },
    onError: () => {
      alert("Credenciales incorrectas");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto flex max-w-md items-center px-6 py-16">
        <form
          onSubmit={handleSubmit}
          className="w-full rounded-3xl bg-white p-8 shadow-xl"
        >
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Iniciar sesión
          </h1>

          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="mt-8 w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-500"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="mt-4 w-full rounded-xl border px-4 py-3 outline-none focus:border-purple-500"
          />

          <button
            disabled={mutation.isPending}
            className="mt-6 w-full rounded-xl bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700"
          >
            {mutation.isPending ? "Ingresando..." : "Ingresar"}
          </button>

          <p className="mt-5 text-center text-sm text-gray-500">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-semibold text-purple-600">
              Regístrate
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}