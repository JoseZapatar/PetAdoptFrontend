import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "../../components/layout/Navbar";
import PublisherPetForm from "../../components/publisher/PublisherPetForm";
import PublisherPetsTable from "../../components/publisher/PublisherPetsTable";
import PublisherRequestsTable from "../../components/publisher/PublisherRequestsTable";
import { publisherPetsApi } from "../../api/publisherPetsApi";
import { publisherCatalogsApi } from "../../api/publisherCatalogsApi";
import { useAuthStore } from "../../store/authStore";

function getErrorMessage(error, fallback) {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.title) return data.title;
  return fallback;
}

function toNullableNumber(value) {
  if (value === "" || value === null || value === undefined) return null;
  return Number(value);
}

function toNullableDate(value) {
  return value || null;
}

export default function PublisherDashboard() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const catalogsQuery = useQuery({
    queryKey: ["publisher-catalogs"],
    queryFn: async () => {
      const [speciesRes, breedsRes, sizesRes, statusesRes] = await Promise.all([
        publisherCatalogsApi.getSpecies(),
        publisherCatalogsApi.getBreeds(),
        publisherCatalogsApi.getSizes(),
        publisherCatalogsApi.getStatuses(),
      ]);

      return {
        species: speciesRes.data,
        breeds: breedsRes.data,
        sizes: sizesRes.data,
        statuses: statusesRes.data,
      };
    },
  });

  const petsQuery = useQuery({
    queryKey: ["publisher-pets"],
    queryFn: async () => {
      const res = await publisherPetsApi.getMyPets();
      return res.data;
    },
  });

  const requestsQuery = useQuery({
    queryKey: ["publisher-requests"],
    queryFn: async () => {
      const res = await publisherPetsApi.getRequests();
      return res.data;
    },
  });

  const refreshPublisherData = () => {
    queryClient.invalidateQueries({ queryKey: ["publisher-pets"] });
    queryClient.invalidateQueries({ queryKey: ["publisher-requests"] });
  };

  const createPetMutation = useMutation({
    mutationFn: async ({ form, image }) => {
      const payload = {
        name: form.name,
        speciesId: Number(form.speciesId),
        breedId: toNullableNumber(form.breedId),
        sizeId: Number(form.sizeId),
        statusId: Number(form.statusId),
        gender: form.gender || null,
        description: form.description || null,
        birthDate: toNullableDate(form.birthDate),
        rescuedAt: toNullableDate(form.rescuedAt),
        isVaccinated: form.isVaccinated,
        isSterilized: form.isSterilized,
        isDewormed: form.isDewormed,
        medicalNotes: form.medicalNotes || null,
      };

      const petRes = await publisherPetsApi.create(payload);
      const petId = petRes.data.petId;

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("isPrimary", "true");
        await publisherPetsApi.uploadImage(petId, formData);
      }

      return petRes.data;
    },
    onSuccess: () => {
      toast.success("Mascota publicada correctamente.");
      refreshPublisherData();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error publicando mascota."));
    },
  });

  const approveMutation = useMutation({
    mutationFn: (request) =>
      publisherPetsApi.approveRequest(request.id, {
        reviewedByUserId: user.id,
        decisionNotes: "Solicitud aprobada.",
      }),
    onSuccess: () => {
      toast.success("Solicitud aprobada correctamente.");
      refreshPublisherData();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error aprobando solicitud."));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (request) =>
      publisherPetsApi.rejectRequest(request.id, {
        reviewedByUserId: user.id,
        decisionNotes: "Solicitud rechazada.",
      }),
    onSuccess: () => {
      toast.success("Solicitud rechazada correctamente.");
      refreshPublisherData();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Error rechazando solicitud."));
    },
  });

  const catalogs = catalogsQuery.data ?? {
    species: [],
    breeds: [],
    sizes: [],
    statuses: [],
  };

  const pets = petsQuery.data ?? [];
  const requests = requestsQuery.data ?? [];
  const isLoading = catalogsQuery.isLoading || petsQuery.isLoading || requestsQuery.isLoading;
  const hasError = catalogsQuery.error || petsQuery.error || requestsQuery.error;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ToastContainer position="top-right" autoClose={2500} />

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-purple-600">Panel publicador</p>
            <h1 className="text-4xl font-bold text-gray-900">Mis publicaciones</h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Publica mascotas en adopción y revisa las solicitudes que reciben tus publicaciones.
            </p>
          </div>
        </div>

        {hasError && (
          <div className="mb-6 rounded-2xl bg-red-100 p-4 font-semibold text-red-700">
            Error cargando el panel de publicador. Revisa permisos, catálogos y conexión con el API.
          </div>
        )}

        {isLoading ? (
          <p className="rounded-3xl bg-white p-6 shadow">Cargando panel...</p>
        ) : (
          <div className="grid gap-8">
            <PublisherPetForm
              catalogs={catalogs}
              isSaving={createPetMutation.isPending}
              onSubmit={(data) => createPetMutation.mutateAsync(data)}
            />

            <PublisherRequestsTable
              requests={requests}
              isSaving={approveMutation.isPending || rejectMutation.isPending}
              onApprove={(request) => approveMutation.mutate(request)}
              onReject={(request) => rejectMutation.mutate(request)}
            />

            <PublisherPetsTable pets={pets} />
          </div>
        )}
      </main>
    </div>
  );
}
