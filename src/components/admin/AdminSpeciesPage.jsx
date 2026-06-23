import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { adminSpeciesApi } from "../../api/adminSpeciesApi";

function getErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.title) return data.title;

  return fallback;
}

export default function AdminSpeciesPage() {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [editingSpecies, setEditingSpecies] = useState(null);

  const speciesQuery = useQuery({
    queryKey: ["admin-species"],
    queryFn: async () => {
      const res = await adminSpeciesApi.getAll();
      return res.data;
    },
  });

  const refreshSpecies = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-species"] });
    queryClient.invalidateQueries({ queryKey: ["publisher-species"] });
  };

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = { name: name.trim() };

      if (editingSpecies) {
        return adminSpeciesApi.update(editingSpecies.id, payload);
      }

      return adminSpeciesApi.create(payload);
    },
    onSuccess: () => {
      toast.success(
        editingSpecies
          ? "Especie actualizada correctamente."
          : "Especie creada correctamente."
      );

      setName("");
      setEditingSpecies(null);
      refreshSpecies();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error guardando especie."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminSpeciesApi.delete(id),
    onSuccess: () => {
      toast.success("Especie eliminada correctamente.");
      refreshSpecies();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error eliminando especie."));
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("Escribe el nombre de la especie.");
      return;
    }

    saveMutation.mutate();
  };

  const handleEdit = (species) => {
    setEditingSpecies(species);
    setName(species.name);
  };

  const handleCancel = () => {
    setEditingSpecies(null);
    setName("");
  };

  const handleDelete = (species) => {
    if (species.breedsCount > 0 || species.petsCount > 0) {
      toast.error("No se puede eliminar una especie con razas o mascotas asociadas.");
      return;
    }

    deleteMutation.mutate(species.id);
  };

  const species = speciesQuery.data ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-900">Especies</h1>
          <p className="mt-2 text-gray-500">
            Crea y administra las especies disponibles para registrar mascotas.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-[1fr_auto_auto]">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ejemplo: Perro, Gato, Conejo"
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
            />

            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
            >
              {saveMutation.isPending
                ? "Guardando..."
                : editingSpecies
                  ? "Actualizar"
                  : "Crear especie"}
            </button>

            {editingSpecies && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
            )}
          </form>
        </div>

        <div className="mt-8 overflow-hidden rounded-3xl bg-white shadow">
          <div className="border-b p-6">
            <h2 className="text-xl font-bold text-gray-900">Listado de especies</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-gray-50 text-sm text-gray-600">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Nombre</th>
                  <th className="px-6 py-4">Razas</th>
                  <th className="px-6 py-4">Mascotas</th>
                  <th className="px-6 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {speciesQuery.isLoading ? (
                  <tr>
                    <td className="px-6 py-8 text-center text-gray-500" colSpan="5">
                      Cargando especies...
                    </td>
                  </tr>
                ) : species.length > 0 ? (
                  species.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">{item.id}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{item.name}</td>
                      <td className="px-6 py-4">{item.breedsCount ?? 0}</td>
                      <td className="px-6 py-4">{item.petsCount ?? 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="rounded-xl bg-yellow-100 px-4 py-2 font-semibold text-yellow-700 hover:bg-yellow-200"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deleteMutation.isPending}
                            className="rounded-xl bg-red-100 px-4 py-2 font-semibold text-red-700 hover:bg-red-200 disabled:opacity-60"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-8 text-center text-gray-500" colSpan="5">
                      No hay especies registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
