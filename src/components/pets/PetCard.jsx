import { Link } from "react-router-dom";
import { getPetImageUrl } from "../../utils/petImages";

function getPetName(pet) {
  return pet.name || pet.petName || "Mascota";
}

function getAge(pet) {
  if (pet.ageCalculated !== undefined && pet.ageCalculated !== null) {
    return `${pet.ageCalculated} años`;
  }

  if (!pet.birthDate) return "Edad no disponible";

  const birthDate = new Date(pet.birthDate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age > 0 ? `${age} años` : "Menos de 1 año";
}

export default function PetCard({ pet }) {
  const id = pet.id;
  const name = getPetName(pet);

  return (
    <article className="overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <img
        src={getPetImageUrl(pet.primaryImageId)}
        alt={name}
        onError={(event) => {
          event.currentTarget.src = "/placeholder-pet.jpg";
        }}
        className="h-52 w-full object-cover sm:h-56"
      />

      <div className="p-5">
        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
          {pet.statusName || "Disponible"}
        </span>

        <h3 className="mt-4 line-clamp-2 text-xl font-bold text-gray-900 sm:text-2xl">
          {name}
        </h3>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          {pet.speciesName} {pet.breedName ? `• ${pet.breedName}` : ""}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {pet.sizeName && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
              {pet.sizeName}
            </span>
          )}

          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
            {getAge(pet)}
          </span>

          {pet.gender && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
              {pet.gender}
            </span>
          )}
        </div>

        <Link
          to={`/pets/${id}`}
          className="mt-5 block rounded-xl bg-purple-600 py-3 text-center font-semibold text-white transition hover:bg-purple-700"
        >
          Ver más
        </Link>
      </div>
    </article>
  );
}
