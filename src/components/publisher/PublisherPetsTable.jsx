import { Link } from "react-router-dom";
import { getPetImageUrl } from "../../utils/petImages";

export default function PublisherPetsTable({ pets }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow">
      <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mis mascotas publicadas
          </h1>
          <p className="mt-1 text-gray-500">
            Mascotas que has publicado para adopción.
          </p>
        </div>

        <Link
          to="/publisher/pets/new"
          className="rounded-xl bg-purple-600 px-5 py-3 text-center font-semibold text-white hover:bg-purple-700"
        >
          Publicar mascota
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-6 py-4">Foto</th>
              <th className="px-6 py-4">Mascota</th>
              <th className="px-6 py-4">Descripción</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Solicitudes</th>
              <th className="px-6 py-4">Fecha</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {pets.map((pet) => (
              <tr key={pet.id} className="align-top">
                <td className="px-6 py-4">
                  <img
                    src={getPetImageUrl(pet.primaryImageId)}
                    alt={pet.name}
                    onError={(event) => {
                      event.currentTarget.src = "/placeholder-pet.jpg";
                    }}
                    className="h-20 w-24 rounded-2xl object-cover"
                  />
                </td>

                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{pet.name}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {pet.speciesName} {pet.breedName ? `• ${pet.breedName}` : ""}
                  </p>
                  <p className="text-sm text-gray-500">{pet.sizeName}</p>
                </td>

                <td className="max-w-md px-6 py-4 text-sm leading-relaxed text-gray-600">
                  {pet.description || "Sin descripción."}
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-bold text-purple-700">
                    {pet.statusName}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <p>{pet.requestsCount ?? 0} totales</p>
                  <p className="text-sm text-yellow-700">
                    {pet.pendingRequestsCount ?? 0} pendientes
                  </p>
                </td>

                <td className="px-6 py-4">
                  {new Date(pet.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {pets.length === 0 && (
              <tr>
                <td className="px-6 py-10 text-center text-gray-500" colSpan="6">
                  Todavía no has publicado mascotas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
