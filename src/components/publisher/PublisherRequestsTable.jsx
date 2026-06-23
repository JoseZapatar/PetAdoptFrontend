function getStatusClass(status) {
  const value = status?.toLowerCase();

  if (value === "aprobada") return "bg-green-100 text-green-700";
  if (value === "rechazada") return "bg-red-100 text-red-700";
  if (value === "cancelada") return "bg-gray-100 text-gray-600";

  return "bg-yellow-100 text-yellow-700";
}

export default function PublisherRequestsTable({
  requests,
  isSaving,
  onApprove,
  onReject,
}) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow">
      <div className="border-b p-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Solicitudes recibidas
        </h1>
        <p className="mt-1 text-gray-500">
          Solicitudes pendientes de adopción para tus mascotas publicadas.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-6 py-4">Mascota</th>
              <th className="px-6 py-4">Adoptante</th>
              <th className="px-6 py-4">Correo</th>
              <th className="px-6 py-4">Mensaje</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {requests.map((request) => (
              <tr key={request.id} className="align-top">
                <td className="px-6 py-4 font-bold text-gray-900">
                  {request.petName}
                </td>

                <td className="px-6 py-4">
                  <p>{request.adopterName}</p>
                  {request.adopterPhone && (
                    <p className="mt-1 text-sm text-gray-500">
                      Tel: {request.adopterPhone}
                    </p>
                  )}
                  {request.adopterCity && (
                    <p className="text-sm text-gray-500">
                      Ciudad: {request.adopterCity}
                    </p>
                  )}
                </td>

                <td className="px-6 py-4">{request.adopterEmail}</td>

                <td className="max-w-sm px-6 py-4">
                  <p className="text-sm leading-relaxed text-gray-700">
                    {request.message || "Sin mensaje en la solicitud."}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${getStatusClass(
                      request.requestStatus
                    )}`}
                  >
                    {request.requestStatus}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {new Date(request.createdAt).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => onApprove(request)}
                      className="rounded-xl bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                    >
                      Aprobar
                    </button>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => onReject(request)}
                      className="rounded-xl bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                    >
                      Rechazar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {requests.length === 0 && (
              <tr>
                <td className="px-6 py-10 text-center text-gray-500" colSpan="7">
                  No tienes solicitudes pendientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
