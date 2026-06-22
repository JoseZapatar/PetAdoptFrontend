import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../../components/layout/Navbar";
import { adoptionRequestsApi } from "../../api/adoptionRequestsApi";
import { useAuthStore } from "../../store/authStore";

export default function ManageRequests() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => {
      const res = await adoptionRequestsApi.getAll();
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id) =>
      adoptionRequestsApi.approve(id, {
        reviewedByUserId: user.id,
        decisionNotes: "Solicitud aprobada desde el panel admin.",
      }),
    onSuccess: () => {
      alert("Solicitud aprobada correctamente.");
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
    },
    onError: (error) => {
      alert(error.response?.data || "Error al aprobar solicitud.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) =>
      adoptionRequestsApi.reject(id, {
        reviewedByUserId: user.id,
        decisionNotes: "Solicitud rechazada desde el panel admin.",
      }),
    onSuccess: () => {
      alert("Solicitud rechazada correctamente.");
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
    },
    onError: (error) => {
      alert(error.response?.data || "Error al rechazar solicitud.");
    },
  });

  const getStatusClass = (status) => {
    const value = status?.toLowerCase();

    if (value === "aprobada") return "bg-green-100 text-green-700";
    if (value === "rechazada") return "bg-red-100 text-red-700";
    if (value === "cancelada") return "bg-gray-100 text-gray-700";

    return "bg-yellow-100 text-yellow-700";
  };

  if (isLoading) return <p className="p-10">Cargando solicitudes...</p>;
  if (error) return <p className="p-10">Error cargando solicitudes.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Solicitudes de adopción
        </h1>

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-sm text-gray-600">
              <tr>
                <th className="p-4">Mascota</th>
                <th className="p-4">Adoptante</th>
                <th className="p-4">Correo</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((request, index) => {
                const requestId =
                  request.id ?? request.requestId ?? request.adoptionRequestId;

                const status = request.requestStatus ?? request.status;
                const isPending = status?.toLowerCase() === "pendiente";

                return (
                  <tr key={requestId ?? index} className="border-t">
                    <td className="p-4 font-semibold">{request.petName}</td>
                    <td className="p-4">{request.adopterName}</td>
                    <td className="p-4">
                      {request.email ?? request.adopterEmail}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="p-4">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      {isPending ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveMutation.mutate(requestId)}
                            disabled={
                              approveMutation.isPending ||
                              rejectMutation.isPending
                            }
                            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            Aprobar
                          </button>

                          <button
                            onClick={() => rejectMutation.mutate(requestId)}
                            disabled={
                              approveMutation.isPending ||
                              rejectMutation.isPending
                            }
                            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                          >
                            Rechazar
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Sin acciones
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}