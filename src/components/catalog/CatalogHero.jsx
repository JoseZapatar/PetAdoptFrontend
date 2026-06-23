import { Link } from "react-router-dom";
import { Heart, PlusCircle, Search, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

function getRoleName(user) {
  return user?.roleName?.toLowerCase();
}

function isPublisherUser(user) {
  return getRoleName(user) === "publicador";
}

export default function CatalogHero() {
  const user = useAuthStore((state) => state.user);
  const isPublisher = isPublisherUser(user);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-purple-600 to-fuchsia-600 shadow-xl">
        <div className="grid gap-8 px-6 py-10 text-white sm:px-8 md:grid-cols-[1.3fr_0.7fr] md:px-10 md:py-14">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Heart size={16} fill="currentColor" />
              Adopciones responsables
            </div>

            <h1 className="mt-5 max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              Encuentra una mascota lista para una nueva oportunidad.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-purple-50 sm:text-lg">
              Explora mascotas disponibles, revisa sus datos y envía una solicitud cuando encuentres una que pueda formar parte de tu hogar.
            </p>

            <div className="mt-7 grid gap-3 sm:flex">
              <a
                href="#catalogo"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-purple-700 transition hover:bg-purple-50"
              >
                <Search size={18} />
                Ver catálogo
              </a>

              {isPublisher && (
                <Link
                  to="/publisher/pets/new"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 px-5 py-3 font-bold text-white transition hover:bg-white/10"
                >
                  <PlusCircle size={18} />
                  Publicar mascota
                </Link>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white/12 p-5 backdrop-blur md:p-6">
            <div className="flex items-center gap-3">
              <span className="rounded-2xl bg-white p-3 text-purple-700">
                <ShieldCheck size={24} />
              </span>
              <div>
                <p className="font-bold">Información clara</p>
                <p className="text-sm text-purple-100">Datos visibles antes de solicitar adopción.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 text-sm text-purple-50">
              <div className="rounded-2xl bg-white/10 p-4">Filtros por especie, tamaño y sexo.</div>
              <div className="rounded-2xl bg-white/10 p-4">Fotos y descripción de cada mascota.</div>
              <div className="rounded-2xl bg-white/10 p-4">Panel separado para adoptantes y publicadores.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
