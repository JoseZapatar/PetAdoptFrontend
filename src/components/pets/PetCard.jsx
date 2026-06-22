import { Link } from "react-router-dom";

export default function PetCard({ pet }) {
  const id = pet.id;

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="h-52 bg-gray-200">
        <img
          src="/placeholder-pet.jpg"
          alt={pet.petName}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
          {pet.statusName}
        </span>

        <h3 className="mt-3 text-xl font-bold text-gray-900">
          {pet.petName}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {pet.speciesName} • {pet.breedName}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          {pet.sizeName} • {pet.ageCalculated} años
        </p>

        <Link
          to={`/pets/${id}`}
          className="mt-4 block rounded-xl bg-purple-600 py-2 text-center text-sm font-semibold text-white hover:bg-purple-700"
        >
          Ver más
        </Link>
      </div>
    </article>
  );
}