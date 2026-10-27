// Interfaz reutilizable de los Admin

import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function AdminLayout({ children, maxWidth = "max-w-6xl" }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-secondary p-4 md:p-8">
      <div className={`${maxWidth} mx-auto`}>
        <button onClick={() => navigate("/admin")} className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-semibold mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Volver al Panel
        </button>
        {children}
      </div>
    </div>
  );
}
