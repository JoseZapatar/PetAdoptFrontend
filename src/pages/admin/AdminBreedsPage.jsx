import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../../components/layout/Navbar";
import { adminBreedsApi } from "../../api/adminBreedsApi";
import { publisherCatalogsApi } from "../../api/publisherCatalogsApi";

const emptyForm = {
  name: "",
  speciesId: "",
};

function getErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.title) return data.title;

  return fallback;
}

export default function AdminBreedsPage() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState(emptyForm);
  const [editingBreed, setEditingBreed] = useState(null);
  const [search, setSearch] = useState("");

  const speciesQuery = useQuery({
    queryKey: ["admin-breeds-species"],
    queryFn: async () => {
      const res = await publisherCatalogsApi.getSpecies();
      return res.data;
    },
  });

  const breedsQuery = useQuery({
    queryKey: ["admin-breeds"],
    queryFn: async () => {
      const res = await adminBreedsApi.getAll();
      return res.data;
    },
  });

  useEffect(() => {
    if (!editingBreed) return;

    setForm({
      name: editingBreed.name,
      speciesId: String(editingBreed.speciesId),
    });
  }, [editingBreed]);

  const saveMutation = useMutation({
    mutationFn: (payload) => {
      const data = {
        name: payload.name,
        speciesId: Number(payload.speciesId),
      };

      if (editingBreed) {
        return adminBreedsApi.update(editingBreed.id, data);
      }

      return adminBreedsApi.create(data);
    },
    onSuccess: () => {
      toast.success(editingBreed ? "Raza actualizada correctamente." : "Raza creada correctamente.");
      setEditingBreed(null);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["admin-breeds"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error guardando raza."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminBreedsApi.delete(id),
    onSuccess: () => {
      toast.success("Raza eliminada correctamente.");
      queryClient.invalidateQueries({ queryKey: ["admin-breeds"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error eliminando raza."));
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveMutation.mutate(form);
  };

  const handleCancelEdit = () => {
    setEditingBreed(null);
    setForm(emptyForm);
  };

  const handleDelete = (breed) => {
    const shouldDelete = window.confirm(`¿Eliminar la raza ${breed.name}?`);
    if (!shouldDelete) return;

    deleteMutation.mutate(breed.id);
  };

  const filteredBreeds = (breedsQuery.data ?? []).filter((breed) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;

    return (
      breed.name?.toLowerCase().includes(term) ||
      breed.speciesName?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold text-purple-600">Panel administrador</p>
          <h1 className="text-4xl font-bold text-gray-900">Razas</h1>
          <p className="mt-2 text-gray-600">
            Crea y administra razas asociadas a cada especie.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <form onSubmit={handleSubmit} className="h-fit rounded-3xl bg-white p-6 shadow">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingBreed ? "Editar raza" : "Nueva raza"}
            </h2>

            <div className="mt-6 grid gap-4">
              <select
                name="speciesId"
                value={form.speciesId}
                onChange={handleChange}
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                required
              >
                <option value="">Seleccionar especie</option>
                {(speciesQuery.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nombre de la raza"
                className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                required
              />

              <button
                type="submit"
                disabled={saveMutation.isPending}
                className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
              >
                {saveMutation.isPending ? "Guardando..." : editingBreed ? "Actualizar raza" : "Crear raza"}
              </button>

              {editingBreed && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>

          <section className="overflow-hidden rounded-3xl bg-white shadow">
            <div className="border-b p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Listado de razas</h2>
                  <p className="mt-1 text-gray-500">Filtra por especie o nombre.</p>
                </div>

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar raza..."
                  className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-6 py-4">Raza</th>
                    <th className="px-6 py-4">Especie</th>
                    <th className="px-6 py-4">Mascotas usando esta raza</th>
                    <th className="px-6 py-4">Acciones</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {breedsQuery.isLoading ? (
                    <tr>
                      <td className="px-6 py-8 text-center text-gray-500" colSpan="4">
                        Cargando razas...
                      </td>
                    </tr>
                  ) : filteredBreeds.length > 0 ? (
                    filteredBreeds.map((breed) => (
                      <tr key={breed.id}>
                        <td className="px-6 py-4 font-bold text-gray-900">{breed.name}</td>
                        <td className="px-6 py-4">{breed.speciesName}</td>
                        <td className="px-6 py-4">{breed.petsCount ?? 0}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setEditingBreed(breed)}
                              className="rounded-xl bg-purple-100 px-4 py-2 font-semibold text-purple-700 hover:bg-purple-200"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(breed)}
                              className="rounded-xl bg-red-100 px-4 py-2 font-semibold text-red-700 hover:bg-red-200"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-6 py-8 text-center text-gray-500" colSpan="4">
                        No hay razas para mostrar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
