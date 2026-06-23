import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { petsApi } from "../../api/petsApi";
import PetCard from "../../components/pets/PetCard";
import PetFilters from "../../components/pets/PetFilters";
import CatalogHero from "../../components/catalog/CatalogHero";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

function PetCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-md">
      <div className="h-52 w-full animate-pulse bg-gray-200 sm:h-56" />

      <div className="p-5">
        <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-gray-200" />

        <div className="mt-4 flex gap-2">
          <div className="h-7 w-20 animate-pulse rounded-full bg-gray-200" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-gray-200" />
        </div>

        <div className="mt-5 h-10 w-full animate-pulse rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export default function PetsPage() {
  const [filters, setFilters] = useState({
    search: "",
    species: "",
    size: "",
    gender: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["pets-catalog"],
    queryFn: async () => {
      const res = await petsApi.getAll();
      return res.data;
    },
  });

  const filteredPets = useMemo(() => {
    const pets = data ?? [];

    return pets.filter((pet) => {
      const search = normalize(filters.search);
      const speciesFilter = normalize(filters.species);
      const sizeFilter = normalize(filters.size);
      const genderFilter = normalize(filters.gender);
      const statusName = normalize(pet.statusName);

      const isAvailable = !statusName || statusName === "disponible";

      const matchesSearch =
        !search ||
        normalize(pet.name).includes(search) ||
        normalize(pet.petName).includes(search) ||
        normalize(pet.speciesName).includes(search) ||
        normalize(pet.breedName).includes(search) ||
        normalize(pet.description).includes(search);

      const matchesSpecies =
        !speciesFilter ||
        normalize(pet.speciesName) === speciesFilter ||
        normalize(pet.speciesId) === speciesFilter;

      const matchesSize =
        !sizeFilter ||
        normalize(pet.sizeName) === sizeFilter ||
        normalize(pet.sizeId) === sizeFilter;

      const matchesGender = !genderFilter || normalize(pet.gender) === genderFilter;

      return isAvailable && matchesSearch && matchesSpecies && matchesSize && matchesGender;
    });
  }, [data, filters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CatalogHero />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <section className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Catálogo de mascotas
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Filtra por especie, tamaño, sexo o nombre para encontrar una mascota disponible.
          </p>
        </section>
      </main>

      <PetFilters filters={filters} setFilters={setFilters} />

      {error && (
        <p className="px-4 pb-8 pt-6 text-center text-red-500">
          Error cargando mascotas.
        </p>
      )}

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => <PetCardSkeleton key={index} />)
        ) : filteredPets.length > 0 ? (
          filteredPets.map((pet) => <PetCard key={pet.id} pet={pet} />)
        ) : (
          <p className="col-span-full rounded-3xl bg-white p-8 text-center text-gray-500 shadow">
            No hay mascotas disponibles con esos filtros.
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
}
