// Este archivo contiene exclusivamente el renderizado del formulario, 
// recibiendo por props lo que necesita.

export default function Formulario({ form, editandoId, procesando, handleChange, manejarSubmit, cancelarEdicion }) {
  return (
    <div className="lg:col-span-1 bg-bg-card p-6 rounded-custom border border-border shadow-sm h-fit">
      <h2 className="text-xl font-bold text-text-primary mb-4">{editandoId ? "Editar Reseña" : "Nueva Reseña"}</h2>
      <form onSubmit={manejarSubmit} className="flex flex-col gap-4 text-sm">
        <div>
          <label className="block text-text-secondary font-semibold mb-1">Nombre del Cliente</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-text-secondary font-semibold mb-1">Calificación (1 a 5)</label>
          <select
            name="cant_estrellas"
            value={form.cant_estrellas}
            onChange={handleChange}
            required
            className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 outline-none focus:border-accent cursor-pointer"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "Estrella" : "Estrellas"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-text-secondary font-semibold mb-1">Comentario</label>
          <textarea
            name="comentario"
            value={form.comentario}
            onChange={handleChange}
            required
            rows="4"
            className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 outline-none focus:border-accent resize-none"
          ></textarea>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            disabled={procesando}
            className="flex-1 bg-accent hover:bg-accent-hover text-bg-custom font-bold py-2.5 rounded-custom transition-colors cursor-pointer disabled:opacity-50"
          >
            {procesando ? "Guardando..." : editandoId ? "Actualizar" : "Crear"}
          </button>
          {editandoId && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="px-4 bg-bg-secondary text-text-primary font-semibold rounded-custom border border-border hover:bg-border transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
