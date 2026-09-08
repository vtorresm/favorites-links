"use server";

import { createClient } from "@/lib/supabase/server";
import { linkSchema } from "@/lib/validations/link.schema";
import type { ActionState } from "@/types/actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Server Action para crear un nuevo enlace
 */
export async function createLinkAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    title: formData.get("title"),
    url: formData.get("url"),
    description: formData.get("description"),
  };

  const validation = linkSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrige los errores del formulario",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Debes iniciar sesión para realizar esta acción",
    };
  }

  const { title, url, description } = validation.data;

  const { error } = await supabase.from("links").insert({
    user_id: user.id,
    title,
    url,
    description: description || null,
  });

  if (error) {
    return {
      success: false,
      message: `Error al guardar el enlace: ${error.message}`,
    };
  }

  revalidatePath("/links");
  redirect("/links");
}

/**
 * Server Action para actualizar un enlace existente
 */
export async function updateLinkAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    title: formData.get("title"),
    url: formData.get("url"),
    description: formData.get("description"),
  };

  const validation = linkSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrige los errores del formulario",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Debes iniciar sesión para realizar esta acción",
    };
  }

  const { title, url, description } = validation.data;

  // Actualización protegida por RLS (auth.uid = user_id)
  const { error } = await supabase
    .from("links")
    .update({
      title,
      url,
      description: description || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return {
      success: false,
      message: `Error al actualizar el enlace: ${error.message}`,
    };
  }

  revalidatePath("/links");
  redirect("/links");
}

/**
 * Server Action para eliminar un enlace
 */
export async function deleteLinkAction(id: string): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "Debes iniciar sesión para realizar esta acción",
    };
  }

  // Eliminación protegida por RLS
  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return {
      success: false,
      message: `Error al eliminar el enlace: ${error.message}`,
    };
  }

  revalidatePath("/links");
  return {
    success: true,
    message: "Enlace eliminado correctamente",
  };
}

