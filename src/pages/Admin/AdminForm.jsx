// Este archivo contiene exclusivamente el renderizado del formulario, recibiendo por props lo que necesita.
import { CATEGORIAS } from "../../config";

export default function AdminForm({
  form,
  editandoId,
  procesando,
  archivosSeleccionados,
  fileInputRef,
  handleChange,
  handleCategoriaChange,
  handleFilesChange,
  eliminarImagenExistente,
  manejarSubmit,
  cancelarEdicion,
}) {
  return (
    <div className="lg:col-span-1 bg-bg-card p-6 rounded-custom border border-border shadow-sm h-fit">
      <h2 className="text-xl font-bold text-text-primary mb-4">{editandoId ? "Editar Producto" : "Nuevo Producto"}</h2>
      <form onSubmit={manejarSubmit} className="flex flex-col gap-4 text-sm">
        <div>
          <label className="block text-text-secondary font-semibold mb-1">Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 outline-none focus:border-accent"
          />
        </div>

        {/* Selector de Categoría */}
        <div>
          <label className="block text-text-secondary font-semibold mb-1">Categoría</label>
          <select
            name="categoria_slug"
            value={form.categoria_slug}
            onChange={handleCategoriaChange}
            required
            className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 outline-none focus:border-accent cursor-pointer"
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {CATEGORIAS.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Precio único */}
        <div>
          <label className="block text-text-secondary font-semibold mb-1">Precio Contado / Transferencia</label>
          <input
            name="precio_contado"
            value={form.precio_contado}
            onChange={handleChange}
            required
            placeholder="$70.500"
            className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 outline-none focus:border-accent"
          />
        </div>

        {/* Selector de Imágenes */}
        <div>
          <label className="block text-text-secondary font-semibold mb-1">Imágenes del Producto</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 outline-none focus:border-accent text-xs file:mr-4 file:py-1 file:px-3 file:rounded-custom file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-bg-custom hover:file:bg-accent-hover cursor-pointer"
          />

          {archivosSeleccionados.length > 0 && <p className="text-xs text-text-secondary mt-1">{archivosSeleccionados.length} nueva(s) imagen(es) seleccionada(s).</p>}

          {form.imgs && form.imgs.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-text-secondary mb-1">Imágenes actuales:</p>
              <div className="flex flex-wrap gap-2">
                {form.imgs.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url} alt="preview" className="w-12 h-12 object-cover rounded-md border border-border" />
                    <button
                      type="button"
                      onClick={() => eliminarImagenExistente(url)}
                      className="absolute -top-1.5 -right-1.5 bg-accent text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-accent-hover cursor-pointer"
                      title="Quitar imagen"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-text-secondary font-semibold mb-1">Talles (separados por coma)</label>
          <input
            name="talles"
            value={form.talles}
            onChange={handleChange}
            placeholder="S, M, L, XL"
            className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} id="destacado" className="w-4 h-4 accent-accent" />
          <label htmlFor="destacado" className="text-text-primary font-semibold cursor-pointer">
            ¿Producto destacado?
          </label>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            disabled={procesando}
            className="flex-1 bg-accent hover:bg-accent-hover text-bg-custom font-bold py-2.5 rounded-custom transition-colors cursor-pointer disabled:opacity-50"
          >
            {procesando ? "Subiendo imágenes..." : editandoId ? "Actualizar" : "Crear"}
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
