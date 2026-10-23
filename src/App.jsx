import { useState, useEffect } from "react";
import { supabase } from "./config";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Componentes
import "./global.css";
import ScrollToTop from "./components/ScrollToTop";
import RutaProtegida from "./components/RutaProtegida";
import PantallaCarga from "./components/PantallaCarga";
import LayoutPublico from "./components/LayoutPublico";

// Páginas
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import CategoryPage from "./pages/CategoryPage";
import Admin from "./pages/Admin/Admin";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import CarritoProductos from "./pages/CarritoProductos";

export default function App() {
  const [local, setLocal] = useState(null);
  const [productos, setProductos] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatosDelLocal = async () => {
      setCargando(true);

      const currentHost = window.location.hostname.replace(/^www\./, "");

      // Consultas en paralelo para optimizar la carga
      // Traemos todos los datos tal que el slug del local sea igual al currentHost
      const [respLocal, respProductos, respResenas] = await Promise.all([
        // 1. Datos del local
        supabase.from("locales").select("id, slug, nombre, whatsapp, instagram, ubicacion, descripcion, horarios_atencion").eq("slug", currentHost).maybeSingle(),

        // 2. Productos asociados al local
        supabase
          .from("productos")
          .select(
            `
            *,
            locales!inner ( slug )
          `,
          )
          .eq("locales.slug", currentHost),

        // 3. Reseñas asociadas al local
        supabase
          .from("google_resenas")
          .select(
            `
            *,
            locales!inner ( slug )
          `,
          )
          .eq("locales.slug", currentHost),
      ]);

      if (!respLocal.error && respLocal.data) {
        setLocal(respLocal.data);
      }

      if (!respProductos.error) {
        setProductos(respProductos.data || []);
      }

      if (!respResenas.error) {
        setResenas(respResenas.data || []);
      }

      setCargando(false);
    };

    cargarDatosDelLocal();
  }, []);

  if (cargando) {
    return <PantallaCarga />;
  }

  return (
    <Router>
      <Toaster richColors position="top-right" theme="dark" />
      <ScrollToTop />
      <Routes>
        {/* Rutas de administrador (privadas), NO se muetra el Footer.jsx */}
        <Route path="/login" element={<Login />} />
        <Route element={<RutaProtegida />}>
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* Rutas públicas, se muestra el Footer.jsx */}
        <Route element={<LayoutPublico local={local} />}>
          <Route path="/" element={<Inicio productos={productos} resenas={resenas} local={local} />} />
          <Route path="/categorias/:categoria" element={<CategoryPage productos={productos} />} />
          <Route path="/producto/:id" element={<ProductDetail productos={productos} local={local} />} />
          <Route path="/carrito" element={<CarritoProductos local={local} />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
