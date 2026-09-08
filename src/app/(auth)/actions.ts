"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "@/lib/validations/auth.schema";
import type { ActionState } from "@/types/actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Server Action para inicio de sesión
 */
export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validation = loginSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrige los errores del formulario",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validation.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message === "Invalid login credentials"
        ? "Credenciales incorrectas. Verifica tu correo y contraseña."
        : error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect("/links");
}

/**
 * Server Action para registro de usuario
 */
export async function signupAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const validation = registerSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Por favor corrige los errores del formulario",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validation.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  // Si Supabase no requiere confirmación de email y el usuario ya tiene sesión activa:
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/links");
  }

  return {
    success: true,
    message: "Registro exitoso. Por favor revisa tu correo electrónico para confirmar tu cuenta o inicia sesión.",
  };
}

/**
 * Server Action para cerrar sesión
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

