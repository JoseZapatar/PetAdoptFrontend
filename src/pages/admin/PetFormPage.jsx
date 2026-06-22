import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { petsApi } from "../../api/petsApi";
import { axiosClient } from "../../api/axiosClient";

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

  const [form, setForm] = useState({
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
  });

  useEffect(() => {
    loadCatalogs();
    if (isEdit) loadPet();
  }, [id]);

  const loadCatalogs = async () => {
    const [species, breeds, sizes, statuses] = await Promise.all([
      axiosClient.get("/Catalogs/species"),
      axiosClient.get("/Catalogs/breeds"),
      axiosClient.get("/Catalogs/sizes"),
      axiosClient.get("/Catalogs/pet-statuses"),
    ]);

    setCatalogs({
      species: species.data,
      breeds: breeds.data,
      sizes: sizes.data,
      statuses: statuses.data,
    });
  };

  const loadPet = async () => {
    const res = await petsApi.getById(id);
    const pet = res.data;

    setForm({
      name: pet.name || "",
      speciesId: "",
      breedId: "",
      sizeId: "",
      statusId: "",
      gender: pet.gender || "",
      description: pet.description || "",
      birthDate: pet.birthDate ? pet.birthDate.slice(0, 10) : "",
      isVaccinated: pet.isVaccinated || false,
      isSterilized: pet.isSterilized || false,
      isDewormed: pet.isDewormed || false,
      medicalNotes: pet.medicalNotes || "",
      rescuedAt: pet.rescuedAt ? pet.rescuedAt.slice(0, 10) : "",
    });

    alert(
      "Para editar, selecciona nuevamente especie, raza, tamaño y estado porque el GET devuelve nombres, no IDs."
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      speciesId: Number(form.speciesId),
      breedId: form.breedId ? Number(form.breedId) : null,
      sizeId: Number(form.sizeId),
      statusId: Number(form.statusId),
      gender: form.gender,
      description: form.description,
      birthDate: form.birthDate || null,
      isVaccinated: form.isVaccinated,
      isSterilized: form.isSterilized,
      isDewormed: form.isDewormed,
      medicalNotes: form.medicalNotes || null,
      rescuedAt: form.rescuedAt || null,
    };

    try {
      if (isEdit) {
        await petsApi.update(id, payload);
        alert("Mascota actualizada correctamente.");
      } else {
        await petsApi.create(payload);
        alert("Mascota creada correctamente.");
      }

      navigate("/admin/ManagePets");
    } catch (error) {
      alert(error.response?.data || "Error guardando mascota.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-3xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Editar mascota" : "Nueva mascota"}
          </h1>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre"
              className="rounded-xl border p-3"
              required
            />

            <select
              name="speciesId"
              value={form.speciesId}
              onChange={handleChange}
              className="rounded-xl border p-3"
              required
            >
              <option value="">Seleccionar especie</option>
              {catalogs.species.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              name="breedId"
              value={form.breedId}
              onChange={handleChange}
              className="rounded-xl border p-3"
            >
              <option value="">Seleccionar raza</option>
              {catalogs.breeds.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              name="sizeId"
              value={form.sizeId}
              onChange={handleChange}
              className="rounded-xl border p-3"
              required
            >
              <option value="">Seleccionar tamaño</option>
              {catalogs.sizes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              name="statusId"
              value={form.statusId}
              onChange={handleChange}
              className="rounded-xl border p-3"
              required
            >
              <option value="">Seleccionar estado</option>
              {catalogs.statuses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="rounded-xl border p-3"
            >
              <option value="">Seleccionar género</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descripción"
              className="rounded-xl border p-3"
              rows="4"
            />

            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
              className="rounded-xl border p-3"
            />

            <input
              type="date"
              name="rescuedAt"
              value={form.rescuedAt}
              onChange={handleChange}
              className="rounded-xl border p-3"
            />

            <textarea
              name="medicalNotes"
              value={form.medicalNotes}
              onChange={handleChange}
              placeholder="Notas médicas"
              className="rounded-xl border p-3"
              rows="3"
            />

            <label>
              <input
                type="checkbox"
                name="isVaccinated"
                checked={form.isVaccinated}
                onChange={handleChange}
              />{" "}
              Vacunado
            </label>

            <label>
              <input
                type="checkbox"
                name="isSterilized"
                checked={form.isSterilized}
                onChange={handleChange}
              />{" "}
              Esterilizado
            </label>

            <label>
              <input
                type="checkbox"
                name="isDewormed"
                checked={form.isDewormed}
                onChange={handleChange}
              />{" "}
              Desparasitado
            </label>

            <button className="rounded-xl bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700">
              {isEdit ? "Actualizar mascota" : "Crear mascota"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}