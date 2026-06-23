import { getPetImageUrl } from "../../utils/petImages";

export default function PublisherHistoryTable({ items }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow">
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Historial de adopciones
        </h1>
        <p className="mt-1 text-gray-500">
          Mascotas publicadas por ti que ya fueron adoptadas.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-6 py-4">Foto</th>
              <th className="px-6 py-4">Mascota</th>
              <th className="px-6 py-4">Adoptante</th>
              <th className="px-6 py-4">Mensaje</th>
              <th className="px-6 py-4">Fecha de adopción</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="align-top">
                <td className="px-6 py-4">
                  <img
                    src={getPetImageUrl(item.primaryImageId)}
                    alt={item.petName}
                    onError={(event) => {
                      event.currentTarget.src = "/placeholder-pet.jpg";
                    }}
                    className="h-20 w-24 rounded-2xl object-cover"
                  />
                </td>

                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{item.petName}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.speciesName} {item.breedName ? `• ${item.breedName}` : ""}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <p>{item.adopterName}</p>
                  <p className="text-sm text-gray-500">{item.adopterEmail}</p>
                  {item.adopterPhone && (
                    <p className="text-sm text-gray-500">
                      Tel: {item.adopterPhone}
                    </p>
                  )}
                </td>

                <td className="max-w-md px-6 py-4 text-sm leading-relaxed text-gray-600">
                  {item.message || "Sin mensaje."}
                </td>

                <td className="px-6 py-4">
                  {new Date(item.adoptedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td className="px-6 py-10 text-center text-gray-500" colSpan="5">
                  Todavía no tienes mascotas dadas en adopción.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
