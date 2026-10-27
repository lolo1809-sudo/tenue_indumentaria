// Este archivo se encarga de centralizar todos los estados, efectos y funciones (la lógica pesada) del apartado de Stock.

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CATEGORIAS, supabase } from "../../../config";
import imageCompression from "browser-image-compression";
import { getAuthenticatedLocalId } from "../adminUtils";

const ESTADO_INICIAL = {
  nombre: "",
  categoria: "",
  categoria_slug: "",
  precio_contado: "",
  imgs: [],
  destacado: false,
  talles: "",
};

export function useCatalog() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesando, setProcesando] = useState(false);
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [archivosSeleccionados, setArchivosSeleccionados] = useState([]);
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    setCargando(true);
    try {
      const { localId } = await getAuthenticatedLocalId();

      const { data, error } = await supabase.from("productos").select("*").eq("local_id", localId).order("id", { ascending: false });

      if (error) throw error;
      setProductos(data || []);
    } catch (error) {
      toast.error("Error al cargar productos: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCategoriaChange = (e) => {
    const slugSeleccionado = e.target.value;
    const cat = CATEGORIAS.find((c) => c.slug === slugSeleccionado);
    setForm({
      ...form,
      categoria: cat ? cat.nombre : "",
      categoria_slug: slugSeleccionado,
    });
  };

  const handleFilesChange = (e) => {
    if (e.target.files) {
      setArchivosSeleccionados(Array.from(e.target.files));
    }
  };

  const eliminarImagenExistente = (urlAEliminar) => {
    setForm({
      ...form,
      imgs: form.imgs.filter((url) => url !== urlAEliminar),
    });
    // La agregamos a la lista de "pendientes por borrar del storage"
    setImagenesAEliminar((prev) => [...prev, urlAEliminar]);
  };

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);

    try {
      const { userId, localId } = await getAuthenticatedLocalId();

      let urlsFinales = Array.isArray(form.imgs) ? [...form.imgs] : [];

      if (archivosSeleccionados.length > 0) {
        for (const archivo of archivosSeleccionados) {
          const opcionesCompresion = {
            maxSizeMB: 0.12,
            maxWidthOrHeight: 850,
            useWebWorker: true,
            fileType: "image/webp",
          };

          let archivoComprimido = archivo;
          let nombreOriginalSinExtension = archivo.name.split(".")[0];

          try {
            archivoComprimido = await imageCompression(archivo, opcionesCompresion);
          } catch (errorCompresion) {
            console.error("Error al comprimir, se usará la original:", errorCompresion);
          }

          const nombreArchivo = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${nombreOriginalSinExtension}.webp`;

          const { error: errorUpload } = await supabase.storage.from("productos-imagenes").upload(nombreArchivo, archivoComprimido);
          if (errorUpload) throw errorUpload;

          const { data: urlData } = supabase.storage.from("productos-imagenes").getPublicUrl(nombreArchivo);
          urlsFinales.push(urlData.publicUrl);
        }
      }

      if (urlsFinales.length === 0) {
        toast.error("Debes agregar al menos una imagen para el producto");
        setProcesando(false);
        return;
      }

      const tallesArray = form.talles ? form.talles.split(",").map((t) => t.trim()) : [];

      const productoAEnviar = {
        ...form,
        imgs: urlsFinales,
        talles: tallesArray,
        user_id: userId,
        local_id: localId,
      };

      if (editandoId) {
        const { error } = await supabase.from("productos").update(productoAEnviar).eq("id", editandoId);
        if (error) throw error;

        if (imagenesAEliminar.length > 0) {
          const rutasAEliminar = imagenesAEliminar
            .map((url) => {
              const ruta = url.split("productos-imagenes/")[1];
              return ruta ? decodeURIComponent(ruta.split("?")[0]) : null;
            })
            .filter(Boolean);

          if (rutasAEliminar.length > 0) {
            const { error: errorStorage } = await supabase.storage.from("productos-imagenes").remove(rutasAEliminar);
            if (errorStorage) console.error("Error limpiando storage:", errorStorage);
          }
        }

        toast.success("Producto actualizado correctamente");
      } else {
        const { error } = await supabase.from("productos").insert([productoAEnviar]);
        if (error) throw error;
        toast.success("Producto creado correctamente");
      }

      setForm(ESTADO_INICIAL);
      setArchivosSeleccionados([]);
      setImagenesAEliminar([]);
      setEditandoId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      obtenerProductos();
    } catch (error) {
      toast.error("Error al guardar: " + error.message);
    } finally {
      setProcesando(false);
    }
  };

  const iniciarEdicion = (producto) => {
    setForm({
      ...producto,
      imgs: Array.isArray(producto.imgs) ? producto.imgs : [producto.imgs].filter(Boolean),
      talles: producto.talles ? producto.talles.join(", ") : "",
    });
    setArchivosSeleccionados([]);
    setImagenesAEliminar([]);
    setEditandoId(producto.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelarEdicion = () => {
    setForm(ESTADO_INICIAL);
    setEditandoId(null);
    setArchivosSeleccionados([]);
    setImagenesAEliminar([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const ejecutarEliminacion = async (producto) => {
    try {
      // 1. Borrar las imágenes del Storage (si tiene)
      if (producto.imgs && producto.imgs.length > 0) {
        // Extraemos solo la ruta del archivo de la URL pública
        // Ejemplo: cortamos la url en "productos-imagenes/" y nos quedamos con lo de la derecha (user_id/archivo.jpg)
        const rutasAEliminar = producto.imgs
          .map((url) => {
            const ruta = url.split("productos-imagenes/")[1];
            return ruta ? decodeURIComponent(ruta.split("?")[0]) : null;
          })
          .filter(Boolean);

        if (rutasAEliminar.length > 0) {
          const { error: errorStorage } = await supabase.storage.from("productos-imagenes").remove(rutasAEliminar);

          if (errorStorage) console.error("No se pudieron borrar algunas imágenes del storage:", errorStorage);
        }
      }

      // 2. Borrar el producto de la base de datos
      const { error } = await supabase.from("productos").delete().eq("id", producto.id);

      if (error) throw error;

      toast.success("Producto eliminado correctamente");
      obtenerProductos();
    } catch (error) {
      toast.error("Error al eliminar: " + error.message);
    }
  };

  const eliminarProducto = (producto) => {
    toast("¿Seguro que deseas eliminar este producto?", {
      duration: Infinity,
      action: {
        label: "Eliminar",
        onClick: () => ejecutarEliminacion(producto),
      },
      cancel: {
        label: "Cancelar",
      },
    });
  };

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    toast.info("Sesión cerrada");
    navigate("/login");
  };

  return {
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
  };
}
