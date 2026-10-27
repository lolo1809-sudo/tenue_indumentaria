// Este archivo se encarga de centralizar todos los estados, efectos y funciones (la lógica pesada) del apartado de Local.

import { useState, useEffect } from "react";
import { supabase } from "../../../config";
import { toast } from "sonner";
import { procesarLinkMaps } from "./procesarLinkMaps";
import { getAuthenticatedLocalId } from "../adminUtils";

export function useLocal() {
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [localId, setLocalId] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    whatsapp: "",
    instagram: "",
    ubicacion: "",
    descripcion: "",
    horarios_atencion: "",
  });

  useEffect(() => {
    cargarDatosDelLocal();
  }, []);

  const cargarDatosDelLocal = async () => {
    setCargando(true);
    try {
      const { localId: id } = await getAuthenticatedLocalId();

      const { data, error } = await supabase.from("locales").select("*").eq("id", id).single();

      if (error) {
        toast.error("Error al cargar la información del local.");
      } else if (data) {
        setLocalId(data.id);
        setForm({
          nombre: data.nombre || "",
          whatsapp: data.whatsapp || "",
          instagram: data.instagram || "",
          ubicacion: data.ubicacion || "",
          descripcion: data.descripcion || "",
          horarios_atencion: data.horarios_atencion || "",
        });
      }
    } catch {
      // Si no hay sesión o local, el hook deja de cargar
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (!localId) return toast.error("No se encontró el local para actualizar.");

    // Validamos el link de Google Maps si el usuario ingresó algo
    let urlMapsNormalizada = "";
    if (form.ubicacion) {
      const urlValida = procesarLinkMaps(form.ubicacion);
      if (!urlValida) {
        toast.error("El link del mapa no es válido. Debes usar la opción 'Insertar en un mapa' de Google Maps.");
        return;
      }
      urlMapsNormalizada = urlValida;
    }

    setProcesando(true);

    const datosAEnviar = {
      ...form,
      ubicacion: urlMapsNormalizada, // Se guarda siempre la URL limpia lista para el iframe
    };

    const { error } = await supabase.from("locales").update(datosAEnviar).eq("id", localId);

    if (error) {
      toast.error("Error al actualizar: " + error.message);
    } else {
      // Actualizamos el estado local con la URL limpia
      setForm((prev) => ({ ...prev, ubicacion: urlMapsNormalizada }));
      toast.success("Información del local actualizada correctamente.");
    }
    setProcesando(false);
  };

  return {
    cargando,
    procesando,
    form,
    handleChange,
    manejarSubmit,
  };
}
