import { useNavigate } from "react-router-dom";
import { supabase } from "../../config";
import { toast } from "sonner";
import { Package, Store, MessageSquareQuote } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    toast.info("Sesión cerrada");
    navigate("/login");
  };

  const modulos = [
    {
      id: "stock",
      titulo: "Control de Stock",
      descripcion: "Gestiona los productos, imágenes, talles y precios de tu catálogo.",
      ruta: "/admin/stock",
      icono: <Package className="w-12 h-12 mb-4 text-text-secondary group-hover:text-accent transition-colors" strokeWidth={1.5} />,
    },
    {
      id: "local",
      titulo: "Información del Local",
      descripcion: "Actualiza el nombre, WhatsApp, Instagram, ubicación, descripción y horarios.",
      ruta: "/admin/local",
      icono: <Store className="w-12 h-12 mb-4 text-text-secondary group-hover:text-accent transition-colors" strokeWidth={1.5} />,
    },
    {
      id: "comentarios",
      titulo: "Comentarios y Reseñas",
      descripcion: "Administra, agrega o elimina las reseñas mostradas en la página de tu local.",
      ruta: "/admin/comentarios",
      icono: <MessageSquareQuote className="w-12 h-12 mb-4 text-text-secondary group-hover:text-accent transition-colors" strokeWidth={1.5} />,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-wide">Panel de Administración</h1>
          <p className="text-text-secondary text-sm mt-1">Selecciona el módulo que deseas gestionar</p>
        </div>
        <button
          onClick={cerrarSesion}
          className="bg-bg-card border border-border text-text-primary px-4 py-2 rounded-custom hover:border-accent hover:text-accent transition-colors cursor-pointer text-sm font-semibold"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Grid de Tarjetas */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {modulos.map((mod) => (
          <div
            key={mod.id}
            onClick={() => navigate(mod.ruta)}
            className="bg-bg-card border border-border rounded-custom p-8 flex flex-col items-center text-center hover:border-accent hover:shadow-[0_0_15px_rgba(204,255,0,0.05)] transition-all cursor-pointer group"
          >
            <div className="transform group-hover:scale-110 transition-transform duration-300">{mod.icono}</div>
            <h2 className="text-xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">{mod.titulo}</h2>
            <p className="text-text-secondary text-sm leading-relaxed">{mod.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
