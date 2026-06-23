import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../../components/layout/Navbar";
import { recommendationsApi } from "../../api/recommendationsApi";

function getStatusClass(status) {
  const value = status?.toLowerCase();

  if (value === "revisada") return "bg-green-100 text-green-700";
  if (value === "descartada") return "bg-red-100 text-red-700";

  return "bg-yellow-100 text-yellow-700";
}

function getErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.title) return data.title;

  return fallback;
}

export default function AdminRecommendationsPage() {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [reviewForm, setReviewForm] = useState({ status: "Revisada", adminNotes: "" });

  const recommendationsQuery = useQuery({
    queryKey: ["admin-recommendations", status],
    queryFn: async () => {
      const params = {};
      if (status) params.status = status;

      const res = await recommendationsApi.getAll(params);
      return res.data;
    },
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, data }) => recommendationsApi.review(id, data),
    onSuccess: () => {
      toast.success("Recomendación actualizada correctamente.");
      setEditingItem(null);
      setReviewForm({ status: "Revisada", adminNotes: "" });
      queryClient.invalidateQueries({ queryKey: ["admin-recommendations"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error actualizando recomendación."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: recommendationsApi.delete,
    onSuccess: () => {
      toast.success("Recomendación eliminada correctamente.");
      queryClient.invalidateQueries({ queryKey: ["admin-recommendations"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error eliminando recomendación."));
    },
  });

  const handleStartReview = (item) => {
    setEditingItem(item);
    setReviewForm({
      status: item.status || "Revisada",
      adminNotes: item.adminNotes || "",
    });
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    if (!editingItem) return;

    reviewMutation.mutate({
      id: editingItem.id,
      data: reviewForm,
    });
  };

  const handleDelete = (item) => {
    const shouldDelete = window.confirm("¿Eliminar esta recomendación?");
    if (!shouldDelete) return;

    deleteMutation.mutate(item.id);
  };

  const items = recommendationsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold text-purple-600">Panel administrador</p>
          <h1 className="text-4xl font-bold text-gray-900">Recomendaciones</h1>
          <p className="mt-2 text-gray-600">
            Comentarios y recomendaciones enviadas por los usuarios del sistema.
          </p>
        </div>

        <div className="mb-6 rounded-3xl bg-white p-6 shadow">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-bold text-gray-900">Filtros</h2>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendientes</option>
              <option value="Revisada">Revisadas</option>
              <option value="Descartada">Descartadas</option>
            </select>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
          <section className="overflow-hidden rounded-3xl bg-white shadow">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Comentario</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {recommendationsQuery.isLoading ? (
                    <tr>
                      <td className="px-6 py-8 text-center text-gray-500" colSpan="5">
                        Cargando recomendaciones...
                      </td>
                    </tr>
                  ) : items.length > 0 ? (
                    items.map((item) => (
                      <tr key={item.id} className="align-top">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{item.name || "Usuario"}</p>
                          <p className="text-sm text-gray-500">{item.email || "Sin correo"}</p>
                        </td>

                        <td className="max-w-lg px-6 py-4">
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                            {item.message}
                          </p>
                          {item.adminNotes && (
                            <p className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-500">
                              Nota admin: {item.adminNotes}
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-sm font-bold ${getStatusClass(item.status)}`}>
                            {item.status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => handleStartReview(item)}
                              className="rounded-xl bg-purple-100 px-4 py-2 font-semibold text-purple-700 hover:bg-purple-200"
                            >
                              Revisar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              className="rounded-xl bg-red-100 px-4 py-2 font-semibold text-red-700 hover:bg-red-200"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-8 text-center text-gray-500" colSpan="5">
                        No hay recomendaciones para mostrar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <form onSubmit={handleReviewSubmit} className="h-fit rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold text-gray-900">Revisión</h2>
            <p className="mt-1 text-gray-500">
              Selecciona una recomendación para actualizar su estado.
            </p>

            {editingItem ? (
              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                  {editingItem.message}
                </div>

                <select
                  value={reviewForm.status}
                  onChange={(event) => setReviewForm((current) => ({ ...current, status: event.target.value }))}
                  className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Revisada">Revisada</option>
                  <option value="Descartada">Descartada</option>
                </select>

                <textarea
                  value={reviewForm.adminNotes}
                  onChange={(event) => setReviewForm((current) => ({ ...current, adminNotes: event.target.value }))}
                  placeholder="Nota interna del administrador"
                  className="min-h-32 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                />

                <button
                  type="submit"
                  disabled={reviewMutation.isPending}
                  className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
                >
                  {reviewMutation.isPending ? "Guardando..." : "Guardar revisión"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">
                No hay recomendación seleccionada.
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
