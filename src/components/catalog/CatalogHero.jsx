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
    <section className="bg-gray-50 px-6 pt-10">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 shadow-2xl">
        <div className="grid gap-8 px-8 py-12 md:grid-cols-[1.2fr_0.8fr] md:px-12 md:py-16">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/20">
              <Heart size={16} fill="currentColor" />
              Adopciones responsables
            </span>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
              Encuentra una mascota lista para una nueva oportunidad.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-purple-50">
              Explora mascotas disponibles, revisa sus datos y envía una solicitud cuando encuentres una que pueda formar parte de tu hogar.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#catalogo"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-purple-700 transition hover:bg-purple-50"
              >
                <Search size={20} />
                Ver catálogo
              </a>

              {isPublisher && (
                <Link
                  to="/publisher/pets/new"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-900/40 px-6 py-3 font-bold text-white ring-1 ring-white/25 transition hover:bg-purple-900/60"
                >
                  <PlusCircle size={20} />
                  Publicar mascota
                </Link>
              )}
            </div>
          </div>

          <div className="hidden items-center justify-center md:flex">
            <div className="w-full max-w-sm rounded-[2rem] bg-white/12 p-5 ring-1 ring-white/20 backdrop-blur">
              <div className="rounded-[1.5rem] bg-white p-5 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                    <Heart size={30} fill="currentColor" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-500">Disponible para adopción</p>
                    <p className="text-2xl font-black text-gray-900">Mascotas verificadas</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <ShieldCheck className="text-green-600" size={22} />
                    <p className="font-semibold text-gray-700">Información clara de cada mascota</p>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <Search className="text-purple-600" size={22} />
                    <p className="font-semibold text-gray-700">Filtros por especie, tamaño y sexo</p>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <PlusCircle className="text-indigo-600" size={22} />
                    <p className="font-semibold text-gray-700">Publicadores con panel propio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
