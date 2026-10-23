// Este es el archivo principal, que es un orquestador completamente limpio y fácil de leer.

import { useAdminCatalog } from "./useAdminCatalog";
import AdminForm from "./AdminForm";
import AdminTable from "./AdminTable";

export default function Admin() {
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
    cerrarSesion,
  } = useAdminCatalog();

  return (
    <div className="min-h-screen bg-bg-secondary p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-wide">Panel de Administración</h1>
          <p className="text-text-secondary text-sm">Gestiona tu catálogo</p>
        </div>
        <button
          onClick={cerrarSesion}
          className="bg-bg-card border border-border text-text-primary px-4 py-2 rounded-custom hover:border-accent hover:text-accent transition-colors cursor-pointer text-sm font-semibold"
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <AdminForm
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
        <AdminTable cargando={cargando} productos={productos} iniciarEdicion={iniciarEdicion} eliminarProducto={eliminarProducto} />
      </div>
    </div>
  );
}
