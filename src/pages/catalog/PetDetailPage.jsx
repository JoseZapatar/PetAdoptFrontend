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
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <PetDetailSkeleton />
          <ReviewsSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="rounded-3xl bg-white p-8 text-center shadow">
            Mascota no encontrada.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isAvailable = data.statusName?.toLowerCase() === "disponible";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
          <div className="grid gap-0 lg:grid-cols-2">
            <img
              src={getPetImageUrl(data.primaryImageId)}
              alt={data.name}
              onError={(event) => {
                event.currentTarget.src = "/placeholder-pet.jpg";
              }}
              className="h-72 w-full object-cover sm:h-96 lg:h-full lg:min-h-[420px]"
            />

            <div className="p-5 sm:p-8">
              <span className="rounded-full bg-purple-100 px-4 py-1 text-sm font-semibold text-purple-700">
                {data.statusName}
              </span>

              <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                {data.name}
              </h1>

              <p className="mt-2 text-gray-500">
                {data.speciesName} {data.breedName ? `• ${data.breedName}` : ""}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      <Footer />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 break-words font-bold text-gray-900">{value || "N/A"}</p>
    </div>
  );
}

function PetDetailSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="h-72 w-full animate-pulse bg-gray-200 sm:h-96 lg:h-[420px]" />

        <div className="p-5 sm:p-8">
          <div className="h-7 w-28 animate-pulse rounded-full bg-gray-200" />
          <div className="mt-5 h-10 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-gray-200" />

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
    <div className="mt-10 rounded-3xl bg-white p-5 shadow-lg sm:p-8">
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
