import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { reviewsApi } from "../../api/reviewsApi";
import { useAuthStore } from "../../store/authStore";

export default function ReviewsSection({ petId }) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [form, setForm] = useState({
    rating: 5,
    comment: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["reviews", petId],
    queryFn: async () => {
      const res = await reviewsApi.getByPet(petId);
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: () =>
      reviewsApi.create({
        petId: Number(petId),
        rating: Number(form.rating),
        comment: form.comment,
      }),

    onSuccess: () => {
      setForm({
        rating: 5,
        comment: "",
      });

      queryClient.invalidateQueries({
        queryKey: ["reviews", petId],
      });

      alert("Valoración enviada correctamente.");
    },

    onError: (error) => {
      alert(error.response?.data || "Error enviando valoración.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Debes iniciar sesión para valorar.");
      return;
    }

    if (!form.comment.trim()) {
      alert("Escribe un comentario.");
      return;
    }

    createMutation.mutate();
  };

  if (isLoading) return <p className="mt-8">Cargando valoraciones...</p>;
  if (error) return <p className="mt-8">Error cargando valoraciones.</p>;

  const average =
    data?.length > 0
      ? (
          data.reduce((sum, review) => sum + review.rating, 0) / data.length
        ).toFixed(1)
      : "0.0";

  return (
    <section className="mt-10 rounded-3xl bg-white p-8 shadow">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Valoraciones</h2>
          <p className="mt-1 text-gray-500">
            Promedio {average} de 5 · {data?.length || 0} comentarios
          </p>
        </div>

        <div className="flex items-center gap-1 text-yellow-500">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={22}
              fill={Number(average) >= star ? "currentColor" : "none"}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 rounded-2xl bg-gray-50 p-5">
        <h3 className="font-bold text-gray-900">Dejar valoración</h3>

        <select
          value={form.rating}
          onChange={(e) =>
            setForm({
              ...form,
              rating: e.target.value,
            })
          }
          className="mt-4 w-full rounded-xl border px-4 py-3"
        >
          <option value={5}>5 estrellas</option>
          <option value={4}>4 estrellas</option>
          <option value={3}>3 estrellas</option>
          <option value={2}>2 estrellas</option>
          <option value={1}>1 estrella</option>
        </select>

        <textarea
          rows="4"
          value={form.comment}
          onChange={(e) =>
            setForm({
              ...form,
              comment: e.target.value,
            })
          }
          placeholder="Escribe tu comentario..."
          className="mt-4 w-full rounded-xl border px-4 py-3"
        />

        <button
          disabled={createMutation.isPending}
          className="mt-4 rounded-xl bg-purple-600 px-5 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-60"
        >
          {createMutation.isPending ? "Enviando..." : "Enviar valoración"}
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {data?.length === 0 ? (
          <p className="text-gray-500">Esta mascota aún no tiene valoraciones.</p>
        ) : (
          data.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900">{review.userName}</h4>

                <div className="flex text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      fill={review.rating >= star ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              </div>

              <p className="mt-3 text-gray-600">{review.comment}</p>

              <p className="mt-2 text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}