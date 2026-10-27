// Este es el archivo principal, que unifica los 3 componentes

import AdminLayout from "../AdminLayout";
import { useComentarios } from "./useComentarios";
import Formulario from "./FormularioComentarios";
import TablaComentarios from "./TablaComentarios";

export default function AdminComentarios() {
  const { resenas, cargando, procesando, form, editandoId, handleChange, manejarSubmit, iniciarEdicion, cancelarEdicion, eliminarResena } = useComentarios();

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Formulario form={form} editandoId={editandoId} procesando={procesando} handleChange={handleChange} manejarSubmit={manejarSubmit} cancelarEdicion={cancelarEdicion} />

        <TablaComentarios cargando={cargando} resenas={resenas} iniciarEdicion={iniciarEdicion} eliminarResena={eliminarResena} />
      </div>
    </AdminLayout>
  );
}
