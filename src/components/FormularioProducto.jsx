import { useState } from "react";
import { toast } from "sonner";

export default function FormularioProducto({ onSubmit, onCancel }) {
  const [nombre, setNombre] = useState("");
  const [metodoEnvio, setMetodoEnvio] = useState("retiro");
  const [ubicacion, setUbicacion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!nombre.trim()) {
      toast.error("Por favor, ingresá tu nombre y apellido.");
      return;
    }

    if (metodoEnvio === "envio" && !ubicacion.trim()) {
      toast.error("Por favor, ingresá tu dirección para el envío.");
      return;
    }

    // Enviar datos al componente padre (CarritoProductos.jsx)
    onSubmit({
      nombre: nombre.trim(),
      metodoEnvio,
      ubicacion: ubicacion.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-bg-secondary p-6 md:p-8 rounded-custom border border-border">
      <h3 className="text-xl font-bold mb-6 text-text-primary">Datos de entrega</h3>

      {/* Nombre y Apellido */}
      <div className="mb-6">
        <label className="block text-text-secondary text-sm font-semibold uppercase mb-2">Nombre y Apellido *</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Juan Pérez"
          className="w-full bg-bg-custom border border-border text-text-primary p-3 rounded-custom focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Método de Entrega */}
      <div className="mb-6">
        <label className="block text-text-secondary text-sm font-semibold uppercase mb-3">Método de entrega *</label>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer p-3 border border-border rounded-custom bg-bg-custom hover:border-accent transition-colors">
            <input type="radio" name="metodo" value="retiro" checked={metodoEnvio === "retiro"} onChange={() => setMetodoEnvio("retiro")} className="w-5 h-5 accent-accent" />
            <span className="font-medium">Retiro en local</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer p-3 border border-border rounded-custom bg-bg-custom hover:border-accent transition-colors">
            <input type="radio" name="metodo" value="envio" checked={metodoEnvio === "envio"} onChange={() => setMetodoEnvio("envio")} className="w-5 h-5 accent-accent" />
            <span className="font-medium">Envío a domicilio</span>
          </label>
        </div>
      </div>

      {/* Ubicación (Condicional) */}
      {metodoEnvio === "envio" && (
        <div className="mb-6 animate-fade-in">
          <label className="block text-text-secondary text-sm font-semibold uppercase mb-2">Dirección *</label>
          <input
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            placeholder="Dirección Google Maps"
            className="w-full bg-bg-custom border border-border text-text-primary p-3 rounded-custom focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="w-1/3 bg-transparent border border-border text-text-secondary hover:text-text-primary hover:bg-border/50 font-semibold py-3 rounded-custom transition-colors cursor-pointer"
        >
          Volver
        </button>
        <button type="submit" className="w-2/3 bg-accent hover:bg-accent-hover text-bg-custom font-bold py-3 rounded-custom transition-colors cursor-pointer">
          Confirmar por WhatsApp
        </button>
      </div>
    </form>
  );
}
