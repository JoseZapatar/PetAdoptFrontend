import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../../components/layout/Navbar";
import { petsApi } from "../../api/petsApi";
import { axiosClient } from "../../api/axiosClient";

const emptyForm = {
  name: "",
  speciesId: "",
  breedId: "",
  sizeId: "",
  statusId: "",
  gender: "",
  description: "",
  birthDate: "",
  isVaccinated: false,
  isSterilized: false,
  isDewormed: false,
  medicalNotes: "",
  rescuedAt: "",
};

function findIdByName(items, name) {
  if (!name) return "";

  const normalizedName = String(name).trim().toLowerCase();

  const item = items.find(
    (current) => String(current.name).trim().toLowerCase() === normalizedName
  );

  return item ? String(item.id) : "";
}

function toInputDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function getErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.title) return data.title;

  return fallback;
}

export default function PetFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [catalogs, setCatalogs] = useState({
    species: [],
    breeds: [],
    sizes: [],
    statuses: [],
  });

  const [form, setForm] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    setIsLoading(true);

    try {
      const [speciesRes, breedsRes, sizesRes, statusesRes, petRes] =
        await Promise.all([
          axiosClient.get("/Catalogs/species"),
          axiosClient.get("/Catalogs/breeds"),
          axiosClient.get("/Catalogs/sizes"),
          axiosClient.get("/Catalogs/pet-statuses"),
          isEdit ? petsApi.getById(id) : Promise.resolve(null),
        ]);

      const nextCatalogs = {
        species: speciesRes.data ?? [],
        breeds: breedsRes.data ?? [],
        sizes: sizesRes.data ?? [],
        statuses: statusesRes.data ?? [],
      };

      setCatalogs(nextCatalogs);

      if (isEdit && petRes?.data) {
        const pet = petRes.data;

        setForm({
          name: pet.name || "",
          speciesId: pet.speciesId
            ? String(pet.speciesId)
            : findIdByName(nextCatalogs.species, pet.speciesName),
          breedId: pet.breedId
            ? String(pet.breedId)
            : findIdByName(nextCatalogs.breeds, pet.breedName),
          sizeId: pet.sizeId
            ? String(pet.sizeId)
            : findIdByName(nextCatalogs.sizes, pet.sizeName),
          statusId: pet.statusId
            ? String(pet.statusId)
            : findIdByName(nextCatalogs.statuses, pet.statusName),
          gender: pet.gender || "",
          description: pet.description || "",
          birthDate: toInputDate(pet.birthDate),
          isVaccinated: Boolean(pet.isVaccinated),
          isSterilized: Boolean(pet.isSterilized),
          isDewormed: Boolean(pet.isDewormed),
          medicalNotes: pet.medicalNotes || "",
          rescuedAt: toInputDate(pet.rescuedAt),
        });
      } else {
        setForm(emptyForm);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Error cargando el formulario."));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBreeds = useMemo(() => {
    if (!form.speciesId) return catalogs.breeds;

    return catalogs.breeds.filter(
      (breed) => String(breed.speciesId) === String(form.speciesId)
    );
  }, [catalogs.breeds, form.speciesId]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "speciesId" ? { breedId: "" } : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("El nombre de la mascota es obligatorio.");
      return;
    }

    if (!form.speciesId || !form.sizeId || !form.statusId) {
      toast.error("Selecciona especie, tamaño y estado.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      speciesId: Number(form.speciesId),
      breedId: form.breedId ? Number(form.breedId) : null,
      sizeId: Number(form.sizeId),
      statusId: Number(form.statusId),
      gender: form.gender || null,
      description: form.description || null,
      birthDate: form.birthDate || null,
      isVaccinated: form.isVaccinated,
      isSterilized: form.isSterilized,
      isDewormed: form.isDewormed,
      medicalNotes: form.medicalNotes || null,
      rescuedAt: form.rescuedAt || null,
    };

    setIsSaving(true);

    try {
      if (isEdit) {
        await petsApi.update(id, payload);
        toast.success("Mascota actualizada correctamente.");
      } else {
        await petsApi.create(payload);
        toast.success("Mascota creada correctamente.");
      }

      navigate("/admin/ManagePets");
    } catch (error) {
      toast.error(getErrorMessage(error, "Error guardando mascota."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />

      <main className="mx-auto max-w-4xl px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-white p-8 shadow-xl"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              {isEdit ? "Editar mascota" : "Nueva mascota"}
            </h1>
            <p className="mt-2 text-gray-500">
              Administra los datos principales de la mascota.
            </p>
          </div>

          {isLoading ? (
            <p className="rounded-2xl bg-gray-50 p-5 text-gray-600">
              Cargando información...
            </p>
          ) : (
            <div className="grid gap-5">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Nombre
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nombre de la mascota"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Especie
                  </label>
                  <select
                    name="speciesId"
                    value={form.speciesId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Seleccionar especie</option>
                    {catalogs.species.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Raza
                  </label>
                  <select
                    name="breedId"
                    value={form.breedId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                  >
                    <option value="">Seleccionar raza</option>
                    {filteredBreeds.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Tamaño
                  </label>
                  <select
                    name="sizeId"
                    value={form.sizeId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Seleccionar tamaño</option>
                    {catalogs.sizes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Estado
                  </label>
                  <select
                    name="statusId"
                    value={form.statusId}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                    required
                  >
                    <option value="">Seleccionar estado</option>
                    {catalogs.statuses.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Género
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                  >
                    <option value="">Seleccionar género</option>
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={form.birthDate}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    Fecha de rescate
                  </label>
                  <input
                    type="date"
                    name="rescuedAt"
                    value={form.rescuedAt}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Descripción"
                  className="min-h-32 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Notas médicas
                </label>
                <textarea
                  name="medicalNotes"
                  value={form.medicalNotes}
                  onChange={handleChange}
                  placeholder="Notas médicas"
                  className="min-h-24 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="flex items-center gap-2 rounded-2xl border border-gray-200 p-4 text-gray-700">
                  <input
                    type="checkbox"
                    name="isVaccinated"
                    checked={form.isVaccinated}
                    onChange={handleChange}
                  />
                  Vacunado
                </label>

                <label className="flex items-center gap-2 rounded-2xl border border-gray-200 p-4 text-gray-700">
                  <input
                    type="checkbox"
                    name="isSterilized"
                    checked={form.isSterilized}
                    onChange={handleChange}
                  />
                  Esterilizado
                </label>

                <label className="flex items-center gap-2 rounded-2xl border border-gray-200 p-4 text-gray-700">
                  <input
                    type="checkbox"
                    name="isDewormed"
                    checked={form.isDewormed}
                    onChange={handleChange}
                  />
                  Desparasitado
                </label>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
              >
                {isSaving
                  ? "Guardando..."
                  : isEdit
                    ? "Actualizar mascota"
                    : "Crear mascota"}
              </button>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
