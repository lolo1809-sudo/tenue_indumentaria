import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CATEGORIAS, supabase } from "../config";
import imageCompression from "browser-image-compression";

const ESTADO_INICIAL = {
  nombre: "",
  categoria: "",
  categoria_slug: "",
  precio_contado: "",
  imgs: [],
  destacado: false,
  talles: "",
};

export default function Admin() {
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

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setCargando(false);
      return;
    }

    const { data: localData, error: localError } = await supabase.from("locales").select("id").eq("user_id", user.id).single();

    if (localError || !localData) {
      toast.error("No se encontró un local asociado a este usuario.");
      setCargando(false);
      return;
    }

    const { data, error } = await supabase.from("productos").select("*").eq("local_id", localData.id).order("id", { ascending: false });

    if (error) {
      toast.error("Error al cargar productos: " + error.message);
    } else {
      setProductos(data || []);
    }
    setCargando(false);
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
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error("No hay una sesión activa.");

      const { data: localData, error: localError } = await supabase.from("locales").select("id").eq("user_id", user.id).single();

      if (localError || !localData) throw new Error("No se pudo identificar el local del usuario.");

      let urlsFinales = Array.isArray(form.imgs) ? [...form.imgs] : [];

      // Subimos las imágenes comprimiéndolas y en formato .webp
      if (archivosSeleccionados.length > 0) {
        for (const archivo of archivosSeleccionados) {
          // Configuramos la compresión
          const opcionesCompresion = {
            maxSizeMB: 0.15,
            maxWidthOrHeight: 1080,
            useWebWorker: true,
            fileType: "image/webp",
          };

          let archivoComprimido = archivo;
          let nombreOriginalSinExtension = archivo.name.split(".")[0];

          try {
            // Comprimimos la imagen
            archivoComprimido = await imageCompression(archivo, opcionesCompresion);
          } catch (errorCompresion) {
            console.error("Error al comprimir, se usará la original:", errorCompresion);
          }

          // Generamos el nombre asegurando la extensión .webp
          const nombreArchivo = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${nombreOriginalSinExtension}.webp`;

          // Subimos el archivo comprimido a Supabase
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
        user_id: user.id,
        local_id: localData.id,
      };

      if (editandoId) {
        // 1. Actualizamos en la base de datos
        const { error } = await supabase.from("productos").update(productoAEnviar).eq("id", editandoId);

        if (error) throw error;

        // 2. Borramos del Storage las imágenes que el usuario quitó
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

      // LIMPIEZA FINAL
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

      toast.success("Producto y sus imágenes eliminados");
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
        <div className="lg:col-span-1 bg-bg-card p-6 rounded-custom border border-border shadow-sm h-fit">
          <h2 className="text-xl font-bold text-text-primary mb-4">{editandoId ? "Editar Producto" : "Nuevo Producto"}</h2>
          <form onSubmit={manejarSubmit} className="flex flex-col gap-4 text-sm">
            <div>
              <label className="block text-text-secondary font-semibold mb-1">Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 outline-none focus:border-accent"
              />
            </div>

            {/* Selector de Categoría */}
            <div>
              <label className="block text-text-secondary font-semibold mb-1">Categoría</label>
              <select
                name="categoria_slug"
                value={form.categoria_slug}
                onChange={handleCategoriaChange}
                required
                className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 outline-none focus:border-accent cursor-pointer"
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Precio único */}
            <div>
              <label className="block text-text-secondary font-semibold mb-1">Precio Contado / Transferencia</label>
              <input
                name="precio_contado"
                value={form.precio_contado}
                onChange={handleChange}
                required
                placeholder="$70.500"
                className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 outline-none focus:border-accent"
              />
            </div>

            {/* Selector de Imágenes */}
            <div>
              <label className="block text-text-secondary font-semibold mb-1">Imágenes del Producto</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesChange}
                className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 outline-none focus:border-accent text-xs file:mr-4 file:py-1 file:px-3 file:rounded-custom file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-bg-custom hover:file:bg-accent-hover cursor-pointer"
              />

              {archivosSeleccionados.length > 0 && <p className="text-xs text-text-secondary mt-1">{archivosSeleccionados.length} nueva(s) imagen(es) seleccionada(s).</p>}

              {form.imgs && form.imgs.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-text-secondary mb-1">Imágenes actuales:</p>
                  <div className="flex flex-wrap gap-2">
                    {form.imgs.map((url, index) => (
                      <div key={index} className="relative group">
                        <img src={url} alt="preview" className="w-12 h-12 object-cover rounded-md border border-border" />
                        <button
                          type="button"
                          onClick={() => eliminarImagenExistente(url)}
                          className="absolute -top-1.5 -right-1.5 bg-accent text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-accent-hover cursor-pointer"
                          title="Quitar imagen"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-text-secondary font-semibold mb-1">Talles (separados por coma)</label>
              <input
                name="talles"
                value={form.talles}
                onChange={handleChange}
                placeholder="S, M, L, XL"
                className="w-full bg-bg-custom border border-border text-text-primary rounded-custom px-3 py-2 outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} id="destacado" className="w-4 h-4 accent-accent" />
              <label htmlFor="destacado" className="text-text-primary font-semibold cursor-pointer">
                ¿Producto destacado?
              </label>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                disabled={procesando}
                className="flex-1 bg-accent hover:bg-accent-hover text-bg-custom font-bold py-2.5 rounded-custom transition-colors cursor-pointer disabled:opacity-50"
              >
                {procesando ? "Subiendo imágenes..." : editandoId ? "Actualizar" : "Crear"}
              </button>

              {editandoId && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(ESTADO_INICIAL);
                    setEditandoId(null);
                    setArchivosSeleccionados([]);
                    setImagenesAEliminar([]);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="px-4 bg-bg-secondary text-text-primary font-semibold rounded-custom border border-border hover:bg-border transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Tabla de Productos */}
        <div className="lg:col-span-2 bg-bg-card rounded-custom border border-border shadow-sm overflow-hidden h-fit">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary text-text-secondary border-b border-border text-sm">
                  <th className="p-4 font-semibold">Producto</th>
                  <th className="p-4 font-semibold">Precio</th>
                  <th className="p-4 font-semibold">Categoría</th>
                  <th className="p-4 font-semibold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="4" className="text-center p-8 text-text-secondary">
                      Cargando catálogo...
                    </td>
                  </tr>
                ) : productos.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-8 text-text-secondary">
                      No hay productos todavía.
                    </td>
                  </tr>
                ) : (
                  productos.map((prod) => {
                    const portada = Array.isArray(prod.imgs) ? prod.imgs[0] : prod.imgs;
                    const cantidadFotos = Array.isArray(prod.imgs) ? prod.imgs.length : 1;

                    return (
                      <tr key={prod.id} className="border-b border-border hover:bg-bg-secondary/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3 min-w-[180px]">
                            <div className="relative shrink-0 w-12 h-12">
                              <img src={portada || "/placeholder.webp"} alt={prod.nombre} className="w-12 h-12 shrink-0 object-cover rounded-md border border-border bg-bg-custom" />
                              {cantidadFotos > 1 && <span className="absolute -bottom-1 -right-1 bg-text-primary text-bg-custom text-[9px] font-bold px-1 rounded-sm">+{cantidadFotos - 1}</span>}
                            </div>
                            <div className="min-w-0">
                              <p className="text-text-primary font-bold text-sm truncate">{prod.nombre}</p>
                              {prod.destacado && <span className="inline-block text-[10px] bg-accent/10 text-accent font-bold px-2 py-0.5 rounded-full">Destacado</span>}
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <p className="text-accent font-bold text-sm">{prod.precio_contado}</p>
                        </td>

                        <td className="p-4">
                          <span className="text-text-primary text-sm bg-bg-secondary px-2 py-1 rounded-md border border-border">{prod.categoria}</span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => iniciarEdicion(prod)}
                              className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer text-sm font-semibold px-2 py-1 bg-bg-custom border border-border rounded-md"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => eliminarProducto(prod)}
                              className="text-accent hover:text-white hover:bg-accent transition-colors cursor-pointer text-sm font-semibold px-2 py-1 bg-accent/10 border border-accent/20 rounded-md"
                            >
                              Borrar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
