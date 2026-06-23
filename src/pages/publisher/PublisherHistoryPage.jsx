import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/layout/Navbar";
import PublisherHistoryTable from "../../components/publisher/PublisherHistoryTable";
import { publisherPetsApi } from "../../api/publisherPetsApi";

export default function PublisherHistoryPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["publisher-history"],
    queryFn: async () => {
      const res = await publisherPetsApi.getHistory();
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {error && (
          <div className="mb-6 rounded-2xl bg-red-100 p-4 font-semibold text-red-700">
            Error cargando historial.
          </div>
        )}

        {isLoading ? (
          <div className="rounded-3xl bg-white p-6 shadow">
            Cargando historial...
          </div>
        ) : (
          <PublisherHistoryTable items={data ?? []} />
        )}
      </main>
    </div>
  );
}
