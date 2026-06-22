import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/layout/Navbar";
import { petsApi } from "../../api/petsApi";
import { adoptionRequestsApi } from "../../api/adoptionRequestsApi";

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const [petsRes, requestsRes] = await Promise.all([
        petsApi.getAll(),
        adoptionRequestsApi.getAll(),
      ]);

      const pets = petsRes.data;
      const requests = requestsRes.data;

      const countPetsByStatus = (status) =>
        pets.filter(
          (pet) => pet.statusName?.toLowerCase() === status.toLowerCase()
        ).length;

      const countRequestsByStatus = (status) =>
        requests.filter(
          (request) =>
            (request.requestStatus ?? request.status)?.toLowerCase() ===
            status.toLowerCase()
        ).length;

      return {
        totalPets: pets.length,
        availablePets: countPetsByStatus("disponible"),
        adoptedPets: countPetsByStatus("adoptado"),
        processPets: countPetsByStatus("en proceso"),
        unavailablePets: countPetsByStatus("No disponible"),

        totalRequests: requests.length,
        pendingRequests: countRequestsByStatus("Pendiente"),
        approvedRequests: countRequestsByStatus("Aprobada"),
        rejectedRequests: countRequestsByStatus("Rechazada"),
        cancelledRequests: countRequestsByStatus("Cancelada"),

        latestRequests: requests.slice(0, 5),
      };
    },
  });

  if (isLoading) return <p className="p-10">Cargando dashboard...</p>;
  if (error) return <p className="p-10">Error cargando dashboard.</p>;

  const cards = [
    {
      title: "Mascotas totales",
      value: data.totalPets,
      className: "bg-purple-100 text-purple-700",
    },
    {
      title: "Disponibles",
      value: data.availablePets,
      className: "bg-green-100 text-green-700",
    },
    {
      title: "Adoptadas",
      value: data.adoptedPets,
      className: "bg-blue-100 text-blue-700",
    },
    {
      title: "En proceso",
      value: data.processPets,
      className: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Solicitudes totales",
      value: data.totalRequests,
      className: "bg-purple-100 text-purple-700",
    },
    {
      title: "Pendientes",
      value: data.pendingRequests,
      className: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Aprobadas",
      value: data.approvedRequests,
      className: "bg-green-100 text-green-700",
    },
    {
      title: "Rechazadas",
      value: data.rejectedRequests,
      className: "bg-red-100 text-red-700",
    },
    {
      title: "Canceladas",
      value: data.cancelledRequests,
      className: "bg-gray-100 text-gray-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-4xl font-bold text-gray-900">
          Dashboard administrativo
        </h1>

        <p className="mt-2 text-gray-600">
          Resumen general del sistema de adopciones.
        </p>

        <section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className="rounded-3xl bg-white p-6 shadow">
              <div
                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${card.className}`}
              >
                {card.title}
              </div>

              <p className="mt-5 text-4xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold text-gray-900">
            Solicitudes recientes
          </h2>

          <div className="mt-6 overflow-hidden rounded-2xl border">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-sm text-gray-600">
                <tr>
                  <th className="p-4">Mascota</th>
                  <th className="p-4">Adoptante</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Fecha</th>
                </tr>
              </thead>

              <tbody>
                {data.latestRequests.map((request, index) => {
                  const status = request.requestStatus ?? request.status;

                  return (
                    <tr key={request.id ?? request.requestId ?? index} className="border-t">
                      <td className="p-4 font-semibold">{request.petName}</td>
                      <td className="p-4">{request.adopterName}</td>
                      <td className="p-4">{status}</td>
                      <td className="p-4">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}