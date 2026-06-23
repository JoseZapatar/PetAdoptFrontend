import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { petsApi } from "../../api/petsApi";
import { getPetImageUrl } from "../../utils/petImages";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-6xl px-6 py-10">
          <PetDetailSkeleton />
          <ReviewsSkeleton />
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !data) return <p className="p-10">Mascota no encontrada</p>;

  const isAvailable = data.statusName?.toLowerCase() === "disponible";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="grid gap-8 md:grid-cols-2">
            <img
              src={getPetImageUrl(data)}
              alt={data.name}
              onError={(event) => {
                event.currentTarget.src = "/placeholder-pet.jpg";
              }}
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
                {data.speciesName} {data.breedName ? `• ${data.breedName}` : ""}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Info label="Tamaño" value={data.sizeName} />
                <Info label="Sexo" value={data.gender} />
                <Info label="Estado" value={data.statusName} />
                <Info
                  label="Nacimiento"
                  value={data.birthDate ? new Date(data.birthDate).toLocaleDateString() : "N/A"}
                />
              </div>

              <h2 className="mt-8 text-xl font-bold text-gray-900">
                Sobre {data.name}
              </h2>

              <p className="mt-3 leading-relaxed text-gray-600">
                {data.description || "No hay descripción disponible."}
              </p>

              {(data.isVaccinated || data.isSterilized || data.isDewormed || data.medicalNotes) && (
                <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                  <h3 className="font-bold text-gray-900">Salud</h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.isVaccinated && <Badge>Vacunado</Badge>}
                    {data.isSterilized && <Badge>Esterilizado</Badge>}
                    {data.isDewormed && <Badge>Desparasitado</Badge>}
                  </div>

                  {data.medicalNotes && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {data.medicalNotes}
                    </p>
                  )}
                </div>
              )}

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

function Badge({ children }) {
  return (
    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
      {children}
    </span>
  );
}

function PetDetailSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="h-[420px] w-full animate-pulse bg-gray-200" />

        <div className="p-8">
          <div className="h-7 w-28 animate-pulse rounded-full bg-gray-200" />
          <div className="mt-5 h-10 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-gray-200" />

          <div className="mt-6 grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-2xl bg-gray-50 p-4">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="mt-3 h-5 w-28 animate-pulse rounded bg-gray-200" />
              </div>
            ))}
          </div>

          <div className="mt-8 h-6 w-40 animate-pulse rounded bg-gray-200" />

          <div className="mt-4 space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="mt-8 h-12 w-full animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-lg">
      <div className="h-7 w-48 animate-pulse rounded bg-gray-200" />

      <div className="mt-6 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-2xl bg-gray-50 p-4">
            <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
