import { z } from "zod";

/**
 * Esquema de validación para inicio de sesión (Login)
 */
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "El correo electrónico es requerido" })
    .email({ message: "Formato de correo electrónico inválido" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

/**
 * Esquema de validación para registro (Register)
 */
export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, { message: "El correo electrónico es requerido" })
      .email({ message: "Formato de correo electrónico inválido" }),
    password: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
      .max(100, { message: "La contraseña es demasiado larga" }),
    confirmPassword: z
      .string()
      .min(6, { message: "La confirmación de contraseña es requerida" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;

