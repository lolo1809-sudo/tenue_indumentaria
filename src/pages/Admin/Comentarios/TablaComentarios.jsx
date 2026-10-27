// Este componente renderiza puramente la tabla

import { Star } from "lucide-react";

export default function TablaComentarios({ cargando, resenas, iniciarEdicion, eliminarResena }) {
  return (
    <div className="lg:col-span-2 bg-bg-card rounded-custom border border-border shadow-sm overflow-hidden h-fit">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-secondary text-text-secondary border-b border-border text-sm">
              <th className="p-4 font-semibold">Cliente</th>
              <th className="p-4 font-semibold">Estrellas</th>
              <th className="p-4 font-semibold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="3" className="text-center p-8 text-text-secondary text-sm">
                  Cargando reseñas...
                </td>
              </tr>
            ) : resenas.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-8 text-text-secondary text-sm">
                  No hay reseñas todavía.
                </td>
              </tr>
            ) : (
              resenas.map((resena) => (
                <tr key={resena.id} className="border-b border-border hover:bg-bg-secondary/50 transition-colors">
                  <td className="p-4">
                    <p className="text-text-primary font-bold text-sm">{resena.nombre}</p>
                    <p className="text-text-secondary text-xs mt-1 max-w-xs truncate">{resena.comentario}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="text-accent font-bold text-sm">{resena.cant_estrellas}</span>
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => iniciarEdicion(resena)}
                        className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer text-sm font-semibold px-2 py-1 bg-bg-custom border border-border rounded-md"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarResena(resena.id)}
                        className="text-text-primary hover:text-bg-custom hover:bg-accent transition-colors cursor-pointer text-sm font-semibold px-2 py-1 bg-bg-custom border border-border rounded-custom"
                      >
                        Borrar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
