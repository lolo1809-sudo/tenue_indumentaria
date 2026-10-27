// Funciones reutilizables en los archivos de Admin

import { supabase } from "../../config";

export async function getAuthenticatedLocalId() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) throw new Error("No hay una sesión activa.");

  const { data: localData, error: localError } = await supabase.from("locales").select("id").eq("user_id", user.id).single();

  if (localError || !localData) throw new Error("No se encontró un local asociado.");

  return { userId: user.id, localId: localData.id };
}
