import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Navbar from "../../components/layout/Navbar";
import { useAuthStore } from "../../store/authStore";
import { adoptersApi } from "../../api/adoptersApi";
import { adoptionRequestsApi } from "../../api/adoptionRequestsApi";

export default function AdoptionFormPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error("Debes iniciar sesión para adoptar.");
      }

      const adopterRes = await adoptersApi.getByUser(user.id);
      const adopter = adopterRes.data;

      return adoptionRequestsApi.create({
        adopterId: adopter.id,
        petId: Number(petId),
        message,
      });
    },

    onSuccess: () => {
      navigate("/success");
    },

    onError: (error) => {
      console.error(error);

      const apiMessage =
        error.response?.data || error.message || "Error enviando solicitud";

      alert(apiMessage);
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-xl px-6 py-20 text-center">
          <div className="rounded-3xl bg-white p-10 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900">
              Inicia sesión para adoptar
            </h1>

            <p className="mt-4 text-gray-600">
              Necesitas una cuenta para enviar una solicitud de adopción.
            </p>

            <Link
              to="/login"
              className="mt-8 inline-block rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
            >
              Iniciar sesión
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert("Escribe un mensaje para la solicitud.");
      return;
    }

    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Solicitud de adopción
          </h1>

          <p className="mt-3 text-center text-gray-600">
            Cuéntanos por qué deseas adoptar esta mascota.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <textarea
              rows="6"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ej: Me gustaría adoptar esta mascota porque tengo experiencia cuidando animales y puedo darle un hogar seguro..."
              className="w-full rounded-2xl border px-4 py-3 outline-none focus:border-purple-500"
            />

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full rounded-2xl bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
            >
              {mutation.isPending
                ? "Enviando solicitud..."
                : "Enviar solicitud de adopción"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}