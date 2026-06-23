function FieldLabel({ children, required = false, hint }) {
  return (
    <div className="mb-2">
      <label className="block text-sm font-semibold text-gray-800">
        {children} {required && <span className="text-red-500">*</span>}
      </label>
      {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
    </div>
  );
}

function SectionTitle({ title, description }) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
  );
}

export default function PublisherPetForm({
  form,
  species,
  breeds,
  sizes,
  image,
  isSaving,
  onChange,
  onImageChange,
  onSubmit,
}) {
  const filteredBreeds = breeds.filter(
    (breed) => String(breed.speciesId) === String(form.speciesId)
  );

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-gray-900">Publicar mascota</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Completa la información de la mascota que quieres dar en adopción.
          Los campos con <span className="font-semibold text-red-500">*</span> son obligatorios.
        </p>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow">
        <SectionTitle
          title="Información básica"
          description="Estos datos ayudan a identificar la mascota."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel required>Nombre de la mascota</FieldLabel>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Ejemplo: Toby"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <FieldLabel hint="Selecciona si es macho o hembra.">Sexo</FieldLabel>
            <select
              name="gender"
              value={form.gender}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
            >
              <option value="">Selecciona una opción</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          </div>

          <div>
            <FieldLabel required>Especie</FieldLabel>
            <select
              name="speciesId"
              value={form.speciesId}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
              required
            >
              <option value="">Selecciona la especie</option>
              {species.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel hint="Primero selecciona la especie.">Raza</FieldLabel>
            <select
              name="breedId"
              value={form.breedId}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
              disabled={!form.speciesId}
            >
              <option value="">Selecciona la raza</option>
              {filteredBreeds.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel required>Tamaño</FieldLabel>
            <select
              name="sizeId"
              value={form.sizeId}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
              required
            >
              <option value="">Selecciona el tamaño</option>
              {sizes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow">
        <SectionTitle
          title="Fechas importantes"
          description="Estos campos son opcionales. Llénalos solo si conoces esa información."
        />

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel
              hint="Si sabes cuándo nació la mascota, colócalo aquí. Si no lo sabes, déjalo vacío."
            >
              Fecha de nacimiento
            </FieldLabel>
            <input
              type="date"
              name="birthDate"
              value={form.birthDate}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <FieldLabel
              hint="Fecha en la que la encontraste, la rescataste o la recibiste."
            >
              Fecha de rescate
            </FieldLabel>
            <input
              type="date"
              name="rescuedAt"
              value={form.rescuedAt}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow">
        <SectionTitle
          title="Descripción y salud"
          description="Explica cómo es la mascota y agrega cualquier detalle médico importante."
        />

        <div className="grid gap-5">
          <div>
            <FieldLabel
              required
              hint="Ejemplo: Es cariñoso, juguetón, le gusta convivir con niños, es tranquilo, etc."
            >
              Descripción de la mascota
            </FieldLabel>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Describe la personalidad, comportamiento y características importantes de la mascota..."
              className="min-h-36 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
              required
            />
          </div>

          <div>
            <FieldLabel hint="Medicinas, alergias, cirugías, cuidados especiales, etc.">
              Notas médicas
            </FieldLabel>
            <textarea
              name="medicalNotes"
              value={form.medicalNotes}
              onChange={onChange}
              placeholder="Ejemplo: Tiene vacunas al día, fue esterilizado hace 3 meses..."
              className="min-h-28 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <FieldLabel hint="Marca las opciones que correspondan.">
              Estado de salud
            </FieldLabel>

            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4 text-gray-700">
                <input
                  type="checkbox"
                  name="isVaccinated"
                  checked={form.isVaccinated}
                  onChange={onChange}
                />
                Vacunado
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4 text-gray-700">
                <input
                  type="checkbox"
                  name="isSterilized"
                  checked={form.isSterilized}
                  onChange={onChange}
                />
                Esterilizado
              </label>

              <label className="flex items-center gap-3 rounded-2xl border border-gray-200 p-4 text-gray-700">
                <input
                  type="checkbox"
                  name="isDewormed"
                  checked={form.isDewormed}
                  onChange={onChange}
                />
                Desparasitado
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow">
        <SectionTitle
          title="Foto de la mascota"
          description="Sube una imagen clara para que los adoptantes puedan verla mejor."
        />

        <div className="grid gap-5">
          <div>
            <FieldLabel
              hint="Formatos permitidos: JPG, PNG o WEBP. Máximo recomendado: 5 MB."
            >
              Imagen principal
            </FieldLabel>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onImageChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
            />

            {image && (
              <div className="mt-3 rounded-2xl bg-purple-50 px-4 py-3 text-sm text-purple-700">
                Archivo seleccionado: <span className="font-semibold">{image.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Revisa la información antes de publicar la mascota.
          </p>

          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-purple-600 px-8 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
          >
            {isSaving ? "Publicando..." : "Publicar mascota"}
          </button>
        </div>
      </div>
    </form>
  );
}