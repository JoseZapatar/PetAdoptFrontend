import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/layout/Navbar";
import AdoptionHistoryTable from "../../components/adoption/AdoptionHistoryTable";
import { useAuthStore } from "../../store/authStore";
import { adoptersApi } from "../../api/adoptersApi";
import { adoptionRequestsApi } from "../../api/adoptionRequestsApi";

export default function AdoptionHistoryPage() {
  const user = useAuthStore((state) => state.user);

  const { data, isLoading, error } = useQuery({
    queryKey: ["adoption-history", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const adopterRes = await adoptersApi.getByUser(user.id);
      const adopterId = adopterRes.data.id;

      const historyRes = await adoptionRequestsApi.getMyHistory(adopterId);
      return historyRes.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {error && (
          <div className="mb-6 rounded-2xl bg-red-100 p-4 font-semibold text-red-700">
            Error cargando historial de adopciones.
          </div>
        )}

        {isLoading ? (
          <div className="rounded-3xl bg-white p-6 shadow">
            Cargando historial...
          </div>
        ) : (
          <AdoptionHistoryTable items={data ?? []} />
        )}
      </main>
    </div>
  );
}
