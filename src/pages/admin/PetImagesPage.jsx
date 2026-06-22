import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "../../components/layout/Navbar";
import { petImagesApi } from "../../api/petImagesApi";

const API_URL = "http://localhost:5051";

export default function PetImagesPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [isPrimary, setIsPrimary] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["pet-images", petId],
    queryFn: async () => {
      const res = await petImagesApi.getByPet(petId);
      return res.data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: () => petImagesApi.upload(petId, file, isPrimary),
    onSuccess: async () => {
      setFile(null);
      setIsPrimary(false);
      setFileInputKey(Date.now());

      await queryClient.invalidateQueries({
        queryKey: ["pet-images", petId],
      });

      await refetch();

      alert("Imagen subida correctamente.");
    },
    onError: (error) => {
      alert(error.response?.data || "Error subiendo imagen.");
    },
  });

  const primaryMutation = useMutation({
    mutationFn: (imageId) => petImagesApi.setPrimary(imageId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pet-images", petId],
      });
      await refetch();
    },
    onError: (error) => {
      alert(error.response?.data || "Error cambiando imagen principal.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId) => petImagesApi.delete(imageId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["pet-images", petId],
      });
      await refetch();

      alert("Imagen eliminada correctamente.");
    },
    onError: (error) => {
      alert(error.response?.data || "Error eliminando imagen.");
    },
  });

  const handleUpload = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Selecciona una imagen.");
      return;
    }

    uploadMutation.mutate();
  };

  if (isLoading) return <p className="p-10">Cargando imágenes...</p>;
  if (error) return <p className="p-10">Error cargando imágenes.</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <button
          onClick={() => navigate("/admin/ManagePets")}
          className="mb-6 rounded-xl border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
        >
          Volver
        </button>

        <h1 className="text-4xl font-bold text-gray-900">
          Imágenes de mascota #{petId}
        </h1>

        <form
          onSubmit={handleUpload}
          className="mt-8 rounded-3xl bg-white p-6 shadow"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Subir nueva imagen
          </h2>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
            <input
              key={fileInputKey}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="rounded-xl border p-3"
            />

            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
              />
              Imagen principal
            </label>

            <button
              disabled={uploadMutation.isPending}
              className="rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
            >
              {uploadMutation.isPending ? "Subiendo..." : "Subir imagen"}
            </button>
          </div>
        </form>

        <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow">
              Esta mascota todavía no tiene imágenes.
            </div>
          ) : (
            data.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-3xl bg-white shadow"
              >
                <img
                  src={`${API_URL}${image.imageUrl}?v=${image.id}-${image.createdAt}`}
                  alt={`Imagen ${image.id}`}
                  className="h-64 w-full object-cover"
                />

                <div className="p-5">
                  {image.isPrimary ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      Principal
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600">
                      Secundaria
                    </span>
                  )}

                  <div className="mt-5 flex gap-2">
                    {!image.isPrimary && (
                      <button
                        onClick={() => primaryMutation.mutate(image.id)}
                        className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
                      >
                        Hacer principal
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm("¿Eliminar esta imagen?")) {
                          deleteMutation.mutate(image.id);
                        }
                      }}
                      className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}