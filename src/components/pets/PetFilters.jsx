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
    <div className="mx-auto mb-10 max-w-7xl rounded-2xl bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-5">
        <input
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          placeholder="Buscar mascota..."
          className="rounded-xl border px-4 py-3 outline-none focus:border-purple-500"
        />

        <select
          value={filters.species}
          onChange={(e) => update("species", e.target.value)}
          className="rounded-xl border px-4 py-3 outline-none focus:border-purple-500"
        >
          <option value="">Todas las especies</option>
          <option value="perro">Perros</option>
          <option value="gato">Gatos</option>
          <option value="ave">Aves</option>
          <option value="Hamster">Hamster</option>
        </select>

        <select
          value={filters.size}
          onChange={(e) => update("size", e.target.value)}
          className="rounded-xl border px-4 py-3 outline-none focus:border-purple-500"
        >
          <option value="">Todos los tamaños</option>
          <option value="Pequeño">Pequeño</option>
          <option value="mediano">Mediano</option>
          <option value="grande">Grande</option>
          <option value="Gigante">Gigante</option>
        </select>

        <select
          value={filters.gender}
          onChange={(e) => update("gender", e.target.value)}
          className="rounded-xl border px-4 py-3 outline-none focus:border-purple-500"
        >
          <option value="">Todos los géneros</option>
          <option value="macho">Macho</option>
          <option value="hembra">Hembra</option>
        </select>

        <button
          onClick={clearFilters}
          className="rounded-xl border px-4 py-3 font-semibold text-gray-600 hover:bg-gray-50"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}