// No se permite el registro ni la eliminación de cuenta, eso lo manejo yo en Supabase

import { useState, useEffect } from "react";
import { supabase } from "../config";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function obtenerSesion() {
      const { data } = await supabase.auth.getSession();
      setUsuarioActual(data?.session?.user ?? null);
    }
    obtenerSesion();
  }, []);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      toast.success("¡Bienvenido al panel!");
      navigate("/admin");
    } catch (err) {
      if (err.message === "Invalid login credentials") {
        toast.error("Correo o contraseña incorrectos.");
      } else {
        toast.error("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const cerrarSesion = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error al cerrar sesión: " + error.message);
    } else {
      setUsuarioActual(null);
      setEmail("");
      setPassword("");
      toast.info("Has cerrado sesión.");
    }
  };

  return (
    <>
      <title>Acceso Locales | Gestión de Catálogo</title>
      <meta name="description" content="Panel de administración de catálogo" />

      <div className="min-h-screen flex items-center justify-center bg-bg-secondary px-4">
        <div className="w-full max-w-md p-8 rounded-custom bg-bg-card border border-border shadow-sm">
          <h2 className="text-3xl font-bold text-text-primary mb-6 text-center">Panel de Gestión</h2>

          <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-4 py-2.5 outline-none focus:border-accent transition-colors"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-1">Contraseña</label>
              <div className="relative flex items-center">
                <input
                  type={mostrarPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg-custom border border-border text-text-primary rounded-custom pl-4 pr-11 py-2.5 outline-none focus:border-accent transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 text-text-secondary hover:text-text-primary transition-colors cursor-pointer p-1"
                  aria-label={mostrarPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {mostrarPassword ? (
                    /* Ojo tachado (ocultar) */
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  ) : (
                    /* Ojo abierto (mostrar) */
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold rounded-custom px-4 py-3 mt-4 bg-accent hover:bg-accent-hover text-bg-custom transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Procesando..." : "Ingresar al Panel"}
            </button>
          </form>

          {usuarioActual && (
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={cerrarSesion}
                className="w-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent hover:text-bg-custom font-semibold py-2.5 px-4 rounded-custom text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                {/* Icono de salida */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Cerrar Sesión ({usuarioActual.email})
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
