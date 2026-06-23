import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../../components/layout/Navbar";
import PublisherPetForm from "../../components/publisher/PublisherPetForm";
import { publisherPetsApi } from "../../api/publisherPetsApi";
import { publisherCatalogsApi } from "../../api/publisherCatalogsApi";

const emptyForm = {
  name: "",
  gender: "",
  speciesId: "",
  breedId: "",
  sizeId: "",
  birthDate: "",
  rescuedAt: "",
  description: "",
  medicalNotes: "",
  isVaccinated: false,
  isSterilized: false,
  isDewormed: false,
};

function getErrorMessage(error, fallback) {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.title) return data.title;

  return fallback;
}

export default function PublisherPetCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);

  const speciesQuery = useQuery({
    queryKey: ["publisher-species"],
    queryFn: async () => {
      const res = await publisherCatalogsApi.getSpecies();
      return res.data;
    },
  });

  const breedsQuery = useQuery({
    queryKey: ["publisher-breeds"],
    queryFn: async () => {
      const res = await publisherCatalogsApi.getBreeds();
      return res.data;
    },
  });

  const sizesQuery = useQuery({
    queryKey: ["publisher-sizes"],
    queryFn: async () => {
      const res = await publisherCatalogsApi.getSizes();
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        gender: form.gender || null,
        speciesId: Number(form.speciesId),
        breedId: form.breedId ? Number(form.breedId) : null,
        sizeId: Number(form.sizeId),
        birthDate: form.birthDate || null,
        rescuedAt: form.rescuedAt || null,
        description: form.description || null,
        medicalNotes: form.medicalNotes || null,
        isVaccinated: form.isVaccinated,
        isSterilized: form.isSterilized,
        isDewormed: form.isDewormed,
      };

      const petRes = await publisherPetsApi.create(payload);
      const petId = petRes.data.petId;

      if (image) {
        await publisherPetsApi.uploadImage(petId, image);
      }

      return petRes.data;
    },
    onSuccess: () => {
      toast.success("Mascota publicada correctamente.");
      navigate("/publisher/pets");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error publicando mascota."));
    },
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "speciesId" ? { breedId: "" } : {}),
    }));
  };

  const handleImageChange = (event) => {
    setImage(event.target.files?.[0] ?? null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createMutation.mutate();
  };

  const isLoading =
    speciesQuery.isLoading || breedsQuery.isLoading || sizesQuery.isLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />

      <main className="mx-auto max-w-5xl px-6 py-10">
        {isLoading ? (
          <div className="rounded-3xl bg-white p-6 shadow">
            Cargando formulario...
          </div>
        ) : (
          <PublisherPetForm
            form={form}
            species={speciesQuery.data ?? []}
            breeds={breedsQuery.data ?? []}
            sizes={sizesQuery.data ?? []}
            image={image}
            isSaving={createMutation.isPending}
            onChange={handleChange}
            onImageChange={handleImageChange}
            onSubmit={handleSubmit}
          />
        )}
      </main>
    </div>
  );
}
