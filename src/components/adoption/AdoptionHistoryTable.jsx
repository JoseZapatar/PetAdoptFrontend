import { Link } from "react-router-dom";
import { getPetImageUrl } from "../../utils/petImages";

export default function AdoptionHistoryTable({ items }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow">
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Historial de mascotas adoptadas
        </h1>
        <p className="mt-1 text-gray-500">
          Mascotas cuya solicitud de adopción fue aprobada.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-6 py-4">Foto</th>
              <th className="px-6 py-4">Mascota</th>
              <th className="px-6 py-4">Publicador</th>
              <th className="px-6 py-4">Mensaje enviado</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Acción</th>
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
                  {item.publisherName || "No registrado"}
                </td>

                <td className="max-w-md px-6 py-4 text-sm leading-relaxed text-gray-600">
                  {item.message || "Sin mensaje."}
                </td>

                <td className="px-6 py-4">
                  {new Date(item.adoptedAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <Link
                    to={`/pets/${item.petId}`}
                    className="font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Ver mascota
                  </Link>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td className="px-6 py-10 text-center text-gray-500" colSpan="6">
                  Todavía no tienes mascotas adoptadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
