export default function Footer({ local }) {
  return (
    <footer className="w-full bg-bg-secondary border-t border-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Marca y Resumen */}
          <div className="max-w-sm">
            <h3 className="text-xl font-extrabold uppercase tracking-widest text-text-primary mb-3">{local?.nombre}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{local?.descripcion}</p>
          </div>

          {/* Horarios de Atención */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-text-primary mb-4">Horarios de Atención</h4>
            <div className="space-y-3 text-sm">
              <div className="max-w-[240px]">
                <span className="text-text-secondary block mb-1">Horario</span>
                <span className="font-semibold text-text-primary block whitespace-pre-line">{local?.horarios_atencion || "Consultar horarios"}</span>
              </div>
            </div>
          </div>

          {/* Redes y Contacto */}
          <div className="max-w-xs md:text-left">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-text-primary mb-4">Contacto y Redes</h4>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">Escribinos por cualquier consulta o para realizar tu pedido:</p>

            <div className="flex items-center gap-4">
              {/* Instagram */}
              <a
                href={local?.instagram?.startsWith("http") ? local.instagram : `https://instagram.com/${local?.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-custom bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-accent-hover hover:border-accent transition-all cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${local?.whatsapp}?text=Hola!%20Quería%20consultar%20por%20un%20producto.`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-custom bg-bg-card border border-border flex items-center justify-center text-text-secondary hover:text-accent-hover hover:border-accent transition-all cursor-pointer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <p>
            © {new Date().getFullYear()} {local?.nombre}. Todos los derechos reservados.
          </p>
          <p className="tracking-wide">Diseñado y adaptado para vos</p>
        </div>
      </div>
    </footer>
  );
}
