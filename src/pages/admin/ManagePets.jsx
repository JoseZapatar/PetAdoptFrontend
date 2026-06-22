import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { petsApi } from "../../api/petsApi";

export default function ManagePets() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data, isLoading, error } = useQuery({
        queryKey: ["admin-pets"],
        queryFn: async () => {
            const res = await petsApi.getAll();
            return res.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => petsApi.delete(id),

        onSuccess: () => {
            alert("Mascota eliminada correctamente.");
            queryClient.invalidateQueries({
                queryKey: ["admin-pets"],
            });
        },

        onError: (error) => {
            alert(error.response?.data || "Error eliminando mascota.");
        },
    });

    const getStatusClass = (status) => {
        const value = status?.toLowerCase();

        if (value === "disponible") return "bg-green-100 text-green-700";
        if (value === "adoptado") return "bg-blue-100 text-blue-700";
        if (value === "en proceso") return "bg-yellow-100 text-yellow-700";
        if (value === "no disponible") return "bg-red-100 text-red-700";

        return "bg-purple-100 text-purple-700";
    };

    if (isLoading) return <p className="p-10">Cargando mascotas...</p>;

    if (error) return <p className="p-10">Error cargando mascotas.</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-10">
                <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Administración de mascotas
                    </h1>

                    <button
                        onClick={() => navigate("/admin/pets/create")}
                        className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700"
                    >
                        Nueva mascota
                    </button>
                </div>

                <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-sm text-gray-600">
                            <tr>
                                <th className="p-4">Nombre</th>
                                <th className="p-4">Especie</th>
                                <th className="p-4">Raza</th>
                                <th className="p-4">Tamaño</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data?.map((pet) => {
                                const isAdopted = pet.statusName?.toLowerCase() === "adoptado";

                                return (
                                    <tr key={pet.id} className="border-t">
                                        <td className="p-4 font-semibold">{pet.name}</td>

                                        <td className="p-4">{pet.speciesName}</td>

                                        <td className="p-4">{pet.breedName || "-"}</td>

                                        <td className="p-4">{pet.sizeName}</td>

                                        <td className="p-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                                                    pet.statusName
                                                )}`}
                                            >
                                                {pet.statusName}
                                            </span>
                                        </td>

                                        <td className="flex gap-2 p-4">
                                            <button
                                                onClick={() => navigate(`/admin/pets/edit/${pet.id}`)}
                                                className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/pets/${pet.id}/images`)}
                                                className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
                                            >
                                                Imágenes
                                            </button>

                                            <button
                                                disabled={isAdopted || deleteMutation.isPending}
                                                onClick={() => {
                                                    if (confirm(`¿Eliminar a ${pet.name}?`)) {
                                                        deleteMutation.mutate(pet.id);
                                                    }
                                                }}
                                                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}