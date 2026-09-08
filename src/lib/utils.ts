import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Función utilitaria para combinar clases de Tailwind CSS sin conflictos
 * @param inputs Clases condicionales o strings
 * @returns String de clases unificadas
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formatea una fecha ISO a formato local legible
 * @param dateString Fecha en formato ISO string
 * @returns Fecha formateada
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

