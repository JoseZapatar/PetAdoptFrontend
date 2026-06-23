export default function PetFilters({ filters, setFilters }) {
  const update = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      species: "",
      size: "",
      gender: "",
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6" id="catalogo">
      <div className="rounded-3xl bg-white p-4 shadow sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <input
            value={filters.search}
            onChange={(event) => update("search", event.target.value)}
            placeholder="Buscar mascota..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
          />

          <select
            value={filters.species}
            onChange={(event) => update("species", event.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
          >
            <option value="">Todas las especies</option>
            <option value="perro">Perros</option>
            <option value="gato">Gatos</option>
            <option value="ave">Aves</option>
            <option value="hamster">Hamster</option>
          </select>

          <select
            value={filters.size}
            onChange={(event) => update("size", event.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
          >
            <option value="">Todos los tamaños</option>
            <option value="pequeño">Pequeño</option>
            <option value="mediano">Mediano</option>
            <option value="grande">Grande</option>
            <option value="gigante">Gigante</option>
          </select>

          <select
            value={filters.gender}
            onChange={(event) => update("gender", event.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
          >
            <option value="">Todos los géneros</option>
            <option value="macho">Macho</option>
            <option value="hembra">Hembra</option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 sm:col-span-2 lg:col-span-1"
          >
            Limpiar
          </button>
        </div>
      </div>
    </section>
  );
}
