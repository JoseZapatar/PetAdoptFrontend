import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { viewsApi } from "../../api/viewsApi";
import PetCard from "../../components/pets/PetCard";
import PetFilters from "../../components/pets/PetFilters";
import Navbar from "../../components/layout/Navbar";

export default function PetsPage() {
  const [filters, setFilters] = useState({
    search: "",
    species: "",
    size: "",
    gender: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["available-pets", filters],
    queryFn: async () => {
      const res = await viewsApi.availablePets(filters);
      return res.data;
    },
  });

  if (isLoading) return <p className="p-8">Cargando mascotas...</p>;

  if (error) return <p className="p-8">Error cargando mascotas</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-12 text-center">
        <h1 className="text-5xl font-bold text-gray-900">
          Encuentra tu{" "}
          <span className="text-purple-600">compañero perfecto</span>
        </h1>

        <p className="mt-4 text-gray-600">
          Explora mascotas disponibles y dale una segunda oportunidad a un amigo peludo.
        </p>
      </section>

      <PetFilters filters={filters} setFilters={setFilters} />

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pb-16 sm:grid-cols-2 lg:grid-cols-4">
        {data?.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </section>
    </div>
  );
}