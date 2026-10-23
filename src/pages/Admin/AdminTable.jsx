// Este componente renderiza puramente la tabla y sus tres estados visuales (cargando, vacía o con productos).

export default function AdminTable({ cargando, productos, iniciarEdicion, eliminarProducto }) {
  return (
    <div className="lg:col-span-2 bg-bg-card rounded-custom border border-border shadow-sm overflow-hidden h-fit">
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
                <td colSpan="4" className="text-center p-8 text-text-secondary">
                  Cargando catálogo...
                </td>
              </tr>
            ) : productos.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-8 text-text-secondary">
                  No hay productos todavía.
                </td>
              </tr>
            ) : (
              productos.map((prod) => {
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
                          {prod.destacado && <span className="inline-block text-[10px] bg-accent/10 text-accent font-bold px-2 py-0.5 rounded-full">Destacado</span>}
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
  );
}
