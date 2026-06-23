import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../../components/layout/Navbar";
import PublisherRequestsTable from "../../components/publisher/PublisherRequestsTable";
import { publisherPetsApi } from "../../api/publisherPetsApi";

function getErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.title) return data.title;

  return fallback;
}

export default function PublisherRequestsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["publisher-requests"],
    queryFn: async () => {
      const res = await publisherPetsApi.getRequests();
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (request) =>
      publisherPetsApi.approveRequest(request.id, {
        decisionNotes: "Solicitud aprobada.",
      }),
    onSuccess: () => {
      toast.success("Solicitud aprobada correctamente.");
      queryClient.invalidateQueries({ queryKey: ["publisher-requests"] });
      queryClient.invalidateQueries({ queryKey: ["publisher-pets"] });
      queryClient.invalidateQueries({ queryKey: ["publisher-history"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error aprobando solicitud."));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (request) =>
      publisherPetsApi.rejectRequest(request.id, {
        decisionNotes: "Solicitud rechazada.",
      }),
    onSuccess: () => {
      toast.success("Solicitud rechazada correctamente.");
      queryClient.invalidateQueries({ queryKey: ["publisher-requests"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error rechazando solicitud."));
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {error && (
          <div className="mb-6 rounded-2xl bg-red-100 p-4 font-semibold text-red-700">
            Error cargando solicitudes recibidas.
          </div>
        )}

        {isLoading ? (
          <div className="rounded-3xl bg-white p-6 shadow">
            Cargando solicitudes...
          </div>
        ) : (
          <PublisherRequestsTable
            requests={data ?? []}
            isSaving={approveMutation.isPending || rejectMutation.isPending}
            onApprove={(request) => approveMutation.mutate(request)}
            onReject={(request) => rejectMutation.mutate(request)}
          />
        )}
      </main>
    </div>
  );
}
