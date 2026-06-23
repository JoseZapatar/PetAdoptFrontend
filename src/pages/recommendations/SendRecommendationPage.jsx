import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../../components/layout/Navbar";
import { recommendationsApi } from "../../api/recommendationsApi";

function getErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.title) return data.title;

  return fallback;
}

export default function SendRecommendationPage() {
  const [message, setMessage] = useState("");

  const mutation = useMutation({
    mutationFn: recommendationsApi.create,
    onSuccess: () => {
      toast.success("Recomendación enviada correctamente.");
      setMessage("");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error enviando recomendación."));
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({ message });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-8 shadow">
          <p className="text-sm font-semibold text-purple-600">Recomendaciones</p>
          <h1 className="mt-1 text-4xl font-bold text-gray-900">
            Enviar comentario al administrador
          </h1>

          <p className="mt-3 text-gray-600">
            Escribe una recomendación, reporte o comentario sobre el sistema. El administrador podrá revisarlo desde su panel.
          </p>

          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ejemplo: Sería útil agregar filtros por edad, mejorar la información de contacto, agregar notificaciones, etc."
            className="mt-8 min-h-56 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
            required
            minLength={10}
          />

          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="text-sm text-gray-500">Mínimo 10 caracteres.</p>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
            >
              {mutation.isPending ? "Enviando..." : "Enviar recomendación"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
