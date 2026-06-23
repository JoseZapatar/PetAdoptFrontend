import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/layout/Navbar";
import PublisherPetsTable from "../../components/publisher/PublisherPetsTable";
import { publisherPetsApi } from "../../api/publisherPetsApi";

export default function PublisherPetsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["publisher-pets"],
    queryFn: async () => {
      const res = await publisherPetsApi.getMyPets();
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">
        {error && (
          <div className="mb-6 rounded-2xl bg-red-100 p-4 font-semibold text-red-700">
            Error cargando tus mascotas publicadas.
          </div>
        )}

        {isLoading ? (
          <div className="rounded-3xl bg-white p-6 shadow">
            Cargando mascotas...
          </div>
        ) : (
          <PublisherPetsTable pets={data ?? []} />
        )}
      </main>
    </div>
  );
}
