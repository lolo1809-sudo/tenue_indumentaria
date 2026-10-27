// Este es el archivo principal, que unifica los 3 componentes

import { useCatalog } from "./useCatalog";
import Formulario from "./FormularioStock";
import TablaProductos from "./TablaProductos";
import AdminLayout from "../AdminLayout";

export default function AdminStock() {
  const {
    productos,
    cargando,
    procesando,
    form,
    editandoId,
    archivosSeleccionados,
    fileInputRef,
    handleChange,
    handleCategoriaChange,
    handleFilesChange,
    eliminarImagenExistente,
    manejarSubmit,
    iniciarEdicion,
    cancelarEdicion,
    eliminarProducto,
  } = useCatalog();

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <Formulario
          form={form}
          editandoId={editandoId}
          procesando={procesando}
          archivosSeleccionados={archivosSeleccionados}
          fileInputRef={fileInputRef}
          handleChange={handleChange}
          handleCategoriaChange={handleCategoriaChange}
          handleFilesChange={handleFilesChange}
          eliminarImagenExistente={eliminarImagenExistente}
          manejarSubmit={manejarSubmit}
          cancelarEdicion={cancelarEdicion}
        />

        {/* Tabla de Productos */}
        <TablaProductos cargando={cargando} productos={productos} iniciarEdicion={iniciarEdicion} eliminarProducto={eliminarProducto} />
      </div>
    </AdminLayout>
  );
}
