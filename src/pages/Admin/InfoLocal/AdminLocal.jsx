import AdminLayout from "../AdminLayout";
import { useLocal } from "./useLocal";
import { Save } from "lucide-react";
import PantallaCarga from "../../../components/PantallaCarga";
import { procesarLinkMaps } from "./procesarLinkMaps";

export default function AdminLocal() {
  const { cargando, procesando, form, handleChange, manejarSubmit } = useLocal();

  // Obtiene la URL limpia solo si es un embed válido de Google Maps; si no, devuelve null
  const urlEmbedValida = procesarLinkMaps(form.ubicacion);

  if (cargando) {
    return <PantallaCarga />;
  }

  return (
    <AdminLayout maxWidth="max-w-3xl">
      <div className="bg-bg-card border border-border rounded-custom p-6 md:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Información del Local</h1>

        <form onSubmit={manejarSubmit} className="flex flex-col gap-5 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-text-secondary font-semibold mb-1.5">Nombre del Local</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-4 py-2.5 outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-text-secondary font-semibold mb-1.5">Número de WhatsApp</label>
              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="Ej: +549264..."
                className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-4 py-2.5 outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-text-secondary font-semibold mb-1.5">Usuario de Instagram</label>
              <input
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="Ej: @mi_local"
                className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-4 py-2.5 outline-none focus:border-accent transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-text-secondary font-semibold mb-1.5">Horarios de Atención</label>
              <textarea
                name="horarios_atencion"
                value={form.horarios_atencion}
                onChange={handleChange}
                rows="3"
                placeholder={"Ej:\nLunes a Viernes: 9:00 a 13:00 y 17:00 a 21:00\nSábados: 9:30 a 13:30"}
                className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-4 py-2.5 outline-none focus:border-accent transition-colors resize-none"
              ></textarea>
            </div>
          </div>

          <div>
            <label className="block text-text-secondary font-semibold mb-1">Mapa de Google Maps (Opción "Insertar un mapa")</label>
            <p className="text-xs text-text-secondary mb-2">
              En Google Maps tocá <span className="text-accent">Compartir</span> → pestaña <span className="text-accent">Insertar un mapa</span> → copiá y pegá el código o link acá.
            </p>
            <input
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              placeholder='<iframe src="https://www.google.com/maps/embed?..." ...></iframe>'
              className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-4 py-2.5 outline-none focus:border-accent transition-colors font-mono text-xs"
            />

            {/* Vista previa en tiempo real */}
            {form.ubicacion && (
              <div className="mt-3">
                {urlEmbedValida ? (
                  <>
                    <p className="text-xs font-semibold text-text-secondary mb-1">Vista previa del mapa:</p>
                    <div className="w-full h-44 rounded-custom overflow-hidden border border-border bg-bg-custom">
                      <iframe
                        src={urlEmbedValida}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Vista previa del mapa"
                      ></iframe>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-amber-500 font-medium">El enlace ingresado no es un embed válido de Google Maps.</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-text-secondary font-semibold mb-1.5">Descripción Corta</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows="3"
              placeholder="Cuenta brevemente qué ofrece tu local..."
              className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-4 py-2.5 outline-none focus:border-accent transition-colors resize-none"
            ></textarea>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={procesando}
              className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg-custom font-bold px-6 py-2.5 rounded-custom transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {procesando ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
