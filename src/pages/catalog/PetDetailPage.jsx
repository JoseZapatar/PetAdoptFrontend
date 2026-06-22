import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { petsApi } from "../../api/petsApi";
import Navbar from "../../components/layout/Navbar";
import ReviewsSection from "../../components/reviews/ReviewsSection";

export default function PetDetailPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["pet-detail", id],
    queryFn: async () => {
      const res = await petsApi.getById(id);
      return res.data;
    },
  });

  if (isLoading) return <p className="p-10">Cargando mascota...</p>;

  if (error || !data) return <p className="p-10">Mascota no encontrada</p>;

  const isAvailable = data.statusName?.toLowerCase() === "disponible";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="grid gap-8 md:grid-cols-2">
            <img
              src="/placeholder-pet.jpg"
              alt={data.name}
              className="h-full min-h-[420px] w-full object-cover"
            />

            <div className="p-8">
              <span className="rounded-full bg-purple-100 px-4 py-1 text-sm font-semibold text-purple-700">
                {data.statusName}
              </span>

              <h1 className="mt-4 text-4xl font-bold text-gray-900">
                {data.name}
              </h1>

              <p className="mt-2 text-gray-500">
                {data.speciesName} • {data.breedName}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Info label="Tamaño" value={data.sizeName} />
                <Info label="Sexo" value={data.gender} />
                <Info label="Estado" value={data.statusName} />
                <Info
                  label="Nacimiento"
                  value={
                    data.birthDate
                      ? new Date(data.birthDate).toLocaleDateString()
                      : "N/A"
                  }
                />
              </div>

              <h2 className="mt-8 text-xl font-bold text-gray-900">
                Sobre {data.name}
              </h2>

              <p className="mt-3 leading-relaxed text-gray-600">
                {data.description || "No hay descripción disponible."}
              </p>

              {isAvailable ? (
                <Link
                  to={`/adopt/${data.id}`}
                  className="mt-8 block rounded-2xl bg-purple-600 py-3 text-center font-semibold text-white hover:bg-purple-700"
                >
                  Adoptar a {data.name}
                </Link>
              ) : (
                <div className="mt-8 rounded-2xl bg-gray-100 py-3 text-center font-semibold text-gray-500">
                  Esta mascota no está disponible para adopción
                </div>
              )}
            </div>
          </div>
        </div>

        <ReviewsSection petId={data.id} />
      </main>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-bold text-gray-900">{value || "N/A"}</p>
    </div>
  );
}