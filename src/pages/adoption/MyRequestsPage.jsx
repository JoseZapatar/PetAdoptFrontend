// src/pages/adoption/MyRequestsPage.jsx
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/layout/Navbar";
import { useAuthStore } from "../../store/authStore";
import { adoptersApi } from "../../api/adoptersApi";
import { adoptionRequestsApi } from "../../api/adoptionRequestsApi";

export default function MyRequestsPage() {
  const user = useAuthStore((state) => state.user);

  const { data, isLoading, error } = useQuery({
    queryKey: ["my-requests", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const adopterRes = await adoptersApi.getByUser(user.id);
      const adopterId = adopterRes.data.id;

      const requestsRes = await adoptionRequestsApi.getMyRequests(adopterId);
      return requestsRes.data;
    },
  });

  const getStatusClass = (status) => {
    const value = status?.toLowerCase();

    if (value === "aprobada") return "bg-green-100 text-green-700";
    if (value === "rechazada") return "bg-red-100 text-red-700";
    if (value === "cancelada") return "bg-gray-100 text-gray-700";

    return "bg-yellow-100 text-yellow-700";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <p className="p-10 text-center">Debes iniciar sesión.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-5xl px-6 py-12">
          <div className="h-10 w-64 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-gray-200" />

          <div className="mt-8 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <MyRequestSkeleton key={index} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) return <p className="p-10">Error cargando solicitudes.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900">
          Mis solicitudes
        </h1>

        <p className="mt-2 text-gray-600">
          Revisa el estado de tus solicitudes de adopción.
        </p>

        <div className="mt-8 space-y-4">
          {data.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow">
              No has enviado solicitudes todavía.
            </div>
          ) : (
            data.map((request) => {
              const status = request.status ?? request.requestStatus;
              const isApproved = status?.toLowerCase() === "aprobada";

              return (
                <div
                  key={request.id}
                  className="rounded-3xl bg-white p-6 shadow"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {request.petName}
                      </h2>

                      <p className="mt-2 text-gray-600">
                        {request.message}
                      </p>

                      <p className="mt-2 text-sm text-gray-400">
                        Enviada el{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>

                      {isApproved && request.petId && (
                        <Link
                          to={`/pets/${request.petId}`}
                          className="mt-4 inline-block rounded-xl bg-purple-600 px-5 py-2 font-semibold text-white hover:bg-purple-700"
                        >
                          Ver mascota y valorar
                        </Link>
                      )}
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-bold ${getStatusClass(
                        status
                      )}`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

function MyRequestSkeleton() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="w-full">
          <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />

          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-4 w-3/4 max-w-lg animate-pulse rounded bg-gray-200" />

          <div className="mt-4 h-4 w-36 animate-pulse rounded bg-gray-200" />

          <div className="mt-5 h-10 w-44 animate-pulse rounded-xl bg-gray-200" />
        </div>

        <div className="h-9 w-28 shrink-0 animate-pulse rounded-full bg-gray-200" />
      </div>
    </div>
  );
}