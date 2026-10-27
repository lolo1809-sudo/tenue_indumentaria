// Este componente renderiza puramente la tabla y sus tres estados visuales (cargando, vacía o con productos).

import { useState, useMemo } from "react";

export default function TablaProductos({ cargando, productos, iniciarEdicion, eliminarProducto }) {
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [tallesSeleccionados, setTallesSeleccionados] = useState([]);

  // 1. Obtener categorías únicas presentes en los productos
  const categoriasDisponibles = useMemo(() => {
    const cats = productos.map((p) => p.categoria).filter(Boolean);
    return Array.from(new Set(cats));
  }, [productos]);

  // 2. Obtener talles únicos presentes en los productos
  const tallesDisponibles = useMemo(() => {
    const tallesSet = new Set();
    productos.forEach((p) => {
      if (Array.isArray(p.talles)) {
        p.talles.forEach((t) => t && tallesSet.add(t.trim()));
      }
    });
    return Array.from(tallesSet);
  }, [productos]);

  // Alternar selección de un talle
  const toggleTalle = (talle) => {
    setTallesSeleccionados((prev) => (prev.includes(talle) ? prev.filter((t) => t !== talle) : [...prev, talle]));
  };

  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroCategoria("");
    setTallesSeleccionados([]);
  };

  // 3. Filtrar los productos en memoria
  const productosFiltrados = useMemo(() => {
    return productos.filter((prod) => {
      // Filtro por nombre
      const coincideNombre = (prod.nombre || "").toLowerCase().includes(filtroNombre.toLowerCase().trim());

      // Filtro por categoría
      const coincideCategoria = filtroCategoria ? prod.categoria === filtroCategoria : true;

      // Filtro por talles (si seleccionó talles, el producto debe contener al menos uno)
      const coincideTalle = tallesSeleccionados.length === 0 ? true : Array.isArray(prod.talles) && tallesSeleccionados.some((t) => prod.talles.includes(t));

      return coincideNombre && coincideCategoria && coincideTalle;
    });
  }, [productos, filtroNombre, filtroCategoria, tallesSeleccionados]);

  const hayFiltrosActivos = filtroNombre !== "" || filtroCategoria !== "" || tallesSeleccionados.length > 0;

  return (
    <div className="lg:col-span-2 flex flex-col gap-4">
      {/* SECCIÓN DE FILTROS */}
      <div className="bg-bg-card p-4 rounded-custom border border-border shadow-sm flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Búsqueda por Nombre */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Buscar por nombre</label>
            <input
              type="text"
              placeholder="Ej: Camisa Slim..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 text-sm outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Selector de Categoría */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">Categoría</label>
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 text-sm outline-none focus:border-accent transition-colors cursor-pointer"
            >
              <option value="">Todas las categorías</option>
              {categoriasDisponibles.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtro por Talles */}
        {tallesDisponibles.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5">Filtrar por talles</label>
            <div className="flex flex-wrap gap-1.5">
              {tallesDisponibles.map((talle) => {
                const activo = tallesSeleccionados.includes(talle);
                return (
                  <button
                    key={talle}
                    type="button"
                    onClick={() => toggleTalle(talle)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-custom border transition-colors cursor-pointer ${
                      activo ? "bg-accent text-bg-custom border-accent" : "bg-bg-custom text-text-secondary border-border hover:border-text-secondary"
                    }`}
                  >
                    {talle}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Barra inferior: Contador de resultados y reset */}
        {hayFiltrosActivos && (
          <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
            <span className="text-text-secondary">
              Mostrando {productosFiltrados.length} de {productos.length} productos
            </span>
            <button type="button" onClick={limpiarFiltros} className="text-accent hover:text-accent-hover font-semibold transition-colors cursor-pointer">
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* TABLA DE PRODUCTOS */}
      <div className="bg-bg-card rounded-custom border border-border shadow-sm overflow-hidden h-fit">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-secondary text-text-secondary border-b border-border text-sm">
                <th className="p-4 font-semibold">Producto</th>
                <th className="p-4 font-semibold">Precio</th>
                <th className="p-4 font-semibold">Categoría</th>
                <th className="p-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-text-secondary text-sm">
                    Cargando catálogo...
                  </td>
                </tr>
              ) : productos.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-text-secondary text-sm">
                    No hay productos todavía.
                  </td>
                </tr>
              ) : productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-text-secondary text-sm">
                    No se encontraron productos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((prod) => {
                  const portada = Array.isArray(prod.imgs) ? prod.imgs[0] : prod.imgs;
                  const cantidadFotos = Array.isArray(prod.imgs) ? prod.imgs.length : 1;

                  return (
                    <tr key={prod.id} className="border-b border-border hover:bg-bg-secondary/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3 min-w-[180px]">
                          <div className="relative shrink-0 w-12 h-12">
                            <img src={portada || "/placeholder.webp"} alt={prod.nombre} className="w-12 h-12 shrink-0 object-cover rounded-md border border-border bg-bg-custom" />
                            {cantidadFotos > 1 && <span className="absolute -bottom-1 -right-1 bg-text-primary text-bg-custom text-[9px] font-bold px-1 rounded-sm">+{cantidadFotos - 1}</span>}
                          </div>
                          <div className="min-w-0">
                            <p className="text-text-primary font-bold text-sm truncate">{prod.nombre}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {prod.destacado && <span className="inline-block text-[10px] bg-accent/10 text-accent font-bold px-2 py-0.5 rounded-full">Destacado</span>}
                              {Array.isArray(prod.talles) && prod.talles.length > 0 && <span className="text-[11px] text-text-secondary truncate">Talles: {prod.talles.join(", ")}</span>}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="text-accent font-bold text-sm">{prod.precio_contado}</p>
                      </td>

                      <td className="p-4">
                        <span className="text-text-primary text-sm bg-bg-secondary px-2 py-1 rounded-md border border-border">{prod.categoria}</span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => iniciarEdicion(prod)}
                            className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer text-sm font-semibold px-2 py-1 bg-bg-custom border border-border rounded-md"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarProducto(prod)}
                            className="text-text-primary hover:text-bg-custom hover:bg-accent transition-colors cursor-pointer text-sm font-semibold px-2 py-1 bg-bg-custom border border-border rounded-custom"
                          >
                            Borrar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
