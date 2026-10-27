// Este archivo se encarga de centralizar todos los estados, efectos y funciones (la lógica pesada) del apartado de Comentarios.

import { useState, useEffect } from "react";
import { supabase } from "../../../config";
import { toast } from "sonner";
import { getAuthenticatedLocalId } from "../adminUtils";

const ESTADO_INICIAL = {
  nombre: "",
  cant_estrellas: 5,
  comentario: "",
};

export function useComentarios() {
  const [localId, setLocalId] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    cargarResenas();
  }, []);

  const cargarResenas = async () => {
    setCargando(true);
    try {
      const { localId: id } = await getAuthenticatedLocalId();
      setLocalId(id);

      const { data: comentariosData } = await supabase.from("google_resenas").select("*").eq("local_id", id).order("created_at", { ascending: false });

      setResenas(comentariosData || []);
    } catch {
      // Si no hay sesión o local, el hook deja de cargar
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "cant_estrellas" ? Number(value) : value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!localId) return toast.error("No se pudo identificar el local.");

    setProcesando(true);
    const resenaAEnviar = { ...form, local_id: localId };

    if (editandoId) {
      const { error } = await supabase.from("google_resenas").update(resenaAEnviar).eq("id", editandoId);
      if (error) toast.error("Error al actualizar.");
      else toast.success("Reseña actualizada.");
    } else {
      const { error } = await supabase.from("google_resenas").insert([resenaAEnviar]);
      if (error) toast.error("Error al crear la reseña.");
      else toast.success("Reseña creada.");
    }

    setForm(ESTADO_INICIAL);
    setEditandoId(null);
    cargarResenas();
    setProcesando(false);
  };

  const iniciarEdicion = (resena) => {
    setForm({ nombre: resena.nombre, cant_estrellas: resena.cant_estrellas, comentario: resena.comentario });
    setEditandoId(resena.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicion = () => {
    setForm(ESTADO_INICIAL);
    setEditandoId(null);
  };

  const eliminarResena = async (id) => {
    toast("¿Eliminar esta reseña?", {
      action: {
        label: "Eliminar",
        onClick: async () => {
          const { error } = await supabase.from("google_resenas").delete().eq("id", id);
          if (error) toast.error("Error al eliminar.");
          else {
            toast.success("Reseña eliminada.");
            cargarResenas();
          }
        },
      },
      cancel: { label: "Cancelar" },
    });
  };

  return {
    resenas,
    cargando,
    procesando,
    form,
    editandoId,
    handleChange,
    manejarSubmit,
    iniciarEdicion,
    cancelarEdicion,
    eliminarResena,
  };
}
