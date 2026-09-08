import { z } from "zod";

/**
 * Esquema de validación para Enlaces (Links)
 * Cumple con OWASP A03: Anti-XSS y validación de protocolos seguros
 */
export const linkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { message: "El título debe tener al menos 2 caracteres" })
    .max(100, { message: "El título no puede exceder 100 caracteres" }),
  url: z
    .string()
    .trim()
    .min(5, { message: "La URL es requerida" })
    .max(500, { message: "La URL no puede exceder 500 caracteres" })
    .refine(
      (val) => {
        try {
          const parsed = new URL(val);
          // Solo protocolos HTTP y HTTPS permitidos (Anti-XSS contra javascript: y data:)
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      },
      { message: "Debe ingresar una URL válida que inicie con http:// o https://" }
    ),
  description: z
    .string()
    .trim()
    .max(500, { message: "La descripción no puede superar 500 caracteres" })
    .optional()
    .or(z.literal("")),
});

export type LinkSchemaType = z.infer<typeof linkSchema>;

